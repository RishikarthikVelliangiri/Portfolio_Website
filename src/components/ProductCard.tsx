
import React, { useState } from 'react';
import { Eye, ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link?: string;
  github?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="glass-card rounded-xl overflow-hidden hover-card group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        boxShadow: "0 0 30px rgba(79, 70, 229, 0.2)"
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Quick actions overlay */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ease-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {product.link && (
            <motion.a 
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform hover:scale-110 hover:bg-white/20"
              whileHover={{ 
                scale: 1.2,
                boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)"
              }}
            >
              <ExternalLink size={18} className="text-white" />
            </motion.a>
          )}
          
          {product.github && (
            <motion.a 
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform hover:scale-110 hover:bg-white/20"
              whileHover={{ 
                scale: 1.2,
                boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)"
              }}
            >
              <Github size={18} className="text-white" />
            </motion.a>
          )}
        </div>
        
        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-display font-medium mb-2 group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
          {product.link ? (
            <a 
              href={product.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm font-medium inline-flex items-center hover:text-blue-300 transition-colors"
            >
              <span>Visit Project</span>
              <ArrowUpRight size={14} className="ml-1" />
            </a>
          ) : product.github ? (
            <a 
              href={product.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 text-sm font-medium inline-flex items-center hover:text-purple-300 transition-colors"
            >
              <span>View Code</span>
              <Github size={14} className="ml-1" />
            </a>
          ) : (
            <span className="text-gray-500 text-sm font-medium">Coming Soon</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
