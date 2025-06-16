import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollAnimation } from '../contexts/ScrollAnimationContext';
import { motion, useTransform, useMotionValue } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY, scrollDirection } = useScrollAnimation();
  const headerRef = useRef<HTMLElement>(null);
  
  // Create a local motion value for tracking scroll direction numeric value
  const scrollDirectionValue = useMotionValue(0);
  
  // Update the motion value based on scroll direction
  React.useEffect(() => {
    scrollDirectionValue.set(scrollDirection === 'up' ? 0 : -100);
  }, [scrollDirection, scrollDirectionValue]);
  
  // Transform header styles based on scroll position
  const headerY = useTransform(
    scrollY, // This is now a MotionValue from context
    [0, 100], 
    [0, scrollDirectionValue]
  );
  
  const headerOpacity = useTransform(
    scrollY, // This is now a MotionValue from context
    [0, 50],
    [1, 0.95]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header 
      ref={headerRef}
      style={{ 
        y: headerY,
        opacity: headerOpacity
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/30 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <span className="text-2xl font-display font-bold text-gradient">RISHI</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}          <a 
            href="#contact" 
            className="px-5 py-2 rounded-md border border-purple-500/50 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-fuchsia-600/30 transition-all duration-300 text-sm font-medium"
          >
            Get in Touch
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg text-gray-300 hover:text-white py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}            <a 
              href="#contact" 
              className="px-5 py-3 rounded-md border border-purple-500/50 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-fuchsia-600/30 transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
