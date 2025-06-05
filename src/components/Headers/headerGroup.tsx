import { useTheme } from "@/src/context/contextTheme";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import AppButton from "../Buttons/Buttons";

type HeaderGroupProps = {
    title: string;
    leader?: boolean;
    onPressInfo?: () => void;
    onPressConfig?: () => void;
};

export function HeaderGroup({
    title,
    leader,
    onPressInfo,
    onPressConfig,
}: HeaderGroupProps) {
    const { theme } = useTheme();
    const teste = StatusBar.currentHeight;

    return (
        <SafeAreaView style={styles(theme).safeArea}>
            <StatusBar
                barStyle={
                    theme.mode === "dark" ? "light-content" : "dark-content"
                }
                backgroundColor={theme.modalBackground}
            />

            <View style={styles(theme).headerContainer}>
                <Text numberOfLines={10} style={styles(theme).headerText}>
                    {title}
                </Text>
                <View style={styles(theme).underline} />
            </View>
            {leader && (
                <AppButton
                    icon="settings-outline"
                    backgroundColor={theme.cardAccent}
                    textColor={theme.primary}
                    onPress={onPressConfig}
                    propStyle={{
                        position: "absolute",
                        left: 12,
                        top: 0,
                    }}
                />
            )}
            <AppButton
                icon="information-circle"
                backgroundColor={theme.cardAccent}
                textColor={theme.primary}
                onPress={onPressInfo}
                propStyle={{
                    position: "absolute",
                    right: 12,
                    top: 0,
                }}
            />
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
            paddingTop: 12,
            paddingBottom: 16,
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
            paddingTop: 0,
            textAlign: "center",
            width: "70%",
        },
        underline: {
            marginTop: 6,
            width: 40,
            height: 3,
            borderRadius: 2,
            backgroundColor: theme.primary,
        },
        icon: {
            position: "absolute",
            left: 52,
            zIndex: 1,
            top: 8,
        },
    });
