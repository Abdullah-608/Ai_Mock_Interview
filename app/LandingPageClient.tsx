'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, CheckCircle, Rocket, Shield, TrendingUp, Zap, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';

export default function LandingPageClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "PrepWise helped me land my dream job at Google. The AI feedback was incredibly detailed and accurate.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager at Meta",
      content: "The interview simulations were so realistic. I felt confident and prepared for my actual interviews.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Data Scientist at Netflix",
      content: "The personalized feedback helped me identify and improve my weak areas. Highly recommended!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Rocket,
      title: "AI-Powered Interviews",
      description: "Practice with advanced AI that adapts to your responses and provides realistic interview scenarios."
    },
    {
      icon: Brain,
      title: "Personalized Feedback",
      description: "Get detailed, actionable feedback on your performance to help you improve continuously."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and performance insights."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your interview data is encrypted and secure. Practice with confidence knowing your privacy is protected."
    }
  ];

  const stats = [
    { number: "50K+", label: "Successful Interviews" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
    { number: "100+", label: "Companies" }
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          
          <span className="text-white font-bold text-xl">PrepWise</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-white/80 hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/sign-in"
            className="text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Interviews{" "}
            </span>
            with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
            Practice with advanced AI interviewers, get personalized feedback, 
            and land your dream job with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/sign-up"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button className="border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
              Watch Demo
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-6 py-12"
      >
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              {stat.number}
            </div>
            <div className="text-white/60 text-sm md:text-base">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose PrepWise?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Our AI-powered platform provides everything you need to ace your next interview.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by Professionals
          </h2>
          <p className="text-xl text-white/70">
            See what our users say about their success with PrepWise.
          </p>
        </div>
        
        <div className="relative">
          <div 
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentSlide].name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-white/90 text-lg leading-relaxed mb-4">
                      "{testimonials[currentSlide].content}"
                    </blockquote>
                    <div className="text-white/60">
                      <div className="font-semibold">{testimonials[currentSlide].name}</div>
                      <div className="text-sm">{testimonials[currentSlide].role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative z-10 text-center px-6 py-20"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of professionals who have already improved their interview skills with PrepWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-up"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Start Your Free Trial
              <CheckCircle className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard"
              className="border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PW</span>
                </div>
                <span className="text-white font-bold text-xl">PrepWise</span>
              </div>
              <p className="text-white/60 text-sm">
                The AI-powered interview preparation platform that helps you land your dream job.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/features" className="block text-white/60 hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="block text-white/60 hover:text-white transition-colors">Pricing</Link>
                <Link href="/integrations" className="block text-white/60 hover:text-white transition-colors">Integrations</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-white/60 hover:text-white transition-colors">About</Link>
                <Link href="/careers" className="block text-white/60 hover:text-white transition-colors">Careers</Link>
                <Link href="/contact" className="block text-white/60 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-white/60 hover:text-white transition-colors">Help Center</Link>
                <Link href="/docs" className="block text-white/60 hover:text-white transition-colors">Documentation</Link>
                <Link href="/status" className="block text-white/60 hover:text-white transition-colors">Status</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 PrepWise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
