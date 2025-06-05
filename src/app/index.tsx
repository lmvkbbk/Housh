import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "../context/contextTheme";

export default function Index() {
    const { theme } = useTheme();
    return (
        <View style={styles(theme).container}>
            <ActivityIndicator size={40} color={theme.primary} />
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.modalBackground,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
    });
