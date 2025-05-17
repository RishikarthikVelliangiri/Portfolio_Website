
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import Cursor from '../components/Cursor';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';
// Import CSS directly to force black background
import '../index.css';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import AwardsSection from '../components/AwardsSection';
import PersistentBackground3D from '../components/PersistentBackground3D';
import AppleSectionWrapper from '../components/AppleSectionWrapper';
// Remove SectionBackgroundFade to eliminate gray lines

const Index = () => {
  const pageRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
    // Enhanced Apple-style smooth scroll to section when clicking on anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target && target.hash && target.hash.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        
        if (element) {
          // Get the target position
          const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80; // Offset for header
          
          // Get current position
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          
          // Apple-style smooth scrolling animation with cubic-bezier easing
          const duration = 1200; // Longer for smoother effect
          const startTime = performance.now();
          
          // Cubic bezier timing function - similar to Apple's smooth animations
          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
          
          const animateScroll = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = easeOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };
          
          requestAnimationFrame(animateScroll);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick as EventListener);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick as EventListener);
    };
  }, []);return (    <motion.div ref={pageRef} 
      className="min-h-screen bg-black text-foreground font-sans will-change-transform will-change-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#000000" }} /* Force pure black */
    >
      {/* Persistent 3D background that follows scroll */}
      <PersistentBackground3D />
      
      <Cursor />
      <Header />
      
      {/* Main content without explicit z-index */}
      <main className="relative overflow-hidden bg-transparent" style={{ backgroundColor: "transparent" }}>
        {/* Hero section doesn't need the wrapper as it has its own animations */}
        <HeroSection />
        
        {/* Apply Apple-style section wrappers with different scroll multipliers for varied effects */}
        <AppleSectionWrapper id="about-section" scrollMultiplier={1.2} initialOffset={20}>
          <AboutSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="skills-section" scrollMultiplier={0.8} initialOffset={40}>
          <SkillsSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="experience-section" scrollMultiplier={1.1} initialOffset={30}>
          <ExperienceSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="projects-section" scrollMultiplier={0.9} initialOffset={25}>
          <ProductsSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="education-section" scrollMultiplier={1.0} initialOffset={35}>
          <EducationSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="awards-section" scrollMultiplier={1.3} initialOffset={20}>
          <AwardsSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="vision-section" scrollMultiplier={0.7} initialOffset={15}>
          <VisionSection />
        </AppleSectionWrapper>
        
        <AppleSectionWrapper id="contact-section" scrollMultiplier={0.5} initialOffset={10}>
          <ContactSection />
        </AppleSectionWrapper>
      </main>
    </motion.div>
  );
};

export default Index;
