
import React, { useEffect, useRef } from 'react';

const VisionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="vision" ref={sectionRef} className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-blue-950/20 to-background">
      {/* Abstract shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-[100px] parallax"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-[80px] parallax"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl neon-border p-6 md:p-12 relative overflow-hidden">
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-10 text-center">
                Our <span className="text-gradient">Vision</span>
              </h2>
              
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-2/5">
                    <div className="rounded-xl overflow-hidden neon-border">
                      <img 
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Creative team" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-3/5">
                    <h3 className="text-2xl font-display font-medium mb-4">Pushing Boundaries</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      We believe in challenging the status quo and pushing the boundaries of what's possible in digital experiences. Our team of visionaries and innovators are committed to creating products that not only meet the needs of today but anticipate the demands of tomorrow.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Through a combination of cutting-edge technology, human-centered design principles, and a deep understanding of user psychology, we create digital experiences that captivate, inspire, and transform.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="w-full md:w-2/5">
                    <div className="rounded-xl overflow-hidden neon-border">
                      <img 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Design process" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-3/5">
                    <h3 className="text-2xl font-display font-medium mb-4">Our Process</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      At the heart of our approach is a collaborative design process that embraces experimentation and iteration. We start by deeply understanding the context and user needs, then explore multiple creative directions through rapid prototyping.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      This allows us to quickly test and refine ideas, ensuring that our final products are not only visually stunning but also intuitive and effective. Our commitment to excellence means we're never satisfied with "good enough" – we're always reaching for extraordinary.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
