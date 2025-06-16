import React, { useEffect, useState } from 'react';

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

const DebugPanel = () => {
  const [webGLInfo, setWebGLInfo] = useState<WebGLInfo | null>(null);
  const [renderErrors, setRenderErrors] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Get WebGL information from preload script or run check again
    const info = window.__webglInfo || 
      (window.checkWebGLCompatibility ? window.checkWebGLCompatibility() : null);
    
    setWebGLInfo(info);
    
    // Check for stored errors
    try {
      const storedErrors = localStorage.getItem('3d-render-failed');
      if (storedErrors) {
        setRenderErrors(storedErrors);
      }
    } catch (e) {
      console.error("Failed to read diagnostics:", e);
    }
  }, []);
  
  if (!webGLInfo) return null;
  
  return (
    <div
      className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs opacity-70 hover:opacity-100 transition-opacity"
      style={{ maxWidth: '300px', maxHeight: isExpanded ? '400px' : '40px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full text-left font-bold flex justify-between items-center"
      >
        <span>WebGL Debug {webGLInfo?.supported ? '✓' : '✗'}</span>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-xs overflow-auto" style={{ maxHeight: '350px' }}>
          <div>
            <strong>Support:</strong> {webGLInfo.supported ? 'Yes' : 'No'}
          </div>
          {webGLInfo.reason && (
            <div>
              <strong>Reason:</strong> {webGLInfo.reason}
            </div>
          )}
          {webGLInfo.performance && (
            <div>
              <strong>Performance:</strong> {webGLInfo.performance}
            </div>
          )}
          {webGLInfo.renderer && (
            <div>
              <strong>Renderer:</strong> {webGLInfo.renderer}
            </div>
          )}
          {webGLInfo.vendor && (
            <div>
              <strong>Vendor:</strong> {webGLInfo.vendor}
            </div>
          )}
          
          {renderErrors && (
            <div className="mt-2 border-t border-gray-700 pt-2">
              <strong>Past Render Errors:</strong>
              <pre className="mt-1 text-red-300 overflow-x-auto whitespace-pre-wrap">
                {renderErrors}
              </pre>
              <button 
                onClick={() => {
                  localStorage.removeItem('3d-render-failed');
                  setRenderErrors(null);
                }}
                className="mt-1 px-2 py-1 bg-red-800 text-white rounded text-xs"
              >
                Clear Error Log
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
