import { updateUserPassword } from '@/src/services/authServices';
import componentColors from '@/src/styles/componentColors';
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(()=>{
      if(newPassword.trimEnd() === confirmPassword.trimEnd()){
        setErrorMessage('');
      }else {
        setErrorMessage('As senhas não coicidem')
      }
    },[newPassword, confirmPassword]);

  const hasMinLength = newPassword.length >= 6 || confirmPassword.length >= 6;
  const hasNumbersAndSymbols = 
    /[0-9]/.test(newPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ||
    /[0-9]/.test(confirmPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword);
      
  const changePassword = async ()=> {
    setIsLoading(true);
    if (newPassword.trimEnd() === confirmPassword.trimEnd()) {
      try {
        await updateUserPassword(newPassword);
        router.replace('/(tabs)/home');

      } catch (error) {
        switch (error) {
          case "auth/requires-recent-login":
            setErrorMessage("Por segurança, você precisa se autenticar novamente.");
            break;
          case "auth/weak-password":
            setErrorMessage("A senha é muito fraca. Use pelo menos 6 caracteres.");
            break;
          case "auth/user-disabled":
            setErrorMessage("Sua conta foi desativada. Entre em contato com o suporte.");
            break;
          case "auth/network-request-failed":
            setErrorMessage("Sem conexão. Verifique sua internet.");
            break;
          default:
            console.log("Erro desconhecido:", error); 
            setErrorMessage("Erro ao atualizar sua senha. Tente novamente mais tarde.");
            break;
        }
      } finally {
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

      <FontAwesome name='unlock-alt' size={80} color='#4A4A4A'/>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Nova senha</Text>
        <MaterialIcons name="edit" size={30} color={componentColors.primary} />
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Digite sua nova senha"
          placeholderTextColor={componentColors.placeholderText}
          secureTextEntry={!isNewPasswordVisible}
          autoCapitalize="none"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.passwordViewer} onPress={()=>setIsNewPasswordVisible(!isNewPasswordVisible)}>
          <Ionicons name={isNewPasswordVisible ? "eye-off" : "eye"} size={24} color={componentColors.primary}  />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirme sua nova senha"
          placeholderTextColor={componentColors.placeholderText}
          secureTextEntry={!isConfirmPasswordVisible}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.passwordViewer} onPress={()=>setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
            <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color={componentColors.primary}  />
        </TouchableOpacity>
      </View>
      <View style={styles.validationRow}>
                <AntDesign 
                name={hasMinLength? "checkcircle" : "closecircle"}
                size={18} 
                color={hasMinLength ? componentColors.correct : componentColors.incorret}
            />
                <Text style={styles.validationText}>A sua nova senha deve ter pelo menos 6 caracteres</Text>
            </View>
            <View style={styles.validationRow}>
                <AntDesign 
                name={hasNumbersAndSymbols ? "checkcircle" : "closecircle"}
                size={18} 
                color={hasNumbersAndSymbols ? componentColors.correct : componentColors.incorret}
            />
                <Text style={styles.validationText}>A sua nova senha deve conter números e símbolos</Text>
            </View>
      <Text style={styles.subtitle}>{errorMessage}</Text>

      <TouchableOpacity style={styles.button} onPress={changePassword}>
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
  inputPassword:{
    width: '100%',
    borderColor: componentColors.inputBorder,
    borderWidth: 2,
    borderRadius: 12 ,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: componentColors.textPrimary,
    fontSize: 16,
  },
  passwordContainer: {
    width: "85%",
    justifyContent:'center',
    marginBottom: 16,
  },
  passwordViewer:{
    position: 'absolute',
    right: 20,
  },
  validationRow: {
    width: "90%", 
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  validationText: {
    marginLeft: 5,
    fontSize: 16,
    color: componentColors.textSecondary,
    textAlign: "auto",
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