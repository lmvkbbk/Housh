import { auth } from '@/src/database/firebase';
import { emailUpdate, emailVerification } from '@/src/services/authServices';
import componentColors from '@/src/styles/componentColors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';

export default function NewEmail() {
  const [email, setEmail]=useState('');
  const [confirmMail, setConfirmMail]=useState('');

  const [alertMensage, setAlertMensage]= useState('');
  const [isLoading, setIsLoading]= useState(false);

  const router = useRouter();

  useEffect(()=>{
    if(email.trimEnd() === confirmMail.trimEnd()){
      setAlertMensage('');
    }else {
      setAlertMensage('Os emails não coicidem')
    }
  },[email, confirmMail]);

  const changeEmail = async () => {
    setIsLoading(true);
    if(email.trimEnd() === confirmMail.trimEnd()){
      try {
        await emailUpdate(auth.currentUser, confirmMail);
        await emailVerification(auth.currentUser);
        router.replace({
          pathname: '/verification/verificationPage',
          params: {path: '/(tabs)/home'}
        })
      } catch (error) {
        console.log(error);
        switch (error) {
          case 'auth/requires-recent-login':
            setAlertMensage('Sessão expirada por favor, confirme sua identidade novamente para confirmar.');
            break;
          case 'auth/invalid-email':
            setAlertMensage('E-mail inválido digite um endereço de e-mail válido.');
            break;
          case 'auth/email-already-in-use':
            setAlertMensage('E-mail já em uso este e-mail já está cadastrado em outra conta.');
            break;
          default:
            setAlertMensage('Erro ao atualizar e-mail Tente novamente mais tarde.');
            break;
        }
      }finally{
        setIsLoading(false);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle='light-content'
        backgroundColor={componentColors.modalBackground}
      />

      <FontAwesome name='envelope' size={80} color='#4A4A4A'/>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Alterar E-mail</Text>
        <MaterialIcons name="edit" size={30} color={componentColors.primary} />
      </View>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu novo e-mail"
        placeholderTextColor={componentColors.placeholderText}
        autoCapitalize="none"
        autoComplete="email"
        style={styles.inputEmail}
      />

      <TextInput
        value={confirmMail}
        onChangeText={setConfirmMail}
        placeholder="Confirme seu novo e-mail"
        placeholderTextColor={componentColors.placeholderText}
        autoCapitalize="none"
        autoComplete="email"
        style={styles.inputEmail}
      />

      <Text style={styles.subtitle}>{alertMensage}</Text>

      <TouchableOpacity style={styles.button} onPress={changeEmail}>
        {isLoading ? (
          <ActivityIndicator color={componentColors.textPrimary}/>
        ):(
          <Text style={styles.textButton}>Salvar alterações</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: componentColors.modalBackground,
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:30,
    marginBottom: 50
  },
  title:{
    fontSize: 28,
    fontWeight: 'bold',
    color: componentColors.textPrimary,
  },
  subtitle: {
    width: '89%',
    fontSize: 15,
    color: componentColors.incorret,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputEmail:{
    width: '90%',
    borderColor: componentColors.inputBorder,
    borderWidth: 2,
    borderRadius: 12 ,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: componentColors.textPrimary,
    fontSize: 16,
  },
  button:{
    backgroundColor: componentColors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignContent: 'center'
  },
  textButton:{
    color: componentColors.textPrimary,
    fontWeight: '600',
    fontSize: 17,
  },
});