import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

// Backend utils and actions
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  // Fetching backend feedback data
  const feedback = null as Feedback | null
     userId && interviewId
       ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  // Type normalization and badge color logic
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  // Date formatting
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="card-interview relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-light-50/20 dark:to-dark-100/10 -z-10"></div>
        
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg shadow-sm transition-colors duration-200",
              badgeColor
            )}
          >
            <p className="badge-text">{normalizedType}</p>
          </div>

          {/* Cover Image with pulse effect */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full opacity-75 blur-sm bg-primary/20 animate-pulse [animation-duration:3s]"></div>
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-fit size-[90px] border-2 border-white dark:border-dark-300 relative z-10 transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Interview Role */}
          <h3 className="mt-5 capitalize font-semibold text-lg text-gray-800 dark:text-gray-100">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
                className="opacity-75"
              />
              <p className="text-gray-600 dark:text-gray-300 text-sm">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/star.svg" 
                width={22} 
                height={22} 
                alt="star" 
                className="opacity-75"
              />
              <p className="text-gray-600 dark:text-gray-300 text-sm">--/100</p>
              {/* <p>{feedback?.totalScore || "---"}/100</p> */}
            </div>
          </div>

          {/* Status indicator */}
          <div className="mt-4 mb-2 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full w-fit">
            Not Attempted
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {/* {feedback?.finalAssessment || */}
              "You haven't taken this interview yet. Take it now to improve your skills."
            {/* } */}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-5 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary transition-all duration-300 hover:shadow-md active:scale-95 rounded-full">
            <Link
              href={`/interview/${interviewId}`}
               href={
                 feedback
                   ? `/interview/${interviewId}/feedback`
                   : `/interview/${interviewId}`
               }
              className="flex items-center gap-1.5"
            >
              {/* {feedback ? "Check Feedback" : "View Interview"} */}
              View Interview
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 transition-transform group-hover:translate-x-0.5">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;