import { useTheme } from "@/src/context/contextTheme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface GoallAcessCardProps {
    title: string;
    iconName: IoniconsName;
    color?: string;
    count: number;
    onPress: () => void;
}

export default function GoalAccessCard({
    title,
    iconName,
    color,
    count,
}: GoallAcessCardProps) {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles(theme).goalCard,
                color && { backgroundColor: color },
            ]}
        >
            <Ionicons name={iconName} size={24} color={theme.textPrimary} />
            <Text style={styles(theme).cardTitle}>{title}</Text>
            <Text style={styles(theme).cardCount}>{count}</Text>
        </TouchableOpacity>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        goalCard: {
            flex: 1,
            padding: 16,
            borderRadius: 12,
            marginHorizontal: 4,
            alignItems: "center",
            backgroundColor: theme.primary,
        },
        cardTitle: {
            fontSize: 14,
            marginTop: 8,
            color: theme.textPrimary,
        },
        cardCount: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textPrimary,
        },
    });
