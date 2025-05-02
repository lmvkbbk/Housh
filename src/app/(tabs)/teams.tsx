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
import { Header } from "react-native/Libraries/NewAppScreen";
import GroupCard from "@/src/components/goalGroup";
import GpCodeModal from "@/src/components/groupCode";
import CreateGroupModal from "@/src/components/createGroup";

// Tipo do grupo
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
        <View style={styles.container}>
            <Header title="Teams" />

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Grupos</Text>
            </View>

            <ScrollView contentContainerStyle={styles.groupContainer}>
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

            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setAddGroupModal(true)}
                >
                    <Ionicons name="add" size={32} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setEnterGroupModal(true)}
                >
                    <Ionicons
                        name="key-outline"
                        size={32}
                        color={colors.white}
                    />
                </TouchableOpacity>
            </View>

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
        </View>
    );
}

const styles = StyleSheet.create({
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
        color: colors.white,
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
        gap: 10,
        paddingRight: 16,
        paddingBottom: 16,
    },
    fab: {
        padding: 15,
        borderRadius: 35,
        backgroundColor: colors.grey2,
        justifyContent: "center",
        alignItems: "center",
    },
});
