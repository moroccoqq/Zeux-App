import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodEntry, TrainingEntry } from '../contexts/DataContext';

// Storage keys
const STORAGE_KEYS = {
  FOODS: '@zeux_foods',
  TRAININGS: '@zeux_trainings',
  SETTINGS: '@zeux_settings',
  WORKOUT_PLANS: '@zeux_workout_plans',
} as const;

export interface UserSettings {
  calorieGoal: number;
  exerciseGoal: number;
  waterGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  userName?: string;
  weight?: number;
  height?: number;
  age?: number;
}

export interface WorkoutPlan {
  id: string;
  day: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
  icon: string;
  isCustom: boolean;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

/**
 * Storage Service - Handles all persistent data operations
 */
class StorageService {
  // ==================== FOOD OPERATIONS ====================

  /**
   * Save all food entries to storage
   */
  async saveFoods(foods: FoodEntry[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(foods);
      await AsyncStorage.setItem(STORAGE_KEYS.FOODS, jsonValue);
    } catch (error) {
      console.error('Error saving foods:', error);
      throw new Error('Failed to save food data');
    }
  }

  /**
   * Load all food entries from storage
   */
  async loadFoods(): Promise<FoodEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FOODS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading foods:', error);
      return [];
    }
  }

  /**
   * Add a new food entry
   */
  async addFood(food: FoodEntry): Promise<void> {
    try {
      const foods = await this.loadFoods();
      foods.unshift(food); // Add to beginning
      await this.saveFoods(foods);
    } catch (error) {
      console.error('Error adding food:', error);
      throw new Error('Failed to add food');
    }
  }

  /**
   * Delete a food entry by ID
   */
  async deleteFood(foodId: string): Promise<void> {
    try {
      const foods = await this.loadFoods();
      const updatedFoods = foods.filter(food => food.id !== foodId);
      await this.saveFoods(updatedFoods);
    } catch (error) {
      console.error('Error deleting food:', error);
      throw new Error('Failed to delete food');
    }
  }

  // ==================== TRAINING OPERATIONS ====================

  /**
   * Save all training entries to storage
   */
  async saveTrainings(trainings: TrainingEntry[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(trainings);
      await AsyncStorage.setItem(STORAGE_KEYS.TRAININGS, jsonValue);
    } catch (error) {
      console.error('Error saving trainings:', error);
      throw new Error('Failed to save training data');
    }
  }

  /**
   * Load all training entries from storage
   */
  async loadTrainings(): Promise<TrainingEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRAININGS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading trainings:', error);
      return [];
    }
  }

  /**
   * Add a new training entry
   */
  async addTraining(training: TrainingEntry): Promise<void> {
    try {
      const trainings = await this.loadTrainings();
      trainings.unshift(training); // Add to beginning
      await this.saveTrainings(trainings);
    } catch (error) {
      console.error('Error adding training:', error);
      throw new Error('Failed to add training');
    }
  }

  /**
   * Delete a training entry by ID
   */
  async deleteTraining(trainingId: string): Promise<void> {
    try {
      const trainings = await this.loadTrainings();
      const updatedTrainings = trainings.filter(training => training.id !== trainingId);
      await this.saveTrainings(updatedTrainings);
    } catch (error) {
      console.error('Error deleting training:', error);
      throw new Error('Failed to delete training');
    }
  }

  // ==================== SETTINGS OPERATIONS ====================

  /**
   * Save user settings to storage
   */
  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Load user settings from storage
   */
  async loadSettings(): Promise<UserSettings> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }

      // Return default settings if none exist
      return {
        calorieGoal: 2000,
        exerciseGoal: 500,
        waterGoal: 8,
        proteinGoal: 150,
        carbsGoal: 200,
        fatsGoal: 65,
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      // Return default settings on error
      return {
        calorieGoal: 2000,
        exerciseGoal: 500,
        waterGoal: 8,
        proteinGoal: 150,
        carbsGoal: 200,
        fatsGoal: 65,
      };
    }
  }

  /**
   * Update specific settings
   */
  async updateSettings(partialSettings: Partial<UserSettings>): Promise<void> {
    try {
      const currentSettings = await this.loadSettings();
      const updatedSettings = { ...currentSettings, ...partialSettings };
      await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }

  // ==================== WORKOUT PLANS OPERATIONS ====================

  /**
   * Save workout plans to storage
   */
  async saveWorkoutPlans(plans: WorkoutPlan[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(plans);
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_PLANS, jsonValue);
    } catch (error) {
      console.error('Error saving workout plans:', error);
      throw new Error('Failed to save workout plans');
    }
  }

  /**
   * Load workout plans from storage
   */
  async loadWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_PLANS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading workout plans:', error);
      return [];
    }
  }

  /**
   * Add or update a workout plan
   */
  async saveWorkoutPlan(plan: WorkoutPlan): Promise<void> {
    try {
      const plans = await this.loadWorkoutPlans();
      const existingIndex = plans.findIndex(p => p.id === plan.id);

      if (existingIndex >= 0) {
        plans[existingIndex] = plan;
      } else {
        plans.push(plan);
      }

      await this.saveWorkoutPlans(plans);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      throw new Error('Failed to save workout plan');
    }
  }

  /**
   * Delete a workout plan by ID
   */
  async deleteWorkoutPlan(planId: string): Promise<void> {
    try {
      const plans = await this.loadWorkoutPlans();
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      await this.saveWorkoutPlans(updatedPlans);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw new Error('Failed to delete workout plan');
    }
  }

  // ==================== ANALYTICS & AGGREGATION ====================

  /**
   * Get foods for a specific date range
   */
  async getFoodsByDateRange(startDate: string, endDate: string): Promise<FoodEntry[]> {
    try {
      const allFoods = await this.loadFoods();
      return allFoods.filter(food => {
        const foodDate = new Date(food.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return foodDate >= start && foodDate <= end;
      });
    } catch (error) {
      console.error('Error getting foods by date range:', error);
      return [];
    }
  }

  /**
   * Get trainings for a specific date range
   */
  async getTrainingsByDateRange(startDate: string, endDate: string): Promise<TrainingEntry[]> {
    try {
      const allTrainings = await this.loadTrainings();
      return allTrainings.filter(training => {
        const trainingDate = new Date(training.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return trainingDate >= start && trainingDate <= end;
      });
    } catch (error) {
      console.error('Error getting trainings by date range:', error);
      return [];
    }
  }

  /**
   * Get summary statistics for a date range
   */
  async getDateRangeSummary(startDate: string, endDate: string) {
    try {
      const foods = await this.getFoodsByDateRange(startDate, endDate);
      const trainings = await this.getTrainingsByDateRange(startDate, endDate);

      const totalCaloriesConsumed = foods.reduce((sum, food) => sum + food.calories, 0);
      const totalCaloriesBurned = trainings.reduce((sum, training) => sum + training.calories, 0);
      const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
      const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
      const totalFats = foods.reduce((sum, food) => sum + food.fats, 0);

      return {
        totalCaloriesConsumed,
        totalCaloriesBurned,
        netCalories: totalCaloriesConsumed - totalCaloriesBurned,
        totalProtein,
        totalCarbs,
        totalFats,
        totalWorkouts: trainings.length,
        totalMeals: foods.length,
      };
    } catch (error) {
      console.error('Error getting date range summary:', error);
      return {
        totalCaloriesConsumed: 0,
        totalCaloriesBurned: 0,
        netCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        totalWorkouts: 0,
        totalMeals: 0,
      };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Clear all app data (useful for debugging or reset)
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FOODS,
        STORAGE_KEYS.TRAININGS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.WORKOUT_PLANS,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear app data');
    }
  }

  /**
   * Export all data for backup
   */
  async exportAllData() {
    try {
      const [foods, trainings, settings, workoutPlans] = await Promise.all([
        this.loadFoods(),
        this.loadTrainings(),
        this.loadSettings(),
        this.loadWorkoutPlans(),
      ]);

      return {
        foods,
        trainings,
        settings,
        workoutPlans,
        exportDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Import data from backup
   */
  async importAllData(data: {
    foods?: FoodEntry[];
    trainings?: TrainingEntry[];
    settings?: UserSettings;
    workoutPlans?: WorkoutPlan[];
  }): Promise<void> {
    try {
      if (data.foods) await this.saveFoods(data.foods);
      if (data.trainings) await this.saveTrainings(data.trainings);
      if (data.settings) await this.saveSettings(data.settings);
      if (data.workoutPlans) await this.saveWorkoutPlans(data.workoutPlans);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }
}

// Export singleton instance
export default new StorageService();
