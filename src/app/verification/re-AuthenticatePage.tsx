import { auth } from "@/src/firebase/config";
import { reauthenticate } from "@/src/firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text } from "react-native";
import AppInput from "@/src/components/Inputs/Input";
import { useTheme } from "@/src/context/contextTheme";
import AppInputPassword from "@/src/components/Inputs/InputPassword";
import AppLoadingButton from "@/src/components/Buttons/LoadingButton";

export default function ReauthenticatePage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [alertMensage, setAlertMensage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { path } = useLocalSearchParams();
    const { theme } = useTheme();

    useEffect(() => {
        if (email || password) {
            setAlertMensage("");
        }
    }, [email, password]);

    const handleConfirm = async () => {
        if (!email || !password) {
            setAlertMensage(
                "É presciso digitar seu email junto com a senha para a verificação",
            );
        } else {
            setLoading(true);
            try {
                await reauthenticate(email, password, auth.currentUser);
                if (typeof path === "string") {
                    router.replace(path as any);
                }
                //aqui manda da pra deletar
            } catch (error) {
                console.log(error);
                switch (error) {
                    case "auth/invalid-credential":
                        setAlertMensage("Senha ou email incorretos");
                        break;
                    case "auth/wrong-password":
                        setAlertMensage("Senha atual incorreta.");
                        break;
                    case "auth/user-mismatch":
                        setAlertMensage(
                            "O e-mail informado não corresponde ao usuário atual. Verifique e tente novamente.",
                        );
                        break;
                    case "auth/too-many-requests":
                        setAlertMensage("Muitas tentativas. Tente mais tarde.");
                        break;
                    default:
                        setAlertMensage(
                            "Erro ao reautenticar tente novamente ",
                        );
                        break;
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles(theme).container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={theme.modalBackground}
            />

            <Ionicons
                name="shield-checkmark"
                size={100}
                color={theme.secondary}
            />
            <Text style={styles(theme).title}>Verificação rápida</Text>
            <Text style={styles(theme).subtitle}>
                Esse passo ajuda a proteger sua conta
            </Text>

            <AppInput
                icon="mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                autoComplete="email"
            />
            <AppInputPassword
                icon={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
            />

            <Text
                style={[
                    styles(theme).subtitle,
                    {
                        color: alertMensage
                            ? theme.incorrect
                            : theme.textSecondary,
                    },
                ]}
            >
                {alertMensage}
            </Text>

            <AppLoadingButton
                isLoading={loading}
                onPress={handleConfirm}
                title="Confirmar Identidade"
                icon="checkmark-circle-outline"
            />
        </SafeAreaView>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.modalBackground,
            paddingHorizontal: 24,
            paddingTop: 48,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            fontSize: 26,
            color: theme.textPrimary,
            fontWeight: "bold",
            marginTop: 16,
            marginBottom: 4,
            textAlign: "center",
        },
        subtitle: {
            width: "89%",
            fontSize: 15,
            color: theme.textSecondary,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
            lineHeight: 22,
        },
    });
