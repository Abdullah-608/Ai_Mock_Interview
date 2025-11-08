"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; helper?: string }
> = {
  "Communication Skills": {
    label: "Communication",
    color: "#6366f1",
    helper: "Structure responses with the STAR method and stay concise.",
  },
  "Technical Knowledge": {
    label: "Technical",
    color: "#0ea5e9",
    helper: "Highlight trade-offs and real-world examples when you explain solutions.",
  },
  "Problem Solving": {
    label: "Problem Solving",
    color: "#14b8a6",
    helper: "Talk through your approach step-by-step and cover edge cases.",
  },
  "Cultural Fit": {
    label: "Culture",
    color: "#a855f7",
    helper: "Connect your stories to company values and team collaboration.",
  },
  "Confidence and Clarity": {
    label: "Confidence",
    color: "#f97316",
    helper: "Pause, breathe, and speak with intention—clarity beats speed.",
  },
};

const formatDate = (dateInput: Date | string | number) => {
  const date = new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const Dashboard = ({ userInterviews = [], user }: DashboardProps) => {
  const sortedInterviews = [...userInterviews].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const interviewsWithFeedback = sortedInterviews.filter(
    (interview) => interview.feedback?.categoryScores?.length
  );

  const categoryTotals: Record<
    string,
    { total: number; count: number }
  > = {};

  interviewsWithFeedback.forEach((interview) => {
    interview.feedback?.categoryScores?.forEach((category) => {
      if (!categoryTotals[category.name]) {
        categoryTotals[category.name] = { total: 0, count: 0 };
      }
      categoryTotals[category.name].total += category.score;
      categoryTotals[category.name].count += 1;
    });
  });

  const categoryInsights = Object.entries(CATEGORY_CONFIG).map(
    ([key, config]) => {
      const totals = categoryTotals[key];
      const average = totals
        ? Math.round((totals.total / totals.count) * 10) / 10
        : 0;
      return {
        key,
        label: config.label,
        color: config.color,
        helper: config.helper,
        average,
      };
    }
  );

  const performanceData = categoryInsights.map((item) => ({
    skill: item.label,
    score: item.average,
    color: item.color,
  }));

  const averageScore =
    performanceData.length > 0
      ? Math.round(
          (performanceData.reduce((sum, item) => sum + item.score, 0) /
            performanceData.length) *
            10
        ) / 10
      : 0;

  const latestScore = interviewsWithFeedback[0]?.feedback?.totalScore ?? null;
  const previousScore = interviewsWithFeedback[1]?.feedback?.totalScore ?? null;
  const scoreTrend =
    latestScore && previousScore ? latestScore - previousScore : null;

  const strengths = categoryInsights
    .filter((item) => item.average >= 75)
    .sort((a, b) => b.average - a.average)
    .slice(0, 3);

  const improvementAreas = categoryInsights
    .filter((item) => item.average > 0 && item.average < 70)
    .sort((a, b) => a.average - b.average)
    .slice(0, 3);

  const interviewsThisWeek = sortedInterviews.filter((interview) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(interview.createdAt).getTime() > weekAgo.getTime();
  }).length;

  const upcomingActions = [
    {
      title: "Schedule a mock interview",
      description: "Stay sharp with a new scenario tailored to your role.",
      href: "/interview",
    },
    {
      title: "Review last feedback",
      description: "Turn strengths into stories and tighten weak spots.",
      href: "/interviews",
    },
    {
      title: "Polish your elevator pitch",
      description: "Rehearse a 60-second intro highlighting your wins.",
      href: "/interview",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-6 sm:p-8"
            >
              <div className="absolute -top-24 -right-24 h-60 w-60 rounded-full bg-purple-500/30 blur-3xl" />
              <div className="absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-blue-500/30 blur-3xl" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Prepify Progress Center
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                      Track. Practice.{" "}
                      <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Interview Better.
                      </span>
                    </h1>
                    <p className="mt-3 max-w-xl text-sm text-gray-300 sm:text-base">
                      {user?.name
                        ? `Hey ${user.name.split(" ")[0]}, your dashboard highlights what’s working and what to sharpen before the next conversation.`
                        : "Your dashboard highlights what’s working and what to sharpen before the next conversation."}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Interviews
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                        {sortedInterviews.length}
                      </p>
                      <p className="text-xs text-gray-500">
                        {interviewsThisWeek} this week
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Avg score
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                        {averageScore ? `${averageScore}%` : "N/A"}
                      </p>
                      {scoreTrend !== null ? (
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs ${
                            scoreTrend >= 0
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {scoreTrend >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 rotate-180" />
                          )}
                          {Math.abs(scoreTrend)} pts vs last
                        </span>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Complete two interviews to see a trend.
                        </p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Last session
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                        {sortedInterviews[0]
                          ? formatDate(sortedInterviews[0].createdAt)
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sortedInterviews[0]?.role ?? "No interviews yet"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    What to do next
                  </p>
                  <ul className="mt-4 space-y-4">
                    {upcomingActions.map((action) => (
                      <li key={action.title} className="group relative">
                        <Link
                          href={action.href}
                          className="block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-purple-400/40 hover:bg-purple-500/10"
                        >
                          <p className="flex items-center justify-between text-sm font-semibold text-white">
                            {action.title}
                            <ArrowUpRight className="h-4 w-4 text-purple-300 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {action.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Practice shortcuts
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Dive back in with one tap
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/interview"
                  className="group flex flex-col gap-2 rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4 transition hover:-translate-y-1 hover:border-purple-300 hover:bg-purple-500/20"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-purple-100">
                    Start Interview
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-purple-200">
                    Generate a new mock session with Gemini-powered rounds.
                  </p>
                </Link>
                <Link
                  href="/interviews"
                  className="group flex flex-col gap-2 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-500/20"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-blue-100">
                    Review History
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-blue-200">
                    Revisit transcripts, insights, and score breakdowns.
                  </p>
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-10 w-10 rounded-xl bg-slate-900/80 p-2 text-blue-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Keep the momentum
                    </p>
                    <p className="text-xs text-gray-400">
                      A consistent weekly cadence boosts success by 3×.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Skill Radar
                  </h3>
                  <p className="text-sm text-gray-400">
                    Average performance by skill category across your interviews.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  <TrendingUp className="h-4 w-4" />
                  {averageScore ? `${averageScore}% average` : "No data yet"}
                </div>
              </div>

              <div className="mt-6 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={performanceData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="skillGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop
                          offset="95%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.05}
                        />
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
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickLine={false}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        padding: "12px",
                        backdropFilter: "blur(10px)",
                      }}
                      labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
                      itemStyle={{ color: "#fff" }}
                      formatter={(value: number) => [`${value}%`, "Score"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#skillGradient)"
                      dot={{
                        fill: "#c084fc",
                        strokeWidth: 2,
                        r: 5,
                        stroke: "#0f172a",
                      }}
                      activeDot={{
                        r: 7,
                        fill: "#38bdf8",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-300" />
                  <h3 className="text-sm font-semibold text-white">
                    Strength signals
                  </h3>
                </div>
                <ul className="space-y-3">
                  {strengths.length > 0 ? (
                    strengths.map((item) => (
                      <li
                        key={item.key}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                      >
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Averaging {item.average}%. Keep doubling down on what
                          works.
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-xs text-gray-400">
                      Complete at least one interview with AI feedback to surface
                      your strongest signals.
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <h3 className="text-sm font-semibold text-white">
                    Next focus areas
                  </h3>
                </div>
                <ul className="space-y-3">
                  {improvementAreas.length > 0 ? (
                    improvementAreas.map((item) => (
                      <li
                        key={item.key}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                      >
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.helper}
                          {` Current average: ${item.average}%.`}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-xs text-gray-400">
                      You’re performing consistently across categories. Keep the
                      streak going!
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Recent interviews
                  </h3>
                  <p className="text-sm text-gray-400">
                    Stay close to your latest practice runs and outcomes.
                  </p>
                </div>
                <Link
                  href="/interviews"
                  className="text-xs font-medium text-purple-300 transition hover:text-purple-200"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 bg-white/5 px-4 py-3 text-xs uppercase tracking-wide text-gray-400 sm:grid">
                  <span>Role</span>
                  <span>Type</span>
                  <span>Date</span>
                  <span>Score</span>
                </div>
                <div className="divide-y divide-white/5">
                  {sortedInterviews.slice(0, 5).length > 0 ? (
                    sortedInterviews.slice(0, 5).map((interview) => (
                      <Link
                        key={interview.id}
                        href={
                          interview.feedback
                            ? `/interview/${interview.id}/feedback`
                            : `/interview/${interview.id}`
                        }
                        className="grid items-center gap-4 px-4 py-4 text-sm transition hover:bg-white/5 sm:grid-cols-[1.5fr_1fr_1fr_1fr]"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {interview.role}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {interview.techstack?.slice(0, 3).join(" • ")}
                          </p>
                        </div>
                        <span className="text-xs text-gray-300">
                          {interview.type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(interview.createdAt)}
                        </span>
                        <span className="text-xs font-semibold text-purple-200">
                          {interview.feedback?.totalScore
                            ? `${interview.feedback.totalScore}%`
                            : "Pending"}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-xs text-gray-400">
                      Generate your first interview to unlock tailored insights,
                      stats, and ongoing tracking.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-300" />
                <h3 className="text-sm font-semibold text-white">
                  Prep cadence
                </h3>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Weekly interview practice keeps muscle memory fresh. Try these:
              </p>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">
                    Monday – Behavioral round
                  </p>
                  <p className="text-xs text-gray-400">
                    Rehearse stories that show leadership, ownership, or conflict
                    resolution.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">
                    Wednesday – Technical drill
                  </p>
                  <p className="text-xs text-gray-400">
                    Narrate your code or system design aloud, then review the
                    transcript.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">
                    Friday – Feedback focus
                  </p>
                  <p className="text-xs text-gray-400">
                    Pick one improvement area and craft a new example to close
                    the gap.
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/10 bg-slate-950/90 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 sm:p-3">
                  <Image
                    src="/svg/QR.svg"
                    width={120}
                    height={120}
                    alt="Hire me QR code"
                    className="h-28 w-28 sm:h-32 sm:w-32 object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-blue-200">Work with me</p>
                <h3 className="text-2xl font-semibold text-white">
                  Need help shipping interview experiences or AI features?
                </h3>
                <p className="text-sm text-gray-400">
                  Scan the QR code or use the links to connect on your favourite platform. Let’s build something interviewees love.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Upwork",
                  href: "https://www.upwork.com/freelancers/~016dc2f789808a401f",
                  description: "Contracts, reviews, availability.",
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/abdullah-608-mansoor",
                  description: "Connect and follow updates.",
                },
                {
                  label: "Portfolio",
                  href: "https://your-portfolio-link.com",
                  description: "Recent builds & product work.",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <p className="flex items-center justify-between text-sm font-semibold text-white">
                    {item.label}
                    <ArrowUpRight className="h-4 w-4 text-white/70 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </p>
                  <p className="mt-1 text-xs text-gray-400 group-hover:text-gray-200">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Prepify Dashboard · Designed for mock interview mastery.</p>
            <a
              href="mailto:abdullahmnsoor608@gmail.com"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <Mail className="h-4 w-4" />
              abdullahmnsoor608@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

