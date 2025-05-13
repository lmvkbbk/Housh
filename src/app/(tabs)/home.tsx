import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/src/styles/colors";
import {
    addGoalInUser,
    getUserGoals,
    removeGoalInUser,
    updateLastDateGoalInUser,
    updateStatusGoalInUser,
} from "@/src/services/userServices";
import { Header } from "@/src/components/header";
import Goal from "@/src/components/Goals/goal";
import CreateGoal from "@/src/components/Goals/createGoal";
import { auth } from "@/src/firebase/config";
import { useTheme } from "@/src/context/contextTheme";
import AppButton from "@/src/components/Buttons/Buttons";
import { getRelativeDateInfo } from "@/src/utils/dateUtils";
import EmptyGoals from "@/src/components/EmptyGoals";

interface GoalType {
    id: string;
    name: string;
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
    lastDate: Date;
}

export default function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const noteColors = Object.values(colors.notes);
    const [goals, setGoals] = useState<GoalType[]>([]);

    const goalsWithDeadline = goals.filter(
        (goal) => goal.timeRemaining && !goal.selectedDays,
    );
    const recurringGoals = goals.filter(
        (goal) => goal.selectedDays && !goal.timeRemaining,
    );

    const { theme } = useTheme();

    const [refreshing, setRefreshing] = useState(false);

    const removeGoal = async (goalId: string) => {
        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        await removeGoalInUser(auth.currentUser?.uid, goalId);
        //notificacao pra confirmar que a meta foi removida
        ToastAndroid.show("Meta removida!", ToastAndroid.SHORT);
    };
    const completeGoal = async (goalId: String) => {
        await updateStatusGoalInUser(
            auth.currentUser?.uid,
            goalId,
            "Concluida",
        );
        ToastAndroid.show("Meta concluída!", ToastAndroid.SHORT);
        await loadGoals();
    };

    const handleReload = async () => {
        setRefreshing(true);
        await loadGoals();
        setRefreshing(false);
    };

    //reinicia ou atualiza o status das metas
    const verifyGoals = (loadedGoals: GoalType[]) => {
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
                if (deadline && deadline < 0 && goal.status !== "Atrasada") {
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
                const goalDateOnly = new Date(goal.lastDate).setHours(
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
        setGoals(updatedGoals);
    };

    const loadGoals = async () => {
        const userGoals = await getUserGoals(auth.currentUser?.uid);
        //goalsArray recebe os dados do usuario em obj e transformado em array
        if (userGoals) {
            const goalsArray = Object.keys(userGoals).map((key) => ({
                ...userGoals[key],
                id: key,
            }));
            verifyGoals(goalsArray);
        } else {
            return;
        }
    };

    //useEffect pra carregar as metas do usuario, quando carregar tela home
    useEffect(() => {
        loadGoals();
    }, []);

    //Funcao q eh chamada quando o usuario cria uma meta nova
    const addGoal = (
        name: string,
        description?: string,
        timeRemaining?: Date,
        status?: string,
        selectedDays?: Object,
    ) => {
        const randomColor =
            noteColors[Math.floor(Math.random() * noteColors.length)];
        const newGoal = {
            id: Date.now().toString(),
            name,
            description,
            timeRemaining,
            status,
            selectedDays: selectedDays || null,
            color: randomColor,
            lastDate: selectedDays ? new Date() : null,
        };

        //atualiza o usuario com a nova meta
        addGoalInUser(auth.currentUser?.uid, newGoal);

        loadGoals();
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles(theme).container}>
            <Header title="Suas Metas" />

            {goals.length > 0 ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleReload}
                        />
                    }
                    contentContainerStyle={styles(theme).goalContainer}
                >
                    {goalsWithDeadline.length > 0 && (
                        <>
                            <View style={styles(theme).sectionHeader}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color={theme.textPrimary}
                                />
                                <Text style={styles(theme).sectionTitleText}>
                                    Desafios
                                </Text>
                            </View>
                            {goalsWithDeadline.map((goal) => (
                                <TouchableOpacity key={goal.id}>
                                    <Goal
                                        id={goal.id}
                                        name={goal.name}
                                        description={goal.description}
                                        timeRemaining={goal.timeRemaining}
                                        status={goal.status}
                                        selectedDays={goal.selectedDays}
                                        color={goal.color}
                                        onRemove={() => removeGoal(goal.id)}
                                        onComplete={() => completeGoal(goal.id)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    {recurringGoals.length > 0 && (
                        <>
                            <View style={styles(theme).sectionHeader}>
                                <Ionicons
                                    name="repeat-outline"
                                    size={20}
                                    color={theme.textPrimary}
                                />
                                <Text style={styles(theme).sectionTitleText}>
                                    Meta Diaria
                                </Text>
                            </View>
                            {recurringGoals.map((goal) => (
                                <TouchableOpacity key={goal.id}>
                                    <Goal
                                        id={goal.id}
                                        name={goal.name}
                                        description={goal.description}
                                        timeRemaining={goal.timeRemaining}
                                        status={goal.status}
                                        selectedDays={goal.selectedDays}
                                        color={goal.color}
                                        onRemove={() => removeGoal(goal.id)}
                                        onComplete={() => completeGoal(goal.id)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </ScrollView>
            ) : (
                <EmptyGoals />
            )}

            <AppButton
                icon="flag-outline"
                title="Criar meta"
                boldText={true}
                onPress={() => setModalVisible(true)}
                backgroundColor={theme.modalBackground}
                propStyle={styles(theme).fab}
                textColor={theme.textPrimary}
            />

            <CreateGoal
                visible={modalVisible}
                onConfirm={addGoal}
                onCancel={handleCancel}
            />
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
        },
        goalContainer: {
            width: "100%",
            paddingBottom: 80,
        },
        fab: {
            position: "absolute",
            right: 16,
            bottom: 16,
            borderRadius: 35,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.primary,
        },
        sectionTitleText: {
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 8,
            color: theme.textPrimary,
            marginTop: 1,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 16,
        },
    });
