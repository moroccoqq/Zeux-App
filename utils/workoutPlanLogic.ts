/**
 * Workout Plan Logic
 *
 * This file contains all the core logic for creating, managing, and generating
 * workout plans in the Zeux-App fitness application based on user's food intake,
 * training history, and fitness goals.
 */

import { FoodEntry, TrainingEntry } from '../contexts/DataContext';

// ========================================
// Type Definitions
// ========================================

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  restTime?: string; // Optional rest time between sets (e.g., "60 sec")
  notes?: string; // Optional notes for the exercise
}

export interface WorkoutDay {
  day: string; // Day of the week (e.g., "Monday")
  focus: string; // Focus area (e.g., "Upper Body", "Lower Body", "Cardio")
  duration: string; // Expected duration (e.g., "45 min")
  exercises: Exercise[];
  icon: string; // Icon name from Ionicons
  caloriesBurned?: number; // Estimated calories burned
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  weeklySchedule: WorkoutDay[];
  createdAt: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness';
}

export interface WorkoutPreferences {
  daysPerWeek: number; // 1-7
  sessionDuration: number; // Minutes per session
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness';
  equipment: 'none' | 'basic' | 'full_gym';
  targetMuscleGroups?: string[]; // Optional specific muscle groups to focus on
}

export interface UserMetrics {
  calorieGoal: number;
  averageCaloriesEaten: number;
  averageCaloriesBurned: number;
  averageProtein: number;
  averageCarbs: number;
  averageFats: number;
  trainingFrequency: number; // Days per week currently training
  mostCommonTrainingType: string;
  weight?: number; // User's weight in kg (optional)
}

// ========================================
// Exercise Database
// ========================================

export const EXERCISE_DATABASE = {
  // Upper Body Exercises
  upperBody: {
    push: [
      { name: 'Bench Press', sets: '3-4', reps: '8-12', equipment: 'full_gym' },
      { name: 'Incline Press', sets: '3', reps: '10-12', equipment: 'full_gym' },
      { name: 'Dumbbell Press', sets: '3', reps: '10-12', equipment: 'basic' },
      { name: 'Push-ups', sets: '3-4', reps: '12-20', equipment: 'none' },
      { name: 'Shoulder Press', sets: '3', reps: '10-12', equipment: 'basic' },
      { name: 'Lateral Raises', sets: '3', reps: '12-15', equipment: 'basic' },
      { name: 'Tricep Dips', sets: '3', reps: '10-15', equipment: 'basic' },
      { name: 'Chest Fly', sets: '3', reps: '12-15', equipment: 'basic' },
    ],
    pull: [
      { name: 'Pull-ups', sets: '3-4', reps: '6-12', equipment: 'basic' },
      { name: 'Lat Pulldown', sets: '3', reps: '10-12', equipment: 'full_gym' },
      { name: 'Dumbbell Row', sets: '3', reps: '10-12', equipment: 'basic' },
      { name: 'Face Pulls', sets: '3', reps: '15', equipment: 'full_gym' },
      { name: 'Bicep Curls', sets: '3', reps: '12-15', equipment: 'basic' },
      { name: 'Hammer Curls', sets: '3', reps: '12-15', equipment: 'basic' },
      { name: 'Bent Over Row', sets: '3', reps: '10-12', equipment: 'basic' },
    ],
  },

  // Lower Body Exercises
  lowerBody: {
    quad_focused: [
      { name: 'Squats', sets: '4', reps: '8-12', equipment: 'basic' },
      { name: 'Leg Press', sets: '3', reps: '12-15', equipment: 'full_gym' },
      { name: 'Lunges', sets: '3', reps: '12/leg', equipment: 'basic' },
      { name: 'Bulgarian Split Squats', sets: '3', reps: '10/leg', equipment: 'basic' },
      { name: 'Leg Extension', sets: '3', reps: '12-15', equipment: 'full_gym' },
    ],
    hamstring_focused: [
      { name: 'Romanian Deadlifts', sets: '3-4', reps: '10-12', equipment: 'basic' },
      { name: 'Leg Curls', sets: '3', reps: '12-15', equipment: 'full_gym' },
      { name: 'Good Mornings', sets: '3', reps: '10-12', equipment: 'basic' },
      { name: 'Glute Bridges', sets: '3', reps: '15-20', equipment: 'none' },
    ],
    calves: [
      { name: 'Calf Raises', sets: '3-4', reps: '15-20', equipment: 'basic' },
      { name: 'Seated Calf Raises', sets: '3', reps: '15-20', equipment: 'full_gym' },
    ],
  },

  // Core Exercises
  core: [
    { name: 'Planks', sets: '3', reps: '60 sec', equipment: 'none' },
    { name: 'Russian Twists', sets: '3', reps: '20', equipment: 'basic' },
    { name: 'Mountain Climbers', sets: '3', reps: '15', equipment: 'none' },
    { name: 'Bicycle Crunches', sets: '3', reps: '20', equipment: 'none' },
    { name: 'Dead Bug', sets: '3', reps: '12', equipment: 'none' },
    { name: 'Leg Raises', sets: '3', reps: '12-15', equipment: 'basic' },
    { name: 'Ab Wheel Rollouts', sets: '3', reps: '10-12', equipment: 'basic' },
  ],

  // Cardio Exercises
  cardio: [
    { name: 'Running', sets: '1', reps: '20-30 min', equipment: 'none' },
    { name: 'Cycling', sets: '1', reps: '20-30 min', equipment: 'basic' },
    { name: 'Jump Rope', sets: '5', reps: '2 min', equipment: 'basic' },
    { name: 'Burpees', sets: '4', reps: '10-15', equipment: 'none' },
    { name: 'High Knees', sets: '4', reps: '30 sec', equipment: 'none' },
    { name: 'Rowing Machine', sets: '1', reps: '15-20 min', equipment: 'full_gym' },
  ],

  // Full Body Exercises
  fullBody: [
    { name: 'Deadlifts', sets: '3-4', reps: '6-10', equipment: 'basic' },
    { name: 'Clean and Press', sets: '3', reps: '8-10', equipment: 'basic' },
    { name: 'Thrusters', sets: '3', reps: '10-12', equipment: 'basic' },
    { name: 'Kettlebell Swings', sets: '4', reps: '15-20', equipment: 'basic' },
    { name: 'Turkish Get-ups', sets: '3', reps: '5/side', equipment: 'basic' },
  ],

  // Recovery/Flexibility
  recovery: [
    { name: 'Stretching', sets: '1', reps: '15-20 min', equipment: 'none' },
    { name: 'Light Walking', sets: '1', reps: '15-30 min', equipment: 'none' },
    { name: 'Foam Rolling', sets: '1', reps: '10-15 min', equipment: 'basic' },
    { name: 'Yoga Flow', sets: '1', reps: '20-30 min', equipment: 'none' },
  ],
};

// ========================================
// Preset Workout Plans
// ========================================

export const PRESET_PLANS: { [key: string]: WorkoutPlan } = {
  beginner_3day: {
    id: 'preset_beginner_3day',
    name: 'Beginner Full Body (3 Days)',
    difficulty: 'beginner' as const,
    goal: 'general_fitness' as const,
    createdAt: new Date('2025-01-01'),
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Full Body',
        duration: '40 min',
        icon: 'fitness-outline',
        exercises: [
          { name: 'Squats', sets: '3', reps: '10-12' },
          { name: 'Push-ups', sets: '3', reps: '10-15' },
          { name: 'Dumbbell Row', sets: '3', reps: '10-12' },
          { name: 'Planks', sets: '3', reps: '30-45 sec' },
        ],
      },
      {
        day: 'Wednesday',
        focus: 'Full Body',
        duration: '40 min',
        icon: 'fitness-outline',
        exercises: [
          { name: 'Lunges', sets: '3', reps: '10/leg' },
          { name: 'Shoulder Press', sets: '3', reps: '10-12' },
          { name: 'Glute Bridges', sets: '3', reps: '15' },
          { name: 'Bicycle Crunches', sets: '3', reps: '15' },
        ],
      },
      {
        day: 'Friday',
        focus: 'Full Body',
        duration: '40 min',
        icon: 'fitness-outline',
        exercises: [
          { name: 'Romanian Deadlifts', sets: '3', reps: '10-12' },
          { name: 'Dumbbell Press', sets: '3', reps: '10-12' },
          { name: 'Bicep Curls', sets: '3', reps: '12-15' },
          { name: 'Mountain Climbers', sets: '3', reps: '12' },
        ],
      },
    ],
  },

  intermediate_5day_ppl: {
    id: 'preset_intermediate_5day_ppl',
    name: 'Push/Pull/Legs (5 Days)',
    difficulty: 'intermediate' as const,
    goal: 'hypertrophy' as const,
    createdAt: new Date('2025-01-01'),
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Push Day',
        duration: '50 min',
        icon: 'arrow-up-outline',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '8-10' },
          { name: 'Incline Press', sets: '3', reps: '10-12' },
          { name: 'Shoulder Press', sets: '3', reps: '10-12' },
          { name: 'Lateral Raises', sets: '3', reps: '12-15' },
          { name: 'Tricep Dips', sets: '3', reps: '10-12' },
        ],
      },
      {
        day: 'Tuesday',
        focus: 'Pull Day',
        duration: '50 min',
        icon: 'arrow-down-outline',
        exercises: [
          { name: 'Pull-ups', sets: '4', reps: '8-10' },
          { name: 'Bent Over Row', sets: '3', reps: '10-12' },
          { name: 'Face Pulls', sets: '3', reps: '15' },
          { name: 'Bicep Curls', sets: '3', reps: '12-15' },
          { name: 'Hammer Curls', sets: '3', reps: '12-15' },
        ],
      },
      {
        day: 'Thursday',
        focus: 'Leg Day',
        duration: '55 min',
        icon: 'body-outline',
        exercises: [
          { name: 'Squats', sets: '4', reps: '8-10' },
          { name: 'Romanian Deadlifts', sets: '3', reps: '10-12' },
          { name: 'Lunges', sets: '3', reps: '12/leg' },
          { name: 'Leg Curls', sets: '3', reps: '12-15' },
          { name: 'Calf Raises', sets: '4', reps: '15-20' },
        ],
      },
      {
        day: 'Friday',
        focus: 'Push Day',
        duration: '50 min',
        icon: 'arrow-up-outline',
        exercises: [
          { name: 'Dumbbell Press', sets: '4', reps: '8-10' },
          { name: 'Chest Fly', sets: '3', reps: '12-15' },
          { name: 'Lateral Raises', sets: '4', reps: '12-15' },
          { name: 'Tricep Dips', sets: '3', reps: '10-12' },
        ],
      },
      {
        day: 'Saturday',
        focus: 'Pull Day',
        duration: '50 min',
        icon: 'arrow-down-outline',
        exercises: [
          { name: 'Lat Pulldown', sets: '4', reps: '10-12' },
          { name: 'Dumbbell Row', sets: '3', reps: '10-12' },
          { name: 'Face Pulls', sets: '3', reps: '15' },
          { name: 'Hammer Curls', sets: '3', reps: '12-15' },
        ],
      },
    ],
  },

  cardio_weight_loss: {
    id: 'preset_cardio_weight_loss',
    name: 'Cardio + Strength (Weight Loss)',
    difficulty: 'intermediate' as const,
    goal: 'weight_loss' as const,
    createdAt: new Date('2025-01-01'),
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Cardio & Core',
        duration: '35 min',
        icon: 'flash-outline',
        exercises: [
          { name: 'Running', sets: '1', reps: '20 min' },
          { name: 'Planks', sets: '3', reps: '60 sec' },
          { name: 'Mountain Climbers', sets: '3', reps: '15' },
          { name: 'Burpees', sets: '3', reps: '10' },
        ],
      },
      {
        day: 'Tuesday',
        focus: 'Upper Body',
        duration: '40 min',
        icon: 'barbell-outline',
        exercises: [
          { name: 'Push-ups', sets: '3', reps: '15-20' },
          { name: 'Dumbbell Row', sets: '3', reps: '12-15' },
          { name: 'Shoulder Press', sets: '3', reps: '12-15' },
          { name: 'Bicep Curls', sets: '3', reps: '15' },
        ],
      },
      {
        day: 'Thursday',
        focus: 'Cardio & Core',
        duration: '35 min',
        icon: 'flash-outline',
        exercises: [
          { name: 'Cycling', sets: '1', reps: '20 min' },
          { name: 'Russian Twists', sets: '3', reps: '20' },
          { name: 'High Knees', sets: '4', reps: '30 sec' },
          { name: 'Jump Rope', sets: '4', reps: '1 min' },
        ],
      },
      {
        day: 'Friday',
        focus: 'Lower Body',
        duration: '40 min',
        icon: 'body-outline',
        exercises: [
          { name: 'Squats', sets: '3', reps: '15-20' },
          { name: 'Lunges', sets: '3', reps: '15/leg' },
          { name: 'Glute Bridges', sets: '3', reps: '20' },
          { name: 'Calf Raises', sets: '3', reps: '20' },
        ],
      },
      {
        day: 'Saturday',
        focus: 'Full Body HIIT',
        duration: '30 min',
        icon: 'fitness-outline',
        exercises: [
          { name: 'Burpees', sets: '4', reps: '12' },
          { name: 'Mountain Climbers', sets: '4', reps: '20' },
          { name: 'Jump Rope', sets: '4', reps: '2 min' },
          { name: 'High Knees', sets: '4', reps: '45 sec' },
        ],
      },
    ],
  },
};

// ========================================
// User Data Analysis
// ========================================

/**
 * Analyzes user's food and training history to extract key metrics
 */
export function analyzeUserData(
  foods: FoodEntry[],
  trainings: TrainingEntry[],
  calorieGoal: number,
  daysToAnalyze: number = 7
): UserMetrics {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToAnalyze);

  // Filter data for the analysis period
  const recentFoods = foods.filter(food => new Date(food.date) >= cutoffDate);
  const recentTrainings = trainings.filter(training => new Date(training.date) >= cutoffDate);

  // Calculate average calories eaten
  const totalCaloriesEaten = recentFoods.reduce((sum, food) => sum + food.calories, 0);
  const averageCaloriesEaten = recentFoods.length > 0 ? totalCaloriesEaten / daysToAnalyze : 0;

  // Calculate average calories burned
  const totalCaloriesBurned = recentTrainings.reduce((sum, training) => sum + training.calories, 0);
  const averageCaloriesBurned = recentTrainings.length > 0 ? totalCaloriesBurned / daysToAnalyze : 0;

  // Calculate average macros
  const totalProtein = recentFoods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = recentFoods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFats = recentFoods.reduce((sum, food) => sum + food.fats, 0);

  const averageProtein = recentFoods.length > 0 ? totalProtein / daysToAnalyze : 0;
  const averageCarbs = recentFoods.length > 0 ? totalCarbs / daysToAnalyze : 0;
  const averageFats = recentFoods.length > 0 ? totalFats / daysToAnalyze : 0;

  // Calculate training frequency
  const uniqueTrainingDays = new Set(recentTrainings.map(t => t.date)).size;
  const trainingFrequency = uniqueTrainingDays;

  // Find most common training type
  const trainingTypeCounts: { [key: string]: number } = {};
  recentTrainings.forEach(training => {
    trainingTypeCounts[training.type] = (trainingTypeCounts[training.type] || 0) + 1;
  });

  const mostCommonTrainingType = Object.entries(trainingTypeCounts).length > 0
    ? Object.entries(trainingTypeCounts).sort((a, b) => b[1] - a[1])[0][0]
    : 'strength';

  return {
    calorieGoal,
    averageCaloriesEaten: Math.round(averageCaloriesEaten),
    averageCaloriesBurned: Math.round(averageCaloriesBurned),
    averageProtein: Math.round(averageProtein),
    averageCarbs: Math.round(averageCarbs),
    averageFats: Math.round(averageFats),
    trainingFrequency,
    mostCommonTrainingType,
  };
}

