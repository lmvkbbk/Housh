import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { getRelativeDateInfo } from "@/src/utils/dateUtils";
import { useTheme } from "@/src/context/contextTheme";
import AppButton from "../Buttons/Buttons";
import { getNameUser } from "@/src/services/userServices";
import WeekdayIndicator from "./WeekdayIndicator ";
import { auth } from "@/src/firebase/config";
import { onTaskCompleted } from "@/src/services/userProgress";

interface selectedDays {
    dom: boolean;
    seg: boolean;
    ter: boolean;
    qua: boolean;
    qui: boolean;
    sex: boolean;
    sab: boolean;
}

interface GoalCardProps {
    title: string;
    description?: string;
    timeRemaining?: Date;
    status?: string;
    selectedDays?: selectedDays;
    color: string;
    user?: string;
    inGroup: boolean;
    edit?: boolean;
    complete?: boolean;
    trash?: boolean;
    takeOn?: () => void;
    onEdit?: () => void;
    onRemove: () => void;
    onComplete: () => void;
}

export default function GoalCard({
    title,
    description,
    timeRemaining,
    status,
    selectedDays,
    color,
    user,
    inGroup,
    edit,
    complete,
    trash,
    takeOn,
    onEdit,
    onRemove,
    onComplete,
}: GoalCardProps) {
    const { theme } = useTheme();

    const [userName, setUserName] = useState("");
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);

    const currentWeekdayIndex = new Date().getDay();

    const handleRemove = () => {
        setIsActionBarVisible(false);
        onRemove();
    };

    const handleComplete = async () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            await onTaskCompleted(uid);
        }
        setIsActionBarVisible(false);
        onComplete();
    };

    const assignGoalToUser = () => {
        setIsActionBarVisible(false);
        if (takeOn) {
            takeOn();
        }
    };
    const openGoalEditor = () => {
        setIsActionBarVisible(false);
        if (onEdit) {
            onEdit();
        }
    };

    //faz os rapidButtons sairem dps de 5 segundos
    useEffect(() => {
        const timeOut = setTimeout(() => {
            setIsActionBarVisible(false);
        }, 5000);
        const fetchAssigneeName = async () => {
            const name = await getNameUser(user);
            setUserName(name);
        };

        fetchAssigneeName();
        return () => clearTimeout(timeOut);
    }, [isActionBarVisible, user]);

    return (
        <TouchableOpacity
            onPress={() => {
                if (!inGroup) {
                    setIsActionBarVisible(!isActionBarVisible);
                    return;
                }

                if (status !== "Concluida") {
                    setIsActionBarVisible(!isActionBarVisible);
                }
            }}
            activeOpacity={0.7}
            style={[styles(theme).container, { borderColor: color }]}
        >
            {isActionBarVisible && (
                <View
                    style={[
                        styles(theme).actionBar,
                        user === "open" && { paddingRight: 10 },
                    ]}
                >
                    {user === "open" && (
                        <AppButton
                            icon="hand-left-outline"
                            title="Assumir meta"
                            boldText
                            textColor={theme.primary}
                            onPress={assignGoalToUser}
                        />
                    )}

                    {edit && (
                        <AppButton
                            icon="document-text-outline"
                            textColor={theme.textSecondary}
                            onPress={openGoalEditor}
                        />
                    )}

                    {complete && (
                        <View>
                            {status !== "Concluida" &&
                                status !== "Atrasada" && (
                                    <AppButton
                                        icon="checkmark-circle"
                                        textColor={theme.correct}
                                        onPress={handleComplete}
                                    />
                                )}
                        </View>
                    )}

                    {trash && (
                        <AppButton
                            icon="trash"
                            textColor={theme.incorrect}
                            onPress={handleRemove}
                        />
                    )}
                </View>
            )}

            <Text style={styles(theme).title}>{title}</Text>

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
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
                            day={0}
                            title="D"
                            active={selectedDays.dom}
                        />
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
                            day={1}
                            title="S"
                            active={selectedDays.seg}
                        />
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
                            day={2}
                            title="T"
                            active={selectedDays.ter}
                        />
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
                            day={3}
                            title="Q"
                            active={selectedDays.qua}
                        />
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
                            day={4}
                            title="Q"
                            active={selectedDays.qui}
                        />
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
                            day={5}
                            title="S"
                            active={selectedDays.sex}
                        />
                        <WeekdayIndicator
                            today={currentWeekdayIndex}
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
                {userName && (
                    <View style={styles(theme).userView}>
                        <Ionicons
                            name="person-circle-outline"
                            size={20}
                            color={theme.textPrimary}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles(theme).userTitle}>{userName}</Text>
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
        actionBar: {
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
        userView: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.primary,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 12,
            marginTop: 6,
            alignSelf: "flex-start",
        },
        userTitle: {
            fontWeight: "bold",
            color: theme.textPrimary,
            fontSize: 14,
        },
    });
