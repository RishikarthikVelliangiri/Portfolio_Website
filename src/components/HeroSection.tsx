
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Nebula object as background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <spline-viewer 
          url="https://prod.spline.design/6jC6Np8SC0qdn5hZ/scene.splinecode" 
          className="w-full h-full"
        />
      </div>
      
      {/* Overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-[1]" />
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 mt-[-80px]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-bold mb-4 leading-tight tracking-tighter">
            <span className="text-gradient glow transform hover:scale-105 transition-transform duration-300 block">Visionary</span> 
            <span className="transform translate-x-8 inline-block">Digital Craftsman</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 mt-4 leading-relaxed backdrop-blur-sm py-2 px-4 rounded-xl border border-white/10 transform hover:translate-y-[-5px] transition-all duration-300">
            Pushing the boundaries of design with innovative digital experiences that inspire and transform.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-start">
            <a href="#products" className="group relative overflow-hidden rounded-lg btn-primary flex items-center justify-center gap-2 transform hover:translate-y-[-5px] transition-all duration-300">
              <span className="relative z-10">Explore My Work</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.8)_0%,rgba(0,0,0,0)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-150"></div>
            </a>
            <a href="#vision" className="px-6 py-3 border border-white/20 backdrop-blur-sm rounded-lg font-medium transition-all duration-300 hover:border-white/40 hover:bg-white/5 transform hover:translate-y-[-5px] relative overflow-hidden group">
              <span className="relative z-10">My Vision</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Dynamic cursor indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2">
        <p className="text-sm text-white/70">Interact with the nebula</p>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center items-start p-1">
          <div className="w-1 h-2 bg-white/80 rounded-full animate-pulse-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
