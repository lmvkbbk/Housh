import SettingsItem from "@/src/components/settingsItem";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    Modal,
    TouchableOpacity,
} from "react-native";
import { Header } from "@/src/components/header";
import { delUser, logOut } from "@/src/firebase/auth";
import { usePathname, useRouter } from "expo-router";
import { auth } from "@/src/firebase/config";
import { useState } from "react";
import { useTheme } from "@/src/context/contextTheme";

export default function Settings() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    return (
        <View style={styles(theme).screen}>
            <Modal
                animationType="fade"
                transparent
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles(theme).modalOverlay}>
                    <View style={styles(theme).modalContainer}>
                        <Text style={styles(theme).title}>
                            Deseja deletar a sua conta?
                        </Text>
                        <Text style={styles(theme).subtitle}>
                            Você está prestes a excluir sua conta. Essa ação é
                            permanente e não poderá ser desfeita.
                        </Text>
                        <View style={styles(theme).areaButton}>
                            <TouchableOpacity
                                style={styles(theme).Button}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles(theme).textButton}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles(theme).Button,
                                    {
                                        borderLeftWidth: 1,
                                        borderLeftColor: theme.inputBorder,
                                    },
                                ]}
                                onPress={() => {
                                    delUser(auth.currentUser);
                                    setIsModalVisible(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles(theme).textButton,
                                        { color: theme.incorrect },
                                    ]}
                                >
                                    Excluir conta
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Header title="Configurações" />
            <ScrollView
                style={styles(theme).container}
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles(theme).sectionTitle}>Conta</Text>
                <SettingsItem
                    icon="email"
                    title="E-mail vinculado"
                    onPress={() => {
                        router.navigate({
                            pathname: "/verification/re-AuthenticatePage",
                            params: { path: "verification/newEmail" },
                        });
                    }}
                />
                <SettingsItem
                    icon="vpn-key"
                    title="Alterar senha"
                    onPress={() => {
                        router.navigate({
                            pathname: "/verification/re-AuthenticatePage",
                            params: { path: "verification/newPassword" },
                        });
                    }}
                />

                <Text style={styles(theme).sectionTitle}>Notificações</Text>
                <SettingsItem
                    icon="notifications"
                    title="Notificações push"
                    onPress={() => Alert.alert("Ativar/Desativar Notificações")}
                />
                <SettingsItem
                    icon="alarm"
                    title="Lembretes de metas"
                    onPress={() => Alert.alert("Configurar Lembretes")}
                />
                <SettingsItem
                    icon="group"
                    title="Notificações de grupo"
                    onPress={() => Alert.alert("Configurar Grupo")}
                />
                <SettingsItem
                    icon="calendar-today"
                    title="Resumo semanal/mensal"
                    onPress={() => Alert.alert("Resumo Ativado")}
                />

                <Text style={styles(theme).sectionTitle}>Aparência</Text>
                <SettingsItem
                    icon="brightness-6"
                    title="Tema"
                    onPress={() => toggleTheme()}
                />

                <Text style={styles(theme).sectionTitle}>Ajuda e Suporte</Text>
                <SettingsItem
                    icon="support-agent"
                    title="Contatar suporte"
                    onPress={() => Alert.alert("Suporte")}
                />
                <SettingsItem
                    icon="description"
                    title="Termos de uso"
                    onPress={() => Alert.alert("Ver Termos")}
                />
                <SettingsItem
                    icon="privacy-tip"
                    title="Política de privacidade"
                    onPress={() => Alert.alert("Ver Política")}
                />

                <Text style={styles(theme).sectionTitle}>Sair</Text>
                <SettingsItem
                    icon="logout"
                    title="Logout"
                    onPress={() => logOut()}
                />
                <SettingsItem
                    icon="delete"
                    title="Excluir conta"
                    onPress={() => setIsModalVisible(true)}
                    /*fazer dps, remover pergunta e mandar pra tela de re-autenticacao
                    passando por uma outra tela no final, perguntando
                    se quer deletar a conta, o uso do delUser precisa da re-autenticacao as vezes*/
                    color={theme.incorrect}
                />

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: theme.background,
        },
        container: {
            flex: 1,
            paddingHorizontal: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginTop: 25,
            marginBottom: 10,
        },
        title: {
            marginTop: 25,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.textPrimary,
        },
        subtitle: {
            color: theme.textPrimary,
            fontSize: 16,
            textAlign: "center",
            paddingHorizontal: 32,
            paddingVertical: 12,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContainer: {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.modalBackground,
            borderRadius: 16,
            width: "85%",
            overflow: "hidden",
        },
        areaButton: {
            flexDirection: "row",
            width: "100%",
            borderTopWidth: 1,
            borderColor: theme.inputBorder,
        },
        Button: {
            flex: 1,
            paddingVertical: 15,
            alignItems: "center",
            justifyContent: "center",
        },
        textButton: {
            color: theme.textPrimary,
            fontWeight: "bold",
        },
    });
