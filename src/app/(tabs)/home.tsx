import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/src/styles/colors";
import { auth } from "@/src/database/firebase";
import { addGoalInUser, getUserGoals } from "@/src/services/userServices";
import { Header } from "@/src/components/header";
import Goal from "@/src/components/goal";
import CreateGoal from "@/src/components/createGoal";

interface GoalType {
    id: string;
    name: string;
    description?: string;
    timeRemaining?: Date;
    status?: string;
    color: string;
}

export default function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const [goals, setGoals] = useState<GoalType[]>([]); // Armazena as metas criadas, e tudo tipado nessa merda
    const noteColors = Object.values(colors.notes);

    //useEffect pra carregar as metas do usuario, quando carregar tela home
    useEffect(() => {
        const loadGoals = async () => {
            const userGoals = await getUserGoals(auth.currentUser?.uid);
            const goalsArray = Object.keys(userGoals).map((key) => ({
                ...userGoals[key],
                id: key,
            }));
            setGoals(goalsArray);
            //goalsArray recebe os dados do usuario em obj e transformado em array
        };
        loadGoals();
    }, []);

    //Funcao q eh chamada quando o usuario cria uma meta nova
    const addGoal = (
        name: string,
        description?: string,
        timeRemaining?: Date,
        status?: string,
    ) => {
        const randomColor =
            noteColors[Math.floor(Math.random() * noteColors.length)];
        const newGoal = {
            id: Date.now().toString(),
            name,
            description,
            timeRemaining,
            status,
            color: randomColor,
        };

        //atualiza o usuario com a nova meta
        addGoalInUser(auth.currentUser?.uid, newGoal);

        setGoals((prevGoals) => [...prevGoals, newGoal]);
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Header title="Home" />

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Suas Metas</Text>
            </View>

            <ScrollView contentContainerStyle={styles.goalContainer}>
                {goals.map((goal) => (
                    <TouchableOpacity key={goal.id}>
                        <Goal
                            id={goal.id}
                            name={goal.name}
                            description={goal.description}
                            timeRemaining={goal.timeRemaining}
                            status={goal.status}
                            color={goal.color}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={32} color={colors.white} />
            </TouchableOpacity>

            <CreateGoal
                visible={modalVisible}
                onConfirm={addGoal}
                onCancel={handleCancel}
            />
        </View>
    );
}

//Estilo, nada pra comentar
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
    goalContainer: {
        width: "100%",
        paddingBottom: 80,
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: colors.grey2,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
});
