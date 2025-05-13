import { auth } from "@/src/firebase/config";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Header } from "@/src/components/header";
import AppLoadingButton from "@/src/components/Buttons/LoadingButton";
import AppInput from "@/src/components/Inputs/Input";
import PickImageProfile from "@/src/components/ImageProfile/PickImageProfile";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/context/contextTheme";

export default function EditProfile() {
    const [name, setName] = useState(auth.currentUser?.displayName);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [localImagePath, setLocalImagePath] = useState("");

    const router = useRouter();
    const { theme } = useTheme();

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
                    await updateProfile(auth.currentUser, {
                        displayName: name,
                        photoURL: localImagePath,
                    });
                    router.replace("/(tabs)/profile");
                } catch (error: any) {
                    console.log(error);
                    switch (error.code) {
                        case "auth/network-request-failed":
                            setMessage(
                                "Falha na conexão. Verifique sua internet e tente novamente.",
                            );
                            break;
                        case "auth/user-disabled":
                            setMessage("Esta conta foi desativada.");
                            break;
                        default:
                            Alert.alert(
                                "Erro",
                                "Não foi possível atualizar o perfil.",
                            );
                            break;
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    return (
        <SafeAreaView style={styles(theme).screenContainer}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={theme.modalBackground}
            />
            <Header title="Editar Perfil" />

            <View style={styles(theme).contentWrapper}>
                <PickImageProfile onImageSaved={setLocalImagePath} />

                <AppInput
                    icon="person-sharp"
                    value={name as any}
                    onChangeText={setName}
                    placeholder="Digite seu nome"
                />

                <Text style={styles(theme).subtitleText}>{message}</Text>

                <AppLoadingButton
                    isLoading={loading}
                    onPress={handleContinue}
                    title="Salvar Alterações"
                    icon="checkbox"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        screenContainer: {
            flex: 1,
            backgroundColor: theme.background,
        },
        contentWrapper: {
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: 20,
            alignItems: "center",
        },

        subtitleText: {
            color: theme.textSecondary,
            fontSize: 16,
            textAlign: "center",
        },
    });
