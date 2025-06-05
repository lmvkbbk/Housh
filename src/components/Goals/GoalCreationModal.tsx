import { addDays } from "@/src/utils/dateUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    StatusBar,
    ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/src/context/contextTheme";
import AppInput from "../Inputs/Input";
import AppSelectionButton from "../Buttons/SelectionButton";
import AppButton from "../Buttons/Buttons";
import { addGoalInUser } from "@/src/services/userServices";
import { auth } from "@/src/firebase/config";
import colors from "@/src/styles/colors";
import AppLoadingButton from "../Buttons/LoadingButton";
import { LinearGradient } from "expo-linear-gradient";
import { unlockAchievement } from "@/src/services/unlockAchievement";
import { useAchievement } from "@/src/context/contextAchievement";

type CreateGoalProps = {
    visible: boolean;
    onReload: () => void;
    onCancel: () => void;
};

export default function GoalCreationModal({
    visible,
    onReload,
    onCancel,
}: CreateGoalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const status = "Pendente";

    const [time, setTime] = useState(1);
    const [loading, setLoading] = useState(false);

    const { theme } = useTheme();
    const { showAchievement } = useAchievement();
    const noteColors = Object.values(colors.notes);

    const [daily, setDaily] = useState(false);
    const [challenge, setChallenge] = useState(false);
    const [free, setFree] = useState(true);

    const [seg, setSeg] = useState(false);
    const [ter, setTer] = useState(false);
    const [qua, setQua] = useState(false);
    const [qui, setQui] = useState(false);
    const [sex, setSex] = useState(false);
    const [sab, setSab] = useState(false);
    const [dom, setDom] = useState(false);

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        let index = 0;

        if (free) index = 0;
        else if (daily) index = 1;
        else if (challenge) index = 2;

        const x = 20 + index * 120;

        scrollRef.current?.scrollTo({ x, animated: true });
    }, [free, daily, challenge]);

    const toggleFree = () => {
        if (free) return;
        setFree(true);
        setDaily(false);
        setChallenge(false);
    };

    const toggleDaily = () => {
        if (daily) return;
        setFree(false);
        setDaily(true);
        setChallenge(false);
    };

    const toggleChallenge = () => {
        if (challenge) return;
        setFree(false);
        setDaily(false);
        setChallenge(true);
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
        setDom(true);
        setSeg(true);
        setTer(true);
        setQua(true);
        setQui(true);
        setSex(true);
        setSab(true);
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
        setDaily(false);
        setFree(true);
        resetDays();
    };

    //cria uma meta, e caso tenha um desafio, add os dias na data atual
    const handleCreate = async () => {
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
            await addGoal(
                name,
                description || undefined,
                status,
                timeRemaining,
                days,
            );
        } else if (challenge) {
            await addGoal(
                name,
                description || undefined,
                status,
                timeRemaining,
            );
        } else if (free) {
            await addGoal(name, description || undefined, status);
        }
        const user = auth.currentUser?.uid;

        onReload();

        if (user) {
            await unlockAchievement(user, "firstGoalCreated", showAchievement);
        }
    };

    //Funcao q eh chamada quando o usuario cria uma meta nova
    const addGoal = async (
        title: string,
        description?: string,
        status?: string,
        timeRemaining?: Date,
        selectedDays?: Object,
    ) => {
        setLoading(true);
        try {
            const randomColor =
                noteColors[Math.floor(Math.random() * noteColors.length)];

            const newGoal = {
                id: Date.now().toString(),
                title,
                description,
                timeRemaining,
                status,
                selectedDays: selectedDays || null,
                color: randomColor,
                lastUpdated: selectedDays ? new Date() : null,
            };
            //atualiza o usuario com a nova meta
            await addGoalInUser(auth.currentUser?.uid, newGoal);
        } catch (error) {
            console.log("Erro ao adicionar a meta", error);
        } finally {
            setLoading(false);
            handleCancel();
        }
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
                    <View
                        style={[
                            styles(theme).selectionView,
                            {
                                gap: 20,
                            },
                        ]}
                    >
                        <ScrollView
                            ref={scrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={{ width: 100 }} />
                            <AppSelectionButton
                                onPress={toggleFree}
                                icon="bulb-outline"
                                title="Meta Livre"
                                selected={free}
                                boldText={false}
                                widthButton={120}
                            />
                            <AppSelectionButton
                                onPress={toggleDaily}
                                icon="calendar-outline"
                                title="Meta Diaria"
                                selected={daily}
                                boldText={false}
                                widthButton={120}
                            />
                            <AppSelectionButton
                                onPress={toggleChallenge}
                                icon="trophy-outline"
                                title="Desafio"
                                selected={challenge}
                                boldText={false}
                                widthButton={120}
                            />
                            <View style={{ width: 100 }} />
                        </ScrollView>

                        <LinearGradient
                            colors={["transparent", theme.modalBackground]}
                            pointerEvents="none"
                            style={styles(theme).fadeRight}
                            start={{ y: 1, x: 0 }}
                        />
                        <LinearGradient
                            colors={["transparent", theme.modalBackground]}
                            pointerEvents="none"
                            style={styles(theme).fadeLeft}
                            start={{ y: 1, x: 1 }}
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
                    {free && (
                        <AppInput
                            icon="document-text"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Descreva sua meta"
                            multiline={true}
                            autoCapitalize="sentences"
                        />
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
                            icon="close"
                            onPress={handleCancel}
                            title="Cancelar"
                            backgroundColor={theme.incorrect}
                            boldText={true}
                            widthButton={"48%"}
                        />

                        <AppLoadingButton
                            isLoading={loading}
                            icon="checkmark-sharp"
                            onPress={handleCreate}
                            title="Criar Meta"
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
            color: theme.textSecondary,
            marginBottom: 8,
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
        fadeLeft: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 30,
            zIndex: 10,
        },
        fadeRight: {
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 30,
            zIndex: 10,
        },
    });
