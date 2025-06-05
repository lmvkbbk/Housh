import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

export default function EmptyGoalsGroups() {
    const { theme } = useTheme();

    return (
        <View style={styles(theme).container}>
            <Ionicons
                name="list-circle-outline"
                size={100}
                color={theme.primary}
                style={styles(theme).icon}
            />
            <Text style={styles(theme).title}>Nenhuma meta no grupo</Text>
            <Text style={styles(theme).subtitle}>
                Este grupo ainda não possui metas definidas ou disponiveis. Se
                você for um líder, que tal começar agora?
            </Text>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
        },
        icon: {
            marginBottom: 20,
            opacity: 0.85,
        },
        title: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: 10,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 16,
            textAlign: "center",
            color: theme.textSecondary,
        },
    });
