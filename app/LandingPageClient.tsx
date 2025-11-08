'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, memo } from 'react';
import { ArrowRight, Star, Rocket, Shield, TrendingUp, Zap, Brain } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load SpaceBackground component
const SpaceBackground = dynamic(() => import('@/components/SpaceBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900" />
});

function LandingPageClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Memoize static data
  const testimonials = useMemo(() => [
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
  ], []);

  const features = useMemo(() => [
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
  ], []);

  const stats = useMemo(() => [
    { number: "50K+", label: "Successful Interviews" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
    { number: "100+", label: "Companies" }
  ], []);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-5">
        <div className="flex items-center gap-2">
          <Image
            src="/svg/Logo.svg"
            alt="Prepify logo"
            width={40}
            height={40}
            className="w-10 h-10"
            priority
          />
          <span className="text-white font-bold text-lg sm:text-xl">Prepify</span>
        </div>
        
        <div className="flex items-center gap-2.5 md:gap-4">
          <motion.div
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative"
          >
            <Link
              href="/sign-in"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm font-semibold sm:tracking-wide uppercase text-white/80 rounded-full border border-white/30 overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-full bg-white/[0.06] group-hover:bg-white/15 transition-all duration-300" />
              <span className="relative z-10">Sign In</span>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative"
          >
            <Link
              href="/sign-up"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm font-semibold sm:tracking-wide uppercase text-white rounded-full overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <motion.span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-white/80"
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Master Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interviews
              </span>{" "}
              with AI
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Practice with advanced AI interviewers, get personalized feedback, and land your dream job with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center lg:items-start">
              <Link 
                href="/sign-up"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-7 py-3.5 rounded-full text-base sm:text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="border border-white/20 text-white px-7 py-3.5 rounded-full text-base sm:text-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                Watch Demo
                <Zap className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:flex lg:flex-wrap lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm md:text-base mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto max-w-xs sm:max-w-md lg:max-w-xl lg:mx-0 w-full"
          >
            <Image
              src="/svg/landing_page.svg"
              alt="Preparing for mock interviews illustration"
              width={720}
              height={540}
              className="w-full h-auto rounded-2xl sm:rounded-3xl"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 sm:mb-6">
            Why Choose PrepWise?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Our AI-powered platform provides everything you need to ace your next interview.
          </p>
        </div>
        
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="m-3">
                  <h3 className=" text-lg sm:text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed">
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
        className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 sm:mb-6">
            Loved by Professionals
          </h2>
          <p className="text-base sm:text-lg text-white/70">
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
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentSlide].name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-1 mb-4">
                      {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-white/90 text-base sm:text-lg leading-relaxed mb-4">
                      &ldquo;{testimonials[currentSlide].content}&rdquo;
                    </blockquote>
                    <div className="text-white/60 text-sm">
                      <div className="font-semibold text-base sm:text-lg">{testimonials[currentSlide].name}</div>
                      <div className="text-xs sm:text-sm">{testimonials[currentSlide].role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
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

      {/* Hire Me Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="w-40 h-40 mb-5">
                <Image
                  src="/svg/QR.svg"
                  alt="Scan to connect with Abdullah Mansoor"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <p className="text-white font-semibold text-lg">Scan &amp; Connect</p>
              <p className="text-white/60 text-sm mt-2">
                Point your camera at the QR code to view my freelance profile and portfolio instantly.
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-white">Let’s Build Something Great Together</h3>
                <p className="text-white/70 text-base max-w-2xl">
                  I help teams and founders craft human-centered interview experiences, powered by AI.
                  Explore my work, see testimonials, and book a quick intro call through the links below.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    name: "Upwork",
                    href: "https://www.upwork.com/freelancers/~016dc2f789808a401f",
                    description: "View contracts, reviews, and availability.",
                  },
                  {
                    name: "LinkedIn",
                    href: "https://www.linkedin.com/in/abdullah-608-mansoor",
                    description: "Connect and follow professional updates.",
                  },
                  {
                    name: "Portfolio",
                    href: "https://your-portfolio-link.com",
                    description: "See recent product design and AI projects.",
                  },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all px-5 py-4 flex flex-col gap-2"
                  >
                    <span className="text-white font-semibold text-lg flex items-center gap-2">
                      {link.name}
                      <motion.span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-white/80"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </span>
                    <span className="text-white/60 text-sm leading-snug group-hover:text-white/80 transition-colors">
                      {link.description}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white/60 text-sm border-t border-white/10 pt-6">
                <p>&copy; {new Date().getFullYear()} Prepify. Crafted with care by your next hire.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Link
                    href="mailto:abdullahmnsoor608@gmail.com"
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    abdullahmnsoor608@gmail.com
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(LandingPageClient);
