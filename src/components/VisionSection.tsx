
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const VisionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: buildThresholdList()
    };
    
    // Create a list of thresholds for smoother animations
    function buildThresholdList() {
      let thresholds = [];
      let numSteps = 50;
      
      for (let i = 1; i <= numSteps; i++) {
        let ratio = i / numSteps;
        thresholds.push(ratio);
      }
      
      return thresholds;
    }
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        // If the section is visible to some degree
        if (entry.isIntersecting) {
          const intersectionRatio = entry.intersectionRatio;
          const opacity = Math.min(1, intersectionRatio * 1.5);
          
          // Apply animations based on visibility
          if (contentRef.current) {
            contentRef.current.style.opacity = opacity.toString();
            contentRef.current.style.transform = `translateY(${(1 - intersectionRatio) * 80}px)`;
          }
          
          // Handle parallax elements
          const parallaxElements = sectionRef.current?.querySelectorAll('.parallax');
          parallaxElements?.forEach((el, i) => {
            const speed = (i % 3 + 1) * 0.05;
            const translateY = (1 - intersectionRatio) * speed * 200;
            (el as HTMLElement).style.transform = `translateY(${-translateY}px)`;
          });
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    // Handle scroll animations
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // Calculate how far into the section we've scrolled (0 to 1)
      const scrollProgress = 1 - Math.max(0, Math.min(1, sectionTop / windowHeight));
      
      // Use this value to control parallax effects
      const parallaxElements = sectionRef.current.querySelectorAll('.parallax');
      parallaxElements.forEach((el, i) => {
        const speed = (i % 3 + 1) * 0.05;
        (el as HTMLElement).style.transform = `translateY(${-scrollProgress * speed * 100}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants for elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section id="vision" ref={sectionRef} className="py-24 min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-blue-950/20 to-background flex items-center">
      {/* Abstract shapes with futuristic colors */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-[100px] parallax"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-[80px] parallax"></div>
      <div className="absolute top-1/2 left-1/3 w-52 h-52 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-[60px] parallax"></div>
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-[70px] parallax"></div>
      
      {/* Futuristic background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(155,135,245,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(155,135,245,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div 
          ref={contentRef}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 opacity-0 transform translate-y-20 transition-all duration-1000"
        >
          {/* Left column - Vision heading & abstract */}
          <div className="md:col-span-2 relative z-10">
            <div className="sticky top-32">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-gradient">
                My Vision
              </h2>
              
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                Innovating at the intersection of software development and artificial intelligence to create impactful digital experiences.
              </p>
              
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mb-8"></div>
              
              <div className="relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse-glow opacity-70"></div>
                </div>
                <div className="w-full h-full backdrop-blur-md bg-black/20 p-6 flex items-center justify-center z-10 relative">
                  <div className="text-center">
                    <span className="block text-4xl font-display font-bold mb-1">3+</span>
                    <span className="block text-sm uppercase tracking-wide text-gray-400">Years of Crafting</span>
                    <span className="block text-sm uppercase tracking-wide text-gradient font-medium">Digital Solutions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Content */}
          <div className="md:col-span-3 relative z-10">
            <ScrollArea className="h-[70vh] pr-4 rounded-md">
              <div className="space-y-16">
                <motion.div 
                  className="bg-black/30 backdrop-blur-sm rounded-3xl neon-border p-6 md:p-8 relative overflow-hidden"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {/* Decorative grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                  
                  <div className="relative">
                    <h3 className="text-2xl font-display font-medium mb-4 text-gradient">My Journey</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      As a hands-on Computer Science student at Flame University, I'm passionate about using technology to solve real-world problems. My intermediate knowledge of full-stack and web-based applications gives me a strong foundation to build innovative solutions.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Throughout my journey from Ebenezer International School to Flame University, I've consistently sought opportunities to expand my knowledge in rapidly evolving tech fields. My work at Mandrake Technology and experiences across various internships have shaped me into a versatile problem-solver with both technical depth and strategic vision.
                    </p>
                    
                    <div className="mt-8 flex justify-end">
                      <div className="w-20 h-20 relative bg-blue-500/10 rounded-full flex items-center justify-center overflow-hidden">
                        <div className="w-16 h-16 animate-spin-slow rounded-full border border-blue-500/30"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-black/30 backdrop-blur-sm rounded-3xl neon-border p-6 md:p-8 relative overflow-hidden"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                  
                  <div className="relative">
                    <h3 className="text-2xl font-display font-medium mb-4 text-gradient">My Creative Process</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <span className="text-blue-400 font-medium">01</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Discover & Define</h4>
                          <p className="text-gray-300 leading-relaxed">
                            Beginning with deep research and understanding, I define the core problems and opportunities that will guide the creative direction.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          <span className="text-indigo-400 font-medium">02</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Explore & Experiment</h4>
                          <p className="text-gray-300 leading-relaxed">
                            I embrace experimentation, exploring multiple creative directions through rapid prototyping to find unique solutions that stand out.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                          <span className="text-purple-400 font-medium">03</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Refine & Perfect</h4>
                          <p className="text-gray-300 leading-relaxed">
                            Through meticulous attention to detail and iterative refinement, I transform promising concepts into polished, exceptional work.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                          <span className="text-pink-400 font-medium">04</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Launch & Learn</h4>
                          <p className="text-gray-300 leading-relaxed">
                            After launching, I continue to analyze performance and gather insights to inform future iterations and improvements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-black/30 backdrop-blur-sm rounded-3xl neon-border p-6 md:p-8 relative overflow-hidden"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                  
                  <div className="relative">
                    <h3 className="text-2xl font-display font-medium mb-4 text-gradient">Philosophy</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      As an innovative change agent with both high-level technology direction and deep technical expertise, I believe that exceptional technology solutions emerge from a blend of creative thinking and disciplined execution.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/10">
                        <h4 className="text-lg font-medium mb-2">Purpose-Driven</h4>
                        <p className="text-gray-400 text-sm">Every design and development decision I make serves a clear purpose aimed at creating meaningful impact through technology.</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10">
                        <h4 className="text-lg font-medium mb-2">Human-Centered</h4>
                        <p className="text-gray-400 text-sm">I design for people first, creating experiences that solve real problems and resonate on a human level.</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/10">
                        <h4 className="text-lg font-medium mb-2">Elegantly Simple</h4>
                        <p className="text-gray-400 text-sm">I strive for the perfect balance of simplicity and functionality, removing unnecessary complexity in my solutions.</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/10">
                        <h4 className="text-lg font-medium mb-2">Future-Focused</h4>
                        <p className="text-gray-400 text-sm">My work anticipates future needs and technologies, building for longevity and adaptability in a rapidly changing digital landscape.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
