
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

const AboutSection = () => {
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

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
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
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-5xl font-display font-bold mb-6 text-center"
          >
            About <span className="text-gradient">Me</span>
          </motion.h2>
          
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <div className="inline-block relative mb-4">
              <div className="absolute inset-0 blur-md bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1636622433525-127afdf3662d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" 
                alt="Rishikarthik Velliangiri" 
                className="w-32 h-32 object-cover rounded-full border-2 border-white/20 shadow-xl"
              />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-1">Rishikarthik Velliangiri</h3>
            <p className="text-lg text-blue-400">Software Intern</p>
            <p className="text-gray-400 mb-6">Bengaluru, Karnataka</p>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <a 
              href="mailto:rishikarthikv@gmail.com" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Mail size={18} className="text-blue-400" />
              <span>rishikarthikv@gmail.com</span>
            </a>
            <a 
              href="tel:+918431680193" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone size={18} className="text-green-400" />
              <span>+91 8431680193</span>
            </a>
            <a 
              href="https://bit.ly/rishikarthikv" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Linkedin size={18} className="text-blue-500" />
              <span>Rishikarthik Velliangiri</span>
            </a>
            <a 
              href="https://github.com/RishikarthikVelliangiri" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Github size={18} className="text-purple-400" />
              <span>RishikarthikVelliangiri</span>
            </a>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="glass-card p-8 backdrop-blur-md rounded-xl relative overflow-hidden"
          >
            {/* Ambient glow effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm"></div>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Hands-on Computer Science Student at Flame University, experienced in delivering website development skills. 
              I have intermediate knowledge of full-stack and web-based applications, bringing a unique perspective to 
              technological challenges.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              I'm an innovative change agent with a unique mix of high-level technology direction and deep technical expertise.
              My passion lies in artificial intelligence, web development, and solving complex problems through creative technical solutions.
              I constantly seek opportunities to expand my knowledge and skills in the rapidly evolving tech landscape.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
