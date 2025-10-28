import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../data/colors.json';
import { useData } from '../contexts/DataContext';

export default function AddTraining() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { addTraining } = useData();
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedType, setSelectedType] = useState<string>('strength');

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const trainingTypes = [
    { id: 'strength', icon: 'barbell-outline', label: 'Strength' },
    { id: 'cardio', icon: 'flash-outline', label: 'Cardio' },
    { id: 'yoga', icon: 'body-outline', label: 'Yoga' },
    { id: 'sports', icon: 'football-outline', label: 'Sports' },
  ];

  const handleSave = () => {
    if (!exerciseName || !duration) {
      Alert.alert('Error', 'Please fill in exercise name and duration');
      return;
    }

    // Save training to context
    addTraining({
      name: exerciseName,
      type: selectedType,
      duration: duration,
      calories: parseInt(calories) || 0,
      notes: notes || undefined,
    });

    Alert.alert(
      'Success',
      'Training logged successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitle: "",
          headerShadowVisible: false,
          headerRight: () => (
            <Text style={{ color: theme.text, fontSize: 21, fontWeight: '600', marginRight: 10 }}>
              Add Training
            </Text>
          ),
        }}
      />

      <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Training Type Selection */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Training Type</Text>
          <View style={styles.typeContainer}>
            {trainingTypes.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.typeButton,
                  { backgroundColor: theme.cards },
                  selectedType === type.id && { backgroundColor: theme.buttons, opacity: 0.8 },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={theme.text}
                />
                <Text style={[styles.typeLabel, { color: theme.text }]}>{type.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Exercise Name */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercise Name</Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
            <Ionicons name="fitness-outline" size={20} color={theme.subtitles} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g., Bench Press, Running"
              placeholderTextColor={theme.subtitles}
              value={exerciseName}
              onChangeText={setExerciseName}
            />
          </View>

          {/* Duration and Calories Row */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Duration</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
                <Ionicons name="time-outline" size={20} color={theme.subtitles} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="30 mins"
                  placeholderTextColor={theme.subtitles}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="default"
                />
              </View>
            </View>

            <View style={styles.halfWidth}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Calories</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
                <Ionicons name="flame-outline" size={20} color={theme.subtitles} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="250"
                  placeholderTextColor={theme.subtitles}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes (Optional)</Text>
          <View style={[styles.textAreaContainer, { backgroundColor: theme.cards }]}>
            <TextInput
              style={[styles.textArea, { color: theme.text }]}
              placeholder="Add any notes about your workout..."
              placeholderTextColor={theme.subtitles}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, { backgroundColor: theme.buttons }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={24} color={theme.text} />
            <Text style={[styles.saveButtonText, { color: theme.text }]}>Save Training</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  textAreaContainer: {
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    fontSize: 16,
    minHeight: 80,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
