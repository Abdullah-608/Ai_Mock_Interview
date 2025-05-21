"use client";

import { useState } from "react";

interface ModelSelectorProps {
  userId: string;
  onModelSelected: (model: string) => void;
}

const ModelSelector = ({ userId, onModelSelected }: ModelSelectorProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4");

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleConfirm = () => {
    onModelSelected(selectedModel);
  };

  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg border border-gray-800 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center mb-2 text-white">Select Your AI Model</h2>
        <p className="text-center text-gray-400">
          Choose which AI model you'd like to use for your interviews
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* GPT-4 Option */}
        <div 
          className={`rounded-lg border p-4 cursor-pointer transition-all ${
            selectedModel === "gpt-4" 
              ? "border-blue-600 bg-gray-800" 
              : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
          onClick={() => handleModelChange("gpt-4")}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-medium text-white">OpenAI GPT-4</span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300">
              Recommended
            </span>
          </div>
          <span className="text-sm text-gray-400 block">
            High-accuracy, advanced reasoning, best for complex interviews
          </span>
        </div>

        {/* Gemini Pro Option */}
        <div 
          className={`rounded-lg border p-4 cursor-pointer transition-all ${
            selectedModel === "gemini-pro" 
              ? "border-blue-600 bg-gray-800" 
              : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
          onClick={() => handleModelChange("gemini-pro")}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-medium text-white">Google Gemini Pro</span>
          </div>
          <span className="text-sm text-gray-400 block">
            Balanced performance, efficient, good for technical interviews
          </span>
        </div>

        {/* Claude 3 Option */}
        <div 
          className={`rounded-lg border p-4 cursor-pointer transition-all ${
            selectedModel === "claude-3" 
              ? "border-blue-600 bg-gray-800" 
              : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
          }`}
          onClick={() => handleModelChange("claude-3")}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-medium text-white">Anthropic Claude 3</span>
          </div>
          <span className="text-sm text-gray-400 block">
            This is Not Working Yet as it is a Paid Model...
          </span>
        </div>
      </div>

      <button 
        onClick={handleConfirm}
        className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-md transition-colors"
      >
        Confirm Selection
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Selected by Abdullah-cr on 2025-05-20 17:58:48
        </p>
      </div>
    </div>
  );
};

export default ModelSelector;