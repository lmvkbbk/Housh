import { 
    createUserWithEmailAndPassword, 
    deleteUser, 
    EmailAuthProvider, 
    reauthenticateWithCredential, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
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
        console.log('error ao adicionar Usuario: ', errorCode);
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
            console.log('error ao adicionar o Usuario',errorCode);
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
            console.log("Ocorreu algum erro no envio do email de verificacao: ", errorCode);
            throw error;
    });
}
//cada usuario da base de users da firebase possui uma variavel pra verificacao da conta
//o email enviado pela funcao sendEmailVerification() tem um link, que dx esssaa variavel true

export async function emailUpdate(user, email){
    try {
        console.log('Tentando atualizar email para:', email);
        console.log('Usuário atual:', user?.email);
        await updateEmail(user, email);
        console.log('email atualizado para: ', email);
    } catch (error) {
        const errorCode = error.code;
        console.log(error.message);
        throw errorCode;
    }
}

export async function updateUserPassword(password){
    try {
        await updatePassword(auth.currentUser, password);
        console.log('Sua senha foi alterada!');
    } catch (error) {
        const errorCode = error.code;
        console.log('Erro ao tentar alterar sua senha: '+ errorCode + error.message);
        throw errorCode;
    }
}

export function resetPassword(email){
    return sendPasswordResetEmail(auth, email)
        .then(()=>{
            console.log("email para redefinicao de senha enviado!");
        })
        .catch((error)=>{
            const errorCode = error.code;
            console.log("houve algum erro para enviar o email de redefinicao de senha: "+ errorCode);
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
        console.log("Erro ao deletar usuário:", errorCode);
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
            console.log("Erro ao desconectar usuário:", errorCode);
            throw errorCode;
        })
}

//desconecta usuario da conta

export async function reauthenticate(email, password, user) {
    try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        console.log('reautenticação efeituada');
    } catch (error) {
        const errorCode = error.code;
        console.log(errorCode);
        throw errorCode;
    }
}

//reautenticacao do usuario, para novo email e nova senha 