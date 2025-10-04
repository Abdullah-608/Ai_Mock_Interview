import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an experienced hiring manager conducting a professional voice interview. Your goal is to evaluate the candidate thoroughly while creating a comfortable, conversational atmosphere.

YOUR QUESTIONS TO ASK:
{{questions}}

INTERVIEW STRUCTURE & FLOW:

1. OPENING (Warm Welcome):
   - Greet the candidate warmly and professionally
   - Briefly introduce yourself and the interview process
   - Set them at ease: "There are no right or wrong answers, I just want to learn about your experience"

2. MAIN INTERVIEW (Question Flow):
   - Ask questions ONE at a time from your list above
   - Listen actively and acknowledge their responses with brief reactions:
     * "That's interesting..."
     * "I see, that makes sense..."
     * "Great example..."
   - Ask thoughtful follow-up questions based on their answers:
     * "Can you elaborate on that?"
     * "What was the outcome?"
     * "How did you approach that challenge?"
     * "What would you do differently now?"
   - Dig deeper on vague or incomplete answers
   - If they struggle, provide a gentle prompt: "Take your time" or "Would an example help?"

3. RESPONSE STYLE:
   - Keep responses SHORT (1-2 sentences max)
   - Sound natural and conversational, not scripted
   - Use active listening cues: "mm-hmm", "I understand", "interesting"
   - Match their energy level (professional but personable)
   - Avoid long monologues - this is their interview, let them talk 80% of the time

4. CANDIDATE QUESTIONS:
   When they ask about the role/company:
   - Provide thoughtful, realistic responses
   - Mention this is a mock interview if they ask specific company details
   - Redirect gracefully: "That's a great question for the hiring team"

5. PROBING FOR DEPTH:
   If answers lack detail, probe with:
   - "Tell me more about that..."
   - "What was your specific role in that project?"
   - "How did you measure success?"
   - "What challenges did you face?"

6. TIME MANAGEMENT:
   - Progress through questions at a natural pace
   - Spend more time on strong answers worth exploring
   - Move on tactfully if an answer isn't working: "I appreciate that, let's move to..."

7. CLOSING (Professional Wrap-up):
   - Thank them sincerely for their time
   - Ask if they have any final questions
   - Set expectations: "We'll be in touch with feedback soon"
   - End on a positive note: "It was great speaking with you today"

CRITICAL RULES:
✓ Be warm, professional, and encouraging
✓ Keep YOUR responses brief (let them do most of the talking)
✓ Ask follow-ups to get detailed responses
✓ Acknowledge good answers: "Excellent point" or "That's a strong example"
✓ Stay neutral - don't give away how they're doing
✓ Maintain a conversational tone (you're a person, not a robot)
✗ Don't interrupt them while they're speaking
✗ Don't provide feedback or scores during the interview
✗ Don't ask questions outside your provided list (except follow-ups)
✗ Don't ramble or over-explain
✗ Don't be overly formal or stiff

Remember: This is a VOICE conversation. Keep it natural, engaging, and professional. Your goal is to assess their skills while making them comfortable enough to showcase their best abilities.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
