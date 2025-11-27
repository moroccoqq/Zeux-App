import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../data/colors.json';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
  icon: string;
}

const weeklyPlan: WorkoutDay[] = [
  {
    day: 'Monday',
    focus: 'Upper Body',
    duration: '45 min',
    icon: 'barbell-outline',
    exercises: [
      { name: 'Bench Press', sets: '3', reps: '10-12' },
      { name: 'Dumbbell Row', sets: '3', reps: '10-12' },
      { name: 'Shoulder Press', sets: '3', reps: '10-12' },
      { name: 'Bicep Curls', sets: '3', reps: '12-15' },
    ],
  },
  {
    day: 'Tuesday',
    focus: 'Lower Body',
    duration: '50 min',
    icon: 'body-outline',
    exercises: [
      { name: 'Squats', sets: '4', reps: '8-10' },
      { name: 'Romanian Deadlifts', sets: '3', reps: '10-12' },
      { name: 'Leg Press', sets: '3', reps: '12-15' },
      { name: 'Calf Raises', sets: '3', reps: '15-20' },
    ],
  },
  {
    day: 'Wednesday',
    focus: 'Cardio & Core',
    duration: '30 min',
    icon: 'flash-outline',
    exercises: [
      { name: 'Running', sets: '1', reps: '20 min' },
      { name: 'Planks', sets: '3', reps: '60 sec' },
      { name: 'Russian Twists', sets: '3', reps: '20' },
      { name: 'Mountain Climbers', sets: '3', reps: '15' },
    ],
  },
  {
    day: 'Thursday',
    focus: 'Push Day',
    duration: '45 min',
    icon: 'arrow-up-outline',
    exercises: [
      { name: 'Incline Press', sets: '3', reps: '10-12' },
      { name: 'Chest Fly', sets: '3', reps: '12-15' },
      { name: 'Tricep Dips', sets: '3', reps: '10-12' },
      { name: 'Lateral Raises', sets: '3', reps: '12-15' },
    ],
  },
  {
    day: 'Friday',
    focus: 'Pull Day',
    duration: '45 min',
    icon: 'arrow-down-outline',
    exercises: [
      { name: 'Pull-ups', sets: '3', reps: '8-10' },
      { name: 'Lat Pulldown', sets: '3', reps: '10-12' },
      { name: 'Face Pulls', sets: '3', reps: '15' },
      { name: 'Hammer Curls', sets: '3', reps: '12-15' },
    ],
  },
  {
    day: 'Saturday',
    focus: 'Full Body',
    duration: '40 min',
    icon: 'fitness-outline',
    exercises: [
      { name: 'Deadlifts', sets: '3', reps: '8-10' },
      { name: 'Push-ups', sets: '3', reps: '15-20' },
      { name: 'Lunges', sets: '3', reps: '12/leg' },
      { name: 'Burpees', sets: '3', reps: '10' },
    ],
  },
  {
    day: 'Sunday',
    focus: 'Rest & Recovery',
    duration: '30 min',
    icon: 'bed-outline',
    exercises: [
      { name: 'Stretching', sets: '1', reps: '15 min' },
      { name: 'Light Walking', sets: '1', reps: '15 min' },
    ],
  },
];

