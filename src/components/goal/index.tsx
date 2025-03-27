import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

interface GoalProps {
    id: number;
    name: string;
    description?: string;
    timeRemaining?: string;
    color: string;
}

const Goal: React.FC<GoalProps> = ({ id, name, description, timeRemaining, color }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('goalDetails', {
            goal: { id, name, description, timeRemaining, color },
        });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.container, { backgroundColor: color }]}>
            <Text style={styles.title}>{name}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
            {timeRemaining && <Text style={styles.timeRemaining}>Tempo restante: {timeRemaining}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Para Android
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
    },
    timeRemaining: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
    },
});

export default Goal;

