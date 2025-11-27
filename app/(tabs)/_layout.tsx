import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useMemo } from "react";
import { BlurView } from "expo-blur";
import colors from "../../data/colors.json";
import { TabBarProvider, useTabBar } from "../../contexts/TabBarContext";

const ZeuxIcon_dark = require("../../assets/images/zeuxicon-black.png");
const ZeuxIcon_light = require("../../assets/images/zeuxicon-white.png");

function TabsContent() {
  const colorScheme = useColorScheme();
  const { tabBarBottomOffset } = useTabBar();

  // Dynamically select colors based on theme
  const theme = useMemo(
    () => (colorScheme === "dark" ? colors.dark : colors.light),
    [colorScheme]
  );
  const ZeuxIcon = colorScheme === "dark" ? ZeuxIcon_light : ZeuxIcon_dark;

  const HeaderRightTitle = ({ title }: { title: string }) => (
    <View style={{ paddingRight: 15 }}>
      <Text style={{ color: theme.text, fontWeight: "600", fontSize: 25 }}>
        {title}
      </Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.subtitles,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: "transparent", // Transparent to show blur effect
            borderTopColor: "transparent",
            bottom: tabBarBottomOffset,
          },
        ],
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={colorScheme === "dark" ? "dark" : "light"}
            style={styles.blurContainer}
          />
        ),
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerTitle: () => (
            <Image
              source={ZeuxIcon}
              alt="Zeux"
              style={styles.headerImageStyle}
            />
          ),
          headerRight: () => <HeaderRightTitle title="Home" />,
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Analytics"
        options={{
          headerTitle: () => (
            <Image
              source={ZeuxIcon}
              alt="Zeux"
              style={styles.headerImageStyle}
            />
          ),
          headerRight: () => <HeaderRightTitle title="Analytics" />,
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name={focused ? "bar-chart" : "bar-chart-outline"}
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          headerTitle: () => (
            <Image
              source={ZeuxIcon}
              alt="Zeux"
              style={styles.headerImageStyle}
            />
          ),
          headerRight: () => <HeaderRightTitle title="Settings" />,
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && { backgroundColor: theme.background },
              ]}
            >
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                color={color}
                size={22}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 64, // Controls overall tab bar height (affects vertical space)
    borderRadius: 32,
    borderTopWidth: 0,
    paddingHorizontal: 12, // Controls spacing from left/right edges of tab bar
    paddingVertical: 6, // Controls top/bottom padding inside the tab bar - ADJUST THIS for vertical spacing
    paddingTop: 12, // Top padding specifically - ADJUST THIS to move icons down
    paddingBottom: 6, // Bottom padding specifically - ADJUST THIS to move icons up
    alignItems: "center", // Centers icons vertically within the tab bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.18)", // Subtle glass border
    gap: 0, // Controls spacing between tab icons (increase for more space between icons)
    justifyContent: "space-evenly", // Distribution of icons horizontally: 'space-evenly', 'space-between', 'space-around'
    overflow: "hidden", // Ensures blur stays within rounded corners
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.08)", // Subtle translucent tint for glass effect
  },
  tabIconContainer: {
    width: 52, // Icon container width (increase to make icon touch areas larger)
    height: 52, // Icon container height
    borderRadius: 26, // Half of width/height to maintain circular shape
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0, // Add horizontal spacing between individual icons (e.g., 8 for more space)
  },
  headerImageStyle: {
    width: 100,
    height: 38,
    resizeMode: "contain",
  },
});

export default function RootLayout() {
  return (
    <TabBarProvider>
      <TabsContent />
    </TabBarProvider>
  );
}
