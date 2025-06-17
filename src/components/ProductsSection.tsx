
import React, { useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Code, Gamepad2, FileText } from 'lucide-react';

// Real projects data
const projects: Product[] = [
  {
    id: '1',
    title: 'AI SaaS Architect Genesis',
    category: 'AI Tool',
    imageUrl: '/ai-saas-architect-cover.svg',
    description: 'An AI-powered service that generates comprehensive workflows and tech stack recommendations for SaaS ideas provided by users.',
    link: 'https://saa-s-workflow-generator.vercel.app/',
    github: 'https://github.com/RishikarthikVelliangiri/SaaS-Workflow-Generator'
  },
  {
    id: '2',
    title: 'Synthetica',
    category: 'AI Tool',
    imageUrl: '/synthetica-logo.svg',
    description: 'An AI-powered synthetic data generator that can output data in various formats.',
    link: 'https://synthetica-beta-vercel-6v24s9y0g.vercel.app/',
    github: 'https://github.com/RishikarthikVelliangiri/synthetica'
  },
  {
    id: '3',
    title: 'Recipe Score Predictor',
    category: 'Machine Learning',
    imageUrl: '/recipe-predictor-cover.svg',
    description: 'Using a dataset of recipes and reviews, this Streamlit app predicts recipe scores based on user-adjustable features.',
    link: 'https://buan304project.streamlit.app/',
    github: 'https://github.com/RishikarthikVelliangiri/recipe-predictor'
  },
  {
    id: '4',
    title: 'Instagram Reposter',
    category: 'Automation',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Automates posting YouTube/Instagram reels and shorts to your Instagram account with custom captions and hashtags.',
    github: 'https://github.com/RishikarthikVelliangiri/instagram-reposter'
  },
  {
    id: '5',
    title: 'VoceDraftAI',
    category: 'AI Tool',
    imageUrl: 'https://images.unsplash.com/photo-1633432695901-72db694341ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Transcribes audio files using Azure Speech API and generates multiple outputs like emails, notes, or task lists using Gemini.',
    github: 'https://github.com/RishikarthikVelliangiri/voce-draft-ai'
  },
  {
    id: '6',
    title: 'VR Goalkeeper Simulator',
    category: 'VR Game',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A goalkeeper game designed for VR headsets using Unity. Users load into a menu to start the game and must block 10 penalty shots to obtain a high score.',
    github: 'https://github.com/RishikarthikVelliangiri/Graphics_Unity',
    status: 'Under Development'
  }
];

// Extract unique categories for the filter
const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedProjects, setDisplayedProjects] = useState(projects);
  
  // Update the filtering logic to use state for displayed projects
  React.useEffect(() => {
    const filtered = activeCategory === 'All' 
      ? projects 
      : projects.filter(product => product.category === activeCategory);
    setDisplayedProjects(filtered);
  }, [activeCategory]);
    
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
        stiffness: 50,
        damping: 8
      }
    }
  };
  
  return (
    <section id="projects" className="py-24 bg-background relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10"></div>
      <motion.div 
        className="absolute top-40 right-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-gray-400">
            Explore my portfolio of innovative digital solutions and applications.
          </p>
        </motion.div>
        
        {/* Category filter - Fix the click handling */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-neon' 
                  : 'bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>        {/* Projects grid - With AnimatePresence outside the grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            key={activeCategory} // This key makes the grid re-render when category changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {displayedProjects.map((product, index) => (
              <motion.div 
                key={product.id}
                variants={itemVariants}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    delay: index * 0.1,
                    duration: 0.3
                  }
                }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Featured Project */}
        <motion.div 
          variants={itemVariants}
          className="mt-24 max-w-5xl mx-auto glass-card p-6 md:p-8 rounded-xl backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>
          
          <h3 className="text-2xl font-display font-semibold mb-2 text-gradient">Want to collaborate?</h3>
          <p className="text-gray-300 mb-6">
            I'm always open to discussing new projects and creative ideas. Feel free to reach out if you're interested in working together.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="#contact" 
              className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium inline-flex items-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <span>Get in touch</span>
              <ExternalLink size={16} />
            </a>
            <a 
              href="https://github.com/RishikarthikVelliangiri" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-md border border-white/20 text-white font-medium inline-flex items-center gap-2 hover:bg-white/5 transition-all"
            >
              <span>View GitHub</span>
              <Github size={16} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductsSection;
