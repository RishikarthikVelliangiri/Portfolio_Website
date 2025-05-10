
import React, { useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';

// Real projects data
const projects: Product[] = [
  {
    id: '1',
    title: 'Synthetica',
    category: 'AI Tool',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An AI-powered synthetic data generator that can output data in various formats.',
    link: 'https://synthetica-beta-vercel-6v24s9y0g.vercel.app/',
    github: 'https://github.com/RishikarthikVelliangiri/synthetica'
  },
  {
    id: '2',
    title: 'Recipe Score Predictor',
    category: 'Machine Learning',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Using a dataset of recipes and reviews, this Streamlit app predicts recipe scores based on user-adjustable features.',
    link: 'https://buan304project.streamlit.app/',
    github: 'https://github.com/RishikarthikVelliangiri/recipe-predictor'
  },
  {
    id: '3',
    title: 'Instagram Reposter',
    category: 'Automation',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Automates posting YouTube/Instagram reels and shorts to your Instagram account with custom captions and hashtags.',
    github: 'https://github.com/RishikarthikVelliangiri/instagram-reposter'
  },
  {
    id: '4',
    title: 'VoceDraftAI',
    category: 'AI Tool',
    imageUrl: 'https://images.unsplash.com/photo-1633432695901-72db694341ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Transcribes audio files using Azure Speech API and generates multiple outputs like emails, notes, or task lists using Gemini.',
    github: 'https://github.com/RishikarthikVelliangiri/voce-draft-ai'
  },
  {
    id: '5',
    title: 'Coming Soon',
    category: 'Future Project',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An exciting new project in development. Stay tuned for updates!'
  },
  {
    id: '6',
    title: 'In Development',
    category: 'Research',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A research-oriented project exploring new technologies and methodologies.'
  }
];

const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredProducts = activeCategory === 'All' 
    ? projects 
    : projects.filter(product => product.category === activeCategory);
    
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
        
        {/* Category filter */}
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
        </motion.div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              variants={itemVariants}
              className="h-full"
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
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
