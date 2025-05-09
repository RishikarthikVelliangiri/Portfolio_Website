
import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load Spline viewer script
    const splineScript = document.createElement('script');
    splineScript.type = 'module';
    splineScript.src = 'https://unpkg.com/@splinetool/viewer@1.9.92/build/spline-viewer.js';
    document.head.appendChild(splineScript);
    
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
    
    document.addEventListener('click', handleAnchorClick as EventListener);
    
    // Initialize particle viewer in products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      const particleContainer = document.createElement('div');
      particleContainer.className = 'absolute inset-0 w-full h-full z-0 opacity-50';
      
      const particleViewer = document.createElement('spline-viewer');
      particleViewer.setAttribute('url', 'https://prod.spline.design/Apn06hWKowqeJc1s/scene.splinecode');
      particleViewer.className = 'w-full h-full';
      particleViewer.setAttribute('noFooter', '');
      
      particleContainer.appendChild(particleViewer);
      productsSection.prepend(particleContainer);
    }
    
    return () => {
      document.removeEventListener('click', handleAnchorClick as EventListener);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background text-foreground font-sans">
      <Cursor />
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
