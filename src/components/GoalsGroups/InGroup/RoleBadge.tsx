import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

export function RoleBadge({
    group,
    memberUid,
    margin,
    card,
}: {
    group: any;
    memberUid: string;
    margin?: boolean;
    card?: boolean;
}) {
    const userId = memberUid;
    const viceLeaders = group.viceLeaders ? Object.keys(group.viceLeaders) : [];

    const { theme } = useTheme();

    let role = "Participante";
    let icon = "user";
    let color = theme.textSecondary;

    if (group.createdBy === userId) {
        role = "Líder";
        icon = "crown";
        color = "#F5C518";
    } else if (viceLeaders.includes(userId)) {
        role = "Vice-líder";
        icon = "user-tie";
        color = "#5DADE2";
    }

    return (
        <View
            style={[
                styles(theme).container,
                margin && { marginTop: 12, marginBottom: 8 },
                card && {
                    padding: 8,
                    backgroundColor: theme.cardAccent,
                    borderRadius: 8,
                },
            ]}
        >
            {card && (
                <FontAwesome5
                    name={icon}
                    size={18}
                    color={color}
                    style={styles(theme).icon}
                />
            )}
            <Text style={[styles(theme).text, { color: color }]}>{role}</Text>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
        },
        icon: {
            marginRight: 6,
        },
        text: {
            fontSize: 16,
            fontWeight: "600",
        },
    });
