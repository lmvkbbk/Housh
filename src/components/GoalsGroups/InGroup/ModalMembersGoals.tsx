import { useTheme } from "@/src/context/contextTheme";
import { Modal, View, StyleSheet, ScrollView, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "../../Headers/SectionHeader";
import { Header } from "../../Headers/header";
import { removeGoalInGroup } from "@/src/services/realtime";
import AppLoadingButton from "../../Buttons/LoadingButton";
import { useState } from "react";
import { auth } from "@/src/firebase/config";
import EditGoalGroupModal from "../GroupEditGoalModal";
import GoalCard from "../../Goals/GoalCard";
import { GoalType } from "@/src/app/groupDetail";
import { GroupType } from "@/src/app/(tabs)/teams";
import GroupMemberGoalsCard from "./GroupMemberGoalsCard";

interface Props {
    visible: boolean;
    goals: GoalType[];
    group: GroupType;
    onClose: () => void;
    onReload: () => void;
}

export default function ModalMembersGoals({
    visible,
    goals,
    group,
    onClose,
    onReload,
}: Props) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    const memberIds = Object.keys(group.members || {});

    const sortedMemberIds = [
        auth.currentUser?.uid,
        ...memberIds.filter((id) => id !== auth.currentUser?.uid),
    ];
    const realGoals = goals.filter((goal) => goal.status != "Não concluída");
    const demissGoals = goals.filter((goal) => goal.status === "Não concluída");

    const [showEditGoalModal, setShoweditgoalModal] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState<GoalType>();

    const removeDemissGoal = async (idGoal: string) => {
        await removeGoalInGroup(group.codeGroup, idGoal);
        onReload();
    };

    const removeAllDemissGoal = async () => {
        setLoading(true);
        try {
            if (demissGoals.length < 10) {
                await Promise.all(
                    demissGoals.map((goal) =>
                        removeGoalInGroup(group.codeGroup, goal.id),
                    ),
                );
            } else {
                for (const goal of demissGoals) {
                    await removeGoalInGroup(group.codeGroup, goal.id);
                }
            }

            onReload();
        } catch (error) {
            console.error("Erro ao remover metas de desistência:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
            transparent
        >
            {showEditGoalModal && goalToEdit && (
                <EditGoalGroupModal
                    group={group}
                    visible
                    goal={goalToEdit}
                    onClose={() => {
                        setShoweditgoalModal(false);
                        setGoalToEdit(undefined);
                    }}
                    onReload={onReload}
                />
            )}
            <ScrollView style={styles(theme).container}>
                <Header title="Progresso do Grupo" />
                {sortedMemberIds.map((userId) => (
                    <GroupMemberGoalsCard
                        key={userId}
                        userId={userId as any}
                        goals={realGoals}
                        onEdit={(goal) => {
                            setShoweditgoalModal(true);
                            setGoalToEdit(goal);
                        }}
                        onRemove={(idGoal) => removeDemissGoal(idGoal)}
                    />
                ))}

                {demissGoals.length > 0 ? (
                    <View>
                        <SectionHeader
                            icon={
                                <Ionicons
                                    name="trash"
                                    size={22}
                                    color={theme.incorrect}
                                />
                            }
                            title="Desistencias"
                            fontSize={24}
                            marginTop={true}
                        />
                        {demissGoals.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                title={goal.name}
                                description={goal.description}
                                status={goal.status}
                                color={goal.color}
                                user={goal.user}
                                inGroup={false}
                                trash
                                onRemove={() => {
                                    removeDemissGoal(goal.id);
                                }}
                                onComplete={() => {}}
                            />
                        ))}
                        <AppLoadingButton
                            isLoading={loading}
                            icon="trash-bin"
                            title="Apagar desistencias"
                            onPress={removeAllDemissGoal}
                            propStyle={{ backgroundColor: theme.incorrect }}
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            width: "80%",
                            alignItems: "center",
                            alignSelf: "center",
                            justifyContent: "center",
                            marginVertical: 20,
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: theme.cardAccent,
                            flexDirection: "row",
                            gap: 10,
                        }}
                    >
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={28}
                            color={theme.correct}
                        />
                        <Text
                            style={{
                                color: theme.correct,
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Nenhuma desistência no momento!
                        </Text>
                    </View>
                )}
                <View style={{ height: 80 }} />
            </ScrollView>
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
