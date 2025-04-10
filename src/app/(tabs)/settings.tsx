import SettingsItem from '@/src/components/settingsItem'
import { View, Text, StyleSheet, Alert, ScrollView, Modal, TouchableOpacity } from 'react-native'
import componentColors from '@/src/styles/componentColors'
import { Header } from '@/src/components/header'
import { delUser, logOut } from '@/src/services/authServices'
import { usePathname, useRouter } from 'expo-router'
import { auth } from '@/src/database/firebase'
import { useState } from 'react'
import colors from '@/src/styles/colors'

export default function Settings() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const  router = useRouter();

    return (
        <View style={styles.screen}>
            <Modal
                animationType="fade"
                transparent 
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.subtitle}>Você está prestes a excluir sua conta. Essa ação é permanente e não poderá ser desfeita.</Text>
                        <View style={styles.areaButton}>
                            <TouchableOpacity style={styles.Button} onPress={()=>setIsModalVisible(false)}>
                                <Text style={styles.textButton}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.Button, { backgroundColor: componentColors.incorret }]} onPress={()=>{
                                delUser(auth.currentUser)
                                setIsModalVisible(false);
                            }}>
                                <Text style={styles.textButton}>Excluir conta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Header title="Configurações" />
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                >

                <Text style={styles.sectionTitle}>Conta</Text>
                <SettingsItem icon="email" title="E-mail vinculado" onPress={() => {
                    router.navigate({
                        pathname: '/verification/re-AuthenticatePage', 
                        params: {path:"verification/newEmail"}
                    });  
                }}/>
                <SettingsItem icon="vpn-key" title="Alterar senha" onPress={() => {
                    router.navigate({
                        pathname: '/verification/re-AuthenticatePage', 
                        params: {path:"verification/newPassword"}
                    }); 
                }} />

                <Text style={styles.sectionTitle}>Notificações</Text>
                <SettingsItem icon="notifications" title="Notificações push" onPress={() => Alert.alert('Ativar/Desativar Notificações')} />
                <SettingsItem icon="alarm" title="Lembretes de metas" onPress={() => Alert.alert('Configurar Lembretes')} />
                <SettingsItem icon="group" title="Notificações de grupo" onPress={() => Alert.alert('Configurar Grupo')} />
                <SettingsItem icon="calendar-today" title="Resumo semanal/mensal" onPress={() => Alert.alert('Resumo Ativado')} />
                
                <Text style={styles.sectionTitle}>Aparência</Text>
                <SettingsItem icon="brightness-6" title="Tema" onPress={() => Alert.alert('Alterar Tema')} />
                
                <Text style={styles.sectionTitle}>Ajuda e Suporte</Text>
                <SettingsItem icon="support-agent" title="Contatar suporte" onPress={() => Alert.alert('Suporte')} />
                <SettingsItem icon="description" title="Termos de uso" onPress={() => Alert.alert('Ver Termos')} />
                <SettingsItem icon="privacy-tip" title="Política de privacidade" onPress={() => Alert.alert('Ver Política')} />

                <Text style={styles.sectionTitle}>Sair</Text>
                <SettingsItem icon="exit-to-app" title="Logout" onPress={() => logOut()} />
                <SettingsItem 
                icon="delete" 
                title="Excluir conta" 
                onPress={() => setIsModalVisible(true)} 
                color={componentColors.incorret} />
                
                <View style={{height: 100}}/>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: componentColors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: componentColors.textPrimary,
        marginTop: 25,
        marginBottom: 10,
    },
    subtitle: {
        color: componentColors.textPrimary,
        fontSize: 16,
        fontWeight:'bold',
        textAlign: 'center',
        padding: 20,
    },
    modalOverlay:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        backgroundColor: componentColors.modalBackground,
        borderRadius: 16,
        width: '85%',
        overflow: 'hidden',
    },
    areaButton: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderColor: componentColors.inputBorder,
    },
    Button: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        color: componentColors.textPrimary,
    },
})
