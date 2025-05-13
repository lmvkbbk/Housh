import { FontAwesome } from "@expo/vector-icons";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import AppButton from "../Buttons/Buttons";
import { useTheme } from "@/src/context/contextTheme";
import { OnboardingPage } from "./OnboardingData";

interface Props {
    item: OnboardingPage;
    onFinish: () => void;
}

const { width, height } = Dimensions.get("window");

export default function OnboardingSlide({ item, onFinish }: Props) {
    const { theme } = useTheme();
    return (
        <View style={styles(theme).imageWrapper}>
            <View style={styles(theme).slideContainer}>
                <FontAwesome
                    name={item.icon}
                    size={100}
                    color={theme.primary}
                    style={styles(theme).icon}
                />
                <Text style={styles(theme).title}>{item.title}</Text>
                <Text style={styles(theme).subtitle}>{item.subtitle}</Text>
                {item.buttonText && (
                    <AppButton
                        onPress={onFinish}
                        title={item.buttonText}
                        boldText={true}
                        backgroundColor={theme.primary}
                    />
                )}
            </View>
        </View>
    ); // "molde" para as paginas do carrossel
}

const styles = (theme: any) =>
    StyleSheet.create({
        imageWrapper: {
            width,
            alignItems: "center",
            backgroundColor: "transparent",
        },
        slideContainer: {
            backgroundColor: theme.modalBackground,
            width: width * 0.95,
            height: height * 0.8,
            alignItems: "center",
            justifyContent: "center",
            padding: 35,
            borderRadius: 35,
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: theme.primary,
            textAlign: "center",
            margin: 10,
        },
        subtitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textSecondary,
            textAlign: "center",
            margin: 10,
        },
        icon: {
            marginBottom: 20,
        },
    });
