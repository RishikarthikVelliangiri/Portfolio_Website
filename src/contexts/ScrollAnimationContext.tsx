
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
    // Minimal scroll handler with reduced functionality to prevent performance issues
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Just update the basic values
      scrollY.set(currentScrollY);
      
      // Only update direction for significant changes
      if (Math.abs(currentScrollY - previousScrollY) > 10) {
        setScrollDirection(currentScrollY > previousScrollY ? 'down' : 'up');
        setPreviousScrollY(currentScrollY);
      }
      
      // Set scroll progress (very simple calculation)
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = docHeight - windowHeight;
      
      if (scrollableDistance > 0) {
        const progress = currentScrollY / scrollableDistance;
        scrollProgress.set(progress);
      }
      
      // Set scrolling state with simple timeout
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 200);
    };
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    // Initial setup
    handleResize();
    handleScroll();
    
    // Use passive listener for better performance
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
