import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../data/colors.json";

type Training = {
  type: string;
  duration: string;
  kcal: number;
  date?: string;
};

type DayData = {
  calories: number;
  burned: number;
  protein: number;
  carbs: number;
  fat: number;
  trainings: Training[];
};

type WeekData = {
  [key: string]: DayData;
};

// Sample data - replace with real data from your backend/storage
const weekData: WeekData = {
  Mon: {
    calories: 2100,
    burned: 450,
    protein: 150,
    carbs: 200,
    fat: 70,
    trainings: [
      { type: "💪 Strength", duration: "45 min", kcal: 350 },
      { type: "🏃 Run", duration: "3 km", kcal: 100 },
    ],
  },
  Tue: {
    calories: 1950,
    burned: 300,
    protein: 140,
    carbs: 180,
    fat: 65,
    trainings: [{ type: "🧘 Yoga", duration: "30 min", kcal: 150 }],
  },
  Wed: {
    calories: 2200,
    burned: 500,
    protein: 160,
    carbs: 220,
    fat: 75,
    trainings: [
      { type: "🏋️ Weightlifting", duration: "50 min", kcal: 400 },
      { type: "🚴 Cycling", duration: "20 min", kcal: 100 },
    ],
  },
  Thu: {
    calories: 1800,
    burned: 250,
    protein: 130,
    carbs: 170,
    fat: 60,
    trainings: [{ type: "🏊 Swimming", duration: "30 min", kcal: 250 }],
  },
  Fri: {
    calories: 2300,
    burned: 600,
    protein: 170,
    carbs: 230,
    fat: 80,
    trainings: [
      { type: "💪 Strength", duration: "60 min", kcal: 450 },
      { type: "🏃 HIIT", duration: "15 min", kcal: 150 },
    ],
  },
  Sat: {
    calories: 2500,
    burned: 700,
    protein: 180,
    carbs: 250,
    fat: 90,
    trainings: [
      { type: "🚴 Cycling", duration: "90 min", kcal: 500 },
      { type: "🧘 Yoga", duration: "40 min", kcal: 200 },
    ],
  },
  Sun: {
    calories: 1900,
    burned: 200,
    protein: 135,
    carbs: 175,
    fat: 65,
    trainings: [{ type: "🚶 Walking", duration: "60 min", kcal: 200 }],
  },
};

const monthData = {
  week1: {
    avgCalories: 2050,
    avgBurned: 420,
    totalTrainings: 12,
    avgProtein: 145,
    avgCarbs: 195,
    avgFat: 70,
  },
  week2: {
    avgCalories: 2150,
    avgBurned: 480,
    totalTrainings: 14,
    avgProtein: 155,
    avgCarbs: 210,
    avgFat: 75,
  },
  week3: {
    avgCalories: 2000,
    avgBurned: 390,
    totalTrainings: 10,
    avgProtein: 140,
    avgCarbs: 185,
    avgFat: 68,
  },
  week4: {
    avgCalories: 2200,
    avgBurned: 510,
    totalTrainings: 15,
    avgProtein: 160,
    avgCarbs: 215,
    avgFat: 78,
  },
};

