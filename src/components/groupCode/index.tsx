import colors from '@/src/styles/colors';
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type GpCodeModalProps = {
    visible: boolean;
    onConfirm: (code: string) => void;
    onCancel: () => void;
};

const GpCodeModal: React.FC<GpCodeModalProps> = ({ visible, onConfirm, onCancel }) => {
    const [code, setCode] = useState('');

    const handleConfirm = () => {
        if (code.trim() === '') return;
        onConfirm(code);
        setCode('');
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Código de grupo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Código"
                        value={code}
                        onChangeText={setCode}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirm}>
                            <Text style={styles.buttonText}>Criar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    confirmButton: {
        width: '100%',
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GpCodeModal;
