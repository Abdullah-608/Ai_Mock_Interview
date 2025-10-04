import Image from "next/image";
import { redirect } from "next/navigation";

import LearningAgent from "@/components/LearningAgent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLearningCardById } from "@/lib/actions/general.action";
import { BookOpen, Brain, Clock, User } from 'lucide-react';

interface LearningCard {
  id: string;
  title: string;
  content: string;
  notes: string;
  explanation: string;
  createdAt: string;
  userId: string;
  userName?: string;
  coverImage?: string;
}


const LearningCardDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const learningCard = await getLearningCardById(id);
  
  if (!learningCard) redirect("/learning-cards");

  return (
    <div className="min-h-screen relative">
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-75 animate-pulse"></div>
                  <Image
                    src={learningCard.coverImage || '/ai-avatar.png'}
                    alt="learning-card"
                    width={80}
                    height={80}
                    className="relative rounded-full object-cover size-20 border-2 border-white/20 shadow-xl"
                  />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {learningCard.title}
                  </h1>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{learningCard.userName}</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{new Date(learningCard.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Learning Type Badge */}
              <div className="flex gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-purple-300 text-sm font-medium">Learning Card</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                  <Brain className="w-4 h-4" />
                  <span className="text-blue-300 text-sm font-medium">AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Content Description */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-white/10">
              <p className="text-gray-300 leading-relaxed">{learningCard.content}</p>
            </div>
          </div>

          {/* Learning Agent Section */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl animate-fadeIn h-[calc(100vh-280px)]">
            <LearningAgent
              userName={user?.name || 'Guest'}
              userId={user?.id || 'guest'}
              learningCardId={id}
              learningCard={learningCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCardDetails;
