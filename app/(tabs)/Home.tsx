import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState, useRef } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../data/colors.json";
import { useData } from "../../contexts/DataContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Placeholder image for foods without photos
const placeholderImage = require('../../assets/images/green.png');

// Icon mapping for training types
const trainingIcons: { [key: string]: string } = {
  strength: 'barbell-outline',
  cardio: 'flash-outline',
  yoga: 'body-outline',
  sports: 'football-outline',
};

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const {
    getTodayFoods,
    getTodayTrainings,
    getTodayCalories,
    getTodayMacros,
    calorieGoal,
    exerciseGoal,
    waterIntake,
    waterGoal,
    steps,
    incrementWater,
    decrementWater,
  } = useData();

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  // Get data from context
  const recentFoods = getTodayFoods().slice(0, 3); // Show last 3
  const recentTrainings = getTodayTrainings().slice(0, 2); // Show last 2
  const { eaten, burned } = getTodayCalories();
  const macros = getTodayMacros();

  // Calculate macro goals (protein: 30%, carbs: 40%, fats: 30% of total calories)
  const proteinGoal = Math.round((calorieGoal * 0.30) / 4); // 4 cal per gram
  const carbsGoal = Math.round((calorieGoal * 0.40) / 4);
  const fatsGoal = Math.round((calorieGoal * 0.30) / 9); // 9 cal per gram

  type CalorieType = keyof typeof colors.calorietypes;

  const moreInfoCards = (
    value: number,
    type: string,
    maxValue: number,
    colortypes: CalorieType,
    iconName: string
  ) => {
    const unactivecolor =
      colors.calorietypes[colortypes + "unactive" as CalorieType];
    const percentage = maxValue > 0 ? ((maxValue - value) / maxValue) * 100 : 0;

    return (
      <View style={[styles.compactMacroCard, { backgroundColor: theme.cards }]}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <Text style={[{ color: theme.text, fontSize: 18, fontWeight: "700" }]}>{value}g</Text>

         <Text style={{ color: theme.text, fontSize: 13 }}>
            {type}{" "}
            <Text
              style={{
                fontWeight: "600",
                color: theme.text,
                fontSize: 13,
              }}
            >
              left
            </Text>
          </Text>
        </View>

        <View style={styles.compactMacroCircle}>
          <CircularProgress
            value={Math.max(0, maxValue - value)}
            activeStrokeWidth={6}
            inActiveStrokeWidth={6}
            inActiveStrokeOpacity={0.15}
            radius={30}
            duration={1000}
            maxValue={maxValue}
            activeStrokeColor={colors.calorietypes[colortypes]}
            inActiveStrokeColor={unactivecolor}
            showProgressValue={false}
          />
          <View style={styles.compactMacroIcon}>
            <Ionicons
              name={iconName as any}
              size={18}
              color={colors.calorietypes[colortypes]}
            />
          </View>
        </View>
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
        style={styles.mainContent}
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Scrollable Top Section */}
        <View style={styles.topScrollContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.horizontalScroll}
            nestedScrollEnabled={true}
          >
            {/* Page 1: Calories and Macros */}
            <View style={[styles.topPage, { width: SCREEN_WIDTH }]}>
              <View style={styles.topPageContent}>
                <View style={[styles.caloriesCompactCard, { backgroundColor: theme.cards }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.compactCardValue, { color: theme.text }]}>
                      {Math.max(0, calorieGoal - eaten)}
                    </Text>
                    <Text style={[styles.compactCardLabel, { color: theme.text }]}>
                      Calories left
                    </Text>
                  </View>
                  <View style={styles.compactCardCircle}>
                    <CircularProgress
                      value={Math.min(eaten, calorieGoal)}
                      activeStrokeWidth={8}
                      inActiveStrokeWidth={8}
                      inActiveStrokeOpacity={0.15}
                      radius={40}
                      duration={1000}
                      maxValue={calorieGoal}
                      activeStrokeColor={theme.chart}
                      inActiveStrokeColor={theme.inactivechart}
                      showProgressValue={false}
                    />
                    <View style={styles.compactCardIcon}>
                      <Ionicons name="flame" size={24} color={theme.chart} />
                    </View>
                  </View>
                </View>

                <View style={styles.compactMacroRow}>
                  {moreInfoCards(Math.max(0, proteinGoal - macros.protein), "Protein", proteinGoal, "protein", "nutrition-outline")}
                  {moreInfoCards(Math.max(0, carbsGoal - macros.carbs), "Carbs", carbsGoal, "carbs", "leaf-outline")}
                  {moreInfoCards(Math.max(0, fatsGoal - macros.fats), "Fats", fatsGoal, "fat", "water-outline")}
                </View>
              </View>
            </View>

            {/* Page 2: Steps and Water */}
            <View style={[styles.topPage, { width: SCREEN_WIDTH }]}>
              <View style={styles.topPageContent}>
                {/* Steps Card */}
                <View style={[styles.compactStepsCard, { backgroundColor: theme.cards }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Ionicons name="flame" size={20} color={theme.chart} />
                    <Text style={[styles.compactCardValue, { color: theme.text, fontSize: 24 }]}>
                      {burned}
                    </Text>
                  </View>
                  <Text style={[styles.compactCardLabel, { color: theme.text }]}>
                    Calories burned
                  </Text>
                  <View style={styles.compactStepsMeta}>
                    <Ionicons name="footsteps-outline" size={14} color={theme.subtitles} />
                    <Text style={[styles.compactStepsText, { color: theme.subtitles }]}>
                      Steps
                    </Text>
                  </View>
                  <Text style={[styles.compactStepsValue, { color: theme.text }]}>
                    +{steps}
                  </Text>
                </View>

                {/* Water Card */}
                <View style={[styles.compactWaterCard, { backgroundColor: theme.cards }]}>
                  <View style={styles.compactWaterHeader}>
                    <Ionicons name="water" size={24} color="#5B9BD5" />
                    <View style={styles.compactWaterInfo}>
                      <Text style={[styles.compactWaterTitle, { color: theme.text }]}>
                        Water
                      </Text>
                      <Text style={[styles.compactWaterValue, { color: theme.text }]}>
                        {waterIntake * 8} fl oz ({waterIntake} cups)
                      </Text>
                    </View>
                  </View>
                  <View style={styles.compactWaterButtons}>
                    <Pressable
                      style={[styles.compactWaterButton, { backgroundColor: theme.background }]}
                      onPress={decrementWater}
                    >
                      <Ionicons name="remove" size={20} color={theme.text} />
                    </Pressable>
                    <Pressable
                      style={[styles.compactWaterButton, { backgroundColor: theme.background }]}
                      onPress={incrementWater}
                    >
                      <Ionicons name="add" size={20} color={theme.text} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Page Indicators */}
          <View style={styles.pageIndicatorContainer}>
            {[0, 1].map((page) => (
              <View
                key={page}
                style={[
                  styles.pageIndicator,
                  {
                    backgroundColor:
                      currentPage === page
                        ? theme.text
                        : theme.subtitles,
                    opacity: currentPage === page ? 1 : 0.3,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.contentSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>

          {/* Add Food Button */}
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.buttons }]}
            onPress={() => router.push("/addFood")}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Ionicons name="camera-outline" size={28} color={theme.text} />
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    Add Food
                  </Text>
                  <Text style={[styles.actionSubtitle, { color: theme.subtitles }]}>
                    Scan food with camera
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </View>
          </Pressable>

          {/* Add Training Button */}
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.buttons }]}
            onPress={() => router.push("/addTraining")}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Ionicons name="barbell-outline" size={28} color={theme.text} />
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    Add Training
                  </Text>
                  <Text style={[styles.actionSubtitle, { color: theme.subtitles }]}>
                    Log your workout session
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </View>
          </Pressable>

          {/* Workout Plans Button */}
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.buttons }]}
            onPress={() => router.push("/WorkoutPlans")}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Ionicons name="calendar-outline" size={28} color={theme.text} />
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    Workout Plans
                  </Text>
                  <Text style={[styles.actionSubtitle, { color: theme.subtitles }]}>
                    View weekly training schedule
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </View>
          </Pressable>

          {/* Recent Food Section */}
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Food</Text>
            {recentFoods.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.cards }]}>
                <Ionicons name="restaurant-outline" size={48} color={theme.subtitles} />
                <Text style={[styles.emptyStateText, { color: theme.subtitles }]}>
                  No food logged today
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: theme.subtitles }]}>
                  Tap "Add Food" to start tracking
                </Text>
              </View>
            ) : (
              recentFoods.map((food) => (
                <View
                  key={food.id}
                  style={[styles.foodCard, { backgroundColor: theme.cards }]}
                >
                  {/* Food Image */}
                  <Image
                    source={food.image ? { uri: food.image } : placeholderImage}
                    style={styles.foodImage}
                    resizeMode="cover"
                  />

                  {/* Food Details */}
                  <View style={styles.foodDetails}>
                    <View style={styles.foodHeader}>
                      <View style={styles.foodInfo}>
                        <Text style={[styles.foodName, { color: theme.text }]}>
                          {food.name}
                        </Text>
                        <View style={styles.foodMeta}>
                          <Ionicons name="time-outline" size={12} color={theme.subtitles} />
                          <Text style={[styles.foodTime, { color: theme.subtitles }]}>
                            {food.time}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.foodCalories}>
                        <Text style={[styles.caloriesNumber, { color: theme.text }]}>
                          {food.calories}
                        </Text>
                        <Text style={[styles.caloriesLabel, { color: theme.subtitles }]}>
                          kcal
                        </Text>
                      </View>
                    </View>

                    {/* Macros Bar */}
                    <View style={styles.macrosBar}>
                      <View style={styles.macroItem}>
                        <View style={[styles.macroDot, { backgroundColor: colors.calorietypes.protein }]} />
                        <Text style={[styles.macroText, { color: theme.subtitles }]}>
                          P: {food.protein}g
                        </Text>
                      </View>
                      <View style={styles.macroItem}>
                        <View style={[styles.macroDot, { backgroundColor: colors.calorietypes.carbs }]} />
                        <Text style={[styles.macroText, { color: theme.subtitles }]}>
                          C: {food.carbs}g
                        </Text>
                      </View>
                      <View style={styles.macroItem}>
                        <View style={[styles.macroDot, { backgroundColor: colors.calorietypes.fat }]} />
                        <Text style={[styles.macroText, { color: theme.subtitles }]}>
                          F: {food.fats}g
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Recent Trainings Section */}
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Trainings</Text>
            {recentTrainings.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.cards }]}>
                <Ionicons name="barbell-outline" size={48} color={theme.subtitles} />
                <Text style={[styles.emptyStateText, { color: theme.subtitles }]}>
                  No trainings logged today
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: theme.subtitles }]}>
                  Tap "Add Training" to log a workout
                </Text>
              </View>
            ) : (
              recentTrainings.map((training) => (
                <View
                  key={training.id}
                  style={[styles.recentCard, { backgroundColor: theme.cards }]}
                >
                  <View style={[styles.recentIconContainer, { backgroundColor: theme.background }]}>
                    <Ionicons
                      name={trainingIcons[training.type] as any || 'fitness-outline'}
                      size={24}
                      color={theme.text}
                    />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={[styles.recentName, { color: theme.text }]}>
                      {training.name}
                    </Text>
                    <View style={styles.recentMeta}>
                      <Ionicons name="time-outline" size={14} color={theme.subtitles} />
                      <Text style={[styles.recentMetaText, { color: theme.subtitles }]}>
                        {training.duration}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.recentCalories}>
                    <Text style={[styles.caloriesNumber, { color: theme.text }]}>
                      {training.calories}
                    </Text>
                    <Text style={[styles.caloriesLabel, { color: theme.subtitles }]}>
                      kcal
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    paddingBottom: 20,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  topScrollContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  topPage: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  topPageContent: {
    gap: 12,
  },
  pageIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  caloriesCompactCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  compactCardValue: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  compactCardLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  compactCardCircle: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  compactCardIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  compactMacroRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: -4,
  },
  compactMacroCard: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    boxShadow:
      "0 0px 5px hsla(0, 0%, 28%, 0.2), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 3px hsla(0, 0%, 28%, 0.15)",
  },
  compactMacroCircle: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  compactMacroIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  compactStepsCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  compactStepsMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  compactStepsText: {
    fontSize: 13,
  },
  compactStepsValue: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  compactWaterCard: {
    borderRadius: 20,
    padding: 16,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  compactWaterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  compactWaterInfo: {
    flex: 1,
  },
  compactWaterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  compactWaterValue: {
    fontSize: 13,
  },
  compactWaterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  compactWaterButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  caloriesMainCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 7,
    boxShadow:
      "0 0px 12px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 6px hsla(0, 0%, 28%, 0.2)",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  caloriesMainValue: {
    fontSize: 48,
    fontWeight: "700",
  },
  caloriesMainLabel: {
    fontSize: 18,
    marginTop: 4,
  },
  caloriesMainCircle: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  caloriesMainIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 24,
    padding: 18,
    marginTop: 15,
    elevation: 5,
    flexDirection: "column",
    marginBottom: 9,
    flex: 1,
    marginHorizontal: 4,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  macroCircleContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  macroIconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  moreInfoCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginHorizontal: -4,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  actionButton: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  actionSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  recentSection: {
    marginTop: 20,
  },
  // Food Card Styles with Images
  foodCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  foodImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e0e0e0",
  },
  foodDetails: {
    padding: 16,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  foodInfo: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  foodMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  foodTime: {
    fontSize: 12,
  },
  foodCalories: {
    alignItems: "flex-end",
  },
  macrosBar: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroText: {
    fontSize: 13,
    fontWeight: "500",
  },
  // Training Card Styles (keep existing)
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recentMetaText: {
    fontSize: 13,
  },
  recentCalories: {
    alignItems: "flex-end",
  },
  caloriesNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  caloriesLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 8,
  },
  smallCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  smallCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  smallCardValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  smallCardLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  smallCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  smallCardMetaText: {
    fontSize: 13,
  },
  smallCardSteps: {
    fontSize: 20,
    fontWeight: "600",
  },
  googleHealthConnect: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  googleHealthText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  waterCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 15,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  waterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  waterInfo: {
    flex: 1,
  },
  waterTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  waterValue: {
    fontSize: 15,
  },
  waterButtons: {
    flexDirection: "row",
    gap: 12,
  },
  waterButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  healthScoreCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 15,
    boxShadow:
      "0 0px 7px hsla(0, 0%, 28%, 0.23), 0 0px 0px hsla(0, 0%, 28%, 0.15), 0 0 4px hsla(0, 0%, 28%, 0.2)",
  },
  healthScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  healthScoreTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  healthScoreValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  healthScoreBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  healthScoreProgress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  healthScoreFeedback: {
    fontSize: 15,
    lineHeight: 22,
  },
});
