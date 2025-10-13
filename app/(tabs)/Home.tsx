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

  type CalorieType = keyof typeof colors.calorietypes;

  const moreInfoCards = (
    value: number,
    type: string,
    maxValue: number,
    colortypes: CalorieType
  ) => {
    const unactivecolor =
      colors.calorietypes[colortypes + "unactive" as CalorieType];
    return (
      <View style={[styles.moreInfoCard, { backgroundColor: theme.cards }]}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: 15,
          }}
        >
          <Text style={[{ color: theme.text, fontSize: 20 }]}>{value}g</Text>

          <Text style={{ color: theme.text, fontSize: 16 }}>
            {type}{" "}
            <Text
              style={{
                fontWeight: "600",
                color: theme.text,
                fontSize: 16,
              }}
            >
              left
            </Text>
          </Text>
        </View>

        <CircularProgress
          value={value}
          activeStrokeWidth={10}
          inActiveStrokeWidth={6}
          inActiveStrokeOpacity={0.2}
          radius={40}
          duration={1000}
          maxValue={maxValue}
          activeStrokeColor={colors.calorietypes[colortypes]}
          inActiveStrokeColor={unactivecolor}
          titleStyle={{ fontSize: 16, color: theme.text }}
          titleColor={theme.text}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.fullScreen, { backgroundColor: theme.background }]}
      edges={["left", "right", "bottom"]} // ✅ фикс: игнорируем верхний safe area
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.infoCard, { backgroundColor: theme.cards }]}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              marginLeft: 7,
              justifyContent: "center",
            }}
          >
            <Text style={[styles.cardValue, { color: theme.text }]}>
              {data.cal.today} / {data.startvalues.cal}
            </Text>

            <Text style={[styles.cardLabel, { color: theme.subtitles }]}>
              Calories eaten 🍱
            </Text>
          </View>

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
        </View>

        <View style={styles.moreInfoCardRow}>
          {moreInfoCards(255, "Protein", 255, "protein")}
          {moreInfoCards(250, "Carbs", 300, "carbs")}
          {moreInfoCards(20, "Fats", 70, "fat")}
        </View>

        <View
          style={[styles.infoCard, { backgroundColor: theme.cards }]}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              marginLeft: 7,
              justifyContent: "center",
            }}
          >
            <Text style={[styles.cardValue, { color: theme.text }]}>
              {data.kcal.today} / {data.startvalues.kcal}
            </Text>

            <Text style={[styles.cardLabel, { color: theme.subtitles }]}>
              Calories burned 🔥
            </Text>
          </View>

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoCard: {
    borderRadius: 20,
    padding: 15,
    marginTop: 7,
    boxShadow:
      "0 0px 12px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 6px hsla(0, 0%, 28%, 0.2)",
    justifyContent: "center",
    flexDirection: "row",
  },
  moreInfoCard: {
    borderRadius: 20,
    padding: 14,
    marginTop: 15,
    elevation: 5,
    flexDirection: "column",
    marginBottom: 9,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  moreInfoCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  cardLabel: {
    fontSize: 20,
    marginTop: 4,
    textAlign: "left",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
});