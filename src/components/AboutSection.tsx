
import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useSectionAnimation } from '../hooks/useSectionAnimation';

const AboutSection = () => {
  const { ref, progress, inView } = useSectionAnimation({ threshold: 0.1 });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

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
  
  // Animations based on scroll progress - removed rotate animation
  const profileImageScale = useTransform(progress, [0, 0.3], [0.9, 1]);
  const profileImageY = useTransform(progress, [0, 0.3], [30, 0]);
  const cardBgOpacity = useTransform(progress, [0.1, 0.5], [0, 0.8]);
  const glowOpacity = useTransform(progress, [0.2, 0.6], [0, 0.5]);
  const contentY = useTransform(progress, [0.1, 0.4], [50, 0]);

  return (
    <section id="about" ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10 z-0"></div>
      <motion.div 
        className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.2, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-5xl font-display font-bold mb-12 text-center"
          >
            About <span className="text-gradient">Me</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Profile Image - Removed rotation */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-1 flex justify-center"
              style={{
                y: profileImageY,
                scale: profileImageScale
              }}
            >
              <div className="relative group">
                {/* Animated background elements */}
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur-lg group-hover:opacity-100 transition duration-1000"
                  style={{ opacity: glowOpacity }}
                  animate={{
                    background: [
                      "linear-gradient(90deg, rgba(37,99,235,0.3) 0%, rgba(168,85,247,0.3) 50%, rgba(236,72,153,0.3) 100%)",
                      "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.3) 100%)",
                      "linear-gradient(270deg, rgba(37,99,235,0.3) 0%, rgba(168,85,247,0.3) 50%, rgba(236,72,153,0.3) 100%)",
                      "linear-gradient(0deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.3) 100%)",
                      "linear-gradient(90deg, rgba(37,99,235,0.3) 0%, rgba(168,85,247,0.3) 50%, rgba(236,72,153,0.3) 100%)"
                    ]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                
                {/* Card containing profile image */}
                <motion.div 
                  className="relative overflow-hidden rounded-xl bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-md border border-white/10 p-2 group-hover:border-indigo-500/50 transition duration-300"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(79, 70, 229, 0.4)" 
                  }}
                >
                  {/* Profile image container with holographic frame effect */}
                  <div className="relative overflow-hidden rounded-lg aspect-[3/4] w-full max-w-[240px]">
                    {/* Animated holographic border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift"></div>
                    
                    <div className="absolute inset-[2px] overflow-hidden rounded-lg bg-black">
                      <img 
                        src="/lovable-uploads/bceda71f-9a59-48a9-ac6a-f46d79204936.png" 
                        alt="Rishikarthik Velliangiri" 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Subtle overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Name plate */}
                  <div className="mt-4 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer"></div>
                    <h3 className="text-xl font-display font-medium">Rishikarthik Velliangiri</h3>
                    <p className="text-sm text-blue-400">Software Engineer</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* About content */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-2"
              style={{ y: contentY }}
            >
              {/* Bio content with futuristic design */}
              <motion.div 
                className="glass-card p-8 backdrop-blur-md rounded-xl relative overflow-hidden"
                style={{ backgroundColor: `rgba(0,0,0,${cardBgOpacity})` }}
              >
                {/* Ambient glow effects */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>
                <div className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm"></div>
                
                {/* Animated hex grid background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSI0OSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzc3IiBzdHJva2Utd2lkdGg9Ii41IiBkPSJNNDMgMWwxOSAzM20wIDBsMTkgMzNNNjIgMzRMMjQgMzRtMCAwTDUgMW0wIDBsMTkgMzNtMCAwTDUgNjdNNSAxaDM4bTAgMGgzOE00MyA2N0gyNG0wIDBINW0zOCAwaDM4Ii8+PC9zdmc+')] bg-[length:24px_24px]"></div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Hands-on Computer Science Student at Flame University, experienced in delivering website development skills. 
                    I have intermediate knowledge of full-stack and web-based applications, bringing a unique perspective to 
                    technological challenges.
                  </p>
                  
                  <p className="text-lg text-gray-300 leading-relaxed mb-8">
                    I'm an innovative change agent with a unique mix of high-level technology direction and deep technical expertise.
                    My passion lies in artificial intelligence, web development, and solving complex problems through creative technical solutions.
                    I constantly seek opportunities to expand my knowledge and skills in the rapidly evolving tech landscape.
                  </p>
                  
                  {/* Interactive buttons with futuristic effects */}
                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      href="mailto:rishikarthikv@gmail.com"
                      className="group relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-br from-blue-800/50 to-indigo-900/50 backdrop-blur-sm border border-white/10 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail size={16} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                      <span>Email Me</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ mixBlendMode: 'overlay' }}
                      />
                    </motion.a>
                    
                    <motion.a
                      href="https://bit.ly/rishikarthikv"
                      className="group relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-br from-indigo-800/50 to-purple-900/50 backdrop-blur-sm border border-white/10 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin size={16} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      <span>LinkedIn</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ mixBlendMode: 'overlay' }}
                      />
                    </motion.a>
                    
                    <motion.a
                      href="https://github.com/RishikarthikVelliangiri"
                      className="group relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-br from-purple-800/50 to-pink-900/50 backdrop-blur-sm border border-white/10 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                      <span>GitHub</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ mixBlendMode: 'overlay' }}
                      />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Contact quick info - fixed overlap by adding more margin-top */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            <a 
              href="tel:+918431680193" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone size={18} className="text-green-400" />
              <span>+91 8431680193</span>
            </a>
            <a 
              href="mailto:rishikarthikv@gmail.com" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Mail size={18} className="text-blue-400" />
              <span>rishikarthikv@gmail.com</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
