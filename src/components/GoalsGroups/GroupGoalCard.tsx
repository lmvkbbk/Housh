import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getNameUser } from "@/src/services/userServices";
import { auth } from "@/src/firebase/config";
import { useTheme } from "@/src/context/contextTheme";
import AppButton from "../Buttons/Buttons";
import ModalGroupInfo from "./InGroup/ModalGroupInfo";
import { GroupType } from "@/src/app/(tabs)/teams";

interface GroupProps {
    group: GroupType;
    onRemove: () => void;
    onInfo: () => void;
}

export default function GroupCard({ group, onRemove, onInfo }: GroupProps) {
    const [nameLeader, setNameLeader] = useState("Carregando...");
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    const { theme } = useTheme();

    const handleRemove = () => {
        setShowButtons(false);
        onRemove();
    };

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setShowButtons(false);
        }, 5000);
        return () => clearTimeout(timeOut);
    }, [showButtons]);

    useEffect(() => {
        if (!group.createdBy) return;

        if (group.createdBy === auth.currentUser?.uid) {
            setNameLeader("Você");
            return;
        }

        const fetchName = async () => {
            const leader = await getNameUser(group.createdBy);
            setNameLeader(leader);
        };
        fetchName();
    }, [group]);

    return (
        <TouchableOpacity
            style={[styles(theme).container, { borderLeftColor: group.color }]}
            activeOpacity={0.7}
            onLongPress={() => {
                setShowButtons(!showButtons);
            }}
            onPress={() => {
                if (showButtons) {
                    setShowButtons(!showButtons);
                } else {
                    onInfo();
                }
            }}
        >
            <ModalGroupInfo
                group={group}
                visible={infoModalVisible}
                onClose={() => {
                    setInfoModalVisible(false);
                }}
            />
            {showButtons && (
                <View style={styles(theme).rapidButtons}>
                    <AppButton
                        icon="information-circle"
                        textColor={theme.textSecondary}
                        onPress={() => {
                            setInfoModalVisible(true);
                        }}
                    />

                    <AppButton
                        icon="trash"
                        textColor={theme.incorrect}
                        onPress={handleRemove}
                    />
                </View>
            )}
            <View style={styles(theme).rowTop}>
                <Text style={styles(theme).title}>{group.name}</Text>
                <View style={styles(theme).topRightSpace} />
            </View>

            <View style={styles(theme).rowBottom}>
                <View style={styles(theme).leaderRow}>
                    <FontAwesome5
                        name="crown"
                        size={14}
                        color="#FFD700"
                        style={styles(theme).icon}
                    />
                    <Text style={styles(theme).leaderText}>{nameLeader}</Text>
                </View>

                <View style={styles(theme).membersRow}>
                    <FontAwesome5
                        name="users"
                        size={14}
                        color={theme.textPrimary}
                        style={styles(theme).icon}
                    />
                    <Text style={styles(theme).infoText}>
                        {Object.keys(group.members ?? {}).length} membro
                        {Object.keys(group.members ?? {}).length > 1 ? "s" : ""}
                    </Text>
                </View>
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
            backgroundColor: theme.modalBackground,
            borderLeftWidth: 8,
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
        rowTop: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
        },
        rowBottom: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        topRightSpace: {
            width: 24, // espaço reservado (pode virar ícone futuramente)
            height: 24,
        },
        title: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textPrimary,
        },
        membersRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        leaderRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        icon: {
            marginRight: 6,
        },
        infoText: {
            fontSize: 15,
            color: theme.textSecondary,
        },
        leaderText: {
            fontSize: 14,
            color: theme.textSecondary,
        },
    });
