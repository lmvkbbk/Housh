import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/src/context/contextTheme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useState } from "react";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type ButtonProps = {
    widthButton?: any;
    icon?: IoniconsName;
    onPress: () => void;
    title?: any;
    selected?: boolean;
    boldText?: boolean;
    propStyle?: ViewStyle;
};

export default function AppSelectionButton({
    widthButton,
    icon,
    title,
    onPress,
    selected,
    boldText,
    propStyle,
}: ButtonProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                selected
                    ? {
                          backgroundColor: theme.primary,
                          width: widthButton,
                          minHeight: 25,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderRadius: 12,
                          borderColor: theme.primary,
                          borderWidth: 1,
                      }
                    : {
                          backgroundColor: theme.textThird,
                          width: widthButton,
                          minHeight: 25,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderRadius: 12,
                          borderColor: theme.primary,
                          borderWidth: 1,
                      },
                propStyle,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={selected ? theme.textThird : theme.textPrimary}
                    style={styles.icon}
                />
            )}
            {title && (
                <Text
                    style={[
                        styles.text,
                        selected
                            ? {
                                  color: theme.textThird,
                                  fontWeight: boldText ? "bold" : "normal",
                              }
                            : {
                                  color: theme.textPrimary,
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
        marginHorizontal: 4,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
    },
});
