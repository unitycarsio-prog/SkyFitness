import React from 'react';
import { StoredPlan, DailyPlan, Exercise, Meal } from '../types';
import { DumbbellIcon, NutritionIcon, RestIcon, TrophyIcon } from './Icons';

interface PlanDashboardProps {
  storedPlan: StoredPlan;
  currentDay: number;
  onReset: () => void;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
  <div className="bg-slate-800/80 p-4 rounded-lg shadow-md border border-slate-700">
    <h4 className="font-bold text-sky-400">{exercise.name}</h4>
    <p className="text-sm text-slate-300 font-semibold">{exercise.sets} sets of {exercise.reps} reps</p>
    <p className="text-sm text-slate-400 mt-2">{exercise.description}</p>
  </div>
);

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => (
  <div className="bg-slate-800/80 p-4 rounded-lg shadow-md border border-slate-700">
    <h4 className="font-bold text-amber-400">{meal.name}: <span className="font-normal text-white">{meal.food}</span></h4>
    <div className="mt-2">
      <p className="text-sm font-semibold text-slate-300">Ingredients:</p>
      <ul className="list-disc list-inside text-sm text-slate-400">
        {meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
    </div>
    <div className="mt-3 pt-3 border-t border-slate-700">
      <p className="text-sm font-semibold text-emerald-400">Budget Alternative:</p>
      <p className="text-sm text-slate-400">{meal.cheapAlternative}</p>
    </div>
  </div>
);


const PlanDashboard: React.FC<PlanDashboardProps> = ({ storedPlan, currentDay, onReset }) => {
  const { goal, duration, plan } = storedPlan.plan;
  const dayIndex = currentDay - 1;

  if (currentDay > duration) {
    return (
        <div className="text-center p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl">
            <TrophyIcon className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h2 className="text-4xl font-bold text-emerald-400 mb-4">Congratulations!</h2>
            <p className="text-xl text-slate-200 mb-2">You have completed your {duration}-day '{goal}' plan.</p>
            <p className="text-slate-400 mb-8">We hope you feel stronger and healthier. Ready for the next challenge?</p>
            <button onClick={onReset} className="px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all">
                Start a New Plan
            </button>
        </div>
    );
  }
  
  const progressPercentage = Math.min(((currentDay) / duration) * 100, 100);
  const todayPlan: DailyPlan | undefined = plan[dayIndex];

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Your Plan: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-400">{goal}</span></h1>
              <p className="text-slate-300 text-lg">Day {currentDay} of {duration}</p>
            </div>
            <button onClick={onReset} className="mt-4 md:mt-0 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors">
              Start New Plan
            </button>
        </div>
         <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {!todayPlan ? (
        <div className="text-center p-8 bg-slate-800 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-500">Plan data not available for today.</h2>
            <p className="text-slate-300 mt-2">There might be an issue with the generated plan. Please try starting a new plan.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exercises */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <DumbbellIcon className="h-6 w-6 mr-3 text-sky-400" />
            Today's Workout
          </h2>
          {todayPlan.restDay ? (
             <div className="text-center p-8 bg-slate-700/50 rounded-lg flex flex-col items-center">
                <RestIcon className="w-12 h-12 mb-3 text-blue-400"/>
                <h3 className="text-xl font-bold text-blue-400">Rest Day</h3>
                <p className="text-slate-300 mt-2">Focus on recovery. Gentle stretching or a short walk is recommended.</p>
            </div>
          ) : (
            <div className="space-y-4">
                {todayPlan.exercises.map((ex, i) => <ExerciseCard key={i} exercise={ex} />)}
            </div>
          )}
        </div>

        {/* Diet */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700">
           <h2 className="text-2xl font-bold mb-4 flex items-center">
            <NutritionIcon className="h-6 w-6 mr-3 text-amber-400"/>
            Today's Nutrition
          </h2>
          <div className="space-y-4">
             {todayPlan.meals.map((meal, i) => <MealCard key={i} meal={meal} />)}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PlanDashboard;