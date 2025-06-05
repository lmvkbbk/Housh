import React, { ComponentProps } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/contextTheme";

type SectionHeaderProps = {
    icon: React.ReactNode;
    title: string;
    fontSize?: number;
    marginTop?: boolean;
    center?: boolean;
};

export default function SectionHeader({
    icon,
    title,
    fontSize,
    marginTop,
    center,
}: SectionHeaderProps) {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles(theme).sectionHeader,
                marginTop ? { marginTop: 16 } : {},
                center ? { justifyContent: "center" } : {},
            ]}
        >
            {icon}
            <Text
                style={[
                    styles(theme).sectionTitleText,
                    { fontSize: fontSize || 16 },
                ]}
            >
                {title}
            </Text>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
        },
        sectionTitleText: {
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 8,
            color: theme.textPrimary,
            marginTop: 1,
        },
    });
