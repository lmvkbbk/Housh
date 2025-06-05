import React, { createContext, useContext, useState, ReactNode } from "react";
import { ACHIEVEMENTS } from "../constants/Achievements";

type AchievementKey = keyof typeof ACHIEVEMENTS;

interface AchievementContextData {
    showAchievement: (key: AchievementKey) => void;
    hideAchievement: () => void;
    visible: boolean;
    achievementKey: AchievementKey | null;
}

const AchievementContext = createContext<AchievementContextData | undefined>(
    undefined,
);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [achievementKey, setAchievementKey] = useState<AchievementKey | null>(
        null,
    );

    const showAchievement = (key: AchievementKey) => {
        setAchievementKey(key);
        setVisible(true);
    };

    const hideAchievement = () => {
        setVisible(false);
        setAchievementKey(null);
    };

    return (
        <AchievementContext.Provider
            value={{
                showAchievement,
                hideAchievement,
                visible,
                achievementKey,
            }}
        >
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievement = (): AchievementContextData => {
    const context = useContext(AchievementContext);
    if (!context)
        throw new Error(
            "useAchievement deve ser usado dentro de AchievementProvider",
        );
    return context;
};
