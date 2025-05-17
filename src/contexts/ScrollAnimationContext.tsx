
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

interface ScrollContextProps {
  scrollY: MotionValue<number>; // Explicitly type as MotionValue
  scrollDirection: 'up' | 'down';
  scrollProgress: MotionValue<number>; // Explicitly type as MotionValue
  viewportHeight: number;
  isScrolling: boolean;
}

const ScrollAnimationContext = createContext<ScrollContextProps>({
  scrollY: {} as MotionValue<number>, // Type assertion for initial empty value
  scrollDirection: 'down',
  scrollProgress: {} as MotionValue<number>, // Type assertion for initial empty value
  viewportHeight: 0,
  isScrolling: false
});

export const useScrollAnimation = () => useContext(ScrollAnimationContext);

export const ScrollAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  // Use Framer Motion's useMotionValue to create proper MotionValue objects
  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  
  // Use a ref for target scroll Y to enable smooth scrolling
  const targetScrollY = useRef(0);
  const requestIdRef = useRef<number | null>(null);
    // Smooth scrolling effect
  const smoothScrollEffect = useRef(() => {
    // Get current scroll position
    const currentY = scrollY.get();
    // Calculate distance to target
    const diff = targetScrollY.current - currentY;
    // Apply easing - adjust the divisor for smoothness (higher = smoother but slower)
    const speed = Math.abs(diff) < 1 ? diff : diff / 15;
    
    if (Math.abs(diff) > 0.5) {
      // Update scroll position with easing
      scrollY.set(currentY + speed);
      requestIdRef.current = requestAnimationFrame(smoothScrollEffect.current);
    } else {
      // Snap to exact position when very close
      scrollY.set(targetScrollY.current);
      requestIdRef.current = null;
    }
  });
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);  useEffect(() => {
    // Use the smooth scroll animation
    if (requestIdRef.current === null) {
      requestIdRef.current = requestAnimationFrame(smoothScrollEffect.current);
    }
    
    // Track last scroll event time to prevent too many updates
    let lastScrollTime = 0;
    const scrollThrottleMs = 32; // 30fps cap - helps prevent duplicate scrollbars
    let rafPending = false;
    
    const handleScroll = () => {
      // Avoid too many rAF calls
      if (rafPending) return;
      
      rafPending = true;
      
      requestAnimationFrame(() => {
        // Throttle scroll events
        const now = performance.now();
        if (now - lastScrollTime < scrollThrottleMs) {
          rafPending = false;
          return;
        }
        lastScrollTime = now;
        
        const currentScrollY = window.scrollY;
      
      // Update target for smooth scrolling
      targetScrollY.current = currentScrollY;
      
      // Start animation if not running
      if (requestIdRef.current === null) {
        requestIdRef.current = requestAnimationFrame(smoothScrollEffect.current);
      }
      
      // Update direction
      setScrollDirection(currentScrollY > previousScrollY ? 'down' : 'up');
      setPreviousScrollY(currentScrollY);
      
      // Calculate scroll progress (0 to 1)
      const docHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const scrollableDistance = docHeight - windowHeight;
      const currentProgress = currentScrollY / scrollableDistance;
      
      // Update the progress MotionValue
      scrollProgress.set(currentProgress);
      
      // Handle isScrolling state
      setIsScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
        scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200); // Longer timeout for better debouncing
      
      rafPending = false;
      });
    };
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    handleResize();
    handleScroll(); // Initial call
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      // Clean up animations
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [previousScrollY, scrollY, scrollProgress]); // Added dependencies
  
  return (
    <ScrollAnimationContext.Provider value={{
      scrollY,
      scrollDirection,
      scrollProgress,
      viewportHeight,
      isScrolling
    }}>
      {children}
    </ScrollAnimationContext.Provider>
  );
};
