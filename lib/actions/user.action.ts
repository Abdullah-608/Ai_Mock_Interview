"use server";

import { cookies } from "next/headers";
import { db } from "@/firebase/admin";

// This would typically interact with your database to store user preferences
export async function setUserSubscription(userId: string, tier: string) {
  // In a real implementation, you would:
  // 1. Update user subscription in database
  // 2. Process payment if needed
  // 3. Update user privileges
  
  // For now, we'll just set a cookie to simulate persistence
  const cookieStore = await cookies();
  cookieStore.set("userTier", tier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return { success: true };
}

export async function setUserModel(userId: string, model: string) {
  // In a real implementation, you would update the user's preferred model in your database
  
  // For now, we'll just set a cookie to simulate persistence
  const cookieStore = await cookies();
  cookieStore.set("userModel", model, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return { success: true };
}

export async function getUserModel(userId: string) {
  // In a real implementation, you would fetch from your database
  
  // For demo purposes, read from cookie
  const cookieStore = await cookies();
  const model = cookieStore.get("userModel")?.value;
  return model || "gemini-2.0-flash-001"; // Default to gemini-vapi if not set
}

export async function getUserStats(userId: string) {
  try {
    // Get total interviews
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();
    
    const totalInterviews = interviewsSnapshot.size;
    
    // Get completed interviews (with feedback)
    const completedInterviews = interviewsSnapshot.docs.filter(
      (doc) => doc.data().finalized === true
    ).length;
    
    // Calculate average score from feedbacks
    const feedbacksSnapshot = await db
      .collection("feedbacks")
      .where("userId", "==", userId)
      .get();
    
    let totalScore = 0;
    let scoreCount = 0;
    
    feedbacksSnapshot.docs.forEach((doc) => {
      const feedback = doc.data();
      if (feedback.overallScore) {
        totalScore += feedback.overallScore;
        scoreCount++;
      }
    });
    
    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;
    const successRate = totalInterviews > 0 
      ? Math.round((completedInterviews / totalInterviews) * 100) 
      : 0;
    
    return {
      totalInterviews,
      completedInterviews,
      averageScore: parseFloat(averageScore as string),
      successRate,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: 0,
      successRate: 0,
    };
  }
}