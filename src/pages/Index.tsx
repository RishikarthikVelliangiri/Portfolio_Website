
import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Cursor from '../components/Cursor';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';
import '../index.css';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import AwardsSection from '../components/AwardsSection';
import AppleSectionWrapper from '../components/AppleSectionWrapper';
import PersistentBackground3D from '../components/PersistentBackground3D';

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Force the background color to be transparent and ensure it's set globally
  useEffect(() => {
    document.body.style.backgroundColor = 'black';
    document.documentElement.style.backgroundColor = 'black';
    
    // Log that the Index component has mounted
    console.log("Index component mounted");
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);
  
  return (
    <motion.div 
      ref={pageRef} 
      className="relative min-h-screen w-full text-foreground font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "transparent" }}
    >
      {/* The 3D background is rendered here with a key to force remount */}
      <PersistentBackground3D key="persistent-background" />
      <Cursor />
      
      <Header />
      
      <main className="relative w-full overflow-hidden z-0" style={{ backgroundColor: "transparent" }}>
        <HeroSection />
        
        <AppleSectionWrapper id="about-section">
          <AboutSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="skills-section">
          <SkillsSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="experience-section">
          <ExperienceSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="projects-section">
          <ProductsSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="education-section">
          <EducationSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="awards-section">
          <AwardsSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="vision-section">
          <VisionSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="contact-section">
          <ContactSection />
        </AppleSectionWrapper>
      </main>
    </motion.div>
  );
};

export default Index;
