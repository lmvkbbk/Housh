import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { s } from './styles';
import { colors } from '@/app/styles/colors';

// Tipagem das props do componente
type GoalModalProps = {
  visible: boolean;
  onConfirm: (name: string, description?: string, timeRemaining?: string) => void;
  onCancel: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ visible, onConfirm, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  const handleConfirm = () => {
    if (name.trim() === '') return; // Impede metas sem nome
    onConfirm(name, description, timeRemaining);
    setName('');
    setDescription('');
    setTimeRemaining('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={s.overlay}>
        <View style={s.modal}>
          <TouchableOpacity style={s.cancelButton} onPress={onCancel}>
            <Text style={s.cancelText}>X</Text>
          </TouchableOpacity>


          <Text style={s.title}>Adicionar Meta</Text>


          <TextInput
            style={s.input}
            placeholder="Qual sua meta?*"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={s.input}
            placeholder="Descricao"
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={s.input}
            placeholder="Duracao?"
            placeholderTextColor="#ccc"
            value={timeRemaining}
            onChangeText={setTimeRemaining}
            keyboardType='numeric'
          />


          <TouchableOpacity style={s.confirmButton} onPress={handleConfirm}>
            <Text style={s.confirmText}>Confirmar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default GoalModal;

