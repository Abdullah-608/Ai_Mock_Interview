'use client';

import { motion } from 'framer-motion';
import { useMemo, memo } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Target, 
  TrendingUp,
  BookOpen,
  MessageSquare,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface UserStats {
  totalInterviews: number;
  completedInterviews: number;
  totalLearningCards: number;
  averageScore: number;
  successRate: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  profileURL?: string;
  createdAt?: string;
}

interface ProfileClientProps {
  user: UserData;
  stats: UserStats;
}

function ProfileClient({ user, stats }: ProfileClientProps) {
  const formatDate = useMemo(() => (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {user.profileURL ? (
                  <img 
                    src={user.profileURL} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.name}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 text-gray-400 mb-4">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center md:justify-start">
                <span className="px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                  Active User
                </span>
                <span className="px-4 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                  Free Tier
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalInterviews}
            </h3>
            <p className="text-blue-300 text-sm">Total Interviews</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.completedInterviews}
            </h3>
            <p className="text-green-300 text-sm">Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalLearningCards}
            </h3>
            <p className="text-purple-300 text-sm">Learning Cards</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.averageScore}/10
            </h3>
            <p className="text-orange-300 text-sm">Average Score</p>
          </motion.div>
        </div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Success Rate */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Success Rate</h3>
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-3xl font-semibold text-white">
                      {stats.successRate}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.successRate}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                {stats.completedInterviews} out of {stats.totalInterviews} interviews completed
              </p>
            </div>

            {/* Activity Summary */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Interviews</span>
                  <span className="text-white font-semibold">{stats.totalInterviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Learning Cards</span>
                  <span className="text-white font-semibold">{stats.totalLearningCards}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Score</span>
                  <span className="text-white font-semibold">{stats.averageScore}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-white font-semibold">{stats.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Account Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Full Name</h3>
              <p className="text-white text-lg">{user.name}</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Email Address</h3>
              <p className="text-white text-lg">{user.email}</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Member Since</h3>
              <p className="text-white text-lg">{formatDate(user.createdAt)}</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Account Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-white text-lg">Active</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ProfileClient);
