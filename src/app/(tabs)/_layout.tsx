import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/src/context/contextTheme";

export default function Layout() {
    const { theme } = useTheme();
    return (
        <Tabs
            screenOptions={{
                sceneStyle: {
                    backgroundColor: theme.background,
                },
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    height: 55,
                    backgroundColor: theme.modalBackground,
                    borderTopWidth: 0,
                },
                tabBarItemStyle: {
                    borderRadius: 15,
                    paddingVertical: 10,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="teams"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="group" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="gear" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

// tabBarbadge em options (notificacao pronta)
//Por padrao eh exibida a primeira da lista(caso nenhuma chame index), o title eh o nome da aba, name o nome da pasta
// notifications, deep linking com notifications, fastlane olhar sobre dps
//esqueci
