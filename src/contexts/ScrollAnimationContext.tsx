
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
  
  // Remove smooth scrolling effect to fix random scrolling issues
  
  useEffect(() => {
    // Simplified scroll handler without animation frames
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update real scroll position directly
      scrollY.set(currentScrollY);
      
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
      const currentProgress = scrollableDistance > 0 ? currentScrollY / scrollableDistance : 0;
      
      // Update the progress MotionValue
      scrollProgress.set(currentProgress);
      
      // Handle isScrolling state
      setIsScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    handleResize();
    handleScroll(); // Initial call
    
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
