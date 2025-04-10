import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import componentColors from "../styles/componentColors";

const {width, height}= Dimensions.get("window");

interface OnboardingPage{
    title: string;
    subtitle: string;
    icon: any;
    buttonText?: string;
}

const pages: OnboardingPage[] = [
    {
        title: 'Bem-vindo ao Goal Rush!',
        subtitle: 'Descubra como alcançar seus objetivos de forma simples e eficiente.',
        icon: 'flag-checkered',
    },
    {
        title: 'Alcance suas metas com organização!',
        subtitle: 'Gerencie metas individuais ou em grupo de forma simples e eficiente',
        icon: 'calendar-check-o', 
    },
    {
        title: 'Suas metas, do seu jeito!',
        subtitle: 'Crie e acompanhe metas pessoais com facilidade',
        icon: 'user-circle-o',
    },
    {
        title: 'Trabalhe em equipe!',
        subtitle: 'Participe de grupos e alcance objetivos em conjunto',
        icon: 'users',
    },
    {
        title: 'Organize e acompanhe seu progresso!',
        subtitle: 'Visualize o status de cada meta e acompanhe sua evolução',
        icon: 'line-chart',
    },
    {
        title: 'Vamos lá?',
        subtitle: 'Toque no botão abaixo para começar sua jornada!',
        icon: 'rocket',
        buttonText: 'Começar agora',
    },
];

const PresentantionApp = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const FlatListRef = useRef<FlatList<OnboardingPage>>(null);
    const pageLength = pages.length - 1;
    
    const router = useRouter();
    
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
        const visibleIndex = viewableItems[0]?.index;
        if (visibleIndex !== undefined){
            setCurrentPage(visibleIndex);
        }
    });

    //vai receber todos os componentes na tela dentro do Flatlist onde é chamado
    //atribuindo o index da primeira "pagina" do nosso array pages

    const render = ({item} : {item: OnboardingPage}) => {
        return(
            <View style={styles.imageWrapper}>
                <View style={styles.slideContainer}>
                    <FontAwesome name={item.icon} size={100} color={componentColors.primary} style={styles.icon} />
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                    {item.buttonText &&(
                        <TouchableOpacity style={styles.primaryButton} onPress={ButtonFinish}>
                            <Text style={styles.primaryButtonText}>{item.buttonText}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );  // "molde" para as paginas do carrossel
    }

    const renderDots =()=>{
        return (
            <View style={styles.dotsWrapper}>
                {pages.map((_, index)=>( // pega o array pages de forma geral e gera uma View pra cada instancia no array
                    <View
                    key={index}
                        style ={[
                            styles.dot, 
                            currentPage === index? styles.activeDot:styles.inactiveDot]}
                    />
                ))}    
            </View>
        );
    }

    const buttonBack = () => {
        if (currentPage > 0) {
            FlatListRef.current?.scrollToIndex({ index: currentPage - 1, animated: true });
        }
    };
    
    const forwardButton = () => {
        if (currentPage < pageLength  ) {
            FlatListRef.current?.scrollToIndex({index: currentPage + 1, animated: true})
        }
    };

    const ButtonFinish = async() => {
        await AsyncStorage.setItem('onboardingSeen', 'true'); 
        router.push('/auth/sign-up');
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={ButtonFinish}>
                <Text style={styles.skipButtonText} >Pular</Text>
            </TouchableOpacity>
            <FlatList
                horizontal
                pagingEnabled
                data={pages}
                showsHorizontalScrollIndicator={false}
                renderItem={render}
                onViewableItemsChanged={onViewableItemsChanged.current}
                ref={FlatListRef}
            />
            <View style={styles.navigationContainer}>
                <TouchableOpacity 
                    style={[styles.prevButton, currentPage === 0 && {opacity: 0}]} 
                    onPress={buttonBack}
                    disabled={currentPage === 0}
                >
                    <AntDesign name="swapleft" size={24} color={componentColors.secondary} />
                </TouchableOpacity>
                
                {renderDots()}
                    <TouchableOpacity 
                        style={[styles.nextButton, currentPage === pageLength && {opacity: 0}]} 
                        onPress={forwardButton}
                        disabled={currentPage === pageLength }
                    >
                        <AntDesign name="swapright" size={24} color={componentColors.secondary}/>
                    </TouchableOpacity>
            </View>
        </View>
    );
}

export default PresentantionApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: componentColors.background,
    },
    imageWrapper: {
        width,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    slideContainer: {
        backgroundColor: componentColors.modalBackground,
        width: width * 0.95,
        height: height * 0.8,
        alignItems: 'center',
        justifyContent:'center',
        padding: 35,
        borderRadius: 35,
    },
    navigationContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: componentColors.primary,
        textAlign: 'center',
        margin: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: componentColors.textPrimary,
        textAlign: 'center',
        margin: 10,
    },
    primaryButton: {
        backgroundColor: componentColors.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    transparentButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    primaryButtonText: {
        color: componentColors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        alignSelf: 'flex-end',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 25,
        marginTop: 10,
        marginBottom: 20,
    },
    skipButtonText: {
        color: componentColors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
    prevButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: componentColors.primary,
        width: 12,
        height: 12,
    },
    inactiveDot: {
        backgroundColor: 'gray',
    },
    icon: {
        marginBottom: 20,
      },
});
