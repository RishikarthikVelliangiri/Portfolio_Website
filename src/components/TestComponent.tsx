import React, { useRef, useEffect, useState } from 'react';

interface TestComponentProps {
  parentRef: React.RefObject<HTMLElement>;
}

const TestComponent: React.FC<TestComponentProps> = ({ parentRef }) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (!parentRef?.current) return;

    const element = parentRef.current;
    console.log("Element:", element);
    
    return () => {
      console.log("Cleanup");
    };
  }, [parentRef]);

  return (
    <div>Test</div>
  );
};

export default React.memo(TestComponent);
