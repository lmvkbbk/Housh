import { useTheme } from "@/src/context/contextTheme";
import {
    Modal,
    Text,
    View,
    StyleSheet,
    StatusBar,
    ScrollView,
} from "react-native";
import AppButton from "../Buttons/Buttons";
import AppLoadingButton from "../Buttons/LoadingButton";
import AppInput from "../Inputs/Input";
import AppSelectionButton from "../Buttons/SelectionButton";
import { useEffect, useRef, useState } from "react";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserGoal } from "@/src/app/(tabs)/home";
import { addDays, getRelativeDateInfo } from "@/src/utils/dateUtils";
import { getGoalUser, updateGoalInUser } from "@/src/services/userServices";
import { auth } from "@/src/firebase/config";
import { LinearGradient } from "expo-linear-gradient";

export default function GoalEditModal({
    visible,
    onClose,
    goal,
    onReload,
    onSave,
}: {
    visible: boolean;
    goal: UserGoal | null;
    onClose: () => void;
    onReload: () => void;
    onSave?: (updateGoal: UserGoal) => void;
}) {
    const { theme } = useTheme();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const status = "Pendente";

    const [time, setTime] = useState(1);
    const [loading, setLoading] = useState(false);

    const [isRecurringGoal, setIsRecurringGoal] = useState(false);
    const [isTimedGoal, setIsTimedGoal] = useState(false);
    const [isFreeFormGoal, setIsFreeFormGoal] = useState(false);

    const [seg, setSeg] = useState(false);
    const [ter, setTer] = useState(false);
    const [qua, setQua] = useState(false);
    const [qui, setQui] = useState(false);
    const [sex, setSex] = useState(false);
    const [sab, setSab] = useState(false);
    const [dom, setDom] = useState(false);

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (!goal) return;

        setTitle(goal.title || "");
        setDescription(goal.description || "");
        if (goal.selectedDays) {
            setIsRecurringGoal(true);
            const days = goal.selectedDays;
            setDom(days.dom);
            setSeg(days.seg);
            setTer(days.ter);
            setQua(days.qua);
            setQui(days.qui);
            setSex(days.sex);
            setSab(days.sab);
        } else if (goal.timeRemaining) {
            setIsTimedGoal(true);
            const diasRestantes = getRelativeDateInfo(
                goal.timeRemaining as Date,
            );
            if (diasRestantes) {
                setTime(diasRestantes.Value);
            }
        } else if (!goal.selectedDays && !goal.timeRemaining) {
            setIsFreeFormGoal(true);
        }
    }, [goal]);

    useEffect(() => {
        let index = 0;

        if (isFreeFormGoal) index = 0;
        else if (isRecurringGoal) index = 1;
        else if (isTimedGoal) index = 2;

        const x = 20 + index * 120;

        scrollRef.current?.scrollTo({ x, animated: true });
    }, [isFreeFormGoal, isRecurringGoal, isTimedGoal]);

    const activateFreeFormMode = () => {
        if (isFreeFormGoal) return;
        setIsFreeFormGoal(true);
        setIsRecurringGoal(false);
        setIsTimedGoal(false);
    };

    const activateRecurringMode = () => {
        if (isRecurringGoal) return;
        setIsFreeFormGoal(false);
        setIsRecurringGoal(true);
        setIsTimedGoal(false);
    };

    const activateTimedMode = () => {
        if (isTimedGoal) return;
        setIsFreeFormGoal(false);
        setIsRecurringGoal(false);
        setIsTimedGoal(true);
    };

    const deselectAllDays = () => {
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
        setTitle("");
        setDescription("");
        setTime(1);
        setIsTimedGoal(false);
        setIsRecurringGoal(false);
        resetDays();
    };

    const getGoalDifficultyMessage = (days: number) => {
        if (days <= 3)
            return { text: "Missão relâmpago !", icon: "lightning-bolt" };
        if (days <= 7)
            return { text: "Objetivo da semana !", icon: "calendar-week" };
        if (days <= 14) return { text: "Plano esperto !", icon: "lightbulb" };
        return { text: "Meta épica !", icon: "trophy" };
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        let timeRemaining = isTimedGoal ? addDays(new Date(), time) : undefined;

        const days = {
            dom,
            seg,
            ter,
            qua,
            qui,
            sex,
            sab,
        };

        if (isRecurringGoal) {
            await updateGoal(
                title,
                description || undefined,
                status,
                timeRemaining,
                days,
            );
        } else if (isTimedGoal) {
            await updateGoal(
                title,
                description || undefined,
                status,
                timeRemaining,
            );
        } else if (isFreeFormGoal) {
            await updateGoal(title, description || undefined, status);
        }

        onReload();
    };

    const updateGoal = async (
        title: string,
        description?: string,
        status?: string,
        timeRemaining?: Date,
        selectedDays?: Object,
    ) => {
        setLoading(true);
        try {
            const newGoal = {
                id: goal?.id,
                title,
                description,
                timeRemaining,
                status,
                selectedDays: selectedDays || null,
                color: goal?.color,
                lastUpdated: selectedDays ? new Date() : null,
            };

            await updateGoalInUser(auth.currentUser?.uid, newGoal);
            if (onSave) {
                const goalUpdated = await getGoalUser(
                    auth.currentUser?.uid,
                    newGoal.id,
                );
                onSave(goalUpdated);
            }
        } catch (error) {
            console.log("Erro ao adicionar a meta", error);
        } finally {
            setLoading(false);
            handleCancel();
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose();
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
                    <Text style={styles(theme).title}>Editar Meta</Text>
                    <AppInput
                        icon="flag"
                        value={title}
                        onChangeText={setTitle}
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
                                onPress={activateFreeFormMode}
                                icon="bulb-outline"
                                title="Meta Livre"
                                selected={isFreeFormGoal}
                                boldText={false}
                                widthButton={120}
                            />
                            <AppSelectionButton
                                onPress={activateRecurringMode}
                                icon="calendar-outline"
                                title="Meta Diaria"
                                selected={isRecurringGoal}
                                boldText={false}
                                widthButton={120}
                            />
                            <AppSelectionButton
                                onPress={activateTimedMode}
                                icon="trophy-outline"
                                title="Desafio"
                                selected={isTimedGoal}
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
                    {isTimedGoal && (
                        <View style={{ width: "100%" }}>
                            <View
                                style={[
                                    styles(theme).challengeContainer,
                                    { opacity: 0.4 },
                                ]}
                            >
                                <View style={styles(theme).message}>
                                    <MaterialCommunityIcons
                                        name={
                                            getGoalDifficultyMessage(time)
                                                .icon as any
                                        }
                                        size={22}
                                        color={theme.primary}
                                    />
                                    <Text style={styles(theme).subtitle}>
                                        {getGoalDifficultyMessage(time).text}
                                    </Text>
                                </View>

                                <Text style={styles(theme).timeLabel}>
                                    {time} {time === 1 ? "dia" : "dias"}
                                </Text>

                                <Slider
                                    style={styles(theme).slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    value={time}
                                    step={1}
                                    disabled
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
                                value={description as any}
                                onChangeText={setDescription}
                                placeholder="Descreva sua meta"
                                multiline={true}
                                autoCapitalize="sentences"
                            />
                        </View>
                    )}
                    {isRecurringGoal && (
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
                                onPress={deselectAllDays}
                                selected={true}
                            />
                            <AppInput
                                icon="document-text"
                                value={description as any}
                                onChangeText={setDescription}
                                placeholder="Descreva sua meta"
                                multiline={true}
                                autoCapitalize="sentences"
                            />
                        </View>
                    )}
                    {isFreeFormGoal && (
                        <AppInput
                            icon="document-text"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Descreva sua meta"
                            multiline={true}
                            autoCapitalize="sentences"
                        />
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
                            onPress={handleSave}
                            title="Salvar"
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