export default function WorkoutPlans() {
  const colorScheme = useColorScheme();
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(null);
  const [completedExercises, setCompletedExercises] = useState<{[key: string]: boolean}>({});
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const theme = useMemo(() => {
    return colorScheme === 'dark' ? colors.dark : colors.light;
  }, [colorScheme]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning && activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeWorkout]);

  const openWorkoutDetails = (workout: WorkoutDay) => {
    setSelectedWorkout(workout);
  };

  const closeWorkoutDetails = () => {
    setSelectedWorkout(null);
  };

  const toggleExerciseCompletion = (day: string, exerciseIndex: number) => {
    const key = `${day}-${exerciseIndex}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const startWorkout = (workout: WorkoutDay) => {
    setActiveWorkout(workout);
    setCurrentExerciseIndex(0);
    setWorkoutTime(0);
    setIsTimerRunning(true);
  };

  const endWorkout = () => {
    setActiveWorkout(null);
    setCurrentExerciseIndex(0);
    setWorkoutTime(0);
    setIsTimerRunning(false);
  };

  const nextExercise = () => {
    if (activeWorkout && currentExerciseIndex < activeWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Last exercise completed - finish workout
      endWorkout();
    }
  };

  const completeWorkout = () => {
    // Finish workout and show completion
    endWorkout();
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />

      <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />

        {/* Active Workout Session */}
        {activeWorkout ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.activeWorkoutContainer}>
              {/* Timer Card */}
              <View style={[styles.timerCard, { backgroundColor: theme.cards }]}>
                <View style={styles.timerHeader}>
                  <Text style={[styles.workoutDayTitle, { color: theme.text }]}>
                    {activeWorkout.day} - {activeWorkout.focus}
                  </Text>
                  <Pressable onPress={endWorkout}>
                    <Ionicons name="close-circle" size={28} color={theme.text} />
                  </Pressable>
                </View>
                <Text style={[styles.timerDisplay, { color: theme.text }]}>
                  {formatTime(workoutTime)}
                </Text>
                <View style={styles.progressInfo}>
                  <Text style={[styles.progressText, { color: theme.subtitles }]}>
                    Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises.length}
                  </Text>
                </View>
              </View>

              {/* Current Exercise Card */}
              <View style={[styles.currentExerciseCard, { backgroundColor: theme.cards }]}>
                <Text style={[styles.currentExerciseLabel, { color: theme.subtitles }]}>
                  CURRENT EXERCISE
                </Text>
                <Text style={[styles.currentExerciseName, { color: theme.text }]}>
                  {activeWorkout.exercises[currentExerciseIndex].name}
                </Text>
                <View style={styles.exerciseDetailsContainer}>
                  <View style={styles.detailItem}>
                    <Ionicons name="repeat" size={24} color={theme.subtitles} />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {activeWorkout.exercises[currentExerciseIndex].sets} Sets
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="fitness" size={24} color={theme.subtitles} />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {activeWorkout.exercises[currentExerciseIndex].reps} Reps
                    </Text>
                  </View>
                </View>
              </View>

              {/* Next Exercises Preview */}
              {currentExerciseIndex < activeWorkout.exercises.length - 1 && (
                <View style={[styles.nextExercisesCard, { backgroundColor: theme.cards }]}>
                  <Text style={[styles.nextExercisesLabel, { color: theme.subtitles }]}>
                    UP NEXT
                  </Text>
                  {activeWorkout.exercises
                    .slice(currentExerciseIndex + 1, currentExerciseIndex + 3)
                    .map((exercise, idx) => (
                      <View key={idx} style={styles.nextExerciseItem}>
                        <Text style={[styles.nextExerciseNumber, { color: theme.subtitles }]}>
                          {currentExerciseIndex + idx + 2}.
                        </Text>
                        <Text style={[styles.nextExerciseName, { color: theme.text }]}>
                          {exercise.name}
                        </Text>
                        <Text style={[styles.nextExerciseDetails, { color: theme.subtitles }]}>
                          {exercise.sets} x {exercise.reps}
                        </Text>
                      </View>
                    ))}
                </View>
              )}

              {/* Workout Controls */}
              <View style={styles.workoutControls}>
                <Pressable
                  style={[styles.controlButton, { backgroundColor: theme.background }]}
                  onPress={toggleTimer}
                >
                  <Ionicons
                    name={isTimerRunning ? 'pause' : 'play'}
                    size={24}
                    color={theme.text}
                  />
                  <Text style={[styles.controlButtonText, { color: theme.text }]}>
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.controlButton, styles.nextButton, { backgroundColor: theme.buttons }]}
                  onPress={nextExercise}
                >
                  <Ionicons
                    name={currentExerciseIndex === activeWorkout.exercises.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
                    size={24}
                    color={theme.text}
                  />
                  <Text style={[styles.controlButtonText, { color: theme.text }]}>
                    {currentExerciseIndex === activeWorkout.exercises.length - 1
                      ? 'Complete Workout'
                      : 'Next Exercise'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        ) : selectedWorkout ? (
          // Workout Detail Page
          <View style={styles.fullScreen}>
            {/* Detail Header */}
            <View style={[styles.detailHeader, { backgroundColor: theme.background }]}>
              <Pressable onPress={closeWorkoutDetails} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </Pressable>
              <View style={styles.detailHeaderInfo}>
                <Text style={[styles.detailDay, { color: theme.text }]}>
                  {selectedWorkout.day}
                </Text>
                <Text style={[styles.detailFocus, { color: theme.subtitles }]}>
                  {selectedWorkout.focus}
                </Text>
              </View>
              <View style={styles.detailHeaderRight}>
                <Ionicons name={selectedWorkout.icon as any} size={24} color={theme.text} />
              </View>
            </View>

            {/* Workout Info Card */}
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.detailContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.workoutInfoCard, { backgroundColor: theme.cards }]}>
                <View style={styles.workoutInfoRow}>
                  <View style={styles.workoutInfoItem}>
                    <Ionicons name="time-outline" size={20} color={theme.subtitles} />
                    <Text style={[styles.workoutInfoText, { color: theme.text }]}>
                      {selectedWorkout.duration}
                    </Text>
                  </View>
                  <View style={styles.workoutInfoItem}>
                    <Ionicons name="fitness-outline" size={20} color={theme.subtitles} />
                    <Text style={[styles.workoutInfoText, { color: theme.text }]}>
                      {selectedWorkout.exercises.length} exercises
                    </Text>
                  </View>
                </View>
              </View>

              {/* Start Workout Button */}
              {selectedWorkout.focus !== 'Rest & Recovery' && (
                <Pressable
                  style={[styles.startWorkoutButtonLarge, { backgroundColor: theme.buttons }]}
                  onPress={() => startWorkout(selectedWorkout)}
                >
                  <Ionicons name="play-circle" size={24} color={theme.text} />
                  <Text style={[styles.startWorkoutTextLarge, { color: theme.text }]}>
                    Start Workout
                  </Text>
                </Pressable>
              )}

              {/* Exercises List */}
              <Text style={[styles.exercisesTitle, { color: theme.text }]}>
                Exercises
              </Text>

              <View style={[styles.exercisesContainer, { backgroundColor: theme.cards }]}>
                {selectedWorkout.exercises.map((exercise, idx) => {
                  const exerciseKey = `${selectedWorkout.day}-${idx}`;
                  const isCompleted = completedExercises[exerciseKey];

                  return (
                    <Pressable
                      key={idx}
                      style={[
                        styles.exerciseRow,
                        idx !== selectedWorkout.exercises.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: theme.subtitles + '15'
                        },
                        isCompleted && styles.completedRow,
                      ]}
                      onPress={() => toggleExerciseCompletion(selectedWorkout.day, idx)}
                    >
                      <View style={styles.exerciseContent}>
                        <View style={styles.exerciseLeftSide}>
                          <View style={[styles.exerciseNumberBadge, {
                            backgroundColor: isCompleted ? '#4CAF50' : theme.background
                          }]}>
                            <Text style={[styles.exerciseNumberText, {
                              color: isCompleted ? '#fff' : theme.text
                            }]}>
                              {idx + 1}
                            </Text>
                          </View>
                          <View style={styles.exerciseInfo}>
                            <Text
                              style={[
                                styles.exerciseName,
                                { color: theme.text },
                                isCompleted && styles.completedText,
                              ]}
                            >
                              {exercise.name}
                            </Text>
                            <Text style={[styles.exerciseReps, { color: theme.subtitles }]}>
                              {exercise.sets} sets × {exercise.reps} reps
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                          size={24}
                          color={isCompleted ? '#4CAF50' : theme.subtitles + '60'}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ) : (
          // Workout List
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Minimalist Header */}
            <View style={styles.pageHeader}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>Workout Plans</Text>
              <Text style={[styles.pageSubtitle, { color: theme.subtitles }]}>
                7-day schedule • {weeklyPlan.filter(w => w.focus !== 'Rest & Recovery').length} active workouts
              </Text>
            </View>

            {/* Workout Days */}
            {weeklyPlan.map((workout, index) => {
              const isRestDay = workout.focus === 'Rest & Recovery';

              return (
                <Pressable
                  key={workout.day}
                  style={[
                    styles.dayCard,
                    { backgroundColor: theme.cards },
                    isRestDay && styles.restDayCard,
                    styles.dayContainer,
                  ]}
                  onPress={() => openWorkoutDetails(workout)}
                >
                  <View style={styles.dayCardMain}>
                    <View style={styles.dayCardLeft}>
                      <View style={styles.dayTitleRow}>
                        <Text style={[styles.dayName, { color: theme.text }]}>
                          {workout.day}
                        </Text>
                        <Ionicons name={workout.icon as any} size={18} color={theme.subtitles} />
                      </View>
                      <Text style={[styles.dayFocus, { color: theme.subtitles }]}>
                        {workout.focus} • {workout.exercises.length} exercises
                      </Text>
                    </View>

                    <View style={styles.dayCardRight}>
                      <View style={[styles.durationChip, { backgroundColor: theme.background }]}>
                        <Text style={[styles.durationText, { color: theme.text }]}>
                          {workout.duration}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={theme.subtitles}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },

  // Page Header
  pageHeader: {
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  // Detail Page
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  detailHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  detailDay: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  detailFocus: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  detailHeaderRight: {
    padding: 4,
  },
  detailContentContainer: {
    padding: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  workoutInfoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  workoutInfoRow: {
    flexDirection: 'row',
    gap: 24,
  },
  workoutInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutInfoText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  startWorkoutButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 28,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  startWorkoutTextLarge: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  // Active Workout Session
  activeWorkoutContainer: {
    flex: 1,
  },
  timerCard: {
    borderRadius: 20,
    padding: 28,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutDayTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    flex: 1,
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -2,
    marginVertical: 20,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  currentExerciseCard: {
    borderRadius: 20,
    padding: 28,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  currentExerciseLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
    opacity: 0.7,
  },
  currentExerciseName: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  exerciseDetailsContainer: {
    flexDirection: 'row',
    gap: 28,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  nextExercisesCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  nextExercisesLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 14,
    opacity: 0.7,
  },
  nextExerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 14,
  },
  nextExerciseNumber: {
    fontSize: 13,
    fontWeight: '700',
    width: 20,
    opacity: 0.6,
  },
  nextExerciseName: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.1,
    flex: 1,
  },
  nextExerciseDetails: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  workoutControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  nextButton: {
    flex: 1.5,
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  // Day Cards
  dayContainer: {
    marginBottom: 14,
  },
  dayCard: {
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  restDayCard: {
    opacity: 0.6,
  },
  dayCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayCardLeft: {
    flex: 1,
    gap: 6,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  dayFocus: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  dayCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  // Exercises List
  exercisesContainer: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  exerciseRow: {
    padding: 16,
  },
  completedRow: {
    opacity: 0.6,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  exerciseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  exerciseReps: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});
