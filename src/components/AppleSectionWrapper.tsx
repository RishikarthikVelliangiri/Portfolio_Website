
import React, { useEffect, useRef } from 'react';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
  scrollMultiplier?: number;
  initialOffset?: number;
}

/**
 * A wrapper for sections that adds Apple-like scroll effects
 * Each section gets subtle parallax and opacity effects based on scroll position
 */
const AppleSectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  id, 
  className = '', 
  style = {}, 
  scrollMultiplier = 1,
  initialOffset = 0
}) => {
  const { scrollY } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isInViewRef = useRef<boolean>(false);
  
  // Track whether this section has been viewed
  const hasViewedRef = useRef<boolean>(false);
    
  useEffect(() => {
    // Enhanced intersection observer that tracks both entry and visibility percentage
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update in-view state for performance optimization
          isInViewRef.current = entry.isIntersecting;
          
          // Reduced threshold - if section is even slightly visible (1% instead of 10%), mark as viewed
          if (entry.isIntersecting && entry.intersectionRatio > 0.01) {
            hasViewedRef.current = true;
            
            // Dispatch custom event when section comes into view
            const sectionEvent = new CustomEvent('sectionInView', { 
              detail: { 
                id, 
                ratio: entry.intersectionRatio,
                isEntering: true 
              }
            });
            document.dispatchEvent(sectionEvent);
          } else if (!entry.isIntersecting && hasViewedRef.current) {
            // Dispatch event when section leaves view
            const sectionEvent = new CustomEvent('sectionInView', { 
              detail: { 
                id, 
                ratio: 0,
                isEntering: false 
              }
            });
            document.dispatchEvent(sectionEvent);
          }
        });
      },
      { threshold: [0, 0.1, 0.5, 0.9], rootMargin: '10px' }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id]);
  
  // Custom scroll handler with improved performance
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
      
    if (!section || !content) return;    
    
    // Use request animation frame for smoother animations
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const applyTransforms = () => {
      // Skip if not in view and already processed once
      if (!isInViewRef.current && hasViewedRef.current) {
        ticking = false;
        return;
      }
      
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section is from the center of the viewport
      const distanceFromCenter = rect.top + rect.height / 2 - windowHeight / 2;
      
      // Normalize to a value between -1 and 1 based on section position
      const normalizedPosition = Math.min(Math.max(distanceFromCenter / (windowHeight / 1.5), -1), 1);
      
      // Calculate parallax effect with reduced intensity to prevent jarring
      const translateY = normalizedPosition * 15 * scrollMultiplier; // Reduced from 20 to 15
      
      // Much more subtle rotation for less disorienting effect
      const rotateX = normalizedPosition * -0.5; // Reduced from -1 to -0.5
      
      // Very subtle z-movement
      const perspective = 1000;
      const translateZ = normalizedPosition * -5; // Reduced from -10 to -5
      
      // Full opacity when in viewport
      let opacity = 1.0;
      
      // Calculate if section is visible in viewport
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      if (!isVisible) {
        // Only apply slight fade when out of viewport
        opacity = Math.max(0.9, 1 - Math.abs(normalizedPosition) * 0.1); // Reduced fade effect
      }
      
      // Calculate scale - even more subtle scaling (barely noticeable)
      const scaleFactor = 1 - Math.abs(normalizedPosition) * 0.01; // Reduced from 0.02 to 0.01
      
      // Apply transforms with reduced intensity and add hardware acceleration hints
      content.style.transform = `translateY(${translateY}px) perspective(${perspective}px) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scaleFactor})`;
      content.style.opacity = opacity.toString();
      
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        // Store current scroll position
        lastScrollY = window.scrollY;
        
        // Request animation frame to throttle updates
        animationRef.current = requestAnimationFrame(applyTransforms);
        ticking = true;
      }
    };
    
    // Use passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set positions
    applyTransforms();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Cancel any pending animation frame
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scrollMultiplier]);
  
  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className={`relative ${className}`}
      style={{
        ...style,
        overflowX: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Apply transform transition with reduced duration for more responsive feel */}
      <div 
        ref={contentRef} 
        className="section-content transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateY(${initialOffset}px)`,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden', // Reduce paint calculations
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default AppleSectionWrapper;
