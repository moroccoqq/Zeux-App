import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import colors from "../../data/colors.json";

const ZeuxIcon_dark = require("../../assets/images/zeuxicon-black.png");
const ZeuxIcon_light = require("../../assets/images/zeuxicon-white.png");

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Dynamically select colors based on theme
  const theme = colorScheme === "dark" ? colors.dark : colors.light;
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
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: theme.background }
        ],
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerTitle: () => <Image source={ZeuxIcon} alt="Zeux" style={styles.headerImageStyle} />,
          headerRight: () => <HeaderRightTitle title="Home" />,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={25} />
          ),
        }}
      />

      <Tabs.Screen
        name="Analytics"
        options={{
          headerTitle: () => <Image source={ZeuxIcon} alt="Zeux" style={styles.headerImageStyle} />,
          headerRight: () => <HeaderRightTitle title="Analytics" />,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "podium" : "podium-outline"} color={color} size={25} />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          headerTitle: () => <Image source={ZeuxIcon} alt="Zeux" style={styles.headerImageStyle} />,
          headerRight: () => <HeaderRightTitle title="Settings" />,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} color={color} size={25} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: "transparent",
    borderTopWidth: 0,
  },
  headerImageStyle: {
    width: 100,
    height: 38,
    resizeMode: "contain",
  },
});
