import { auth } from "@/src/firebase/config";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { creatUserDatabase, setNameUser } from "@/src/services/userServices";
import PickImageProfile from "@/src/components/ImageProfile/PickImageProfile";
import AppLoadingButton from "@/src/components/Buttons/LoadingButton";
import AppInput from "@/src/components/Inputs/Input";
import { useTheme } from "@/src/context/contextTheme";

export default function VerificationPage() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [localImagePath, setLocalImagePath] = useState("");

    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        setMessage("");
    }, [name]);

    const handleContinue = async () => {
        setLoading(true);

        if (!auth.currentUser) {
            Alert.alert(
                "Autenticação Necessária",
                "Nenhum usuário autenticado foi encontrado. Você será redirecionado para a tela de login.",
                [
                    {
                        text: "OK",
                        onPress: () => console.log("Redirecionando para login"),
                    },
                ],
            );
            router.replace("/auth/sign-in");
            setLoading(false);
            return;
        } else {
            if (!name) {
                setMessage("Por favor, insira um nome!");
                setLoading(false);
                return;
            } else {
                try {
                    await setNameUser(auth.currentUser?.uid, name);
                    await updateProfile(auth.currentUser, {
                        displayName: name,
                        photoURL: localImagePath,
                    });

                    await creatUserDatabase(auth.currentUser.uid);
                    router.replace("/(tabs)/home");
                } catch (error: any) {
                    console.log(
                        "Erro ao atualizar perfil:",
                        error,
                        auth.currentUser.uid,
                    );

                    const errorCode = error?.code;

                    switch (errorCode) {
                        case "auth/network-request-failed":
                            setMessage(
                                "Falha na conexão. Verifique sua internet e tente novamente.",
                            );
                            break;
                        case "auth/user-disabled":
                            setMessage("Esta conta foi desativada.");
                            break;
                        case "auth/requires-recent-login":
                            setMessage(
                                "Reautenticação necessária. Faça login novamente e tente.",
                            );
                            break;
                        default:
                            setMessage(errorCode);
                            break;
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).title}>Configurando o seu Perfil</Text>
            <Text style={styles(theme).subtitle}>
                Adicione uma foto e um nome para o seu perfil
            </Text>

            <PickImageProfile onImageSaved={setLocalImagePath} />

            <AppInput
                icon="person-sharp"
                value={name as any}
                onChangeText={setName}
                placeholder="Digite seu nome"
            />
            <Text style={styles(theme).subtitle}>{message}</Text>
            <AppLoadingButton
                isLoading={loading}
                onPress={handleContinue}
                title="Continuar"
                icon="checkbox"
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
            paddingHorizontal: 20,
        },
        title: {
            color: theme.textPrimary,
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
        },
        subtitle: {
            color: theme.textSecondary,
            fontSize: 16,
            textAlign: "center",
            width: "95%",
        },
    });
