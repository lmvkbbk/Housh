import {
    View,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator,
    Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    getGoalUser,
    getUserGoals,
    removeGoalInUser,
    updateLastDateGoalInUser,
    updateStatusGoalInUser,
    updateUserGoalPoints,
    updateUserPoints,
} from "@/src/services/userServices";
import GoalCreationModal from "@/src/components/Goals/GoalCreationModal";
import { auth, db } from "@/src/firebase/config";
import { useTheme } from "@/src/context/contextTheme";
import AppButton from "@/src/components/Buttons/Buttons";
import { getRelativeDateInfo } from "@/src/utils/dateUtils";
import { Header } from "@/src/components/Headers/header";
import EmptyGoalsScreen from "@/src/components/EmptyScreens/EmptyGoalsScreen";
import GoalEditModal from "@/src/components/Goals/GoalEditModal";
import GroupedGoalsList from "@/src/components/Goals/GroupedGoalsList";
import GoalsSeeMoreModal from "@/src/components/Goals/GoalsSeeMoreModal";
import { unlockAchievement } from "@/src/services/unlockAchievement";
import { useAchievement } from "@/src/context/contextAchievement";
import { onValue, ref } from "firebase/database";
import SequenceCard from "@/src/components/SequenceCard";
import { LinearGradient } from "expo-linear-gradient";

export interface UserGoal {
    id: string;
    title: string;
    description?: string;
    timeRemaining?: Date;
    status?: string;
    selectedDays?: {
        dom: boolean;
        seg: boolean;
        ter: boolean;
        qua: boolean;
        qui: boolean;
        sex: boolean;
        sab: boolean;
    };
    color: string;
    lastUpdated: Date;
}

