import { Modal, Text, View, Image, StyleSheet } from "react-native";
import AppButton from "../Buttons/Buttons";
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
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {imageExists ? (
                        <Image
                            source={{ uri: imageUri + "?" + new Date() }}
                            style={styles.image}
                        />
                    ) : (
                        <Text style={styles.text}>
                            Foto de perfil ainda não escolhida
                        </Text>
                    )}
                    <AppButton
                        icon="close"
                        onPress={onClose}
                        propStyle={styles.button}
                        textColor={theme.textPrimary}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    content: {
        width: "100%",
        height: "40%",
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
        borderRadius: 25,
    },
    image: {
        width: "80%",
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
        right: 50,
        top: 10,
        alignSelf: "flex-end",
    },
});
