
import React, { useEffect, useState } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [overSpline, setOverSpline] = useState(false);
  const [interactionStrength, setInteractionStrength] = useState(0);
  
  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
    };
    
    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if we're over a spline element
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element.tagName.toLowerCase() === 'spline-viewer') {
        setOverSpline(true);
        
        // Calculate interaction strength based on mouse movement speed
        const now = Date.now();
        if (prevTime && prevPosition) {
          const dt = now - prevTime;
          const dx = e.clientX - prevPosition.x;
          const dy = e.clientY - prevPosition.y;
          const speed = Math.sqrt(dx * dx + dy * dy) / dt;
          setInteractionStrength(Math.min(1, speed * 10));
        }
        prevTime = now;
        prevPosition = { x: e.clientX, y: e.clientY };
      } else {
        setOverSpline(false);
        setInteractionStrength(0);
      }
    };
    
    const onMouseEnter = () => {
      setHidden(false);
    };
    
    const onMouseLeave = () => {
      setHidden(true);
    };
    
    const onMouseDown = () => {
      setClicked(true);
    };
    
    const onMouseUp = () => {
      setClicked(false);
    };
    
    // Check for touch device
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0));
    };
    
    let prevPosition: { x: number, y: number } | null = null;
    let prevTime: number | null = null;
    
    if (!isTouchDevice()) {
      addEventListeners();
      
      // Track hover on links and buttons
      const handleLinkHoverOn = () => setLinkHovered(true);
      const handleLinkHoverOff = () => setLinkHovered(false);
      
      const links = document.querySelectorAll('a, button');
      links.forEach(link => {
        link.addEventListener('mouseenter', handleLinkHoverOn);
        link.addEventListener('mouseleave', handleLinkHoverOff);
      });
      
      return () => {
        removeEventListeners();
        links.forEach(link => {
          link.removeEventListener('mouseenter', handleLinkHoverOn);
          link.removeEventListener('mouseleave', handleLinkHoverOff);
        });
      };
    }
  }, []);
  
  // Don't render the custom cursor on touch devices
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) {
    return null;
  }
  
  const glowSize = overSpline ? 20 + interactionStrength * 30 : 0;
  const cursorScale = overSpline ? 1.5 + interactionStrength * 0.5 : clicked ? 0.75 : linkHovered ? 1.5 : 1;
  
  return (
    <>
      <div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 transition-all duration-300 mix-blend-difference ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${cursorScale})`,
          border: overSpline 
            ? `1px solid rgba(67, 97, 238, ${0.8 + interactionStrength * 0.2})`
            : '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: overSpline 
            ? `0 0 ${glowSize}px rgba(67, 97, 238, 0.5), 0 0 ${glowSize * 2}px rgba(67, 97, 238, 0.3)` 
            : 'none',
          transition: 'transform 0.2s ease-out, border 0.3s ease, box-shadow 0.3s ease'
        }}
      />
      <div
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 transition-all duration-200 ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          backgroundColor: overSpline 
            ? `rgba(67, 97, 238, ${0.8 + interactionStrength * 0.2})` 
            : 'white',
        }}
      />
    </>
  );
};

export default Cursor;
