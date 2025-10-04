"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Suppress daily-js version warnings
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('daily-js version') && message.includes('no longer supported')) {
        return; // Suppress this specific warning
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: unknown) => {
      // Silently handle call end errors
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = String(error.message);
        if (errorMessage.includes('Meeting has ended') || errorMessage.includes('Call has ended')) {
          // This is expected when the call ends, don't log as error
          return;
        }
      }
      console.error("VAPI Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      // Silently handle disconnect errors as the call might already be ended
      console.log("Call disconnected");
    }
  };

  return (
    <>
      <div className="call-view flex justify-center items-center gap-10 my-8 transition-all duration-500 hover:scale-[1.01]">
        {/* AI Interviewer Card */}
        <div className="card-interviewer bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-md border border-blue-100 transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <div className="avatar relative">
            <div className="absolute -inset-1 bg-blue-100 rounded-full blur-md animate-pulse"></div>
            <div className="relative">
              <Image
                src="/ai-avatar.png"
                alt="profile-image"
                width={65}
                height={54}
                className="object-cover rounded-full border-2 border-white shadow-sm transition-transform duration-500 hover:rotate-3"
              />
              {isSpeaking && (
                <span className="animate-speak absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                </span>
              )}
            </div>
          </div>
          <h3 className="mt-3 font-semibold text-blue-800 transition-all duration-300 hover:text-blue-600">AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border bg-white p-1 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="card-content bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-80 animate-pulse"></div>
              <Image
                src="/user-avatar.png"
                alt="profile-image"
                width={539}
                height={539}
                className="rounded-full object-cover size-[120px] border-2 border-white shadow-sm relative transition-all duration-300 hover:shadow-md"
              />
            </div>
            <h3 className="mt-4 font-semibold text-gray-800 transition-all duration-300 hover:text-blue-600">{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border bg-white border border-gray-100 rounded-2xl shadow-sm p-1 mb-8 max-w-3xl mx-auto transition-all duration-300 hover:shadow-md">
          <div className="transcript bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl">
            <p
              key={lastMessage}
              className={cn(
                "transition-all duration-700 text-gray-700 leading-relaxed",
                "animate-fadeIn opacity-100 before:content-['\\0022'] after:content-['\\0022'] before:text-blue-400 before:text-xl before:mr-1 after:text-blue-400 after:text-xl after:ml-1"
              )}              
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-8">
        {callStatus !== "ACTIVE" ? (
          <button 
            className={cn(
              "relative btn-call px-8 py-3 rounded-full font-medium text-white shadow-md transition-all duration-300",
              callStatus === "CONNECTING" 
                ? "bg-yellow-500 hover:bg-yellow-600" 
                : "bg-green-500 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            )} 
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            {callStatus === "CONNECTING" && (
              <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-75 animate-ping"></span>
            )}

            <span className="relative flex items-center justify-center gap-2">
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Start Call
                </>
              ) : (
                <>
                  <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                  <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </>
              )}
            </span>
          </button>
        ) : (
          <button 
            className="btn-disconnect bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2" 
            onClick={() => handleDisconnect()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            End Call
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;