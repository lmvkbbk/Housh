import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
    getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { Platform } from "react-native";

const firebaseConfig = {
    //Chaves de api do firebase
};

const app = initializeApp(firebaseConfig);

/** @type {import('firebase/auth').Auth} */
let auth;

if (Platform.OS === "web") {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
}

const db = getDatabase(app);

export { app, auth, db };

//sem segredo, inicializacao da conexao com o FIREBASE pra ultilizacao em metodos
//pra testar conexao, so tirar o comentario da proxima linha
console.log(app ? "Conectado ao firebase" : " Sem Conexao");
console.log(auth ? "Conectado ao auth" : " Sem Conexao");
console.log(db ? "Conectado ao db" : " Sem Conexao");
