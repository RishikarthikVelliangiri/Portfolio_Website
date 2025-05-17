import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';
import { motion, useTransform } from 'framer-motion';

interface KeyframePosition {
  progress: number;
  cameraPosition: THREE.Vector3;
  sceneRotation: { x: number; y: number };
  targetPosition?: THREE.Vector3; // Where the camera should look at
  elementsVisibility?: {
    rings?: boolean;
    core?: boolean;
    dataPoints?: boolean;
  };
}

const PersistentBackground3D = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [threeReady, setThreeReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const lastRenderTimeRef = useRef<number>(0);
  const objectsRef = useRef<{
    rings: THREE.Mesh[];
    core: THREE.Mesh | null;
    dataPoints: THREE.Points | null;
  }>({
    rings: [],
    core: null,
    dataPoints: null,
  });
  
  // Get scroll information from context
  const { scrollY, scrollProgress } = useScrollAnimation();  // Check if THREE is properly loaded
  useEffect(() => {
    // Verify THREE is fully loaded before proceeding
    if (typeof THREE !== 'undefined' && 
        typeof THREE.Scene === 'function' && 
        typeof THREE.WebGLRenderer === 'function') {
      setThreeReady(true);
    } else {
      console.error("THREE.js not properly loaded");
    }
  }, []);
  
  // Listen for section visibility events
  useEffect(() => {
    const handleSectionInView = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, ratio, isEntering } = customEvent.detail;
      
      // Update active section
      if (isEntering && ratio > 0.5) {
        setActiveSection(id);
      }
      
      // Performance optimization: reduce animation frame rate when user is not scrolling
      // and increase it when they are actively viewing content
      if (isEntering && ratio > 0.2) {
        setIsAnimating(true);
        // Reset animation timing for smoother transitions
        lastRenderTimeRef.current = 0;
      }
    };
    
    // Subscribe to custom section visibility events
    document.addEventListener('sectionInView', handleSectionInView);
    
    return () => {
      document.removeEventListener('sectionInView', handleSectionInView);
    };
  }, []);
    // Define keyframes for the 3D elements with Apple-inspired cinematography
  const keyframes: KeyframePosition[] = [
    {
      // Hero section - cinematic centered view
      progress: 0,
      cameraPosition: new THREE.Vector3(0, 0, 30),
      sceneRotation: { x: 0, y: 0 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Transition to About
      progress: 0.08,
      cameraPosition: new THREE.Vector3(-5, 2, 28),
      sceneRotation: { x: 0.05, y: -0.2 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // About section - elegant side view
      progress: 0.15,
      cameraPosition: new THREE.Vector3(-18, 5, 25),
      sceneRotation: { x: 0.1, y: -0.5 },
      elementsVisibility: { rings: true, core: true, dataPoints: false }
    },
    {
      // Transition to Skills
      progress: 0.22,
      cameraPosition: new THREE.Vector3(0, 4, 20),
      sceneRotation: { x: 0.15, y: 0.3 },
      elementsVisibility: { rings: true, core: true, dataPoints: false }
    },
    {
      // Skills section - dramatic close-up
      progress: 0.3,
      cameraPosition: new THREE.Vector3(8, 2, 15),
      sceneRotation: { x: 0.2, y: 0.7 },
      elementsVisibility: { rings: true, core: true, dataPoints: false }
    },
    {
      // Transition to Experience
      progress: 0.38,
      cameraPosition: new THREE.Vector3(12, 6, 17),
      sceneRotation: { x: -0.1, y: 0.6 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Experience section - elevated perspective
      progress: 0.45,
      cameraPosition: new THREE.Vector3(15, 10, 20),
      sceneRotation: { x: -0.3, y: 0.5 },
      elementsVisibility: { rings: true, core: false, dataPoints: true }
    },
    {
      // Transition to Projects
      progress: 0.53,
      cameraPosition: new THREE.Vector3(8, 0, 30),
      sceneRotation: { x: 0, y: 0 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Projects section - wide establishing shot
      progress: 0.6,
      cameraPosition: new THREE.Vector3(0, -5, 40),
      sceneRotation: { x: 0.2, y: -0.2 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Transition to Education
      progress: 0.68,
      cameraPosition: new THREE.Vector3(-8, -7, 33),
      sceneRotation: { x: -0.1, y: -0.3 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Education section - dramatic lower perspective
      progress: 0.75,
      cameraPosition: new THREE.Vector3(-15, -10, 25),
      sceneRotation: { x: -0.2, y: -0.4 },
      elementsVisibility: { rings: false, core: true, dataPoints: true }
    },
    {
      // Transition to Awards
      progress: 0.8,
      cameraPosition: new THREE.Vector3(-5, 0, 30),
      sceneRotation: { x: -0.3, y: -0.1 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Awards section - diagonal perspective
      progress: 0.85,
      cameraPosition: new THREE.Vector3(0, 5, 32),
      sceneRotation: { x: -0.3, y: 0.1 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Vision/Contact section - dramatic overhead view
      progress: 0.92,
      cameraPosition: new THREE.Vector3(5, 15, 35),
      sceneRotation: { x: -0.4, y: 0.3 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    },
    {
      // Final view - pulled back for conclusion
      progress: 1.0,
      cameraPosition: new THREE.Vector3(0, 5, 45),
      sceneRotation: { x: -0.1, y: 0 },
      elementsVisibility: { rings: true, core: true, dataPoints: true }
    }
  ];
  // Transform scroll progress into camera positions and scene rotations
  // with enhanced Apple-style smooth easing
  const interpolateKeyframes = (progress: number) => {
    // Find the two keyframes we're currently between
    let startFrame = keyframes[0];
    let endFrame = keyframes[keyframes.length - 1];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].progress && progress < keyframes[i + 1].progress) {
        startFrame = keyframes[i];
        endFrame = keyframes[i + 1];
        break;
      }
    }
    
    // Calculate how far we are between the two keyframes (0-1)
    const rawFrameProgress = (progress - startFrame.progress) / 
      (endFrame.progress - startFrame.progress);
    
    // Apply cubic bezier easing curve - similar to Apple's animations
    // Using the "ease-out-cubic" function: t => 1 - Math.pow(1 - t, 3)
    const frameProgress = 1 - Math.pow(1 - rawFrameProgress, 3);
    
    // Interpolate camera position with smooth easing
    const cameraX = startFrame.cameraPosition.x + 
      (endFrame.cameraPosition.x - startFrame.cameraPosition.x) * frameProgress;
    const cameraY = startFrame.cameraPosition.y + 
      (endFrame.cameraPosition.y - startFrame.cameraPosition.y) * frameProgress;
    const cameraZ = startFrame.cameraPosition.z + 
      (endFrame.cameraPosition.z - startFrame.cameraPosition.z) * frameProgress;
    
    // Interpolate scene rotation with smooth easing
    const rotationX = startFrame.sceneRotation.x + 
      (endFrame.sceneRotation.x - startFrame.sceneRotation.x) * frameProgress;
    const rotationY = startFrame.sceneRotation.y + 
      (endFrame.sceneRotation.y - startFrame.sceneRotation.y) * frameProgress;
    
    // Advanced visibility calculation - smooth fade between states
    // Instead of abrupt changes, create a crossfade effect
    const fadeThreshold = 0.2; // When to start fading elements in/out
    
    // Calculate visibility with fading
    const getVisibility = (startVisible: boolean | undefined, endVisible: boolean | undefined) => {
      // Default values if undefined
      const start = startVisible === undefined ? true : startVisible;
      const end = endVisible === undefined ? true : endVisible;
      
      // If same visibility in both keyframes, use that
      if (start === end) return start;
      
      // Otherwise calculate fade
      if (start && !end) {
        // Fading out
        return rawFrameProgress < (1 - fadeThreshold);
      } else {
        // Fading in
        return rawFrameProgress > fadeThreshold;
      }
    };
    
    const visibility = {
      rings: getVisibility(startFrame.elementsVisibility?.rings, endFrame.elementsVisibility?.rings),
      core: getVisibility(startFrame.elementsVisibility?.core, endFrame.elementsVisibility?.core),
      dataPoints: getVisibility(startFrame.elementsVisibility?.dataPoints, endFrame.elementsVisibility?.dataPoints)
    };
    
    // Calculate opacity for smooth transitions
    const getOpacity = (startVisible: boolean | undefined, endVisible: boolean | undefined) => {
      // Default values if undefined
      const start = startVisible === undefined ? true : startVisible;
      const end = endVisible === undefined ? true : endVisible;
      
      // If same visibility in both keyframes, use max opacity
      if (start === end) return start ? 1 : 0;
      
      // Otherwise calculate fade
      if (start && !end) {
        // Fading out - map from 1->0 as progress goes from (1-threshold)->1
        return Math.max(0, 1 - (rawFrameProgress - (1 - fadeThreshold)) / fadeThreshold);
      } else {
        // Fading in - map from 0->1 as progress goes from 0->threshold
        return Math.min(1, rawFrameProgress / fadeThreshold);
      }
    };
    
    const opacity = {
      rings: getOpacity(startFrame.elementsVisibility?.rings, endFrame.elementsVisibility?.rings),
      core: getOpacity(startFrame.elementsVisibility?.core, endFrame.elementsVisibility?.core),
      dataPoints: getOpacity(startFrame.elementsVisibility?.dataPoints, endFrame.elementsVisibility?.dataPoints)
    };
    
    return {
      cameraPosition: new THREE.Vector3(cameraX, cameraY, cameraZ),
      sceneRotation: { x: rotationX, y: rotationY },
      elementsVisibility: visibility,
      elementsOpacity: opacity
    };
  };
  useEffect(() => {
    if (!canvasRef.current || !threeReady) return;
    
    try {      // Scene setup with pure black background
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      sceneRef.current = scene;
    
    // Camera setup with improved parameters
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.lookAt(0, 0, 0); // Ensure camera looks at center
    cameraRef.current = camera;
    
    // Improved renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: false, // Disable transparency for better performance and visibility
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.setClearColor(0x000000, 1); // Fully opaque background for better visibility
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows for better appearance
    
    // Handle different THREE.js versions
    if ('outputColorSpace' in renderer) {
      // @ts-ignore - For THREE.js v150+
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ('outputEncoding' in renderer) {
      // @ts-ignore - For older THREE.js versions
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
      // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x444444, 1.2); // Brighter ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Brighter directional light
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true; // Enable shadow casting
    scene.add(directionalLight);
    
    // Additional front light to improve visibility
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 0, 10); // Position in front of the scene
    scene.add(frontLight);
      // Purple and pink lights for futuristic glow with increased intensity
    const purpleLight = new THREE.PointLight(0x9b87f5, 3.0, 100);
    purpleLight.position.set(-5, 2, 3);
    scene.add(purpleLight);
    
    const pinkLight = new THREE.PointLight(0xff69b4, 3.5, 100);
    pinkLight.position.set(5, -2, 3);
    scene.add(pinkLight);
    
    // Add a bright white light to enhance visibility
    const whiteLight = new THREE.PointLight(0xffffff, 2.0, 150);
    whiteLight.position.set(0, 0, 50);
    scene.add(whiteLight);
    
    // Warm light
    const warmLight = new THREE.PointLight(0xFFF1E6, 1.0, 50);
    warmLight.position.set(0, 5, 10);
    scene.add(warmLight);

    // Holographic rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const radius = 2 + i * 1.2;
      const tubeWidth = 0.08;
      const radialSegments = 16;
      const tubularSegments = 100;
      
      const ringGeometry = new THREE.TorusGeometry(radius, tubeWidth, radialSegments, tubularSegments);      const colors = [0xD946EF, 0xAB45C6, 0xff69b4, 0xE323C0, 0xD946EF];      // Create a super bright material for maximum visibility
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: false,
        side: THREE.DoubleSide, // Render both sides for better visibility
        depthWrite: true,
        toneMapped: false // Prevent tone mapping for brighter colors
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI * 0.5;
      ring.rotation.y = Math.random() * Math.PI * 2;
      scene.add(ring);
      rings.push(ring);
    }
    objectsRef.current.rings = rings;    // Central core
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 4);    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF, // Bright white for high contrast
      wireframe: true,
      side: THREE.DoubleSide,
      depthWrite: true,
      transparent: false,
      toneMapped: false,
      fog: false
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    objectsRef.current.core = core;
    
    // Data points
    const dataPointsGeometry = new THREE.BufferGeometry();
    const dataPointsCount = 1000;
    const dataPointsPositions = new Float32Array(dataPointsCount * 3);
    
    for (let i = 0; i < dataPointsCount; i++) {
      const radius = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      dataPointsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      dataPointsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dataPointsPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    dataPointsGeometry.setAttribute('position', new THREE.BufferAttribute(dataPointsPositions, 3));    const dataPointsMaterial = new THREE.PointsMaterial({
      size: 0.7, // Much larger size for guaranteed visibility
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.9, // Higher opacity
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true, // Enable size attenuation for 3D effect
      depthWrite: false // Allow points to be visible through other objects
    });
    
    const dataPoints = new THREE.Points(dataPointsGeometry, dataPointsMaterial);
    scene.add(dataPoints);
    objectsRef.current.dataPoints = dataPoints;
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement for subtle interactivity
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) / 50;
      mouseY = (event.clientY - windowHalfY) / 50;
    };
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Dispose of resources
      rendererRef.current?.dispose();
      if (canvasRef.current && rendererRef.current?.domElement) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials
      objectsRef.current.rings.forEach(ring => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      
      if (objectsRef.current.core) {
        objectsRef.current.core.geometry.dispose();
        (objectsRef.current.core.material as THREE.Material).dispose();
      }      if (objectsRef.current.dataPoints) {
        objectsRef.current.dataPoints.geometry.dispose();
        (objectsRef.current.dataPoints.material as THREE.Material).dispose();
      }
    };
    } catch (error) {
      console.error("Error cleaning up Three.js resources:", error);
    }
  }, []);
  
  // Main animation and scroll response effect
  useEffect(() => {
    // Skip if scene or objects aren't initialized
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    // Get references for cleaner code
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const objects = objectsRef.current;
    
    // Mouse variables for subtle interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Variables for adaptive performance
    let isUserActive = false;
    let lastMoveTime = Date.now();
    const activityTimeout = 3000; // 3 seconds of inactivity before reducing frame rate
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
      
      // Mark user as active and reset timeout
      isUserActive = true;
      lastMoveTime = Date.now();
    };
    
    // Listen for scroll events to detect activity
    const onScroll = () => {
      isUserActive = true;
      lastMoveTime = Date.now();
    };
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('scroll', onScroll);    const animate = (timestamp: number) => {
      try {
        // Check for user inactivity
        if (Date.now() - lastMoveTime > activityTimeout) {
          isUserActive = false;
        }
        
        // Adaptive frame rate - full speed when active, reduced when inactive
        // This is similar to how Apple devices optimize animations
        const frameInterval = isUserActive ? 0 : 100; // ms between frames when inactive
        
        // Skip frames when inactive for performance optimization
        if (!isUserActive && timestamp - lastRenderTimeRef.current < frameInterval) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
        
        // Update last render time
        lastRenderTimeRef.current = timestamp;
        
    // Get current scroll progress
        const currentProgress = scrollProgress.get();
        
        // Log for debugging
        if (Date.now() % 5000 < 50) { // Log approximately every 5 seconds
          console.log("3D Animation running", { currentProgress });
        }
        
        // Get interpolated position and rotation with opacity values
        const { cameraPosition, sceneRotation, elementsVisibility, elementsOpacity } = 
          interpolateKeyframes(currentProgress);
        
        // Apply camera position with smooth Apple-like transition
        // Adjusted for more responsive yet still smooth movement
        camera.position.x += (cameraPosition.x - camera.position.x) * 0.05;
        camera.position.y += (cameraPosition.y - camera.position.y) * 0.05;
        camera.position.z += (cameraPosition.z - camera.position.z) * 0.05;        // Apply scene rotation with smooth Apple-like transition
        scene.rotation.x += (sceneRotation.x - scene.rotation.x) * 0.03;
        scene.rotation.y += (sceneRotation.y - scene.rotation.y) * 0.03;
        
        // Add subtle mouse influence - more refined for Apple-like precision
        targetX = mouseX * 0.15; // Reduced for subtlety
        targetY = mouseY * 0.15;
        
        // Apply mouse movement with extra damping for smoother feel
        const mouseDamping = 0.008;
        scene.rotation.y += (targetX * 0.02 - scene.rotation.y) * mouseDamping;
        scene.rotation.x += (-targetY * 0.02 - scene.rotation.x) * mouseDamping;
        // Apply visibility and opacity based on scroll position
      if (objects.core) {
        // Always keep core visible
        objects.core.visible = true;
        
        // Apply enhanced visibility
        if (objects.core.material instanceof THREE.Material && 'opacity' in objects.core.material) {
          // Ensure core is always highly visible
          objects.core.material.opacity = 1.0;
          
          // Make the wireframe more visible if possible
          if ('wireframe' in objects.core.material) {
            objects.core.material.wireframe = true;
          }
        }
        
        // Animate core with subtle movement
        objects.core.rotation.x += 0.003; // Slowed down slightly
        objects.core.rotation.y += 0.005;
        
        // Smoother pulsing effect - more Apple-like subtlety
        const corePulse = Math.sin(Date.now() * 0.0005) * 0.08 + 1; // Slower, subtler
        objects.core.scale.x = objects.core.scale.y = objects.core.scale.z = corePulse;
      }
        if (objects.dataPoints) {
        // Always make data points visible for better user experience
        objects.dataPoints.visible = true;
        
        // Apply opacity for smooth transitions but keep minimum visibility
        if (objects.dataPoints.material instanceof THREE.PointsMaterial) {
          // Ensure minimum opacity of 0.7 to maintain visibility
          objects.dataPoints.material.opacity = elementsVisibility.dataPoints ? 
            Math.min(1.0, Math.max(0.7, elementsOpacity.dataPoints * 1.0)) : 0.7;
            
          // Create more pronounced pulsating effect
          objects.dataPoints.material.size = 0.6 + Math.sin(Date.now() * 0.0005) * 0.2;
        }
        
        // Animate data points with smoother rotation
        objects.dataPoints.rotation.x += 0.0002;
        objects.dataPoints.rotation.y += 0.0003;
      }
        // Animate rings with smoother transitions
      objects.rings.forEach((ring, i) => {
        // Always keep rings visible
        ring.visible = true;
        
        // Apply opacity for smooth transitions but maintain minimum visibility
        if (ring.material instanceof THREE.Material && 'opacity' in ring.material) {
          // Ensure rings are always at least somewhat visible
          ring.material.opacity = elementsVisibility.rings ? 
            1.0 : 0.5; // Fixed opacity values for better visibility
          
          // Boost emissive properties if available
          if ('emissive' in ring.material && ring.material.emissive) {
            const colors = [0xD946EF, 0xAB45C6, 0xff69b4, 0xE323C0, 0xD946EF];
            ring.material.emissive.setHex(colors[i % colors.length]);
          }
        }
        
        // Slower, more elegant rotation
        ring.rotation.z += 0.0007 * (i + 1);
        
        // Add subtle pulsating effect - more Apple-like refinement
        const time = Date.now() * 0.0006; // Slower for subtlety
        const offset = i * 0.3; // Greater phase offset between rings
        const scalePulse = Math.sin(time + offset) * 0.04 + 1; // Subtler effect
        ring.scale.set(scalePulse, scalePulse, 1);
      });
        renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Error in animation loop:", error);
        // Continue animation despite errors
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation loop with requestAnimationFrame
    requestAnimationFrame(animate);
      return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress]);  // Component to render with original positioning
  return (
    <div 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-[5]" // Return to original z-index
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        willChange: 'transform',
      }}
    />
  );
};

export default PersistentBackground3D;
