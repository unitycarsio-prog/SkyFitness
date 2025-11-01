import React from 'react';
import { DURATIONS } from '../constants';

interface DurationSelectorProps {
  goal: string;
  onSelectDuration: (days: number) => void;
  onBack: () => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ goal, onSelectDuration, onBack }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <button onClick={onBack} className="self-start mb-6 text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to Goals
      </button>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-400">Your Goal: {goal}</h1>
      <p className="text-lg text-slate-300 mb-10">How long is your commitment? Choose a plan duration.</p>
      <div className="flex flex-wrap justify-center gap-4">
        {DURATIONS.map(({ label, days }) => (
          <button
            key={days}
            onClick={() => onSelectDuration(days)}
            className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:from-sky-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DurationSelector;