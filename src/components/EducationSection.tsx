
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Calendar } from 'lucide-react';

interface EducationItemProps {
  institution: string;
  degree: string;
  duration: string;
  description?: string;
  index: number;
}

const EducationItem: React.FC<EducationItemProps> = ({ institution, degree, duration, description, index }) => {
  return (
    <motion.div 
      className="glass-card p-6 rounded-xl backdrop-blur-md relative overflow-hidden hover-card"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ 
        opacity: 1, 
        x: 0,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 8,
          delay: 0.1 * index
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        boxShadow: "0 0 25px rgba(79, 70, 229, 0.2)"
      }}
    >
      {/* Top corner decoration */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 blur-xl rounded-full"></div>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
          <Book className="w-6 h-6 text-blue-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-display font-semibold text-white mb-1">{institution}</h3>
          <p className="text-blue-400 mb-2">{degree}</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Calendar size={14} />
            <span>{duration}</span>
          </div>
          
          {description && (
            <p className="text-gray-300">{description}</p>
          )}
        </div>
      </div>
      
      {/* Bottom border glow effect */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      ></motion.div>
    </motion.div>
  );
};

const EducationSection = () => {
  const educationItems = [
    {
      institution: "Flame University",
      degree: "B.Sc. Honours, Computer Science Major, Business Analytics Minor",
      duration: "Aug 2022 - Present",
      description: "Specializing in computer science with a focus on business analytics applications and practical software development."
    },
    {
      institution: "Ebenezer International School",
      degree: "International Baccalaureate Diploma Program",
      duration: "2020 - 2022",
      description: "Rigorous international curriculum with focus on critical thinking and global perspective."
    },
    {
      institution: "Silver Oaks International School",
      degree: "IB Middle Years Programme (MYP)",
      duration: "2018 - 2020"
    },
    {
      institution: "Westside Middle School Academy",
      degree: "Common Core (CC)",
      duration: "2016 - 2018"
    }
  ];

  return (
    <section id="education" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient">Education</span> Journey
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            My academic path has equipped me with both theoretical knowledge and practical skills in computer science and related fields.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationItems.map((item, index) => (
            <EducationItem 
              key={item.institution}
              {...item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
