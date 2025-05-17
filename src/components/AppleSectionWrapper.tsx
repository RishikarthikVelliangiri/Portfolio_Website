
import React, { useRef } from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
  scrollMultiplier?: number;
  initialOffset?: number;
}

/**
 * A wrapper for sections with simplified animations to prevent scroll issues
 */
const AppleSectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  id, 
  className = '', 
  style = {},
  initialOffset = 0
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className={`relative ${className}`}
      style={{
        ...style,
        overflowX: 'hidden'
      }}
    >
      <div 
        className="section-content"
        style={{ 
          transform: initialOffset ? `translateY(${initialOffset}px)` : 'none'
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default AppleSectionWrapper;
