import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSectionAnimation } from '../hooks/useSectionAnimation';
import InteractiveParticleBackground from './InteractiveParticleBackground';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const { progress, inView } = useSectionAnimation({
    threshold: 0.2,
    rootMargin: "-20px"
  });
  useEffect(() => {
    // Use requestAnimationFrame for better scroll performance
    let rafId: number | null = null;
    let lastScrollTime = 0;
    const scrollThrottleMs = 32; // Match other components
    
    const handleScroll = () => {
      // Prevent multiple rAF calls
      if (rafId !== null) return;
      
      rafId = requestAnimationFrame(() => {
        const now = performance.now();
        if (now - lastScrollTime < scrollThrottleMs) {
          rafId = null;
          return;
        }
        lastScrollTime = now;
        
        if (!sectionRef.current || !textRef.current) {
          rafId = null;
          return;
        }
        
        const scrollY = window.scrollY;
        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;
        
        // Simple parallax text movement with optimized rendering
        const translateY = scrollY * 0.4;
        const translateZ = Math.min(scrollY * 0.1, 50);
        textRef.current.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px)`;
        
        // Opacity based on scroll position
        const opacity = 1 - Math.min(1, Math.max(0, (scrollY - sectionTop) / (sectionHeight * 0.5)));
        textRef.current.style.opacity = opacity.toString();
        
        // Clear reference to allow next frame
        rafId = null;
      });
    };
      window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
    // Three.js implementation removed and moved to PersistentBackground3D component
  // Enhanced text animation variants with Apple-like smooth transitions
  const titleVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 12,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1] // Cubic bezier used by Apple
      }
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 60, 
        damping: 10,
        delay: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 60, 
        damping: 10,
        delay: 0.9,
        ease: [0.22, 1, 0.36, 1]
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
  };return (    <section 
      id="hero" 
      ref={sectionRef} 
      className="relative h-screen flex items-center justify-center overflow-visible bg-transparent"
      style={{ 
        marginBottom: "-2px", /* Eliminate any potential gap between sections */
        paddingBottom: "2px", /* Add padding to prevent visual gap */
        borderBottom: "0px solid #000000" /* Ensure no border */
      }}
    >      <div ref={particleRef} className="absolute inset-0 w-full h-full z-0">
        <InteractiveParticleBackground parentRef={particleRef} />
      </div>
      {/* Subtle gradient overlay to enhance text readability over 3D background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-[1]" />
        
      {/* Content with enhanced parallax and Apple-style animations */}
      <motion.div 
        ref={textRef}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 mt-[-40px] transition-all duration-700 ease-out will-change-transform"
        style={{ 
          perspective: '1000px', 
          perspectiveOrigin: 'center'
        }}
      >
        <div className="max-w-6xl mx-auto text-left"> {/* Increased max width and ensure left alignment */}
          <motion.h1 
            variants={titleVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 leading-tight tracking-tighter"
          >            <motion.span 
              style={{
                backgroundImage: "linear-gradient(to right, rgb(139, 92, 246), rgb(168, 85, 247), rgb(217, 70, 239))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "white" // Fallback color if gradient doesn't load immediately
              }}
              className="transform hover:scale-105 transition-transform duration-300 block px-3 py-1 overflow-visible"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 25px rgba(217, 70, 239, 0.8)" 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Rishikarthik Velliangiri
            </motion.span>
            <motion.span 
              className="block px-3 py-1 mt-3"
              whileHover={{ 
                x: 20,
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
          >            <motion.a 
              href="#projects"
              variants={buttonVariants}
              whileHover="hover"
              className="group relative overflow-hidden rounded-lg px-6 py-3 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(to right, rgb(147, 51, 234), rgb(217, 70, 239))"
              }}
            >              <span className="relative z-10">Explore My Work</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.8)_0%,rgba(0,0,0,0)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
              className="px-6 py-3 border border-purple-500/30 backdrop-blur-sm rounded-lg font-medium relative overflow-hidden group"
            >
              <span className="relative z-10">About Me</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100"
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
