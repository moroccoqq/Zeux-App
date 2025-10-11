import { useMemo } from "react";
import {
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

const data = {
  cal: { today: 1500 },
  kcal: { today: 450 },
  startvalues: {
    cal: 2000,
    kcal: 500,
  },
};

export default function Home() {
  const colorScheme = useColorScheme();

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  return (
    <View style={[styles.fullScreen, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        translucent={false}
      />
      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardGroupWrapper}>
            <View style={styles.rowWrapper}>
              <View style={[styles.card, { backgroundColor: theme.cards }]}>
                <CircularProgress
                  value={Math.min(data.cal.today, data.startvalues.cal)}
                  activeStrokeWidth={14}
                  inActiveStrokeWidth={10}
                  inActiveStrokeOpacity={0.2}
                  radius={60}
                  duration={1000}
                  maxValue={data.startvalues.cal}
                  activeStrokeColor={theme.chart}
                  inActiveStrokeColor={theme.inactivechart}
                />
                <Text style={[styles.cardValue, { color: theme.text }]}>
                  {data.cal.today} / {data.startvalues.cal}
                </Text>
                <Text style={[styles.cardLabel, { color: theme.subtitles }]}>
                  Calories eaten 🍱
                </Text>
              </View>

              <View style={[styles.card, { backgroundColor: theme.cards }]}>
                <CircularProgress
                  value={Math.min(data.kcal.today, data.startvalues.kcal)}
                  activeStrokeWidth={14}
                  inActiveStrokeWidth={10}
                  inActiveStrokeOpacity={0.2}
                  radius={60}
                  duration={1000}
                  maxValue={data.startvalues.kcal}
                  activeStrokeColor={theme.chart}
                  inActiveStrokeColor={theme.inactivechart}
                />
                <Text style={[styles.cardValue, { color: theme.text }]}>
                  {data.kcal.today} / {data.startvalues.kcal}
                </Text>
                <Text style={[styles.cardLabel, { color: theme.subtitles }]}>
                  Calories burned 🔥
                </Text>
              </View>
            </View>

            <View style={[styles.cardFullWidth, { backgroundColor: theme.cards }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Today's Trainings 🏋️‍♀️
              </Text>

              <View
                style={[styles.trainingRow, { backgroundColor: theme.trainingrows }]}
              >
                <Text style={[styles.trainingType, { color: theme.text }]}>
                  💪 Strength
                </Text>
                <Text style={[styles.trainingTime, { color: theme.text }]}>
                  45 min
                </Text>
                <Text style={[styles.trainingKcal, { color: theme.text }]}>
                  300 kcal
                </Text>
              </View>

              <View
                style={[styles.trainingRow, { backgroundColor: theme.trainingrows }]}
              >
                <Text style={[styles.trainingType, { color: theme.text }]}>
                  🏃‍♂️ Cardio
                </Text>
                <Text style={[styles.trainingTime, { color: theme.text }]}>
                  30 min
                </Text>
                <Text style={[styles.trainingKcal, { color: theme.text }]}>
                  400 kcal
                </Text>
              </View>

              <View
                style={[styles.trainingRow, { backgroundColor: theme.trainingrows }]}
              >
                <Text style={[styles.trainingType, { color: theme.text }]}>
                  🧘 Yoga
                </Text>
                <Text style={[styles.trainingTime, { color: theme.text }]}>
                  60 min
                </Text>
                <Text style={[styles.trainingKcal, { color: theme.text }]}>
                  200 kcal
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardGroupWrapper: {
    flex: 1,
    gap: 10,
  },
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
  },
  cardFullWidth: {
    borderRadius: 20,
    padding: 15,
    marginTop: 7,
    elevation: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  cardLabel: {
    fontSize: 20,
    marginTop: 4,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  trainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    elevation: 2,
  },
  trainingType: {
    flex: 2,
    fontSize: 18,
  },
  trainingTime: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
  },
  trainingKcal: {
    flex: 1,
    fontSize: 18,
    textAlign: "right",
  },
});
