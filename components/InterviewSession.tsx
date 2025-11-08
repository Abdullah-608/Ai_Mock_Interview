"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildInterviewPlan, InterviewRound } from "@/config/interviewPlan";
import { createFeedback } from "@/lib/actions/general.action";
import { Camera, CheckCircle2, Loader2, Mic, MicOff, StepForward, Volume2 } from "lucide-react";

interface InterviewPlan {
  summary?: string;
  behavioralQuestions?: string[];
  technicalQuestions?: string[];
  codingChallenge?: {
    prompt: string;
    hints?: string[];
    solutionOutline?: string;
  };
  followUpTopics?: string[];
}

type RoundState = "pending" | "active" | "complete";

interface PromptItem {
  prompt: string;
  helpers?: string[];
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
  roundId: string;
}

interface RoundHistoryEntry {
  messages: SavedMessage[];
  responses: Record<string, string>;
}

interface InterviewSessionProps {
  interviewId: string;
  userId?: string;
  role?: string;
  level?: string;
  type?: string;
  techstack?: string[];
  questions?: string[];
  plan?: InterviewPlan;
  feedbackId?: string;
}

const defaultFollowUps = [
  "What part of the interview did you feel most confident about?",
  "Which area would you like to practice again?",
  "Do you have any questions for the interviewer or company?",
];

const getRoundPrompts = (
  round: InterviewRound | undefined,
  plan: InterviewPlan | null,
  fallbackQuestions: string[]
): PromptItem[] => {
  if (!round) return [];

  switch (round.type) {
    case "behavioral": {
      const prompts = plan?.behavioralQuestions?.length
        ? plan.behavioralQuestions
        : fallbackQuestions.slice(0, Math.max(2, Math.ceil(fallbackQuestions.length / 2)));
      return prompts.map((prompt) => ({ prompt }));
    }
    case "technical": {
      const prompts: PromptItem[] = [];

      if (plan?.codingChallenge?.prompt) {
        prompts.push({
          prompt: plan.codingChallenge.prompt,
          helpers: plan.codingChallenge.hints,
        });
      }

      const technicalPrompts = plan?.technicalQuestions?.length
        ? plan.technicalQuestions
        : fallbackQuestions.slice(Math.ceil(fallbackQuestions.length / 2));

      prompts.push(...technicalPrompts.map((prompt) => ({ prompt })));

      return prompts;
    }
    case "closing": {
      const followUps = plan?.followUpTopics?.length ? plan.followUpTopics : defaultFollowUps;
      return followUps.map((topic) => ({
        prompt: `Reflect on: ${topic}`,
      }));
    }
    default:
      return [];
  }
};

