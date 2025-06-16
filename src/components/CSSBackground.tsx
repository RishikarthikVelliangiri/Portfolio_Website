import React from 'react';

const MinimalCSSBackground: React.FC = () => {
  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: '#111', // Dark background
        zIndex: -2 
      }} 
      aria-label="Minimal CSS Background" 
    />
  );
};

export default MinimalCSSBackground;
