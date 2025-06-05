import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getRelativeDateInfo } from "@/src/utils/dateUtils";
import { useTheme } from "@/src/context/contextTheme";
import WeekdayIndicator from "./WeekdayIndicator ";

interface SelectedDays {
    dom: boolean;
    seg: boolean;
    ter: boolean;
    qua: boolean;
    qui: boolean;
    sex: boolean;
    sab: boolean;
}

interface MiniGoalCardProps {
    title: string;
    timeRemaining?: Date;
    status?: string;
    selectedDays?: SelectedDays;
    color: string;
}

export default function MiniGoalCard({
    title,
    timeRemaining,
    status,
    selectedDays,
    color,
}: MiniGoalCardProps) {
    const { theme } = useTheme();
    const today = new Date().getDay();

    return (
        <View style={[styles(theme).container, { borderColor: color }]}>
            <Text style={styles(theme).title}>{title}</Text>

            {timeRemaining && (
                <View style={styles(theme).row}>
                    <FontAwesome5
                        name="hourglass-half"
                        size={14}
                        color={theme.textSecondary}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles(theme).smallText}>
                        {getRelativeDateInfo(timeRemaining)?.Text}
                    </Text>
                </View>
            )}

            {selectedDays && (
                <View style={styles(theme).daysRow}>
                    {["dom", "seg", "ter", "qua", "qui", "sex", "sab"].map(
                        (day, index) => (
                            <WeekdayIndicator
                                key={day}
                                today={today}
                                day={index}
                                title={day.charAt(0).toUpperCase()}
                                active={selectedDays[day as keyof SelectedDays]}
                            />
                        ),
                    )}
                </View>
            )}

            {status && (
                <Text
                    style={[
                        styles(theme).status,
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
            )}
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            padding: 14,
            borderRadius: 16,
            borderLeftWidth: 6,
            backgroundColor: theme.modalBackground,
            marginBottom: 6,
            marginHorizontal: 4,
            marginTop: 6,
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: 4,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
        },
        smallText: {
            fontSize: 13,
            color: theme.textSecondary,
        },
        status: {
            fontSize: 13,
            fontWeight: "600",
            marginTop: 4,
        },
        daysRow: {
            flexDirection: "row",
            marginTop: 6,
        },
    });
