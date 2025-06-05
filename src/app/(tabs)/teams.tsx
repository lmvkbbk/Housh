import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTheme } from "@/src/context/contextTheme";
import AppButton from "@/src/components/Buttons/Buttons";
import { getGroup, leaveGroup } from "@/src/services/realtime";
import { getUserGroups } from "@/src/services/userServices";
import { auth, db } from "@/src/firebase/config";
import EmptyGroups from "@/src/components/EmptyScreens/EmptyGroups";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Header } from "@/src/components/Headers/header";
import SectionHeader from "@/src/components/Headers/SectionHeader";
import { Text } from "react-native";
import CreateGroupModal from "@/src/components/GoalsGroups/GroupCreationModal";
import GroupCard from "@/src/components/GoalsGroups/GroupGoalCard";
import GroupCodeModal from "@/src/components/GoalsGroups/GroupCodeModal";
import { onValue, ref } from "firebase/database";
import { unlockAchievement } from "@/src/services/unlockAchievement";
import { useAchievement } from "@/src/context/contextAchievement";

export interface GroupType {
    name: string;
    createdBy: string;
    viceLeaders: string[];
    codeGroup: string;
    color: string;
    members?: Record<string, boolean>;
}

export default function Teams() {
    const { theme } = useTheme();
    const { showAchievement } = useAchievement();

    const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
        useState(false);
    const [isJoinGroupModalVisible, setIsJoinGroupModalVisible] =
        useState(false);

    const [allGroups, setAllGroups] = useState<GroupType[]>([]);

    const myGroups = allGroups.filter(
        (group) => group.createdBy === auth.currentUser?.uid,
    );
    const joinedGroups = allGroups.filter(
        (group) => group.createdBy !== auth.currentUser?.uid,
    );

    const handleLeaveGroup = async (groupCode: string) => {
        setAllGroups((prev) =>
            prev.filter((group) => group.codeGroup !== groupCode),
        );
        await leaveGroup(auth.currentUser?.uid, groupCode);
        ToastAndroid.show("Saiu do Grupo", ToastAndroid.SHORT);
    };
    const navigateToGroupDetails = (group: GroupType) => {
        router.push({
            pathname: "/groupDetail",
            params: { groupCode: group.codeGroup },
        });
    };

    const [refreshing, setRefreshing] = useState(false);

    const handleRefreshGroups = async () => {
        setRefreshing(true);
        await fetchUserGroupsData();
        setRefreshing(false);
    };

    const fetchUserGroupsData = async () => {
        const userCodeGroups = await getUserGroups(auth.currentUser?.uid);

        if (userCodeGroups) {
            const groupPromises = userCodeGroups.map(async (groupCode) => {
                const groupData = await getGroup(groupCode);
                return groupData;
            });

            const groups = await Promise.all(groupPromises);
            setAllGroups(groups);
        } else {
            return;
        }
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const uid = auth.currentUser?.uid as any;

        const loadGroups = async () => {
            setLoading(true);
            await fetchUserGroupsData();
            setLoading(false);
        };

        const daysRef = ref(db, `Users/${uid}`);
        const unsubscribe = onValue(daysRef, async (snapshot) => {
            const userData = snapshot.val();

            if (userData.GoalsCreatedInGroup >= 5) {
                await unlockAchievement(
                    uid,
                    "fiveGroupGoalsCreated",
                    showAchievement,
                );
            }
        });

        loadGroups();
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles(theme).container}>
            <Header title="Grupos" />

            {loading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size={50} color={theme.primary} />
                    <Text
                        style={{
                            marginTop: 12,
                            color: theme.textSecondary,
                            fontSize: 16,
                        }}
                    >
                        Só um instante... preparando seus Grupos!
                    </Text>
                </View>
            ) : allGroups.length > 0 ? (
                <ScrollView
                    contentContainerStyle={styles(theme).groupContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefreshGroups}
                        />
                    }
                >
                    {joinedGroups.length > 0 && (
                        <View>
                            <SectionHeader
                                icon={
                                    <Ionicons
                                        name="people"
                                        size={20}
                                        color={theme.textPrimary}
                                    />
                                }
                                title="Metas compartilhadas"
                                fontSize={22}
                            />
                            {joinedGroups.map((group) => (
                                <TouchableOpacity key={group.codeGroup}>
                                    <GroupCard
                                        group={group}
                                        onRemove={() =>
                                            handleLeaveGroup(group.codeGroup)
                                        }
                                        onInfo={() =>
                                            navigateToGroupDetails(group)
                                        }
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {myGroups.length > 0 && (
                        <View>
                            <SectionHeader
                                icon={
                                    <FontAwesome5
                                        name="crown"
                                        size={20}
                                        color={theme.textPrimary}
                                    />
                                }
                                title="Meus domínios"
                                fontSize={22}
                            />
                            {myGroups.map((group) => (
                                <TouchableOpacity key={group.codeGroup}>
                                    <GroupCard
                                        group={group}
                                        onRemove={() =>
                                            handleLeaveGroup(group.codeGroup)
                                        }
                                        onInfo={() =>
                                            navigateToGroupDetails(group)
                                        }
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>
            ) : (
                <EmptyGroups />
            )}

            <GroupCodeModal
                visible={isJoinGroupModalVisible}
                onConfirm={fetchUserGroupsData}
                onCancel={() => setIsJoinGroupModalVisible(false)}
            />

            <CreateGroupModal
                visible={isCreateGroupModalVisible}
                onConfirm={fetchUserGroupsData}
                onCancel={() => setIsCreateGroupModalVisible(false)}
            />

            <View style={styles(theme).fabContainer}>
                <AppButton
                    icon="people"
                    title="Criar grupo"
                    boldText={true}
                    onPress={() => setIsCreateGroupModalVisible(true)}
                    backgroundColor={theme.cardAccent}
                    propStyle={styles(theme).fab}
                    textColor={theme.textPrimary}
                />
                <AppButton
                    icon="log-in-outline"
                    title="Entrar em grupo"
                    boldText={true}
                    onPress={() => setIsJoinGroupModalVisible(true)}
                    backgroundColor={theme.cardAccent}
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
            width: "90%",
            alignSelf: "center",
            paddingBottom: 80,
            marginTop: 8,
        },
        fabContainer: {
            position: "absolute",
            bottom: 0,
            right: 0,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingRight: 16,
            paddingBottom: 16,
        },
        fab: {
            alignSelf: "flex-end",
            borderRadius: 35,
            borderWidth: 1,
            borderColor: theme.inputBorder,
        },
        sectionTitleText: {
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 8,
            color: theme.textPrimary,
            marginTop: 1,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 16,
        },
    });
