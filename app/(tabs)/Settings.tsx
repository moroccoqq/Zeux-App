import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../data/colors.json";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colors[colorScheme];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: themeColors.cards }]}>
        {children}
      </View>
    </View>
  );
};

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: SettingsItemProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colors[colorScheme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: themeColors.cards },
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: themeColors.buttons }]}
        >
          <Ionicons name={icon} size={22} color={themeColors.text} />
        </View>
        <View style={styles.itemText}>
          <Text style={[styles.itemTitle, { color: themeColors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.itemSubtitle, { color: themeColors.subtitles }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={20} color={themeColors.text} />
      )}
    </Pressable>
  );
};

export default function Settings() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = colors[colorScheme];

  const [notifications, setNotifications] = useState(true);

  const handleProfile = () => router.push("/profile");

  const handleNotifications = (value: boolean) => setNotifications(value);

  const handleAbout = () =>
    Alert.alert(
      "About Fit AI",
      "Version 1.0.0\n\nFit AI is your personal fitness assistant powered by artificial intelligence.",
      [{ text: "OK" }]
    );

  const handlePrivacyPolicy = () => Linking.openURL("https://fitai.com/privacy");

  const handleTerms = () => Linking.openURL("https://fitai.com/terms");

  const handleContact = () => Linking.openURL("mailto:support@fitai.com");

  const handleRateApp = () => {
    const storeUrl =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/id123456789"
        : "https://play.google.com/store/apps/details?id=com.fitai";
    Linking.openURL(storeUrl);
  };

  const handleLogout = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar
        backgroundColor={themeColors.background}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView style={styles.scrollView}>
        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Profile"
            subtitle="Edit your profile information"
            onPress={handleProfile}
          />
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={handleNotifications}
                trackColor={{
                  false: themeColors.subtitles,
                  true: themeColors.buttons,
                }}
                thumbColor={themeColors.text}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="App">
          <SettingsItem
            icon="information-circle-outline"
            title="About"
            onPress={handleAbout}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={handleTerms}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem icon="mail-outline" title="Contact Us" onPress={handleContact} />
          <SettingsItem icon="star-outline" title="Rate App" onPress={handleRateApp} />
        </SettingsSection>

        <Pressable
          style={[styles.logoutButton, { backgroundColor: themeColors.buttons }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: themeColors.text }]}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
    },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});