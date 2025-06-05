import React, { ComponentProps } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface Props {
    icon?: IoniconsName;
    title?: string;
    message?: string;
}

export default function EmptyGoalsScreen({ message, title, icon }: Props) {
    const { theme } = useTheme();

    return (
        <View style={styles(theme).container}>
            <Ionicons
                name={icon || "rocket-outline"}
                size={100}
                color={theme.primary}
                style={styles(theme).icon}
            />
            <Text style={styles(theme).title}>
                {title || "Nenhuma meta ainda"}
            </Text>
            <Text style={styles(theme).subtitle}>
                {message ||
                    "Comece definindo um objetivo para conquistar algo incrível!"}
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
