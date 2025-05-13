import React, { ComponentProps, useState } from "react";
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type InputPasswordProps = {
    icon?: boolean;
    iconName?: IoniconsName;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

export default function AppInputPassword({
    icon,
    iconName,
    value,
    onChangeText,
    placeholder,
}: InputPasswordProps) {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <View style={styles.wrapper}>
            {icon && (
                <Ionicons
                    name={iconName ? iconName : "key"}
                    size={24}
                    color={theme.primary}
                    style={styles.iconLeft}
                />
            )}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={!isVisible}
                autoComplete="password"
                autoCapitalize="none"
                placeholderTextColor={theme.placeholderText}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.background,
                        color: theme.textPrimary,
                        borderColor: theme.primary,
                        paddingLeft: 40,
                        paddingRight: 40,
                    },
                ]}
            />
            <TouchableOpacity
                onPress={toggleVisibility}
                style={styles.iconRight}
            >
                <Ionicons
                    name={isVisible ? "eye" : "eye-off"}
                    size={24}
                    color={theme.primary}
                />
            </TouchableOpacity>
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
});
