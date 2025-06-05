import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import SectionHeader from "../../Headers/SectionHeader";
import { Ionicons } from "@expo/vector-icons";
import { GoalType } from "@/src/app/groupDetail";
import { getNameUser } from "@/src/services/userServices";
import { useTheme } from "@/src/context/contextTheme";
import AppToggleIconButton from "../../Buttons/AppToggleIconButton";
import { auth } from "@/src/firebase/config";
import GoalCard from "../../Goals/GoalCard";

interface GroupMemberGoalsCardProps {
    userId: string;
    goals: GoalType[];
    onEdit: (goal: GoalType) => void;
    onRemove: (idGoal: string) => void;
}

export default function GroupMemberGoalsCard({
    userId,
    goals,
    onRemove,
    onEdit,
}: GroupMemberGoalsCardProps) {
    const { theme } = useTheme();
    const user = auth.currentUser?.uid;
    const [name, setName] = useState("Carregando...");
    const memberGoals = goals.filter((goal) => goal.user === userId);
    const memberCompletedGoals = memberGoals.filter(
        (goal) => goal.status === "Concluida",
    );
    const progress =
        memberGoals.length > 0
            ? Math.round(
                  (memberCompletedGoals.length / memberGoals.length) * 100,
              )
            : 0;
    const [viewUser, setViewUser] = useState(true);

    useEffect(() => {
        const fetchName = async () => {
            if (userId === user) {
                setName("Você");
            } else {
                const nome = await getNameUser(userId);
                setName(nome || "Desconhecido");
            }
        };
        fetchName();
    }, [userId]);

    return (
        <View
            style={{
                paddingBottom: 12,
                borderBottomColor: theme.cardAccent,
                borderBottomWidth: 1,
                borderRadius: 12,
            }}
        >
            <View style={styles(theme).teste}>
                <SectionHeader
                    icon={
                        <Ionicons
                            name="person-circle-outline"
                            size={22}
                            color={theme.primary}
                        />
                    }
                    title={`${name} - ${progress}% concluído`}
                    fontSize={24}
                    marginTop={true}
                />
                <AppToggleIconButton
                    iconA="caret-up"
                    iconB="caret-down"
                    onToggle={() => {
                        setViewUser(!viewUser);
                    }}
                    textColor={theme.textSecondary}
                    propStyle={{
                        alignSelf: "flex-end",
                        marginVertical: 0,
                        paddingRight: 10,
                    }}
                />
            </View>
            {viewUser && (
                <View>
                    {memberGoals.length > 0 ? (
                        memberGoals.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                title={goal.name}
                                description={goal.description}
                                status={goal.status}
                                color={goal.color}
                                inGroup={false}
                                edit
                                trash
                                onEdit={() => onEdit(goal)}
                                onRemove={() => onRemove(goal.id)}
                                onComplete={() => {}}
                            />
                        ))
                    ) : (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 12,
                                flexDirection: "row",
                            }}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={18}
                                color={theme.textSecondary}
                                style={{ marginRight: 6 }}
                            />
                            <Text
                                style={{
                                    color: theme.textSecondary,
                                    fontSize: 14,
                                }}
                            >
                                Nenhuma meta atribuída.
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        teste: {
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
        },
    });
