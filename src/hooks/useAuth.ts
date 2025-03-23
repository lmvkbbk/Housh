import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuth(){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Atualizando usuário:", currentUser);
            setUser(currentUser);
            setLoading(false);
            console.log(auth.currentUser);
            clearTimeout(timeOut);
        });

        const timeOut = setInterval(()=>{
            setLoading(false);
            console.log('fim de tempo', loading);
        },3000);

        return() => {
            unsubscribe();
            clearTimeout(timeOut);
        }
    }, []);
    return{user, loading};
}