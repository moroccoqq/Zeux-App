import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<{[key: string]: boolean}>({});
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [customNames, setCustomNames] = useState<{[key: string]: string}>({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const theme = useMemo(() => {
    return colorScheme === 'dark' ? colors.dark : colors.light;
  }, [colorScheme]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeWorkout]);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
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
      endWorkout();
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openEditModal = (day: string, currentName: string) => {
    setEditingDay(day);
    setTempName(customNames[day] || currentName);
    setEditModalVisible(true);
  };

  const saveWorkoutName = () => {
    if (editingDay && tempName.trim()) {
      setCustomNames(prev => ({
        ...prev,
        [editingDay]: tempName.trim()
      }));
    }
    setEditModalVisible(false);
    setEditingDay(null);
    setTempName('');
  };

  const getWorkoutName = (day: string) => {
    return customNames[day] || day;
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
          headerRight: () => (
            <Text style={{ color: theme.text, fontSize: 21, fontWeight: '600', marginRight: 10 }}>
              Workout Plans
            </Text>
          ),
        }}
      />

      <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Workout Session */}
          {activeWorkout ? (
            <View style={styles.activeWorkoutContainer}>
              {/* Timer Card */}
              <View style={[styles.timerCard, { backgroundColor: theme.cards }]}>
                <View style={styles.timerHeader}>
                  <Text style={[styles.workoutDayTitle, { color: theme.text }]}>
                    {getWorkoutName(activeWorkout.day)} - {activeWorkout.focus}
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
                    size={28}
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
                  <Ionicons name="arrow-forward" size={28} color={theme.text} />
                  <Text style={[styles.controlButtonText, { color: theme.text }]}>
                    {currentExerciseIndex === activeWorkout.exercises.length - 1
                      ? 'Finish'
                      : 'Next Exercise'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Header Card */}
              <View style={[styles.headerCard, { backgroundColor: theme.cards }]}>
                <View style={styles.headerContent}>
                  <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Weekly Plan</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.subtitles }]}>
                      7 Day Workout Schedule
                    </Text>
                  </View>
                  <View style={[styles.iconCircle, { backgroundColor: theme.background }]}>
                    <Ionicons name="calendar-outline" size={28} color={theme.text} />
                  </View>
                </View>
              </View>

              {/* Workout Days */}
              {weeklyPlan.map((workout, index) => {
                const isExpanded = expandedDay === workout.day;
                const isRestDay = workout.focus === 'Rest & Recovery';

                return (
                  <View key={workout.day} style={styles.dayContainer}>
                    <Pressable
                      style={[
                        styles.dayCard,
                        { backgroundColor: theme.cards },
                        isRestDay && { opacity: 0.7 },
                      ]}
                      onPress={() => toggleDay(workout.day)}
                    >
                      <View style={styles.dayHeader}>
                        <View style={[styles.dayIconContainer, { backgroundColor: theme.background }]}>
                          <Ionicons name={workout.icon as any} size={24} color={theme.text} />
                        </View>

                        <View style={styles.dayInfo}>
                          <View style={styles.dayNameRow}>
                            <Text style={[styles.dayName, { color: theme.text }]}>
                              {getWorkoutName(workout.day)}
                            </Text>
                            <Pressable
                              onPress={(e) => {
                                e.stopPropagation();
                                openEditModal(workout.day, workout.day);
                              }}
                              style={styles.editButton}
                            >
                              <Ionicons name="pencil" size={16} color={theme.subtitles} />
                            </Pressable>
                          </View>
                          <Text style={[styles.dayFocus, { color: theme.subtitles }]}>
                            {workout.focus}
                          </Text>
                        </View>

                        <View style={styles.dayMeta}>
                          <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={14} color={theme.subtitles} />
                            <Text style={[styles.durationText, { color: theme.subtitles }]}>
                              {workout.duration}
                            </Text>
                          </View>
                          <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={theme.text}
                          />
                        </View>
                      </View>
                    </Pressable>

                    {/* Start Workout Button */}
                    {isExpanded && !isRestDay && (
                      <Pressable
                        style={[styles.startWorkoutButton, { backgroundColor: theme.buttons }]}
                        onPress={() => startWorkout(workout)}
                      >
                        <Ionicons name="play-circle" size={20} color={theme.text} />
                        <Text style={[styles.startWorkoutText, { color: theme.text }]}>
                          Start Workout
                        </Text>
                      </Pressable>
                    )}

                    {/* Expanded Exercises */}
                    {isExpanded && (
                      <View style={[styles.exercisesContainer, { backgroundColor: theme.background }]}>
                        {workout.exercises.map((exercise, idx) => {
                          const exerciseKey = `${workout.day}-${idx}`;
                          const isCompleted = completedExercises[exerciseKey];

                          return (
                            <View
                              key={idx}
                              style={[
                                styles.exerciseRow,
                                idx !== workout.exercises.length - 1 && styles.exerciseBorder,
                                { borderBottomColor: theme.borders },
                                isCompleted && { opacity: 0.6 },
                              ]}
                            >
                              <View style={styles.exerciseLeft}>
                                <View style={[styles.exerciseNumber, { backgroundColor: theme.cards }]}>
                                  <Text style={[styles.exerciseNumberText, { color: theme.text }]}>
                                    {idx + 1}
                                  </Text>
                                </View>
                                <Text
                                  style={[
                                    styles.exerciseName,
                                    { color: theme.text },
                                    isCompleted && styles.completedText,
                                  ]}
                                >
                                  {exercise.name}
                                </Text>
                              </View>
                              <View style={styles.exerciseRight}>
                                <Text style={[styles.exerciseDetails, { color: theme.subtitles }]}>
                                  {exercise.sets} x {exercise.reps}
                                </Text>
                                <Pressable
                                  onPress={() => toggleExerciseCompletion(workout.day, idx)}
                                  style={styles.checkButton}
                                >
                                  <Ionicons
                                    name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                                    size={28}
                                    color={isCompleted ? '#4CAF50' : theme.subtitles}
                                  />
                                </Pressable>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Edit Workout Name Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: theme.cards }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Workout Name
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.borders,
                },
              ]}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter workout name"
              placeholderTextColor={theme.subtitles}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.background }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.buttons }]}
                onPress={saveWorkoutName}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    marginTop: 8,
    gap: 8,
  },
  startWorkoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeWorkoutContainer: {
    flex: 1,
  },
  timerCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  timerDisplay: {
    fontSize: 56,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  currentExerciseCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentExerciseLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  currentExerciseName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  exerciseDetailsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextExercisesCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextExercisesLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  nextExerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  nextExerciseNumber: {
    fontSize: 14,
    fontWeight: '600',
    width: 24,
  },
  nextExerciseName: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  nextExerciseDetails: {
    fontSize: 13,
  },
  workoutControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButton: {
    flex: 1.5,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayContainer: {
    marginBottom: 12,
  },
  dayCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayFocus: {
    fontSize: 14,
  },
  dayMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 13,
  },
  exercisesContainer: {
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  exerciseBorder: {
    borderBottomWidth: 1,
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  exerciseRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseDetails: {
    fontSize: 13,
    fontWeight: '500',
  },
  checkButton: {
    padding: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  dayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1.2,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
