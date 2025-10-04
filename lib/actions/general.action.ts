"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are a senior hiring manager and expert interview coach analyzing a mock interview. Your feedback is critical for helping candidates improve their interview performance.

        INTERVIEW TRANSCRIPT:
        ${formattedTranscript}

        EVALUATION GUIDELINES:

        Analyze the candidate's performance across these 5 key areas:

        1. **Communication Skills (0-100)**
           - Evaluate: Clarity, articulation, structure of responses, active listening
           - Look for: STAR method usage, concise yet comprehensive answers, avoiding filler words
           - Consider: Tone, pace, and ability to explain complex topics simply

        2. **Technical Knowledge (0-100)**
           - Evaluate: Depth of understanding, accuracy of technical explanations
           - Look for: Practical examples, real-world applications, best practices awareness
           - Consider: Ability to explain technical concepts clearly, handling of technical questions

        3. **Problem Solving (0-100)**
           - Evaluate: Analytical thinking, approach to challenges, logical reasoning
           - Look for: Structured problem-solving, consideration of trade-offs, innovative thinking
           - Consider: How they break down complex problems, handling of hypothetical scenarios

        4. **Cultural Fit (0-100)**
           - Evaluate: Professional demeanor, enthusiasm, alignment with role expectations
           - Look for: Passion for the field, team collaboration mindset, growth mindset
           - Consider: Values demonstrated, motivation, long-term career goals

        5. **Confidence and Clarity (0-100)**
           - Evaluate: Self-assurance without arrogance, clear expression of thoughts
           - Look for: Handling uncertainty gracefully, admitting knowledge gaps professionally
           - Consider: Body language cues (if mentioned), decisiveness, composure

        SCORING RUBRIC:
        - 90-100: Exceptional - Ready for senior roles, exceeds expectations
        - 80-89: Strong - Well-prepared, minor improvements needed
        - 70-79: Good - Competent but needs work in some areas
        - 60-69: Average - Shows potential but significant gaps
        - 50-59: Below Average - Needs substantial preparation
        - Below 50: Needs significant improvement before re-interviewing

        FOR EACH CATEGORY:
        - Provide a specific, actionable comment (2-3 sentences)
        - Reference actual responses from the transcript
        - Give concrete examples of what was done well or needs improvement

        STRENGTHS (Provide 3-5 specific strengths):
        - Be specific and reference actual moments from the interview
        - Focus on what made their answers stand out
        - Highlight transferable skills

        AREAS FOR IMPROVEMENT (Provide 3-5 specific areas):
        - Be constructive and specific
        - Provide actionable advice on how to improve
        - Reference specific questions where they could have done better

        FINAL ASSESSMENT:
        Write a comprehensive 4-5 sentence summary that:
        - Starts with an overall impression
        - Highlights their top 2 strengths
        - Identifies their main area for improvement
        - Ends with encouraging words and next steps
        - Maintains a professional yet supportive tone

        TOTAL SCORE: Calculate the average of all 5 category scores (rounded to nearest integer)

        Be honest but constructive. Your goal is to help them become better candidates.
        `,
      system:
        "You are an expert interview coach and senior hiring manager with 15+ years of experience evaluating candidates. Provide detailed, specific, and actionable feedback that helps candidates improve their interview skills.",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

  // Sort by createdAt in memory to avoid composite index requirement
  const sortedInterviews = interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];

  return sortedInterviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


export async function deleteInterview({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}) {
  try {
    // First, verify that the interview belongs to the user
    const interviewRef = db.collection("interviews").doc(interviewId);
    const interviewDoc = await interviewRef.get();
    
    if (!interviewDoc.exists) {
      return { success: false, error: "Interview not found" };
    }
    
    const interviewData = interviewDoc.data();
    
    // Security check: ensure the user owns this interview
    if (interviewData?.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Get all feedback documents related to this interview
    const feedbackQuery = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();
    
    // Delete all feedback documents in a batch
    const batch = db.batch();
    
    feedbackQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete the interview document
    batch.delete(interviewRef);
    
    // Commit the batch
    await batch.commit();
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting interview:", error);
    return { success: false, error: "Failed to delete interview" };
  }
}

// Learning Cards Functions
export async function createLearningCard(params: {
  title: string;
  content: string;
  notes: string;
  explanation: string;
  userId: string;
  userName?: string;
}) {
  try {
    const learningCard = {
      title: params.title,
      content: params.content,
      notes: params.notes,
      explanation: params.explanation,
      userId: params.userId,
      userName: params.userName,
      coverImage: '/ai-avatar.png',
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("learningCards").add(learningCard);
    return { success: true, cardId: docRef.id };
  } catch (error) {
    console.error("Error creating learning card:", error);
    return { success: false, error: "Failed to create learning card" };
  }
}

export async function getLearningCardById(id: string): Promise<LearningCard | null> {
  try {
    const doc = await db.collection("learningCards").doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as LearningCard;
  } catch (error) {
    console.error("Error fetching learning card:", error);
    return null;
  }
}

export async function getLearningCardsByUserId(userId: string): Promise<LearningCard[] | null> {
  try {
    const querySnapshot = await db
      .collection("learningCards")
      .where("userId", "==", userId)
      .get();

    // Sort by createdAt in memory to avoid composite index requirement
    const cards = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LearningCard[];

    return cards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching user learning cards:", error);
    return null;
  }
}

export async function getAllLearningCards(limit: number = 20): Promise<LearningCard[] | null> {
  try {
    const querySnapshot = await db
      .collection("learningCards")
      .limit(limit * 2) // Get more to account for sorting
      .get();

    // Sort by createdAt in memory to avoid composite index requirement
    const cards = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LearningCard[];

    return cards
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching all learning cards:", error);
    return null;
  }
}

export async function deleteLearningCard({
  cardId,
  userId,
}: {
  cardId: string;
  userId: string;
}) {
  try {
    // First, verify that the card belongs to the user
    const cardRef = db.collection("learningCards").doc(cardId);
    const cardDoc = await cardRef.get();
    
    if (!cardDoc.exists) {
      return { success: false, error: "Learning card not found" };
    }
    
    const cardData = cardDoc.data();
    
    // Security check: ensure the user owns this card
    if (cardData?.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Delete the learning card document
    await cardRef.delete();
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting learning card:", error);
    return { success: false, error: "Failed to delete learning card" };
  }
}