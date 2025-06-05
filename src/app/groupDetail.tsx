import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import AppConfirmModal from "../components/AppConfirmModal";
import AppButton from "../components/Buttons/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../context/contextTheme";
import { auth } from "../firebase/config";
import { HeaderGroup } from "../components/Headers/headerGroup";
import SectionHeader from "../components/Headers/SectionHeader";
import ModalGroupInfo from "../components/GoalsGroups/InGroup/ModalGroupInfo";
import ModalGroupConfig from "../components/GoalsGroups/InGroup/ModalGroupConfig";
import ModalAssingGoal from "../components/GoalsGroups/InGroup/ModalAssignGoal";
import EmptyGoalsGroups from "../components/EmptyScreens/EmptyGoalsInGroup";

import {
    getGoalInGroup,
    getGroup,
    updateStatusGoalInGroup,
    updateUserGoalInGroup,
} from "../services/realtime";
import ModalMembersGoals from "../components/GoalsGroups/InGroup/ModalMembersGoals";
import GoalCard from "../components/Goals/GoalCard";
import { GroupType } from "./(tabs)/teams";
import { Text } from "react-native";
import { unlockAchievement } from "../services/unlockAchievement";
import { useAchievement } from "../context/contextAchievement";

export interface GoalType {
    id: string;
    name: string;
    description: string;
    status: string;
    user: string;
    color: string;
}

