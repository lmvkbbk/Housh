import { useTheme } from "@/src/context/contextTheme";
import { Modal, Text, View, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import AppButton from "../../Buttons/Buttons";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "../../Headers/SectionHeader";
import { auth } from "@/src/firebase/config";
import { deleteGroup, leaveGroup } from "@/src/services/realtime";
import { router } from "expo-router";
import AppConfirmModal from "../../AppConfirmModal";
import { useState } from "react";
import { GroupType } from "@/src/app/(tabs)/teams";
import GroupMemberItem from "./GroupMemberItem";

type Props = {
    group: GroupType;
    visible: boolean;
    onClose: () => void;
};

export default function ModalGroupInfo({ group, visible, onClose }: Props) {
    const { theme } = useTheme();
    const textToCopy = group.codeGroup.toString();

    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(textToCopy);
    };

    const handleExitGroup = async () => {
        await leaveGroup(auth.currentUser?.uid, group.codeGroup);
        router.replace("/(tabs)/teams");
    };
    const handleDeleteGroup = async () => {
        await deleteGroup(group.codeGroup, group.members);
        router.replace("/(tabs)/teams");
    };

    const sortedMemberIds = group.members
        ? [
              group.createdBy,
              ...Object.keys(group.members).filter(
                  (id) => id !== group.createdBy,
              ),
          ]
        : [];

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <AppConfirmModal
                visible={showLeaveGroupModal}
                title="Sair do Grupo?"
                subtitle="Você deixará de ter acesso às metas e interações deste grupo. Tem certeza que deseja sair?"
                icon="log-out-outline"
                iconColor={theme.primary}
                onCancel={() => setShowLeaveGroupModal(false)}
                onConfirm={async () => {
                    await handleExitGroup();
                    setShowLeaveGroupModal(false);
                }}
            />
            <AppConfirmModal
                visible={showDeleteGroupModal}
                title="Excluir Grupo?"
                subtitle="Essa ação é permanente e apagará todas as metas e dados do grupo. Tem certeza que deseja excluir?"
                icon="trash-outline"
                iconColor={theme.incorrect}
                onCancel={() => setShowDeleteGroupModal(false)}
                onConfirm={async () => {
                    await handleDeleteGroup();
                    setShowDeleteGroupModal(false);
                }}
            />

            <View style={styles(theme).modalOverlay}>
                <View style={styles(theme).modalContainer}>
                    <Text style={styles(theme).modalInfo}>
                        Informações do Grupo
                    </Text>
                    <Text style={styles(theme).modalTitle}>{group.name}</Text>
                    <AppButton
                        onPress={handleCopy}
                        title={group.codeGroup}
                        boldText={true}
                        sizeText={24}
                        textColor={theme.primary}
                    />
                    <SectionHeader
                        icon={
                            <Ionicons
                                name="people"
                                size={20}
                                color={theme.textPrimary}
                            />
                        }
                        marginTop={true}
                        center={true}
                        title={`${Object.keys(group.members ?? {}).length} Membros Participantes`}
                    />
                    {sortedMemberIds.length > 0 && (
                        <View style={styles(theme).memberList}>
                            {sortedMemberIds.map((memberId, index) => (
                                <GroupMemberItem
                                    key={memberId}
                                    memberUid={memberId}
                                    memberIndex={index + 1}
                                    group={group}
                                />
                            ))}
                        </View>
                    )}

                    {group.createdBy == auth.currentUser?.uid ? (
                        <AppButton
                            title="Apagar grupo"
                            textColor={theme.incorrect}
                            boldText={true}
                            icon="trash"
                            onPress={() => {
                                setShowDeleteGroupModal(true);
                            }}
                        />
                    ) : (
                        <AppButton
                            icon="exit-outline"
                            title="Sair do grupo"
                            textColor={theme.incorrect}
                            boldText={true}
                            onPress={() => {
                                setShowLeaveGroupModal(true);
                            }}
                        />
                    )}
                </View>
            </View>
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
        sectionTitleText: {
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 8,
            color: theme.textPrimary,
            marginTop: 1,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 16,
        },
        modalInfo: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textSecondary,
            alignSelf: "center",
        },
        modalTitle: {
            textAlign: "center",
            fontSize: 28,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: -4,
            alignSelf: "center",
        },
        memberList: {
            alignContent: "center",
            width: "100%",
            backgroundColor: theme.cardAccent,
            marginVertical: 16,
            padding: 5,
            borderRadius: 8,
        },
    });
