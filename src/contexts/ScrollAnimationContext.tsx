
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

interface ScrollContextProps {
  scrollY: MotionValue<number>;
  scrollDirection: 'up' | 'down';
  scrollProgress: MotionValue<number>;
  viewportHeight: number;
  isScrolling: boolean;
}

const ScrollAnimationContext = createContext<ScrollContextProps>({
  scrollY: {} as MotionValue<number>,
  scrollDirection: 'down',
  scrollProgress: {} as MotionValue<number>,
  viewportHeight: 0,
  isScrolling: false
});

export const useScrollAnimation = () => useContext(ScrollAnimationContext);

export const ScrollAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticking = useRef(false);
  
  useEffect(() => {
    // Improved scroll handling with requestAnimationFrame for better performance
    const handleScroll = () => {
      // Use requestAnimationFrame to avoid excessive calculations
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Update real scroll position directly
          scrollY.set(currentScrollY);
          
          // Only update direction when there's a significant change to prevent jitter
          if (Math.abs(currentScrollY - previousScrollY) > 3) {
            setScrollDirection(currentScrollY > previousScrollY ? 'down' : 'up');
            setPreviousScrollY(currentScrollY);
          }
          
          // Calculate scroll progress (0 to 1) with more stable height calculations
          const docHeight = Math.max(
            document.body.scrollHeight, 
            document.body.offsetHeight, 
            document.documentElement.clientHeight, 
            document.documentElement.scrollHeight, 
            document.documentElement.offsetHeight
          );
          
          const windowHeight = window.innerHeight;
          const scrollableDistance = docHeight - windowHeight;
          
          // Prevent division by zero and ensure progress is between 0-1
          const currentProgress = scrollableDistance > 0 
            ? Math.max(0, Math.min(1, currentScrollY / scrollableDistance)) 
            : 0;
          
          // Update the progress MotionValue with a slight damping effect
          // to prevent jumps caused by dynamic content height changes
          const currentVal = scrollProgress.get();
          scrollProgress.set(currentVal + (currentProgress - currentVal) * 0.5);
          
          // Handle isScrolling state
          setIsScrolling(true);
          if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
          }
          
          scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
          }, 150); // Slightly shorter timeout
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };
    
    const handleResize = () => {
      // Debounce resize events
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        setViewportHeight(window.innerHeight);
        // Re-calculate scroll position after resize
        handleScroll();
      }, 100);
    };
    
    // Initial setup
    handleResize();
    handleScroll();
    
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [previousScrollY, scrollY, scrollProgress]);
  
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
