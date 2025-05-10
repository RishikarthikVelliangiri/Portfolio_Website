
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, Phone, Github, Linkedin, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { motion, useAnimation, useInView } from 'framer-motion';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  // Dynamic glow effect states
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (sectionRef.current) {
      sectionRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (sectionRef.current) {
        sectionRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [sectionRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulated form submission with animation delay
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "I'll get back to you as soon as possible.",
        variant: "default",
      });
      
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // Reset form after showing success animation
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setFormSubmitted(false);
      }, 2000);
    }, 1500);
  };

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

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 0 25px rgba(76, 81, 191, 0.5)"
    },
    tap: { scale: 0.95 }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Interactive dynamic glow effect that follows cursor */}
      <div 
        className="pointer-events-none absolute opacity-30"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90, 120, 255, 0.4) 0%, rgba(90, 120, 255, 0) 70%)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.2s ease-out, top 0.2s ease-out',
          zIndex: 0
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <motion.div 
          className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
      </div>
      
      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              variants={itemVariants}
              className="inline-block relative mb-3"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-px">
                <div className="bg-black rounded-full p-2">
                  <Send className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-display font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl mx-auto">
              Interested in collaborating or want to learn more about my projects? I'd love to hear from you.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              {/* Contact cards with animated hover states */}
              <motion.a
                href="mailto:rishikarthikv@gmail.com" 
                className="glass-card rounded-xl p-6 block hover:border-blue-500/30 transition-all duration-300"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(76, 81, 191, 0.3)" }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 relative group">
                    <Mail className="w-6 h-6 text-blue-400 relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-blue-500/10 rounded-lg"
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(76, 81, 191, 0)", "0 0 10px rgba(76, 81, 191, 0.5)", "0 0 0px rgba(76, 81, 191, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:text-blue-400 transition-colors">Email</h3>
                    <p className="text-gray-400">rishikarthikv@gmail.com</p>
                  </div>
                </div>
              </motion.a>
              
              <motion.div
                className="glass-card rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(124, 58, 237, 0.3)" }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 relative">
                    <MapPin className="w-6 h-6 text-purple-400" />
                    <motion.div
                      className="absolute inset-0 bg-purple-500/10 rounded-lg"
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(124, 58, 237, 0)", "0 0 10px rgba(124, 58, 237, 0.5)", "0 0 0px rgba(124, 58, 237, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Location</h3>
                    <p className="text-gray-400">Bengaluru, Karnataka</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.a
                href="tel:+918431680193" 
                className="glass-card rounded-xl p-6 block hover:border-green-500/30 transition-all duration-300"
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(34, 197, 94, 0.3)" }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 relative">
                    <Phone className="w-6 h-6 text-green-400" />
                    <motion.div
                      className="absolute inset-0 bg-green-500/10 rounded-lg"
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 10px rgba(34, 197, 94, 0.5)", "0 0 0px rgba(34, 197, 94, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Phone</h3>
                    <p className="text-gray-400">+91 8431680193</p>
                  </div>
                </div>
              </motion.a>
              
              {/* Social links */}
              <div className="pt-6">
                <h3 className="text-lg font-medium mb-4">Connect with me</h3>
                <div className="flex space-x-4">
                  <motion.a 
                    href="https://github.com/RishikarthikVelliangiri" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 hover:border-purple-500/30 transition-colors"
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(124, 58, 237, 0.3)",
                      rotate: [0, -10, 10, -10, 0]
                    }}
                    transition={{
                      rotate: { duration: 0.5 }
                    }}
                  >
                    <Github className="w-5 h-5 text-gray-400 hover:text-purple-400 transition-colors" />
                  </motion.a>
                  
                  <motion.a 
                    href="https://bit.ly/rishikarthikv" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="p-3 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 hover:border-blue-500/30 transition-colors"
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(37, 99, 235, 0.3)",
                      rotate: [0, -10, 10, -10, 0]
                    }}
                    transition={{
                      rotate: { duration: 0.5 }
                    }}
                  >
                    <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
            
            {/* Contact form */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              {formSubmitted ? (
                <motion.div
                  className="glass-card rounded-xl p-8 md:p-12 backdrop-blur-md flex flex-col items-center justify-center text-center min-h-[400px]"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">Message Sent!</h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Thank you for reaching out! I'll get back to you as soon as possible.
                  </p>
                  <motion.button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 text-white font-medium inline-flex items-center gap-2 hover:bg-black/70 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Send another message</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  ref={formRef}
                  onSubmit={handleSubmit} 
                  className="relative glass-card rounded-xl p-6 md:p-8 backdrop-blur-md"
                >
                  {/* Form glow effect for the focused field */}
                  {focusedField && (
                    <motion.div 
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        boxShadow: "0 0 30px rgba(76, 81, 191, 0.2), inset 0 0 20px rgba(76, 81, 191, 0.1)"
                      }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  
                  <div className="space-y-6 relative">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Your Name
                      </label>
                      <motion.div
                        animate={
                          focusedField === 'name' 
                            ? { boxShadow: "0 0 15px rgba(76, 81, 191, 0.3)" } 
                            : { boxShadow: "0 0 0px rgba(76, 81, 191, 0)" }
                        }
                        className="relative"
                      >
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => handleFocus('name')}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 rounded-lg outline-none transition-all duration-300"
                          placeholder="Enter your name"
                        />
                      </motion.div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Your Email
                      </label>
                      <motion.div
                        animate={
                          focusedField === 'email' 
                            ? { boxShadow: "0 0 15px rgba(76, 81, 191, 0.3)" } 
                            : { boxShadow: "0 0 0px rgba(76, 81, 191, 0)" }
                        }
                        className="relative"
                      >
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus('email')}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 rounded-lg outline-none transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </motion.div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Your Message
                      </label>
                      <motion.div
                        animate={
                          focusedField === 'message' 
                            ? { boxShadow: "0 0 15px rgba(76, 81, 191, 0.3)" } 
                            : { boxShadow: "0 0 0px rgba(76, 81, 191, 0)" }
                        }
                        className="relative"
                      >
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => handleFocus('message')}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 rounded-lg outline-none transition-all duration-300 resize-none"
                          placeholder="Type your message here..."
                        ></textarea>
                      </motion.div>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium relative overflow-hidden group"
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {/* Button background animation */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ x: ["0%", "100%", "0%"] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      />
                      
                      {/* Button content */}
                      <div className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.div 
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                            >
                              <Send size={16} />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
