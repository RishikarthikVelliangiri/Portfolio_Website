
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Cursor from '../components/Cursor';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import AwardsSection from '../components/AwardsSection';
import SectionBackgroundFade from '../components/SectionBackgroundFade';

const Index = () => {
  const pageRef = React.useRef<HTMLDivElement>(null);
  
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
    
    document.addEventListener('click', handleAnchorClick as EventListener);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick as EventListener);
    };
  }, []);

  return (
    <motion.div 
      ref={pageRef} 
      className="min-h-screen bg-background text-foreground font-sans will-change-transform will-change-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Cursor />
      <Header />
      <main className="relative overflow-hidden">
        <HeroSection />
        
        {/* Improved section transitions with smoother blending - removed blue hue */}
        <SectionBackgroundFade
          from="rgba(13,13,18,0)" 
          to="rgba(13,13,18,0.95)"
          position="bottom"
          height={120}
        />
        
        <AboutSection />
        
        <SectionBackgroundFade
          from="rgba(13,13,18,0.6)" 
          to="rgba(12,10,29,0.9)"
          position="top"
          height={180}
        />
        
        <SkillsSection />
        
        <SectionBackgroundFade
          from="rgba(12,10,29,0.7)" 
          to="rgba(13,13,18,0.95)"
          position="bottom"
          height={180}
        />
        
        <ExperienceSection />
        
        <SectionBackgroundFade
          from="rgba(13,13,18,0.7)" 
          to="rgba(16,16,28,0.95)"
          position="bottom"
          height={120}
        />
        
        <ProductsSection />
        
        <SectionBackgroundFade
          from="rgba(16,16,28,0.7)" 
          to="rgba(13,13,18,0.95)"
          position="bottom"
          height={120}
        />
        
        <EducationSection />
        
        <SectionBackgroundFade
          from="rgba(13,13,18,0.7)" 
          to="rgba(12,10,29,0.95)"
          position="bottom"
          height={120}
        />
        
        <AwardsSection />
        
        <SectionBackgroundFade
          from="rgba(12,10,29,0.7)" 
          to="rgba(9,9,18,0.95)"
          position="bottom"
          height={120}
        />
        
        <VisionSection />
        
        <SectionBackgroundFade
          from="rgba(9,9,18,0.7)" 
          to="rgba(13,13,18,0.95)"
          position="bottom"
          height={120}
        />
        
        <ContactSection />
      </main>
    </motion.div>
  );
};

export default Index;
