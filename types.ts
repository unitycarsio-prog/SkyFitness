import React from 'react';

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  description: string;
}

export interface Meal {
  name: string;
  food: string;
  ingredients: string[];
  cheapAlternative: string;
}

export interface DailyPlan {
  day: number;
  exercises: Exercise[];
  meals: Meal[];
  restDay: boolean;
}

export interface FitnessPlan {
  goal: string;
  duration: number;
  plan: DailyPlan[];
}

export interface StoredPlan {
  plan: FitnessPlan;
  startDate: string; // ISO string
}

export interface GoalCategory {
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  goals: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
