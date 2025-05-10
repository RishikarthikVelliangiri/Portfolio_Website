
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceProps {
  title: string;
  company: string;
  duration: string;
  description: string[];
  index: number;
}

const ExperienceCard: React.FC<ExperienceProps> = ({ title, company, duration, description, index }) => {
  return (
    <motion.div 
      className="group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          delay: 0.1 * index
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="glass-card p-6 md:p-8 rounded-xl backdrop-blur-md relative overflow-hidden hover-card group">
        {/* Top corner decoration */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 blur-xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-display font-semibold text-white group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-lg text-blue-300">{company}</p>
          </div>
          
          <div className="md:ml-auto flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            <Calendar size={14} />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="space-y-2 pl-0 md:pl-16">
          {description.map((item, idx) => (
            <p key={idx} className="text-gray-300 leading-relaxed">
              • {item}
            </p>
          ))}
        </div>
        
        {/* Bottom border glow effect */}
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.7, delay: 0.2 * index }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
      
      {/* Connection line for timeline */}
      {index < 4 && (
        <div className="hidden md:block h-8 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent mx-auto"></div>
      )}
    </motion.div>
  );
};

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Software Intern",
      company: "Mandrake Technology Consulting LLP",
      duration: "Sep 2024 - Present",
      description: [
        "Learning Java, SpringBoot, Maven, dev containers, SQL",
        "Working on URL shortener project",
        "Developing practical software engineering skills in a professional environment"
      ]
    },
    {
      title: "Software Intern",
      company: "WillWali",
      duration: "May 2024 - Aug 2024",
      description: [
        "Website development using Bubble and Python",
        "Testing and bug fixing for web applications",
        "Gained insights into CS processes and remote collaboration methodologies"
      ]
    },
    {
      title: "Webpage Manager",
      company: "Center for Land Governance",
      duration: "Nov 2023 - Feb 2024",
      description: [
        "Developing style guides for consistent web presence",
        "Designing and maintaining websites for land rights organization",
        "Content creation and stakeholder analysis for land rights, agriculture, and sustainable development"
      ]
    },
    {
      title: "Intern",
      company: "AnandaSagara",
      duration: "Apr 2023 - Aug 2023",
      description: [
        "Developed exam software for NGO children using HTML, CSS, JS, and Jotform",
        "Created and edited videos for fundraising campaigns",
        "Improved educational access through technology solutions"
      ]
    },
    {
      title: "Technology Volunteer",
      company: "TEDxFlame University",
      duration: "Nov 2023 - Jan 2023",
      description: [
        "Provided technical support for events",
        "Ensured functionality of presentations and microphones",
        "Conducted system testing and performance monitoring"
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.h2 
          className="text-3xl md:text-5xl font-display font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Professional <span className="text-gradient">Experience</span>
        </motion.h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={`${experience.company}-${index}`}
              {...experience} 
              index={index} 
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl text-gray-300 mb-6">Additional Experience</h3>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              "UG2 WillWali (Software Developer)",
              "Center for Land Governance (ILDC Event)",
              "FLAME University Writing Centre (Social Media)",
              "Lifology Global Fellowship Program",
              "STEM - Physician and Chemical Sciences Internship"
            ].map((item, index) => (
              <motion.div
                key={item}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    delay: 0.05 * index
                  }
                }}
                viewport={{ once: true }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
