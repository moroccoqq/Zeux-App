import { navigate } from "expo-router/build/global-state/routing";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../data/colors.json";

interface AddButton {
  emoji: ImageSourcePropType;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function Add() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = colors[colorScheme];

  const addButtons: AddButton[] = [
    {
      emoji: require("../../assets/images/apple.png"),
      title: "Add Food",
      subtitle: "Add Food with AI",
      onPress: () => navigate("/addFood"),
    },
    {
      emoji: require("../../assets/images/gantelya.png"),
      title: "Add Training",
      subtitle: "Add a training",
      onPress: () => navigate("/addTraining"),
    },
    {
      emoji: require("../../assets/images/ai.png"),
      title: "Generate Training",
      subtitle: "Generate a training with AI",
      onPress: () => navigate("/addTrainingAI"),
    },
  ];

  return (
    <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <View style={styles.container}>
        {addButtons.map((button, index) => (
          <Pressable
            key={index}
            style={[
              styles.addButton,
              {
                backgroundColor: theme.buttons,
              },
            ]}
            onPress={button.onPress}
          >
            <View style={styles.row}>
              <Image source={button.emoji} style={styles.emoji} />
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]}>{button.title}</Text>
                <Text style={[styles.subtitle, { color: theme.subtitles }]}>
                  {button.subtitle}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: theme.text }]}>›</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  addButton: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
  },
});
