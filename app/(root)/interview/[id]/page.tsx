import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getInterviewCoverById, getTechLogos } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { Briefcase, Code } from 'lucide-react';

const InterviewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const [feedback, techIcons] = await Promise.all([
    getFeedbackByInterviewId({
      interviewId: id,
      userId: user?.id!,
    }),
    getTechLogos(interview.techstack || []),
  ]);

  return (
    <div className="min-h-screen relative">
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-75 animate-pulse"></div>
                  <Image
                    src={getInterviewCoverById(id)}
                    alt="cover-image"
                    width={80}
                    height={80}
                    className="relative rounded-full object-cover size-20 border-2 border-white/20 shadow-xl"
                  />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 capitalize">
                    {interview.role} Interview
                  </h1>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{interview.level}</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      <span className="text-sm capitalize">{interview.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Tech Stack */}
              <div className="flex flex-wrap gap-2 items-center">
                <DisplayTechIcons techStack={interview.techstack} techIcons={techIcons} />
              </div>
            </div>

            {/* Interview Type Badge */}
            <div className="mt-6 flex gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
                <span className="text-purple-300 text-sm font-medium capitalize">{interview.type} Interview</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                <span className="text-blue-300 text-sm font-medium">{interview.questions?.length || 0} Questions</span>
              </div>
            </div>
          </div>

          {/* Agent Section */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl animate-fadeIn">
            <Agent
              userName={user?.name!}
              userId={user?.id}
              interviewId={id}
              type="interview"
              questions={interview.questions}
              feedbackId={feedback?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
