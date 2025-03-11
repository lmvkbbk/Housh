import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth , email, password} from "../src/database/firebase.js";
import { verificationEmail } from "./authServices.js";

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Usuário criado:", user.email);
    return verificationEmail(user);
  })
  .then(() => {
    console.log("Teste concluído com sucesso!");
  })
  .catch((error) => {
    console.error("Erro durante o teste:", error);
  });

// Testa ai o verificationEmail