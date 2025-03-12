import { colors } from "@/app/styles/colors";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
    },
    text: {
        paddingTop: 10,
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
})