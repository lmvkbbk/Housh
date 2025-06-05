import { useTheme } from "@/src/context/contextTheme";
import { auth } from "@/src/firebase/config";
import { createGroupDatabase } from "@/src/services/realtime";
import colors from "@/src/styles/colors";
import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, ToastAndroid } from "react-native";
import AppButton from "../Buttons/Buttons";
import AppInput from "../Inputs/Input";
import AppLoadingButton from "../Buttons/LoadingButton";
import { GroupType } from "@/src/app/(tabs)/teams";
import { generateGroupCode } from "@/src/utils/codeGroup";

type CreateGroupModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function GroupCreationModal({
    visible,
    onConfirm,
    onCancel,
}: CreateGroupModalProps) {
    const { theme } = useTheme();
    const noteColors = Object.values(colors.notes);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!name.trim()) return;

        setLoading(true);
        try {
            const randomColor =
                noteColors[Math.floor(Math.random() * noteColors.length)];

            if (!auth.currentUser?.uid) {
                ToastAndroid.show(
                    "Usuário não autenticado",
                    ToastAndroid.SHORT,
                );
                return;
            }

            const newGroup: GroupType = {
                name,
                createdBy: auth.currentUser.uid,
                codeGroup: generateGroupCode(),
                viceLeaders: [],
                color: randomColor,
                members: { [auth.currentUser.uid]: true },
            };
            await createGroupDatabase(newGroup, auth.currentUser.uid);
            ToastAndroid.show("Grupo criado com sucesso!", ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show("Erro ao criar grupo", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
            onCancel();
            setName("");
            onConfirm();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles(theme).overlay}>
                <View style={styles(theme).container}>
                    <Text style={styles(theme).title}>Nome do Grupo</Text>

                    <AppInput
                        icon="people"
                        value={name}
                        onChangeText={setName}
                        placeholder="Nome do Grupo"
                        autoCapitalize="sentences"
                        maxLength={38}
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
                            icon="checkmark-sharp"
                            onPress={handleConfirm}
                            title="Criar Grupo"
                            widthButton={"48%"}
                            propStyle={{
                                backgroundColor: theme.correct,
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            width: "90%",
            backgroundColor: theme.modalBackground,
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
        },
        title: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textSecondary,
            marginBottom: 8,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: -8,
            gap: 10,
            width: "100%",
        },
    });
