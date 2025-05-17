import React, { useEffect, useRef } from 'react';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';
import { motion, useTransform } from 'framer-motion';

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
          // This ensures sections become visible sooner as users scroll
          if (entry.isIntersecting && entry.intersectionRatio > 0.01) {
            hasViewedRef.current = true;
            
            // Dispatch custom event when section comes into view
            // This helps coordinate with PersistentBackground3D
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
        });      },      { threshold: [0, 0.1, 0.5, 0.9] } // More threshold points for smoother transitions
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
  
  // Custom scroll handler for this section
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
      if (!section || !content) return;    
    
    // Scroll optimization variables
    let rafId: number | null = null;
    let lastScrollTime = 0;
    const scrollThrottleMs = 32; // 30fps cap - matches the ScrollAnimationContext
    
    const handleScroll = () => {
      // Skip animation frame if one is already pending
      if (rafId !== null) return;
      
      rafId = requestAnimationFrame(() => {
        const now = performance.now();
        if (now - lastScrollTime < scrollThrottleMs) {
          rafId = null;
          return;
        }
        lastScrollTime = now;
        
        // Only apply effects if section has been viewed
        if (!hasViewedRef.current) {
          rafId = null;
          return;
        }
      
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section is from the center of the viewport
      const distanceFromCenter = rect.top + rect.height / 2 - windowHeight / 2;
      
      // Normalize to a value between -1 and 1 based on section position
      const normalizedPosition = Math.min(Math.max(distanceFromCenter / (windowHeight / 1.5), -1), 1);
        // Calculate enhanced parallax effect with Apple-like perspective transformations
      const translateY = normalizedPosition * 30 * scrollMultiplier;
      
      // Add subtle rotate effect based on position - Apple's signature slight rotation
      const rotateX = normalizedPosition * -2; // Slight rotation for depth
      
      // Calculate perspective effect - gives depth as you scroll
      const perspective = 1000; // Higher values = subtler effect
      const translateZ = normalizedPosition * -15; // Subtle z-movement      // Modified opacity calculation: always fully visible when in view
      // Only fade when section is moving outside of viewport
      let opacity = 1.0; // Default to fully visible
      
      // Calculate if section is visible in viewport
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      // Only apply fade effect if section is moving out of viewport
      if (!isVisible) {
        const opacityFactor = 1 - Math.min(1, Math.max(0, Math.abs(normalizedPosition) - 0.5)) * 0.5;
        opacity = Math.max(0.7, opacityFactor);
      }
      
      // Calculate scale - slightly smaller when away from center (more subtle)
      const scaleFactor = 1 - Math.abs(normalizedPosition) * 0.03;
        // Apply Apple-style transforms with all effects combined
      content.style.transform = `translateY(${translateY}px) perspective(${perspective}px) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scaleFactor})`;
      content.style.opacity = opacity.toString();
      
      // Remove blur effect completely as requested
      content.style.filter = '';
      
      // Clear rafId to allow next frame
      rafId = null;
      });
    };    // Add the scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      // Enhanced cleanup that properly cancels any pending animations
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
        className="section-content transition-all duration-700 ease-out"
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
