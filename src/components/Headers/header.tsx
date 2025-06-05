import { useTheme } from "@/src/context/contextTheme";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";

export function Header({ title }: { title: string }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={styles(theme).safeArea}>
            <StatusBar
                barStyle={
                    theme.mode === "dark" ? "light-content" : "dark-content"
                }
                backgroundColor={theme.modalBackground}
            />
            <View style={[styles(theme).headerContainer]}>
                <Text style={styles(theme).headerText}>{title}</Text>
                <View style={styles(theme).underline} />
            </View>
        </SafeAreaView>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        safeArea: {
            backgroundColor: theme.background,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        headerContainer: {
            backgroundColor: theme.modalBackground,
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            alignItems: "center",
        },
        headerText: {
            fontSize: 22,
            fontWeight: "700",
            color: theme.textPrimary,
            letterSpacing: 0.5,
        },
        underline: {
            marginTop: 6,
            width: 40,
            height: 3,
            borderRadius: 2,
            backgroundColor: theme.primary,
        },
    });
