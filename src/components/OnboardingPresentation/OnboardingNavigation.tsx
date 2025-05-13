import { useTheme } from "@/src/context/contextTheme";
import { AntDesign } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
    currentPage: number;
    totalPages: number;
    onBack: () => void;
    onNext: () => void;
}

export default function OnboardingNavigation({
    currentPage,
    totalPages,
    onBack,
    onNext,
}: Props) {
    const { theme } = useTheme();

    return (
        <View style={styles(theme).navigationContainer}>
            <TouchableOpacity
                style={[
                    styles(theme).prevButton,
                    currentPage === 0 && { opacity: 0 },
                ]}
                onPress={onBack}
                disabled={currentPage === 0}
            >
                <AntDesign name="swapleft" size={24} color={theme.secondary} />
            </TouchableOpacity>

            <View style={styles(theme).dotsWrapper}>
                {[...Array(totalPages)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles(theme).dot,
                            currentPage === index
                                ? styles(theme).activeDot
                                : styles(theme).inactiveDot,
                        ]}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={[
                    styles(theme).nextButton,
                    currentPage === totalPages - 1 && { opacity: 0 },
                ]}
                onPress={onNext}
                disabled={currentPage === totalPages - 1}
            >
                <AntDesign name="swapright" size={24} color={theme.secondary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        navigationContainer: {
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        prevButton: {
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        nextButton: {
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        dotsWrapper: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 15,
        },
        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
        },
        activeDot: {
            backgroundColor: theme.primary,
            width: 12,
            height: 12,
        },
        inactiveDot: {
            backgroundColor: "gray",
        },
    });
