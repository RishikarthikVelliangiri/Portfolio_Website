
import React from 'react';
import { motion } from 'framer-motion';

interface SkillBarProps {
  name: string;
  proficiency: number; // 1-5
  color?: string;
  delay?: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, proficiency, color = "bg-blue-500", delay = 0 }) => {
  const percentage = (proficiency / 5) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm text-gray-400">{proficiency}/5</span>
      </div>
      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            delay: delay,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
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
      y: 0
    }
  };
  
  const skillSets = [
    {
      name: "Programming Languages & Technologies",
      skills: [
        { name: "C++", proficiency: 3, color: "bg-blue-500" },
        { name: "SQL", proficiency: 4, color: "bg-indigo-500" },
        { name: "Python", proficiency: 4, color: "bg-purple-500" },
        { name: "Java", proficiency: 3, color: "bg-pink-500" },
        { name: "Web Development (HTML, CSS, JavaScript)", proficiency: 4, color: "bg-blue-400" },
        { name: "Artificial Intelligence", proficiency: 3, color: "bg-indigo-400" }
      ]
    },
    {
      name: "Computer Platforms & Software",
      skills: [
        { name: "Canva", proficiency: 4, color: "bg-purple-400" },
        { name: "Google Suite", proficiency: 5, color: "bg-blue-500" },
        { name: "Unity", proficiency: 3, color: "bg-green-500" },
        { name: "Excel", proficiency: 4, color: "bg-indigo-500" },
        { name: "DaVinci Editing Software", proficiency: 3, color: "bg-pink-500" },
        { name: "AWS services platform", proficiency: 3, color: "bg-orange-500" },
        { name: "MySQL", proficiency: 4, color: "bg-blue-400" }
      ]
    },
    {
      name: "Languages",
      skills: [
        { name: "English", proficiency: 5, color: "bg-blue-500" }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-5"></div>
      
      <motion.div 
        className="container mx-auto px-4 md:px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-display font-bold mb-12 text-center"
          variants={itemVariants}
        >
          Technical <span className="text-gradient">Skills</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillSets.map((skillSet, index) => (
            <motion.div
              key={skillSet.name}
              variants={itemVariants}
              className="glass-card p-6 rounded-xl backdrop-blur-md relative overflow-hidden group hover-card"
              whileHover={{
                boxShadow: "0 0 25px rgba(79, 70, 229, 0.2)"
              }}
            >
              {/* Ambient glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <h3 className="text-xl font-display font-semibold mb-6 text-gradient">{skillSet.name}</h3>
              
              <div className="space-y-4">
                {skillSet.skills.map((skill, skillIndex) => (
                  <SkillBar 
                    key={skill.name}
                    name={skill.name}
                    proficiency={skill.proficiency}
                    color={skill.color}
                    delay={0.1 * skillIndex}
                  />
                ))}
              </div>
              
              {/* Bottom border glow */}
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
              ></motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Skill Constellation */}
        <motion.div 
          className="mt-20 pt-10 relative"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-display font-semibold mb-8 text-center">Tools & Technologies</h3>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-5">
            {[
              "Audacity", "iMovie", "Notepad++", "XAMPP", "Microsoft Office", 
              "SpringBoot", "Maven", "Dev Containers", "HTML", "CSS", "JavaScript",
              "React", "TailwindCSS", "Git", "GitHub", "Bootstrap"
            ].map((tech, index) => (
              <motion.div
                key={tech}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.03 * index
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  boxShadow: "0 0 15px rgba(79, 70, 229, 0.3)"
                }}
                viewport={{ once: true }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
