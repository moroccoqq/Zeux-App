/**
 * Workout Plan Logic - Usage Examples
 *
 * This file demonstrates how to use the workout plan generation logic
 * with the app's food and training data.
 */

import { useData } from '../contexts/DataContext';
import {
  generateDataDrivenWorkoutPlan,
  analyzeUserData,
  generateInsights,
  calculateProgress,
  recommendAdjustments,
  PRESET_PLANS,
} from './workoutPlanLogic';

/**
 * Example 1: Generate a workout plan based on user's food and training history
 */
export function ExampleGeneratePlan() {
  const { foods, trainings, calorieGoal } = useData();

  // Generate an intelligent workout plan based on user data
  const workoutPlan = generateDataDrivenWorkoutPlan(
    foods,
    trainings,
    calorieGoal,
    'basic', // equipment: 'none' | 'basic' | 'full_gym'
    70 // user weight in kg (optional)
  );

  console.log('Generated Workout Plan:', workoutPlan);
  console.log('Plan Name:', workoutPlan.name);
  console.log('Description:', workoutPlan.description);
  console.log('Difficulty:', workoutPlan.difficulty);
  console.log('Goal:', workoutPlan.goal);

  // Access the weekly schedule
  workoutPlan.weeklySchedule.forEach((day) => {
    console.log(`\n${day.day} - ${day.focus} (${day.duration})`);
    console.log(`Estimated calories burned: ${day.caloriesBurned}`);
    day.exercises.forEach((exercise, idx) => {
      console.log(`  ${idx + 1}. ${exercise.name}: ${exercise.sets} sets x ${exercise.reps} reps`);
    });
  });

  return workoutPlan;
}

/**
 * Example 2: Analyze user data to understand their fitness patterns
 */
export function ExampleAnalyzeUserData() {
  const { foods, trainings, calorieGoal } = useData();

  // Analyze last 7 days (or specify custom period)
  const metrics = analyzeUserData(foods, trainings, calorieGoal, 7);

  console.log('User Metrics:', {
    calorieGoal: metrics.calorieGoal,
    averageCaloriesEaten: metrics.averageCaloriesEaten,
    averageCaloriesBurned: metrics.averageCaloriesBurned,
    calorieBalance: metrics.averageCaloriesEaten - metrics.calorieGoal,
    macros: {
      protein: metrics.averageProtein,
      carbs: metrics.averageCarbs,
      fats: metrics.averageFats,
    },
    trainingFrequency: metrics.trainingFrequency,
    mostCommonTrainingType: metrics.mostCommonTrainingType,
  });

  return metrics;
}

/**
 * Example 3: Get personalized insights and recommendations
 */
export function ExampleGetInsights() {
  const { foods, trainings, calorieGoal } = useData();

  // Get insights based on user data
  const insights = generateInsights(foods, trainings, calorieGoal);

  console.log('\nPersonalized Insights:');
  insights.forEach((insight, idx) => {
    console.log(`${idx + 1}. ${insight}`);
  });

  return insights;
}

/**
 * Example 4: Calculate progress over time
 */
export function ExampleCalculateProgress() {
  const { trainings } = useData();

  // Calculate progress for last 30 days
  const progress = calculateProgress(trainings, 30);

  console.log('\nProgress Report (Last 30 Days):', {
    totalWorkouts: progress.totalWorkouts,
    totalCaloriesBurned: progress.totalCaloriesBurned,
    averageWorkoutsPerWeek: progress.averageWorkoutsPerWeek,
    mostProductiveDay: progress.mostProductiveDay,
    improvement: `${progress.improvement}%`,
  });

  return progress;
}

/**
 * Example 5: Get recommendations for workout plan adjustments
 */
export function ExampleGetRecommendations() {
  const { trainings } = useData();

  // Use a preset plan or generated plan
  const currentPlan = PRESET_PLANS.beginner_3day;

  const recommendations = recommendAdjustments(trainings, currentPlan);

  console.log('\nWorkout Plan Recommendations:');
  recommendations.forEach((rec, idx) => {
    console.log(`${idx + 1}. ${rec}`);
  });

  return recommendations;
}

/**
 * Example 6: Using preset workout plans
 */
