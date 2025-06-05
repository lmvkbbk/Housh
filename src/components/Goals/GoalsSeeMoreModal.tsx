import { useTheme } from "@/src/context/contextTheme";
import {
    Modal,
    StyleSheet,
    ScrollView,
    ToastAndroid,
    View,
} from "react-native";
import { useEffect, useState } from "react";
import { auth } from "@/src/firebase/config";
import { Header } from "../Headers/header";
import { UserGoal } from "@/src/app/(tabs)/home";
import GroupedGoalsList from "./GroupedGoalsList";
import {
    getGoalUser,
    removeGoalInUser,
    updateGoalsCompleted,
    updateStatusGoalInUser,
    updateUserGoalPoints,
    updateUserPoints,
} from "@/src/services/userServices";
import { getRelativeDateInfo } from "@/src/utils/dateUtils";
import GoalEditModal from "./GoalEditModal";
import EmptyGoalsScreen from "../EmptyScreens/EmptyGoalsScreen";
import { unlockAchievement } from "@/src/services/unlockAchievement";
import { useAchievement } from "@/src/context/contextAchievement";

interface Props {
    title: string;
    visible: boolean;
    goals: UserGoal[];
    onClose: () => void;
    onReload: () => void;
}

export default function GoalsSeeMoreModal({
    title,
    visible,
    goals,
    onClose,
    onReload,
}: Props) {
    const { theme } = useTheme();
    const { showAchievement } = useAchievement();

    const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedGoalForEdit, setSelectedGoalForEdit] =
        useState<UserGoal | null>(null);

    useEffect(() => {
        setUserGoals(goals);
    }, [goals, visible]);

    const loadGoalForEdit = async (goalId: string) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const goal = await getGoalUser(uid, goalId);
        if (goal) {
            setSelectedGoalForEdit(goal);
            setEditModalVisible(true);
        } else {
            ToastAndroid.show("Erro ao carregar a meta.", ToastAndroid.SHORT);
        }
    };

    const handleGoalUpdate = (updatedGoal: UserGoal) => {
        setUserGoals((prevGoals) =>
            prevGoals.map((goal) =>
                goal.id === updatedGoal.id ? updatedGoal : goal,
            ),
        );
        setEditModalVisible(false);
        ToastAndroid.show("Meta atualizada!", ToastAndroid.SHORT);
    };

    const deleteUserGoal = async (goalId: string) => {
        setUserGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        await removeGoalInUser(auth.currentUser?.uid, goalId);
        ToastAndroid.show("Meta removida!", ToastAndroid.SHORT);
        onReload();
    };

    const markGoalAsCompleted = async (goalSelected: UserGoal) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        await updateStatusGoalInUser(uid, goalSelected.id, "Concluida");

        let points = 0;
        if (goalSelected.timeRemaining) {
            const deadline: any = getRelativeDateInfo(
                goalSelected.timeRemaining,
            )?.Value;
            if (deadline < 3) {
                points = 2;
            } else if (deadline > 3 && deadline < 7) {
                points = 6;
            } else if (deadline > 7 && deadline < 14) {
                points = 8;
            } else {
                points = 10;
            }
        } else if (goalSelected.selectedDays) {
            points = 2;
        } else {
            points = 1;
        }

        await updateUserPoints(uid, points);
        await updateUserGoalPoints(uid);

        await updateGoalsCompleted(auth.currentUser?.uid);

        setUserGoals((prev) =>
            prev.map((goal) =>
                goal.id === goalSelected.id
                    ? { ...goal, status: "Concluida" }
                    : goal,
            ),
        );

        ToastAndroid.show("Meta concluída!", ToastAndroid.SHORT);
        onReload();

        if (uid) {
            if (goalSelected.timeRemaining) {
                await unlockAchievement(
                    uid,
                    "challengeCompleted",
                    showAchievement,
                );
            } else {
                await unlockAchievement(
                    uid,
                    "firstGoalCompleted",
                    showAchievement,
                );
            }
        }
    };

    const getEmptyMessageByTitle = (title: string) => {
        switch (title) {
            case "Metas do Dia":
                return {
                    title: "Sem metas para hoje",
                    message: "Você não definiu nenhuma meta para hoje ainda.",
                    icon: "sunny-outline",
                };
            case "Prazos Urgentes":
                return {
                    title: "Nada urgente no momento",
                    message: "Nenhuma meta urgente por aqui. Continue assim!",
                    icon: "alarm-outline",
                };
            case "Metas Livres":
                return {
                    title: "Sem metas livres",
                    message: "Nenhuma meta livre cadastrada ainda.",
                    icon: "flag-outline",
                };
            case "Desafios":
                return {
                    title: "Desafios em aberto",
                    message:
                        "Você ainda não começou nenhum desafio. Que tal criar um?",
                    icon: "flame-outline",
                };
            case "Metas Recorrentes":
                return {
                    title: "Sem metas recorrentes",
                    message:
                        "Nada recorrente por enquanto. Vamos planejar juntos?",
                    icon: "repeat-outline",
                };
            default:
                return {
                    title: "Nenhuma meta encontrada",
                    message:
                        "Você ainda não cadastrou nenhuma meta para esse grupo.",
                    icon: "search-outline",
                };
        }
    };

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
            transparent
        >
            <Header title={title} />

            {userGoals.length > 0 ? (
                <ScrollView style={styles(theme).container}>
                    <GroupedGoalsList
                        goals={userGoals}
                        onEditGoal={loadGoalForEdit}
                        onRemoveGoal={deleteUserGoal}
                        onCompleteGoal={markGoalAsCompleted}
                    />
                </ScrollView>
            ) : (
                <View style={styles(theme).container}>
                    <EmptyGoalsScreen
                        icon={
                            getEmptyMessageByTitle(title).icon.toString() as any
                        }
                        message={getEmptyMessageByTitle(
                            title,
                        ).message.toString()}
                        title={getEmptyMessageByTitle(title).title.toString()}
                    />
                </View>
            )}
            <GoalEditModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onReload={onReload}
                goal={selectedGoalForEdit ? selectedGoalForEdit : null}
                onSave={handleGoalUpdate}
            />
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
    });
