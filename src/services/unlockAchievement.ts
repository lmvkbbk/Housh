import { getDatabase, ref, get, set } from "firebase/database";
import { ACHIEVEMENTS } from "../constants/Achievements";

export const unlockAchievement = async (
    userId: string,
    key: keyof typeof ACHIEVEMENTS,
    showAchievement: (key: keyof typeof ACHIEVEMENTS) => void,
) => {
    const db = getDatabase();
    const achievementRef = ref(db, `Users/${userId}/userAchievements/${key}`);

    const snapshot = await get(achievementRef);
    console.log(
        snapshot.exists()
            ? `sim ja tem consquista ${ACHIEVEMENTS[key].title}`
            : "nao",
    );
    if (!snapshot.exists()) {
        await set(achievementRef, true);
        showAchievement(key);
        console.log(`Conquista desbloqueada: ${ACHIEVEMENTS[key].title}`);
    }
};
