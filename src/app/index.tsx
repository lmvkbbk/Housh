import { useAuth } from "@/src/hooks/useAuth";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import componentColors from "../styles/colors";

export default function index(){

    return(
        <View style={styles.container}>
            <ActivityIndicator color={componentColors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: componentColors.modalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})