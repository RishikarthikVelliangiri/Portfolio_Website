
import React, { useEffect, useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: position === 'top' ? ["start end", "end start"] : ["end end", "start start"]
  });
  
  // Create a gradient based on scroll position
  // We use a non-linear easing to make the transition feel more natural
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],  // Input range
    [0, 0.5, 1],  // Output range
  );
  
  // Create particle effects
  const particleCount = 20;
  const particles = Array.from({ length: particleCount });
  
  return (
    <motion.div 
      ref={ref}
      className={`absolute left-0 right-0 z-0 pointer-events-none overflow-hidden
        ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      style={{ height }}
    >
      {/* Base gradient fade */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: position === 'top' 
            ? `linear-gradient(to bottom, ${from}, ${to})`
            : `linear-gradient(to top, ${from}, ${to})`,
          opacity: backgroundOpacity
        }}
      />
      
      {/* Particles */}
      {particles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 rounded-full bg-blue-500/30 blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: position === 'top' ? [0, 20] : [0, -20],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Energy wisps */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`wisp-${i}`}
          className="absolute h-20 left-0 w-full opacity-20"
          style={{
            top: position === 'top' ? '50%' : undefined,
            bottom: position === 'bottom' ? '50%' : undefined,
            background: 'linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)'
          }}
          animate={{
            x: ['-100%', '100%'],
            width: ['10%', '50%', '10%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {children}
    </motion.div>
  );
};

export default SectionBackgroundFade;
