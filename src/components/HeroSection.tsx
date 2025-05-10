
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import * as THREE from 'three';

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
      const translateY = scrollY * 0.4; // Adjust speed as needed
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
    
    return () => window.removeEventListener('scroll', handleScroll);
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
    
    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Create directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Point lights for the futuristic glow effect
    const purpleLight = new THREE.PointLight(0x9b87f5, 1, 50);
    purpleLight.position.set(-5, 2, 3);
    scene.add(purpleLight);
    
    const pinkLight = new THREE.PointLight(0xff69b4, 1, 50);
    pinkLight.position.set(5, -2, 3);
    scene.add(pinkLight);
    
    const blueLight = new THREE.PointLight(0x33C3F0, 1, 50);
    blueLight.position.set(0, 5, 3);
    scene.add(blueLight);
    
    // Create a futuristic toroid shape
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7E69AB,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
      emissive: 0x7E69AB,
      emissiveIntensity: 0.4
    });
    
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
    // Create a central sphere
    const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xD946EF,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      emissive: 0xD946EF,
      emissiveIntensity: 0.4
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Create particles for a space-like effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xD3E4FD,
      transparent: true,
      opacity: 0.7
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
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
    
    const onDocumentMouseMove = (event: MouseEvent) => {
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
      
      // Slowly rotate the torus and sphere
      torus.rotation.x += 0.002;
      torus.rotation.y += 0.003;
      
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;
      
      // Move slightly based on mouse position
      torus.position.x += (targetX - torus.position.x) * 0.05;
      torus.position.y += (-targetY - torus.position.y) * 0.05;
      
      sphere.position.x += (targetX - sphere.position.x) * 0.03;
      sphere.position.y += (-targetY - sphere.position.y) * 0.03;
      
      // Subtle particle rotation
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0004;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      
      // Properly dispose resources
      torusGeometry.dispose();
      torusMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      
      renderer.dispose();
      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
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
      
      {/* Content */}
      <div 
        ref={textRef}
        className="container mx-auto px-4 md:px-6 relative z-10 mt-[-80px] transition-all duration-500"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-bold mb-4 leading-tight tracking-tighter animate-fadeInUp">
            <span className="text-gradient glow transform hover:scale-105 transition-transform duration-300 block">Visionary</span> 
            <span className="transform translate-x-8 inline-block">Digital Craftsman</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 mt-4 leading-relaxed backdrop-blur-sm py-2 px-4 rounded-xl border border-white/10 transform hover:translate-y-[-5px] transition-all duration-300 animate-fadeInUp animation-delay-2000">
            Pushing the boundaries of design with innovative digital experiences that inspire and transform.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-start animate-fadeInUp animation-delay-4000">
            <a href="#products" className="group relative overflow-hidden rounded-lg btn-primary flex items-center justify-center gap-2 transform hover:translate-y-[-5px] transition-all duration-300">
              <span className="relative z-10">Explore My Work</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.8)_0%,rgba(0,0,0,0)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-150"></div>
            </a>
            <a href="#vision" className="px-6 py-3 border border-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-300 hover:border-white/40 hover:bg-white/5 transform hover:translate-y-[-5px] relative overflow-hidden group">
              <span className="relative z-10">My Vision</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Dynamic cursor indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2">
        <p className="text-sm text-white/70">Interact with the scene</p>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center items-start p-1">
          <div className="w-1 h-2 bg-white/80 rounded-full animate-pulse-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
