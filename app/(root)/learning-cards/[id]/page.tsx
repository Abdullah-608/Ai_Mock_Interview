import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLearningCardById } from "@/lib/actions/general.action";
import { BookOpen, Brain, Clock, Calendar } from 'lucide-react';
import LearningAgentNew from "@/components/LearningAgentNew";

export const dynamic = 'force-dynamic';

const LearningCardDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const learningCard = await getLearningCardById(id);
  
  if (!learningCard) redirect("/learning-cards");

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen relative pb-8">
      <div className="pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header Card - Compact on mobile, expanded on desktop */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl mb-4 lg:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              {/* Title and Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 break-words">
                  {learningCard.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span>AI-Generated Content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{formatDate(learningCard.createdAt)}</span>
                  </div>
                  {learningCard.userName && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span>By {learningCard.userName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Original Content - Collapsible on mobile */}
            {learningCard.content && (
              <div className="mt-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Original Content:</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {learningCard.content}
                </p>
              </div>
            )}
          </div>

          {/* Learning Agent Section - Responsive height */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
            <div className="h-[500px] sm:h-[600px] lg:h-[calc(100vh-400px)]">
              <LearningAgentNew
                userName={user?.name || 'Guest'}
                userId={user?.id || 'guest'}
                learningCardId={id}
                learningCard={learningCard}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCardDetails;
