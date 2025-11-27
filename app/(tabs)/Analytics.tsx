import { useMemo, useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import colors from "../../data/colors.json";
import { useData } from "../../contexts/DataContext";
import { useTabBar } from "../../contexts/TabBarContext";

export default function Analytics() {
  const colorScheme = useColorScheme();
  const { contentBottomPadding } = useTabBar();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<"trainings" | "meals">("trainings");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [weekData, setWeekData] = useState<any>({});
  const [selectedWeekInMonth, setSelectedWeekInMonth] = useState<number>(0); // 0-3 for 4 weeks
  const [weekTransitionDirection, setWeekTransitionDirection] = useState<"left" | "right">("right");

  const { getDateRangeData, getFoodsByDate, getTrainingsByDate } = useData();

  // Animated values for smooth transitions
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const calorieColors = colors.calorietypes;

  // Get date range based on selected period
  const getDateRange = (period: "week" | "month") => {
    const end = new Date();
    const start = new Date();

    if (period === "week") {
      start.setDate(end.getDate() - 6); // Last 7 days
    } else {
      start.setDate(end.getDate() - 29); // Last 30 days
    }

    return {
      startDate: start.toLocaleDateString('en-US'),
      endDate: end.toLocaleDateString('en-US'),
    };
  };

  // Load data for the selected period
  useEffect(() => {
    loadPeriodData();
  }, [selectedPeriod]);

  // Reset selected week when switching periods
  useEffect(() => {
    setSelectedWeekInMonth(0);
  }, [selectedPeriod]);

  const loadPeriodData = async () => {
    setIsLoadingData(true);
    try {
      const { startDate, endDate } = getDateRange(selectedPeriod);
      const data = await getDateRangeData(startDate, endDate);

      // Organize data by day
      const dayMap: any = {};
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Initialize days
      for (let i = 0; i < (selectedPeriod === 'week' ? 7 : 30); i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US');
        const dayName = selectedPeriod === 'week'
          ? daysOfWeek[date.getDay()]
          : date.getDate().toString();

        dayMap[dayName] = {
          date: dateStr,
          calories: 0,
          burned: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          trainings: [],
        };
      }

      // Fill in actual data
      data.foods.forEach(food => {
        const date = new Date(food.date);
        const dayName = selectedPeriod === 'week'
          ? daysOfWeek[date.getDay()]
          : date.getDate().toString();

        if (dayMap[dayName]) {
          dayMap[dayName].calories += food.calories;
          dayMap[dayName].protein += food.protein;
          dayMap[dayName].carbs += food.carbs;
          dayMap[dayName].fat += food.fats;
        }
      });

      data.trainings.forEach(training => {
        const date = new Date(training.date);
        const dayName = selectedPeriod === 'week'
          ? daysOfWeek[date.getDay()]
          : date.getDate().toString();

        if (dayMap[dayName]) {
          dayMap[dayName].burned += training.calories;
          dayMap[dayName].trainings.push({
            type: training.name,
            duration: training.duration,
            kcal: training.calories,
          });
        }
      });

      setWeekData(dayMap);
    } catch (error) {
      console.error('Error loading period data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
    setModalTab("trainings");
    setModalVisible(true);
  };

  // Handler for week selection with animation direction
  const handleWeekChange = (newWeek: number) => {
    if (newWeek !== selectedWeekInMonth) {
      setWeekTransitionDirection(newWeek > selectedWeekInMonth ? "right" : "left");
      setSelectedWeekInMonth(newWeek);
    }
  };

  // Calculate totals for the period
  const periodTotals = useMemo(() => {
    const days = Object.values(weekData);
    const totalCalories = days.reduce((sum: number, day: any) => sum + day.calories, 0);
    const totalBurned = days.reduce((sum: number, day: any) => sum + day.burned, 0);
    const avgCalories = days.length > 0 ? Math.round(totalCalories / days.length) : 0;
    const avgBurned = days.length > 0 ? Math.round(totalBurned / days.length) : 0;

    return {
      totalCalories,
      totalBurned,
      avgCalories,
      avgBurned,
    };
  }, [weekData]);

  // Calculate totals for selected week in month view
  const selectedWeekTotals = useMemo(() => {
    const allDays = Object.keys(weekData);
    const weeksData = [
      allDays.slice(0, 8),
      allDays.slice(8, 15),
      allDays.slice(15, 22),
      allDays.slice(22, 30),
    ];

    const currentWeekDays = weeksData[selectedWeekInMonth] || [];
    const weekDays = currentWeekDays.map(day => weekData[day]).filter(Boolean);

    const totalCalories = weekDays.reduce((sum: number, day: any) => sum + day.calories, 0);
    const totalBurned = weekDays.reduce((sum: number, day: any) => sum + day.burned, 0);
    const avgCalories = weekDays.length > 0 ? Math.round(totalCalories / weekDays.length) : 0;
    const avgBurned = weekDays.length > 0 ? Math.round(totalBurned / weekDays.length) : 0;

    return {
      totalCalories,
      totalBurned,
      avgCalories,
      avgBurned,
      currentWeekDays,
      weeksData,
    };
  }, [weekData, selectedWeekInMonth]);

  const renderWeekView = () => {
    const days = Object.keys(weekData);

    if (isLoadingData) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={[styles.loadingText, { color: theme.subtitles }]}>Loading data...</Text>
        </View>
      );
    }

    return (
      <Animated.View
        style={styles.mainContentWrapper}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(200)}
      >
        {/* Hero Stats Card */}
        <Animated.View
          style={[styles.heroCard, { backgroundColor: theme.cards }]}
          entering={FadeIn.delay(100).duration(500).springify()}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroStatGroup}>
              <Text style={[styles.heroValue, { color: theme.text }]}>
                {periodTotals.avgCalories}
              </Text>
              <Text style={[styles.heroLabel, { color: theme.subtitles }]}>
                avg daily
              </Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStatGroup}>
              <Text style={[styles.heroValue, { color: calorieColors.protein }]}>
                {periodTotals.avgBurned}
              </Text>
              <Text style={[styles.heroLabel, { color: theme.subtitles }]}>
                avg burned
              </Text>
            </View>
          </View>
          <View style={[styles.heroFooter, { borderTopColor: theme.subtitles + "20" }]}>
            <Text style={[styles.heroFooterText, { color: theme.subtitles }]}>
              {periodTotals.totalCalories.toLocaleString()} total this week
            </Text>
          </View>
        </Animated.View>

        {/* Days List */}
        <View style={styles.daysSection}>
          {days.map((day, idx) => {
            const dayData = weekData[day];
            const hasData = dayData.calories > 0 || dayData.trainings.length > 0;

            return (
              <Animated.View
                key={`week-${day}-${idx}`}
                entering={FadeIn.delay(150 + idx * 50).duration(400).springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.dayCard,
                    { backgroundColor: theme.cards },
                    !hasData && { opacity: 0.5 },
                  ]}
                  onPress={() => hasData && handleDayPress(day)}
                  activeOpacity={0.6}
                  disabled={!hasData}
                >
                  <View style={styles.dayCardContent}>
                    <View style={styles.dayCardLeft}>
                      <Text style={[styles.dayCardDay, { color: theme.text }]}>
                        {day}
                      </Text>
                      <Text style={[styles.dayCardSub, { color: theme.subtitles }]}>
                        {dayData.trainings.length} workout{dayData.trainings.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.dayCardRight}>
                      <Text style={[styles.dayCardValue, { color: theme.text }]}>
                        {dayData.calories}
                      </Text>
                      <Text style={[styles.dayCardLabel, { color: theme.subtitles }]}>
                        kcal
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderMonthView = () => {
    const { currentWeekDays, avgCalories, avgBurned, totalCalories } = selectedWeekTotals;

    if (isLoadingData) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={[styles.loadingText, { color: theme.subtitles }]}>Loading data...</Text>
        </View>
      );
    }

    // Determine slide animation direction based on week navigation
    const slideIn = weekTransitionDirection === "right" ? SlideInRight : SlideInLeft;
    const slideOut = weekTransitionDirection === "right" ? SlideOutLeft : SlideOutRight;

    return (
      <Animated.View
        style={styles.mainContentWrapper}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(200)}
      >
        {/* Week Selector */}
        <Animated.View
          style={[styles.weekSelector, { backgroundColor: theme.cards }]}
          entering={FadeIn.delay(100).duration(500).springify()}
        >
          {[0, 1, 2, 3].map((weekNum) => (
            <TouchableOpacity
              key={weekNum}
              onPress={() => handleWeekChange(weekNum)}
              style={[
                styles.weekButton,
                selectedWeekInMonth === weekNum && { backgroundColor: theme.background },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.weekButtonText,
                  { color: theme.subtitles },
                  selectedWeekInMonth === weekNum && { color: theme.text, fontWeight: "600" },
                ]}
              >
                W{weekNum + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Hero Stats Card */}
        <Animated.View
          key={`stats-${selectedWeekInMonth}`}
          style={[styles.heroCard, { backgroundColor: theme.cards }]}
          entering={slideIn.duration(300).springify()}
          exiting={slideOut.duration(200)}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroStatGroup}>
              <Text style={[styles.heroValue, { color: theme.text }]}>
                {avgCalories}
              </Text>
              <Text style={[styles.heroLabel, { color: theme.subtitles }]}>
                avg daily
              </Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStatGroup}>
              <Text style={[styles.heroValue, { color: calorieColors.protein }]}>
                {avgBurned}
              </Text>
              <Text style={[styles.heroLabel, { color: theme.subtitles }]}>
                avg burned
              </Text>
            </View>
          </View>
          <View style={[styles.heroFooter, { borderTopColor: theme.subtitles + "20" }]}>
            <Text style={[styles.heroFooterText, { color: theme.subtitles }]}>
              {totalCalories.toLocaleString()} total this week
            </Text>
          </View>
        </Animated.View>

        {/* Days List (similar to week view) */}
        <Animated.View
          key={`days-${selectedWeekInMonth}`}
          style={styles.daysSection}
          entering={slideIn.duration(300).springify()}
          exiting={slideOut.duration(200)}
        >
          {currentWeekDays.map((dayNum, idx) => {
            const dayData = weekData[dayNum];
            if (!dayData) return null;

            const hasData = dayData.calories > 0 || dayData.trainings.length > 0;

            return (
              <Animated.View
                key={`month-${dayNum}-${idx}`}
                entering={FadeIn.delay(50 + idx * 40).duration(400).springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.dayCard,
                    { backgroundColor: theme.cards },
                    !hasData && { opacity: 0.5 },
                  ]}
                  onPress={() => hasData && handleDayPress(dayNum)}
                  activeOpacity={0.6}
                  disabled={!hasData}
                >
                  <View style={styles.dayCardContent}>
                    <View style={styles.dayCardLeft}>
                      <Text style={[styles.dayCardDay, { color: theme.text }]}>
                        Day {dayNum}
                      </Text>
                      <Text style={[styles.dayCardSub, { color: theme.subtitles }]}>
                        {dayData.trainings.length} workout{dayData.trainings.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.dayCardRight}>
                      <Text style={[styles.dayCardValue, { color: theme.text }]}>
                        {dayData.calories}
                      </Text>
                      <Text style={[styles.dayCardLabel, { color: theme.subtitles }]}>
                        kcal
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      </Animated.View>
    );
  };

  const renderDayModal = () => {
    if (!selectedDay || !weekData[selectedDay]) return null;

    const dayData = weekData[selectedDay];
    const dayFoods = getFoodsByDate(dayData.date);

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
          {/* Minimalist Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {selectedDay}
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.subtitles }]}>
                {dayData.calories} kcal • {dayData.trainings.length} workouts
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              activeOpacity={0.6}
            >
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Simplified Tabs */}
          <View style={styles.modalTabs}>
            <TouchableOpacity
              style={[styles.modalTab]}
              onPress={() => setModalTab("trainings")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalTabText,
                  { color: theme.subtitles },
                  modalTab === "trainings" && { color: theme.text, fontWeight: "700" },
                ]}
              >
                Workouts
              </Text>
              {modalTab === "trainings" && (
                <View style={[styles.modalTabIndicator, { backgroundColor: theme.text }]} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalTab]}
              onPress={() => setModalTab("meals")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalTabText,
                  { color: theme.subtitles },
                  modalTab === "meals" && { color: theme.text, fontWeight: "700" },
                ]}
              >
                Nutrition
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
                    dayData.trainings.map((training: any, idx: number) => (
                      <View key={idx} style={[styles.trainingCard, { backgroundColor: theme.cards }]}>
                        <Text style={[styles.trainingCardType, { color: theme.text }]}>
                          {training.type}
                        </Text>
                        <View style={styles.trainingCardStats}>
                          <View style={styles.trainingCardStat}>
                            <Ionicons name="time-outline" size={16} color={theme.subtitles} />
                            <Text style={[styles.trainingCardStatText, { color: theme.subtitles }]}>
                              {training.duration}
                            </Text>
                          </View>
                          <View style={styles.trainingCardStat}>
                            <Ionicons name="flame-outline" size={16} color={calorieColors.protein} />
                            <Text style={[styles.trainingCardStatText, { color: theme.subtitles }]}>
                              {training.kcal} cal
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={[styles.emptyState]}>
                      <Ionicons name="fitness-outline" size={48} color={theme.subtitles + "40"} />
                      <Text style={[styles.emptyText, { color: theme.subtitles }]}>
                        No workouts recorded
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {/* Nutrition Content */}
                  <View style={[styles.nutritionGrid]}>
                    <View style={[styles.nutritionCard, { backgroundColor: theme.cards }]}>
                      <Text style={[styles.nutritionValue, { color: theme.text }]}>
                        {dayData.calories}
                      </Text>
                      <Text style={[styles.nutritionLabel, { color: theme.subtitles }]}>
                        consumed
                      </Text>
                    </View>
                    <View style={[styles.nutritionCard, { backgroundColor: theme.cards }]}>
                      <Text style={[styles.nutritionValue, { color: calorieColors.protein }]}>
                        {dayData.burned}
                      </Text>
                      <Text style={[styles.nutritionLabel, { color: theme.subtitles }]}>
                        burned
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.macrosCard, { backgroundColor: theme.cards }]}>
                    <Text style={[styles.macrosCardTitle, { color: theme.text }]}>
                      Macronutrients
                    </Text>
                    <View style={styles.macrosCardList}>
                      <View style={styles.macroRow}>
                        <View style={styles.macroRowLeft}>
                          <View style={[styles.macroRowDot, { backgroundColor: calorieColors.protein }]} />
                          <Text style={[styles.macroRowLabel, { color: theme.subtitles }]}>
                            Protein
                          </Text>
                        </View>
                        <Text style={[styles.macroRowValue, { color: theme.text }]}>
                          {dayData.protein}g
                        </Text>
                      </View>
                      <View style={styles.macroRow}>
                        <View style={styles.macroRowLeft}>
                          <View style={[styles.macroRowDot, { backgroundColor: calorieColors.carbs }]} />
                          <Text style={[styles.macroRowLabel, { color: theme.subtitles }]}>
                            Carbs
                          </Text>
                        </View>
                        <Text style={[styles.macroRowValue, { color: theme.text }]}>
                          {dayData.carbs}g
                        </Text>
                      </View>
                      <View style={styles.macroRow}>
                        <View style={styles.macroRowLeft}>
                          <View style={[styles.macroRowDot, { backgroundColor: calorieColors.fat }]} />
                          <Text style={[styles.macroRowLabel, { color: theme.subtitles }]}>
                            Fat
                          </Text>
                        </View>
                        <Text style={[styles.macroRowValue, { color: theme.text }]}>
                          {dayData.fat}g
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Meals List */}
                  {dayFoods.length > 0 && (
                    <>
                      <Text style={[styles.mealsTitle, { color: theme.text }]}>Meals</Text>
                      {dayFoods.map((food) => (
                        <View key={food.id} style={[styles.mealCard, { backgroundColor: theme.cards }]}>
                          <View style={styles.mealHeader}>
                            <Text style={[styles.mealName, { color: theme.text }]}>
                              {food.name}
                            </Text>
                            <Text style={[styles.mealCalories, { color: theme.text }]}>
                              {food.calories} kcal
                            </Text>
                          </View>
                          <View style={styles.mealMacros}>
                            <Text style={[styles.mealMacroText, { color: theme.subtitles }]}>
                              P: {food.protein}g
                            </Text>
                            <Text style={[styles.mealMacroText, { color: theme.subtitles }]}>
                              C: {food.carbs}g
                            </Text>
                            <Text style={[styles.mealMacroText, { color: theme.subtitles }]}>
                              F: {food.fats}g
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
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
      edges={["left", "right"]} // No bottom edge for floating tab bar
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <View style={styles.header}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>Analytics</Text>
        <View style={[styles.periodSelector, { backgroundColor: theme.cards }]}>
          {(["week", "month"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                selectedPeriod === period && { backgroundColor: theme.background },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: theme.subtitles },
                  selectedPeriod === period && { color: theme.text, fontWeight: "600" },
                ]}
              >
                {period[0].toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]} showsVerticalScrollIndicator={false}>
        {selectedPeriod === "week" ? renderWeekView() : renderMonthView()}
      </ScrollView>
      {renderDayModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  mealCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  mealCalories: {
    fontSize: 15,
    fontWeight: '700',
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 16,
  },
  mealMacroText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  // Week Selector (Month View)
  weekSelector: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  weekButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  weekButtonText: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

  // Content
  scrollContent: {
    flexGrow: 1,
    // paddingBottom set dynamically via useTabBar hook
  },
  mainContentWrapper: {
    paddingHorizontal: 24,
    gap: 16,
  },
  // Hero Card
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroHeader: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  heroStatGroup: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  heroDivider: {
    width: 1,
    backgroundColor: "#ffffff10",
    marginHorizontal: 16,
  },
  heroFooter: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
    alignItems: "center",
  },
  heroFooterText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  // Days Section
  daysSection: {
    gap: 10,
  },
  dayCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dayCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  dayCardLeft: {
    gap: 4,
  },
  dayCardDay: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  dayCardSub: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  dayCardRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  dayCardValue: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  dayCardLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Days Grid (Month View)
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayGridItem: {
    width: "13.5%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayGridNumber: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  // Modal styles
  modalFullScreen: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  modalTabs: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff10",
  },
  modalTab: {
    paddingBottom: 12,
    position: "relative",
  },
  modalTabText: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  modalTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Training Card (Modal)
  trainingCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  trainingCardType: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  trainingCardStats: {
    flexDirection: "row",
    gap: 16,
  },
  trainingCardStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trainingCardStatText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

  // Nutrition Grid (Modal)
  nutritionGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  nutritionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  nutritionValue: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Macros Card (Modal)
  macrosCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  macrosCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  macrosCardList: {
    gap: 14,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  macroRowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  macroRowLabel: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  macroRowValue: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

});
