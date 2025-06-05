import { useAuth } from "@/src/hooks/useAuth";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ThemeProvider } from "../context/contextTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AchievementProvider } from "../context/contextAchievement";
import { AchievementModal } from "../components/AchievementModal";

export default function Layout() {
    const { user, loading } = useAuth();
    const router = useRouter();

    //agora a apresentacao do aplicativo e no primero momento em que abre o aplicativo
    useEffect(() => {
        const checkUserAndRedirect = async () => {
            if (!loading) {
                if (user) {
                    console.log(
                        "Usuário autenticado, redirecionando para Home...",
                    );
                    router.replace("/(tabs)/home");
                } else {
                    try {
                        const seen =
                            await AsyncStorage.getItem("onboardingSeen");
                        if (seen) {
                            console.log(
                                "Usuário não autenticado, redirecionando para signin...",
                            );
                            router.replace("/auth/sign-in");
                        } else {
                            console.log(
                                "Primeira vez do usuário, redirecionando para presentation...",
                            );
                            router.replace("/OnboardingPresentation");
                        }
                    } catch (error) {
                        console.error("Erro ao acessar AsyncStorage:", error);
                    }
                }
            }
        };

        checkUserAndRedirect();
    }, [user, loading]);

    /* useEffect responsavel por verificar se o usuário está autenticado, esse
    codigo é executado toda vez que o usuário ou o loading é alterado  */

    return (
        <ThemeProvider>
            <AchievementProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "fade",
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="groupDetail" />

                    <Stack.Screen name="auth/sign-in" />
                    <Stack.Screen name="auth/sign-up" />
                    <Stack.Screen name="auth/recoverPassword" />
                    <Stack.Screen name="auth/recoveryEmailSentScreen" />

                    <Stack.Screen name="OnboardingPresentation" />

                    <Stack.Screen name="verification/verificationPage" />
                    <Stack.Screen name="verification/re-AuthenticatePage" />
                    <Stack.Screen name="verification/newEmail" />
                    <Stack.Screen name="verification/newPassword" />

                    <Stack.Screen name="profile/profileConfig" />
                </Stack>
                <AchievementModal />
            </AchievementProvider>
        </ThemeProvider>
    );
}
