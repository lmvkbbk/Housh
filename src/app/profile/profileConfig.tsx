import { auth } from "@/src/database/firebase";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import componentColors from "../../styles/componentColors";
import { creatUserDatabase } from "@/src/services/realtime";


export default function VerificationPage() {
    const [name, setName] = useState('');
    const [imageProfile, setImageProfile] = useState<string | null>(null);
    const [message, setMessage]= useState('');
    const [isModalVisible, setIsModalVisible]= useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [imageExists, setImagExists] = useState(false);
    const localImagePath = FileSystem.documentDirectory +"profile"+auth.currentUser?.uid+ ".jpg";

    useEffect(()=>{
        setMessage('');
    }, [name]);

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

    const pickImage= async()  => {
        setLoadingImage(true);
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();  // função responsavel por perguntar a permissao da galeria
        if (status !== "granted") { 
            Alert.alert(
                "Permissão Necessária",
                "Para continuar, é necessário conceder acesso à galeria. Por favor, autorize a permissão nas configurações do seu dispositivo.",
                [{ text: "OK", onPress: () => console.log("Alerta fechado") }]
            );
            return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({  // Exibe a interface do usuário do sistema para escolher uma imagem
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) { // result é um objeto, que possui o canceled, variavel responsavel por saber se o usuario cancelou a ação
            saveImageLocally(result.assets[0].uri);
        }else {
            setLoadingImage(false);
        }
    };

    const saveImageLocally = async(uri: string) => {
        try{
            const fileInfo = await FileSystem.getInfoAsync(localImagePath);
            console.log("Arquivo existe antes da exclusão?", fileInfo.exists);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(localImagePath, { idempotent: true });
                console.log("Imagem antiga excluída!");
            }
            const checkFile = await FileSystem.getInfoAsync(localImagePath);
            console.log("Arquivo ainda existe após exclusão?", checkFile.exists);

            await FileSystem.copyAsync({    // faz uma copia do arquivo que tiver na uri pega em 'ImagePicker.launchImageLibraryAsync' 
                from: uri,
                to: localImagePath
            })
            setImageProfile(localImagePath);
        } catch (error){
            Alert.alert(
                "Erro ao Salvar",
                "Ocorreu um problema ao salvar a imagem. Por favor, tente novamente.",
                [{ text: "OK", onPress: () => console.log("Alerta fechado") }]
              );
        }finally{
            setLoadingImage(false);
        }
    }

    const handleContinue = async () => {
        setLoading(true);

        if (!auth.currentUser) {
            Alert.alert(
                "Autenticação Necessária",
                "Nenhum usuário autenticado foi encontrado. Você será redirecionado para a tela de login.",
                [{ text: "OK", onPress: () => console.log("Redirecionando para login") }]
              );
            router.replace('/auth/sign-in');
            setLoading(false);
            return;
        }else {
            if (!name) {
                setMessage("Por favor, insira um nome!");
                setLoading(false);
                return;
            }else {
                try {
                    await updateProfile(auth.currentUser,{
                        displayName: name,
                        photoURL: localImagePath
                    })
                    await creatUserDatabase(auth.currentUser.uid);
                    router.replace('/(tabs)/home');
                } catch (error) {
                    console.log(error);
                    switch (error) {
                        case "auth/network-request-failed":
                            setMessage("Falha na conexão. Verifique sua internet e tente novamente.");
                            break;
                        case "auth/user-disabled":
                            setMessage("Esta conta foi desativada.");
                            break;
                        default: 
                            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
                            break;
                    }
                }finally{
                    setLoading(false);
                }
            }
        }
    };

    // Vamo ficar sem fotos no perfil, com contas criadas com email e senha
    // o firebase oferece a ultilização de downloads e upload de fotos pelo FirebaseStorage mas é pago  

    const previewPicture = () => {
        setIsModalVisible(true)
    }

    const closeButton =()=>{
        setIsModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <Modal 
                        animationType="fade"
                        transparent 
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
             >
                <View  style={styles.modalBackground}>
                    <View style={styles.profileModalContainer}>
                        { imageExists ? (
                            <Image source={{uri: imageProfile + '?' + new Date() }} style={styles.profileImageLarge} />
                        ):(
                            <Text style={styles.subtitle}>Foto de perfil ainda não escolhida</Text>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={closeButton}>
                            <AntDesign name="close" size={30} color={componentColors.textPrimary} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Text style={styles.title}>Configurando o seu Perfil</Text>
            <Text style={styles.subtitle}>Adicione uma foto e seu nome para o seu perfil</Text>

            <View>
                <TouchableOpacity style={styles.profileContainer} onPress={previewPicture}>
                    {imageProfile ? (
                        <Image source={{uri: imageProfile + '?' + new Date()}}  style={styles.profileImage} />
                    ) : (
                        <MaterialIcons name="account-circle" size={200} color={componentColors.primary} />
                    )}
                    {loadingImage && (
                         <ActivityIndicator color="gray" size={35} style={styles.iconLoading}/>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cameraIconButton} onPress={pickImage}>
                        <FontAwesome name="camera" size={30} color={componentColors.primary} />
                </TouchableOpacity>
            </View> 
            
            <TextInput style={styles.textInput } 
            placeholder="Digite seu nome" 
            placeholderTextColor="#999"  
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
            />
            <Text style={styles.subtitle}>{message}</Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} >
                <AntDesign name="arrowright" size ={24} color={componentColors.textPrimary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: componentColors.modalBackground,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalBackground:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    profileModalContainer:{
        width: '100%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 25,
    },
    profileImageLarge: {
        width: '80%',
        height : '100%',
        borderRadius: 25,
    },
    closeButton: {
        position: 'absolute',
        right: 50,
        top: 10,
        alignSelf: 'flex-end',
    },
    closeIcon: {
        paddingBottom: 10,
    },
    iconLoading:{
        position: 'absolute',
    },
    title: {
        color: componentColors.textPrimary,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: componentColors.textSecondary,
        fontSize: 16,
        textAlign: "center",
        width: "95%", 
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    cameraIconButton:{
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: componentColors.modalBackground,
        borderRadius: 25,
        padding: 8,
        borderWidth: 2,
        borderColor: '#1E1E1E',
    },
    textInput: {
        width: '80%',
        color: '#fff',
        borderColor: componentColors.inputBorder,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: 18,
        padding: 12,
        marginVertical: 12,
    },
    continueButton: {
        backgroundColor: componentColors.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 60
    },
});