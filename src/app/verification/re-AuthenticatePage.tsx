import { auth } from "@/src/database/firebase";
import { reauthenticate } from "@/src/services/authServices";
import componentColors from "@/src/styles/componentColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ReauthenticatePage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [alertMensage, setAlertMensage]= useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const {path} = useLocalSearchParams();

    useEffect(()=>{
      if (email||password){
        setAlertMensage('');
      }
    },[email, password])

    const handleConfirm = async () =>{
      if (!email || !password){
        setAlertMensage('É presciso digitar seu email junto com a senha para a verificação');
      }else {
        setLoading(true);
        try {
          await reauthenticate(email, password, auth.currentUser);
          if (typeof path === "string"){
            router.replace(path as any);
          }
        } catch (error) {
          console.log(error);
          switch (error) {
            case "auth/invalid-credential":
              setAlertMensage("Senha ou email incorretos")
              break;
            case "auth/wrong-password":
              setAlertMensage("Senha atual incorreta.");
              break;
            case "auth/user-mismatch":
              setAlertMensage("O e-mail informado não corresponde ao usuário atual. Verifique e tente novamente.");
              break;
            case "auth/too-many-requests":
              setAlertMensage("Muitas tentativas. Tente mais tarde.");
              break;
            default:
              setAlertMensage("Erro ao reautenticar tente novamente " );
              break;
          } 
        }finally{
            setLoading(false);
        }
      }
    }

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle='light-content'
                backgroundColor={componentColors.modalBackground}
            />
            
            <Ionicons name="shield-checkmark" size={100} color={componentColors.secondary}/>
            <Text style={styles.title}>Verificação rápida</Text>
            <Text style={styles.subtitle}>Esse passo ajuda a proteger sua conta</Text>

            <TextInput
                style={styles.inputEmail}
                placeholder='Email'
                placeholderTextColor={componentColors.placeholderText}
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}                            
            />
            <View style={styles.containerInputPassword}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder='Senha'
                    placeholderTextColor={componentColors.placeholderText}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.passwordViewer} onPress={()=> setPasswordVisible(!passwordVisible)}>
                    <Ionicons name={passwordVisible ? 'eye-off': "eye"} size={24} color={componentColors.primary}/>
                </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, { color: alertMensage ? componentColors.incorret : componentColors.textSecondary }]}>{alertMensage}</Text>        

            <TouchableOpacity onPress={handleConfirm} style={styles.buttonConfirm}>
                {loading?(
                  <ActivityIndicator color={componentColors.textPrimary}/>
                ) : (
                  <Text style={styles.buttonTextConfirm}>Confirmar Identidade</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: componentColors.modalBackground,
      paddingHorizontal: 24,
      paddingTop: 48,
      alignItems: 'center',
      justifyContent: 'center' 
    },
    title: {
      fontSize: 26,
      color: componentColors.textPrimary,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 4,
      textAlign: 'center',
    },
    subtitle: {
      width: '89%',
      fontSize: 15,
      color: componentColors.textSecondary,
      fontWeight: 'bold',
      marginBottom: 32,
      textAlign: 'center',
      lineHeight: 22,
    },
    inputEmail:{
      width: '90%',
      color: componentColors.textPrimary,
      borderWidth: 1.5,
      borderRadius: 10,
      borderColor: componentColors.inputBorder,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    containerInputPassword: {
      width: '90%',
      position: 'relative',
      marginBottom: 24,
    },
    inputPassword: {
      width: '100%',
      color: componentColors.textPrimary,
      borderWidth: 1.5,
      borderRadius: 10,
      borderColor: componentColors.inputBorder,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      paddingRight: 40, 
    },
    passwordViewer: {
      position: 'absolute',
      right: 12,
      top: 12,
    },
    buttonConfirm: {
      backgroundColor: componentColors.primary,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonTextConfirm: {
      color: componentColors.textPrimary,
      fontWeight: '600',
      fontSize: 17,
    },
    linkButton: {
      paddingVertical: 10,
    },
    textLinkButton: {
      color: componentColors.secondary,
      fontSize: 15,
    },
  });