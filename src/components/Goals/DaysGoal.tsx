import { useTheme } from "@/src/context/contextTheme";
import { View, StyleSheet, Text } from "react-native";

interface DayProp {
    today: number;
    day: number;
    active: boolean;
    title: string;
}

export default function AppDaysGoal({ today, day, active, title }: DayProp) {
    const { theme } = useTheme();

    const activeToday = today === day;
    return (
        <View
            style={[
                styles(theme).viewDay,
                active
                    ? {
                          backgroundColor: theme.cardAccent,
                          borderColor: theme.primary,
                      }
                    : {
                          backgroundColor: theme.cardAccent,
                          borderColor: theme.cardAccent,
                      },
                activeToday && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                },
            ]}
        >
            <Text
                style={[
                    styles(theme).textViewDay,
                    activeToday
                        ? {
                              color: theme.textThird,
                          }
                        : {
                              color: theme.textPrimary,
                          },
                ]}
            >
                {title}
            </Text>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        viewDay: {
            borderRadius: 12,
            borderWidth: 1,
            marginHorizontal: 2,
        },
        textViewDay: {
            fontSize: 12,
            fontWeight: "bold",
            marginHorizontal: 8,
            marginVertical: 4,
            alignSelf: "center",
        },
    });
