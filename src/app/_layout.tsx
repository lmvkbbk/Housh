import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="groupDetail" options={{headerShown: false}}/>
            <Stack.Screen name="goalDetails" options={{headerShown: false}}/>
        </Stack>
    )
}