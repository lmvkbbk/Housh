import React, {useState} from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import {s} from './styles';

type GpCodeModalProps = {
    visible: boolean;
    onConfirm: (code: string) => void;
    onCancel: () => void;
}

const GpCodeModal: React.FC<GpCodeModalProps> = ({ visible, onConfirm, onCancel }) => {
    const [code, setCode] = useState('');
    const handleConfirm = () => {
        if (code.trim() === '') return;
        onConfirm(code);
        setCode('');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={s.container}>
                <View style={s.codeContainer}>
                    <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={onCancel}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 20,fontWeight:"bold", marginBottom: 10}}>Código de grupo</Text>
                    <TextInput
                        style={s.codeInput}
                        placeholder="Código"
                        value={code}
                        onChangeText={setCode}
                    />
                    <TouchableOpacity style={s.confirmButton} onPress={handleConfirm}>
                        <Text style={{color: '#fff', textAlign: 'center'}}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default GpCodeModal;