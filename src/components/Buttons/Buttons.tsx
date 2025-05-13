import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/src/context/contextTheme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type ButtonProps = {
    widthButton?: any;
    icon?: IoniconsName;
    onPress?: () => void;
    title?: any;
    backgroundColor?: string;
    textColor?: string;
    boldText?: boolean;
    propStyle?: ViewStyle;
};

export default function AppButton({
    widthButton,
    icon,
    title,
    onPress,
    backgroundColor,
    textColor,
    boldText,
    propStyle,
}: ButtonProps) {
    const { theme } = useTheme();

    const resolvedBackgroundColor = backgroundColor
        ? backgroundColor
        : "transparent";
    const resolvedTextColor = textColor ? textColor : theme.textPrimary;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: resolvedBackgroundColor,
                    width: widthButton,
                    minHeight: 25,
                    paddingVertical: backgroundColor ? 16 : 0,
                    paddingHorizontal: backgroundColor ? 20 : 0,
                    borderRadius: 12,
                },
                propStyle,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={24}
                    color={resolvedTextColor}
                    style={styles.icon}
                />
            )}
            {title && (
                <Text
                    style={[
                        styles.text,
                        {
                            color: resolvedTextColor,
                            fontWeight: boldText ? "bold" : "normal",
                        },
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
