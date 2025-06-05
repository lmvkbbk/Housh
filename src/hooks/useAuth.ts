import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Atualizando usuário");
            setUser(currentUser);
            setLoading(false);
            clearTimeout(timeOut);
        });

        const timeOut = setInterval(() => {
            setLoading(false);
            console.log("fim de tempo", loading);
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeOut);
        };
    }, []);
    return { user, loading };
}
