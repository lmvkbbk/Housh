import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/contextTheme";

interface Props {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    onPress: () => void;
    color?: string;
}

export default function SettingsItem({ icon, title, onPress, color }: Props) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity style={styles(theme).itemContainer} onPress={onPress}>
            <View style={styles(theme).iconTitle}>
                <MaterialIcons
                    name={icon}
                    size={24}
                    color={color ? color : theme.textSecondary}
                />
                <Text
                    style={{
                        color: color ? color : theme.textSecondary,
                        fontSize: 16,
                        marginLeft: 10,
                    }}
                >
                    {title}
                </Text>
            </View>
            <MaterialIcons
                name="chevron-right"
                size={24}
                color={color ? color : theme.textSecondary}
            />
        </TouchableOpacity>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        itemContainer: {
            paddingVertical: 16,
            paddingHorizontal: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: theme.textSecondary,
        },
        iconTitle: {
            flexDirection: "row",
            alignItems: "center",
        },
    });
