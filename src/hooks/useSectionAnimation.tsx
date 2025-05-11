
import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';
import { useInView, useMotionValue, MotionValue } from 'framer-motion';

interface SectionAnimationOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
  duration?: number;
}

export const useSectionAnimation = (options: SectionAnimationOptions = {}) => {
  const { 
    threshold = 0.2, 
    once = false,
    rootMargin = "0px",
    duration = 1
  } = options;
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScrollAnimation();
  const [progress, setProgress] = useState(0);
  const [inViewport, setInViewport] = useState(false);
  
  // Create a motion value to track progress
  const progressMotion = useMotionValue(0);
  
  // Correctly use the useInView hook without the margin property
  // The rootMargin string format is not directly compatible with framer-motion's margin
  const isInView = useInView(sectionRef, { 
    once, 
    amount: threshold
    // Removing the margin property as it's causing the type error
  });
  
  useEffect(() => {
    setInViewport(isInView);
  }, [isInView]);
  
  useEffect(() => {
    const calculateProgress = () => {
      if (!sectionRef.current || !inViewport) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress as the section moves through the viewport
      const relativePosition = (window.scrollY + viewportHeight - sectionTop) / (sectionHeight + viewportHeight);
      const clampedProgress = Math.max(0, Math.min(1, relativePosition));
      
      setProgress(clampedProgress);
      progressMotion.set(clampedProgress);
    };
    
    calculateProgress();
  }, [scrollY, inViewport, progressMotion]);
  
  return { 
    ref: sectionRef, 
    progress: progressMotion,
    inView: inViewport 
  };
};
