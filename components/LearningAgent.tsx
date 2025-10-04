"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";

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

const LearningAgent = ({
  userName,
  userId,
  learningCardId,
  learningCard,
}: LearningAgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'notes' | 'guide'>('notes');

  // Suppress daily-js version warnings and VAPI transport messages
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('daily-js version') && message.includes('no longer supported')) {
        return; // Suppress this specific warning
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('send transport changed to disconnected') ||
          message.includes('transport changed to disconnected') ||
          message.includes('Connection closed') ||
          message.includes('WebSocket connection') ||
          message.includes('Meeting has ended') ||
          message.includes('Call has ended')) {
        return; // Suppress VAPI transport errors
      }
      originalError.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
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
          // Silently handle call end errors and transport issues
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = String(error.message);
            if (errorMessage.includes('Meeting has ended') ||
                errorMessage.includes('Call has ended') ||
                errorMessage.includes('transport changed to disconnected') ||
                errorMessage.includes('WebSocket connection') ||
                errorMessage.includes('send transport changed to disconnected') ||
                errorMessage.includes('Connection closed') ||
                errorMessage.includes('Connection terminated')) {
              // These are expected errors, don't log as errors
              return;
            }
          }
          console.error("VAPI Error:", error);
        };

        // Add transport state handler
        const onTransportChange = (transport: any) => {
          // Suppress transport change messages to reduce console noise
          if (transport && typeof transport === 'string') {
            if (transport.includes('disconnected') || 
                transport.includes('closed') || 
                transport.includes('terminated')) {
              // These are expected transport changes, don't log
              return;
            }
          }
          console.log("Transport changed:", transport);
        };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);
    vapi.on("transport-change", onTransportChange);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      vapi.off("transport-change", onTransportChange);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === CallStatus.FINISHED) {
      // Redirect back to learning cards list
      router.push("/learning-cards");
    }
  }, [messages, callStatus, router]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      // Create learning assistant configuration
      const learningAssistant = {
        name: "Learning Assistant",
        firstMessage: `Hello ${userName}! I'm your AI learning assistant. I'm here to help you understand ${learningCard.title}. Let me explain the key concepts and answer any questions you might have.`,
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
              content: `You are an expert learning assistant and tutor specializing in explaining complex topics in simple, engaging ways. Your goal is to help the student understand the learning material through conversation.

LEARNING TOPIC: ${learningCard.title}
CONTENT TO LEARN: ${learningCard.content}
AI-GENERATED NOTES: ${learningCard.notes}
AI-GENERATED EXPLANATION: ${learningCard.explanation}

YOUR ROLE:
- Explain concepts clearly and conversationally
- Use analogies and real-world examples
- Ask questions to check understanding
- Provide encouragement and positive reinforcement
- Break down complex topics into digestible parts
- Adapt your explanation based on student responses

CONVERSATION STYLE:
- Be warm, patient, and encouraging
- Use a conversational tone, not formal lectures
- Ask follow-up questions to gauge understanding
- Provide examples and analogies when helpful
- Acknowledge good questions and insights
- If they seem confused, try a different approach

TEACHING APPROACH:
1. Start with an overview of the topic
2. Explain key concepts one by one
3. Use examples and analogies
4. Check for understanding with questions
5. Address any confusion or questions
6. Summarize the main points

Remember: You're having a voice conversation, so keep responses natural and conversational. Don't overwhelm with too much information at once.`,
            },
          ],
        },
      };

      await vapi.start(learningAssistant);
    } catch (error) {
      console.error("Failed to start learning session:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      console.log("Learning session disconnected");
    }
  };

  // Helper function to format notes with proper markdown-like rendering
  const formatNotes = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return null;
      
      const trimmedLine = line.trim();
      
      // Check if line is a heading (starts and ends with **)
      if (trimmedLine.match(/^\*\*.*\*\*:?$/)) {
        const heading = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '');
        return (
          <h4 key={index} className="text-purple-400 font-bold text-lg mt-4 mb-2">
            {heading}
          </h4>
        );
      }
      // Check if line starts with bullet point
      else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        const content = trimmedLine.replace(/^[•\-]\s*/, '');
        const formatted = formatInlineContent(content, `notes-bullet-${index}`);
        return (
          <li key={index} className="ml-4 mb-2">
            {formatted}
          </li>
        );
      }
      // Regular text
      else {
        const formatted = formatInlineContent(trimmedLine, `notes-text-${index}`);
        return (
          <p key={index} className="mb-2">
            {formatted}
          </p>
        );
      }
    });
  };

  // Helper function to format explanation with proper sections
  const formatExplanation = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const formattedElements: JSX.Element[] = [];
    let currentCodeBlock = '';
    let inCodeBlock = false;
    let codeBlockIndex = 0;
    let elementIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Handle code blocks with ```
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          if (currentCodeBlock.trim()) {
            formattedElements.push(
              <div key={`code-block-${codeBlockIndex}`} className="my-4">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 rounded-t-lg px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-xs font-mono">Code</span>
                </div>
                <pre className="bg-slate-900 border border-slate-600 border-t-0 rounded-b-lg p-4 overflow-x-auto">
                  <code className="text-green-400 text-sm font-mono leading-relaxed whitespace-pre">
                    {currentCodeBlock.trim()}
                  </code>
                </pre>
              </div>
            );
          }
          currentCodeBlock = '';
          inCodeBlock = false;
          codeBlockIndex++;
        } else {
          // Start of code block
          inCodeBlock = true;
        }
        continue;
      }

      // If we're inside a code block, add to current code
      if (inCodeBlock) {
        currentCodeBlock += line + '\n';
        continue;
      }

      // Skip empty lines
      if (!trimmedLine) {
        continue;
      }

      // Handle headings (lines that start and end with **)
      if (trimmedLine.match(/^\*\*.*\*\*$/)) {
        const heading = trimmedLine.replace(/\*\*/g, '').trim();
        const headingClass = "text-xl font-bold text-blue-400 mb-4 mt-6 border-b border-blue-400/30 pb-2";
        
        formattedElements.push(
          <h4 key={`heading-${elementIndex++}`} className={headingClass}>
            {heading}
          </h4>
        );
        continue;
      }

      // Handle numbered lists
      if (trimmedLine.match(/^\d+\.\s/)) {
        const listItems = [];
        let j = i;
        
        // Collect consecutive numbered list items
        while (j < lines.length && (lines[j].trim().match(/^\d+\.\s/) || lines[j].trim() === '')) {
          if (lines[j].trim()) {
            listItems.push(lines[j].trim());
          }
          j++;
        }
        
        formattedElements.push(
          <ol key={`numbered-list-${elementIndex++}`} className="mb-4 space-y-2 ml-4">
            {listItems.map((item, itemIndex) => {
              const cleanItem = item.replace(/^\d+\.\s*/, '');
              const formatted = formatInlineContent(cleanItem, `numbered-list-${elementIndex}-item-${itemIndex}`);
              return (
                <li key={itemIndex} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1 text-sm font-medium min-w-[20px]">
                    {itemIndex + 1}.
                  </span>
                  <div className="leading-relaxed flex-1">{formatted}</div>
                </li>
              );
            })}
          </ol>
        );
        i = j - 1; // Skip processed lines
        continue;
      }

      // Handle bullet lists
      if (trimmedLine.match(/^[\s]*[•\-]\s/)) {
        const listItems = [];
        let j = i;
        
        // Collect consecutive bullet list items
        while (j < lines.length && (lines[j].trim().match(/^[\s]*[•\-]\s/) || lines[j].trim() === '')) {
          if (lines[j].trim()) {
            listItems.push(lines[j].trim());
          }
          j++;
        }
        
        formattedElements.push(
          <ul key={`bullet-list-${elementIndex++}`} className="mb-4 space-y-2 ml-4">
            {listItems.map((item, itemIndex) => {
              const cleanItem = item.replace(/^[\s]*[•\-]\s*/, '');
              const formatted = formatInlineContent(cleanItem, `bullet-list-${elementIndex}-item-${itemIndex}`);
              return (
                <li key={itemIndex} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-2 text-xs">●</span>
                  <div className="leading-relaxed flex-1">{formatted}</div>
                </li>
              );
            })}
          </ul>
        );
        i = j - 1; // Skip processed lines
        continue;
      }

      // Handle regular paragraphs
      const formatted = formatInlineContent(trimmedLine, `paragraph-${elementIndex}`);
      formattedElements.push(
        <p key={`paragraph-${elementIndex++}`} className="mb-4 leading-relaxed text-gray-300">
          {formatted}
        </p>
      );
    }

    return formattedElements;
  };

  // Helper function to format inline content (bold, italic, inline code)
  const formatInlineContent = (text: string, baseKey: string = 'content') => {
    if (!text) return null;

    // Split by backticks to handle inline code
    const parts = text.split('`');
    const elements: JSX.Element[] = [];

    parts.forEach((part, index) => {
      if (index % 2 === 1) {
        // Odd indices are inline code
        elements.push(
          <code key={`${baseKey}-inline-code-${index}`} className="bg-slate-800 text-green-400 px-2 py-1 rounded text-sm font-mono border border-slate-700">
            {part}
          </code>
        );
      } else {
        // Even indices are regular text - handle bold formatting
        const boldParts = part.split(/(\*\*[^*]+\*\*)/);
        const boldElements = boldParts.map((boldPart, boldIndex) => {
          if (boldPart.match(/^\*\*[^*]+\*\*$/)) {
            // Bold text - remove asterisks and trim
            const boldText = boldPart.replace(/\*\*/g, '').trim();
            return (
              <strong key={`${baseKey}-bold-${index}-${boldIndex}`} className="text-white font-semibold">
                {boldText}
              </strong>
            );
          } else if (boldPart.trim()) {
            // Regular text
            return <span key={`${baseKey}-text-${index}-${boldIndex}`}>{boldPart}</span>;
          }
          return null;
        }).filter(Boolean);
        
        if (boldElements.length > 0) {
          elements.push(...boldElements);
        }
      }
    });

    return elements.length > 0 ? <>{elements}</> : <span>{text.replace(/\*\*/g, '')}</span>;
  };

  // Extract key points (first few bullet points from notes and explanation)
  const extractKeyPoints = (notes: string, explanation: string) => {
    // Get bullet points from notes
    const notesLines = notes.split('\n').filter(line => 
      line.trim().startsWith('•') || line.trim().startsWith('-')
    );
    
    // Get bullet points from explanation
    const explanationLines = explanation.split('\n').filter(line => 
      line.trim().startsWith('•') || line.trim().startsWith('-')
    );
    
    // Combine and deduplicate
    const allPoints = [...notesLines, ...explanationLines];
    const uniquePoints = allPoints.filter((point, index, array) => 
      array.findIndex(p => p.trim() === point.trim()) === index
    );
    
    return uniquePoints.slice(0, 8); // Get first 8 key points
  };

  const keyPoints = extractKeyPoints(learningCard.notes, learningCard.explanation);

  return (
    <>
      {/* 3-Column Layout: AI Learning Session | Key Points | Detailed Notes */}
      <div className="grid lg:grid-cols-12 gap-6 h-full min-h-0">
        {/* Left Column - AI Learning Session (20%) */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 h-full flex flex-col min-h-0">
            <h3 className="text-lg font-bold text-white mb-4 text-center">AI Session</h3>
            
            {/* AI and User Avatars - Compact */}
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* AI Learning Assistant Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-md border border-blue-100 transition-all duration-300 hover:shadow-lg flex flex-col items-center">
                <div className="avatar relative">
                  <div className="absolute -inset-1 bg-blue-100 rounded-full blur-md animate-pulse"></div>
                  <div className="relative">
                    <Image
                      src="/ai-avatar.png"
                      alt="learning-assistant"
                      width={45}
                      height={45}
                      className="object-cover rounded-full border-2 border-white shadow-sm transition-transform duration-500 hover:rotate-3"
                    />
                    {isSpeaking && (
                      <span className="animate-speak absolute -bottom-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="mt-2 font-semibold text-blue-800 text-xs">AI</h4>
              </div>

              {/* User Profile Card */}
              <div className="bg-white p-1 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-80 animate-pulse"></div>
                    <Image
                      src="/user-avatar.png"
                      alt="profile-image"
                      width={45}
                      height={45}
                      className="rounded-full object-cover size-[45px] border-2 border-white shadow-sm relative transition-all duration-300 hover:shadow-md"
                    />
                  </div>
                  <h4 className="mt-2 font-semibold text-gray-800 text-xs">{userName}</h4>
                </div>
              </div>
            </div>

            {/* Transcript Display - Compact */}
            {messages.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-1 mb-4">
                <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg">
                  <p
                    key={lastMessage}
                    className={cn(
                      "transition-all duration-700 text-gray-700 leading-relaxed text-xs",
                      "animate-fadeIn opacity-100"
                    )}              
                  >
                    {lastMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Call Controls - Compact */}
            <div className="flex justify-center mt-auto">
              {callStatus !== "ACTIVE" ? (
                <button 
                  className={cn(
                    "relative px-4 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 text-sm",
                    callStatus === "CONNECTING" 
                      ? "bg-yellow-500 hover:bg-yellow-600" 
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:-translate-y-1"
                  )} 
                  onClick={() => handleCall()}
                  disabled={callStatus === "CONNECTING"}
                >
                  {callStatus === "CONNECTING" && (
                    <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-75 animate-ping"></span>
                  )}

                  <span className="relative flex items-center justify-center gap-1">
                    {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Start
                      </>
                    ) : (
                      <>
                        <span className="h-1 w-1 bg-white rounded-full animate-bounce"></span>
                        <span className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </>
                    )}
                  </span>
                </button>
              ) : (
                <button 
                  className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center gap-1 text-sm" 
                  onClick={() => handleDisconnect()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  End
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center Column - Key Points (20%) */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/30 h-full flex flex-col min-h-0">
            <h3 className="text-lg font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Key Points
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm flex-1 overflow-y-auto">
              {keyPoints.length > 0 ? (
                keyPoints.map((point, index) => {
                  const cleanPoint = point.replace(/^[•\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1');
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 text-xs">•</span>
                      <span className="flex-1 text-xs leading-relaxed">{cleanPoint}</span>
                    </li>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 text-xs py-8">
                  <p>Key points will appear here</p>
                  <p className="mt-2 text-xs">Start the AI session to see key points</p>
                </div>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column - Learning Content (60%) */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border border-blue-500/30 h-full flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'notes' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Structured Notes
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'guide' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Detailed Guide
              </button>
            </div>

            {/* Content Area */}
            <div className="text-gray-300 text-sm space-y-2 flex-1 overflow-y-auto">
              {activeTab === 'notes' ? (
                learningCard.notes && learningCard.notes.trim() ? (
                  formatNotes(learningCard.notes)
                ) : (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <p>No structured notes available</p>
                    <p className="mt-2 text-xs">Notes will appear here when generated</p>
                  </div>
                )
              ) : (
                learningCard.explanation && learningCard.explanation.trim() ? (
                  formatExplanation(learningCard.explanation)
                ) : (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <p>No detailed guide available</p>
                    <p className="mt-2 text-xs">Guide will appear here when generated</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningAgent;
