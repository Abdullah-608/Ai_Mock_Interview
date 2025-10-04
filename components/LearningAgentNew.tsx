"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { PlayCircle, StopCircle, Loader2, BookOpen, Lightbulb, MessageSquare } from "lucide-react";

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

interface LearningCard {
  id: string;
  title: string;
  content: string;
  notes: string;
  explanation: string;
  createdAt: string;
  userId: string;
  userName?: string;
  coverImage?: string;
}

interface LearningAgentProps {
  userName: string;
  userId: string;
  learningCardId: string;
  learningCard: LearningCard;
}

function LearningAgentNew({
  userName,
  learningCard,
}: LearningAgentProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'guide'>('notes');

  // Debug: Log the learning card data
  useEffect(() => {
    console.log('=== Learning Card Data ===');
    console.log('Title:', learningCard.title);
    console.log('Notes length:', learningCard.notes?.length || 0);
    console.log('Explanation length:', learningCard.explanation?.length || 0);
    console.log('Notes preview:', learningCard.notes?.substring(0, 100));
    console.log('Explanation preview:', learningCard.explanation?.substring(0, 100));
  }, [learningCard]);

  // Suppress VAPI warnings
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      if (
        !message.includes('transport') &&
        !message.includes('daily-js') &&
        !message.includes('WebSocket')
      ) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      if (
        !message.includes('transport') &&
        !message.includes('daily-js') &&
        !message.includes('WebSocket')
      ) {
        originalError.apply(console, args);
      }
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // VAPI event handlers
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages(prev => [...prev, {
          role: message.role,
          content: message.transcript
        }]);
      }
    };

    const onError = (error: any) => {
      const errorMessage = error?.message || error?.toString() || '';
      if (
        !errorMessage.includes('transport') &&
        !errorMessage.includes('daily-js') &&
        !errorMessage.includes('WebSocket')
      ) {
        console.error("VAPI Error:", error);
      }
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

  const handleCall = useCallback(async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      const learningAssistant = {
        name: "Learning Assistant",
        firstMessage: `Hello ${userName}! I'm your AI learning assistant. I'm here to help you understand ${learningCard.title}. Let me explain the key concepts and answer any questions you might have.`,
        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2",
          language: "en" as const,
        },
        voice: {
          provider: "11labs" as const,
          voiceId: "sarah",
          stability: 0.4,
          similarityBoost: 0.8,
          speed: 0.9,
          style: 0.5,
          useSpeakerBoost: true,
        },
        model: {
          provider: "openai" as const,
          model: "gpt-4" as const,
          messages: [
            {
              role: "system" as const,
              content: `You are an expert learning assistant specializing in explaining topics clearly.

LEARNING TOPIC: ${learningCard.title}
CONTENT: ${learningCard.content}
NOTES: ${learningCard.notes}
EXPLANATION: ${learningCard.explanation}

Explain concepts conversationally, use examples, and answer questions clearly.`,
            },
          ],
        },
      };

      await vapi.start(learningAssistant);
    } catch (error) {
      console.error("Failed to start learning session:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  }, [userName, learningCard]);

  const handleDisconnect = useCallback(() => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      console.error("Error stopping call:", error);
    }
  }, []);

  // Format notes with proper rendering
  const formattedNotes = useMemo(() => {
    if (!learningCard.notes || learningCard.notes.trim().length === 0) {
      console.log('No notes found to format');
      return null;
    }
    
    console.log('Formatting notes, length:', learningCard.notes.length);
    
    const lines = learningCard.notes.split('\n');
    const elements = lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 2) return null;

      // Headings (surrounded by **)
      if (trimmed.match(/^\*\*.*\*\*:?$/)) {
        const heading = trimmed.replace(/\*\*/g, '').replace(/:$/, '').trim();
        return (
          <h3 key={`heading-${index}`} className="text-lg lg:text-xl font-bold text-blue-400 mt-4 lg:mt-6 mb-2 lg:mb-3 first:mt-0">
            {heading}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
        let content = trimmed.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
        // Remove bold markers
        content = content.replace(/\*\*/g, '');
        // Handle inline code
        const parts = content.split('`');
        const formatted = parts.map((part, i) => 
          i % 2 === 1 ? (
            <code key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-green-400">
              {part}
            </code>
          ) : part
        );
        
        return (
          <li key={`bullet-${index}`} className="ml-4 lg:ml-6 mb-2 text-gray-300 leading-relaxed text-sm lg:text-base">
            {formatted}
          </li>
        );
      }

      // Regular text
      let formatted = trimmed.replace(/\*\*/g, '');
      return (
        <p key={`text-${index}`} className="text-gray-300 mb-2 lg:mb-3 leading-relaxed text-sm lg:text-base">
          {formatted}
        </p>
      );
    });

    const filtered = elements.filter(Boolean);
    console.log('Formatted notes count:', filtered.length);
    return filtered.length > 0 ? filtered : null;
  }, [learningCard.notes]);

  // Format explanation
  const formattedExplanation = useMemo(() => {
    if (!learningCard.explanation || learningCard.explanation.trim().length === 0) {
      console.log('No explanation found to format');
      return null;
    }
    
    console.log('Formatting explanation, length:', learningCard.explanation.length);
    
    const lines = learningCard.explanation.split('\n');
    const elements = lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 2) return null;

      // Code blocks
      if (trimmed.startsWith('```')) return null;

      // Headings
      if (trimmed.match(/^\*\*.*\*\*:?$/)) {
        const heading = trimmed.replace(/\*\*/g, '').replace(/:$/, '').trim();
        return (
          <h3 key={`exp-heading-${index}`} className="text-lg lg:text-xl font-bold text-purple-400 mt-4 lg:mt-6 mb-2 lg:mb-3 first:mt-0">
            {heading}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
        let content = trimmed.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
        content = content.replace(/\*\*/g, '');
        
        // Handle inline code
        const parts = content.split('`');
        const formatted = parts.map((part, i) => 
          i % 2 === 1 ? (
            <code key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-green-400">
              {part}
            </code>
          ) : part
        );
        
        return (
          <li key={`exp-bullet-${index}`} className="ml-4 lg:ml-6 mb-2 text-gray-300 leading-relaxed text-sm lg:text-base">
            {formatted}
          </li>
        );
      }

      // Regular text
      let content = trimmed.replace(/\*\*/g, '');
      const parts = content.split('`');
      const formatted = parts.map((part, i) => 
        i % 2 === 1 ? (
          <code key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-green-400">
            {part}
          </code>
        ) : part
      );
      
      return (
        <p key={`exp-text-${index}`} className="text-gray-300 mb-2 lg:mb-3 leading-relaxed text-sm lg:text-base">
          {formatted}
        </p>
      );
    });

    const filtered = elements.filter(Boolean);
    console.log('Formatted explanation count:', filtered.length);
    return filtered.length > 0 ? filtered : null;
  }, [learningCard.explanation]);

  // Extract key points
  const keyPoints = useMemo(() => {
    const points: string[] = [];
    
    console.log('Extracting key points...');
    
    // Extract from notes
    if (learningCard.notes && learningCard.notes.trim().length > 0) {
      const notesLines = learningCard.notes.split('\n');
      notesLines.forEach(line => {
        const trimmed = line.trim();
        if ((trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) && trimmed.length > 5) {
          let cleaned = trimmed.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
          // Remove inline code markers
          cleaned = cleaned.replace(/`/g, '');
          // Limit length
          cleaned = cleaned.substring(0, 120);
          
          if (cleaned.length > 10 && !points.includes(cleaned)) {
            points.push(cleaned);
          }
        }
      });
    }
    
    // Also extract from explanation if we don't have enough
    if (points.length < 8 && learningCard.explanation && learningCard.explanation.trim().length > 0) {
      const explanationLines = learningCard.explanation.split('\n');
      explanationLines.forEach(line => {
        const trimmed = line.trim();
        if ((trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) && trimmed.length > 5) {
          let cleaned = trimmed.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
          cleaned = cleaned.replace(/`/g, '');
          cleaned = cleaned.substring(0, 120);
          
          if (cleaned.length > 10 && !points.includes(cleaned)) {
            points.push(cleaned);
          }
        }
      });
    }
    
    console.log('Extracted key points:', points.length);
    return points.slice(0, 8);
  }, [learningCard.notes, learningCard.explanation]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Mobile: Stack vertically, Desktop: 3 columns */}
      
      {/* AI Session - Left on desktop, top on mobile */}
      <div className="w-full lg:w-1/5 flex-shrink-0">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-4 lg:p-6 border border-white/10 h-full flex flex-col">
          <h3 className="text-base lg:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span className="hidden lg:inline">AI Session</span>
            <span className="lg:hidden">AI Learning</span>
          </h3>
          
          {/* AI Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <Image
                src="/ai-avatar.png"
                alt="AI Assistant"
                width={60}
                height={60}
                className="rounded-full border-2 border-blue-400"
              />
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-2">Learning Assistant</p>
          </div>

          {/* Controls */}
          <div className="mt-auto">
            {callStatus === CallStatus.INACTIVE && (
              <button
                onClick={handleCall}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                <span className="hidden lg:inline">Start Learning</span>
                <span className="lg:hidden">Start</span>
              </button>
            )}
            
            {callStatus === CallStatus.CONNECTING && (
              <button disabled className="w-full bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </button>
            )}
            
            {callStatus === CallStatus.ACTIVE && (
              <button
                onClick={handleDisconnect}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <StopCircle className="w-5 h-5" />
                <span className="hidden lg:inline">Stop Session</span>
                <span className="lg:hidden">Stop</span>
              </button>
            )}

            {/* Transcript */}
            {messages.length > 0 && (
              <div className="mt-4 max-h-32 overflow-y-auto bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">Recent:</p>
                {messages.slice(-3).map((msg, idx) => (
                  <p key={idx} className="text-xs text-gray-300 mb-1">
                    <span className="font-semibold">{msg.role}:</span> {msg.content.substring(0, 50)}...
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Points - Center on desktop, middle on mobile */}
      <div className="w-full lg:w-1/5 flex-shrink-0">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-4 lg:p-6 border border-purple-500/30 h-full flex flex-col">
          <h3 className="text-base lg:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-400" />
            Key Points
          </h3>
          
          <ul className="space-y-2 lg:space-y-3 text-sm flex-1 overflow-y-auto">
            {keyPoints.length > 0 ? (
              keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 leading-relaxed flex-1">{point}</span>
                </li>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">No key points available</p>
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Learning Content - Right on desktop, bottom on mobile */}
      <div className="w-full lg:flex-1">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 lg:p-6 border border-blue-500/30 h-full flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'notes' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Structured Notes</span>
              <span className="sm:hidden">Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'guide' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Detailed Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto text-sm space-y-2 pr-2">
            {activeTab === 'notes' ? (
              formattedNotes && formattedNotes.length > 0 ? (
                formattedNotes
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notes available</p>
                  <p className="text-xs mt-2">Notes will appear here when generated</p>
                </div>
              )
            ) : (
              formattedExplanation && formattedExplanation.length > 0 ? (
                formattedExplanation
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No guide available</p>
                  <p className="text-xs mt-2">Guide will appear here when generated</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LearningAgentNew);

