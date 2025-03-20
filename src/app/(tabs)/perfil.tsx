import { Header } from '@/components/header'
import {View, Text, Image, StyleSheet} from 'react-native'
import { colors } from '../styles/colors'



export default function Perfil(){
    return(
        <View style={{flex: 1, width:'100%'}}>
            <Header title='Perfil'/>
            <View style ={styles.container}>
                <View><Image source ={require('../../../assets/userdefault.png')} style={styles.image}/></View>
                <Text style ={styles.text}>Nome do Usuario </Text> 
            </View>
        </View>
    )
}
// Temporario o nome, depois vai ser dinamico, tem q por no banco de dados, e puxar o nome do usuario, e criar um campo para ele alterar o nome
// A imagem vai ser dinamica tambem

const styles = StyleSheet.create({
    container: {
        borderColor: colors.grey2,
        borderWidth: 3,
        marginHorizontal: 8,
        marginTop: 20,
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginLeft: 20,
        fontWeight: 'bold',
        marginTop: 20
    },
    image: {
        marginTop: 20,
        marginLeft: 20,
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: 'grey'
    },
})