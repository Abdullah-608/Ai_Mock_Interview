"use server";

import { cookies } from "next/headers";

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