import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemeProvider, useTheme } from "../context/contextTheme";

export default function index() {
    const { theme } = useTheme();
    return (
        <ThemeProvider>
            <View style={styles(theme).container}>
                <ActivityIndicator size={40} color={theme.primary} />
            </View>
        </ThemeProvider>
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
