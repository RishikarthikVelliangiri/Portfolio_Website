import React, { useState, useEffect } from 'react';
import SimplifiedBackground3D from './SimplifiedBackground3D';
import FallbackBackground3D from './FallbackBackground3D';
import CSSBackground from './CSSBackground';
import ErrorBoundary from './ErrorBoundary';

// Define the interface for WebGL information
interface WebGLInfo {
  supported: boolean;
  performance?: 'low' | 'medium' | 'high';
  reason?: string;
  renderer?: string;
  vendor?: string;
}

// Declare global window properties
declare global {
  interface Window {
    __webglInfo: WebGLInfo;
    checkWebGLCompatibility: () => WebGLInfo;
  }
}

const PersistentBackground3D = () => {
  const [renderAttempt, setRenderAttempt] = useState<number>(0);
  const [renderFailed, setRenderFailed] = useState<boolean>(false);
  const [webGLInfo, setWebGLInfo] = useState<WebGLInfo | null>(null);
  
  useEffect(() => {
    // Get WebGL information from preload script or run check again
    const info = window.__webglInfo || 
      (window.checkWebGLCompatibility ? window.checkWebGLCompatibility() : null);
    
    setWebGLInfo(info);
    console.log("WebGL compatibility info:", info);
    
    // Skip 3D rendering completely if WebGL isn't supported
    if (info && !info.supported) {
      console.log("WebGL not supported, using CSS fallback immediately");
      setRenderFailed(true);
    }
    
    // Skip advanced rendering if performance is low
    if (info && info.performance === 'low') {
      console.log("WebGL performance is low, using simple fallback immediately");
      setRenderAttempt(1);
    }
  }, []);
  
  useEffect(() => {
    // If we've hit a render error, log detailed environment info
    if (renderFailed) {
      console.error("Background rendering failed, environment info:");
      console.log("User Agent:", navigator.userAgent);
      console.log("Device:", navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop");
      console.log("Window Dimensions:", window.innerWidth, "x", window.innerHeight);
      console.log("WebGL Info:", webGLInfo || "Not available");
      
      // Log render attempt sequence
      console.log("Render attempts:", renderAttempt);
      
      // Save rendering failure to localStorage for diagnostics
      try {
        localStorage.setItem('3d-render-failed', JSON.stringify({
          timestamp: new Date().toISOString(),
          webGLInfo,
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`
        }));
      } catch (e) {
        console.error("Failed to save diagnostics:", e);
      }
    }
  }, [renderFailed, webGLInfo, renderAttempt]);
  
  // Handle errors in the 3D component
  const handleRenderError = () => {
    console.log("Render attempt failed, current attempt:", renderAttempt);
    setRenderAttempt(prev => prev + 1);
    if (renderAttempt >= 1) {
      setRenderFailed(true);
    }
  };
  
  // Choose appropriate renderer based on WebGL support and render attempts
  if (renderFailed || (webGLInfo && !webGLInfo.supported)) {
    console.log("Using CSS fallback background");
    return <CSSBackground />;
  }
  
  if (renderAttempt === 1 || (webGLInfo && webGLInfo.performance === 'low')) {
    console.log("Using simple fallback background");
    return <FallbackBackground3D />;
  }
  
  return (
    <ErrorBoundary 
      fallback={<div className="hidden" />}
      onError={handleRenderError}
    >
      <SimplifiedBackground3D onError={handleRenderError} />
    </ErrorBoundary>
  );
};

export default PersistentBackground3D;
