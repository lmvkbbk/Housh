import { auth } from "@/src/firebase/config";
import { useAuth } from "@/src/hooks/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AppButton from "@/src/components/Buttons/Buttons";
import { useTheme } from "@/src/context/contextTheme";

export default function verificationPage() {
    const { user } = useAuth();
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();
    const { path } = useLocalSearchParams();
    const { theme } = useTheme();

    const nextStep = () => {
        if (path) {
            router.replace(path as any);
        } else {
            router.replace("/profile/profileConfig");
        }
    };

    useEffect(() => {
        const checkVerification = async () => {
            try {
                await auth.currentUser?.reload(); // atualiza o estado do usuário atual com os dados mais recentes
                if (auth.currentUser?.emailVerified) {
                    setIsVerified(true);
                } else {
                    console.log("O e-mail ainda não foi verificado.");
                }
            } catch (error) {
                console.error("Erro ao verificar o e-mail:", error);
            }
        };

        if (isVerified) return; // se o e-mail já foi verificado, não precisa verificar novamente, use effect é encerrado

        checkVerification();

        const intervalId = setInterval(() => {
            checkVerification();
        }, 5000);
        // verifica se o e-mail foi verificado a cada 5 segundos

        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).title}>
                Enviamos um e-mail para a ativação do seu Email
            </Text>
            <Text style={styles(theme).subtitle}>
                Por favor, verifique sua caixa de entrada e siga as instruções
                para concluir o processo
            </Text>
            {isVerified ? (
                <AppButton
                    onPress={nextStep}
                    title="Continuar"
                    backgroundColor={theme.primary}
                    boldText={true}
                    icon="lock-open"
                />
            ) : (
                <ActivityIndicator color={theme.textPrimary} size={32} />
            )}
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.modalBackground,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            color: theme.primary,
            fontSize: 32,
            fontWeight: "bold",
            padding: 20,
            textAlign: "center",
        },
        subtitle: {
            color: theme.textSecondary,
            fontSize: 16,
            paddingHorizontal: 32,
            textAlign: "center",
            marginBottom: "20%",
        },
    });
