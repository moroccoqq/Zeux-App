import { Stack } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AllTrainings() {
    const trainingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const allTrainings = [
        { day: "Wednesday", type: "💪 Strength", duration: "30 min", kcal: "300 kcal" },
        { day: "Wednesday", type: "🏃 Run", duration: "5 km", kcal: "250 kcal" },
        { day: "Friday", type: "🧘 Yoga", duration: "40 min", kcal: "200 kcal" },
        { day: "Sunday", type: "🍳 Cooking", duration: "10 min", kcal: "150 kcal" },
        { day: "Sunday", type: "🍜 Cooking", duration: "10 min", kcal: "150 kcal" }, 
        { day: "Monday", type: "🏃 Run", duration: "5 km", kcal: "250 kcal" },
        { day: "Wednesday", type: "🧘 Yoga", duration: "40 min", kcal: "100 kcal"}, 
        { day: "Friday", type: "💪 Strength", duration: "30 min", kcal: "300 kcal" },
        { day: "Saturday", type: "🏃 Run", duration: "5 km", kcal: "250 kcal" },
        { day: "Saturday", type: "🧘 Yoga", duration: "40 min", kcal: "200 kcal" }, 
        { day: "Sunday", type: "🍳 Cooking", duration: "10 min", kcal: "150 kcal" },
        { day: "Sunday", type: "🍜 Cooking", duration: "10 min", kcal: "150 kcal" },
    ];

    const groupedTrainings = trainingDays.map(day => ({
        day,
        trainings: allTrainings.filter(training => training.day === day)
    }))
    .filter(group => group.trainings.length > 0);

    return (
        <>
            <Stack.Screen 
                options={{ 
                    headerStyle: {
                        backgroundColor: "#d9d3ce",
                    },
                    headerTintColor: "#41331b",
                    headerTitle: "",
                    headerShadowVisible: false, 
                }} 
            />
            <SafeAreaView style={styles.fullScreen}>
                <StatusBar backgroundColor="#d9d3ce" barStyle="dark-content" />
                <ScrollView style={styles.container}>
                    {groupedTrainings.map((group, idx) => (
                        <View key={`group-${idx}`} style={styles.dayGroup}>
                            <Text style={styles.dayHeader}>{group.day}</Text>
                            {group.trainings.map((training, trainingIdx) => (
                                <View key={`training-${trainingIdx}`} style={styles.trainingItem}>
                                    <Text style={styles.trainingInfo}>{training.type}</Text>
                                    <Text style={styles.trainingInfo}>{training.duration}</Text>
                                    <Text style={styles.trainingInfo}>{training.kcal}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: "#d9d3ce",
    },
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: "#41331b",
    },
    trainingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#302f2c",
        borderRadius: 8,
        backgroundColor: "#e8e6dd",
        marginBottom: 8,
        elevation: 5,
    }, 
    trainingInfo: {
        fontSize: 18,
        color: "#41331b",
    }, 
    verticalLine: {
        fontSize: 18,
        color: "#41331b",
        fontWeight: "600"
    }, 
    dayGroup: {
        marginBottom: 20,
        marginTop: 0,
    },
    dayHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#41331b',
        marginBottom: 10,
        paddingHorizontal: 10,
        marginTop: 5,
    }
});