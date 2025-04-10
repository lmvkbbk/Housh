import { useAuth } from "@/src/hooks/useAuth";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Layout(){
    const {user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading){
            if (user) {
                console.log("Usuário autenticado, redirecionando para Home...");
                router.replace("/(tabs)/home");
            } else {
                console.log("Usuário não autenticado, redirecionando para signin...");
                router.replace('/auth/sign-in');
            }
        }
    }, [user, loading]);       

    /* useEffect responsavel por verificar se o usuário está autenticado, esse  
    codigo é executado toda vez que o usuário ou o loading é alterado  */

    return(
        <View style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
            <Stack screenOptions={{
                headerShown: false,
                animation: 'fade'
                }}>
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen name="groupDetail"/>

                <Stack.Screen name="auth/sign-in" />
                <Stack.Screen name="auth/sign-up" />
                <Stack.Screen name="auth/recoverPassword" />
                <Stack.Screen name="auth/RecoveryEmailSentScreen"/>
                
                <Stack.Screen name="Presentation"/>

                <Stack.Screen name="verification/verificationPage"/>

                <Stack.Screen name="profile/profileConfig"/>
            </Stack>
        </View>
    );
}