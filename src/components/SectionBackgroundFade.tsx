
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SectionBackgroundFadeProps {
  from: string;   // CSS color string (hex, rgb, etc.)
  to: string;     // CSS color string (hex, rgb, etc.)
  position: 'top' | 'bottom';
  height?: number; // Height of the fade effect in pixels
  children?: React.ReactNode;
}

const SectionBackgroundFade: React.FC<SectionBackgroundFadeProps> = ({ 
  from, 
  to, 
  position, 
  height = 200,
  children 
}) => {
  const { scrollYProgress } = useScroll({
    offset: position === 'top' ? ["start end", "end start"] : ["end end", "start start"]
  });
  
  // Create a simpler gradient based on scroll position with only essential points
  // Reduced complexity to improve performance
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 1],  // Simplified input range
    [0, 1],  // Linear output range for better performance
  );
  
  return (
    <motion.div 
      className={`absolute left-0 right-0 z-0 pointer-events-none overflow-hidden
        ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      style={{ 
        height,
        willChange: 'opacity', // Performance hint
        backfaceVisibility: 'hidden' // Additional performance optimization
      }}
    >      
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: position === 'top' 
            ? `linear-gradient(to bottom, rgba(0,0,0,0), ${to})`
            : `linear-gradient(to top, rgba(0,0,0,0), ${to})`,
          opacity: backgroundOpacity,
        }}
      />
      
      {children}
    </motion.div>
  );
};

export default SectionBackgroundFade;
