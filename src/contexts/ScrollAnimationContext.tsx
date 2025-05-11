
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

export const ScrollAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use Framer Motion's useMotionValue to create proper MotionValue objects
  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);

  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update the MotionValue objects
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
      }, 150);
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
