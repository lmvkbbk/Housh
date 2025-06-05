import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import AppButton from "../Buttons/Buttons";
import { useTheme } from "@/src/context/contextTheme";
import AppInput from "../Inputs/Input";
import AppLoadingButton from "../Buttons/LoadingButton";
import { addUserInGroup } from "@/src/services/realtime";
import { addGroupInUser } from "@/src/services/userServices";
import { auth } from "@/src/firebase/config";
import { unlockAchievement } from "@/src/services/unlockAchievement";
import { useAchievement } from "@/src/context/contextAchievement";

type GroupCodeModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function GroupCodeModal({
    visible,
    onConfirm,
    onCancel,
}: GroupCodeModalProps) {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const { theme } = useTheme();
    const { showAchievement } = useAchievement();

    const handleConfirm = async () => {
        setLoading(true);
        if (code.trim() === "") return;
        if (!auth.currentUser?.uid) return;
        try {
            await addGroupInUser(auth.currentUser.uid, code);
            await addUserInGroup(auth.currentUser.uid, code);
            onCancel();
            onConfirm();
            await unlockAchievement(
                auth.currentUser.uid,
                "joinedGroup",
                showAchievement,
            );
        } catch (error) {
            console.log(error);
            return;
        } finally {
            setLoading(false);
            setCode("");
        }
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles(theme).container}>
                <View style={styles(theme).modalContent}>
                    <Text style={styles(theme).title}>Código de grupo</Text>

                    <AppInput
                        icon="key"
                        value={code}
                        onChangeText={setCode}
                        placeholder="Digite o Codigo do grupo"
                        maxLength={6}
                    />
                    <View style={styles(theme).buttonContainer}>
                        <AppButton
                            icon="close"
                            onPress={onCancel}
                            title="Cancelar"
                            backgroundColor={theme.incorrect}
                            boldText={true}
                            widthButton={"48%"}
                        />

                        <AppLoadingButton
                            isLoading={loading}
                            onPress={handleConfirm}
                            title="Entrar"
                            icon="checkmark-sharp"
                            widthButton={"48%"}
                            propStyle={{ backgroundColor: theme.correct }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            width: "90%",
            backgroundColor: theme.modalBackground,
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            position: "relative",
        },
        buttonContainer: {
            flexDirection: "row",
            marginTop: 10,
            gap: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.textSecondary,
            marginBottom: 8,
        },
    });
