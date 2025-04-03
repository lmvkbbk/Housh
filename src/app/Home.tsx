import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../database/firebase";
import { logOut } from "../services/authServices";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import componentColors from "../styles/colors";

export default function Home(){

    const handleLogout = async() =>{
        try {
            await logOut(); 
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>HOME</Text>
            <View style={styles.profileContainer}>
                {auth.currentUser?.photoURL ? (
                    <Image source={{ uri: auth.currentUser.photoURL+'?'+new Date()}} style={styles.profileImage} />
                ) : (
                    <MaterialIcons name="account-circle" size={200} color={componentColors.primary} />
                )}
            </View>
            <Text style={styles.subtitle}>{auth.currentUser?.email}</Text>
            <Text style={styles.subtitle}>seja Bem Vindo {auth.currentUser?.displayName}</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.Button}>logout</Text> 
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: componentColors.modalBackground,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: componentColors.primary,
        fontSize: 36,
        fontWeight: 'bold'
    },
    subtitle: {
        color: componentColors.textSecondary,
        fontSize: 16,
        textAlign: "center",
        width: "95%", 
    },
    Button:{
        backgroundColor: componentColors.primary,
        width: '80%',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignItems:'center',
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        margin: 20,
        borderRadius: 100,},
});