import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useState } from "react";
import { useTheme } from "@/src/context/contextTheme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type ToggleIconButtonProps = {
    widthButton?: any;
    iconA: IoniconsName;
    iconB: IoniconsName;
    onToggle?: (state: boolean) => void;
    title?: string;
    backgroundColor?: string;
    textColor?: string;
    sizeText?: number;
    boldText?: boolean;
    propStyle?: ViewStyle;
};

export default function AppToggleIconButton({
    widthButton,
    iconA,
    iconB,
    onToggle,
    title,
    backgroundColor,
    textColor,
    sizeText,
    boldText,
    propStyle,
}: ToggleIconButtonProps) {
    const { theme } = useTheme();
    const [toggled, setToggled] = useState(false);

    const resolvedBackgroundColor = backgroundColor || "transparent";
    const resolvedTextColor = textColor || theme.textPrimary;

    const handlePress = () => {
        const newState = !toggled;
        setToggled(newState);
        if (onToggle) onToggle(newState);
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: resolvedBackgroundColor,
                    width: widthButton,
                    minHeight: 25,
                    paddingVertical: backgroundColor ? 12 : 0,
                    paddingHorizontal: backgroundColor ? 16 : 0,
                    borderRadius: 12,
                },
                propStyle,
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Ionicons
                name={toggled ? iconB : iconA}
                size={24}
                color={resolvedTextColor}
                style={[styles.icon, !title && { marginRight: 0 }]}
            />
            {title && (
                <Text
                    style={[
                        styles.text,
                        {
                            color: resolvedTextColor,
                            fontWeight: boldText ? "bold" : "normal",
                        },
                        sizeText
                            ? {
                                  fontSize: sizeText,
                                  textDecorationLine: "underline",
                              }
                            : {},
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        maxWidth: 300,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "center",
        marginVertical: 8,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
    },
});
