
import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';
import { useInView, useMotionValue } from 'framer-motion';

interface SectionAnimationOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;  // Changed from MarginType to string
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
  
  // Use proper type for margin
  const isInView = useInView(sectionRef, { 
    once, 
    amount: threshold,
    margin: rootMargin
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
      // 0 = section just entered viewport bottom
      // 0.5 = section is centered in viewport
      // 1 = section is about to leave viewport top
      const relativePosition = (window.scrollY + viewportHeight - sectionTop) / (sectionHeight + viewportHeight);
      const clampedProgress = Math.max(0, Math.min(1, relativePosition));
      
      setProgress(clampedProgress);
      progressMotion.set(clampedProgress); // Update motion value
    };
    
    calculateProgress();
  }, [scrollY, inViewport, progressMotion]);
  
  return { 
    ref: sectionRef, 
    progress: progressMotion, // Return the motion value instead of primitive number
    inView: inViewport 
  };
};
