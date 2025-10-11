import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddFood() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerStyle: {
            backgroundColor: "#d9d3ce",
          },
          headerTintColor: "#41331b",
          headerTitle: "Add Training",
          headerShadowVisible: false, 
        }} 
      />
      
      <SafeAreaView style={styles.fullScreen}>
        <View style={styles.container}>
          <Text style={styles.heading}>Add Training</Text>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#d9d3ce',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#41331b',
  },
});