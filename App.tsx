
import React, { useState, useCallback } from 'react';
import { useFitnessPlan } from './hooks/useFitnessPlan';
import { generateFitnessPlan } from './services/geminiService';
import GoalSelector from './components/GoalSelector';
import DurationSelector from './components/DurationSelector';
import PlanDashboard from './components/PlanDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';
import { FitnessPlan, DailyPlan } from './types';

const App: React.FC = () => {
  const { storedPlan, currentDay, savePlan, clearPlan } = useFitnessPlan();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async (duration: number) => {
    if (!selectedGoal) return;

    setIsLoading(true);
    setError(null);

    try {
      const plan: FitnessPlan = await generateFitnessPlan(selectedGoal, duration);
      savePlan(plan);
      setSelectedGoal(null);
    } catch (err) {
      setError('Failed to generate a fitness plan. The model may be unavailable. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGoal, savePlan]);
  
  const resetApp = () => {
    clearPlan();
    setSelectedGoal(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Generating your personalized plan... This may take a moment." />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center text-slate-100 p-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={resetApp}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (storedPlan) {
      return <PlanDashboard storedPlan={storedPlan} currentDay={currentDay} onReset={resetApp} />;
    }

    if (selectedGoal) {
      return <DurationSelector goal={selectedGoal} onSelectDuration={handleGeneratePlan} onBack={() => setSelectedGoal(null)} />;
    }

    return <GoalSelector onSelectGoal={setSelectedGoal} />;
  };

  const todayPlan: DailyPlan | undefined = storedPlan?.plan.plan[currentDay - 1];

  return (
    <div className="text-slate-100 min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Chatbot 
        plan={storedPlan?.plan} 
        currentDayPlan={todayPlan} 
      />
    </div>
  );
};

export default App;
