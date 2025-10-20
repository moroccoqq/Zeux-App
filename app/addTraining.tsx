import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../data/colors.json';

export default function AddTraining() {
  const colorScheme = useColorScheme();

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const days = ['Monday', 'Tuesday', 'Wednesday'];
  const bodyParts = ['Upper Body', 'Lower Body', 'Full Body'];
  const durations = ['30 mins', '45 mins', '60 mins'];
  const exercisesCount = [7, 5, 8];
  const images = [
    require('../assets/images/green.png'),
    require('../assets/images/green.png'),
    require('../assets/images/green.png'),
  ];

  function trainingView(day: string, image: any, bodyPart: string, duration: string, exercises: number) {
    return (
      <View key={day}>
        <Text style={[styles.day, { color: theme.text }]}>{day}</Text>

        <View style={[styles.training, { backgroundColor: theme.cards }]}>
          <Image source={image} style={styles.image} />

          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text style={[styles.text, { color: theme.text }]}>{bodyPart}</Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={[styles.text, { color: theme.text, paddingRight: 10 }]}>{duration}</Text>
              <Text style={[styles.text, { color: theme.text }]}>{exercises} exercises</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

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
          headerRight: () => (<Text style={{ color: theme.text, fontSize: 21, fontWeight: '600', marginRight: 10 }}>Weekly Plan</Text>),
        }} 
      />
      
      <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <View style={styles.trainingView}>
          {days.map((day, index) => (
            trainingView(day, images[index], bodyParts[index], durations[index], exercisesCount[index])
          ))}
        </View>
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
    padding: 15,
  },
  day: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 20,
  },
  training: {
    borderRadius: 10,
    flexDirection: 'row',
    padding: 12,
    marginTop: 15,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  trainingView: {
    flex: 1,
    padding: 15,
  },
});
