'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import { 
  TrendingUp, 
  Play, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
  feedback?: {
    totalScore?: number;
    finalAssessment?: string;
    createdAt?: Date | number | string;
    categoryScores?: Array<{
      name: string;
      score: number;
      comment: string;
    }>;
  } | null;
  techIcons?: Array<{ tech: string; url: string }>;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

interface DashboardProps {
  userInterviews?: Interview[];
  user?: User;
}

function Dashboard({ userInterviews = [] }: DashboardProps) {
  // Calculate performance data from actual feedback
  const calculatePerformanceData = () => {
    // Filter interviews with feedback that have category scores
    const interviewsWithFeedback = userInterviews.filter(
      interview => interview.feedback?.categoryScores && interview.feedback.categoryScores.length > 0
    );

    if (interviewsWithFeedback.length === 0) {
      // Return default data if no feedback available
      return [
        { skill: 'Communication', score: 0, color: '#3b82f6' },
        { skill: 'Technical', score: 0, color: '#06b6d4' },
        { skill: 'Problem Solving', score: 0, color: '#10b981' },
        { skill: 'Cultural Fit', score: 0, color: '#8b5cf6' },
        { skill: 'Confidence', score: 0, color: '#a855f7' },
      ];
    }

    // Initialize score accumulators
    const categoryTotals: Record<string, { total: number; count: number }> = {};

    // Aggregate scores across all interviews
    interviewsWithFeedback.forEach(interview => {
      interview.feedback?.categoryScores?.forEach(category => {
        const key = category.name;
        if (!categoryTotals[key]) {
          categoryTotals[key] = { total: 0, count: 0 };
        }
        categoryTotals[key].total += category.score;
        categoryTotals[key].count += 1;
      });
    });

    // Calculate averages and map to chart format
    const categoryMapping: Record<string, { displayName: string; color: string }> = {
      'Communication Skills': { displayName: 'Communication', color: '#3b82f6' },
      'Technical Knowledge': { displayName: 'Technical', color: '#06b6d4' },
      'Problem Solving': { displayName: 'Problem Solving', color: '#10b981' },
      'Cultural Fit': { displayName: 'Cultural Fit', color: '#8b5cf6' },
      'Confidence and Clarity': { displayName: 'Confidence', color: '#a855f7' },
    };

    return Object.entries(categoryMapping).map(([key, { displayName, color }]) => {
      const data = categoryTotals[key];
      const averageScore = data ? Math.round(data.total / data.count) : 0;
      return {
        skill: displayName,
        score: averageScore,
        color,
      };
    });
  };

  const performanceData = calculatePerformanceData();
  
  // Calculate overall average score
  const averageScore = performanceData.length > 0
    ? Math.round(performanceData.reduce((sum, item) => sum + item.score, 0) / performanceData.length * 10) / 10
    : 0;

  // Determine performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    if (score > 0) return 'Needs Improvement';
    return 'No Data';
  };

  return (
    <div className="min-h-screen relative">
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - CTA & Actions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Welcome Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                Welcome back to PrepWise
              </motion.div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to Ace Your Next
                  <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Interview?
                  </span>
                </h1>
                <p className="text-lg text-gray-300">
                  Practice makes perfect. Start a new interview or view your progress.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/interview" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Start Interview
                    </span>
                  </motion.button>
                </Link>
                <Link href="/interviews" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 backdrop-blur-sm transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Play className="w-5 h-5" />
                      View Interviews
                    </span>
                  </motion.button>
                </Link>
              </div>

              {/* Learning Cards Section */}
              <div className="pt-6 border-t border-white/10">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Enhance Your Learning</h3>
                  <p className="text-sm text-gray-400">Create AI-powered study cards for any topic</p>
                </div>
                <Link href="/learning-cards">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Create Learning Cards
                    </span>
                  </motion.button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
                    {userInterviews?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Total Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                    {averageScore > 0 ? `${averageScore}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    {userInterviews?.filter(i => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(i.createdAt) > weekAgo;
                    }).length || 0}
                  </div>
                  <div className="text-xs text-gray-400">This Week</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Analytics Chart */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="absolute -inset-px bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Performance Overview</h3>
                      <p className="text-sm text-gray-400">Your skill assessment across different areas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Average</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {averageScore > 0 ? `${averageScore}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Line Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-80 w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="rgba(255,255,255,0.1)" 
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="skill" 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          domain={[0, 100]}
                          ticks={[0, 25, 50, 75, 100]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            padding: '12px',
                            backdropFilter: 'blur(10px)'
                          }}
                          labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`${value}%`, 'Score']}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="url(#lineGradient)"
                          strokeWidth={3}
                          fill="url(#colorGradient)"
                          dot={{ 
                            fill: '#8b5cf6', 
                            strokeWidth: 2, 
                            r: 5,
                            stroke: '#fff'
                          }}
                          activeDot={{ 
                            r: 7, 
                            fill: '#a855f7',
                            stroke: '#fff',
                            strokeWidth: 2
                          }}
                        />
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Overall Performance Badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Overall Performance</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                          {getPerformanceLevel(averageScore)}
                        </p>
                      </div>
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

        
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

