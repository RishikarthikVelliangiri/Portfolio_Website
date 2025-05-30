import React from 'react';
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

const Index = () => {
  const pageRef = React.useRef<HTMLDivElement>(null);
  
  // Simplified - removed complex scroll animation
  
  return (
    <motion.div ref={pageRef} 
      className="min-h-screen bg-black text-foreground font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#000000" }}
    >
      <Cursor />
      <Header />
      
      <main className="relative overflow-hidden bg-transparent" style={{ backgroundColor: "transparent" }}>
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
