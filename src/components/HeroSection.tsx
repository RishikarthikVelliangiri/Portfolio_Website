import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !textRef.current) return;
      
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      
      // Parallax text movement
      const translateY = scrollY * 0.4;
      textRef.current.style.transform = `translateY(${translateY}px)`;
      
      // Opacity based on scroll position
      const opacity = 1 - Math.min(1, Math.max(0, (scrollY - sectionTop) / (sectionHeight * 0.8)));
      textRef.current.style.opacity = opacity.toString();
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initialize Three.js scene
    if (canvasRef.current) {
      initThreeJS();
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Three.js initialization
  const initThreeJS = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    canvasRef.current?.appendChild(renderer.domElement);
    
    // Enhanced lighting setup for futuristic effects
    const ambientLight = new THREE.AmbientLight(0x222233);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // More vibrant point lights for the futuristic glow effect
    const purpleLight = new THREE.PointLight(0x9b87f5, 2, 50);
    purpleLight.position.set(-5, 2, 3);
    scene.add(purpleLight);
    
    const pinkLight = new THREE.PointLight(0xff69b4, 2, 50);
    pinkLight.position.set(5, -2, 3);
    scene.add(pinkLight);
    
    const blueLight = new THREE.PointLight(0x33C3F0, 2, 50);
    blueLight.position.set(0, 5, 3);
    scene.add(blueLight);

    // CREATE MORE FUTURISTIC 3D ELEMENTS
    
    // Data visualization style elements - floating holographic rings
    const ringGeometries = [];
    const ringMaterials = [];
    const rings = [];
    
    for (let i = 0; i < 5; i++) {
      const radius = 2 + i * 1.2;
      const tubeWidth = 0.08;
      const radialSegments = 16;
      const tubularSegments = 100;
      
      ringGeometries[i] = new THREE.TorusGeometry(radius, tubeWidth, radialSegments, tubularSegments);
      
      // Different colors for each ring to create a holographic effect
      const colors = [0x33C3F0, 0x9b87f5, 0xff69b4, 0x7E69AB, 0xD946EF];
      
      ringMaterials[i] = new THREE.MeshPhysicalMaterial({
        color: colors[i],
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        emissive: colors[i],
        emissiveIntensity: 0.5
      });
      
      rings[i] = new THREE.Mesh(ringGeometries[i], ringMaterials[i]);
      rings[i].rotation.x = Math.PI * 0.5;
      rings[i].rotation.y = Math.random() * Math.PI * 2;
      scene.add(rings[i]);
    }
    
    // Add a central holographic core sphere
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 4);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xD946EF,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
      emissive: 0xD946EF,
      emissiveIntensity: 0.6,
      wireframe: true
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    
    // Add holographic data points
    const dataPointsGeometry = new THREE.BufferGeometry();
    const dataPointsCount = 1000;
    const dataPointsPositions = new Float32Array(dataPointsCount * 3);
    
    // Create a more structured arrangement of data points in a sphere-like formation
    for (let i = 0; i < dataPointsCount; i++) {
      const radius = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      dataPointsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      dataPointsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dataPointsPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    dataPointsGeometry.setAttribute('position', new THREE.BufferAttribute(dataPointsPositions, 3));
    
    const dataPointsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xD3E4FD,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const dataPoints = new THREE.Points(dataPointsGeometry, dataPointsMaterial);
    scene.add(dataPoints);
    
    camera.position.z = 30;
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    };
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth camera movement
      targetX = mouseX * 0.2;
      targetY = mouseY * 0.2;
      
      // Animate the rings
      for (let i = 0; i < rings.length; i++) {
        rings[i].rotation.z += 0.001 * (i + 1);
        
        // Add pulsating effect
        const time = Date.now() * 0.001;
        const scalePulse = Math.sin(time * (0.2 + i * 0.05)) * 0.05 + 1;
        rings[i].scale.set(scalePulse, scalePulse, 1);
        
        // Move based on mouse
        rings[i].position.x += (targetX * 0.2 - rings[i].position.x) * 0.01;
        rings[i].position.y += (-targetY * 0.2 - rings[i].position.y) * 0.01;
      }
      
      // Animate the core
      core.rotation.x += 0.005;
      core.rotation.y += 0.007;
      core.scale.x = core.scale.y = core.scale.z = Math.sin(Date.now() * 0.001) * 0.1 + 1;
      
      // Animate data points
      dataPoints.rotation.x += 0.0003;
      dataPoints.rotation.y += 0.0005;
      
      // Create a subtle pulsating effect for data points
      dataPointsMaterial.size = Math.sin(Date.now() * 0.001) * 0.03 + 0.15;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      
      // Properly dispose resources
      for (let i = 0; i < ringGeometries.length; i++) {
        ringGeometries[i].dispose();
        ringMaterials[i].dispose();
      }
      
      coreGeometry.dispose();
      coreMaterial.dispose();
      dataPointsGeometry.dispose();
      dataPointsMaterial.dispose();
      
      renderer.dispose();
      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  };

  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10,
        delay: 0.2
      }
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 8,
        delay: 0.4
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 8,
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section 
      id="hero" 
      ref={sectionRef} 
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js canvas */}
      <div ref={canvasRef} className="absolute inset-0 w-full h-full z-0"></div>
      
      {/* Overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-[1]" />
      
      {/* Content - added px-8 for more horizontal padding */}
      <motion.div 
        ref={textRef}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 md:px-8 lg:px-10 relative z-10 mt-[-60px] transition-all duration-500"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            variants={titleVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 leading-tight tracking-tighter"
          >
            <motion.span 
              className="text-gradient glow transform hover:scale-105 transition-transform duration-300 block px-3 py-1 overflow-visible"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 25px rgba(79, 70, 229, 0.8)" 
              }}
            >
              Rishikarthik Velliangiri
            </motion.span> 
            <motion.span 
              className="transform translate-x-8 inline-block mt-3"
              whileHover={{ 
                x: 40,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              Software Innovator
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={subtitleVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8 mt-4 leading-relaxed backdrop-blur-sm py-2 px-4 rounded-xl border border-white/10 transform hover:translate-y-[-5px] transition-all duration-300"
          >
            Innovator in Software Solutions & AI. Pushing the boundaries with innovative digital experiences that inspire and transform.
          </motion.p>
          
          <motion.div 
            variants={buttonVariants}
            className="flex flex-col md:flex-row gap-6 justify-start"
          >
            <motion.a 
              href="#projects"
              variants={buttonVariants}
              whileHover="hover"
              className="group relative overflow-hidden rounded-lg btn-primary flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Explore My Work</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity duration-300"></div>
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.8)_0%,rgba(0,0,0,0)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              ></motion.div>
            </motion.a>
            
            <motion.a 
              href="#about"
              variants={buttonVariants}
              whileHover="hover"
              className="px-6 py-3 border border-white/20 backdrop-blur-sm rounded-lg font-medium relative overflow-hidden group"
            >
              <span className="relative z-10">About Me</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['100%', '-100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear"
                }}
              ></motion.div>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
