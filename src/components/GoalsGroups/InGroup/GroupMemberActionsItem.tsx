import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";
import { getNameUser } from "@/src/services/userServices";
import { auth } from "@/src/firebase/config";
import { RoleBadge } from "./RoleBadge";
import { GroupType } from "@/src/app/(tabs)/teams";

interface GroupMemberActionItemProps {
    member: string;
    group: GroupType;
    onPromote: (id: string) => void;
    onDemote: (id: string) => void;
    onRemove: (id: string) => void;
}

export function GroupMemberActionItem({
    member,
    group,
    onPromote,
    onDemote,
    onRemove,
}: GroupMemberActionItemProps) {
    const [name, setName] = useState("Carregando...");
    const { theme } = useTheme();

    const viceLeaders = group.viceLeaders ? Object.keys(group.viceLeaders) : [];

    let role = "Participante";

    if (group.createdBy === member) {
        role = "Líder";
    } else if (viceLeaders.includes(member)) {
        role = "Vice-líder";
    }

    useEffect(() => {
        const fetchName = async () => {
            if (member === auth.currentUser?.uid) {
                setName("Você");
            } else if (member) {
                const leader = await getNameUser(member);
                setName(leader);
            }
        };
        fetchName();
    }, [member]);
    return (
        <View style={styles.memberRow}>
            <View>
                <Text style={{ color: theme.textPrimary, fontWeight: "bold" }}>
                    {name}
                </Text>
                <RoleBadge group={group} memberUid={member} />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
                {role === "Participante" && (
                    <TouchableOpacity onPress={() => onPromote(member)}>
                        <Ionicons
                            name="arrow-up"
                            size={20}
                            color={theme.primary}
                        />
                    </TouchableOpacity>
                )}
                {role === "Vice-líder" && (
                    <TouchableOpacity onPress={() => onDemote(member)}>
                        <Ionicons
                            name="arrow-down"
                            size={20}
                            color={theme.primary}
                        />
                    </TouchableOpacity>
                )}
                {role !== "Líder" && (
                    <TouchableOpacity onPress={() => onRemove(member)}>
                        <Ionicons
                            name="trash"
                            size={20}
                            color={theme.incorrect}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
});
