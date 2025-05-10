
import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import { motion } from 'framer-motion';

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [interactionMode, setInteractionMode] = useState(false);
  
  useEffect(() => {
    // Smooth scroll to section when clicking on anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target && target.hash && target.hash.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.pageYOffset - 80, // Offset for header
            behavior: 'smooth'
          });
        }
      }
    };
    
    // Initialize Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all elements with the data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(el);
    });
    
    // Listen for 'I' key press to toggle interaction mode
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'i') {
        setInteractionMode(prev => !prev);
        
        // Create a small notification effect
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-nebula-purple/80 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-neon';
        notification.innerHTML = `Interaction Mode: ${!interactionMode ? 'ON' : 'OFF'}`;
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
          notification.classList.add('opacity-0', 'translate-y-[-20px]', 'transition-all', 'duration-500');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 500);
        }, 2000);
      }
    };
    
    document.addEventListener('click', handleAnchorClick as EventListener);
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick as EventListener);
      document.removeEventListener('keydown', handleKeyPress);
      observer.disconnect();
    };
  }, [interactionMode]);

  return (
    <motion.div 
      ref={pageRef} 
      className="min-h-screen bg-background text-foreground font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Cursor />
      <Header interactionMode={interactionMode} />
      <main>
        <HeroSection />
        <ProductsSection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
