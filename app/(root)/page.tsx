import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="card-cta relative overflow-hidden">
        <div className="flex flex-col gap-6 max-w-lg animate-fadeIn">
          <h2 className="animate-slideUp transition-all duration-300 hover:text-blue-600">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h2>
          <p className="text-lg animate-slideUp animation-delay-200 transition-all duration-300 hover:text-blue-500">
            Practice real interview questions & get instant feedback
          </p>

          <Button 
            asChild 
            className="btn-primary max-sm:w-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 animate-slideUp animation-delay-300"
          >
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden transition-transform duration-700 hover:scale-105 hover:rotate-2 animate-float"
        />
        
        {/* Background decorative elements */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-100/20 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
      </section>

      <section className="flex flex-col gap-6 mt-8 animate-fadeIn animation-delay-400">
        <h2 className="transition-all duration-300 hover:text-blue-600 transform hover:translate-x-1">
          Your Interviews
        </h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview, index) => (
              <div 
                key={interview.id} 
                className="transition-all duration-500 hover:z-10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <InterviewCard
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-6 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-md text-center animate-pulse">
              You haven&apos;t taken any interviews yet
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8 animate-fadeIn animation-delay-500">
        <h2 className="transition-all duration-300 hover:text-blue-600 transform hover:translate-x-1">
          Take Interviews
        </h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview, index) => (
              <div 
                key={interview.id} 
                className="transition-transform duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <InterviewCard
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-6 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-md text-center animate-pulse">
              There are no interviews available
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;