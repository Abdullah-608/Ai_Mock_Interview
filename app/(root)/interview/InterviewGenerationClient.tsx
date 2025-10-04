'use client';

import { motion } from 'framer-motion';
import Agent from "@/components/Agent";
import { Sparkles, Rocket, Zap } from 'lucide-react';

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

      {/* Agent Component in a card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
          <Agent
            userName={user?.name || ''}
            userId={user?.id}
            profileImage={user?.profileURL}
            type="generate"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewGenerationClient;

