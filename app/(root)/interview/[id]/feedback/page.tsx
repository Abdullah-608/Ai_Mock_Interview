import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { ArrowLeft, Repeat, Star, Calendar, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

const Feedback = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 border-green-400';
    if (score >= 70) return 'text-blue-400 border-blue-400';
    if (score >= 50) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const getScoreBgGradient = (score: number) => {
    if (score >= 85) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (score >= 70) return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    if (score >= 50) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    return 'from-red-500/20 to-pink-500/20 border-red-500/30';
  };

  return (
    <div className="min-h-screen relative">
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 animate-fadeIn">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-4">
                <TrendingUp className="w-4 h-4 text-purple-300" />
                <span className="text-purple-300 text-sm font-medium">Interview Feedback</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                <span className="capitalize bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {interview.role}
                </span>
                <span className="text-white"> Interview</span>
              </h1>
              <p className="text-gray-400">Here's how you performed</p>
            </div>

            {/* Score & Date Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className={`bg-gradient-to-r ${getScoreBgGradient(feedback?.totalScore || 0)} backdrop-blur-sm px-6 py-4 rounded-2xl border flex items-center gap-3`}>
                <Star className={`w-6 h-6 ${getScoreColor(feedback?.totalScore || 0)}`} fill="currentColor" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Overall Score</p>
                  <p className="text-2xl font-bold text-white">
                    {feedback?.totalScore}<span className="text-gray-400 text-lg">/100</span>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-500/20 to-slate-600/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-500/30 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-slate-300" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Completed On</p>
                  <p className="text-sm font-semibold text-white">
                    {feedback?.createdAt
                      ? dayjs(feedback.createdAt).format("MMM D, YYYY")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Final Assessment */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <p className="text-gray-300 leading-relaxed text-center md:text-left">
                {feedback?.finalAssessment}
              </p>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Performance Breakdown
            </h2>
            <div className="space-y-6">
              {feedback?.categoryScores?.map((category, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-bold text-lg text-white">
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${category.score}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold text-xl ${getScoreColor(category.score)}`}>
                        {category.score}
                        <span className="text-gray-500 text-sm">/100</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed pl-11">
                    {category.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-2xl animate-fadeIn">
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {feedback?.strengths?.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-300 hover:translate-x-1 transition-all duration-300"
                  >
                    <span className="text-green-400 font-bold text-lg mt-0.5">✓</span>
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl animate-fadeIn">
              <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {feedback?.areasForImprovement?.map((area, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-300 hover:translate-x-1 transition-all duration-300"
                  >
                    <span className="text-amber-400 font-bold text-lg mt-0.5">!</span>
                    <span className="leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:shadow-lg flex items-center gap-2 justify-center min-w-[200px]">
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </Link>

            <Link href={`/interview/${id}`}>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 justify-center min-w-[200px]">
                <Repeat className="w-5 h-5" />
                Retake Interview
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
