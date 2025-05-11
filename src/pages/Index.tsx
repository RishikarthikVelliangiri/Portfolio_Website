
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
      <main>
        <HeroSection />
        
        {/* Section transition between Hero and About */}
        <SectionBackgroundFade
          from="rgba(13,13,18,0)" 
          to="rgba(13,13,18,1)"
          position="bottom"
          height={100}
        />
        
        <AboutSection />
        
        {/* Section transition between About and Skills */}
        <SectionBackgroundFade
          from="rgba(13,13,18,0.8)" 
          to="rgba(12,10,29,0.8)"
          position="top"
          height={150}
        />
        
        <SkillsSection />
        
        {/* Section transition between Skills and Experience */}
        <SectionBackgroundFade
          from="rgba(12,10,29,0.8)" 
          to="rgba(13,13,18,0.9)"
          position="bottom"
          height={150}
        />
        
        <ExperienceSection />
        
        {/* Continue with other section transitions */}
        <SectionBackgroundFade
          from="rgba(13,13,18,0.9)" 
          to="rgba(16,16,28,0.8)"
          position="bottom"
          height={100}
        />
        
        <ProductsSection />
        
        <SectionBackgroundFade
          from="rgba(16,16,28,0.8)" 
          to="rgba(13,13,18,0.9)"
          position="bottom"
          height={100}
        />
        
        <EducationSection />
        
        <SectionBackgroundFade
          from="rgba(13,13,18,0.9)" 
          to="rgba(12,10,29,0.8)"
          position="bottom"
          height={100}
        />
        
        <AwardsSection />
        
        <SectionBackgroundFade
          from="rgba(12,10,29,0.8)" 
          to="rgba(9,9,18,1)"
          position="bottom"
          height={100}
        />
        
        <VisionSection />
        
        <SectionBackgroundFade
          from="rgba(9,9,18,1)" 
          to="rgba(13,13,18,1)"
          position="bottom"
          height={100}
        />
        
        <ContactSection />
      </main>
    </motion.div>
  );
};

export default Index;
