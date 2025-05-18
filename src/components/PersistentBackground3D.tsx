
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';

const PersistentBackground3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const { scrollY } = useScrollAnimation();

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log("Initializing Three.js scene");
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera with wider field of view
    const camera = new THREE.PerspectiveCamera(
      90, // Wider field of view (was 75)
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // Keep camera closer to see more particles
    cameraRef.current = camera;
    
    // Create renderer with better quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Make renderer canvas take full width/height
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    
    containerRef.current.innerHTML = ''; // Clear any previous canvas
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create more particles with larger size for better visibility
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000; // Increased from 2500
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Brighter colors for better visibility
    const colorPalette = [
      new THREE.Color(0xb366ff), // Bright purple
      new THREE.Color(0xff66ff), // Bright pink
      new THREE.Color(0xc384fc), // Bright lavender
      new THREE.Color(0xd946ef), // Bright fuchsia
    ];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a sphere with wider distribution
      const radius = 3 + Math.random() * 15; // Bigger radius for more visible distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      
      // Assign random colors from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Use larger particle size and higher opacity
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.25, // Increased from 0.1
      vertexColors: true,
      transparent: true,
      opacity: 1.0, // Full opacity
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Handle mouse movement with more responsive effect
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop with more dramatic movement
    const animate = () => {
      if (!particlesRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const time = Date.now() * 0.0005;
      
      // More responsive rotation
      particlesRef.current.rotation.x = time * 0.3 + mouseRef.current.y * 0.1;
      particlesRef.current.rotation.y = time * 0.2 + mouseRef.current.x * 0.1;
      
      // Subtle pulsing effect
      const pulseFactor = Math.sin(time * 2) * 0.05 + 1;
      particlesRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Debug log to confirm rendering
    console.log("Three.js animation started");
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of resources
      if (particlesRef.current) {
        if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
        if (particlesRef.current.material) {
          if (Array.isArray(particlesRef.current.material)) {
            particlesRef.current.material.forEach(material => material.dispose());
          } else {
            particlesRef.current.material.dispose();
          }
        }
        sceneRef.current?.remove(particlesRef.current);
      }
      
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      particlesRef.current = null;
    };
  }, []);
  
  // Effect to handle scroll-based animations
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const updateScroll = () => {
      const scrollValue = window.scrollY;
      if (particlesRef.current) {
        // More dramatic parallax effect based on scroll position
        particlesRef.current.position.y = -scrollValue * 0.002;
      }
    };
    
    // Use the modern approach for onChange
    const unsubscribe = scrollY.on("change", updateScroll);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [scrollY]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ 
        width: '100%', 
        height: '100vh',
        backgroundColor: 'transparent'
      }}
      aria-hidden="true"
    />
  );
};

export default PersistentBackground3D;
