import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { darkTheme, lightTheme, Theme } from "../styles/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

//um objeto que passa variaveis entre componentes sem a ultilizacao de props
export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined,
);
const storageKey = "theme_App";

//componente pra passar as variáveis
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        const loadTheme = async () => {
            const saved = await AsyncStorage.getItem(storageKey);
            setTheme(saved === "dark" ? darkTheme : lightTheme);
        };
        loadTheme();
    }, []);

    const [theme, setTheme] = useState<Theme>(lightTheme);
    const toggleTheme = async () => {
        const newThemeType: ThemeType = theme === lightTheme ? "dark" : "light";
        await AsyncStorage.setItem(storageKey, newThemeType);

        const newTheme = newThemeType === "dark" ? darkTheme : lightTheme;
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

//pequeno hook pra garantir que o componente esteja dentro de ThemeProvider
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
