import { useRouter } from 'expo-router';
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../data/colors.json";

type Training = {
  type: string;
  duration: string;
  kcal: string;
};

const data = {
  cal: { today: 800 },
  kcal: { today: 700 },
  startvalues: { cal: 1200, kcal: 1000 },
};

export default function Analytics() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("yesterday");

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const yesterdayTrainings: Training[] = [
    { type: "💪 Strength", duration: "30 min", kcal: "300" },
    { type: "🏃 Run", duration: "10 km", kcal: "400" },
    { type: "🧘 Yoga", duration: "20 min", kcal: "200" },
  ];

  const weekTrainings: Training[] = [
    { type: "💪 Strength", duration: "30 min", kcal: "300" },
    { type: "🏃 Run", duration: "5 km", kcal: "250" },
    { type: "🧘 Yoga", duration: "40 min", kcal: "200" },
  ];

  const monthTrainings: Training[] = [
    { type: "🚴 Cycling", duration: "1 hour", kcal: "500" },
    { type: "🏊 Swimming", duration: "30 min", kcal: "350" },
    { type: "🏋️‍♀️ CrossFit", duration: "45 min", kcal: "450" },
    { type: "🏃‍♂️ Jogging", duration: "5 km", kcal: "500" },
    { type: "🧗‍♀️ Climbing", duration: "1 hour", kcal: "600" },
    { type: "🏋️‍♂️ Weightlifting", duration: "1 hour", kcal: "650" },
    { type: "🏃‍♀️ Sprinting", duration: "20 min", kcal: "300" },
    { type: "🚴‍♂️ Spinning", duration: "45 min", kcal: "400" },
    { type: "🧘‍♂️ Meditation", duration: "30 min", kcal: "100" },
    { type: "🏄 Surfing", duration: "1 hour", kcal: "700" },
  ];

  const renderTrainingList = (title: string, data: Training[]) => (
    <View style={[styles.cardFullWidth, { backgroundColor: theme.cards }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      {data.map((t, i) => (
        <View
          key={i}
          style={[styles.trainingRow, { backgroundColor: theme.trainingrows }]}
        >
          <Text style={[styles.trainingText, { color: theme.text }]}>{t.type}</Text>
          <Text style={[styles.trainingText, { color: theme.text }]}>{t.duration}</Text>
          <Text style={[styles.trainingText, { color: theme.text }]}>{t.kcal} kcal</Text>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (selectedPeriod) {
      case "yesterday":
        return (
          <View style={styles.mainContentWrapper}>
            <View style={styles.rowWrapper}>
              <View style={[styles.card, { backgroundColor: theme.cards }]}>
                <CircularProgress
                  value={Math.min(data.cal.today, data.startvalues.cal)}
                  maxValue={data.startvalues.cal}
                  activeStrokeWidth={14}
                  inActiveStrokeWidth={10}
                  inActiveStrokeOpacity={0.2}
                  radius={60}
                  duration={1000}
                  activeStrokeColor={theme.chart}
                  inActiveStrokeColor={theme.inactivechart}
                />
                <Text style={[styles.cardValue, { color: theme.text }]}>
                  {data.cal.today} / {data.startvalues.cal}
                </Text>
                <Text style={[styles.cardLabel, { color: theme.text }]}>
                  Calories eaten 🍱
                </Text>
              </View>
              <View style={[styles.card, { backgroundColor: theme.cards }]}>
                <CircularProgress
                  value={Math.min(data.kcal.today, data.startvalues.kcal)}
                  maxValue={data.startvalues.kcal}
                  activeStrokeWidth={14}
                  inActiveStrokeWidth={10}
                  inActiveStrokeOpacity={0.2}
                  radius={60}
                  duration={1000}
                  activeStrokeColor={theme.chart}
                  inActiveStrokeColor={theme.inactivechart}
                />
                <Text style={[styles.cardValue, { color: theme.text }]}>
                  {data.kcal.today} / {data.startvalues.kcal}
                </Text>
                <Text style={[styles.cardLabel, { color: theme.text }]}>
                  Calories burned 🔥
                </Text>
              </View>
            </View>
            {renderTrainingList("Yesterday's Trainings 🏋️‍♀️", yesterdayTrainings)}
          </View>
        );

      case "week":
        return (
          <View style={styles.mainContentWrapper}>
            {renderTrainingList("This Week's Trainings 📆", weekTrainings)}
            <Pressable
              style={{
                marginTop: 12,
                backgroundColor: theme.buttons,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                boxShadow: "0 6px 6px rgba(0, 0, 0, 0.1)",
              }}
              onPress={() => router.navigate("/AllWeekTrainings")}
            >
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}>
                Show All Trainings
              </Text>
            </Pressable>
          </View>
        );

      case "month":
        return (
          <View style={styles.mainContentWrapper}>
            {renderTrainingList("This Month's Trainings 🗓️", monthTrainings)}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.fullScreen, { backgroundColor: theme.background }]}
      edges={["left", "right", "bottom"]} // ✅ фикс: не учитываем верхний safe area
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.timebuttons}>
          {["yesterday", "week", "month"].map((period) => (
            <Pressable
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={({ pressed }) => [
                styles.links,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text
                style={[
                  styles.linkText,
                  { color: theme.text },
                  selectedPeriod === period && { fontWeight: "600" },
                ]}
              >
                {period[0].toUpperCase() + period.slice(1)}
              </Text>
              {selectedPeriod === period && (
                <View
                  style={[
                    styles.activePeriodIndicator,
                    { backgroundColor: theme.text },
                  ]}
                />
              )}
            </Pressable>
          ))}
        </View>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  mainContentWrapper: { margin: 12 },
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  card: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
  },
  cardFullWidth: {
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    marginBottom: 20,
    paddingTop: 20,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  cardLabel: {
    fontSize: 18,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  trainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
  },
  trainingText: {
    fontSize: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  timebuttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginBottom: 20,
  },
  links: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    fontSize: 18,
  },
  activePeriodIndicator: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});