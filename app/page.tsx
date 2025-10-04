'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, CheckCircle, Rocket, Shield, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';

export default function LandingPage() {
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
      content: "The practice sessions were so realistic. I felt confident going into my actual interviews.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist at Tesla",
      content: "Best investment I made for my career. The personalized feedback was game-changing.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Senior Developer at Amazon",
      content: "The AI interviewer asked questions I hadn't even thought of. It prepared me for everything in my real interview.",
      rating: 5
    },
    {
      name: "Jessica Martinez",
      role: "UX Designer at Apple",
      content: "I was nervous about behavioral questions, but PrepWise helped me structure my answers perfectly. Got the offer!",
      rating: 5
    },
    {
      name: "Ryan Patel",
      role: "Machine Learning Engineer at Microsoft",
      content: "The technical interview prep was outstanding. The AI adapts to your level and pushes you to improve.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Full Stack Developer at Netflix",
      content: "After 3 weeks of practice, I felt like a completely different candidate. The feedback loop is incredible.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "DevOps Engineer at Spotify",
      content: "PrepWise gave me the confidence I needed. The practice environment feels just like a real interview.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Rocket,
      title: "AI-Powered Intelligence",
      description: "Advanced AI analyzes your responses and provides detailed, actionable feedback",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Launch Your Career",
      description: "Practice with realistic interview scenarios tailored to your target role",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Confidence Boost",
      description: "Build confidence with unlimited practice sessions in a safe environment",
      color: "from-cyan-500 to-teal-500"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed analytics and insights",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const totalSlides = Math.ceil(testimonials.length / 3);

  // Auto-slide testimonials
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getVisibleTestimonials = () => {
    const start = currentSlide * 3;
    const visible = testimonials.slice(start, start + 3);
    // Ensure we always show 3 cards even on the last slide
    while (visible.length < 3 && visible.length > 0) {
      visible.push(testimonials[visible.length % testimonials.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Space Background */}
      <SpaceBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="relative w-10 h-10">
                  <Image
                    src="/real_logo.svg"
                    alt="PrepWise Logo"
                    width={40}
                    height={40}
                    className="w-full h-full"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  PrepWise
                </span>
              </motion.div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/sign-in" className="hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 text-white rounded-xl backdrop-blur-sm transition-all font-medium hover:text-blue-300"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Sign Up</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
              

                {/* Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                    Ace Your Next
                    <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Tech Interview
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed mt-4">
                    Practice with AI-powered mock interviews, receive instant feedback, and land your dream job with confidence.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </Link>
                  <Link href="/sign-in">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 backdrop-blur-sm transition-all"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Learn New Skills</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - AI Interview Illustration */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:flex items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  {/* Glow effect behind the image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-600/30 blur-3xl" />
                  
                  {/* SVG Container */}
                  <div className="relative w-full max-w-xl">
                    <Image
                      src="/covers/Landing_page_svg.svg"
                      alt="AI Interview Coach"
                      width={600}
                      height={600}
                      className="w-full h-auto drop-shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Floating decorative elements */}
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Rocket className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                    animate={{ 
                      y: [0, 15, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Everything You Need to
                <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Succeed
                </span>
              </motion.h2>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full hover:border-white/20 transition-all">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

    

        {/* Testimonials Section */}
        <section 
          className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Trusted by
                <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Top Professionals
                </span>
              </motion.h2>
              <p className="text-gray-400">Real stories from people who landed their dream jobs</p>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              {/* Testimonials Slider */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-3 gap-6"
                  >
                    {getVisibleTestimonials().map((testimonial, index) => (
                      <div
                        key={`${currentSlide}-${index}`}
                        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                        <div className="pt-4 border-t border-white/10">
                          <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                          <p className="text-blue-400 text-xs mt-1">{testimonial.role}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === index 
                          ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500' 
                          : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 blur-3xl" />
              
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals preparing for their dream jobs
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </Link>
                  <Link href="/sign-in">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 transition-all"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

       
      </div>
    </div>
  );
}
