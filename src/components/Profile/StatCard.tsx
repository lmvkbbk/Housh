import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/contextTheme";

interface StatCardProps {
    icon: React.ReactNode;
    number: number;
    text: string;
    flexDirection?: boolean;
}

export function StatCard({ icon, number, text, flexDirection }: StatCardProps) {
    const { theme } = useTheme();
    return (
        <View
            style={[
                flexDirection
                    ? styles(theme).pointsContainer
                    : styles(theme).statCard,
            ]}
        >
            {icon}
            {flexDirection ? (
                <Text style={styles(theme).pointsText}>
                    {number} {text}
                </Text>
            ) : (
                <View style={[{ alignItems: "center" }]}>
                    <Text style={styles(theme).statNumber}>{number}</Text>
                    <Text style={styles(theme).statLabel}>{text}</Text>
                </View>
            )}
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        statCard: {
            alignItems: "center",
            backgroundColor: theme.cardAccent,
            padding: 12,
            borderRadius: 15,
            width: "45%",
        },
        statNumber: {
            color: theme.textPrimary,
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 5,
        },
        statLabel: {
            color: theme.textPrimary,
            fontSize: 14,
        },
        pointsContainer: {
            flexDirection: "row",
            backgroundColor: theme.cardAccent,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 15,
            marginTop: 10,
        },
        pointsText: {
            color: theme.textPrimary,
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 5,
        },
    });
