'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import { Sparkles, Rocket, Zap, ArrowRight } from 'lucide-react';

interface InterviewGenerationClientProps {
  user: {
    name?: string;
    id?: string;
    profileURL?: string;
  } | null;
}

const InterviewGenerationClient = ({ user }: InterviewGenerationClientProps) => {
  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-10"
      >
        {/* Title with gradient and glow */}
        <div className="relative inline-block">
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            Generate Your Interview
          </motion.h1>
          
          {/* Glowing underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 text-lg mt-4 max-w-3xl"
        >
          Prepare for your dream job with AI-powered mock interviews. Get personalized feedback and improve your skills.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap gap-4 mt-6"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">AI Powered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Instant Feedback</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Real-time Analysis</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-white">Start in the Interview Hub</h2>
          <p className="text-gray-300 leading-relaxed">
            Head over to the Interview dashboard to generate custom interview plans with Gemini,
            review past sessions, and launch the interactive practice flow. Everything lives in one place so you can prep quickly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold transition-transform hover:translate-x-1 hover:shadow-lg"
            >
              Go to Interview Hub
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex-1 min-w-[220px] bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-blue-200 font-semibold uppercase tracking-wide mb-2">
                Tip
              </p>
              <p className="text-sm text-gray-300">
                Use the “Generate Interview” button in the hub to create a plan tailored to your role, stack, and experience.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewGenerationClient;

