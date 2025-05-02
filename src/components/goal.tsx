import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import componentColors from "@/src/styles/componentColors";
import { getRelativeDateInfo } from "../utils/dateUtils";

interface GoalProps {
    id: string;
    name: string;
    description?: string;
    timeRemaining?: Date;
    status?: string;
    color: string;
}

const Goal: React.FC<GoalProps> = ({
    id,
    name,
    description,
    timeRemaining,
    status,
    color,
}) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: color }]}
        >
            <Text style={styles.title}>{name}</Text>

            {description && (
                <Text style={styles.description}>{description}</Text>
            )}

            <View style={styles.infoContainer}>
                {timeRemaining && (
                    <View style={styles.timeContainer}>
                        <FontAwesome5
                            name="hourglass-half"
                            size={16}
                            color={componentColors.netral}
                            style={styles.icon}
                        />
                        <Text style={styles.timeText}>
                            {getRelativeDateInfo(timeRemaining)?.Text}
                        </Text>
                    </View>
                )}
                {status && (
                    <View style={styles.statusContainer}>
                        <FontAwesome5
                            name={
                                status === "completo" ? "check-circle" : "clock"
                            }
                            size={16}
                            color={
                                status === "completed"
                                    ? componentColors.correct
                                    : componentColors.netral
                            }
                            style={styles.icon}
                        />
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 10,
        padding: 20,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    description: {
        fontSize: 15,
        color: "#f5f5f5",
        marginBottom: 10,
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    icon: {
        marginRight: 6,
    },
    timeText: {
        fontSize: 13,
        color: "#e0e0e0",
    },
    statusText: {
        fontSize: 13,
        color: "#e0e0e0",
    },
});

export default Goal;
