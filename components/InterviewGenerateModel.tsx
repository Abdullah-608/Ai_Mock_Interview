"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateInterview } from "@/lib/actions/general.action";

interface FormData {
  role: string;
  type: string;
  level: string;
  amount: string;
  techstack: string;
}

interface InterviewGenerateModalProps {
  userId: string;
  username?: string; // Optional username prop
}

export default function InterviewGenerateModal({ userId, username = "Abdullah-cr" }: InterviewGenerateModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    role: "",
    type: "mix",
    level: "entry",
    amount: "3",
    techstack: "",
  });

  // Set current date and time on component mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      updateDateTime();
    }
  }, [isOpen]);

  const updateDateTime = () => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    setCurrentDateTime(formattedDate);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const techArray = formData.techstack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    startTransition(() => {
      setLoading(true);
      generateInterview({
        userId,
        role: formData.role,
        level: formData.level,
        type: formData.type,
        amount: Number(formData.amount) || 3,
        techstack: techArray,
      })
        .then((result) => {
          if (!result?.success) {
            setError(result?.error || "Unable to generate interview. Please try again.");
            return;
          }

          setIsOpen(false);
          router.refresh();
        })
        .catch((error) => {
          console.error("Error generating interview:", error);
          setError("Unexpected error generating interview. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-700 border border-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 animate-slideUp animation-delay-400"
      >
        Generate Interview
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Generate Custom Interview</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            
            
            <p className="text-gray-400 mb-4">
              Create a personalized interview practice session tailored to your needs.
            </p>
            
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-4">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="role" className="block font-medium text-gray-300">Job Role</label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="e.g. Data Scientist, Frontend Developer"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="block font-medium text-gray-300">Interview Type</label>
                  <select 
                    id="type"
                    name="type"
                    value={formData.type} 
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="mix">Mixed</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="level" className="block font-medium text-gray-300">Experience Level</label>
                  <select 
                    id="level"
                    name="level" 
                    value={formData.level} 
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="techstack" className="block font-medium text-gray-300">Technologies/Skills</label>
                <input
                  id="techstack"
                  name="techstack"
                  type="text"
                  placeholder="e.g. Python, SQL, React, AWS"
                  value={formData.techstack}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="block font-medium text-gray-300">Number of Questions</label>
                <select 
                  id="amount"
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2, 3, 5, 7, 10].map(num => (
                    <option key={num} value={num.toString()}>{num} Questions</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : "Generate Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}