import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { getRelativeDateInfo } from "@/src/utils/dateUtils";
import { useTheme } from "@/src/context/contextTheme";
import AppDaysGoal from "./DaysGoal";
import AppButton from "../Buttons/Buttons";

interface selectedDays {
    dom: boolean;
    seg: boolean;
    ter: boolean;
    qua: boolean;
    qui: boolean;
    sex: boolean;
    sab: boolean;
}

interface GoalProps {
    id: string;
    name: string;
    description?: string;
    timeRemaining?: Date;
    status?: string;
    selectedDays?: selectedDays;
    color: string;
    onRemove: () => void;
    onComplete: () => void;
}

export default function Goal({
    id,
    name,
    description,
    timeRemaining,
    status,
    selectedDays,
    color,
    onRemove,
    onComplete,
}: GoalProps) {
    const router = useRouter();
    const { theme } = useTheme();

    const [showButtons, setShowButtons] = useState(false);

    const todayInWeek = new Date().getDay();

    const handleRemove = () => {
        setShowButtons(false);
        onRemove();
    };
    const handleComplete = () => {
        setShowButtons(false);
        onComplete();
    };

    //faz os rapidButtons sairem dps de 5 segundos
    useEffect(() => {
        const timeOut = setTimeout(() => {
            setShowButtons(false);
        }, 5000);
        return () => clearTimeout(timeOut);
    }, [showButtons]);

    return (
        <TouchableOpacity
            onPress={() => setShowButtons(!showButtons)}
            activeOpacity={0.7}
            style={[styles(theme).container, { borderColor: color }]}
        >
            {showButtons && (
                <View style={styles(theme).rapidButtons}>
                    {status !== "Concluida" && status !== "Atrasada" && (
                        <AppButton
                            icon="checkmark-circle"
                            textColor={theme.correct}
                            onPress={handleComplete}
                        />
                    )}

                    <AppButton
                        icon="trash"
                        textColor={theme.incorrect}
                        onPress={handleRemove}
                    />
                </View>
            )}

            <Text style={styles(theme).title}>{name}</Text>

            {description && (
                <Text style={styles(theme).description}>{description}</Text>
            )}

            <View style={styles(theme).infoContainer}>
                {timeRemaining && (
                    <View style={styles(theme).timeContainer}>
                        <FontAwesome5
                            name="hourglass-half"
                            size={16}
                            color={theme.textSecondary}
                            style={styles(theme).icon}
                        />
                        <Text style={styles(theme).timeText}>
                            {getRelativeDateInfo(timeRemaining)?.Text}
                        </Text>
                    </View>
                )}
                {selectedDays && (
                    <View style={styles(theme).daysContainer}>
                        <AppDaysGoal
                            today={todayInWeek}
                            day={0}
                            title="D"
                            active={selectedDays.dom}
                        />
                        <AppDaysGoal
                            today={todayInWeek}
                            day={1}
                            title="S"
                            active={selectedDays.seg}
                        />
                        <AppDaysGoal
                            today={todayInWeek}
                            day={2}
                            title="T"
                            active={selectedDays.ter}
                        />
                        <AppDaysGoal
                            today={todayInWeek}
                            day={3}
                            title="Q"
                            active={selectedDays.qua}
                        />
                        <AppDaysGoal
                            today={todayInWeek}
                            day={4}
                            title="Q"
                            active={selectedDays.qui}
                        />
                        <AppDaysGoal
                            today={todayInWeek}
                            day={5}
                            title="S"
                            active={selectedDays.sex}
                        />
                        <AppDaysGoal
                            today={todayInWeek}
                            day={6}
                            title="S"
                            active={selectedDays.sab}
                        />
                    </View>
                )}
                {status && (
                    <View style={styles(theme).statusContainer}>
                        <FontAwesome5
                            name={
                                status === "Concluida"
                                    ? "check-circle"
                                    : status === "Atrasada"
                                      ? "exclamation-circle"
                                      : "clock"
                            }
                            size={16}
                            color={
                                status === "Concluida"
                                    ? theme.correct
                                    : status === "Atrasada"
                                      ? theme.incorrect
                                      : theme.textSecondary
                            }
                            style={styles(theme).icon}
                        />
                        <Text
                            style={[
                                styles(theme).statusText,
                                {
                                    color:
                                        status === "Concluida"
                                            ? theme.correct
                                            : status === "Atrasada"
                                              ? theme.incorrect
                                              : theme.textSecondary,
                                },
                            ]}
                        >
                            {status}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            marginHorizontal: 16,
            marginVertical: 10,
            padding: 20,
            borderRadius: 20,
            borderLeftWidth: 8,
            backgroundColor: theme.modalBackground,
        },
        title: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: 8,
        },
        infoContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        description: {
            fontSize: 15,
            color: theme.textSecondary,
            marginBottom: 10,
        },
        timeContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        statusContainer: {
            flexDirection: "row",
            marginTop: 5,
        },
        icon: {
            marginRight: 6,
        },
        timeText: {
            fontSize: 13,
            color: theme.textSecondary,
        },
        statusText: {
            fontSize: 13,
            color: theme.textSecondary,
        },
        rapidButtons: {
            position: "absolute",
            right: 0,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            backgroundColor: theme.cardAccent,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 5,
            paddingLeft: 10,
            gap: 8,
            zIndex: 1,
        },
        daysContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
        },
    });
