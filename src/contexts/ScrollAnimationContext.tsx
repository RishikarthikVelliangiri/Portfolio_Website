
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
  
  useEffect(() => {
    // Simplified scroll handling to prevent performance issues
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update real scroll position
      scrollY.set(currentScrollY);
      
      // Only update direction with significant change
      if (Math.abs(currentScrollY - previousScrollY) > 5) {
        setScrollDirection(currentScrollY > previousScrollY ? 'down' : 'up');
        setPreviousScrollY(currentScrollY);
      }
      
      // Simpler progress calculation
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = docHeight - windowHeight;
      
      if (scrollableDistance > 0) {
        const progress = Math.max(0, Math.min(1, currentScrollY / scrollableDistance));
        scrollProgress.set(progress);
      }
      
      // Simple scrolling state
      setIsScrolling(true);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      handleScroll();
    };
    
    // Initial setup
    handleResize();
    
    // Use passive event listeners for better performance
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
