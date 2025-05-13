import { createContext, ReactNode, useContext, useState } from "react";
import { darkTheme, lightTheme, Theme } from "../styles/themes";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

//um objeto que passa variaveis entre componentes sem a ultilizacao de props
export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined,
);

//componente pra passar as variáveis
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(lightTheme);
    const toggleTheme = () => {
        setTheme(theme === lightTheme ? darkTheme : lightTheme);
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
