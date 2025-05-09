
import React, { useState } from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="glass-card rounded-xl overflow-hidden hover-card group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <Link 
            to={`/product/${product.id}`}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform hover:scale-110 hover:bg-white/20"
          >
            <ArrowUpRight size={18} className="text-white" />
          </Link>
          <button 
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform hover:scale-110 hover:bg-white/20"
          >
            <Eye size={18} className="text-white" />
          </button>
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
      </div>
    </div>
  );
};

export default ProductCard;
