import React from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/contextTheme";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmModalProps {
    visible: boolean;
    icon?: string;
    iconColor?: string;
    title: string;
    subtitle?: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    colorConfirm?: string;
}

export default function AppConfirmModal({
    visible,
    icon,
    iconColor,
    title,
    subtitle,
    onCancel,
    onConfirm,
    confirmText = "Sim",
    cancelText = "Cancelar",
    colorConfirm,
}: ConfirmModalProps) {
    const { theme } = useTheme();
    const confirmButtonColor = colorConfirm ? colorConfirm : theme.incorrect;

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles(theme).modalOverlay}>
                <View style={styles(theme).modalContainer}>
                    {icon && (
                        <Ionicons
                            name={icon as any}
                            size={40}
                            color={iconColor}
                            style={styles(theme).icon}
                        />
                    )}
                    <Text style={styles(theme).title}>{title}</Text>
                    {subtitle && (
                        <Text style={styles(theme).subtitle}>{subtitle}</Text>
                    )}
                    <View style={styles(theme).areaButton}>
                        <TouchableOpacity
                            style={styles(theme).Button}
                            onPress={onCancel}
                        >
                            <Text style={styles(theme).textButton}>
                                {cancelText}
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
                            onPress={onConfirm}
                        >
                            <Text
                                style={[
                                    styles(theme).textButton,
                                    { color: confirmButtonColor },
                                ]}
                            >
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        },
        modalContainer: {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.modalBackground,
            borderRadius: 16,
            width: "85%",
            overflow: "hidden",
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.textPrimary,
        },
        subtitle: {
            color: theme.textSecondary,
            fontSize: 16,
            textAlign: "center",
            paddingHorizontal: 32,
            paddingBottom: 24,
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
            fontSize: 15,
            fontWeight: "bold",
            color: theme.textPrimary,
        },
        icon: {
            padding: 12,
        },
    });
