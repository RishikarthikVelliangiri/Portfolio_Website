
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Share2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  
  // Mock product data - in a real app this would come from an API
  const product = {
    id,
    title: 'Neural Interface System',
    category: 'Digital Experience',
    description: 'An immersive digital experience that adapts to user interaction and provides responsive feedback through advanced algorithms and sensory inputs. The system learns from user behavior to create increasingly personalized experiences that evolve over time.',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1633432695901-72db694341ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    features: [
      'Adaptive user experience',
      'Real-time feedback system',
      'Advanced learning algorithms',
      'Multiple sensory integration',
      'Customizable interface options'
    ]
  };
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Products</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product images */}
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden neon-border">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {product.galleryImages.map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-white/10 hover-card">
                    <img 
                      src={img} 
                      alt={`${product.title} ${index + 1}`} 
                      className="w-full h-auto aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product details */}
            <div>
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                {product.title}
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {product.description}
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3"></span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary flex items-center gap-2">
                  <Eye size={16} />
                  View Demo
                </button>
                <button className="px-6 py-3 border border-white/20 rounded-md font-medium transition-all duration-300 hover:border-white/40 flex items-center gap-2">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
