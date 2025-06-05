import { auth } from "@/src/firebase/config";
import { getNameUser } from "@/src/services/userServices";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { RoleBadge } from "./RoleBadge";
import { useTheme } from "@/src/context/contextTheme";

export default function GroupMemberItem({
    memberUid,
    memberIndex,
    group,
    centeredView,
}: {
    memberUid: string;
    memberIndex: number;
    group: Object;
    centeredView?: boolean;
}) {
    const [nameLeader, setNameLeader] = useState("Carregando...");
    const { theme } = useTheme();

    useEffect(() => {
        const fetchName = async () => {
            if (memberUid === auth.currentUser?.uid) {
                setNameLeader("Você");
            } else if (memberUid) {
                const leader = await getNameUser(memberUid);
                setNameLeader(leader);
            }
        };
        fetchName();
    }, [memberUid]);

    if (centeredView) {
        return (
            <View style={styles(theme).centeredContainer}>
                <Text style={styles(theme).centeredText}>{nameLeader}</Text>
            </View>
        );
    }

    return (
        <View style={styles(theme).container}>
            <View style={styles(theme).leftContent}>
                <View style={styles(theme).index}>
                    <Text style={styles(theme).indexText}>{memberIndex}</Text>
                </View>

                <Text style={styles(theme).nameText}>{nameLeader}</Text>
            </View>

            <RoleBadge group={group} memberUid={memberUid} card={true} />
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: theme.cardAccent,
            marginHorizontal: 16,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 14,
        },
        leftContent: {
            flexDirection: "row",
            alignItems: "center",
        },
        nameText: {
            fontSize: 14,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginLeft: 12,
        },
        indexText: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textSecondary,
        },
        index: {
            justifyContent: "center",
            paddingHorizontal: 12,
        },
        centeredContainer: {
            width: "100%",
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: theme.cardAccent,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
        },
        centeredText: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textPrimary,
        },
    });
