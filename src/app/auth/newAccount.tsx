import { logIn} from "@/src/services/authServices";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NewAccount() {
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const[passwordVisible, setPasswordVisible] = useState(false);

    const [registrationMessage,setRegistrationMessager] = useState('');

    const hasMinLength = password.length >= 6;
    const hasNumbersAndSymbols = /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // variaveis para verificar se a senha tem pelo menos 6 caracteres e se tem números e símbolos

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(()=>{
        if (hasMinLength && hasNumbersAndSymbols){
            setRegistrationMessager('');
        }
    },[email, password]);
    // useEffect para retirar alerta do erro quando o usuário tentar o cadastro novamente

    const handleUserCadaster = async() => {
            setIsLoading(true);
            try {
                if (!hasMinLength || !hasNumbersAndSymbols){
                    // fazer alguma forma de mostrar que a senha é fraca, caso prescise
                    return;
                }else {
                    await logIn(email, password);
                    router.push("/verification/verificationPage");
                }
            } catch (error) {
                if (error === 'auth/email-already-in-use'){
                    setEmail('');
                    setPassword('');
                    setRegistrationMessager("Email já cadastrado, tente outro ou faça login");
                }  else if(error === 'auth/weak-password'){
                    // näo é preciso fazer nada por enquanto, por causa das condições de senha que coloquei
                    return;
                }else if(error === 'auth/invalid-email'){
                    setEmail('');
                    setPassword('');
                    setRegistrationMessager("Email inválido, verifique as credenciais");
                }
            }finally{
                setIsLoading(false);
            }
        }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Por Aqui?</Text>

            <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                placeholder='Digite seu e-mail'
                placeholderTextColor="#BBBBBB"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                style={styles.inputPassword}
                placeholder='Digite sua senha'
                placeholderTextColor="#BBBBBB"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}  style={styles.passwordViewer}>
                    <Ionicons name={passwordVisible ? "eye-off": "eye"} size={24} color="orange" />
                </TouchableOpacity>
            </View>

            <View style={styles.validationRow}>
                <AntDesign 
                name={hasMinLength ? "checkcircle" : "closecircle"}
                size={18} 
                color={hasMinLength ? "#6BAF7D" : "#D95F5F"}
            />
                <Text style={styles.validationText}>A senha deve ter pelo menos 6 caracteres</Text>
            </View>
            <View style={styles.validationRow}>
                <AntDesign 
                name={hasNumbersAndSymbols ? "checkcircle" : "closecircle"}
                size={18} 
                color={hasNumbersAndSymbols ? "#6BAF7D" : "#D95F5F"}
            />
                <Text style={styles.validationText}>A senha deve conter números e símbolos</Text>
            </View>

            <Text style={styles.subtitle}>Escolha uma senha forte para proteger sua conta.</Text>
            <Text style={styles.titleError}>{registrationMessage}</Text>

            <TouchableOpacity style={styles.button} onPress={handleUserCadaster} activeOpacity={0.8}>
                {isLoading ? (
                    <ActivityIndicator color="#1E1E1E" />
                ) : (
                    <AntDesign name="arrowright" size={24} color="#1E1E1E" />
                )}
            </TouchableOpacity>           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        color: "orange",
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: '20%',
        textAlign: "center",
    },
    titleError: {
        color: "#D95F5F",
        fontSize: 16,
        textAlign: "center",
        width: "95%", 
        padding: 10,
    },
    input: {
        width: "90%",
        backgroundColor: "#2C2C2C",
        color: "#FFFFFF",
        borderColor: "orange",
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 18,
        padding: 15,
        marginBottom: 15,
    },
    inputPassword: {
        width: "100%",
        backgroundColor: "#2C2C2C",
        color: "#FFFFFF",
        borderColor: "orange",
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 18,
        padding: 15,
    },
    subtitle: {
        color: "#AAAAAA",
        fontSize: 16,
        textAlign: "center",
        width: "95%", 
        padding: 10,
    },
    button: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: "#FFA500",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: "center",
    },
    passwordContainer: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "space-between",
    },
    passwordViewer: {
        position: "absolute",
        right: 20,
    },
    validationRow: {
        width: "85%", 
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    validationText: {
        marginLeft: 5,
        fontSize: 16,
        color: "#AAAAAA",
        textAlign: "auto",
        
    },
});
