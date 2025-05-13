import { View, StyleSheet, SafeAreaView, Button } from "react-native";
import { useTheme } from "../../context/contextTheme";
import { StatusBar } from "expo-status-bar";
import { Theme } from "../../styles/themes";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signIn } from "../../firebase/auth";
import ModalLogin from "@/src/components/SignIn/ModalLogin";
import AppButton from "@/src/components/Buttons/Buttons";

export default function SignIn() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState(
        "Digite seu e-mail e senha para continuar",
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (email || password) {
            setLoginMessage("Digite seu e-mail e senha para continuar");
        }
    }, [email, password]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            if (error === "auth/invalid-email") {
                setLoginMessage(
                    "E-mail inválido. Verifique o formato do endereço.",
                );
            } else if (error === "auth/user-disabled") {
                setLoginMessage(
                    "Essa conta foi desativada. Contate o suporte.",
                );
            } else if (error === "auth/user-not-found") {
                setLoginMessage("Nenhuma conta encontrada com esse e-mail.");
            } else if (
                error === "auth/wrong-password" ||
                error === "auth/invalid-credential"
            ) {
                setLoginMessage("Senha ou e-mail incorretos. Tente novamente.");
            } else if (error === "auth/too-many-requests") {
                setLoginMessage(
                    "Muitas tentativas falhas. Tente novamente mais tarde.",
                );
            } else if (error === "auth/network-request-failed") {
                setLoginMessage("Erro de conexão. Verifique sua internet.");
            } else if (error === "auth/internal-error") {
                setLoginMessage("Erro interno no servidor. Tente novamente.");
            } else if (error === "auth/missing-password") {
                setLoginMessage("Digite uma senha para continuar.");
            } else if (error === "auth/operation-not-allowed") {
                setLoginMessage(
                    "Autenticação por e-mail/senha está desativada.",
                );
            } else {
                setLoginMessage("Erro desconhecido. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecoverPassword = async () => {
        setIsModalVisible(!isModalVisible);
        router.push("/auth/recoverPassword");
    };

    const handleNewUser = async () => {
        setIsModalVisible(!isModalVisible);
        const seen = await AsyncStorage.getItem("onboardingSeen");
        //uso do asyncStorage para guardar uma variavel local que define se o usuario ja viu o carrossel
        if (seen === "true") {
            router.push("/auth/sign-up");
        } else {
            router.push("/OnboardingPresentation");
        }
    };

    return (
        <SafeAreaView style={styles(theme).container}>
            <View style={{ flex: 1, position: "absolute", bottom: 40 }}>
                <StatusBar style="auto" />
                <Button title="Trocar Tema" onPress={() => toggleTheme()} />
                <Button
                    title="Site Map"
                    onPress={() => router.push("/_sitemap")}
                />
                <AppButton
                    widthButton={"100%"}
                    icon="mail"
                    title="Entrar com e-mail"
                    onPress={() => setIsModalVisible(true)}
                    backgroundColor={theme.primary}
                    textColor={theme.textPrimary}
                    boldText={true}
                />
                <ModalLogin
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    loginMessage={loginMessage}
                    isLoading={isLoading}
                    handleLogin={handleLogin}
                    handleRecoverPassword={handleRecoverPassword}
                    handleNewUser={handleNewUser}
                />
            </View>
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
        text: {
            color: theme.textPrimary,
        },
    });
