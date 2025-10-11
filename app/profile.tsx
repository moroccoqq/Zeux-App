import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#d9d3ce",
          },
          headerTintColor: "#41331b",
          headerTitle: "Profile",
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Profile</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d3ce",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#41331b",
    marginBottom: 16,
  },
});