export default function GroupDetail() {
    const { groupCode } = useLocalSearchParams();

    const [group, setGroup] = useState<GroupType | null>(null);
    const [goals, setGoals] = useState<GoalType[]>([]);

    const userGoals = goals.filter(
        (goal) =>
            goal.user === auth.currentUser?.uid &&
            goal.status != "Não concluída",
    );
    const openGoals = goals.filter((goal) => goal.user == "open");

    const userInVicileaders = group?.viceLeaders
        ? Object.keys(group.viceLeaders)
        : [];

    const isLeader = group?.createdBy == auth.currentUser?.uid;

    const isViceLeader = userInVicileaders.includes(
        auth.currentUser?.uid as any,
    );

    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [configModalVisible, setConfigModalVisible] = useState(false);
    const [assingGoal, setAssingGoal] = useState(false);
    const [showMembersGoalsModal, setShowMembersGoalsModal] = useState(false);
    const [showGiveUpModal, setShowGiveUpModal] = useState(false);
    const [showTakeOnModal, setShowTakeOnModal] = useState(false);

    const [goalToTake, setGoalToTake] = useState<GoalType | null>(null);

    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const { showAchievement } = useAchievement();

    const loadGroup = async () => {
        const dataGroup = await getGroup(groupCode.toString());
        setGroup(dataGroup);
    };

    const loadGoals = async () => {
        const groupGoals = await getGoalInGroup(groupCode);
        setGoals(groupGoals);
    };

    const fetchData = async () => {
        setLoading(true);
        await loadGroup();
        await loadGoals();
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles(theme).container}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignSelf: "center",
                        width: "60%",
                    }}
                >
                    <ActivityIndicator size={44} color={theme.primary} />
                    <Text
                        style={{
                            marginTop: 12,
                            color: theme.textSecondary,
                            fontSize: 16,
                            textAlign: "center",
                        }}
                    >
                        Só um instante... preparando as metas do grupo{" "}
                        {group?.name}!
                    </Text>
                </View>
            </View>
        );
    }

    const completeGoal = async (idGoal: string) => {
        const uid = auth.currentUser?.uid;
        await updateStatusGoalInGroup(group?.codeGroup, idGoal, "Concluida");
        await fetchData();

        if (uid) {
            await unlockAchievement(uid, "groupGoalCompleted", showAchievement);
        }
    };

    const giveUpGoal = async (idGoal: string) => {
        await updateStatusGoalInGroup(
            group?.codeGroup,
            idGoal,
            "Não concluída",
        );
        fetchData();
    };

    const takeOnGoal = async (idGoal: string) => {
        await updateUserGoalInGroup(
            group?.codeGroup,
            idGoal,
            auth.currentUser?.uid,
        );
        fetchData();
    };

    return (
        <View style={styles(theme).container}>
            {group && (
                <ModalMembersGoals
                    visible={showMembersGoalsModal}
                    goals={goals}
                    group={group}
                    onClose={() => {
                        setShowMembersGoalsModal(false);
                    }}
                    onReload={fetchData}
                />
            )}

            {group && (
                <View>
                    <HeaderGroup
                        title={group.name}
                        leader={isLeader}
                        onPressInfo={() => {
                            setInfoModalVisible(!infoModalVisible);
                        }}
                        onPressConfig={() => {
                            setConfigModalVisible(!configModalVisible);
                        }}
                    />
                    <ModalGroupInfo
                        group={group}
                        visible={infoModalVisible}
                        onClose={() => {
                            setInfoModalVisible(!infoModalVisible);
                        }}
                    />
                    <ModalGroupConfig
                        group={group}
                        visible={configModalVisible}
                        onClose={() => {
                            setConfigModalVisible(!configModalVisible);
                        }}
                        onReload={loadGroup}
                    />
                    <ModalAssingGoal
                        visible={assingGoal}
                        group={group}
                        onClose={() => setAssingGoal(false)}
                        onReload={fetchData}
                    />
                </View>
            )}

            {openGoals.length > 0 || userGoals.length > 0 ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ width: "95%", alignSelf: "center" }}
                >
                    {openGoals.length > 0 && (
                        <View>
                            <SectionHeader
                                icon={
                                    <Ionicons
                                        name="compass-outline"
                                        size={22}
                                        color={theme.textPrimary}
                                    />
                                }
                                title="Metas Disponíveis"
                                fontSize={24}
                                marginTop={true}
                            />
                            {openGoals.map((goal) => (
                                <TouchableOpacity key={goal.id}>
                                    <GoalCard
                                        title={goal.name}
                                        description={goal.description}
                                        status={goal.status}
                                        color={goal.color}
                                        user={goal.user}
                                        inGroup={false}
                                        takeOn={() => {
                                            setShowTakeOnModal(true);
                                            setGoalToTake(goal);
                                        }}
                                        onRemove={() => {}}
                                        onComplete={() => {}}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {userGoals.length > 0 && (
                        <View>
                            <SectionHeader
                                icon={
                                    <Ionicons
                                        name="list-circle-outline"
                                        size={22}
                                        color={theme.textPrimary}
                                    />
                                }
                                title="Suas metas"
                                fontSize={24}
                                marginTop={true}
                            />
                            {userGoals.map((goal) => (
                                <TouchableOpacity key={goal.id}>
                                    <GoalCard
                                        title={goal.name}
                                        description={goal.description}
                                        status={goal.status}
                                        color={goal.color}
                                        inGroup
                                        complete
                                        trash
                                        onRemove={() => {
                                            setShowGiveUpModal(true);
                                            setGoalToTake(goal);
                                        }}
                                        onComplete={() => {
                                            completeGoal(goal.id);
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    <View style={{ height: 150 }}></View>
                </ScrollView>
            ) : (
                <EmptyGoalsGroups />
            )}

            {(isLeader || isViceLeader) && (
                <View style={styles(theme).fabContainer}>
                    <AppButton
                        onPress={() => {
                            setAssingGoal(true);
                        }}
                        title="Atribuir Meta"
                        icon="add-circle-outline"
                        boldText
                        backgroundColor={theme.cardAccent}
                        propStyle={styles(theme).fab}
                    />
                    <AppButton
                        onPress={() => {
                            setShowMembersGoalsModal(true);
                        }}
                        title="Gerenciar Metas"
                        icon="clipboard-outline"
                        boldText
                        backgroundColor={theme.cardAccent}
                        propStyle={styles(theme).fab}
                    />
                </View>
            )}
            <AppConfirmModal
                visible={showGiveUpModal}
                title="Desistir da Meta?"
                subtitle="Essa meta não será apagada, mas será marcada com 'Desistência'. Deseja realmente desistir?"
                icon="alert-circle-outline"
                iconColor={theme.incorrect}
                onCancel={() => setShowGiveUpModal(false)}
                onConfirm={async () => {
                    if (goalToTake?.id) {
                        giveUpGoal(goalToTake.id);
                    }
                    setShowGiveUpModal(false);
                }}
            />
            <AppConfirmModal
                visible={showTakeOnModal}
                title="Assumir esta Meta?"
                subtitle={`Você está prestes a assumir a meta '${goalToTake?.name}'. Deseja continuar?`}
                icon="hand-left-outline"
                iconColor={theme.primary}
                confirmText="Assumir"
                onCancel={() => setShowTakeOnModal(false)}
                onConfirm={() => {
                    if (goalToTake?.id) {
                        takeOnGoal(goalToTake.id);
                    }
                    setShowTakeOnModal(false);
                }}
                colorConfirm={theme.primary}
            />
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        title: {
            fontSize: 28,
            fontWeight: theme.textPrimary,
            color: "#FEE715",
        },
        text: {
            fontSize: 18,
            color: theme.textPrimary,
            marginTop: 10,
        },

        fabContainer: {
            position: "absolute",
            bottom: 0,
            right: 0,
            paddingRight: 16,
            paddingBottom: 16,
        },
        fab: {
            alignSelf: "flex-end",
            borderRadius: 35,
            borderWidth: 1,
            borderColor: theme.primary,
        },
    });
