import { auth } from "@/src/database/firebase";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Image, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; 
import { router } from "expo-router";
import componentColors from "../../styles/componentColors";
import { Header } from "@/src/components/header";

export default function EditProfile(){
    const [name, setName] = useState(auth.currentUser?.displayName);
    const [imageProfile, setImageProfile] = useState<string | null>(null);
    const [message, setMessage]= useState('');
    const [isModalVisible, setIsModalVisible]= useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageExists, setImagExists] = useState(false);
    const localImagePath = FileSystem.documentDirectory+ "profile" + auth.currentUser?.uid+".jpg";

    useEffect(()=>{
        loadLocalImage();
    },[imageProfile]);

    const loadLocalImage = async() =>{
        const fileInfo = await FileSystem.getInfoAsync(localImagePath);
        if(fileInfo.exists){
            setImagExists(true);
            setImageProfile(localImagePath);
        }
    }; 

    const pickImage= async() =>{
        setLoadingImage(true);
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted") {
            Alert.alert(
                "Permissão Necessária",
                "Para continuar, é necessário conceder acesso à galeria. Por favor, autorize a permissão nas configurações do seu dispositivo.",
                [{ text: "OK", onPress: () => console.log("Alerta fechado") }]
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing:true,
            aspect:[1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            saveImageLocally(result.assets[0].uri);
        }else{
            setLoadingImage(false);
        }
    }

    const saveImageLocally = async(uri:string)=>{
        try {
            const fileInfo = await FileSystem.getInfoAsync(localImagePath);
            if (fileInfo.exists){
                await FileSystem.deleteAsync(localImagePath,{idempotent :true})
            }

            await FileSystem.copyAsync({
                from: uri,
                to: localImagePath
            });

            setImageProfile(localImagePath);
        } catch (error) {
            Alert.alert(
                "Erro ao Salvar",
                "Ocorreu um problema ao salvar a imagem. Por favor, tente novamente.",
                [{ text: "OK"}],
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
                    router.replace('/(tabs)/profile');
                } catch (error: any) {
                    console.log(error);
                    switch (error.code) {
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
    
    const previewPicture = () => {
        setIsModalVisible(true)
    }

    const closeButton =()=>{
        setIsModalVisible(false);
    }

    return(
        <SafeAreaView style={styles.screenContainer}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={componentColors.modalBackground}
            />
            <Header title="Editar Perfil"/>

            <Modal 
                        animationType="fade"
                        transparent 
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
             >
                <View  style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        { imageExists ? (
                            <Image source={{uri: imageProfile + '?' + new Date() }} style={styles.modalImage} />
                        ):(
                            <Text style={styles.subtitleText}>Foto de perfil ainda não escolhida</Text>
                        )}
                        <TouchableOpacity style={styles.modalCloseButton} onPress={closeButton}>
                            <AntDesign name="close" size={30} color={componentColors.textPrimary} style={styles.modalCloseIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.contentWrapper}>
                <View>
                    <TouchableOpacity style={styles.profileImageWrapper} onPress={previewPicture}>
                        {imageProfile ? (
                            <Image source={{uri: imageProfile + '?' + new Date()}}  style={styles.profileImage} />
                        ) : (
                            <MaterialIcons name="account-circle" size={200} color={componentColors.primary} />
                        )}
                        {loadingImage && (
                            <ActivityIndicator color="gray" size={35} style={styles.loadingOverlay}/>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                            <FontAwesome name="camera" size={30} color={componentColors.primary} />
                    </TouchableOpacity>
                </View> 
                
                <TextInput style={styles.textInput } 
                placeholder="Digite seu nome" 
                placeholderTextColor="#999"  
                autoCapitalize="none"
                value={name as any}
                onChangeText={setName}
                />

                <Text style={styles.subtitleText}>{message}</Text>

                <TouchableOpacity style={styles.saveButton} onPress={handleContinue}>
                    <FontAwesome name="check" size ={24} color={componentColors.textPrimary}/>
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: componentColors.background,
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: componentColors.background,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '100%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 25,
    },
    modalImage: {
        width: '80%',
        height: '100%',
        borderRadius: 25,
    },
    modalCloseButton: {
        position: 'absolute',
        right: 50,
        top: 10,
        alignSelf: 'flex-end',
    },
    modalCloseIcon: {
        paddingBottom: 10,
    },
    loadingOverlay: {
        position: 'absolute',
    },
    subtitleText: {
        color: componentColors.textSecondary,
        fontSize: 16,
        textAlign: "center",
    },
    profileImageWrapper: {
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
    cameraButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: componentColors.modalBackground,
        borderRadius: 25,
        padding: 8,
        borderWidth: 2,
        borderColor: '#1E1E1E',
    },
    textInput:{
      width: '90%',
      color: componentColors.textPrimary,
      borderWidth: 1.5,
      borderRadius: 10,
      borderColor: componentColors.inputBorder,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: componentColors.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 20,
    },
    saveButtonText: {
        color: componentColors.textPrimary,
        fontWeight: 'bold', 
        fontSize: 16,
    },
});
