import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Star, Trophy, ArrowRight } from "lucide-react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import DeleteInterviewButton from "./DeleteInterviewButton";

import { cn, getInterviewCoverById } from "@/lib/utils";

interface InterviewCardProps {
  interviewId: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: Date | number | string;
  feedback?: {
    totalScore?: number;
    finalAssessment?: string;
    createdAt?: Date | number | string;
  } | null;
  techIcons?: Array<{ tech: string; url: string }>;
}

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
  techIcons,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeConfig =
    {
      Behavioral: {
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10"
      },
      Mixed: {
        gradient: "from-purple-500 to-blue-500",
        bgGradient: "from-purple-500/10 to-blue-500/10"
      },
      Technical: {
        gradient: "from-cyan-500 to-teal-500",
        bgGradient: "from-cyan-500/10 to-teal-500/10"
      },
    }[normalizedType] || {
      gradient: "from-purple-500 to-blue-500",
      bgGradient: "from-purple-500/10 to-blue-500/10"
    };

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const scoreColor = feedback?.totalScore 
    ? feedback.totalScore >= 80 
      ? "text-green-400" 
      : feedback.totalScore >= 60 
        ? "text-yellow-400" 
        : "text-orange-400"
    : "text-gray-400";

  // Generate a consistent cover image based on interview ID (deterministic)
  const coverImage = getInterviewCoverById(interviewId);

  return (
    <div className="group relative w-full max-w-[400px] mx-auto">
      {/* Glow effect on hover */}
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500",
        badgeConfig.gradient
      )} />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
        {/* Type Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r text-white shadow-lg",
            badgeConfig.gradient
          )}>
            {normalizedType}
          </div>
        </div>

        {/* Cover Image with gradient background */}
        <div className="mb-6 flex justify-center">
          <div className={cn(
            "relative p-1 rounded-full bg-gradient-to-r",
            badgeConfig.gradient
          )}>
            <div className="bg-slate-900 rounded-full p-2">
              <Image
                src={coverImage}
                alt="cover-image"
                width={80}
                height={80}
                className="rounded-full object-cover size-[80px] group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Interview Role */}
        <h3 className="text-xl font-bold text-white capitalize text-center mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
          {role} Interview
        </h3>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-6 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-sm">{formattedDate}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2">
            {feedback?.totalScore ? (
              <Trophy className={cn("w-4 h-4", scoreColor)} />
            ) : (
              <Star className="w-4 h-4 text-gray-500" />
            )}
            <span className={cn("text-sm font-semibold", scoreColor)}>
              {feedback?.totalScore || "---"}/100
            </span>
          </div>
        </div>

        {/* Feedback Text */}
        <div className={cn(
          "mb-6 p-4 rounded-lg bg-gradient-to-br border border-white/5 flex-grow",
          badgeConfig.bgGradient
        )}>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills and get personalized feedback."}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-4 flex justify-center">
          <DisplayTechIcons techStack={techstack} techIcons={techIcons} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/10">
          <DeleteInterviewButton interviewId={interviewId} userId={userId} />
          
          <Link
            href={
              feedback
                ? `/interview/${interviewId}/feedback`
                : `/interview/${interviewId}`
            }
            className="flex-1"
          >
            <Button className={cn(
              "w-full bg-gradient-to-r text-white font-semibold rounded-lg py-2.5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 group/btn",
              badgeConfig.gradient
            )}>
              <span className="flex items-center justify-center gap-2">
                {feedback ? "View Feedback" : "Start Interview"}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;