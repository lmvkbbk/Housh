import React, { ComponentProps, useState } from "react";
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type InputProps = {
    icon?: IoniconsName;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureText?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    multiline?: boolean;
    autoComplete?: "off" | "username" | "password" | "email" | "name" | "tel";
    maxLength?: number;
};

export default function AppInput({
    icon,
    value,
    onChangeText,
    placeholder,
    secureText = false,
    autoCapitalize = "none",
    multiline = false,
    maxLength,
    autoComplete = "off",
}: InputProps) {
    const { theme } = useTheme();
    const [secure, setSecure] = useState(secureText);

    const toggleSecureText = () => {
        setSecure(!secure);
    };

    return (
        <View style={styles.wrapper}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={24}
                    color={theme.primary}
                    style={styles.iconLeft}
                />
            )}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secure}
                autoCapitalize={autoCapitalize}
                multiline={multiline}
                maxLength={maxLength}
                autoComplete={autoComplete}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.background,
                        color: theme.textPrimary,
                        borderColor: theme.primary,
                        paddingLeft: icon ? 40 : 15,
                        paddingRight: secureText ? 40 : 15,
                    },
                    multiline && styles.multilineInput,
                ]}
                placeholderTextColor={theme.placeholderText}
            />
            {secureText && (
                <TouchableOpacity
                    onPress={toggleSecureText}
                    style={styles.iconRight}
                >
                    <Ionicons
                        name={secure ? "eye-off" : "eye"}
                        size={24}
                        color={theme.primary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "90%",
        maxWidth: 300,
        alignSelf: "center",
        position: "relative",
        justifyContent: "center",
        marginVertical: 12,
    },
    input: {
        height: 50,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    iconLeft: {
        position: "absolute",
        left: 12,
        top: 12,
        zIndex: 1,
    },
    iconRight: {
        position: "absolute",
        right: 12,
        top: 12,
        zIndex: 1,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: "top",
        paddingTop: 12,
    },
});
