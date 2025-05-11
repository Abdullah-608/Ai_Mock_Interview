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

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <section className="section-feedback max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-row justify-center mb-6">
        <h1 className="text-4xl font-semibold text-center transition-all duration-300 hover:text-blue-600">
          Feedback on the Interview -{" "}
          <span className="capitalize bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {interview.role}
          </span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center mb-8">
        <div className="flex flex-row gap-5 flex-wrap justify-center">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center bg-blue-50 p-3 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:scale-105">
            <Image 
              src="/star.svg" 
              width={22} 
              height={22} 
              alt="star" 
              className="text-yellow-400"
            />
            <p className="text-gray-700">
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold text-lg">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2 items-center bg-purple-50 p-3 rounded-lg transition-all duration-300 hover:bg-purple-100 hover:scale-105">
            <Image 
              src="/calendar.svg" 
              width={22} 
              height={22} 
              alt="calendar" 
              className="text-blue-500"
            />
            <p className="text-gray-700">
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 transition-all duration-300 hover:shadow-md">
        <p className="text-gray-700 leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1">
          {feedback?.finalAssessment}
        </p>
      </div>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 transition-all duration-300 hover:text-blue-600">
          Breakdown of the Interview:
        </h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div 
            key={index} 
            className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500 transition-all duration-300 hover:shadow-md hover:bg-white"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-lg text-gray-800">
                {index + 1}. {category.name}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-blue-600">
                  {category.score}/100
                </span>
              </div>
            </div>
            <p className="text-gray-600">{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col gap-4 bg-green-50 p-6 rounded-xl border border-green-100 transition-all duration-300 hover:shadow-md hover:bg-green-50/80">
          <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {feedback?.strengths?.map((strength, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1"
              >
                <span className="text-green-500 font-bold mt-1">•</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 bg-amber-50 p-6 rounded-xl border border-amber-100 transition-all duration-300 hover:shadow-md hover:bg-amber-50/80">
          <h3 className="text-xl font-semibold text-amber-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1"
              >
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span className="text-gray-700">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="buttons flex justify-center mt-8">
        <Button className="btn-secondary bg-white border border-gray-200 shadow-sm px-8 py-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow hover:-translate-y-0.5 active:translate-y-0">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to dashboard
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;