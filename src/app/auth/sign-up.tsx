import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, StyleSheet, View, Platform } from "react-native";
import { router, useRouter } from "expo-router";
import AppInput from "../../components/Inputs/Input";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/contextTheme";
import AppInputPassword from "../../components/Inputs/InputPassword";
import { Theme } from "../../styles/themes";
import AppLoadingButton from "../../components/Buttons/LoadingButton";
import PasswordValidation from "../../components/SignUp/PasswordValidation";
import { logIn } from "@/src/firebase/auth";
import AppButton from "@/src/components/Buttons/Buttons";

export default function SignUp() {
    const route = useRouter();
    const { theme } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const hasMinLength = password.length >= 6;
    const hasNumbersAndSymbols =
        /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // variaveis para verificar se a senha tem pelo menos 6 caracteres e se tem números e símbolos

    useEffect(() => {
        if (hasMinLength && hasNumbersAndSymbols) {
            setErrorMessage("");
        }
    }, [email, password]);

    const resetCredentials = () => {
        setEmail("");
        setPassword("");
    };

    const handleUserCadaster = async () => {
        setIsLoading(true);
        try {
            if (!hasMinLength || !hasNumbersAndSymbols) {
                // fazer alguma forma de mostrar que a senha é fraca, caso prescise
                return;
            } else {
                await logIn(email, password);
                route.replace("/verification/verificationPage");
            }
        } catch (error) {
            switch (error) {
                case "auth/email-already-in-use":
                    resetCredentials();
                    return setErrorMessage(
                        "Email já cadastrado. Tente outro ou faça login.",
                    );
                case "auth/invalid-email":
                    resetCredentials();
                    return setErrorMessage(
                        "Email inválido. Verifique suas credenciais.",
                    );
                case "auth/weak-password":
                    return setErrorMessage(
                        "A senha é muito fraca. Escolha uma mais segura.",
                    );
                case "auth/network-request-failed":
                    return setErrorMessage(
                        "Erro de conexão. Verifique sua internet.",
                    );
                case "auth/too-many-requests":
                    return setErrorMessage(
                        "Muitas tentativas falhas. Tente novamente mais tarde.",
                    );
                case "auth/internal-error":
                    return setErrorMessage(
                        "Erro interno. Tente novamente mais tarde.",
                    );
                case "auth/operation-not-allowed":
                    return setErrorMessage(
                        "Cadastro de usuários está temporariamente indisponível.",
                    );
                case "auth/missing-password":
                    return setErrorMessage("Digite uma senha para continuar.");
                default:
                    console.warn("Erro não tratado:", error);
                    return setErrorMessage(
                        "Erro desconhecido. Tente novamente mais tarde.",
                    );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles(theme).container}>
            <StatusBar style="auto" />
            <Text style={styles(theme).title}>Novo Por Aqui?</Text>
            <AppInput
                icon="mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                secureText={false}
                autoComplete="email"
            />
            <AppInputPassword
                icon={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
            />
            {errorMessage && (
                <Text style={styles(theme).errorText}>{errorMessage}</Text>
            )}
            <PasswordValidation
                hasMinLength={hasMinLength}
                hasNumbersAndSymbols={hasNumbersAndSymbols}
            />
            <Text style={styles(theme).subtitle}>
                Escolha uma senha forte para proteger sua conta
            </Text>

            <AppLoadingButton
                isLoading={isLoading}
                onPress={handleUserCadaster}
                title="Cadastrar"
                icon="arrow-redo"
            />

            <AppButton
                title="Ja tenho uma Conta"
                onPress={() => route.push("/auth/sign-in")}
                textColor={theme.secondary}
            />
        </SafeAreaView>
    );
}

const styles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.modalBackground,
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: theme.primary,
            marginBottom: 40,
            textAlign: "center",
        },
        subtitle: {
            color: theme.textSecondary,
            marginTop: 4,
            margin: 20,
            textAlign: "center",
        },
        errorText: {
            fontSize: 14,
            color: theme.incorrect,
            textAlign: "center",
            marginVertical: 8,
            marginTop: 4,
        },
    });
