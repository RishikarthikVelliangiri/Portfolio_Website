
import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import AwardsSection from '../components/AwardsSection';

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
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
    
    document.addEventListener('click', handleAnchorClick as EventListener);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick as EventListener);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div 
      ref={pageRef} 
      className="min-h-screen bg-background text-foreground font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Cursor />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProductsSection />
        <EducationSection />
        <AwardsSection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
