import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import {
    Feather,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
} from "@expo/vector-icons";
import { ACHIEVEMENTS, AchievementKey } from "@/src/constants/Achievements";
import { useTheme } from "@/src/context/contextTheme";
import { useAchievement } from "@/src/context/contextAchievement";

type Props = {
    achievementKey: AchievementKey;
    unlocked: boolean;
};

export default function AchievementIconSquare({
    achievementKey,
    unlocked,
}: Props) {
    const { showAchievement } = useAchievement();
    const { theme } = useTheme();

    const achievement = ACHIEVEMENTS[achievementKey];
    if (!(achievementKey in ACHIEVEMENTS)) return null;

    const IconComponent: any = {
        Feather,
        MaterialCommunityIcons,
        FontAwesome,
        FontAwesome5,
    }[achievement.iconLib];

    return (
        <TouchableOpacity
            onPress={() => showAchievement(achievementKey)}
            style={[
                styles.square,
                {
                    backgroundColor: unlocked
                        ? theme.primary
                        : theme.textSecondary,
                },
            ]}
        >
            <IconComponent
                name={achievement.icon}
                size={28}
                color={unlocked ? "#fff" : theme.textPrimary}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    square: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        margin: 6,
        elevation: 2,
    },
});
