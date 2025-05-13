import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppButton from "@/src/components/Buttons/Buttons";
import { useTheme } from "@/src/context/contextTheme";

export default function RecoveryEmailSentScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const handleBackToLogin = () => {
        router.replace("/auth/sign-in");
    };

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).title}>
                Um e-mail para recuperação da sua conta já foi enviado!
            </Text>

            <AppButton
                title="Voltar para Tela de Login"
                onPress={handleBackToLogin}
                backgroundColor={theme.primary}
                boldText={true}
            />
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
            padding: 20,
        },
        title: {
            color: theme.textPrimary,
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "left",
            width: "80%",
            marginBottom: 40,
        },
    });