export function ExampleUsePresetPlans() {
  // Access preset plans directly
  const beginnerPlan = PRESET_PLANS.beginner_3day;
  const intermediatePlan = PRESET_PLANS.intermediate_5day_ppl;
  const weightLossPlan = PRESET_PLANS.cardio_weight_loss;

  console.log('Available Preset Plans:', {
    beginner: beginnerPlan.name,
    intermediate: intermediatePlan.name,
    weightLoss: weightLossPlan.name,
  });

  return {
    beginnerPlan,
    intermediatePlan,
    weightLossPlan,
  };
}

/**
 * Example 7: Complete workflow - From data analysis to plan generation
 */
export function ExampleCompleteWorkflow() {
  const { foods, trainings, calorieGoal } = useData();

  console.log('=== WORKOUT PLAN GENERATION WORKFLOW ===\n');

  // Step 1: Analyze user data
  console.log('Step 1: Analyzing your fitness data...');
  const metrics = analyzeUserData(foods, trainings, calorieGoal, 7);
  console.log(`- Training ${metrics.trainingFrequency} days/week`);
  console.log(`- Eating ${metrics.averageCaloriesEaten} cal/day (goal: ${metrics.calorieGoal})`);
  console.log(`- Burning ${metrics.averageCaloriesBurned} cal/day`);

  // Step 2: Get insights
  console.log('\nStep 2: Generating insights...');
  const insights = generateInsights(foods, trainings, calorieGoal);
  insights.forEach((insight) => console.log(`- ${insight}`));

  // Step 3: Generate personalized plan
  console.log('\nStep 3: Creating your personalized workout plan...');
  const plan = generateDataDrivenWorkoutPlan(foods, trainings, calorieGoal, 'basic', 70);
  console.log(`- Plan: ${plan.name}`);
  console.log(`- Difficulty: ${plan.difficulty}`);
  console.log(`- Goal: ${plan.goal}`);
  console.log(`- Training days: ${plan.weeklySchedule.length}`);

  // Step 4: Show weekly schedule
  console.log('\nStep 4: Your weekly training schedule:');
  plan.weeklySchedule.forEach((day) => {
    console.log(`\n${day.day} - ${day.focus}`);
    console.log(`Duration: ${day.duration} | Calories: ~${day.caloriesBurned}`);
  });

  // Step 5: Calculate progress
  console.log('\nStep 5: Your progress (last 30 days):');
  const progress = calculateProgress(trainings, 30);
  console.log(`- Completed ${progress.totalWorkouts} workouts`);
  console.log(`- Burned ${progress.totalCaloriesBurned} calories`);
  console.log(`- Average: ${progress.averageWorkoutsPerWeek} workouts/week`);
  console.log(`- Most active on: ${progress.mostProductiveDay}`);
  console.log(`- Improvement: ${progress.improvement}%`);

  return {
    metrics,
    insights,
    plan,
    progress,
  };
}

/**
 * Example 8: Integration with React component
 */
export function ExampleReactComponent() {
  /*

  Example React Native component using the workout plan logic:

  ```tsx
  import { useData } from '../contexts/DataContext';
  import { generateDataDrivenWorkoutPlan } from '../utils/workoutPlanLogic';

  export function WorkoutPlanScreen() {
    const { foods, trainings, calorieGoal } = useData();
    const [workoutPlan, setWorkoutPlan] = useState(null);

    useEffect(() => {
      // Generate plan when component mounts
      const plan = generateDataDrivenWorkoutPlan(
        foods,
        trainings,
        calorieGoal,
        'basic'
      );
      setWorkoutPlan(plan);
    }, [foods, trainings, calorieGoal]);

    if (!workoutPlan) return <Text>Loading...</Text>;

    return (
      <ScrollView>
        <Text style={styles.title}>{workoutPlan.name}</Text>
        <Text style={styles.description}>{workoutPlan.description}</Text>

        {workoutPlan.weeklySchedule.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <Text style={styles.dayName}>{day.day}</Text>
            <Text style={styles.dayFocus}>{day.focus}</Text>

            {day.exercises.map((exercise, idx) => (
              <View key={idx} style={styles.exerciseRow}>
                <Text>{exercise.name}</Text>
                <Text>{exercise.sets} x {exercise.reps}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  }
  ```

  */
}
