import { GroupType } from "@/src/app/(tabs)/teams";
import { useTheme } from "@/src/context/contextTheme";
import { Modal, View, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import { getNameUser } from "@/src/services/userServices";
import { updateGoalInGroup } from "@/src/services/realtime";
import { GoalType } from "@/src/app/groupDetail";
import AppInput from "../Inputs/Input";
import AppButton from "../Buttons/Buttons";
import AppLoadingButton from "../Buttons/LoadingButton";
import { MemberPicker } from "./MemberPicker";
interface Props {
    visible: boolean;
    group: GroupType;
    goal: GoalType;
    onClose: () => void;
    onReload: () => void;
}

export default function EditGoalGroupModal({
    visible,
    group,
    goal,
    onClose,
    onReload,
}: Props) {
    const { theme } = useTheme();
    const [memberNames, setMemberNames] = useState<Record<string, string>>({});

    const [loading, setLoading] = useState(false);

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
            const members = group.members ?? {};
            const entries = await Promise.all(
                Object.keys(members).map(async (uid) => {
                    const name = await getNameUser(uid);
                    return [uid, name] as const;
                }),
            );
            setMemberNames(Object.fromEntries(entries));
        };

        const getDataGoal = () => {
            if (goal) {
                setName(goal.name);
                setDescription(goal.description);
                setSelectedMember(goal.user);
            }
        };

        if (visible) {
            fetchMemberNames();
            getDataGoal();
        }
    }, [visible]);

    const handleUpdateGoal = async () => {
        if (!name.trim()) return;
        if (selectedMember == null) return;

        await updateGoal(selectedMember, name, description);
        onReload();
    };

    const updateGoal = async (
        user: string,
        name: string,
        description?: string,
    ) => {
        setLoading(true);
        try {
            const newGoal = {
                id: goal.id,
                user,
                name,
                description,
                status: goal.status,
                color: goal.color,
            };

            //atualiza o usuario com a nova meta
            await updateGoalInGroup(group.codeGroup, newGoal);
            console.log(description);
        } catch (error) {
            console.log("Erro ao adicionar a meta", error);
        } finally {
            setLoading(false);
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
                    <Text style={styles(theme).modalTitle}>Editar Meta</Text>
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
                            isLoading={loading}
                            icon="checkmark-sharp"
                            onPress={handleUpdateGoal}
                            title="Salvar Meta"
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
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: -8,
            gap: 10,
            width: "100%",
        },
    });
