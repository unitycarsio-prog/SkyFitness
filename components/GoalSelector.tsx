import React from 'react';
import { GOAL_CATEGORIES } from '../constants';

interface GoalSelectorProps {
  onSelectGoal: (goal: string) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ onSelectGoal }) => {
  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-400 tracking-tight">SkyFitness</h1>
      <p className="text-sm font-medium text-slate-400 mb-12">by Nexzi</p>
      <p className="text-lg text-slate-300 mb-16 max-w-xl mx-auto">Your AI-powered journey to peak fitness begins now. Choose your ambition.</p>
      
      <div className="space-y-12">
        {GOAL_CATEGORIES.map((category) => (
          <section key={category.name} aria-labelledby={`${category.name}-heading`}>
            <div className="flex flex-col items-center text-center mb-6">
              <category.icon className="w-10 h-10 mb-2 text-sky-400" />
              <h2 id={`${category.name}-heading`} className="text-2xl font-bold text-slate-100">{category.name}</h2>
              <p className="text-slate-400 max-w-md">{category.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => onSelectGoal(goal)}
                  className="flex items-center justify-center text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg hover:bg-slate-700/80 hover:border-sky-400 hover:shadow-sky-500/20 transform hover:-translate-y-1 transition-all duration-300 ease-in-out h-24"
                >
                  <span className="font-semibold text-slate-100">{goal}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default GoalSelector;