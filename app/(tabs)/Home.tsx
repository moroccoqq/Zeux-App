import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Image,
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
import { useData } from "../../contexts/DataContext";

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
  const {
    getTodayFoods,
    getTodayTrainings,
    getTodayCalories,
    getTodayMacros,
    calorieGoal,
    exerciseGoal,
  } = useData();

  const theme = useMemo(() => {
    return colorScheme === "dark" ? colors.dark : colors.light;
  }, [colorScheme]);

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
        <View>
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
                {eaten} / {calorieGoal}
              </Text>

              <Text style={[styles.cardLabel, { color: theme.subtitles }]}>
                Calories eaten 🍱
              </Text>
            </View>

            <CircularProgress
              value={Math.min(eaten, calorieGoal)}
              activeStrokeWidth={14}
              inActiveStrokeWidth={10}
              inActiveStrokeOpacity={0.2}
              radius={60}
              duration={1000}
              maxValue={calorieGoal}
              activeStrokeColor={theme.chart}
              inActiveStrokeColor={theme.inactivechart}
            />
          </View>
  
          <View style={styles.moreInfoCardRow}>
            {moreInfoCards(proteinGoal - macros.protein, "Protein", proteinGoal, "protein")}
            {moreInfoCards(carbsGoal - macros.carbs, "Carbs", carbsGoal, "carbs")}
            {moreInfoCards(fatsGoal - macros.fats, "Fats", fatsGoal, "fat")}
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
                {burned} / {exerciseGoal}
              </Text>

              <Text style={[styles.cardLabel, { color: theme.subtitles }]}>
                Calories burned 🔥
              </Text>
            </View>

            <CircularProgress
              value={Math.min(burned, exerciseGoal)}
              activeStrokeWidth={14}
              inActiveStrokeWidth={10}
              inActiveStrokeOpacity={0.2}
              radius={60}
              duration={1000}
              maxValue={exerciseGoal}
              activeStrokeColor={theme.chart}
              inActiveStrokeColor={theme.inactivechart}
            />
          </View>

          {/* Quick Actions Section */}
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
                  Tap &ldquo;Add Food&rdquo; to start tracking
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
                  Tap &ldquo;Add Training&rdquo; to log a workout
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
});
