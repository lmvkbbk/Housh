import React, {useState} from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import {s} from './styles';

type createGroupModalProps = {
    visible: boolean;
    onConfirm: (name: string) => void;
    onCancel: () => void;
}

const createGroupModal: React.FC<createGroupModalProps> = ({ visible, onConfirm, onCancel }) => {
    const [name, setName] = useState('');
    const handleConfirm = () => {
        if (name.trim() === '') return;
        onConfirm(name);
        setName('');
    };

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}>
            <View style={s.container}>
                <View style={s.nameContainer}>
                    <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={onCancel}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 20,fontWeight:"bold", marginBottom: 10}}>Nome do grupo</Text>
                    <TextInput
                        style={s.nameInput}
                        placeholder="Nome"
                        value={name}
                        onChangeText={setName}
                    />
                    <TouchableOpacity style={s.confirmButton} onPress={handleConfirm}>
                        <Text style={{color: '#fff', textAlign: 'center'}}>Criar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


export default createGroupModal;


