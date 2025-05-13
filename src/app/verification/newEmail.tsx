import { auth } from "@/src/firebase/config";
import { emailUpdate, emailVerification } from "@/src/firebase/auth";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import AppLoadingButton from "@/src/components/Buttons/LoadingButton";
import AppInput from "@/src/components/Inputs/Input";
import { useTheme } from "@/src/context/contextTheme";

export default function NewEmail() {
    const [email, setEmail] = useState("");
    const [confirmMail, setConfirmMail] = useState("");

    const [alertMensage, setAlertMensage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        if (email.trimEnd() === confirmMail.trimEnd()) {
            setAlertMensage("");
        } else {
            setAlertMensage("Os emails não coicidem");
        }
    }, [email, confirmMail]);

    const changeEmail = async () => {
        setIsLoading(true);
        if (email.trimEnd() === confirmMail.trimEnd()) {
            try {
                await emailUpdate(auth.currentUser, confirmMail);
                await emailVerification(auth.currentUser);
                router.replace({
                    pathname: "/verification/verificationPage",
                    params: { path: "/(tabs)/home" },
                });
            } catch (error) {
                console.log(error);
                switch (error) {
                    case "auth/requires-recent-login":
                        setAlertMensage(
                            "Sessão expirada por favor, confirme sua identidade novamente para confirmar.",
                        );
                        break;
                    case "auth/invalid-email":
                        setAlertMensage(
                            "E-mail inválido digite um endereço de e-mail válido.",
                        );
                        break;
                    case "auth/email-already-in-use":
                        setAlertMensage(
                            "E-mail já em uso este e-mail já está cadastrado em outra conta.",
                        );
                        break;
                    default:
                        setAlertMensage(
                            "Erro ao atualizar e-mail Tente novamente mais tarde.",
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
                name="envelope"
                size={80}
                color={theme.textSecondary}
            />

            <View style={styles(theme).titleRow}>
                <Text style={styles(theme).title}>Alterar E-mail</Text>
                <MaterialIcons name="edit" size={30} color={theme.primary} />
            </View>

            <AppInput
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu novo e-mail"
                autoCapitalize="none"
                autoComplete="email"
            />
            <AppInput
                icon="mail-open-outline"
                value={confirmMail}
                onChangeText={setConfirmMail}
                placeholder="Digite seu novo e-mail"
                autoCapitalize="none"
                autoComplete="email"
            />

            <Text style={styles(theme).subtitle}>{alertMensage}</Text>

            <AppLoadingButton
                icon="save-outline"
                onPress={changeEmail}
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
            marginBottom: 20,
            textAlign: "center",
            lineHeight: 22,
        },
    });
