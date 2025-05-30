
import React from 'react';
import { motion, useTransform, useScroll, MotionValue } from 'framer-motion';

interface SectionTransitionProps {
  startColor?: string;
  endColor?: string;
  position?: 'top' | 'bottom' | 'both';
  height?: number | string;
  intensity?: number;
  blur?: boolean;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({
  startColor = 'rgba(0,0,0,0)',
  endColor = 'rgba(0,0,0,1)',
  position = 'bottom',
  height = 150,
  intensity = 1,
  blur = false
}) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, intensity * 0.5, intensity]
  );

  if (position === 'both') {
    return (
      <>
        <SectionTransition 
          startColor={startColor}
          endColor={endColor}
          position="top"
          height={height}
          intensity={intensity}
          blur={blur}
        />
        <SectionTransition 
          startColor={startColor}
          endColor={endColor}
          position="bottom"
          height={height}
          intensity={intensity}
          blur={blur}
        />
      </>
    );
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: typeof height === 'number' ? `${height}px` : height,
        [position]: 0,
        background: position === 'top' 
          ? `linear-gradient(to bottom, ${endColor}, ${startColor})`
          : `linear-gradient(to top, ${endColor}, ${startColor})`,
        opacity,
        pointerEvents: 'none',
        zIndex: 5,
        backdropFilter: blur ? 'blur(8px)' : 'none'
      }}
    />
  );
};

export default SectionTransition;