export default function Analytics() {
  const colorScheme = useColorScheme();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<"trainings" | "meals">("trainings");

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const calorieColors = colors.calorietypes;

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
    setModalTab("trainings");
    setModalVisible(true);
  };

  // Calculate monthly totals
  const monthTotals = useMemo(() => {
    const weeks = Object.values(monthData);
    const totalTrainings = weeks.reduce((sum, week) => sum + week.totalTrainings, 0);
    const avgCalories = Math.round(
      weeks.reduce((sum, week) => sum + week.avgCalories, 0) / 4
    );
    const avgBurned = Math.round(
      weeks.reduce((sum, week) => sum + week.avgBurned, 0) / 4
    );
    const avgProtein = Math.round(
      weeks.reduce((sum, week) => sum + week.avgProtein, 0) / 4
    );
    const avgCarbs = Math.round(
      weeks.reduce((sum, week) => sum + week.avgCarbs, 0) / 4
    );
    const avgFat = Math.round(
      weeks.reduce((sum, week) => sum + week.avgFat, 0) / 4
    );

    return {
      totalTrainings,
      avgCalories,
      avgBurned,
      avgProtein,
      avgCarbs,
      avgFat,
      totalCaloriesBurned: avgBurned * 30,
    };
  }, []);


  const renderWeekView = () => {
    const days = Object.keys(weekData);
    const totalCalories = days.reduce((sum, day) => sum + weekData[day].calories, 0);
    const totalBurned = days.reduce((sum, day) => sum + weekData[day].burned, 0);

    return (
      <View style={styles.mainContentWrapper}>
        {/* Calories Overview */}
        <View style={styles.headerStatsRow}>
          <View style={[styles.statCardLarge, { backgroundColor: theme.cards }]}>
            <Text style={[styles.statValueLarge, { color: theme.text }]}>
              {totalCalories.toLocaleString()}
            </Text>
            <Text style={[styles.statLabelLarge, { color: theme.subtitles }]}>
              Total Calories Eaten
            </Text>
          </View>
          <View style={[styles.statCardLarge, { backgroundColor: theme.cards }]}>
            <Text style={[styles.statValueLarge, { color: calorieColors.protein }]}>
              {totalBurned.toLocaleString()}
            </Text>
            <Text style={[styles.statLabelLarge, { color: theme.subtitles }]}>
              Calories Burned
            </Text>
          </View>
        </View>

        {/* Days */}
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Days</Text>
        {days.map((day, idx) => {
          const dayData = weekData[day];
          const hasData = dayData.calories > 0;

          if (!hasData) return null;

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.daySimpleCard, { backgroundColor: theme.cards }]}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.daySimpleText, { color: theme.text }]}>
                {day}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.subtitles}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderMonthView = () => {
    // Calculate monthly totals from week data
    const totalMonthCalories = monthTotals.avgCalories * 30;
    const totalMonthBurned = monthTotals.avgBurned * 30;

    // Generate 31 days for the month
    const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
      <View style={styles.mainContentWrapper}>
        {/* Calories Overview */}
        <View style={styles.headerStatsRow}>
          <View style={[styles.statCardLarge, { backgroundColor: theme.cards }]}>
            <Text style={[styles.statValueLarge, { color: theme.text }]}>
              {totalMonthCalories.toLocaleString()}
            </Text>
            <Text style={[styles.statLabelLarge, { color: theme.subtitles }]}>
              Total Calories Eaten
            </Text>
          </View>
          <View style={[styles.statCardLarge, { backgroundColor: theme.cards }]}>
            <Text style={[styles.statValueLarge, { color: calorieColors.protein }]}>
              {totalMonthBurned.toLocaleString()}
            </Text>
            <Text style={[styles.statLabelLarge, { color: theme.subtitles }]}>
              Calories Burned
            </Text>
          </View>
        </View>

        {/* Days */}
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Days</Text>
        {monthDays.map((dayNum, idx) => {
          // For demo purposes, use sample data from weekData cycling through
          const dayNames = Object.keys(weekData);
          const dayKey = dayNames[dayNum % 7];
          const dayData = weekData[dayKey];

          // Show all days regardless of data
          const hasData = dayData.calories > 0;

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.daySimpleCard,
                { backgroundColor: theme.cards },
                !hasData && styles.daySimpleCardEmpty,
              ]}
              onPress={() => hasData && handleDayPress(dayKey)}
              activeOpacity={hasData ? 0.7 : 1}
              disabled={!hasData}
            >
              <Text
                style={[
                  styles.daySimpleText,
                  { color: hasData ? theme.text : theme.subtitles },
                ]}
              >
                Day {dayNum}
              </Text>
              {hasData && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.subtitles}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDayModal = () => {
    if (!selectedDay) return null;

    const dayData = weekData[selectedDay];

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          style={[styles.modalFullScreen, { backgroundColor: theme.background }]}
          edges={["top", "left", "right", "bottom"]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {selectedDay}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close-circle" size={32} color={theme.subtitles} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.modalTabs}>
            <TouchableOpacity
              style={[
                styles.modalTab,
                modalTab === "trainings" && styles.modalTabActive,
              ]}
              onPress={() => setModalTab("trainings")}
            >
              <Text
                style={[
                  styles.modalTabText,
                  { color: theme.text },
                  modalTab === "trainings" && styles.modalTabTextActive,
                ]}
              >
                Trainings
              </Text>
              {modalTab === "trainings" && (
                <View style={[styles.modalTabIndicator, { backgroundColor: theme.text }]} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalTab,
                modalTab === "meals" && styles.modalTabActive,
              ]}
              onPress={() => setModalTab("meals")}
            >
              <Text
                style={[
                  styles.modalTabText,
                  { color: theme.text },
                  modalTab === "meals" && styles.modalTabTextActive,
                ]}
              >
                Meals
              </Text>
              {modalTab === "meals" && (
                <View style={[styles.modalTabIndicator, { backgroundColor: theme.text }]} />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {modalTab === "trainings" ? (
                <>
                  {/* Trainings Content */}
                  {dayData.trainings.length > 0 ? (
                    dayData.trainings.map((training, idx) => (
                      <View key={idx} style={[styles.modalCard, { backgroundColor: theme.cards }]}>
                        <View style={styles.trainingItem}>
                          <Text style={[styles.trainingType, { color: theme.text }]}>
                            {training.type}
                          </Text>
                          <View style={styles.trainingDetails}>
                            <View style={styles.trainingDetailItem}>
                              <Ionicons name="time-outline" size={18} color={theme.subtitles} />
                              <Text style={[styles.trainingDetailText, { color: theme.text }]}>
                                {training.duration}
                              </Text>
                            </View>
                            <View style={styles.trainingDetailItem}>
                              <Ionicons name="flame-outline" size={18} color={calorieColors.protein} />
                              <Text style={[styles.trainingDetailText, { color: theme.text }]}>
                                {training.kcal} cal
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={[styles.emptyCard, { backgroundColor: theme.cards }]}>
                      <Text style={[styles.emptyText, { color: theme.subtitles }]}>
                        No trainings on this day
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {/* Meals Content */}
                  <View style={[styles.modalCard, { backgroundColor: theme.cards }]}>
                    <Text style={[styles.mealSectionTitle, { color: theme.text }]}>
                      Calories
                    </Text>
                    <View style={styles.mealStatsRow}>
                      <View style={styles.mealStatItem}>
                        <Text style={[styles.mealStatValue, { color: theme.text }]}>
                          {dayData.calories}
                        </Text>
                        <Text style={[styles.mealStatLabel, { color: theme.subtitles }]}>
                          Consumed
                        </Text>
                      </View>
                      <View style={styles.mealStatItem}>
                        <Text style={[styles.mealStatValue, { color: calorieColors.protein }]}>
                          {dayData.burned}
                        </Text>
                        <Text style={[styles.mealStatLabel, { color: theme.subtitles }]}>
                          Burned
                        </Text>
                      </View>
                      <View style={styles.mealStatItem}>
                        <Text style={[styles.mealStatValue, { color: theme.text }]}>
                          {dayData.calories - dayData.burned}
                        </Text>
                        <Text style={[styles.mealStatLabel, { color: theme.subtitles }]}>
                          Net
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.modalCard, { backgroundColor: theme.cards }]}>
                    <Text style={[styles.mealSectionTitle, { color: theme.text }]}>
                      Macros
                    </Text>
                    <View style={styles.macrosList}>
                      <View style={styles.macrosListItem}>
                        <View style={styles.macrosListLeft}>
                          <View style={[styles.macroIndicator, { backgroundColor: calorieColors.protein }]} />
                          <Text style={[styles.macrosListLabel, { color: theme.text }]}>
                            Protein
                          </Text>
                        </View>
                        <Text style={[styles.macrosListValue, { color: theme.text }]}>
                          {dayData.protein}g
                        </Text>
                      </View>
                      <View style={styles.macrosListItem}>
                        <View style={styles.macrosListLeft}>
                          <View style={[styles.macroIndicator, { backgroundColor: calorieColors.carbs }]} />
                          <Text style={[styles.macrosListLabel, { color: theme.text }]}>
                            Carbs
                          </Text>
                        </View>
                        <Text style={[styles.macrosListValue, { color: theme.text }]}>
                          {dayData.carbs}g
                        </Text>
                      </View>
                      <View style={styles.macrosListItem}>
                        <View style={styles.macrosListLeft}>
                          <View style={[styles.macroIndicator, { backgroundColor: calorieColors.fat }]} />
                          <Text style={[styles.macrosListLabel, { color: theme.text }]}>
                            Fat
                          </Text>
                        </View>
                        <Text style={[styles.macrosListValue, { color: theme.text }]}>
                          {dayData.fat}g
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.fullScreen, { backgroundColor: theme.background }]}
      edges={["left", "right", "bottom"]}
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.timebuttons}>
          {(["week", "month"] as const).map((period) => (
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
        {selectedPeriod === "week" ? renderWeekView() : renderMonthView()}
      </ScrollView>
      {renderDayModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  mainContentWrapper: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
  // Header Stats
  headerStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCardSmall: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  statValueSmall: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  statLabelSmall: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  // Large stat cards
  statCardLarge: {
    flex: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  statValueLarge: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  statLabelLarge: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    textAlign: "center",
  },
  // Macros Card
  macrosCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  macrosGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  macroGridItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  macroCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  macroCircleValue: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  macroGridLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  macroGridUnit: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  // Chart Card
  chartCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  chartHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  legendRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  barChartContainer: {
    marginTop: 12,
    paddingHorizontal: 6,
  },
  barsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 130,
    gap: 4,
  },
  dayBarGroup: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barStack: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginBottom: 10,
    height: 110,
  },
  bar: {
    width: 8,
    borderRadius: 5,
    minHeight: 8,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  // Day Cards
  dayCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    elevation: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  dayCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayCardLeft: {
    flex: 1,
  },
  dayName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  dayInfo: {
    fontSize: 13,
    fontWeight: "500",
  },
  daysHeader: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  // Tab buttons
  timebuttons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 14,
    gap: 12,
  },
  links: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  activePeriodIndicator: {
    marginTop: 6,
    width: 20,
    height: 2.5,
    borderRadius: 1.5,
  },
  // Month view styles (keeping existing for compatibility)
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 6,
  },
  cardFullWidth: {
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 6,
  },
  macroItem: {
    alignItems: "center",
    gap: 6,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.06)",
  },
  // Modal styles
  modalFullScreen: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  closeButton: {
    padding: 0,
  },
  // Modal tabs
  modalTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  modalTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalTabActive: {
    position: "relative",
  },
  modalTabText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
    opacity: 0.5,
  },
  modalTabTextActive: {
    fontWeight: "800",
    opacity: 1,
  },
  modalTabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: 40,
    borderRadius: 2,
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  modalSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  macroDetailRow: {
    gap: 14,
  },
  macroDetail: {
    marginBottom: 6,
  },
  macroDetailBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  macroDetailInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroDetailLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  macroDetailValue: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  caloriesGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  caloriesGridItem: {
    flex: 1,
    alignItems: "center",
  },
  caloriesGridValue: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  caloriesGridLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  workoutItemClean: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.06)",
  },
  workoutLeft: {
    flex: 1,
  },
  workoutTypeClean: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  workoutDurationClean: {
    fontSize: 12,
    fontWeight: "600",
  },
  workoutKcalClean: {
    fontSize: 13,
    fontWeight: "800",
  },
  // Week detail styles for monthly breakdown
  weekDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.08)",
  },
  weekDetailTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  weekDetailWorkouts: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  weekDetailStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  weekDetailStatItem: {
    alignItems: "center",
    minWidth: "18%",
  },
  weekDetailStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  weekDetailStatValue: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  // Quick Stats Card
  quickStatsCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  quickStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 8,
  },
  quickStatItem: {
    alignItems: "center",
    minWidth: "22%",
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  quickStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  // Expanded Day Cards
  dayCardExpanded: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  dayCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.08)",
  },
  dayCardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  dayCardStatItem: {
    flex: 1,
    alignItems: "center",
  },
  dayCardStatValue: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  dayCardStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  dayCardMacros: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.08)",
  },
  dayCardMacroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  macroIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dayCardMacroText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  // Section headers
  sectionHeader: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  // History cards
  historyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  historyCardDay: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  historyCardStats: {
    flexDirection: "row",
    gap: 16,
  },
  historyCardStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  historyCardStatText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  // Nutrition stats
  nutritionStats: {
    gap: 10,
  },
  nutritionStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  nutritionStatLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  nutritionStatValue: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  // Empty state
  emptyCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    alignItems: "center",
    elevation: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  // Simple day cards
  daySimpleCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  daySimpleText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  daySimpleCardEmpty: {
    opacity: 0.5,
  },
  // Training items in modal
  trainingItem: {
    gap: 12,
  },
  trainingType: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  trainingDetails: {
    flexDirection: "row",
    gap: 20,
  },
  trainingDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trainingDetailText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  // Meal content in modal
  mealSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  mealStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  mealStatItem: {
    flex: 1,
    alignItems: "center",
  },
  mealStatValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  mealStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  macrosList: {
    gap: 14,
  },
  macrosListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  macrosListLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  macrosListLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  macrosListValue: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});