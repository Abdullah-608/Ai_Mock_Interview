export type InterviewRoundType = "behavioral" | "technical" | "closing";

export interface InterviewRound {
  id: string;
  type: InterviewRoundType;
  title: string;
  description: string;
  instructions: string;
  prompt: string;
}

interface BuildInterviewPlanArgs {
  role?: string;
  level?: string;
  type?: string;
  techstack?: string[];
  questions?: string[];
}

const formatQuestions = (questions: string[] = []) =>
  questions.map((question, index) => `${index + 1}. ${question}`).join("\n");

export const buildInterviewPlan = ({
  role = "Software Engineer",
  level = "mid-level",
  type = "mixed",
  techstack = [],
  questions = [],
}: BuildInterviewPlanArgs): InterviewRound[] => {
  const safeRole = role || "Software Engineer";
  const safeLevel = level || "mid-level";
  const safeTechStack = techstack.length ? techstack.join(", ") : "general software engineering";
  const formattedQuestions = formatQuestions(questions);

  const behavioralPrompt = `
You are a warm, experienced hiring manager running a behavioral interview for a ${safeLevel} ${safeRole}.

Interview guidelines:
- Start with a welcome and set expectations.
- Ask the candidate the following behavioral questions one at a time:
${formattedQuestions || "- Ask about a past project, a challenge, and a teamwork example."}
- For each answer, dig deeper using the STAR (Situation, Task, Action, Result) method.
- Keep your responses short so the candidate does most of the talking.
- Encourage them, acknowledge their answers, and probe for more detail when needed.

After covering the questions:
- Provide a concise spoken summary of what you heard.
- DO NOT provide scores aloud; the summary should feel conversational.
`;

  const technicalPrompt = `
You are a senior engineer running a coding/technical round for a ${safeLevel} ${safeRole} interview. The candidate's primary stack includes: ${safeTechStack}.

Interview guidelines:
- Present ONE coding exercise or technical scenario relevant to the stack above.
- Allow the candidate to think out loud and describe their approach. Encourage them to outline their solution, data structures, algorithms, and edge cases.
- If they want to narrate code, let them do it verbally. Ask clarifying questions and explore trade-offs.
- After they finish, walk through potential improvements or alternative solutions.
- Keep the tone collaborative and supportive.

When the discussion is finished:
- Provide a short verbal recap of how they approached the problem and high-level feedback on correctness, complexity, and clarity.
`;

  const closingPrompt = `
You are wrapping up a multi-round mock interview for a ${safeLevel} ${safeRole}.

Closing guidelines:
- Thank the candidate for their time.
- Summarize, in plain language, the strengths and growth areas you observed from both the behavioral and technical discussions.
- Offer 2-3 specific next steps or practice suggestions.
- End on an encouraging, professional note.
`;

  return [
    {
      id: "behavioral",
      type: "behavioral",
      title: "Behavioral Q&A",
      description:
        "Explore your past experiences, teamwork, and problem-solving mindset with STAR-style questions.",
      instructions:
        "Answer aloud in STAR format (Situation, Task, Action, Result). Give concrete examples and highlight your impact.",
      prompt: behavioralPrompt,
    },
    {
      id: "technical",
      type: "technical",
      title: "Technical Challenge",
      description:
        "Tackle a coding or systems problem relevant to the role. Explain your approach as you think.",
      instructions:
        "Describe your approach step-by-step. Narrate any code aloud, cover edge cases, and discuss complexity or trade-offs.",
      prompt: technicalPrompt,
    },
    {
      id: "closing",
      type: "closing",
      title: "Closing Discussion",
      description:
        "Hear a quick recap, feedback highlights, and recommended focus areas for your next practice session.",
      instructions:
        "Listen to the summary and ask any remaining questions. Note the key takeaways for your improvement plan.",
      prompt: closingPrompt,
    },
  ];
};



