'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const SpaceBackground = () => {
  const [mounted, setMounted] = useState(false);

  // Memoize stars to prevent regeneration on every render
  const stars = useMemo(() => {
    // Reduced from 300 to 100 for better performance
    return Array.from({ length: 100 }, (_, i) => {
      const rand = Math.random();
      let size;
      
      // Size distribution: mostly small stars, few medium, very few large
      if (rand > 0.95) {
        size = Math.random() * 2 + 2; // Large stars (5%)
      } else if (rand > 0.80) {
        size = Math.random() * 1 + 1; // Medium stars (15%)
      } else {
        size = Math.random() * 0.8 + 0.3; // Small stars (80%)
      }
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        duration: Math.random() * 4 + 3, // Slightly slower animations
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.3,
      };
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Deep space background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0d2b] to-[#000000]" />

      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-pink-900/20 rounded-full blur-[90px]" />
      </div>

      {/* Twinkling stars */}
      {mounted && stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.size > 2 
              ? 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,220,255,0.8) 50%, transparent 100%)'
              : 'white',
            boxShadow: star.size > 1.5 
              ? `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`
              : 'none',
          }}
          animate={{
            opacity: [star.opacity, star.opacity + 0.4, star.opacity],
            scale: star.size > 1.5 ? [1, 1.3, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      {/* Hyperspace effect - reduced elements for performance */}
    </div>
  );
};

export default SpaceBackground;

