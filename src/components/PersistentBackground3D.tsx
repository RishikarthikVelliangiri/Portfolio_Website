
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';

const PersistentBackground3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { scrollY } = useScrollAnimation();
  
  // Initialize Three.js scene only once
  useEffect(() => {
    // Prevent re-initialization
    if (isInitialized) return;
    
    console.log("Starting Three.js initialization");
    
    if (!containerRef.current) {
      console.warn("Container ref is null, cannot initialize Three.js");
      return;
    }
    
    // Create scene with a clear background color
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera with wider field of view for better visibility
    const camera = new THREE.PerspectiveCamera(
      100, // Very wide field of view
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer with optimal settings for visibility
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Make renderer canvas take full width/height and ensure it's visible
    const rendererDom = renderer.domElement;
    rendererDom.style.width = '100vw';
    rendererDom.style.height = '100vh';
    rendererDom.style.position = 'fixed';
    rendererDom.style.top = '0';
    rendererDom.style.left = '0';
    rendererDom.style.zIndex = '-1'; // Behind other content
    rendererDom.style.pointerEvents = 'none'; // Don't capture clicks
    rendererDom.id = 'three-js-canvas'; // Add ID for debugging
    
    // Clear container before adding canvas
    if (containerRef.current.firstChild) {
      containerRef.current.innerHTML = '';
    }
    
    containerRef.current.appendChild(rendererDom);
    rendererRef.current = renderer;
    
    // Create particles with extremely visible settings
    const particleCount = 15000; // Significantly more particles
    const particleGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Ultra bright colors for maximum visibility
    const colorPalette = [
      new THREE.Color(0xbb66ff).multiplyScalar(3), // Extra bright purple
      new THREE.Color(0xff66ff).multiplyScalar(3), // Extra bright pink
      new THREE.Color(0xd384fc).multiplyScalar(3), // Extra bright lavender
      new THREE.Color(0xf946ef).multiplyScalar(3), // Extra bright fuchsia
    ];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a wide sphere for better visibility
      const radius = 3 + Math.random() * 30; // Much wider radius
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
    
    // Create much larger particles for better visibility
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8, // Much larger size
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending // Add blending for glow effect
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      console.log(`Resized renderer to ${width}x${height}`);
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
    
    // Animation loop with dramatic movement
    const animate = () => {
      if (!particlesRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const time = Date.now() * 0.0005;
      
      // More responsive rotation
      particlesRef.current.rotation.x = time * 0.3 + mouseRef.current.y * 0.5;
      particlesRef.current.rotation.y = time * 0.2 + mouseRef.current.x * 0.5;
      
      // Stronger pulsing effect
      const pulseFactor = Math.sin(time * 3) * 0.15 + 1.1; // More dramatic pulsing
      particlesRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    console.log("Three.js animation started");
    
    // Run an immediate render to ensure the scene appears
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      console.log("Initial render completed");
    }
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Cleanup function
    return () => {
      console.log("Cleaning up Three.js resources");
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (rendererRef.current?.domElement && containerRef.current) {
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
  }, [isInitialized]); // Only depend on isInitialized
  
  // Effect to handle scroll-based animations
  useEffect(() => {
    const updateScroll = () => {
      if (!particlesRef.current || !isInitialized) return;
      
      const scrollValue = window.scrollY;
      // More dramatic parallax effect based on scroll position
      particlesRef.current.position.y = -scrollValue * 0.004;
    };
    
    // Update immediately and then on scroll changes
    updateScroll();
    
    if (scrollY) {
      scrollY.on("change", updateScroll);
      return () => {
        scrollY.clearListeners();
      };
    }
  }, [scrollY, isInitialized]);

  // Force a re-render on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        console.log("Re-rendered scene on visibility change");
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh',
        zIndex: -1,
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }}
      aria-hidden="true"
      id="three-js-container"
    />
  );
};

export default PersistentBackground3D;
