import { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
    OnboardingPage,
    pages,
} from "../components/OnboardingPresentation/OnboardingData";
import { useTheme } from "../context/contextTheme";
import OnboardingSlide from "../components/OnboardingPresentation/OnboardingSlide";
import OnboardingNavigation from "../components/OnboardingPresentation/OnboardingNavigation";

const { width, height } = Dimensions.get("window");

const PresentantionApp = () => {
    const router = useRouter();
    const { theme } = useTheme();

    const [currentPage, setCurrentPage] = useState(0);
    const FlatListRef = useRef<FlatList<OnboardingPage>>(null);
    const pageLength = pages.length - 1;

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: any[] }) => {
            const visibleIndex = viewableItems[0]?.index;
            if (visibleIndex !== undefined) {
                setCurrentPage(visibleIndex);
            }
        },
    );

    const buttonBack = () => {
        if (currentPage > 0) {
            FlatListRef.current?.scrollToIndex({
                index: currentPage - 1,
                animated: true,
            });
        }
    };

    const forwardButton = () => {
        if (currentPage < pageLength) {
            FlatListRef.current?.scrollToIndex({
                index: currentPage + 1,
                animated: true,
            });
        }
    };

    const ButtonFinish = async () => {
        await AsyncStorage.setItem("onboardingSeen", "true");
        router.push("/auth/sign-up");
    };

    return (
        <View style={styles(theme).container}>
            <TouchableOpacity
                style={styles(theme).skipButton}
                onPress={ButtonFinish}
            >
                <Text style={styles(theme).skipButtonText}>Pular</Text>
            </TouchableOpacity>
            <FlatList
                horizontal
                pagingEnabled
                data={pages}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <OnboardingSlide item={item} onFinish={ButtonFinish} />
                )}
                onViewableItemsChanged={onViewableItemsChanged.current}
                ref={FlatListRef}
            />
            <OnboardingNavigation
                currentPage={currentPage}
                totalPages={pages.length}
                onBack={buttonBack}
                onNext={forwardButton}
            />
        </View>
    );
};

export default PresentantionApp;

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.modalBackground,
        },
        skipButton: {
            alignSelf: "flex-end",
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 25,
            marginTop: 10,
            marginBottom: 20,
        },
        skipButtonText: {
            color: theme.primary,
            fontSize: 15,
            fontWeight: "bold",
        },
    });