const InterviewSession = ({
  interviewId,
  userId,
  role,
  level,
  type,
  techstack,
  questions = [],
  plan,
  feedbackId,
}: InterviewSessionProps) => {
  const router = useRouter();

  const interviewBlueprint: InterviewPlan | null = useMemo(() => {
    if (plan && (plan.behavioralQuestions?.length || plan.technicalQuestions?.length)) {
      return plan;
    }

    const midpoint = Math.ceil(questions.length / 2);
    return {
      summary: `Practice for a ${level || "mid-level"} ${role || "candidate"} interview.`,
      behavioralQuestions: questions.slice(0, midpoint),
      technicalQuestions: questions.slice(midpoint),
    };
  }, [plan, questions, role, level]);

  const rounds = useMemo<InterviewRound[]>(
    () =>
      buildInterviewPlan({
        role,
        level,
        type,
        techstack,
        questions,
      }),
    [level, questions, role, techstack, type]
  );

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundStatuses, setRoundStatuses] = useState<Record<string, RoundState>>({});
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [roundHistory, setRoundHistory] = useState<Record<string, RoundHistoryEntry>>({});
  const [interviewTranscripts, setInterviewTranscripts] = useState<SavedMessage[]>([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spokenPrompt, setSpokenPrompt] = useState<string | null>(null);
  const [listeningPrompt, setListeningPrompt] = useState<string | null>(null);
  const [speechSupport, setSpeechSupport] = useState<{ tts: boolean; stt: boolean }>({
    tts: false,
    stt: false,
  });
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const initialStatuses = rounds.reduce<Record<string, RoundState>>((acc, round, index) => {
      acc[round.id] = index === 0 ? "active" : "pending";
      return acc;
    }, {});
    setRoundStatuses(initialStatuses);
    setCurrentRoundIndex(0);
    setRoundHistory({});
    setInterviewTranscripts([]);
    setResponses({});
    setError(null);
  }, [rounds]);

  const currentRound = rounds[currentRoundIndex];

  const promptItems = useMemo(
    () => getRoundPrompts(currentRound, interviewBlueprint, questions),
    [currentRound, interviewBlueprint, questions]
  );

  useEffect(() => {
    if (!currentRound) return;

    setResponses((prev) => {
      const initial: Record<string, string> = {};
      promptItems.forEach((item) => {
        initial[item.prompt] = prev[item.prompt] ?? "";
      });
      return initial;
    });
    setError(null);
  }, [currentRoundIndex, promptItems, currentRound]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSpeechSynthesis = typeof window.speechSynthesis !== "undefined";
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setSpeechSupport({
      tts: hasSpeechSynthesis,
      stt: Boolean(SpeechRecognition),
    });

    return () => {
      if (hasSpeechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !videoRef.current) return;

    let activeStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
        setCameraError(null);
      } catch (error) {
        console.error("Camera access error:", error);
        setCameraEnabled(false);
        setCameraError(
          "We couldn’t access your webcam. Check browser permissions or try a device with a camera."
        );
      }
    };

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleResponseChange = (prompt: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [prompt]: value,
    }));
  };

  const speakPrompt = (prompt: string) => {
    if (!speechSupport.tts || typeof window === "undefined") return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(prompt);
    utterance.onstart = () => setSpokenPrompt(prompt);
    utterance.onend = () => setSpokenPrompt(null);
    utterance.onerror = () => setSpokenPrompt(null);
    window.speechSynthesis.speak(utterance);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningPrompt(null);
  };

  const startListening = (prompt: string) => {
    if (!speechSupport.stt || typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      setResponses((prev) => {
        const current = prev[prompt] || "";
        const base = current.replace(new RegExp(`${interimTranscript}$`), "");
        const updated = `${base}${finalTranscript || interimTranscript}`.trimStart();
        return {
          ...prev,
          [prompt]: updated,
        };
      });
    };

    recognition.onerror = () => {
      setListeningPrompt(null);
    };

    recognition.onend = () => {
      setListeningPrompt(null);
    };

    recognitionRef.current = recognition;
    setListeningPrompt(prompt);
    recognition.start();
  };

  const handleSaveRound = () => {
    if (!currentRound) return;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopListening();

    const entries: SavedMessage[] = [];
    let hasAnswer = false;

    promptItems.forEach((item) => {
      const question = item.prompt;
      const answer = (responses[question] || "").trim();

      entries.push({
        role: "assistant",
        content: question,
        roundId: currentRound.id,
      });

      if (answer) {
        hasAnswer = true;
        entries.push({
          role: "user",
          content: answer,
          roundId: currentRound.id,
        });
      }
    });

    if (!hasAnswer) {
      setError("Please provide at least one response before continuing.");
      return;
    }

    setRoundHistory((prev) => ({
      ...prev,
      [currentRound.id]: {
        messages: entries,
        responses: { ...responses },
      },
    }));

    setInterviewTranscripts((prev) => [...prev, ...entries]);

    setRoundStatuses((prev) => ({
      ...prev,
      [currentRound.id]: "complete",
    }));

    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex((index) => index + 1);
      setRoundStatuses((prev) => ({
        ...prev,
        [rounds[currentRoundIndex + 1].id]: "active",
      }));
    }

    setResponses({});
    setError(null);
  };

  const handleGenerateFeedback = async () => {
    if (!userId) {
      setError("You must be signed in to save feedback.");
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      setError(null);

      const payload = interviewTranscripts.map(({ role, content }) => ({
        role,
        content,
      }));

      const { success, feedbackId: id } = await createFeedback({
        interviewId,
        userId,
        transcript: payload,
        feedbackId,
      });

      if (!success || !id) {
        setError("We couldn’t save the feedback. Please try again.");
        return;
      }

      router.push(`/interview/${interviewId}/feedback`);
    } catch (err) {
      console.error("Failed to save feedback:", err);
      setError("Unexpected error while saving feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const allRoundsComplete = useMemo(
    () => rounds.every((round) => roundStatuses[round.id] === "complete"),
    [roundStatuses, rounds]
  );

  return (
    <div className="space-y-8">
      {interviewBlueprint?.summary && (
        <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Interview Focus</h2>
          <p className="text-gray-300 leading-relaxed">{interviewBlueprint.summary}</p>
        </div>
      )}

  {(!speechSupport.tts || !speechSupport.stt) && (
    <div className="bg-yellow-500/10 border border-yellow-500/40 text-yellow-100 rounded-3xl p-4">
      <p className="text-sm">
        Voice playback or speech recognition may be limited in your browser. You can still type answers manually.
      </p>
    </div>
  )}

      <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-300" />
            Practice Mirror
          </h2>
          <p className="text-sm text-gray-400">
            Use your webcam to rehearse eye-contact, posture, and delivery while you respond. The feed stays local to your browser.
          </p>
          {!cameraEnabled && (
            <p className="text-xs text-yellow-200">
              {cameraError ||
                "Allow webcam access in your browser preferences to enable the preview. Refresh after granting permission."}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 md:w-72">
          <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/70">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Interview Journey</h2>
        <div className="flex flex-col gap-4">
          {rounds.map((round, index) => {
            const status = roundStatuses[round.id] || "pending";
            const isActive = index === currentRoundIndex;
            const isComplete = status === "complete";

            return (
              <div
                key={round.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                  isComplete
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : isActive
                    ? "border-blue-400/40 bg-blue-500/10"
                    : "border-white/10 bg-white/5"
                )}
              >
                <div className="mt-1">
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <StepForward className="w-5 h-5 text-blue-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">
                    Round {index + 1} · {status === "complete" ? "Completed" : isActive ? "Active" : "Pending"}
                  </p>
                  <h3 className="text-lg font-semibold text-white">{round.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{round.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentRound && (
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-40 rounded-full blur" />
                <Image
                  src="/ai-avatar.png"
                  alt="Interviewer"
                  width={72}
                  height={72}
                  className="relative rounded-full border border-white/20"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-300">Current Round</p>
                <h2 className="text-2xl font-bold text-white">{currentRound.title}</h2>
                <p className="text-gray-300 text-sm mt-2">{currentRound.instructions}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {promptItems.map((item, index) => (
              <div
                key={`${currentRound.id}-${index}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-white font-semibold sm:flex-1">{item.prompt}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakPrompt(item.prompt)}
                      disabled={!speechSupport.tts}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition",
                        speechSupport.tts
                          ? "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                          : "bg-slate-700 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Volume2 className="w-4 h-4" />
                      {spokenPrompt === item.prompt ? "Playing..." : "Play Prompt"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        listeningPrompt === item.prompt ? stopListening() : startListening(item.prompt)
                      }
                      disabled={!speechSupport.stt}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition",
                        speechSupport.stt
                          ? listeningPrompt === item.prompt
                            ? "bg-emerald-500/25 text-emerald-200 hover:bg-emerald-500/30"
                            : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                          : "bg-slate-700 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {listeningPrompt === item.prompt ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          Start Speaking
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {item.helpers && item.helpers.length > 0 && (
                  <ul className="text-sm text-blue-200 list-disc list-inside space-y-1">
                    {item.helpers.map((helper, helperIndex) => (
                      <li key={helperIndex}>{helper}</li>
                    ))}
                  </ul>
                )}
                <textarea
                  className="w-full min-h-[140px] rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your response here..."
                  value={responses[item.prompt] || ""}
                  onChange={(event) => handleResponseChange(item.prompt, event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleSaveRound}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold transition",
                currentRoundIndex < rounds.length - 1
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              )}
            >
              {currentRoundIndex < rounds.length - 1 ? "Save Round & Continue" : "Save Final Round"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      )}

      {Object.keys(roundHistory).length > 0 && (
        <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Round Notes</h2>
          {rounds
            .filter((round) => roundHistory[round.id])
            .map((round) => {
              const entry = roundHistory[round.id];
              return (
                <div key={round.id} className="rounded-2xl border border-white/10 p-4 bg-white/5 space-y-3">
                  <h3 className="text-lg font-semibold text-white">{round.title}</h3>
                  <div className="space-y-2 text-sm text-gray-200">
                    {Object.entries(entry.responses).map(([question, answer]) => (
                      <div key={question}>
                        <p className="text-blue-300 font-medium">{question}</p>
                        <p className="text-gray-200 whitespace-pre-line mt-1">
                          {answer.trim() ? answer : "No response provided."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {error && !currentRound && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {!error && (
            <p className="text-sm text-gray-400">
              Finish each round, then generate an AI summary of your performance.
            </p>
          )}
        </div>

        <button
          onClick={handleGenerateFeedback}
          disabled={!allRoundsComplete || isSubmittingFeedback || !interviewTranscripts.length}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition",
            allRoundsComplete
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
              : "bg-slate-700 text-gray-400 cursor-not-allowed",
            isSubmittingFeedback && "opacity-70"
          )}
        >
          {isSubmittingFeedback ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Generate Feedback Summary
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;


