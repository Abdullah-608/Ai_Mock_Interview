import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import { getTechLogos } from "@/lib/utils";
import Dashboard from "./DashboardWrapper";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const userInterviews = await getInterviewsByUserId(user?.id || '');

  // Fetch feedback and tech icons for user interviews
  const interviewsWithFeedback = await Promise.all(
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

  return (
    <Dashboard 
      userInterviews={interviewsWithFeedback || []} 
      user={user || undefined}
    />
  );
}