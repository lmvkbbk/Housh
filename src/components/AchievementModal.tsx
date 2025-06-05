import React from "react";
import { Modal, Text, View, StyleSheet } from "react-native";
import { ACHIEVEMENTS } from "../constants/Achievements";
import { useAchievement } from "../context/contextAchievement";
import {
    Feather,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
} from "@expo/vector-icons";
import { useTheme } from "../context/contextTheme";
import AppButton from "./Buttons/Buttons";

export const AchievementModal = () => {
    const { visible, achievementKey, hideAchievement } = useAchievement();
    const { theme } = useTheme();

    if (!visible || !achievementKey) return null;

    const achievement = ACHIEVEMENTS[achievementKey];
    const IconComponent: any = {
        Feather,
        MaterialCommunityIcons,
        FontAwesome,
        FontAwesome5,
    }[achievement.iconLib];

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={hideAchievement}
        >
            <View style={styles(theme).overlay}>
                <View style={styles(theme).modal}>
                    <View style={styles(theme).iconWrapper}>
                        <IconComponent
                            name={achievement.icon}
                            size={40}
                            color="#fff"
                        />
                    </View>

                    <Text style={styles(theme).headerText}>
                        Conquista desbloqueada!
                    </Text>
                    <Text style={styles(theme).title}>{achievement.title}</Text>
                    <Text style={styles(theme).description}>
                        {achievement.description}
                    </Text>

                    <View style={{ marginTop: 20, width: "100%" }}>
                        <AppButton
                            title="Fechar"
                            onPress={hideAchievement}
                            backgroundColor={theme.secondary}
                            textColor={theme.textPrimary}
                            boldText
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.65)",
            justifyContent: "center",
            alignItems: "center",
        },
        modal: {
            backgroundColor: theme.modalBackground,
            padding: 28,
            borderRadius: 24,
            alignItems: "center",
            width: "85%",
        },
        iconWrapper: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: theme.primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            marginTop: 16,
        },
        headerText: {
            fontSize: 16,
            color: theme.primary,
            fontWeight: "600",
            marginBottom: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.textPrimary,
            textAlign: "center",
        },
        description: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: "center",
            marginTop: 10,
        },
    });
