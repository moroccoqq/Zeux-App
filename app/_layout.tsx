import { Stack } from "expo-router";
import { DataProvider } from "../contexts/DataContext";

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addFood"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="addTraining"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="addTrainingAI"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="AllWeekTrainings"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
    </DataProvider>
  );
}