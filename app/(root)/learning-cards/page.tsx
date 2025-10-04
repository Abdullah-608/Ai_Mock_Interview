import { getCurrentUser } from "@/lib/actions/auth.action";
import { getAllLearningCards, getLearningCardsByUserId } from "@/lib/actions/general.action";
import LearningCardsClient from "./LearningCardsClient";

export default async function LearningCardsPage() {
  const user = await getCurrentUser();

  // Fetch user's cards and all cards in parallel
  const [userCards, allCards] = await Promise.all([
    user?.id ? getLearningCardsByUserId(user.id) : Promise.resolve([]),
    getAllLearningCards(50),
  ]);

  return (
    <LearningCardsClient 
      user={user} 
      allCards={allCards || []} 
    />
  );
}
