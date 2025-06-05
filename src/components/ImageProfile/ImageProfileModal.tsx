import {
    Modal,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { useTheme } from "@/src/context/contextTheme";

interface Props {
    visible: boolean;
    imageUri: string | null;
    imageExists: boolean;
    onClose: () => void;
}

export default function ImageProfileModal({
    visible,
    imageUri,
    imageExists,
    onClose,
}: Props) {
    const { theme } = useTheme();
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                onPressOut={onClose}
                activeOpacity={1}
                style={styles(theme).overlay}
            >
                <StatusBar backgroundColor="rgba(0,0,0,0.6)" />
                <View style={styles(theme).content}>
                    {imageExists ? (
                        <Image
                            source={{ uri: imageUri + "?" + new Date() }}
                            style={styles(theme).image}
                        />
                    ) : (
                        <Text style={styles(theme).text}>
                            Foto de perfil ainda não escolhida
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        content: {
            width: "80%",
            height: "40%",
            justifyContent: "flex-end",
            alignItems: "center",
            borderRadius: 25,
            backgroundColor: theme.modalBackground,
        },
        image: {
            width: "100%",
            height: "100%",
            borderRadius: 25,
        },
        text: {
            color: "#fff",
            fontSize: 16,
            marginBottom: 16,
        },
        button: {
            position: "absolute",
            right: 8,
            top: 4,
            alignSelf: "flex-end",
        },
    });
