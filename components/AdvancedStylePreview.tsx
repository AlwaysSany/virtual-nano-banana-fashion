
import React from 'react';

interface AdvancedStylePreviewProps {
  stagedImage: string;
  onClear: () => void;
}

export const AdvancedStylePreview: React.FC<AdvancedStylePreviewProps> = ({ stagedImage, onClear }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-8 shadow-xl relative animate-fade-in text-[#eee8d5]">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <img src={stagedImage} alt="Styled preview" className="w-24 h-24 rounded-lg object-cover border-2 border-white/30" />
            <div className="text-center sm:text-left">
                <h3 className="font-bold text-lg text-[#eee8d5]">Advanced Styling Mode</h3>
                <p className="text-[#93a1a1]">Select another item to add to this look.</p>
            </div>
            <button 
                onClick={onClear} 
                className="ml-auto mt-2 sm:mt-0 bg-[#2aa198] hover:bg-[#1f7f7a] text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
                title="Clear styled image and start over"
            >
                Start Over
            </button>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};
