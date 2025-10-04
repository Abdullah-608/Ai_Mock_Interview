'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

const SpaceBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }>>([]);
  const [hyperspace, setHyperspace] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate random stars with varied sizes
    const generatedStars = Array.from({ length: 300 }, (_, i) => {
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
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.3,
      };
    });
    setStars(generatedStars);
  }, []);

  const handleClick = useCallback(() => {
    setHyperspace(true);
    setTimeout(() => setHyperspace(false), 2000);
  }, []);

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-auto cursor-pointer"
      onClick={handleClick}
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

      {/* Hyperspace effect */}
      {hyperspace && (
        <>
          {/* Light streaks */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                height: `${Math.random() * 200 + 100}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleX: [0, 1, 10],
                x: [0, (Math.random() - 0.5) * 2000],
                y: [0, (Math.random() - 0.5) * 2000],
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
          
          {/* Radial light burst */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0, 2, 3] }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(147,51,234,0.1) 30%, transparent 70%)',
            }}
          />

          {/* Warp tunnel effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ width: '100%', height: '100%', opacity: 0.8 }}
                animate={{ 
                  width: ['100%', '0%'],
                  height: ['100%', '0%'],
                  opacity: [0.8, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeIn"
                }}
              />
            ))}
          </motion.div>
        </>
      )}

    </div>
  );
};

export default SpaceBackground;

