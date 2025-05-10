
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface ScrollContextProps {
  scrollY: number;
  scrollDirection: 'up' | 'down';
  scrollProgress: number;
  viewportHeight: number;
  isScrolling: boolean;
}

const ScrollAnimationContext = createContext<ScrollContextProps>({
  scrollY: 0,
  scrollDirection: 'down',
  scrollProgress: 0,
  viewportHeight: 0,
  isScrolling: false
});

export const useScrollAnimation = () => useContext(ScrollAnimationContext);

export const ScrollAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
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
      setScrollProgress(currentScrollY / scrollableDistance);
      
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
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [previousScrollY]);
  
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
