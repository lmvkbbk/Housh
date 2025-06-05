import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "../Headers/SectionHeader";
import {
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import GoalCard from "./GoalCard";
import { UserGoal } from "@/src/app/(tabs)/home";
import { useTheme } from "@/src/context/contextTheme";
import { ComponentProps, useState } from "react";
import MiniGoalCard from "./MiniGoalCard";
import { LinearGradient } from "expo-linear-gradient";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface GroupedGoalsListProps {
    title?: string;
    icon?: IoniconsName;
    goals: UserGoal[];
    miniCard?: boolean;
    collapsedButton?: boolean;
    onEditGoal: (goalId: string) => void;
    onRemoveGoal: (goalId: string) => void;
    onCompleteGoal: (goal: UserGoal) => void;
    onSeeMore?: (title: string) => void;
}

export default function GroupedGoalsList({
    title,
    icon,
    goals,
    miniCard,
    collapsedButton,
    onEditGoal,
    onRemoveGoal,
    onCompleteGoal,
    onSeeMore,
}: GroupedGoalsListProps) {
    const { theme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);

    let emptyMessage = "Nenhuma meta disponível.";
    let emptyIcon: IoniconsName = "information-circle-outline";

    switch (title) {
        case "Metas do Dia":
            emptyMessage = "Você não tem metas para hoje!";
            emptyIcon = "sunny-outline";
            break;
        case "Prazos Urgentes":
            emptyMessage = "Nenhum prazo urgente no momento!";
            emptyIcon = "alert-circle-outline";
            break;
        case "Metas Livres":
            emptyMessage = "Nenhuma meta livre cadastrada.";
            emptyIcon = "bulb-outline";
            break;
        case "Desafios":
            emptyMessage = "Nenhum desafio foi criado.";
            emptyIcon = "flag-outline";
            break;
        case "Metas Recorrentes":
            emptyMessage = "Nenhuma meta recorrente configurada.";
            emptyIcon = "repeat-outline";
            break;
    }

    return (
        <View style={{ marginTop: 8 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {title && (
                    <SectionHeader
                        icon={
                            <Ionicons
                                name={icon}
                                size={20}
                                color={theme.textPrimary}
                            />
                        }
                        title={title}
                        fontSize={22}
                    />
                )}
                {collapsedButton && (
                    <TouchableOpacity
                        onPress={() => setIsCollapsed(!isCollapsed)}
                    >
                        <Ionicons
                            name={isCollapsed ? "chevron-down" : "chevron-up"}
                            size={22}
                            color={theme.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {!isCollapsed && (
                <>
                    {goals.length === 0 ? (
                        <View
                            style={{ alignItems: "center", marginVertical: 20 }}
                        >
                            <Ionicons
                                name={emptyIcon}
                                size={40}
                                color={theme.textSecondary}
                            />
                            <Text
                                style={{
                                    color: theme.textSecondary,
                                    fontSize: 16,
                                    marginTop: 8,
                                    textAlign: "center",
                                }}
                            >
                                {emptyMessage}
                            </Text>
                        </View>
                    ) : miniCard ? (
                        <View style={{ width: "100%", alignSelf: "center" }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginHorizontal: 4 }}
                            >
                                {goals.slice(0, 3).map((goal) => (
                                    <TouchableOpacity key={goal.id}>
                                        <MiniGoalCard
                                            title={goal.title}
                                            timeRemaining={goal.timeRemaining}
                                            status={goal.status}
                                            selectedDays={goal.selectedDays}
                                            color={goal.color}
                                        />
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: theme.modalBackground,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        alignSelf: "center",
                                        borderRadius: 12,
                                        paddingHorizontal: 10,
                                        paddingVertical: 16,
                                        marginHorizontal: 4,
                                    }}
                                    onPress={() => {
                                        if (onSeeMore && title) {
                                            onSeeMore(title);
                                        }
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.textSecondary,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Ver Mais
                                    </Text>
                                </TouchableOpacity>

                                <View style={{ width: 30 }} />
                            </ScrollView>
                            <LinearGradient
                                colors={["transparent", theme.background]}
                                pointerEvents="none"
                                style={styles(theme).fadeRight}
                                start={{ y: 1, x: 0 }}
                            />
                            <LinearGradient
                                colors={["transparent", theme.background]}
                                pointerEvents="none"
                                style={styles(theme).fadeLeft}
                                start={{ y: 1, x: 1 }}
                            />
                        </View>
                    ) : (
                        <>
                            {onSeeMore
                                ? goals.slice(0, 3).map((goal) => (
                                      <TouchableOpacity key={goal.id}>
                                          <GoalCard
                                              title={goal.title}
                                              description={goal.description}
                                              timeRemaining={goal.timeRemaining}
                                              status={goal.status}
                                              selectedDays={goal.selectedDays}
                                              color={goal.color}
                                              inGroup={false}
                                              edit
                                              complete
                                              trash
                                              onEdit={() => {
                                                  onEditGoal(goal.id);
                                              }}
                                              onRemove={() =>
                                                  onRemoveGoal(goal.id)
                                              }
                                              onComplete={() =>
                                                  onCompleteGoal(goal)
                                              }
                                          />
                                      </TouchableOpacity>
                                  ))
                                : goals.map((goal) => (
                                      <TouchableOpacity key={goal.id}>
                                          <GoalCard
                                              title={goal.title}
                                              description={goal.description}
                                              timeRemaining={goal.timeRemaining}
                                              status={goal.status}
                                              selectedDays={goal.selectedDays}
                                              color={goal.color}
                                              inGroup={false}
                                              edit
                                              complete
                                              trash
                                              onEdit={() => {
                                                  onEditGoal(goal.id);
                                              }}
                                              onRemove={() =>
                                                  onRemoveGoal(goal.id)
                                              }
                                              onComplete={() =>
                                                  onCompleteGoal(goal)
                                              }
                                          />
                                      </TouchableOpacity>
                                  ))}
                            {onSeeMore && goals.length >= 3 && (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: theme.modalBackground,
                                        width: "90%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        alignSelf: "center",
                                        borderRadius: 12,
                                        paddingVertical: 8,
                                    }}
                                    onPress={() => {
                                        if (onSeeMore && title) {
                                            onSeeMore(title);
                                        }
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.textSecondary,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Ver Mais
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </>
            )}
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        fadeLeft: {
            position: "absolute",
            left: -12,
            top: 0,
            bottom: 0,
            width: 30,
            zIndex: 10,
        },
        fadeRight: {
            position: "absolute",
            right: -12,
            top: 0,
            bottom: 0,
            width: 30,
            zIndex: 10,
        },
    });
