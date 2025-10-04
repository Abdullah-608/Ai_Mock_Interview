import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewGenerationClient from "./InterviewGenerationClient";

const Page = async () => {
  const user = await getCurrentUser();

  return <InterviewGenerationClient user={user} />;
};

export default Page;
