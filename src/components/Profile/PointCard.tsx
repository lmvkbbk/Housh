import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";
interface PointsCardProps {
    theme: any;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    text: string;
}

export function PointsCard({ icon, color, text }: PointsCardProps) {
    const { theme } = useTheme();
    return (
        <View style={styles(theme).pointsContainer}>
            <Ionicons name={icon} size={24} color={color} />
            <Text style={styles(theme).pointsText}>{text}</Text>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        pointsContainer: {
            flexDirection: "row",
            alignItems: "center",
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
