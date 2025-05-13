import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

type PasswordValidationProps = {
    hasMinLength: boolean;
    hasNumbersAndSymbols: boolean;
};

export default function PasswordValidation({
    hasMinLength,
    hasNumbersAndSymbols,
}: PasswordValidationProps) {
    const { theme } = useTheme();

    return (
        <View style={styles.validationGroup}>
            <View style={styles.validationRow}>
                <AntDesign
                    name={hasMinLength ? "checkcircle" : "closecircle"}
                    size={18}
                    color={hasMinLength ? theme.correct : theme.incorrect}
                />
                <Text
                    style={[
                        styles.validationText,
                        { color: theme.textSecondary },
                    ]}
                >
                    A senha deve ter pelo menos 6 caracteres
                </Text>
            </View>

            <View style={styles.validationRow}>
                <AntDesign
                    name={hasNumbersAndSymbols ? "checkcircle" : "closecircle"}
                    size={18}
                    color={
                        hasNumbersAndSymbols ? theme.correct : theme.incorrect
                    }
                />
                <Text
                    style={[
                        styles.validationText,
                        { color: theme.textSecondary },
                    ]}
                >
                    A senha deve conter números e símbolos
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    validationGroup: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    validationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    validationText: {
        textAlign: "left",
        marginLeft: 12,
    },
});
