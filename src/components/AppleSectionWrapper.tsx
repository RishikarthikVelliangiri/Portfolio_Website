
import React, { useEffect, useRef } from 'react';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';
import { motion } from 'framer-motion';

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
  
  // Track whether this section has been viewed
  const hasViewedRef = useRef<boolean>(false);
    
  useEffect(() => {
    // Enhanced intersection observer that tracks both entry and visibility percentage
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
      { threshold: [0, 0.1, 0.5, 0.9] }
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
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      // Skip if we already have a pending animation frame
      if (rafId !== null) return;
      
      // Use requestAnimationFrame to throttle updates
      rafId = requestAnimationFrame(() => {
        // Only apply effects if section has been viewed
        if (hasViewedRef.current) {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calculate how far the section is from the center of the viewport
          const distanceFromCenter = rect.top + rect.height / 2 - windowHeight / 2;
          
          // Normalize to a value between -1 and 1 based on section position
          const normalizedPosition = Math.min(Math.max(distanceFromCenter / (windowHeight / 1.5), -1), 1);
          
          // Calculate parallax effect with reduced intensity
          const translateY = normalizedPosition * 20 * scrollMultiplier;
          
          // Reduced rotation effect
          const rotateX = normalizedPosition * -1;
          
          // Subtle z-movement
          const perspective = 1000;
          const translateZ = normalizedPosition * -10;
          
          // Full opacity when in viewport
          let opacity = 1.0;
          
          // Calculate if section is visible in viewport
          const isVisible = rect.top < windowHeight && rect.bottom > 0;
          
          if (!isVisible) {
            // Only apply slight fade when out of viewport
            opacity = Math.max(0.8, 1 - Math.abs(normalizedPosition) * 0.2);
          }
          
          // Calculate scale - slightly smaller when away from center (more subtle)
          const scaleFactor = 1 - Math.abs(normalizedPosition) * 0.02;
          
          // Apply transforms with reduced intensity
          content.style.transform = `translateY(${translateY}px) perspective(${perspective}px) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scaleFactor})`;
          content.style.opacity = opacity.toString();
          content.style.filter = '';
        }
        
        // Reset rafId so we can request another frame
        rafId = null;
        lastScrollY = window.scrollY;
      });
    };
    
    // Use passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set positions
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
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
      {/* Apply smooth transform transitions to the content */}
      <div 
        ref={contentRef} 
        className="section-content transition-all duration-500 ease-out"
        style={{ 
          transform: `translateY(${initialOffset}px)`,
          willChange: 'transform, opacity'
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default AppleSectionWrapper;
