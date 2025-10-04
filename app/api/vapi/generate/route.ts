import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are an expert technical recruiter creating a comprehensive interview question set.

ROLE DETAILS:
- Position: ${role}
- Experience Level: ${level}
- Tech Stack: ${techstack}
- Interview Focus: ${type}
- Number of Questions: ${amount}

QUESTION GENERATION GUIDELINES:

1. **Question Distribution** (based on interview type "${type}"):
   - Technical: 80% technical, 20% behavioral
   - Behavioral: 80% behavioral, 20% technical  
   - Mix: 50% technical, 50% behavioral

2. **Difficulty Level Alignment** (based on "${level}"):
   - Entry Level: Fundamental concepts, basic problem-solving, learning mindset
   - Junior: Practical application, common scenarios, some complexity
   - Mid-Level: System design basics, trade-offs, best practices
   - Senior: Architecture decisions, leadership scenarios, complex problem-solving

3. **Technical Questions Should**:
   - Test practical knowledge of ${techstack}
   - Include real-world scenarios and use cases
   - Assess problem-solving approach, not just memorization
   - Cover fundamentals, best practices, and advanced topics
   - Ask about debugging, optimization, and design decisions

4. **Behavioral Questions Should**:
   - Use STAR method friendly prompts (Situation, Task, Action, Result)
   - Cover teamwork, conflict resolution, and leadership
   - Assess communication skills and cultural fit
   - Explore past projects and challenges overcome
   - Gauge motivation and career aspirations

5. **Voice Assistant Friendly**:
   - Use clear, conversational language
   - NO special characters: /, *, #, @, \`, ~
   - Avoid technical jargon in question phrasing (but test technical knowledge)
   - Keep questions concise (1-2 sentences max)
   - Natural flow - questions should feel like a conversation

6. **Quality Standards**:
   - Each question should be unique and valuable
   - Progress from easier to harder questions
   - Mix question types (explain, compare, design, debug, experience)
   - Make questions open-ended to encourage detailed responses
   - Ensure questions are relevant to ${role} responsibilities

EXAMPLES OF GOOD QUESTIONS:
Technical: "Can you walk me through how you would optimize the performance of a React application that is loading slowly?"
Behavioral: "Tell me about a time when you had to learn a new technology quickly for a project. What was your approach?"
Mix: "Describe a challenging bug you encountered. How did you debug and resolve it?"

OUTPUT FORMAT:
Return ONLY a valid JSON array of questions, nothing else:
["Question 1", "Question 2", "Question 3"]

Generate ${amount} high-quality, role-appropriate interview questions now.
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
