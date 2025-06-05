import { ref, get, update } from "firebase/database";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { db } from "../firebase/config";

function updateStreak(lastDateStr: string | null, currentStreak: number) {
    const today = new Date();

    if (!lastDateStr) {
        return {
            currentStreak: 1,
            lastCompletedDate: format(today, "yyyy-MM-dd"),
        };
    }

    const lastDate = parseISO(lastDateStr);
    const diff = differenceInCalendarDays(today, lastDate);

    if (diff === 1) {
        return {
            currentStreak: currentStreak + 1,
            lastCompletedDate: format(today, "yyyy-MM-dd"),
        };
    } else if (diff === 0) {
        return {
            currentStreak,
            lastCompletedDate: lastDateStr,
        };
    } else {
        return {
            currentStreak: 1,
            lastCompletedDate: format(today, "yyyy-MM-dd"),
        };
    }
}

export async function onTaskCompleted(userUID: string) {
    try {
        const userRef = ref(db, `Users/${userUID}`);

        const snapshot = await get(userRef);
        const userData = snapshot.exists() ? snapshot.val() : null;

        const lastDate = userData?.lastCompletedDate || null;
        const currentStreak = userData?.DaysInSequence || 0;

        const updatedStreakData = updateStreak(lastDate, currentStreak);

        if (
            updatedStreakData.currentStreak !== currentStreak ||
            updatedStreakData.lastCompletedDate !== lastDate
        ) {
            await update(userRef, {
                DaysInSequence: updatedStreakData.currentStreak,
                lastCompletedDate: updatedStreakData.lastCompletedDate,
            });
        }

        return updatedStreakData.currentStreak;
    } catch (error) {
        console.error("Erro ao atualizar streak:", error);
        throw error;
    }
}
