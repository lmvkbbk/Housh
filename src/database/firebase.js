import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCZU6myY_MkuvjcWQaq-kZ-ID84ZZZmmYU",
  authDomain: "goal-rush-1947d.firebaseapp.com",
  databaseURL: "https://goal-rush-1947d-default-rtdb.firebaseio.com",
  projectId: "goal-rush-1947d",
  storageBucket: "goal-rush-1947d.firebasestorage.app",
  messagingSenderId: "592969987743",
  appId: "1:592969987743:web:9024768744ace609d414aa",
  measurementId: "G-J1CQ7Q4VW7"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getDatabase(app);

export {app, auth, db};

//sem segredo, inicializacao da conexao com o FIREBASE pra ultilizacao em metodos
//pra testar conexao, so tirar o comentario da proxima linha
console.log(app? "Conectado ao firebase":" Sem Conexao");