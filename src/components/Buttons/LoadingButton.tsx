import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useTheme } from "@/src/context/contextTheme";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type LoadingButtonProps = {
    isLoading?: boolean;
    onPress?: () => void;
    title: any;
    icon?: IoniconsName;
    widthButton?: any;
    propStyle?: ViewStyle;
};

export default function AppLoadingButton({
    isLoading,
    onPress,
    title,
    icon,
    widthButton,
    propStyle,
}: LoadingButtonProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor: theme.primary,
                    width: widthButton,
                    height: 50,
                },
                propStyle,
            ]}
            activeOpacity={0.8}
            disabled={isLoading} // Desabilita o botão enquanto estiver carregando
        >
            {isLoading ? (
                <ActivityIndicator color={theme.textPrimary} />
            ) : (
                <>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={24}
                            color={theme.textPrimary}
                            style={styles.icon}
                        />
                    )}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: theme.textPrimary,
                            },
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        maxWidth: 300,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "center",
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