export default function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [showSeeMoreModal, setShowSeeMoreModal] = useState(false);

    const [lastSequence, setLastSequence] = useState<Date | null>(null);
    const [sequenceDays, setSequenceDays] = useState<number>(0);

    const [userGoalsList, setUserGoalsList] = useState<UserGoal[]>([]);
    const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<UserGoal>();

    // Seleciona as metas abertas ( sem limite de tempo e nem repeticao diaria)
    const freeFormGoals = userGoalsList.filter(
        (goal) => !goal.timeRemaining && !goal.selectedDays,
    );

    // Seleciona as metas Diarias ( se repetem de acordo com os dias escolhidos na semana)
    const deadlineBasedGoals = userGoalsList.filter(
        (goal) => goal.timeRemaining && !goal.selectedDays,
    );

    const urgentDeadlineGoals = userGoalsList.filter((goal) => {
        const remainingDays = goal.timeRemaining
            ? getRelativeDateInfo(goal.timeRemaining)?.Value
            : null;
        return remainingDays && remainingDays <= 5 && !goal.selectedDays;
    });

    // Seleciona as metas desafio ( possuem um tempo maximo para conclusao, de ate 30 dias)
    const dailyRecurringGoals = userGoalsList.filter(
        (goal) => goal.selectedDays && !goal.timeRemaining,
    );

    const diasChave = [
        "dom",
        "seg",
        "ter",
        "qua",
        "qui",
        "sex",
        "sab",
    ] as const;
    const hojeIndex = new Date().getDay();
    const hojeChave = diasChave[hojeIndex];

    const dailyRecurringGoalsToday = userGoalsList.filter(
        (goal) => goal.selectedDays?.[hojeChave] && !goal.timeRemaining,
    );

    const [selectedGoals, setSeletedGoals] = useState<UserGoal[]>([]);
    const [titleModal, setTitleModal] = useState("");

    const seeMoreModal = (goals: UserGoal[], title: string) => {
        setTitleModal(title);
        setSeletedGoals(goals);
        setShowSeeMoreModal(true);
    };

    const { theme } = useTheme();
    const { showAchievement } = useAchievement();
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserGoals = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            console.log("Usuário não autenticado");
            return;
        }

        const userGoals = await getUserGoals(uid);

        if (userGoals) {
            const goalsArray = Object.keys(userGoals).map((key) => ({
                ...userGoals[key],
                id: key,
            }));
            await updateGoalsStatusBasedOnDate(goalsArray);
        } else {
            setUserGoalsList([]);
            console.log("Nenhuma meta encontrada");
        }
    };

    const loadGoalForEdit = async (goalId: string) => {
        const goal = await getGoalUser(auth.currentUser?.uid, goalId);
        if (goal) {
            setSelectedGoalForEdit(goal);
            setEditModalVisible(true);
        } else {
            ToastAndroid.show("Erro ao carregar a meta.", ToastAndroid.SHORT);
        }
    };

    const deleteUserGoal = async (goalId: string) => {
        setUserGoalsList((prev) => prev.filter((goal) => goal.id !== goalId));

        await removeGoalInUser(auth.currentUser?.uid, goalId);
        ToastAndroid.show("Meta removida!", ToastAndroid.SHORT);
    };

    const markGoalAsCompleted = async (goal: UserGoal) => {
        const uid = auth.currentUser?.uid;
        await updateStatusGoalInUser(uid, goal.id, "Concluida");

        // Atribui Pontuacao ao usuario de acordo com tipo de meta
        let points = 0;
        if (goal.timeRemaining) {
            const deadline: any = getRelativeDateInfo(
                goal.timeRemaining,
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
        } else if (goal.selectedDays) {
            points = 2;
        } else {
            points = 1;
        }

        await updateUserPoints(auth.currentUser?.uid, points);
        await updateUserGoalPoints(auth.currentUser?.uid);

        ToastAndroid.show("Meta concluída!", ToastAndroid.SHORT);

        fetchUserGoals();
        if (uid) {
            if (goal.timeRemaining) {
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

    const refreshUserGoals = async () => {
        setRefreshing(true);
        await fetchUserGoals();
        setRefreshing(false);
    };

    //reinicia ou atualiza o status das metas
    const updateGoalsStatusBasedOnDate = async (loadedGoals: UserGoal[]) => {
        //timestamp pra remover o fuso
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        const localDateOnly = new Date(
            today.getTime() - timezoneOffset,
        ).setHours(0, 0, 0, 0);

        const updatedGoals = loadedGoals.map((goal) => {
            /*quando o usuario passa da data limite da meta, ao abrir
            o celular a meta e atualizada para atrasada*/
            if (goal.timeRemaining) {
                const deadline = getRelativeDateInfo(goal.timeRemaining)?.Value;
                if (
                    deadline &&
                    deadline < 0 &&
                    goal.status !== "Atrasada" &&
                    goal.status !== "Concluida"
                ) {
                    updateStatusGoalInUser(
                        auth.currentUser?.uid,
                        goal.id,
                        "Atrasada",
                    );
                    return { ...goal, status: "Atrasada" };
                }
            }
            /*se a meta for diaria ela repete a meta, atualizando o status
            pra pendente caso tenha completa no dia anterior*/
            if (goal.selectedDays) {
                const goalDateOnly = new Date(goal.lastUpdated).setHours(
                    0,
                    0,
                    0,
                    0,
                );

                if (goalDateOnly !== localDateOnly) {
                    updateLastDateGoalInUser(auth.currentUser?.uid, goal.id);
                    updateStatusGoalInUser(
                        auth.currentUser?.uid,
                        goal.id,
                        "Pendente",
                    );
                    return { ...goal, status: "Pendente" };
                }
            }

            return goal;
        });
        setUserGoalsList(updatedGoals);
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const uid = auth.currentUser?.uid;

        const loadGoals = async () => {
            setLoading(true);
            await fetchUserGoals();
            setLoading(false);
        };

        const daysRef = ref(db, `Users/${uid}`);
        const unsubscribe = onValue(daysRef, async (snapshot) => {
            const userData = snapshot.val();

            if (!uid) return;

            if (userData.DaysInSequence >= 30) {
                await unlockAchievement(
                    uid,
                    "thirtyDaysUsage",
                    showAchievement,
                );
            }

            if (userData.DaysInSequence >= 182) {
                await unlockAchievement(uid, "veteranUser", showAchievement);
            }

            if (userData.GoalsCompleted >= 5) {
                await unlockAchievement(
                    uid,
                    "fiveGoalsCompleted",
                    showAchievement,
                );
            }

            if (userData.lastCompletedDate) {
                setLastSequence(userData.lastCompletedDate);
            }
            if (userData.DaysInSequence) {
                setSequenceDays(userData.DaysInSequence);
            }
        });

        loadGoals();
        return () => unsubscribe();
    }, []);

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleCloseModalSeeMore = async () => {
        setShowSeeMoreModal(false);
    };

    const handleReloadModalSeeMore = async () => {
        fetchUserGoals();
    };

    return (
        <SafeAreaView style={styles(theme).container}>
            <Header title="Suas Metas" />

            <GoalsSeeMoreModal
                title={titleModal}
                visible={showSeeMoreModal}
                goals={selectedGoals}
                onClose={handleCloseModalSeeMore}
                onReload={handleReloadModalSeeMore}
            />
            {loading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size={50} color={theme.primary} />
                    <Text
                        style={{
                            marginTop: 12,
                            color: theme.textSecondary,
                            fontSize: 16,
                        }}
                    >
                        Só um instante... preparando suas metas!
                    </Text>
                </View>
            ) : userGoalsList.length > 0 ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshUserGoals}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles(theme).scrollContent}
                >
                    <SequenceCard
                        lastDate={lastSequence}
                        currentStreak={sequenceDays}
                    />
                    <GroupedGoalsList
                        title="Metas do Dia"
                        icon="sunny-outline"
                        miniCard
                        goals={dailyRecurringGoalsToday}
                        onEditGoal={(goalId) => loadGoalForEdit(goalId)}
                        onRemoveGoal={(goalId) => deleteUserGoal(goalId)}
                        onCompleteGoal={(goalId) => markGoalAsCompleted(goalId)}
                        onSeeMore={(titleModal) =>
                            seeMoreModal(dailyRecurringGoalsToday, titleModal)
                        }
                    />

                    <GroupedGoalsList
                        title="Prazos Urgentes"
                        icon="alert-circle-outline"
                        goals={urgentDeadlineGoals}
                        collapsedButton
                        onEditGoal={(goalId) => loadGoalForEdit(goalId)}
                        onRemoveGoal={(goalId) => deleteUserGoal(goalId)}
                        onCompleteGoal={(goalId) => markGoalAsCompleted(goalId)}
                        onSeeMore={(titleModal) => {
                            seeMoreModal(urgentDeadlineGoals, titleModal);
                        }}
                    />

                    <GroupedGoalsList
                        title="Metas Livres"
                        icon="bulb-outline"
                        goals={freeFormGoals}
                        miniCard
                        onEditGoal={(goalId) => loadGoalForEdit(goalId)}
                        onRemoveGoal={(goalId) => deleteUserGoal(goalId)}
                        onCompleteGoal={(goalId) => markGoalAsCompleted(goalId)}
                        onSeeMore={(titleModal) => {
                            seeMoreModal(freeFormGoals, titleModal);
                        }}
                    />

                    <GroupedGoalsList
                        title="Desafios"
                        icon="flag-outline"
                        goals={deadlineBasedGoals}
                        miniCard
                        onEditGoal={(goalId) => loadGoalForEdit(goalId)}
                        onRemoveGoal={(goalId) => deleteUserGoal(goalId)}
                        onCompleteGoal={(goalId) => markGoalAsCompleted(goalId)}
                        onSeeMore={(titleModal) => {
                            seeMoreModal(deadlineBasedGoals, titleModal);
                        }}
                    />

                    <GroupedGoalsList
                        title="Metas Recorrentes"
                        icon="repeat-outline"
                        goals={dailyRecurringGoals}
                        miniCard
                        onEditGoal={(goalId) => loadGoalForEdit(goalId)}
                        onRemoveGoal={(goalId) => deleteUserGoal(goalId)}
                        onCompleteGoal={(goalId) => markGoalAsCompleted(goalId)}
                        onSeeMore={(titleModal) => {
                            seeMoreModal(dailyRecurringGoals, titleModal);
                        }}
                    />
                </ScrollView>
            ) : (
                <View>
                    <SequenceCard
                        lastDate={lastSequence}
                        currentStreak={sequenceDays}
                    />
                    <EmptyGoalsScreen />
                </View>
            )}

            <AppButton
                icon="flag-outline"
                title="Criar meta"
                boldText={true}
                onPress={() => setModalVisible(true)}
                backgroundColor={theme.cardAccent}
                propStyle={styles(theme).fab}
                textColor={theme.textPrimary}
            />
            <GoalEditModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onReload={fetchUserGoals}
                goal={selectedGoalForEdit ? selectedGoalForEdit : null}
            />
            <GoalCreationModal
                visible={modalVisible}
                onReload={fetchUserGoals}
                onCancel={handleCancel}
            />
        </SafeAreaView>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            backgroundColor: theme.background,
        },
        scrollContent: {
            paddingBottom: 90,
            paddingHorizontal: 16,
            gap: 12,
        },
        fab: {
            position: "absolute",
            right: 16,
            bottom: 16,
            borderRadius: 35,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        fadeTop: {
            position: "absolute",
            right: 0,
            top: -12,
            bottom: 0,
            width: 30,
            zIndex: 10,
        },
    });
