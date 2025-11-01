import { GoalCategory } from './types';
import { MuscleIcon, WeightIcon, HeartIcon, PerformanceIcon } from './components/Icons';

export const GOAL_CATEGORIES: GoalCategory[] = [
  {
    name: 'Weight Management',
    description: 'Plans focused on changing your weight.',
    icon: WeightIcon,
    goals: [
      'Weight Loss',
      'Beginner Weight Gain',
      'Body Recomposition',
      'Cutting Phase',
      'General Health'
    ]
  },
  {
    name: 'Strength & Muscle',
    description: 'Build strength and increase muscle mass.',
    icon: MuscleIcon,
    goals: [
      'Muscle Gain',
      'Strength Training',
      'Toning & Sculpting',
      'Powerlifting Prep',
      'Advanced Bulking',
      'Lean Muscle Building',
      'Bodyweight Fitness',
      'Core Strength Focus',
    ]
  },
  {
    name: 'Performance & Endurance',
    description: 'Improve your cardiovascular health and athletic abilities.',
    icon: HeartIcon,
    goals: [
      'Endurance & Cardio',
      'HIIT Training',
      'Marathon Prep',
      'Athletic Performance',
      'Functional Fitness'
    ]
  },
  {
    name: 'Wellness & Lifestyle',
    description: 'Focused on overall well-being and specific life stages.',
    icon: PerformanceIcon,
    goals: [
      'Flexibility & Mobility',
      'Post-Pregnancy Fitness',
      'Active Aging Fitness',
      'Stress Reduction',
    ]
  }
];


export const DURATIONS: { label: string; days: number }[] = [
  { label: '3 Days', days: 3 },
  { label: '7 Days', days: 7 },
  { label: '15 Days', days: 15 },
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
];
