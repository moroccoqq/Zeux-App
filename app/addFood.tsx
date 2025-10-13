import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../data/colors.json';

export default function AddFood() {
  const colorScheme = useColorScheme();

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

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
        }} 
      />
      
      <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <View style={styles.container}>
          <View style={[styles.chooseImageType, { backgroundColor: theme.cards }]}>
            <Pressable style={styles.imageType} >
              <Ionicons name="camera" size={24} color={theme.text} />
            </Pressable>
            <Pressable style={styles.imageType} >
              <Ionicons name="image" size={24} color={theme.text} />
            </Pressable>
            <Pressable style={styles.imageType} >
              <Ionicons name="pencil" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.imageWrapper}>
            <View style={[styles.corner, styles.topLeft, { borderColor: theme.text }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: theme.text }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.text }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: theme.text }]} />
          </View>

          <Pressable 
            onPress={() => console.log('Add Food Pressed')} 
            style={[styles.pressable, { borderColor: theme.text }]}
          >
            <Ionicons name="ellipse" size={50} color={theme.text} />
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  )
}

const CORNER_SIZE = 40;
const BORDER_WIDTH = 3;
const RADIUS = 25;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 3,
    width: 57,
    marginTop: 60
  },
  imageWrapper: {
    position: 'relative',
    width: 300,
    height: 450,
    marginBottom: 10,
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderWidth: BORDER_WIDTH,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: RADIUS,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: RADIUS,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: RADIUS,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: RADIUS,
  },
  chooseImageType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 10,
    marginBottom: 30,
  },
  imageType: {
    padding: 10
  }
});