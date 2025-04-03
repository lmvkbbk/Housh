import { 
    createUserWithEmailAndPassword, 
    deleteUser, 
    fetchSignInMethodsForEmail, 
    getAuth, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { auth } from "../database/firebase.js";

export function logIn(email, password){
    return createUserWithEmailAndPassword(auth, email, password)
    .then((UserCredential) => {
        console.log("Usuario adicionado: ", UserCredential.user.email);
        return emailVerification(UserCredential.user);
    })
    .catch((error) => {
        const errorCode = error.code;
        console.log( errorCode);
        throw errorCode;
    });
}

//add um 'user' no base de usuarios do firebase
//coloquei pra que no momento em que o usuario criasse sua conta 
//ele recebesse o modelo de email de verificacao do firebase

export function signIn(email,password){
    return signInWithEmailAndPassword(auth,email, password)
        .then((UserCredential)=>{
            console.log("Usuário autenticado:", UserCredential.user.emailVerified);
            return UserCredential.user;
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            throw errorCode;
    });
}

//essa funcao ela retorna um objeto user pro acesso a conta
//por enquanto nessa fase de teste n da pra fazer mtt coisa, mas ta funcional

export function emailVerification(user){
    return sendEmailVerification(user)
        .then(()=>{
            console.log("email de verificacao enviado: ", user.email);
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Ocorreu algum erro no envio do email de verificacao: ", errorCode, errorMessage);
            throw error;
    });
}
//cada usuario da base de users da firebase possui uma variavel pra verificacao da conta
//o email enviado pela funcao sendEmailVerification() tem um link, que dx esssaa variavel true

export function resetPassword(email){
    return sendPasswordResetEmail(auth, email)
        .then(()=>{
            console.log("email para redefinicao de senha enviado!");
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("houve algum erro para enviar o email de redefinicao de senha");
            throw errorCode;
        })
}

//mesma coisa da emailVerification() so que o modelo do email eh diferente
//e o link no email, possibilita a troca de senha
  
export function delUser(user){
    if (!user) {
        throw new Error("Nenhum usuário autenticado.");
    }
    return deleteUser(user)
        .then(()=>{
            console.log("Usuário deletado com sucesso.");
        })
        .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Erro ao deletar usuário:", errorCode);
        console.log(errorMessage);
        throw error;
    });
}

//deleta usuario da base de users da firebase

export function logOut(){
    signOut(auth)
        .then(()=>{
            console.log('Usuario desconectado');
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Erro ao desconectar usuário:", errorCode);
            console.log(errorMessage);
            throw errorCode;
        })
}

//desconecta usuario da conta