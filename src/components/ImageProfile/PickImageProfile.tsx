import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { auth } from "@/src/firebase/config";
import ImageProfileModal from "./ImageProfileModal";
import { useTheme } from "@/src/context/contextTheme";

export default function PickImageProfile({
    onImageSaved,
}: {
    onImageSaved?: (uri: string) => void;
}) {
    const [imageProfile, setImageProfile] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [imageExists, setImagExists] = useState(false);
    const localImagePath =
        FileSystem.documentDirectory +
        "profile" +
        auth.currentUser?.uid +
        ".jpg";

    const { theme } = useTheme();

    useEffect(() => {
        loadLocalImage();
    }, [imageProfile]);

    const loadLocalImage = async () => {
        const fileInfo = await FileSystem.getInfoAsync(localImagePath); // ele verifica as informações de um arquivo ou diretorio
        if (fileInfo.exists) {
            setImagExists(true);
            setImageProfile(localImagePath);
        }
    };

    const pickImage = async () => {
        setLoadingImage(true);
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync(); // função responsavel por perguntar a permissao da galeria
        if (status !== "granted") {
            Alert.alert(
                "Permissão Necessária",
                "Para continuar, é necessário conceder acesso à galeria. Por favor, autorize a permissão nas configurações do seu dispositivo.",
                [{ text: "OK", onPress: () => console.log("Alerta fechado") }],
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // Exibe a interface do usuário do sistema para escolher uma imagem
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            // result é um objeto, que possui o canceled, variavel responsavel por saber se o usuario cancelou a ação
            saveImageLocally(result.assets[0].uri);
        } else {
            setLoadingImage(false);
        }
    };

    const saveImageLocally = async (uri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(localImagePath);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(localImagePath, {
                    idempotent: true,
                });
            }

            await FileSystem.copyAsync({
                // faz uma copia do arquivo que tiver na uri pega em 'ImagePicker.launchImageLibraryAsync'
                from: uri,
                to: localImagePath,
            });

            setImageProfile(localImagePath);
            if (onImageSaved) {
                onImageSaved(localImagePath);
            }
        } catch (error) {
            Alert.alert(
                "Erro ao Salvar",
                "Ocorreu um problema ao salvar a imagem. Por favor, tente novamente.",
                [{ text: "OK" }],
            );
        } finally {
            setLoadingImage(false);
        }
    };

    // Vamo ficar sem fotos no perfil, com contas criadas com email e senha
    // o firebase oferece a ultilização de downloads e upload de fotos pelo FirebaseStorage mas é pago

    const previewPicture = () => {
        setIsModalVisible(true);
    };

    const closeButton = () => {
        setIsModalVisible(false);
    };

    return (
        <View>
            <ImageProfileModal
                visible={isModalVisible}
                imageUri={localImagePath}
                imageExists={imageExists}
                onClose={closeButton}
            />

            <TouchableOpacity
                style={styles(theme).profileImageWrapper}
                onPress={previewPicture}
            >
                {imageProfile ? (
                    <Image
                        source={{
                            uri: imageProfile + "?" + new Date(),
                        }}
                        style={styles(theme).profileImage}
                    />
                ) : (
                    <MaterialIcons
                        name="account-circle"
                        size={200}
                        color={theme.primary}
                    />
                )}
                {loadingImage && (
                    <ActivityIndicator
                        color="gray"
                        size={35}
                        style={styles(theme).loadingOverlay}
                    />
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles(theme).cameraButton}
                onPress={pickImage}
            >
                <FontAwesome name="camera" size={30} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
        profileImageWrapper: {
            justifyContent: "center",
            alignItems: "center",
            width: 200,
            height: 200,
            margin: 20,
            borderRadius: 100,
        },
        profileImage: {
            width: "100%",
            height: "100%",
            borderRadius: 100,
        },
        cameraButton: {
            position: "absolute",
            bottom: 30,
            right: 30,
            backgroundColor: theme.modalBackground,
            borderRadius: 25,
            padding: 8,
            borderWidth: 2,
            borderColor: theme.modalBackground,
        },
        loadingOverlay: {
            position: "absolute",
        },
    });
