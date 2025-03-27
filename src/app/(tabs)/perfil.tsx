import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '@/components/header';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

interface PerfilProps {
  userName?: string;
  userImage?: string;
  userPoints?: number;
}

const Perfil: React.FC<PerfilProps> = ({ userName = "Mario", userImage, userPoints = 0 }) => {
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <Header title="Perfil" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // Função para editar perfil, pode ser implementada
            console.log('Editar perfil');
          }}
        >
          <Ionicons name="create" size={24} color="white" />
        </TouchableOpacity>
        
        <View  style={{alignItems: 'center', right: 10}}>
          <Image
            source={userImage ? { uri: userImage } : require('../../../assets/userdefault.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.name}>{userName}</Text>
        <View style={styles.userInfoContainer}>
            <Text style={styles.text}><Ionicons name="trophy" size={24} color="#FFD700" /> {userPoints}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: colors.grey2,
    borderWidth: 3,
    marginHorizontal: 8,
    marginTop: 20,
    borderRadius: 30,
    height: '85%',
    paddingBottom: 20,
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: colors.grey1,
    borderRadius: 10,
    padding: 8,
  },
  userInfoContainer: {
    alignItems: 'center',
    right: 10,
    height: 60,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: colors.grey1,
  },
  name: {
    marginTop: 15,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    marginTop: 20,
    marginLeft: 20,
    borderColor: '#FFD700',
    borderWidth: 3,
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: 'grey',
  },
});

export default Perfil;
