import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/contextTheme";
import { format } from "date-fns";

export default function SequenceCard({
    lastDate,
    currentStreak,
}: {
    lastDate: any;
    currentStreak: number;
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isStartingStreak = currentStreak === 0;
    const hasStreakToday = lastDate === format(today, "yyyy-MM-dd");
    const daysInSequence = currentStreak;

    const { theme } = useTheme();
    return (
        <View
            style={[
                styles(theme).card,
                isStartingStreak
                    ? styles(theme).cardNeutral
                    : hasStreakToday
                      ? styles(theme).cardSuccess
                      : styles(theme).cardWarning,
            ]}
        >
            {isStartingStreak ? (
                <Feather
                    name="target"
                    size={40}
                    color="#222"
                    style={styles(theme).icon}
                />
            ) : hasStreakToday ? (
                <FontAwesome5
                    name="fire-alt"
                    size={40}
                    color="#fff"
                    style={styles(theme).icon}
                />
            ) : (
                <Feather
                    name="clock"
                    size={40}
                    color="#222"
                    style={styles(theme).icon}
                />
            )}

            <Text style={styles(theme).title}>
                {isStartingStreak
                    ? "Comece sua jornada!"
                    : hasStreakToday
                      ? "Parabéns!"
                      : "Não esqueça!"}
            </Text>

            <Text style={styles(theme).message}>
                {isStartingStreak
                    ? "Você ainda não começou sua sequência. Complete sua primeira meta diária hoje!"
                    : hasStreakToday
                      ? `Você está em uma sequência de ${daysInSequence} dias. Continue assim!`
                      : "Mantenha sua sequência viva hoje! Faça sua meta diária agora."}
            </Text>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        card: {
            padding: 20,
            borderRadius: 20,
            margin: 16,
            alignItems: "center",
            alignSelf: "center",
            width: "90%",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
        },
        cardSuccess: {
            backgroundColor: theme.primary,
        },
        cardWarning: {
            backgroundColor: theme.secondary,
        },
        cardNeutral: {
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
        },
        icon: {
            marginBottom: 8,
        },
        title: {
            fontSize: 22,
            fontWeight: "700",
            color: "#222",
            marginBottom: 6,
        },
        message: {
            fontSize: 15,
            textAlign: "center",
            color: "#333",
        },
    });
