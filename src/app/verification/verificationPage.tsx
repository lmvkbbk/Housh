import { auth } from "@/src/database/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function verificationPage() {
    const {user} = useAuth();
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    const teste = () => {
        router.navigate('/Home');
    }

    useEffect(()=>{
        const checkVerification = async () => {
            try {
                await auth.currentUser?.reload();  // atualiza o estado do usuário atual com os dados mais recentes
                if (auth.currentUser?.emailVerified) {
                    setIsVerified(true);
                } else {
                    console.log('O e-mail ainda não foi verificado.');
                }
            } catch (error) {
                console.error('Erro ao verificar o e-mail:', error);
            }
        };
        
        if (isVerified) return; // se o e-mail já foi verificado, não precisa verificar novamente, use effect é encerrado

        checkVerification();

        const intervalId = setInterval(()=>{
            checkVerification();
        },5000);
        // verifica se o e-mail foi verificado a cada 5 segundos

        return()=> clearInterval(intervalId);
        // limpa o timer quando a função terminar de ser executada
    },[user]);
    // useEffect que executa enquanto tiver um usuário autenticado

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Enviamos um e-mail para a ativação da sua conta</Text>
            <Text style={styles.subtitle}>Por favor, verifique sua caixa de entrada e siga as instruções para concluir o processo</Text>
                {isVerified ? (
                    <TouchableOpacity style={styles.button} onPress={teste}>
                        <Text style={styles.textButton}>Continuar</Text>
                    </TouchableOpacity>
                ):(
                    <ActivityIndicator color={"orange"}/>
                ) }
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'orange',
        fontSize: 38,
        fontWeight: 'bold',
        padding: 20,
        textAlign: 'center'
    },
    subtitle: {
        color: 'gray',
        fontSize: 22,
        paddingHorizontal: 30,
        textAlign: 'center',
        marginBottom: '20%'
    },
    button: {
        backgroundColor: "#FFA500",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: "center",
    },
    textButton:{
        color:'#121212',
        fontSize: 22, 
        fontWeight: 'bold',
    },
})
