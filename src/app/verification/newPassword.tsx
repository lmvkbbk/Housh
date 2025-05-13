import AppLoadingButton from "@/src/components/Buttons/LoadingButton";
import AppInputPassword from "@/src/components/Inputs/InputPassword";
import PasswordValidation from "@/src/components/SignUp/PasswordValidation";
import { useTheme } from "@/src/context/contextTheme";
import { updateUserPassword } from "@/src/firebase/auth";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        if (newPassword.trimEnd() === confirmPassword.trimEnd()) {
            setErrorMessage("");
        } else {
            setErrorMessage("As senhas não coicidem");
        }
    }, [newPassword, confirmPassword]);

    const hasMinLength = newPassword.length >= 6 || confirmPassword.length >= 6;
    const hasNumbersAndSymbols =
        (/[0-9]/.test(newPassword) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) ||
        (/[0-9]/.test(confirmPassword) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword));

    const changePassword = async () => {
        setIsLoading(true);
        if (newPassword.trimEnd() === confirmPassword.trimEnd()) {
            try {
                await updateUserPassword(newPassword);
                router.replace("/(tabs)/home");
            } catch (error) {
                switch (error) {
                    case "auth/requires-recent-login":
                        setErrorMessage(
                            "Por segurança, você precisa se autenticar novamente.",
                        );
                        break;
                    case "auth/weak-password":
                        setErrorMessage(
                            "A senha é muito fraca. Use pelo menos 6 caracteres.",
                        );
                        break;
                    case "auth/user-disabled":
                        setErrorMessage(
                            "Sua conta foi desativada. Entre em contato com o suporte.",
                        );
                        break;
                    case "auth/network-request-failed":
                        setErrorMessage("Sem conexão. Verifique sua internet.");
                        break;
                    default:
                        console.log("Erro desconhecido:", error);
                        setErrorMessage(
                            "Erro ao atualizar sua senha. Tente novamente mais tarde.",
                        );
                        break;
                }
            } finally {
                setIsLoading(false);
            }
        }
    };
    return (
        <SafeAreaView style={styles(theme).container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={theme.modalBackground}
            />

            <FontAwesome
                name="unlock-alt"
                size={80}
                color={theme.textSecondary}
            />

            <View style={styles(theme).titleRow}>
                <Text style={styles(theme).title}>Nova senha</Text>
                <MaterialIcons name="edit" size={30} color={theme.primary} />
            </View>

            <AppInputPassword
                icon={true}
                iconName="lock-closed-outline"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Digite sua nova senha"
            />
            <AppInputPassword
                icon={true}
                iconName="repeat-outline"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme sua nova senha"
            />
            {errorMessage && (
                <Text style={styles(theme).subtitle}>{errorMessage}</Text>
            )}
            <PasswordValidation
                hasMinLength={hasMinLength}
                hasNumbersAndSymbols={hasNumbersAndSymbols}
            />

            <AppLoadingButton
                icon="save-outline"
                onPress={changePassword}
                isLoading={isLoading}
                title="Salvar alterações"
                propStyle={{ marginTop: 30 }}
            />
        </SafeAreaView>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.modalBackground,
            paddingHorizontal: 24,
        },
        titleRow: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 50,
        },
        title: {
            fontSize: 28,
            fontWeight: "bold",
            color: theme.textPrimary,
        },
        subtitle: {
            width: "89%",
            fontSize: 15,
            color: theme.incorret,
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 22,
        },
    });
