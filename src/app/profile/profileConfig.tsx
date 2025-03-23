import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function verificationPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurando o seu Perfil</Text>

            <TouchableOpacity style={styles.profilePictureContainer}>
                <MaterialIcons name="account-circle" size={200} color="orange" />
            </TouchableOpacity>

            <Text style={styles.subtitle}>Nome do seu perfil</Text>
            <TextInput style={styles.input}></TextInput>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.subtitle}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePictureContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        margin: 20,
        borderRadius: 100,
    },
    button: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: '#121212',
        padding: 10,
        borderRadius: 10,
    },
    input: {
        color: 'white',
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 22,
        width: '60%',
        padding: 10,
        margin: 10,
        marginBottom: 200
    },
    title: {
        color: 'orange',
        fontSize: 36,
        fontWeight: 'bold',
        margin: 10,
        marginBottom: 75
    },
    subtitle: {
        color: 'orange',
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
    },
});
