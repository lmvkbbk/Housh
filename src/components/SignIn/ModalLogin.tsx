import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";
import { StatusBar } from "expo-status-bar";
import AppInput from "../Inputs/Input";
import AppInputPassword from "../Inputs/InputPassword";
import AppLoadingButton from "../Buttons/LoadingButton";
import AppButton from "../Buttons/Buttons";

type ModalLoginProps = {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    email: string;
    password: string;
    setEmail: (text: string) => void;
    setPassword: (text: string) => void;
    loginMessage: string;
    isLoading: boolean;
    handleLogin: () => void;
    handleRecoverPassword: () => void;
    handleNewUser: () => void;
};

export default function ModalLogin({
    isModalVisible,
    setIsModalVisible,
    email,
    password,
    setEmail,
    setPassword,
    loginMessage,
    isLoading,
    handleLogin,
    handleRecoverPassword,
    handleNewUser,
}: ModalLoginProps) {
    const { theme } = useTheme();
    const modalStyles = styles(theme);

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <SafeAreaView style={modalStyles.modalOverlay}>
                <StatusBar
                    style="light"
                    backgroundColor="rgba(0,0,0,0.5)"
                    translucent
                />
                <View style={modalStyles.modalContainer}>
                    <Text style={modalStyles.title}>Login</Text>
                    <TouchableOpacity
                        style={modalStyles.closeButton}
                        onPress={() => setIsModalVisible(false)}
                    >
                        <AntDesign
                            name="close"
                            size={30}
                            color={theme.textPrimary}
                        />
                    </TouchableOpacity>

                    <AppInput
                        icon="mail"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        secureText={false}
                        autoComplete="email"
                    />
                    <AppInputPassword
                        icon={true}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Digite sua senha"
                    />

                    <Text style={modalStyles.loginMessage}>{loginMessage}</Text>

                    <AppLoadingButton
                        title="Entrar"
                        onPress={handleLogin}
                        widthButton={"100%"}
                        isLoading={isLoading}
                        icon="person"
                    />

                    <View style={modalStyles.footerContainer}>
                        <AppButton
                            title="Esqueci a senha"
                            onPress={handleRecoverPassword}
                            textColor={theme.secondary}
                            boldText={false}
                        />
                        <AppButton
                            title="Novo usuário"
                            onPress={handleNewUser}
                            textColor={theme.secondary}
                            boldText={false}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingHorizontal: 20,
        },
        modalContainer: {
            width: "100%",
            maxWidth: 400,
            backgroundColor: theme.modalBackground,
            borderRadius: 15,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 5,
        },
        title: {
            fontSize: 38,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: 12,
            textAlign: "center",
        },
        closeButton: {
            position: "absolute",
            top: 10,
            right: 10,
            padding: 5,
        },
        loginMessage: {
            color: theme.textSecondary,
            marginTop: 4,
            margin: 20,
            textAlign: "center",
        },
        button: {
            marginVertical: 12,
        },
        footerContainer: {
            maxWidth: 300,
            width: "100%",
            marginTop: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
        },
    });
