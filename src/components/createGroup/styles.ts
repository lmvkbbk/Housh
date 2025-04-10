import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    nameContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    nameInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 5,
        marginBottom: 10
    },
    confirmButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5
    },
})