
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './icons';

interface PromptCardProps {
  prompt: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 relative h-full flex flex-col justify-between">
      <p className="text-gray-300 text-base mb-4 leading-relaxed">{prompt}</p>
      <button
        onClick={handleCopy}
        className="w-full sm:w-auto mt-4 sm:mt-0 sm:self-end flex items-center justify-center px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Copy prompt"
      >
        {copied ? (
          <>
            <CheckIcon className="w-5 h-5 mr-2 text-green-400" />
            <span>تم النسخ!</span>
          </>
        ) : (
          <>
            <ClipboardIcon className="w-5 h-5 mr-2" />
            <span>نسخ البرومبت</span>
          </>
        )}
      </button>
    </div>
  );
};
