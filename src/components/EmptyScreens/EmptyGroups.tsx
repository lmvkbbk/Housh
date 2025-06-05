import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

export default function EmptyGroups() {
    const { theme } = useTheme();

    return (
        <View style={styles(theme).container}>
            <Ionicons
                name="people-outline"
                size={100}
                color={theme.primary}
                style={styles(theme).icon}
            />
            <Text style={styles(theme).title}>Nenhum grupo encontrado</Text>
            <Text style={styles(theme).subtitle}>
                Junte-se a um grupo ou crie o seu próprio para alcançar metas em
                equipe!
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
        },
        subtitle: {
            fontSize: 16,
            textAlign: "center",
            color: theme.textSecondary,
        },
    });
