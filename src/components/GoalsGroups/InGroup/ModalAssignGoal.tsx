import { GroupType } from "@/src/app/(tabs)/teams";
import { useTheme } from "@/src/context/contextTheme";
import { Modal, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import {
    getNameUser,
    updateGoalsCreatedInGroup,
} from "@/src/services/userServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppInput from "../../Inputs/Input";
import AppButton from "../../Buttons/Buttons";
import AppLoadingButton from "../../Buttons/LoadingButton";
import colors from "@/src/styles/colors";
import { addGoalInGroup } from "@/src/services/realtime";
import { MemberPicker } from "../MemberPicker";
import { auth } from "@/src/firebase/config";
interface Props {
    visible: boolean;
    group: GroupType;
    onClose: () => void;
    onReload: () => void;
}

export default function ModalAssingGoal({
    visible,
    group,
    onClose,
    onReload,
}: Props) {
    const { theme } = useTheme();
    const [memberNames, setMemberNames] = useState<Record<string, string>>({});

    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isCreatingGoal, setIsCreatingGoal] = useState(false);
    const noteColors = Object.values(colors.notes);

    const [selectedMember, setSelectedMember] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const resetAssing = () => {
        setName("");
        setDescription("");
        setSelectedMember("");
    };

    useEffect(() => {
        const fetchMemberNames = async () => {
            setIsLoadingMembers(true);
            try {
                const members = group.members ?? {};
                const entries = await Promise.all(
                    Object.keys(members).map(async (uid) => {
                        const name = await getNameUser(uid);
                        return [uid, name] as const;
                    }),
                );
                setMemberNames(Object.fromEntries(entries));
            } catch (error) {
                console.error("Erro ao carregar nomes dos membros:", error);
            } finally {
                setIsLoadingMembers(false);
            }
        };

        if (visible) fetchMemberNames();
    }, [visible]);

    const handleCreate = async () => {
        if (!name.trim()) return;
        if (selectedMember == null) return;

        await addGoal(selectedMember, name, description);
        await updateGoalsCreatedInGroup(auth.currentUser?.uid);
        onReload();
    };

    const addGoal = async (
        user: string,
        name: string,
        description?: string,
    ) => {
        setIsCreatingGoal(true);
        try {
            const randomColor =
                noteColors[Math.floor(Math.random() * noteColors.length)];

            const newGoal = {
                id: Date.now().toString(),
                user,
                name,
                description,
                status: "Pendente",
                color: randomColor,
            };

            //atualiza o usuario com a nova meta
            await addGoalInGroup(group.codeGroup, newGoal);
        } catch (error) {
            console.log("Erro ao adicionar a meta", error);
        } finally {
            setIsCreatingGoal(false);
            resetAssing();
            onClose();
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose();
            }}
        >
            <View style={styles(theme).overlay}>
                <View style={styles(theme).modalContent}>
                    {isLoadingMembers ? (
                        <View style={{ padding: 100 }}>
                            <ActivityIndicator
                                size={50}
                                color={theme.primary}
                            />
                        </View>
                    ) : Object.keys(memberNames).length > 1 ? (
                        <View>
                            <Text style={styles(theme).modalTitle}>
                                Atribuir Meta
                            </Text>
                            <MemberPicker
                                theme={theme}
                                memberNames={memberNames}
                                selectedMember={selectedMember}
                                onChange={setSelectedMember}
                            />

                            <AppInput
                                icon="flag"
                                value={name}
                                onChangeText={setName}
                                placeholder="Nome da meta"
                                autoCapitalize="sentences"
                            />

                            <AppInput
                                icon="document-text"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Descreva sua meta"
                                multiline={true}
                                autoCapitalize="sentences"
                            />
                            <View style={styles(theme).buttonContainer}>
                                <AppButton
                                    icon="close"
                                    onPress={onClose}
                                    title="Cancelar"
                                    backgroundColor={theme.incorrect}
                                    boldText={true}
                                    widthButton={"48%"}
                                />
                                <AppLoadingButton
                                    isLoading={isCreatingGoal}
                                    icon="checkmark-sharp"
                                    onPress={handleCreate}
                                    title="Criar Meta"
                                    widthButton={"48%"}
                                    propStyle={{
                                        backgroundColor: theme.correct,
                                    }}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles(theme).emptyContainer}>
                            <MaterialCommunityIcons
                                name="account-group"
                                size={48}
                                color={theme.primary}
                                style={{ marginBottom: 12 }}
                            />
                            <Text style={styles(theme).emptyTitle}>
                                Grupo incompleto
                            </Text>
                            <Text style={styles(theme).emptyText}>
                                Você ainda não pode atribuir metas. Adicione
                                mais membros ao grupo para começar
                            </Text>
                            <AppButton
                                icon="arrow-back"
                                title="voltar"
                                boldText
                                backgroundColor={theme.primary}
                                onPress={onClose}
                                propStyle={{ marginTop: 20 }}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        modalContent: {
            width: "100%",
            borderRadius: 20,
            padding: 24,
            backgroundColor: theme.modalBackground,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textSecondary,
            alignSelf: "center",
            marginBottom: 18,
        },
        picker: {
            width: "85%",
            color: theme.textSecondary,
        },
        pickerWrapper: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.background,
            alignSelf: "center",
            width: "90%",
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 12,
            marginVertical: 8,
            overflow: "hidden",
            paddingHorizontal: 4,
            paddingVertical: 2,
        },
        emptyContainer: {
            alignItems: "center",
            justifyContent: "center",
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.textSecondary,
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 16,
            textAlign: "center",
            color: theme.textPrimary,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: -8,
            gap: 10,
            width: "100%",
        },
    });
