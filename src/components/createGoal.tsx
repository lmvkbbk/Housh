import componentColors from "@/src/styles/componentColors";
import { addDays, getRelativeDateInfo } from "@/src/utils/dateUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { Component, useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";

type CreateGoalProps = {
    visible: boolean;
    onConfirm: (
        name: string,
        description?: string,
        timeRemaining?: Date,
        status?: string,
    ) => void;
    onCancel: () => void;
};

const CreateGoal: React.FC<CreateGoalProps> = ({
    visible,
    onConfirm,
    onCancel,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const status = "Pendente";

    const [challengeVisible, setChallengeVisible] = useState(false);
    const [time, setTime] = useState(1);

    const getMessage = (days: number) => {
        if (days <= 3)
            return { text: "Missão relâmpago !", icon: "lightning-bolt" };
        if (days <= 7)
            return { text: "Objetivo da semana !", icon: "calendar-week" };
        if (days <= 14) return { text: "Plano esperto !", icon: "lightbulb" };
        return { text: "Meta épica !", icon: "trophy" };
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setTime(1);
        setChallengeVisible(false);
    };

    //cria uma meta, e caso tenha um desafio, add os dias na data atual
    const handleCreate = () => {
        if (!name.trim()) return;
        let timeRemaining = challengeVisible
            ? addDays(new Date(), time)
            : undefined;
        onConfirm(name, description || undefined, timeRemaining, status);
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Criar Nova Meta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da meta"
                        placeholderTextColor={componentColors.placeholderText}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        placeholder="Descreva sua meta"
                        placeholderTextColor={componentColors.placeholderText}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    {challengeVisible ? (
                        <View style={styles.challengeBox}>
                            <TouchableOpacity
                                style={styles.buttonChallengeExtended}
                                onPress={() => setChallengeVisible(false)}
                            >
                                <View style={styles.challengeContainer}>
                                    <Text style={styles.buttonDateText}>
                                        Desafio definido
                                    </Text>
                                    <MaterialCommunityIcons
                                        name="close-thick"
                                        size={24}
                                        color={componentColors.incorret}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.sliderContainer}>
                                <View style={styles.message}>
                                    <MaterialCommunityIcons
                                        name={getMessage(time).icon as any}
                                        size={22}
                                        color={componentColors.primary}
                                    />
                                    <Text style={styles.subtitle}>
                                        {getMessage(time).text}
                                    </Text>
                                </View>
                                <Text style={styles.timeLabel}>
                                    {time} {time === 1 ? "dia" : "dias"}
                                </Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    step={1}
                                    onValueChange={(val: number) => {
                                        setTime(val);
                                    }}
                                    minimumTrackTintColor={
                                        componentColors.primary
                                    }
                                    maximumTrackTintColor={
                                        componentColors.placeholderText
                                    }
                                    thumbTintColor={componentColors.textPrimary}
                                />
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonChallenge}
                            onPress={() => setChallengeVisible(true)}
                        >
                            <View style={styles.challengeContainer}>
                                <Text style={styles.buttonDateText}>
                                    + Adicionar desafio
                                </Text>
                                <MaterialCommunityIcons
                                    name="target"
                                    size={24}
                                    color={componentColors.primary}
                                />
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.buttonCancel}
                            onPress={handleCancel}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonConfirm}
                            onPress={handleCreate}
                        >
                            <Text style={styles.buttonText}>Criar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateGoal;

// 🔹 Estilos do Modal
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "85%",
        backgroundColor: componentColors.modalBackground,
        paddingVertical: "5%",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: componentColors.textPrimary,
        marginBottom: "6%",
    },
    subtitle: {
        color: componentColors.textPrimary,
        fontSize: 22,
        fontWeight: "bold",
        margin: 10,
    },
    timeLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: componentColors.textSecondary,
        marginVertical: 10,
    },
    input: {
        width: "100%",
        height: 45,
        backgroundColor: componentColors.background,
        borderWidth: 1,
        borderColor: componentColors.inputBorder,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: componentColors.placeholderText,
    },
    inputChallenge: {
        width: "40%",
        color: componentColors.textPrimary,
        fontWeight: "bold",
        fontSize: 32,
        textAlign: "center",
    },
    multilineInput: {
        height: 80,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    challengeBox: {
        width: "100%",
        backgroundColor: componentColors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: componentColors.inputBorder,
        marginBottom: 15,
        overflow: "hidden",
    },
    buttonChallengeExtended: {
        width: "100%",
        backgroundColor: componentColors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        zIndex: 2,
        position: "relative",
    },
    message: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonChallenge: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: componentColors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    challengeContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sliderContainer: {
        zIndex: 1,
        position: "relative",
        width: "100%",
        alignItems: "center",
        backgroundColor: componentColors.background,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    slider: {
        width: "90%",
        height: 40,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
        gap: 10,
        width: "100%",
    },
    buttonCancel: {
        flex: 1,
        alignItems: "center",
        backgroundColor: componentColors.incorret,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonConfirm: {
        flex: 1,
        alignItems: "center",
        backgroundColor: componentColors.correct,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: componentColors.textPrimary,
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonDateText: {
        color: componentColors.textPrimary,
        fontSize: 16,
        fontWeight: "bold",
    },
    days: {
        fontSize: 20,
        marginTop: 10,
    },
});
