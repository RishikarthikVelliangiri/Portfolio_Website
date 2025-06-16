// Global type definitions
declare global {
  interface Window {
    __webglInfo: {
      supported: boolean;
      performance?: 'low' | 'medium' | 'high';
      reason?: string;
      renderer?: string;
      vendor?: string;
    };
    checkWebGLCompatibility: () => Window['__webglInfo'];
    checkBackgroundVisibility: () => void;
  }
}

export {};
