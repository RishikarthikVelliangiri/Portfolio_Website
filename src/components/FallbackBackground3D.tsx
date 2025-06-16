import React, { useEffect } from 'react';

interface FallbackBackground3DProps {
  onError?: () => void;
}

const FallbackBackground3D: React.FC<FallbackBackground3DProps> = ({ onError }) => {
  useEffect(() => {
    // Simulate a potential issue or just log that this fallback is used
    console.log("FallbackBackground3D is active.");
    // if (/* some condition for error */ false && onError) {
    //   onError();
    // }
  }, [onError]);

  return (
    <div 
      className="fixed inset-0 z-[-1]"
      style={{
        background: 'linear-gradient(to bottom, #111111, #000000)',
        // A very simple, dark gradient as a fallback 3D placeholder
      }}
      aria-label="Fallback 3D Background"
    />
  );
};

export default FallbackBackground3D;
