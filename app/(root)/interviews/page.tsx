import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import { getTechLogos } from "@/lib/utils";
import InterviewsClient from "./InterviewsClient";

export default async function InterviewsPage() {
  const user = await getCurrentUser();

  // Fetch user's interviews and all interviews in parallel
  const [userInterviews, allInterviewsRaw] = await Promise.all([
    getInterviewsByUserId(user?.id || ''),
    getLatestInterviews({ userId: user?.id || '', limit: 50 }),
  ]);

  // Enrich user interviews with feedback and tech icons
  const userInterviewsWithFeedback = await Promise.all(
    (userInterviews || []).map(async (interview) => {
      const [feedback, techIcons] = await Promise.all([
        getFeedbackByInterviewId({
          interviewId: interview.id,
          userId: user?.id || '',
        }),
        getTechLogos(interview.techstack || []),
      ]);
      return {
        ...interview,
        feedback,
        techIcons,
      };
    })
  );

  // Enrich all interviews with feedback and tech icons
  const allInterviewsWithFeedback = await Promise.all(
    (allInterviewsRaw || []).map(async (interview) => {
      const [feedback, techIcons] = await Promise.all([
        getFeedbackByInterviewId({
          interviewId: interview.id,
          userId: interview.userId,
        }),
        getTechLogos(interview.techstack || []),
      ]);
      return {
        ...interview,
        feedback,
        techIcons,
      };
    })
  );

  return (
    <InterviewsClient 
      userInterviews={userInterviewsWithFeedback || []} 
      allInterviews={allInterviewsWithFeedback || []}
      user={user}
    />
  );
}

