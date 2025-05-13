import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/contextTheme";

interface StatCardProps {
    theme: any;
    icon: React.ReactNode;
    number: number;
    label: string;
}

export function StatCard({ icon, number, label }: StatCardProps) {
    const { theme } = useTheme();
    return (
        <View style={styles(theme).statCard}>
            {icon}
            <Text style={styles(theme).statNumber}>{number}</Text>
            <Text style={styles(theme).statLabel}>{label}</Text>
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
    });
