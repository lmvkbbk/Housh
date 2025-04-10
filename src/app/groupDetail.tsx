import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function GroupDetail() {
    const route = useRoute();
    const { groupName } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{groupName}</Text>
            <Text style={styles.text}>Aqui será a tela do grupo "{groupName}"</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#101020',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FEE715',
    },
    text: {
        fontSize: 18,
        color: 'white',
        marginTop: 10,
    },
});
