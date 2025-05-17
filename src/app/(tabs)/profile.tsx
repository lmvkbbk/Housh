import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from "react-native";
import { Header } from "../../components/header";
import {
    AntDesign,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { ref, onValue } from "firebase/database";
import { auth, db } from "@/src/firebase/config";
import { router } from "expo-router";
import ImageProfileModal from "@/src/components/ImageProfile/ImageProfileModal";
import { useTheme } from "@/src/context/contextTheme";
import { StatCard } from "@/src/components/Profile/StatCard";

export default function Perfil() {
    const userName = auth.currentUser?.displayName || "Usuário";
    const userImage = auth.currentUser?.photoURL || null;

    // Logica de atualizar os dados do usuario
    const [userPoints, setUserPoints] = useState(0);
    const [userGoals, setUserGoals] = useState(0);
    const [daysInSequence, setDaysInSequence] = useState(0);
    const [TeamsNumber, setTeamsNumber] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const userRef = ref(db, `Users/${uid}`);

        const unsubscribe = onValue(
            userRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUserPoints(data.Points || 0);
                    setUserGoals(data.GoalsPoints || 0);
                    setDaysInSequence(data.DaysInSequence || 0);
                    setTeamsNumber(data.TeamsNumber || 0);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Erro ao ouvir dados do usuário:", error);
                setLoading(false);
            },
        );

        // Remove listener dps de desmontar o componente
        return () => unsubscribe();
    }, []);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const imageExists = userImage ? true : false;

    const { theme } = useTheme();

    return (
        <View style={styles(theme).screen}>
            <Header title="Perfil" />

            <ImageProfileModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                imageUri={userImage}
                imageExists={imageExists}
            />

            <TouchableOpacity
                style={styles(theme).editButton}
                onPress={() => router.push("/profile/editProfile")}
            >
                <MaterialCommunityIcons
                    name="account-edit"
                    size={22}
                    color={theme.textPrimary}
                />
            </TouchableOpacity>

            <View style={styles(theme).contentBox}>
                <ScrollView
                    contentContainerStyle={styles(theme).scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles(theme).imageContainer}>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(true)}
                        >
                            {userImage ? (
                                <Image
                                    source={{ uri: userImage }}
                                    style={styles(theme).image}
                                />
                            ) : (
                                <MaterialIcons
                                    name="account-circle"
                                    size={150}
                                    color="#ccc"
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={styles(theme).name}>{userName}</Text>

                    <StatCard
                        icon={
                            <Ionicons name="trophy" size={24} color="#FFD700" />
                        }
                        number={userPoints}
                        text="pontos"
                        flexDirection={true}
                    />
                    <StatCard
                        icon={
                            <Ionicons name="flash" size={24} color="orange" />
                        }
                        number={daysInSequence}
                        text="dias de sequência"
                        flexDirection={true}
                    />

                    <View style={styles(theme).statsContainer}>
                        <StatCard
                            icon={
                                <Ionicons
                                    name="checkmark-done-circle"
                                    size={26}
                                    color="#4CAF50"
                                />
                            }
                            number={userGoals}
                            text="Metas"
                        />
                        <StatCard
                            icon={
                                <MaterialCommunityIcons
                                    name="account-group"
                                    size={26}
                                    color="#2196F3"
                                />
                            }
                            number={TeamsNumber}
                            text="Grupos"
                        />
                    </View>

                    <View style={styles(theme).achievementsContainer}>
                        <TouchableOpacity
                            style={styles(theme).achievementsHeader}
                        >
                            <Text style={styles(theme).achievementsTitle}>
                                Conquistas
                            </Text>
                            <MaterialIcons
                                name="chevron-right"
                                size={24}
                                color={theme.textPrimary}
                            />
                        </TouchableOpacity>

                        <View style={styles(theme).achievementsList}>
                            <TouchableOpacity
                                style={styles(theme).achievementsItem}
                            >
                                <AntDesign
                                    name="plus"
                                    size={22}
                                    color={theme.textPrimary}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles(theme).achievementsItem}
                            >
                                <AntDesign
                                    name="plus"
                                    size={22}
                                    color={theme.textPrimary}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles(theme).achievementsItem}
                            >
                                <AntDesign
                                    name="plus"
                                    size={22}
                                    color={theme.textPrimary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: theme.background,
        },
        contentBox: {
            height: "87%",
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: 25,
            backgroundColor: theme.modalBackground,
            overflow: "hidden",
        },
        scrollContent: {
            padding: 20,
            alignItems: "center",
            paddingBottom: 40,
        },
        modalBackground: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        profileModalContainer: {
            width: "100%",
            height: "40%",
            justifyContent: "center",
            alignItems: "center",
            margin: 20,
            borderRadius: 25,
        },
        profileImageLarge: {
            width: "80%",
            height: "100%",
            borderRadius: 25,
        },
        closeButton: {
            position: "absolute",
            right: 50,
            top: 10,
            alignSelf: "flex-end",
        },
        closeIcon: {
            paddingBottom: 10,
        },
        editButton: {
            position: "absolute",
            right: 30,
            top: 85,
            backgroundColor: theme.cardAccent,
            borderRadius: 20,
            padding: 8,
            zIndex: 1,
        },
        imageContainer: {
            alignItems: "center",
            marginTop: 20,
            backgroundColor: theme.cardAccent,
            borderRadius: 80,
            padding: 5,
            borderWidth: 2,
            borderColor: theme.primary,
        },
        image: {
            width: 150,
            height: 150,
            borderRadius: 75,
        },
        name: {
            color: theme.textPrimary,
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 15,
        },
        statsContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            marginTop: 20,
        },
        achievementsContainer: {
            width: "100%",
            marginTop: 25,
        },
        achievementsList: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
        },
        achievementsItem: {
            backgroundColor: theme.cardAccent,
            width: "30%",
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
        },
        achievementsHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        achievementsTitle: {
            color: theme.textPrimary,
            fontSize: 18,
            fontWeight: "bold",
        },
        subtitle: {
            color: theme.textPrimary,
            fontSize: 16,
            textAlign: "center",
            width: "95%",
        },
    });
