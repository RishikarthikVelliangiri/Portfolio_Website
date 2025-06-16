import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import FallbackBackground3D from './FallbackBackground3D';

interface SimplifiedBackground3DProps {
  onError?: () => void;
}

const SimplifiedBackground3D = ({ onError }: SimplifiedBackground3DProps = {}) => {
  console.log("SimplifiedBackground3D component rendering");
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const frameIdRef = useRef<number | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const activeRef = useRef<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) {
      console.error("Container ref is null");
      return;
    }
    
    console.log("Initializing SimplifiedBackground3D with container:", containerRef.current);

    // Check if WebGL is supported
    try {
      console.log("Checking WebGL support...");
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error("WebGL not supported by this browser");
        setWebGLFailed(true);
        setErrorMessage("WebGL not supported by this browser");
        if (onError) onError();
        return;
      }
      console.log("WebGL is supported!");
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setWebGLFailed(true);
      setErrorMessage("Error checking WebGL support: " + String(e));
      if (onError) onError();
      return;
    }

    try {
      console.log("Starting THREE.js scene setup");
      
      // Setup scene - simplified
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Setup camera - simplified
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        500
      );
      camera.position.z = 15;
      cameraRef.current = camera;

      // Setup renderer with error handling - low performance settings
      try {
        console.log("Creating WebGL renderer with low performance settings...");
        const renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: 'default',
          canvas: document.createElement('canvas'),
          stencil: false,
          depth: false,
          preserveDrawingBuffer: false
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1); // Force lowest pixel ratio for better performance
        renderer.setClearColor(0x000000, 0);
        renderer.autoClear = true;
        
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.zIndex = '0';
        
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;
      } catch (error) {
        console.error("Failed to create WebGL renderer:", error);
        setWebGLFailed(true);
        setErrorMessage("Renderer error: " + String(error));
        if (onError) onError();
        return;
      }
      
      // Create far fewer particles for better performance
      const createMinimalParticleSystem = (count: number, size: number, depth: number, color: THREE.Color) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
          vertices[i] = (Math.random() - 0.5) * 20;
          vertices[i + 1] = (Math.random() - 0.5) * 20;
          vertices[i + 2] = depth + (Math.random() - 0.5) * 5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        // Use basic material instead of shader for performance
        const material = new THREE.PointsMaterial({
          size: size,
          color: color,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true
        });
        
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current.push(particles);
        
        return particles;
      };
      
      // Create minimal particle systems
      createMinimalParticleSystem(150, 0.15, -10, new THREE.Color(0x3f51b5));
      createMinimalParticleSystem(100, 0.18, 0, new THREE.Color(0x9c27b0));
      createMinimalParticleSystem(50, 0.2, 10, new THREE.Color(0xe91e63));

      // Throttled animation loop for better performance
      let lastTime = 0;
      const targetFPS = 20; // Very low FPS for better performance
      const interval = 1000 / targetFPS;
      
      const animate = (timestamp = 0) => {
        if (!activeRef.current) return;
        
        // Throttle frame rate
        const elapsed = timestamp - lastTime;
        if (elapsed >= interval || lastTime === 0) {
          lastTime = timestamp - (elapsed % interval);
          
          const time = Date.now() * 0.0002; // Slower animation
          
          // Simple rotation, no complex calculations
          particlesRef.current.forEach((particles, i) => {
            particles.rotation.y = time * (0.05 - i * 0.01);
          });
          
          // Render only if the element is visible
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
        }
        
        frameIdRef.current = requestAnimationFrame(animate);
      };

      // Handle window resize efficiently with debounce
      let resizeTimeout: number | null = null;
      const handleResize = () => {
        if (resizeTimeout) {
          window.clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = window.setTimeout(() => {
          if (cameraRef.current && rendererRef.current) {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
          }
        }, 250); // 250ms debounce
      };

      // Simple mouse tracking
      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      // Add event listeners
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      
      // Visibility detection to pause animation when tab is hidden
      document.addEventListener('visibilitychange', () => {
        activeRef.current = document.visibilityState === 'visible';
      });

      // Start animation
      animate();

      // Cleanup function
      return () => {
        activeRef.current = false;
        
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
        
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        
        // Dispose resources
        particlesRef.current.forEach(particles => {
          if (particles.geometry) particles.geometry.dispose();
          if (particles.material) {
            if (Array.isArray(particles.material)) {
              particles.material.forEach(material => material.dispose());
            } else {
              particles.material.dispose();
            }
          }
          scene.remove(particles);
        });
        
        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        }
      };
    } catch (error) {
      console.error("Error initializing 3D background:", error);
      setWebGLFailed(true);
      setErrorMessage("Initialization error: " + String(error));
      if (onError) onError();
      return () => {}; // Return empty cleanup function on error
    }
  }, [onError]);

  // Return fallback if WebGL failed
  if (webGLFailed) {
    console.log("Using fallback background due to WebGL initialization failure");
    return <FallbackBackground3D />;
  }

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none simplified-background"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        zIndex: 0,
        visibility: 'visible',
        opacity: '1'
      }}
      aria-hidden="true"
      data-background="3d"
    >
      {errorMessage && (
        <div className="absolute bottom-4 right-4 bg-red-800 text-white p-2 rounded opacity-70 text-xs">
          3D Background Error: {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SimplifiedBackground3D;
