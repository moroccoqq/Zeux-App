import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
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

export default function AddFood() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const cameraRef = useRef<CameraView>(null);
  const { addFood } = useData();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Form state
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setCapturedImage(photo.uri);
          setShowCamera(false);
        }
      } catch {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      setShowCamera(false);
    }
  };

  const openCamera = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        return;
      }
    }

    setShowCamera(true);
  };

  const handleSave = () => {
    if (!foodName || !calories) {
      Alert.alert('Error', 'Please fill in food name and calories');
      return;
    }

    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Save food to context
    addFood({
      name: foodName,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
      time: timeString,
      image: capturedImage || undefined,
    });

    Alert.alert(
      'Success',
      'Food logged successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  // Camera View
  if (showCamera) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <SafeAreaView style={[styles.fullScreen, { backgroundColor: '#000' }]} edges={['top']}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View style={styles.cameraHeader}>
              <Pressable onPress={() => setShowCamera(false)} style={styles.cameraButton}>
                <Ionicons name="close" size={32} color="#fff" />
              </Pressable>
              <Pressable onPress={toggleCameraFacing} style={styles.cameraButton}>
                <Ionicons name="camera-reverse" size={32} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.cameraFooter}>
              <Pressable onPress={takePicture} style={styles.captureButton}>
                <View style={styles.captureButtonInner} />
              </Pressable>
            </View>
          </CameraView>
        </SafeAreaView>
      </>
    );
  }

  // Main Form View
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
              Add Food
            </Text>
          ),
        }}
      />

      <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Image Section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Food Photo</Text>
          <View style={[styles.imageContainer, { backgroundColor: theme.cards }]}>
            {capturedImage ? (
              <>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                <Pressable onPress={retakePhoto} style={styles.retakeButton}>
                  <Ionicons name="refresh" size={20} color={theme.text} />
                  <Text style={[styles.retakeText, { color: theme.text }]}>Retake Photo</Text>
                </Pressable>
              </>
            ) : (
              <View style={styles.imageOptions}>
                <Pressable
                  style={[styles.imageOption, { backgroundColor: theme.buttons }]}
                  onPress={openCamera}
                >
                  <Ionicons name="camera" size={32} color={theme.text} />
                  <Text style={[styles.imageOptionText, { color: theme.text }]}>Camera</Text>
                </Pressable>
                <Pressable
                  style={[styles.imageOption, { backgroundColor: theme.buttons }]}
                  onPress={pickImage}
                >
                  <Ionicons name="image" size={32} color={theme.text} />
                  <Text style={[styles.imageOptionText, { color: theme.text }]}>Gallery</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Food Information Form */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Food Information</Text>

          {/* Food Name */}
          <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
            <Ionicons name="restaurant-outline" size={20} color={theme.subtitles} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Food name"
              placeholderTextColor={theme.subtitles}
              value={foodName}
              onChangeText={setFoodName}
            />
          </View>

          {/* Calories */}
          <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
            <Ionicons name="flame-outline" size={20} color={theme.subtitles} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Calories (kcal)"
              placeholderTextColor={theme.subtitles}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          {/* Macros Section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Macros (Optional)</Text>
          <View style={styles.macrosRow}>
            <View style={styles.macroInput}>
              <Text style={[styles.macroLabel, { color: colors.calorietypes.protein }]}>Protein</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="0g"
                  placeholderTextColor={theme.subtitles}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.macroInput}>
              <Text style={[styles.macroLabel, { color: colors.calorietypes.carbs }]}>Carbs</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="0g"
                  placeholderTextColor={theme.subtitles}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.macroInput}>
              <Text style={[styles.macroLabel, { color: colors.calorietypes.fat }]}>Fats</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.cards }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="0g"
                  placeholderTextColor={theme.subtitles}
                  value={fats}
                  onChangeText={setFats}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, { backgroundColor: theme.buttons }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={24} color={theme.text} />
            <Text style={[styles.saveButtonText, { color: theme.text }]}>Save Food</Text>
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
  imageContainer: {
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageOptions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  imageOption: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 8,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 12,
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
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroInput: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
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
  // Camera styles
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});