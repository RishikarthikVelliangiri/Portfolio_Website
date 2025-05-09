
import React, { useState } from 'react';
import ProductCard, { Product } from './ProductCard';

// Sample product data
const products: Product[] = [
  {
    id: '1',
    title: 'Neural Interface System',
    category: 'Digital Experience',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An immersive digital experience that adapts to user interaction and provides responsive feedback.'
  },
  {
    id: '2',
    title: 'Quantum Visualization',
    category: 'Data Art',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Complex data structures transformed into beautiful, interactive visual experiences.'
  },
  {
    id: '3',
    title: 'Echo Chamber',
    category: 'Sound Design',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A spatial audio experience that reacts to environmental inputs and user movement.'
  },
  {
    id: '4',
    title: 'Peripheral Vision',
    category: 'Visual System',
    imageUrl: 'https://images.unsplash.com/photo-1633432695901-72db694341ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An adaptive visual interface that enhances peripheral awareness through subtle design cues.'
  },
  {
    id: '5',
    title: 'Resonance Field',
    category: 'Interactive Art',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An interactive field of light and sound that responds to collective audience participation.'
  },
  {
    id: '6',
    title: 'Tactile Response',
    category: 'Haptic Design',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A sophisticated haptic feedback system that creates immersive sensory experiences.'
  }
];

const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  return (
    <section id="products" className="py-24 bg-background relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Showcase
          </h2>
          <p className="text-xl text-gray-400">
            Explore our portfolio of innovative digital products and experiences.
          </p>
        </div>
        
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' 
                  : 'bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="animate-fadeInUp">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
