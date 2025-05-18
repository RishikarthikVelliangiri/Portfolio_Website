
import React from 'react';

interface SectionBackgroundFadeProps {
  from: string;
  to: string;
  position: 'top' | 'bottom';
  height?: number;
  children?: React.ReactNode;
}

const SectionBackgroundFade: React.FC<SectionBackgroundFadeProps> = ({ 
  from,
  to, 
  position, 
  height = 200,
  children 
}) => {
  return (
    <div 
      className={`absolute left-0 right-0 z-0 pointer-events-none overflow-hidden
        ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      style={{ height }}
    >      
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: position === 'top' 
            ? `linear-gradient(to bottom, ${from || 'rgba(0,0,0,0)'}, ${to})`
            : `linear-gradient(to top, ${from || 'rgba(0,0,0,0)'}, ${to})`,
        }}
      />
      
      {children}
    </div>
  );
};

export default SectionBackgroundFade;
