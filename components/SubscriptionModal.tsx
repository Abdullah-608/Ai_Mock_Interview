"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ModelSelector from "@/components/ModelSelector";
import { setUserSubscription, setUserModel } from "@/lib/actions/user.action";

type SubscriptionTier = "free" | "corporate";

interface SubscriptionModalProps {
  userId: string;
}

const SubscriptionModal = ({ userId }: SubscriptionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTierSelection = async (selectedTier: SubscriptionTier) => {
    setTier(selectedTier);
    
    // Mock authorization logic to simulate tier update
    await setUserSubscription(userId, selectedTier);
    
    if (selectedTier === "corporate") {
      setShowModelSelector(true);
    } else {
      // For free tier, automatically set to the default model (Gemini VAPI)
      await setUserModel(userId, "gemini-vapi");
      setIsOpen(false);
    }
  };

  const handleModelSelected = async (model: string) => {
    await setUserModel(userId, model);
    setShowModelSelector(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className=" block bg-gradient-to-r from-indigo-900 to-purple-800 text-white border border-indigo-700 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-purple-700  transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 animation-delay-400 shadow-md shadow-indigo-900/20"
      >
        Upgrade Models
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-gray-900 rounded-xl shadow-2xl w-full sm:w-[480px] p-6 border border-gray-800 flex flex-col"
            style={{ boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)" }}
          >
            {!showModelSelector ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-center mb-3 text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Choose Your Interview Experience</h2>
                  <p className="text-center text-gray-400">
                    Select a subscription tier that fits your interview preparation needs
                  </p>
                </div>

                <div className="py-4 space-y-5 flex-grow">
                  {/* Free Tier Option */}
                  <div 
                    className={`rounded-xl transition-all ${
                      tier === "free" 
                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20" 
                        : "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10"
                    }`}
                    onClick={() => handleTierSelection("free")}
                  >
                    <div className="p-5 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Free Tier</span>
                        <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm">$0</span>
                      </div>
                      <span className="text-sm text-gray-400 block mt-1">
                        Basic interview practice with Gemini VAPI
                      </span>
                      <ul className="text-sm text-gray-300 mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Basic feedback
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Limited interviews
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Corporate Tier Option */}
                  <div 
                    className={`rounded-xl transition-all ${
                      tier === "corporate" 
                        ? "bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-indigo-400 shadow-lg shadow-indigo-500/30" 
                        : "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10"
                    }`}
                    onClick={() => handleTierSelection("corporate")}
                  >
                    <div className="p-5 cursor-pointer relative overflow-hidden">
                      {tier !== "corporate" && (
                        <div className="absolute -right-12 -top-3 bg-indigo-600 text-white text-xs px-10 py-1 rotate-45">
                          Recommended
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Corporate Tier</span>
                        <span className="bg-indigo-800 text-indigo-100 px-3 py-1 rounded-full text-sm font-medium">$19.99/mo</span>
                      </div>
                      <span className="text-sm text-gray-300 block mt-1">
                        Advanced interview preparation with premium AI models
                      </span>
                      <ul className="text-sm text-gray-300 mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Choose from premium AI models
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Detailed performance analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Unlimited interviews
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Priority support
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                  All plans include secure payment and 7-day money back guarantee
                </div>
              </>
            ) : (
              <ModelSelector userId={userId} onModelSelected={handleModelSelected} />
            )}

            {!showModelSelector && (
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-4 text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionModal;