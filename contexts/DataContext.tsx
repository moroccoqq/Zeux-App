import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  image?: string;
  date: string;
}

export interface TrainingEntry {
  id: string;
  name: string;
  type: string;
  duration: string;
  calories: number;
  notes?: string;
  date: string;
}

interface DataContextType {
  foods: FoodEntry[];
  trainings: TrainingEntry[];
  calorieGoal: number;
  exerciseGoal: number;
  waterIntake: number;
  waterGoal: number;
  steps: number;
  addFood: (food: Omit<FoodEntry, 'id' | 'date'>) => void;
  addTraining: (training: Omit<TrainingEntry, 'id' | 'date'>) => void;
  getTodayFoods: () => FoodEntry[];
  getTodayTrainings: () => TrainingEntry[];
  getTodayCalories: () => { eaten: number; burned: number };
  getTodayMacros: () => { protein: number; carbs: number; fats: number };
  incrementWater: () => void;
  decrementWater: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
  const [calorieGoal] = useState(2000);
  const [exerciseGoal] = useState(500);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(8); // 8 cups per day
  const [steps] = useState(0);

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US');
  };

  const addFood = (food: Omit<FoodEntry, 'id' | 'date'>) => {
    const newFood: FoodEntry = {
      ...food,
      id: Date.now().toString(),
      date: getTodayDate(),
    };
    setFoods(prev => [newFood, ...prev]);
  };

  const addTraining = (training: Omit<TrainingEntry, 'id' | 'date'>) => {
    const newTraining: TrainingEntry = {
      ...training,
      id: Date.now().toString(),
      date: getTodayDate(),
    };
    setTrainings(prev => [newTraining, ...prev]);
  };

  const getTodayFoods = () => {
    const today = getTodayDate();
    return foods.filter(food => food.date === today);
  };

  const getTodayTrainings = () => {
    const today = getTodayDate();
    return trainings.filter(training => training.date === today);
  };

  const getTodayCalories = () => {
    const todayFoods = getTodayFoods();
    const todayTrainings = getTodayTrainings();

    const eaten = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const burned = todayTrainings.reduce((sum, training) => sum + training.calories, 0);

    return { eaten, burned };
  };

  const getTodayMacros = () => {
    const todayFoods = getTodayFoods();

    const protein = todayFoods.reduce((sum, food) => sum + food.protein, 0);
    const carbs = todayFoods.reduce((sum, food) => sum + food.carbs, 0);
    const fats = todayFoods.reduce((sum, food) => sum + food.fats, 0);

    return { protein, carbs, fats };
  };

  const incrementWater = () => {
    setWaterIntake(prev => prev + 1);
  };

  const decrementWater = () => {
    setWaterIntake(prev => Math.max(0, prev - 1));
  };

  return (
    <DataContext.Provider
      value={{
        foods,
        trainings,
        calorieGoal,
        exerciseGoal,
        waterIntake,
        waterGoal,
        steps,
        addFood,
        addTraining,
        getTodayFoods,
        getTodayTrainings,
        getTodayCalories,
        getTodayMacros,
        incrementWater,
        decrementWater,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
