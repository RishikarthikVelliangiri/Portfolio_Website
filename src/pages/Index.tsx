
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';

const Index = () => {
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
    
    document.addEventListener('click', handleAnchorClick as EventListener);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
