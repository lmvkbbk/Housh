import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/app/styles/colors';

type CreateGoalProps = {
    visible: boolean;
    onConfirm: (name: string, description?: string, timeRemaining?: string) => void;
    onCancel: () => void;
};

const CreateGoal: React.FC<CreateGoalProps> = ({ visible, onConfirm, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [timeRemaining, setTimeRemaining] = useState('');

    const handleCreate = () => {
        if (!name.trim()) return;
        onConfirm(name, description || undefined, timeRemaining || undefined);
        setName('');
        setDescription('');
        setTimeRemaining('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Criar Nova Meta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da meta"
                        placeholderTextColor={colors.grey2}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Descrição (opcional)"
                        placeholderTextColor={colors.grey2}
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tempo restante (opcional)"
                        placeholderTextColor={colors.grey2}
                        value={timeRemaining}
                        onChangeText={setTimeRemaining}
                    />
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={handleCreate}>
                            <Text style={styles.buttonText}>Criar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateGoal;

// 🔹 Estilos do Modal
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: colors.grey2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: colors.black,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
    buttonCancel: {
        backgroundColor: colors.grey2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonConfirm: {
        backgroundColor: colors.grey2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});


