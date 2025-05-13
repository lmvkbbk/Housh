import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { resetPassword } from "../../firebase/auth";
import { useTheme } from "@/src/context/contextTheme";
import AppLoadingButton from "@/src/components/Buttons/LoadingButton";
import AppInput from "@/src/components/Inputs/Input";
import { Theme } from "@/src/styles/themes";

export default function RecoverPassword() {
    const router = useRouter();
    const { theme } = useTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailPlaceholder, setEmailPlaceholder] =
        useState("Digite seu e-mail");

    const handleSendRecoveryEmail = async () => {
        setIsLoading(true);
        try {
            // fazer uma funcao que verifica se tem um usuario com esse email com base o banco de dados
            await resetPassword(email);
            router.replace("/auth/recoveryEmailSentScreen");
        } catch (error) {
            switch (error) {
                case "auth/missing-email":
                    setEmail("");
                    setEmailPlaceholder("Email não encontrado");
                    break;
                case "auth/invalid-email":
                    setEmail("");
                    setEmailPlaceholder("Email inválido");
                    break;
                case "auth/user-not-found":
                    setEmail("");
                    setEmailPlaceholder("E-mail não registrado ");
                    break;
                default:
                    setEmail("");
                    setEmailPlaceholder("Erro ao enviar o email");
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).title}>Esqueceu sua senha?</Text>

            <AppInput
                icon="mail"
                value={email}
                onChangeText={setEmail}
                placeholder={emailPlaceholder}
                autoComplete="email"
                autoCapitalize="none"
            />
            <Text style={styles(theme).subtitle}>
                Digite o email que pertence a conta para que possamos
                recupera-la
            </Text>
            <AppLoadingButton
                isLoading={isLoading}
                onPress={handleSendRecoveryEmail}
                title="Enviar"
                icon="send"
            />
        </View>
    );
}

const styles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.modalBackground,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
        },
        title: {
            color: theme.primary,
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 40,
            textAlign: "center",
        },
        subtitle: {
            color: theme.textSecondary,
            fontSize: 16,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 40,
            width: "80%",
        },
    });
