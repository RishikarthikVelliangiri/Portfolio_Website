
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Flag } from 'lucide-react';

interface AwardProps {
  title: string;
  organization?: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const AwardCard: React.FC<AwardProps> = ({ title, organization, icon, color, index }) => {
  return (
    <motion.div 
      className="glass-card p-6 rounded-xl backdrop-blur-md relative overflow-hidden group hover-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 8,
          delay: 0.1 * index
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -5,
        boxShadow: "0 0 25px rgba(79, 70, 229, 0.2)"
      }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center border border-white/20`}>
          {icon}
        </div>
        
        <div>
          <h3 className="text-lg font-display font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          {organization && (
            <p className="text-sm text-gray-400">{organization}</p>
          )}
        </div>
      </div>
      
      {/* Ambient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Bottom border glow */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      ></motion.div>
    </motion.div>
  );
};

const LeadershipCard: React.FC<AwardProps> = ({ title, organization, icon, color, index }) => {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.05 * index
        }
      }}
      viewport={{ once: true }}
      whileHover={{ 
        backgroundColor: "rgba(255,255,255,0.1)",
        x: 5
      }}
    >
      <div className={`flex-shrink-0 w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      
      <div>
        <p className="font-medium text-white">{title}</p>
        {organization && (
          <p className="text-xs text-gray-400">{organization}</p>
        )}
      </div>
    </motion.div>
  );
};

const AwardsSection = () => {
  const awards = [
    {
      title: "Honour Student",
      organization: "Ebenezer International School",
      icon: <Award size={24} className="text-white" />,
      color: "bg-blue-500/30"
    },
    {
      title: "STEM - Physical and Chemical Sciences (3rd place)",
      organization: "Trinity College of Dublin and High School Moms",
      icon: <Trophy size={24} className="text-white" />,
      color: "bg-amber-500/30"
    },
    {
      title: "Top 1000 Global Fellows",
      organization: "Lifology",
      icon: <Star size={24} className="text-white" />,
      color: "bg-purple-500/30"
    },
    {
      title: "First Place - NOAA B-Wet Stewardship",
      organization: "National Oceanic and Atmospheric Administration",
      icon: <Trophy size={24} className="text-white" />,
      color: "bg-green-500/30"
    }
  ];

  const leadershipPositions = [
    {
      title: "Headboy",
      organization: "Ebenezer International School",
      icon: <Flag size={18} className="text-white" />,
      color: "bg-blue-500/30"
    },
    {
      title: "Co-Head, \"The Straightforward Podcast\"",
      icon: <Star size={18} className="text-white" />,
      color: "bg-purple-500/30"
    },
    {
      title: "Cadet Airman",
      organization: "Civil Air Patrol (United States)",
      icon: <Flag size={18} className="text-white" />,
      color: "bg-red-500/30"
    },
    {
      title: "Member",
      organization: "Junior Academy by New York Academy of Sciences",
      icon: <Star size={18} className="text-white" />,
      color: "bg-amber-500/30"
    },
    {
      title: "Website Lead & Mentor",
      organization: "Ted-ed Talks Committee",
      icon: <Star size={18} className="text-white" />,
      color: "bg-blue-500/30"
    },
    {
      title: "Point Guard",
      organization: "School Basketball Team",
      icon: <Star size={18} className="text-white" />,
      color: "bg-orange-500/30"
    },
    {
      title: "Editorial Lead",
      organization: "School Magazine",
      icon: <Star size={18} className="text-white" />,
      color: "bg-green-500/30"
    },
    {
      title: "Earth Day Assembly Lead",
      icon: <Star size={18} className="text-white" />,
      color: "bg-green-500/30"
    }
  ];

  return (
    <section id="awards" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-8">
              Awards & <span className="text-gradient">Recognition</span>
            </h2>
            
            <div className="space-y-4">
              {awards.map((award, index) => (
                <AwardCard 
                  key={award.title}
                  {...award}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Leadership */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-8">
              Leadership <span className="text-gradient">Positions</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leadershipPositions.map((position, index) => (
                <LeadershipCard 
                  key={position.title}
                  {...position}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
