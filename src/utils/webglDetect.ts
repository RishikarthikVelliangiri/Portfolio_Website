/**
 * This script checks for WebGL compatibility before loading Three.js
 */

function checkWebGLCompatibility() {
  try {
    // Try to create a WebGL canvas
    const canvas = document.createElement('canvas');
    const contexts = ['webgl2', 'webgl', 'experimental-webgl'];
    
    let gl = null;
    // Try multiple context types
    for (const contextType of contexts) {
      gl = canvas.getContext(contextType, { failIfMajorPerformanceCaveat: true });
      if (gl) break;
    }
    
    if (!gl) {
      console.error('WebGL not supported');
      return {
        supported: false,
        reason: 'WebGL is not supported by this browser'
      };
    }
    
    // Get WebGL details
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    
    // Check for software rendering
    const isSoftwareRenderer = 
      renderer.indexOf('SwiftShader') >= 0 ||
      renderer.indexOf('Software') >= 0 ||
      renderer.indexOf('llvmpipe') >= 0;
    
    if (isSoftwareRenderer) {
      console.warn('WebGL is using software rendering:', renderer);
      return {
        supported: true,
        reason: 'Using software rendering',
        performance: 'low',
        renderer,
        vendor
      };
    }
    
    // Check for mobile GPU
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return {
      supported: true,
      performance: isMobile ? 'medium' : 'high',
      renderer,
      vendor
    };
    
  } catch (error) {
    console.error('Error checking WebGL support:', error);
    return {
      supported: false,
      reason: `Error: ${error.message}`
    };
  }
}

// Expose to window
window.checkWebGLCompatibility = checkWebGLCompatibility;

// Execute early and store result
window.__webglInfo = checkWebGLCompatibility();
console.log('WebGL compatibility check:', window.__webglInfo);

// Set a flag on document body
if (!window.__webglInfo.supported) {
  document.body.classList.add('webgl-not-supported');
} else if (window.__webglInfo.performance === 'low') {
  document.body.classList.add('webgl-low-performance');
}
