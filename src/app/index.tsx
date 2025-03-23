import { useAuth } from "@/src/hooks/useAuth";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

export default function index(){
    const { user } = useAuth();
    const router = useRouter();

    return(
        <View style={styles.container}>
            <ActivityIndicator color={'orange'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})