import {View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { colors } from '../styles/colors'
import { Header } from '@/components/header'
import { Ionicons } from '@expo/vector-icons';
import CreateGoal from '@/components/createGoal';
import Goal from '@/components/goal';

interface GoalType {
    id: number;
    name: string;
    description?: string;
    timeRemaining?: string;
    color: string;
}

export default function Home(){
    const [modalVisible, setModalVisible] = useState(false);
    const [goals, setGoals] = useState<GoalType[]>([]); // Armazena as metas criadas, e tudo tipado nessa merda
    const navigation = useNavigation();
    const noteColors = Object.values(colors.notes)

    //Funcao q eh chamada quando o usuario cria uma meta nova
    const addGoal = (name: string, description?: string, timeRemaining?: string) => {
        const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
        const newGoal = { id: Date.now(), name, description, timeRemaining, color: randomColor };

//aqui pra salvar no banco de dados

        setGoals((prevGoals) => [...prevGoals, newGoal]);
        setModalVisible(false);
    };

    //func q fecha o modal se cancelar
    const handleCancel = () => {
        setModalVisible(false)
    }

    return(
        <View style={{flex: 1, width:'100%'}}>
            <Header title='Home'/>
            <View style={{width: "100%", justifyContent:"flex-start"}}>
            <Text style={styles.title}>Metas</Text>
            </View> 

            <ScrollView contentContainerStyle={styles.goalContainer}>
                {goals.map((goal,index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('[goalDetails]')}>
                    <Goal
                        id={goal.id}
                        name={goal.name}
                        description={goal.description}
                        timeRemaining={goal.timeRemaining}
                        color={goal.color}
                    />
                </TouchableOpacity>
                ))}
            </ScrollView>


            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={24} color={colors.white} />
            </TouchableOpacity>



            <CreateGoal
                visible={modalVisible}
                onConfirm={addGoal}
                onCancel={handleCancel}
            />

        </View>
    )
}


//Estilo, nada pra comentar
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.white,
        marginTop:30,
        paddingLeft: 15
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: colors.grey2,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center"
    },
    goalContainer: {
        width:'100%',
        paddingBottom: 80,
      },
    //pronto
})