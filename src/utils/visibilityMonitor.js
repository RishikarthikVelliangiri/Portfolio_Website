/**
 * Background Visibility Monitor
 * 
 * This script runs in the background and ensures that the 3D background stays visible at all times.
 * It's a defensive mechanism against CSS issues that might hide the background.
 */

(() => {
  let isInitialized = false;
  let monitorInterval = null;
    // Track errors globally
  if (typeof window.__backgroundErrorCount === 'undefined') {
    window.__backgroundErrorCount = 0;
  }
  
  // Ensure the background is visible with more robust selection
  function enforceVisibility() {
    try {
      const selectors = [
        '.simplified-background',
        '[data-background-3d="true"]',
        '[data-background="3d"]',
        '.fixed.simplified-background',
        'div.fixed.top-0.left-0.w-full.h-full.pointer-events-none'
      ];
      
      // Try to find any background element
      const backgroundElements = selectors
        .map(selector => Array.from(document.querySelectorAll(selector)))
        .flat()
        .filter(Boolean);
      
      if (backgroundElements.length === 0) {
        console.log("No background elements found, will retry");
        return;
      }
      
      backgroundElements.forEach(element => {
        // Force visibility and hardware acceleration on the container
        element.style.cssText += `
          visibility: visible !important; 
          opacity: 1 !important; 
          display: block !important;
          z-index: 0 !important;
          transform: translateZ(0) !important;
          -webkit-transform: translateZ(0) !important;
          will-change: transform !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
        `;
        
        // Force visibility on any canvas children
        const canvases = element.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          canvas.style.cssText += `
            visibility: visible !important; 
            opacity: 1 !important; 
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
          `;
        });
      });
    } catch (error) {
      console.error("Error in enforceVisibility:", error);
      window.__backgroundErrorCount++;
    }
  }
  
  // Initialize the monitor
  function initVisibilityMonitor() {
    if (isInitialized) return;
    
    // Run immediately once
    enforceVisibility();
    
    // Set up periodic checking (every 500ms)
    monitorInterval = setInterval(enforceVisibility, 500);
    
    // Also run on scroll events (throttled)
    let lastScrollTime = 0;
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > 100) {
        lastScrollTime = now;
        enforceVisibility();
      }
    }, { passive: true });
    
    // Also run when the DOM changes
    const observer = new MutationObserver(enforceVisibility);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'visibility', 'display', 'opacity']
    });
    
    isInitialized = true;
    console.log("Background visibility monitor initialized");
  }
    // Run when the DOM is fully loaded
  if (document.readyState === 'complete') {
    initVisibilityMonitor();
  } else {
    window.addEventListener('load', initVisibilityMonitor);
    document.addEventListener('DOMContentLoaded', initVisibilityMonitor);
  }
  
  // Also run as soon as possible with multiple retries
  if (document.body) {
    setTimeout(initVisibilityMonitor, 100);
    setTimeout(enforceVisibility, 500);
    setTimeout(enforceVisibility, 1000);
    setTimeout(enforceVisibility, 2000);
    setTimeout(enforceVisibility, 5000);
  }
  
  // Run when coming back to the page from another tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      enforceVisibility();
    }
  });
  
  // Expose to the global object for debugging and manual triggering
  window.checkBackgroundVisibility = enforceVisibility;
  window.forceBackgroundVisible = enforceVisibility;
})();
