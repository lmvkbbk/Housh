import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import componentColors from "../../styles/colors";

export default function RecoveryEmailSentScreen(){

    const router = useRouter();

    const handleBackToLogin = () =>{
        router.replace('/auth/signin');
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Um e-mail para recuperação da sua conta já foi enviado!</Text>
            <TouchableOpacity style={styles.button} onPress={handleBackToLogin} activeOpacity={0.8}>
                <Text style={styles.textButton}>Voltar para tela de Login</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: componentColors.modalBackground,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        color: componentColors.primary,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    button:{
        backgroundColor: componentColors.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        margin: 50,
        borderRadius: 10,
        alignItems: 'center'
    },
    textButton: {
        color: componentColors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold'
    }
});