/**
 * Determines workout goal based on calorie balance and training history
 */
export function determineGoalFromData(metrics: UserMetrics): 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness' {
  const calorieBalance = metrics.averageCaloriesEaten - metrics.calorieGoal;
  const proteinRatio = metrics.averageProtein / (metrics.averageCaloriesEaten / 4); // protein g / total calories

  // If eating below goal consistently, likely trying to lose weight
  if (calorieBalance < -200 && metrics.averageCaloriesBurned > 300) {
    return 'weight_loss';
  }

  // If high protein and moderate calories, likely building muscle
  if (proteinRatio > 0.25 && Math.abs(calorieBalance) < 200) {
    return 'hypertrophy';
  }

  // If training frequently with cardio focus
  if (metrics.mostCommonTrainingType.toLowerCase().includes('cardio') ||
      metrics.mostCommonTrainingType.toLowerCase().includes('run')) {
    return 'endurance';
  }

  // If training with strength focus
  if (metrics.mostCommonTrainingType.toLowerCase().includes('strength') ||
      metrics.mostCommonTrainingType.toLowerCase().includes('barbell')) {
    return 'strength';
  }

  // Default to general fitness
  return 'general_fitness';
}

/**
 * Suggests appropriate training frequency based on current activity level
 */
export function suggestTrainingFrequency(metrics: UserMetrics): number {
  // If user is already training, suggest gradually increasing
  if (metrics.trainingFrequency >= 5) return 5; // Max 5 days for most people
  if (metrics.trainingFrequency >= 3) return metrics.trainingFrequency + 1;
  if (metrics.trainingFrequency >= 1) return 3; // Move to 3 days

  // New user, start with 3 days
  return 3;
}

/**
 * Determines difficulty level based on training history and performance
 */
export function determineDifficulty(metrics: UserMetrics): 'beginner' | 'intermediate' | 'advanced' {
  // If training 0-2 days per week or very low calories burned
  if (metrics.trainingFrequency <= 2 || metrics.averageCaloriesBurned < 200) {
    return 'beginner';
  }

  // If training 3-4 days per week with moderate intensity
  if (metrics.trainingFrequency <= 4 && metrics.averageCaloriesBurned < 400) {
    return 'intermediate';
  }

  // If training 5+ days per week with high intensity
  return 'advanced';
}

// ========================================
// Workout Plan Generation Logic
// ========================================

/**
 * Generates an intelligent workout plan based on user's food and training data
 */
export function generateDataDrivenWorkoutPlan(
  foods: FoodEntry[],
  trainings: TrainingEntry[],
  calorieGoal: number,
  equipment: 'none' | 'basic' | 'full_gym' = 'basic',
  userWeight?: number
): WorkoutPlan {
  // Analyze user data to understand their patterns
  const metrics = analyzeUserData(foods, trainings, calorieGoal);

  // Determine optimal parameters based on data
  const goal = determineGoalFromData(metrics);
  const difficulty = determineDifficulty(metrics);
  const daysPerWeek = suggestTrainingFrequency(metrics);

  // Calculate recommended session duration based on goal
  const sessionDuration = goal === 'endurance' || goal === 'weight_loss' ? 40 : 50;

  // Create preferences object
  const preferences: WorkoutPreferences = {
    daysPerWeek,
    sessionDuration,
    difficulty,
    goal,
    equipment,
  };

  // Generate the plan
  const plan = generateWorkoutPlan(preferences);

  // Add estimated calories burned to each day
  plan.weeklySchedule = plan.weeklySchedule.map(day => ({
    ...day,
    caloriesBurned: estimateCaloriesBurned(
      day.exercises,
      userWeight || 70,
      difficulty
    ),
  }));

  // Customize plan name based on data insights
  let planName = `Smart ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Plan`;

  if (goal === 'weight_loss') {
    planName = `Weight Loss Plan (${daysPerWeek}x/week)`;
  } else if (goal === 'hypertrophy') {
    planName = `Muscle Building Plan (${daysPerWeek}x/week)`;
  } else if (goal === 'strength') {
    planName = `Strength Training Plan (${daysPerWeek}x/week)`;
  }

  plan.name = planName;
  plan.description = generatePlanDescription(metrics, goal, daysPerWeek);

  return plan;
}

/**
 * Generates a personalized description for the workout plan
 */
function generatePlanDescription(
  metrics: UserMetrics,
  goal: string,
  daysPerWeek: number
): string {
  const calorieBalance = metrics.averageCaloriesEaten - metrics.calorieGoal;
  const isCalorieDeficit = calorieBalance < -100;

  let description = `Based on your ${daysPerWeek} day training history, `;

  if (goal === 'weight_loss') {
    description += `this plan focuses on high-volume training and cardio to maximize calorie burn. `;
    if (isCalorieDeficit) {
      description += `You&apos;re already in a good calorie deficit. Keep it up!`;
    } else {
      description += `Combine with a slight calorie deficit for best results.`;
    }
  } else if (goal === 'hypertrophy') {
    description += `this plan emphasizes progressive overload and muscle building. `;
    description += `Your protein intake of ${metrics.averageProtein}g/day is ${metrics.averageProtein >= 100 ? 'excellent' : 'good, but could be increased'}.`;
  } else if (goal === 'strength') {
    description += `this plan focuses on low-rep, high-intensity compound movements. `;
    description += `Ensure adequate rest and nutrition for optimal strength gains.`;
  } else if (goal === 'endurance') {
    description += `this plan builds cardiovascular endurance and stamina. `;
    description += `Stay consistent with ${Math.round(metrics.averageCarbs)}g carbs to fuel your workouts.`;
  } else {
    description += `this balanced plan helps you maintain overall fitness and health.`;
  }

  return description;
}

/**
 * Generates a custom workout plan based on user preferences
 */
