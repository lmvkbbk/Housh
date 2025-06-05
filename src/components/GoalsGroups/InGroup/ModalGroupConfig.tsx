import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
} from "react-native";
import { useTheme } from "@/src/context/contextTheme";
import { GroupMemberActionItem } from "./GroupMemberActionsItem";
import {
    demoteUserInGroup,
    leaveGroup,
    promoveUserInGroup,
    renameGroupName,
} from "@/src/services/realtime";
import AppLoadingButton from "../../Buttons/LoadingButton";
import { GroupType } from "@/src/app/(tabs)/teams";

interface ModalGroupConfigProps {
    visible: boolean;
    group: GroupType;
    onClose: () => void;
    onReload: () => void;
}

export default function ModalGroupConfig({
    visible,
    group,
    onClose,
    onReload,
}: ModalGroupConfigProps) {
    const { theme } = useTheme();
    const inputRef = useRef<TextInput>(null);

    const [groupName, setGroupName] = useState(group.name);
    const [changeNameButtonVisible, setChangeNameButtonVisible] =
        useState(false);

    const memberIds = Object.keys(group.members || {});
    const sortedMemberIds = [
        group.createdBy,
        ...memberIds.filter((id) => id !== group.createdBy),
    ];

    const handlePromote = async (id: string) => {
        await promoveUserInGroup(id, group.codeGroup);
        onReload();
    };

    const handleDemote = async (id: string) => {
        await demoteUserInGroup(id, group.codeGroup);
        onReload();
    };

    const handleRemove = async (id: string) => {
        await leaveGroup(id, group.codeGroup);
        onReload();
    };

    useEffect(() => {
        setGroupName(group.name);
    }, [group]);

    const changeText = (text: string) => {
        setGroupName(text);
        setChangeNameButtonVisible(text.trim() !== group.name.trim());
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                setChangeNameButtonVisible(false);
                onReload();
                onClose();
            }}
        >
            <View style={styles(theme).overlay}>
                <View style={styles(theme).modalContent}>
                    <Text style={styles(theme).modalInfo}>
                        Configurações do Grupo
                    </Text>

                    <TextInput
                        ref={inputRef}
                        style={styles(theme).modalTitle}
                        value={groupName}
                        onChangeText={changeText}
                        placeholder="Nome do seu Grupo"
                        placeholderTextColor={theme.primary}
                        multiline
                        maxLength={38}
                    />

                    {changeNameButtonVisible && (
                        <AppLoadingButton
                            title="Renomear"
                            icon="pencil"
                            onPress={() => {
                                renameGroupName(
                                    groupName.trim(),
                                    group.codeGroup,
                                );

                                setChangeNameButtonVisible(
                                    !changeNameButtonVisible,
                                );

                                inputRef.current?.blur();
                                onReload();
                            }}
                        />
                    )}
                    <ScrollView>
                        <Text
                            style={[
                                styles(theme).sectionTitle,
                                { color: theme.textPrimary },
                            ]}
                        >
                            Gerenciar Membros
                        </Text>
                        <View style={styles(theme).membersTable}>
                            {sortedMemberIds.map((memberId) => (
                                <GroupMemberActionItem
                                    key={memberId}
                                    member={memberId}
                                    group={group}
                                    onPromote={handlePromote}
                                    onDemote={handleDemote}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
        },
        modalContent: {
            borderRadius: 16,
            padding: 20,
            maxHeight: "90%",
            backgroundColor: theme.modalBackground,
        },
        header: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
        },
        input: {
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
        },
        sectionTitle: {
            alignSelf: "center",
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 16,
            marginBottom: 8,
        },
        memberRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderColor: "#ccc",
            paddingVertical: 10,
        },
        modalInfo: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textSecondary,
            alignSelf: "center",
        },
        modalTitle: {
            textDecorationLine: "underline",
            fontSize: 28,
            textAlign: "center",
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: -4,
            alignSelf: "center",
        },
        membersTable: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: theme.cardAccent,
        },
    });
