import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storageService, { UserSettings } from '../services/storageService';

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
  // Data
  foods: FoodEntry[];
  trainings: TrainingEntry[];

  // Settings
  calorieGoal: number;
  exerciseGoal: number;
  waterIntake: number;
  waterGoal: number;
  steps: number;

  // Loading state
  isLoading: boolean;

  // Food operations
  addFood: (food: Omit<FoodEntry, 'id' | 'date'>) => Promise<void>;
  deleteFood: (foodId: string) => Promise<void>;
  getTodayFoods: () => FoodEntry[];
  getFoodsByDate: (date: string) => FoodEntry[];

  // Training operations
  addTraining: (training: Omit<TrainingEntry, 'id' | 'date'>) => Promise<void>;
  deleteTraining: (trainingId: string) => Promise<void>;
  getTodayTrainings: () => TrainingEntry[];
  getTrainingsByDate: (date: string) => TrainingEntry[];

  // Analytics
  getTodayCalories: () => { eaten: number; burned: number };
  getTodayMacros: () => { protein: number; carbs: number; fats: number };
  getDateRangeData: (startDate: string, endDate: string) => Promise<{
    foods: FoodEntry[];
    trainings: TrainingEntry[];
    summary: {
      totalCaloriesConsumed: number;
      totalCaloriesBurned: number;
      netCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFats: number;
      totalWorkouts: number;
      totalMeals: number;
    };
  }>;

  // Water tracking
  incrementWater: () => void;
  decrementWater: () => void;

  // Settings
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;

  // Utility
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    calorieGoal: 2000,
    exerciseGoal: 500,
    waterGoal: 8,
    proteinGoal: 150,
    carbsGoal: 200,
    fatsGoal: 65,
  });
  const [waterIntake, setWaterIntake] = useState(0);
  const [steps] = useState(0); // TODO: Integrate with health tracking
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Save foods whenever they change
  useEffect(() => {
    if (!isLoading && foods.length > 0) {
      storageService.saveFoods(foods).catch(console.error);
    }
  }, [foods, isLoading]);

  // Save trainings whenever they change
  useEffect(() => {
    if (!isLoading && trainings.length > 0) {
      storageService.saveTrainings(trainings).catch(console.error);
    }
  }, [trainings, isLoading]);

  // Save settings whenever they change
  useEffect(() => {
    if (!isLoading) {
      storageService.saveSettings(settings).catch(console.error);
    }
  }, [settings, isLoading]);

  /**
   * Load all data from storage on app start
   */
  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      const [loadedFoods, loadedTrainings, loadedSettings] = await Promise.all([
        storageService.loadFoods(),
        storageService.loadTrainings(),
        storageService.loadSettings(),
      ]);

      setFoods(loadedFoods);
      setTrainings(loadedTrainings);
      setSettings(loadedSettings);

      // Reset water intake daily (could be enhanced with date checking)
      setWaterIntake(0);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manually refresh data from storage
   */
  const refreshData = async () => {
    await loadInitialData();
  };

  /**
   * Get today's date in a consistent format
   */
  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US');
  };

  /**
   * Add a new food entry
   */
  const addFood = async (food: Omit<FoodEntry, 'id' | 'date'>) => {
    const newFood: FoodEntry = {
      ...food,
      id: Date.now().toString(),
      date: getTodayDate(),
    };
    setFoods(prev => [newFood, ...prev]);
  };

  /**
   * Delete a food entry
   */
  const deleteFood = async (foodId: string) => {
    setFoods(prev => prev.filter(food => food.id !== foodId));
  };

  /**
   * Get foods for today
   */
  const getTodayFoods = () => {
    const today = getTodayDate();
    return foods.filter(food => food.date === today);
  };

  /**
   * Get foods for a specific date
   */
  const getFoodsByDate = (date: string) => {
    return foods.filter(food => food.date === date);
  };

  /**
   * Add a new training entry
   */
  const addTraining = async (training: Omit<TrainingEntry, 'id' | 'date'>) => {
    const newTraining: TrainingEntry = {
      ...training,
      id: Date.now().toString(),
      date: getTodayDate(),
    };
    setTrainings(prev => [newTraining, ...prev]);
  };

  /**
   * Delete a training entry
   */
  const deleteTraining = async (trainingId: string) => {
    setTrainings(prev => prev.filter(training => training.id !== trainingId));
  };

  /**
   * Get trainings for today
   */
  const getTodayTrainings = () => {
    const today = getTodayDate();
    return trainings.filter(training => training.date === today);
  };

  /**
   * Get trainings for a specific date
   */
  const getTrainingsByDate = (date: string) => {
    return trainings.filter(training => training.date === date);
  };

  /**
   * Get today's calorie statistics
   */
  const getTodayCalories = () => {
    const todayFoods = getTodayFoods();
    const todayTrainings = getTodayTrainings();

    const eaten = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const burned = todayTrainings.reduce((sum, training) => sum + training.calories, 0);

    return { eaten, burned };
  };

  /**
   * Get today's macro statistics
   */
  const getTodayMacros = () => {
    const todayFoods = getTodayFoods();

    const protein = todayFoods.reduce((sum, food) => sum + food.protein, 0);
    const carbs = todayFoods.reduce((sum, food) => sum + food.carbs, 0);
    const fats = todayFoods.reduce((sum, food) => sum + food.fats, 0);

    return { protein, carbs, fats };
  };

  /**
   * Get data for a date range (for analytics)
   */
  const getDateRangeData = async (startDate: string, endDate: string) => {
    const [rangeFoods, rangeTrainings] = await Promise.all([
      storageService.getFoodsByDateRange(startDate, endDate),
      storageService.getTrainingsByDateRange(startDate, endDate),
    ]);

    const summary = await storageService.getDateRangeSummary(startDate, endDate);

    return {
      foods: rangeFoods,
      trainings: rangeTrainings,
      summary,
    };
  };

  /**
   * Increment water intake
   */
  const incrementWater = () => {
    setWaterIntake(prev => prev + 1);
  };

  /**
   * Decrement water intake
   */
  const decrementWater = () => {
    setWaterIntake(prev => Math.max(0, prev - 1));
  };

  /**
   * Update user settings
   */
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <DataContext.Provider
      value={{
        // Data
        foods,
        trainings,

        // Settings
        calorieGoal: settings.calorieGoal,
        exerciseGoal: settings.exerciseGoal,
        waterIntake,
        waterGoal: settings.waterGoal,
        steps,

        // Loading
        isLoading,

        // Food operations
        addFood,
        deleteFood,
        getTodayFoods,
        getFoodsByDate,

        // Training operations
        addTraining,
        deleteTraining,
        getTodayTrainings,
        getTrainingsByDate,

        // Analytics
        getTodayCalories,
        getTodayMacros,
        getDateRangeData,

        // Water tracking
        incrementWater,
        decrementWater,

        // Settings
        updateSettings,

        // Utility
        refreshData,
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
