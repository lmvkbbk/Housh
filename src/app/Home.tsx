import { auth } from "../database/firebase";
import { logOut } from "../services/authServices";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home(){
    const teste = auth.currentUser;

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
            <Text style={styles.title}>{teste?.email}</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.Button}>logout</Text> 
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: 'orange',
        fontSize: 36,
        fontWeight: 'bold'
    },
    Button:{
        backgroundColor: 'orange',
        width: '80%',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignItems:'center',
    },
});