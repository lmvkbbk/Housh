import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/src/styles/colors";
import { Header } from "@/src/components/header";
import { useTheme } from "@/src/context/contextTheme";
import AppButton from "@/src/components/Buttons/Buttons";
import GroupCard from "@/src/components/GoalsGroups/goalGroup";
import GpCodeModal from "@/src/components/GoalsGroups/groupCode";
import CreateGroupModal from "@/src/components/GoalsGroups/createGroup";

interface GroupType {
    id: string;
    name: string;
    leaderName?: string;
    membersCount: number;
    color: string;
}

export default function Teams() {
    const [addGroupModal, setAddGroupModal] = useState(false);
    const [enterGroupModal, setEnterGroupModal] = useState(false);
    const [groups, setGroups] = useState<GroupType[]>([]);

    const noteColors = Object.values(colors.notes);
    const { theme } = useTheme();

    const handleAddGroup = (name: string) => {
        const randomColor =
            noteColors[Math.floor(Math.random() * noteColors.length)];
        const newGroup: GroupType = {
            id: Date.now().toString(),
            name,
            leaderName: "Você",
            membersCount: 1,
            color: randomColor,
        };

        setGroups((prev) => [...prev, newGroup]);
        setAddGroupModal(false);
    };

    return (
        <View style={styles(theme).container}>
            <Header title="Teams" />

            <View style={styles(theme).titleContainer}>
                <Text style={styles(theme).title}>Grupos</Text>
            </View>

            <ScrollView contentContainerStyle={styles(theme).groupContainer}>
                {groups.map((group) => (
                    <TouchableOpacity key={group.id}>
                        <GroupCard
                            id={group.id}
                            name={group.name}
                            leaderName={group.leaderName}
                            membersCount={group.membersCount}
                            color={group.color}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <GpCodeModal
                visible={enterGroupModal}
                onConfirm={(code) => setEnterGroupModal(false)}
                onCancel={() => setEnterGroupModal(false)}
            />

            <CreateGroupModal
                visible={addGroupModal}
                onConfirm={handleAddGroup}
                onCancel={() => setAddGroupModal(false)}
            />

            <View style={styles(theme).fabContainer}>
                <AppButton
                    icon="people"
                    title="Criar grupo"
                    boldText={true}
                    onPress={() => setAddGroupModal(true)}
                    backgroundColor={theme.modalBackground}
                    propStyle={styles(theme).fab}
                    textColor={theme.textPrimary}
                />
                <AppButton
                    icon="log-in-outline"
                    title="Entrar em grupo"
                    boldText={true}
                    onPress={() => setEnterGroupModal(true)}
                    backgroundColor={theme.modalBackground}
                    propStyle={styles(theme).fab}
                    textColor={theme.textPrimary}
                />
            </View>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
        },
        titleContainer: {
            width: "100%",
            justifyContent: "flex-start",
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginTop: 30,
            paddingLeft: 15,
        },
        groupContainer: {
            width: "100%",
            paddingBottom: 80,
        },
        fabContainer: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
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
