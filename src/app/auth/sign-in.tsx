import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, Text, View, ActivityIndicator, StyleSheet, Modal, Button} from "react-native";
import { useRouter } from "expo-router";
import { signIn } from "@/src/services/authServices";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import componentColors from "../../styles/componentColors";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const[passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loginMessage, setLoginMessage] = useState('Digite seu e-mail e senha para continuar');

    const [isModalVisible, setIsModalVisible] = useState(false);

    const router = useRouter();

    useEffect(()=>{
        if (email || password){
            setLoginMessage('Digite seu e-mail e senha para continuar');
        }
    },[email, password]);
    // useEffect para retirar alerta do erro quando o usuário tentar o login novamente

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            if (error === "auth/invalid-email") {
                setLoginMessage("E-mail inválido. Verifique as credenciais");
            } else if (error === "auth/user-disabled") {
                setLoginMessage("Essa conta foi desativada. Contate o suporte");
                // fazer uma pagina pra reativação de conta
            }  else if (error === "auth/invalid-credential") {
                setLoginMessage("Senha ou email incorretos. Tente novamente");
            } else if (error === "auth/too-many-requests") {
                setLoginMessage("Muitas tentativas falhas. Tente novamente mais tarde");
            } else if (error === "auth/network-request-failed") {
                setLoginMessage("Erro de conexão. Verifique sua internet");
            } else if (error === "auth/internal-error") {
                setLoginMessage("Erro interno. Tente novamente");
            } else if (error === "auth/missing-password") {
                setLoginMessage("Digite uma senha para continuar");
            }
        }finally{
            setIsLoading(false);
        }
    };

    const handleRecoverPassword = async() =>{
        await setIsModalVisible(!isModalVisible);
        router.push("/auth/recoverPassword");
    };

    const handleNewUser = async() =>{
        await setIsModalVisible(!isModalVisible);
        const seen = await AsyncStorage.getItem('onboardingSeen');
        //uso do asyncStorage para guardar uma variavel local que define se o usuario ja viu o carrossel
        if (seen === 'true') {
            router.push("/auth/sign-up");
        }else {
            router.push('/Presentation');
        }
    };

    return (
        <View style={styles.container}>
            <Modal 
            animationType="slide"
            transparent 
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Login</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                            <AntDesign name="close" size={30} color={componentColors.textPrimary} style={styles.closeIcon} />
                        </TouchableOpacity>
    
                        <TextInput
                            style={styles.inputField}
                            placeholder='Email'
                            placeholderTextColor={componentColors.placeholderText}
                            autoCapitalize="none"
                            autoComplete="email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder='Senha'
                                placeholderTextColor={componentColors.placeholderText}
                                secureTextEntry={!passwordVisible}
                                autoCapitalize="none"
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TouchableOpacity  style={styles.passwordViewer} onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color={componentColors.primary}  />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.subtitle}>{loginMessage}</Text>

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            {isLoading ? (
                                <ActivityIndicator color ={componentColors.textPrimary}  />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>
    
                        <View style={styles.footerContainer}>
                            <TouchableOpacity style={styles.linkButton} onPress={handleRecoverPassword}>
                                <Text style={styles.linkText}>Esqueci a senha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.linkButton} onPress={handleNewUser}>
                                <Text style={styles.linkText}>Novo usuário</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Button title="SiteMap" onPress={()=>router.replace('/_sitemap')}/>
            <Text style={styles.title}>Goal Rush</Text>
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.emailLoginButton} onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.buttonText}>Entrar com e-mail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: componentColors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        color: componentColors.textPrimary,
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        color: componentColors.textSecondary,
        fontSize: 14,
        textAlign: "center",
        width: "100%",
        margin: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: componentColors.modalBackground,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        alignSelf: 'flex-end',
    },
    closeIcon: {
        paddingBottom: 10,
    },
    inputField: {
        width: '100%',
        color: componentColors.textPrimary,
        borderRadius: 12,
        padding: 12,
        fontSize: 18,
        borderWidth: 2,
        borderColor: componentColors.inputBorder,
        marginBottom: 12,
    },
    inputPassword: {
        width: "100%",
        color: componentColors.textPrimary,
        borderColor: componentColors.inputBorder,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: 18,
        padding: 12,
    },
    loginButton: {
        width: '100%',
        backgroundColor: componentColors.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    emailLoginButton: {
        width: '90%',
        backgroundColor: componentColors.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: componentColors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    linkButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    linkText: {
        color: componentColors.secondary,
        fontSize: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "space-between",
    },
    passwordViewer: {
        position: "absolute",
        right: 20,
    },
});

