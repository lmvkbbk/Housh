import { addDays, getRelativeDateInfo } from "@/src/utils/dateUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { Component, useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/src/context/contextTheme";
import AppInput from "../Inputs/Input";
import AppSelectionButton from "../Buttons/SelectionButton";
import AppButton from "../Buttons/Buttons";

type CreateGoalProps = {
    visible: boolean;
    onConfirm: (
        name: string,
        description?: string,
        timeRemaining?: Date,
        status?: string,
        selectedDays?: object,
    ) => void;
    onCancel: () => void;
};

export default function CreateGoal({
    visible,
    onConfirm,
    onCancel,
}: CreateGoalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const status = "Pendente";

    const [time, setTime] = useState(1);

    const { theme } = useTheme();

    const [daily, setDaily] = useState(true);
    const [challenge, setChallenge] = useState(false);

    const [seg, setSeg] = useState(false);
    const [ter, setTer] = useState(false);
    const [qua, setQua] = useState(false);
    const [qui, setQui] = useState(false);
    const [sex, setSex] = useState(false);
    const [sab, setSab] = useState(false);
    const [dom, setDom] = useState(false);

    const toggleDaily = () => {
        if (daily) return;
        setDaily(true);
        setChallenge(false);
    };

    const toggleChallenge = () => {
        if (challenge) return;
        setChallenge(true);
        setDaily(false);
    };

    const getMessage = (days: number) => {
        if (days <= 3)
            return { text: "Missão relâmpago !", icon: "lightning-bolt" };
        if (days <= 7)
            return { text: "Objetivo da semana !", icon: "calendar-week" };
        if (days <= 14) return { text: "Plano esperto !", icon: "lightbulb" };
        return { text: "Meta épica !", icon: "trophy" };
    };
    const selectAllDays = () => {
        setDom(!dom);
        setSeg(!seg);
        setTer(!ter);
        setQua(!qua);
        setQui(!qui);
        setSex(!sex);
        setSab(!sab);
    };

    const resetDays = () => {
        setDom(false);
        setSeg(false);
        setTer(false);
        setQua(false);
        setQui(false);
        setSex(false);
        setSab(false);
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setTime(1);
        setChallenge(false);
        setDaily(true);
        resetDays();
    };

    //cria uma meta, e caso tenha um desafio, add os dias na data atual
    const handleCreate = () => {
        if (!name.trim()) return;
        let timeRemaining = challenge ? addDays(new Date(), time) : undefined;

        const days = {
            dom,
            seg,
            ter,
            qua,
            qui,
            sex,
            sab,
        };

        if (daily) {
            onConfirm(
                name,
                description || undefined,
                timeRemaining,
                status,
                days,
            );
        } else if (challenge) {
            onConfirm(name, description || undefined, timeRemaining, status);
        }
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
            <View style={styles(theme).overlay}>
                <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" />
                <View style={styles(theme).container}>
                    <Text style={styles(theme).title}>Criar Nova Meta</Text>
                    <AppInput
                        icon="flag"
                        value={name}
                        onChangeText={setName}
                        placeholder="Nome da meta"
                        autoCapitalize="sentences"
                    />
                    <View style={styles(theme).selectionView}>
                        <AppSelectionButton
                            onPress={toggleDaily}
                            icon="calendar-outline"
                            title="Meta Diaria"
                            selected={daily}
                            boldText={false}
                        />
                        <AppSelectionButton
                            onPress={toggleChallenge}
                            icon="trophy-outline"
                            title="Desafio"
                            selected={challenge}
                            boldText={false}
                        />
                    </View>
                    {challenge && (
                        <View style={{ width: "100%" }}>
                            <View style={styles(theme).challengeContainer}>
                                <View style={styles(theme).message}>
                                    <MaterialCommunityIcons
                                        name={getMessage(time).icon as any}
                                        size={22}
                                        color={theme.primary}
                                    />
                                    <Text style={styles(theme).subtitle}>
                                        {getMessage(time).text}
                                    </Text>
                                </View>

                                <Text style={styles(theme).timeLabel}>
                                    {time} {time === 1 ? "dia" : "dias"}
                                </Text>

                                <Slider
                                    style={styles(theme).slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    step={1}
                                    onValueChange={(val: number) => {
                                        setTime(val);
                                    }}
                                    minimumTrackTintColor={theme.primary}
                                    maximumTrackTintColor={
                                        theme.placeholderText
                                    }
                                    thumbTintColor={theme.textPrimary}
                                />
                            </View>
                            <AppInput
                                icon="document-text"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Descreva sua meta"
                                multiline={true}
                                autoCapitalize="sentences"
                            />
                        </View>
                    )}
                    {daily && (
                        <View style={{ width: "100%" }}>
                            <Text style={styles(theme).subtitle}>
                                Repita Diariamente em
                            </Text>
                            <View style={styles(theme).selectionView}>
                                <AppSelectionButton
                                    onPress={() => setDom(!dom)}
                                    title="D"
                                    selected={dom}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                <AppSelectionButton
                                    onPress={() => setSeg(!seg)}
                                    title="S"
                                    selected={seg}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                <AppSelectionButton
                                    onPress={() => setTer(!ter)}
                                    title="T"
                                    selected={ter}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                <AppSelectionButton
                                    onPress={() => setQua(!qua)}
                                    title="Q"
                                    selected={qua}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                <AppSelectionButton
                                    onPress={() => setQui(!qui)}
                                    title="Q"
                                    selected={qui}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                <AppSelectionButton
                                    onPress={() => setSex(!sex)}
                                    title="S"
                                    selected={sex}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                <AppSelectionButton
                                    onPress={() => setSab(!sab)}
                                    title="S"
                                    selected={sab}
                                    boldText={true}
                                    propStyle={{
                                        marginVertical: 4,
                                        marginHorizontal: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                    }}
                                />
                            </View>
                            <AppSelectionButton
                                icon="checkbox"
                                title="Todos os Dias"
                                onPress={selectAllDays}
                                selected={true}
                            />
                            <AppInput
                                icon="document-text"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Descreva sua meta"
                                multiline={true}
                                autoCapitalize="sentences"
                            />
                        </View>
                    )}

                    <View style={styles(theme).buttonContainer}>
                        <AppButton
                            onPress={handleCancel}
                            title="Cancelar"
                            backgroundColor={theme.incorrect}
                            boldText={true}
                            widthButton={"48%"}
                        />
                        <AppButton
                            onPress={handleCreate}
                            title="Criar"
                            backgroundColor={theme.correct}
                            boldText={true}
                            widthButton={"48%"}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// 🔹 Estilos do Modal
const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            width: "90%",
            backgroundColor: theme.modalBackground,
            paddingVertical: "5%",
            padding: 20,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textPrimary,
            marginBottom: "6%",
        },
        subtitle: {
            color: theme.textPrimary,
            fontSize: 22,
            fontWeight: "bold",
            margin: 10,
            alignSelf: "center",
        },
        timeLabel: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textSecondary,
            marginVertical: 10,
        },
        message: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        challengeContainer: {
            width: "85%",
            alignItems: "center",
            alignSelf: "center",
            paddingVertical: 12,
            paddingHorizontal: 20,
            margin: 10,
            justifyContent: "space-between",
            backgroundColor: theme.background,
            borderRadius: 8,
            borderColor: theme.primary,
            borderWidth: 1,
        },
        slider: {
            width: "100%",
            height: 40,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: -8,
            gap: 10,
            width: "100%",
        },
        selectionView: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
    });