export function generateWorkoutPlan(preferences: WorkoutPreferences): WorkoutPlan {
  const { daysPerWeek, difficulty, goal, equipment } = preferences;

  // Select appropriate split based on days per week
  let workoutSplit: string[];

  if (daysPerWeek <= 3) {
    workoutSplit = ['Full Body', 'Full Body', 'Full Body'];
  } else if (daysPerWeek === 4) {
    workoutSplit = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'];
  } else if (daysPerWeek === 5) {
    workoutSplit = ['Push', 'Pull', 'Legs', 'Push', 'Pull'];
  } else {
    workoutSplit = ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body', 'Full Body'];
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const selectedDays = days.slice(0, daysPerWeek);

  const weeklySchedule: WorkoutDay[] = selectedDays.map((day, index) => {
    const focus = workoutSplit[index] || 'Full Body';
    const exercises = selectExercises(focus, difficulty, equipment, goal);

    return {
      day,
      focus,
      duration: calculateDuration(exercises),
      icon: getIconForFocus(focus),
      exercises,
    };
  });

  // Add rest day if not 7 days
  if (daysPerWeek < 7) {
    const restDay = days[daysPerWeek];
    weeklySchedule.push({
      day: restDay,
      focus: 'Rest & Recovery',
      duration: '30 min',
      icon: 'bed-outline',
      exercises: EXERCISE_DATABASE.recovery.slice(0, 2),
    });
  }

  return {
    id: generateId(),
    name: `Custom ${difficulty} Plan`,
    description: `${daysPerWeek} day ${goal} focused plan`,
    weeklySchedule,
    createdAt: new Date(),
    difficulty,
    goal,
  };
}

/**
 * Selects appropriate exercises based on focus and preferences
 */
function selectExercises(
  focus: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  equipment: string,
  goal: string
): Exercise[] {
  const exerciseCount = difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 5 : 6;
  let selectedExercises: any[] = [];

  // Filter exercises based on equipment availability
  const filterByEquipment = (exercises: any[]) => {
    return exercises.filter((ex) => {
      if (equipment === 'none') return ex.equipment === 'none';
      if (equipment === 'basic') return ex.equipment === 'none' || ex.equipment === 'basic';
      return true; // full_gym has access to all
    });
  };

  switch (focus.toLowerCase()) {
    case 'push':
    case 'upper body':
      const pushExercises = filterByEquipment(EXERCISE_DATABASE.upperBody.push);
      selectedExercises = pushExercises.slice(0, exerciseCount);
      break;

    case 'pull':
      const pullExercises = filterByEquipment(EXERCISE_DATABASE.upperBody.pull);
      selectedExercises = pullExercises.slice(0, exerciseCount);
      break;

    case 'legs':
    case 'lower body':
      const quadExercises = filterByEquipment(EXERCISE_DATABASE.lowerBody.quad_focused);
      const hamstringExercises = filterByEquipment(EXERCISE_DATABASE.lowerBody.hamstring_focused);
      const calfExercises = filterByEquipment(EXERCISE_DATABASE.lowerBody.calves);
      selectedExercises = [
        ...quadExercises.slice(0, 2),
        ...hamstringExercises.slice(0, 2),
        ...calfExercises.slice(0, 1),
      ].slice(0, exerciseCount);
      break;

    case 'cardio & core':
    case 'cardio':
      const cardioExercises = filterByEquipment(EXERCISE_DATABASE.cardio);
      const coreExercises = filterByEquipment(EXERCISE_DATABASE.core);
      selectedExercises = [
        ...cardioExercises.slice(0, 2),
        ...coreExercises.slice(0, 3),
      ].slice(0, exerciseCount);
      break;

    case 'full body':
    default:
      const fullBodyExercises = filterByEquipment(EXERCISE_DATABASE.fullBody);
      const additionalCore = filterByEquipment(EXERCISE_DATABASE.core);
      selectedExercises = [
        ...fullBodyExercises.slice(0, 3),
        ...additionalCore.slice(0, 2),
      ].slice(0, exerciseCount);
      break;
  }

  // Adjust sets/reps based on goal
  return selectedExercises.map((ex) => ({
    name: ex.name,
    sets: adjustSetsForGoal(ex.sets, goal),
    reps: adjustRepsForGoal(ex.reps, goal),
  }));
}

/**
 * Adjusts sets based on training goal
 */
function adjustSetsForGoal(sets: string, goal: string): string {
  if (goal === 'endurance' || goal === 'weight_loss') {
    // Higher volume for endurance/weight loss
    const numSets = parseInt(sets.split('-')[0]) || 3;
    return `${numSets + 1}`;
  }
  return sets;
}

/**
 * Adjusts reps based on training goal
 */
function adjustRepsForGoal(reps: string, goal: string): string {
  if (goal === 'strength') {
    return '4-6'; // Lower reps for strength
  } else if (goal === 'endurance' || goal === 'weight_loss') {
    return '15-20'; // Higher reps for endurance
  }
  return reps; // Default for hypertrophy and general fitness
}

/**
 * Calculates estimated workout duration based on exercises
 */
function calculateDuration(exercises: Exercise[]): string {
  const averageTimePerExercise = 5; // minutes
  const totalMinutes = exercises.length * averageTimePerExercise;
  return `${totalMinutes} min`;
}

/**
 * Returns appropriate icon for workout focus
 */
function getIconForFocus(focus: string): string {
  const iconMap: { [key: string]: string } = {
    'push': 'arrow-up-outline',
    'pull': 'arrow-down-outline',
    'legs': 'body-outline',
    'lower body': 'body-outline',
    'upper body': 'barbell-outline',
    'full body': 'fitness-outline',
    'cardio': 'flash-outline',
    'cardio & core': 'flash-outline',
    'rest & recovery': 'bed-outline',
  };
  return iconMap[focus.toLowerCase()] || 'fitness-outline';
}

/**
 * Generates a unique ID for workout plans
 */
function generateId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ========================================
// Calorie Estimation
// ========================================

/**
 * Estimates calories burned for a workout session
 */
export function estimateCaloriesBurned(
  exercises: Exercise[],
  userWeight: number = 70, // kg
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): number {
  // MET (Metabolic Equivalent of Task) values
  const MET_VALUES = {
    beginner: 4.0,
    intermediate: 6.0,
    advanced: 8.0,
  };

  const met = MET_VALUES[difficulty];
  const durationHours = exercises.length * 0.08; // ~5 min per exercise
  const calories = met * userWeight * durationHours;

  return Math.round(calories);
}

// ========================================
// Workout Plan Validation
// ========================================

/**
 * Validates if a workout plan is balanced and safe
 */
export function validateWorkoutPlan(plan: WorkoutPlan): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check for muscle group balance
  const focusCount: { [key: string]: number } = {};
  plan.weeklySchedule.forEach((day) => {
    focusCount[day.focus] = (focusCount[day.focus] || 0) + 1;
  });

  // Warning if too much focus on one area
  Object.entries(focusCount).forEach(([focus, count]) => {
    if (count > 3 && focus !== 'Rest & Recovery') {
      warnings.push(`Too many ${focus} sessions (${count}). Consider more variety.`);
    }
  });

  // Check for rest days
  const restDays = plan.weeklySchedule.filter((day) => day.focus === 'Rest & Recovery').length;
  if (restDays === 0 && plan.weeklySchedule.length === 7) {
    warnings.push('No rest days scheduled. Recovery is important for progress.');
  }

  // Check exercise count per session
  plan.weeklySchedule.forEach((day) => {
    if (day.exercises.length > 8) {
      warnings.push(`${day.day} has too many exercises (${day.exercises.length}). May lead to fatigue.`);
    }
  });

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

// ========================================
// Insights and Recommendations
// ========================================

/**
 * Generates personalized insights based on user's food and training data
 */
export function generateInsights(
  foods: FoodEntry[],
  trainings: TrainingEntry[],
  calorieGoal: number
): string[] {
  const metrics = analyzeUserData(foods, trainings, calorieGoal);
  const insights: string[] = [];

  // Calorie balance insights
  const calorieBalance = metrics.averageCaloriesEaten - metrics.calorieGoal;
  if (calorieBalance < -500) {
    insights.push('⚠️ You&apos;re eating significantly below your calorie goal. This may affect your energy levels and recovery.');
  } else if (calorieBalance > 500) {
    insights.push('📊 You&apos;re consistently above your calorie goal. Consider adjusting portions or increasing activity.');
  } else if (Math.abs(calorieBalance) < 100) {
    insights.push('✅ Great job maintaining your calorie balance!');
  }

  // Protein insights
  if (metrics.averageProtein < 80) {
    insights.push('💪 Consider increasing protein intake to support muscle recovery and growth.');
  } else if (metrics.averageProtein >= 100) {
    insights.push('💪 Excellent protein intake! This supports muscle building and recovery.');
  }

  // Training frequency insights
  if (metrics.trainingFrequency === 0) {
    insights.push('🏃 Start with 2-3 training sessions per week to build a consistent habit.');
  } else if (metrics.trainingFrequency === 1) {
    insights.push('🏃 Try adding 1-2 more training sessions per week for better results.');
  } else if (metrics.trainingFrequency >= 5) {
    insights.push('🔥 Impressive training frequency! Make sure you&apos;re getting enough rest.');
  }

  // Calorie burn vs intake insights
  const netCalories = metrics.averageCaloriesEaten - metrics.averageCaloriesBurned;
  const goal = determineGoalFromData(metrics);

  if (goal === 'weight_loss' && netCalories > metrics.calorieGoal) {
    insights.push('⚖️ For weight loss, try to maintain a calorie deficit by eating less or burning more through exercise.');
  } else if (goal === 'hypertrophy' && netCalories < metrics.calorieGoal - 200) {
    insights.push('⚖️ For muscle building, ensure you\'re eating enough to support growth (slight calorie surplus).');
  }

  // Macro balance insights
  const totalMacros = metrics.averageProtein + metrics.averageCarbs + metrics.averageFats;
  if (totalMacros > 0) {
    const carbRatio = metrics.averageCarbs / totalMacros;
    if (carbRatio < 0.25 && goal === 'endurance') {
      insights.push('🍞 Endurance training benefits from higher carb intake. Consider adding more carbs to fuel your workouts.');
    }
  }

  return insights;
}

/**
 * Recommends workout plan adjustments based on recent performance
 */
export function recommendAdjustments(
  trainings: TrainingEntry[],
  currentPlan: WorkoutPlan
): string[] {
  const recommendations: string[] = [];

  // Analyze recent 7 days
  const recentTrainings = trainings.slice(0, 7);
  const completedDays = new Set(recentTrainings.map(t => t.date)).size;
  const plannedDays = currentPlan.weeklySchedule.filter(d => d.focus !== 'Rest & Recovery').length;

  // Check consistency
  if (completedDays < plannedDays * 0.7) {
    recommendations.push('Consider reducing training days to match your current schedule and build consistency.');
  } else if (completedDays === plannedDays) {
    recommendations.push('Great consistency! You might be ready to progress to a more challenging plan.');
  }

  // Check training types
  const trainingTypes = recentTrainings.map(t => t.type.toLowerCase());
  const hasCardio = trainingTypes.some(t => t.includes('cardio') || t.includes('run'));
  const hasStrength = trainingTypes.some(t => t.includes('strength') || t.includes('barbell'));

  if (!hasCardio && currentPlan.goal !== 'strength') {
    recommendations.push('Add 1-2 cardio sessions per week for cardiovascular health.');
  }

  if (!hasStrength && currentPlan.goal !== 'endurance') {
    recommendations.push('Include strength training to build muscle and improve metabolism.');
  }

  return recommendations;
}

/**
 * Calculates progress metrics over time
 */
export function calculateProgress(
  trainings: TrainingEntry[],
  days: number = 30
): {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageWorkoutsPerWeek: number;
  mostProductiveDay: string;
  improvement: number; // Percentage change in activity
} {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentTrainings = trainings.filter(t => new Date(t.date) >= cutoffDate);

  const totalWorkouts = recentTrainings.length;
  const totalCaloriesBurned = recentTrainings.reduce((sum, t) => sum + t.calories, 0);
  const averageWorkoutsPerWeek = (totalWorkouts / days) * 7;

  // Find most productive day
  const dayCount: { [key: string]: number } = {};
  recentTrainings.forEach(t => {
    const dayOfWeek = new Date(t.date).toLocaleDateString('en-US', { weekday: 'long' });
    dayCount[dayOfWeek] = (dayCount[dayOfWeek] || 0) + 1;
  });

  const mostProductiveDay = Object.entries(dayCount).length > 0
    ? Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0]
    : 'None';

  // Calculate improvement (compare first half vs second half)
  const midpoint = Math.floor(days / 2);
  const firstHalf = recentTrainings.filter(t => {
    const daysAgo = Math.floor((new Date().getTime() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo >= midpoint;
  });
  const secondHalf = recentTrainings.filter(t => {
    const daysAgo = Math.floor((new Date().getTime() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo < midpoint;
  });

  const improvement = firstHalf.length > 0
    ? ((secondHalf.length - firstHalf.length) / firstHalf.length) * 100
    : 0;

  return {
    totalWorkouts,
    totalCaloriesBurned,
    averageWorkoutsPerWeek: Math.round(averageWorkoutsPerWeek * 10) / 10,
    mostProductiveDay,
    improvement: Math.round(improvement),
  };
}
