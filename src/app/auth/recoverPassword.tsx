import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { resetPassword } from "../../services/authServices";
import componentColors from "../../styles/colors";

export default function RecoverPassword(){
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailPlaceholder, setEmailPlaceholder] = useState('Digite seu e-mail');

    const router = useRouter();

    const handleSendRecoveryEmail= async() => {
        setIsLoading(true);
        try {
            // fazer uma funcao que verifica se tem um usuario com esse email com base o banco de dados
            await resetPassword(email);
            router.replace('/auth/RecoveryEmailSentScreen');
        } catch (error) {
            console.log("erro no envio do email de recuperacao: ",error);
            if(error === 'auth/missing-email'){
                setEmail('');
                setEmailPlaceholder("Email não encontrado");
            }else if(error === 'auth/invalid-email'){
                setEmail('');
                setEmailPlaceholder("Email inválido");
            }
        } finally{
            setIsLoading(false);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Esqueceu sua senha?</Text>
            <TextInput style={styles.input}
                placeholder={emailPlaceholder}
                placeholderTextColor={componentColors.placeholderText}
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.subtitle}>Digite o email que pertence a conta para que possamos recupera-la</Text>
            <TouchableOpacity style={styles.button}onPress={handleSendRecoveryEmail}>
                {isLoading? (
                    <ActivityIndicator color={componentColors.textPrimary}/>
                ):(
                    <Text style={styles.buttonText}>Enviar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: componentColors.modalBackground,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        color: componentColors.primary,
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: '20%',
        textAlign: "center",
    },
    input: {
        width: "100%",
        color: componentColors.textPrimary,
        borderColor: componentColors.inputBorder,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: 18,
        padding: 15,
        marginBottom: 15,
    },
    subtitle: {
        color: componentColors.textSecondary,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        width: "80%",
    },
    button: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: componentColors.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: componentColors.textPrimary,
        fontSize: 18,
        fontWeight: "bold",
    }
});