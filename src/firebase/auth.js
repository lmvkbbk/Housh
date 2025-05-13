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
import { auth } from "./config";

export async function logIn(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        console.log("Usuario adicionado: ", userCredential.user.email);
        await emailVerification(userCredential.user);
        return userCredential.user;
    } catch (error) {
        const errorCode = error.code;
        console.log("error ao adicionar Usuario: ", errorCode);
        throw errorCode;
    }
}

//add um 'user' no base de usuarios do firebase
//coloquei pra que no momento em que o usuario criasse sua conta
//ele recebesse o modelo de email de verificacao do firebase

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        console.log("Usuário autenticado:", userCredential.user.emailVerified);
        return userCredential.user;
    } catch (error) {
        console.log("Erro ao autenticar o usuário:", error.code);
        throw error.code;
    }
}

//essa funcao ela retorna um objeto user pro acesso a conta
//por enquanto nessa fase de teste n da pra fazer mtt coisa, mas ta funcional

export async function emailVerification(user) {
    try {
        await sendEmailVerification(user);
        console.log("E-mail de verificação enviado para:", user.email);
    } catch (error) {
        console.log("Erro ao enviar e-mail de verificação:", error.code);
        throw error.code;
    }
}
//cada usuario da base de users da firebase possui uma variavel pra verificacao da conta
//o email enviado pela funcao sendEmailVerification() tem um link, que dx esssaa variavel true

export async function emailUpdate(user, email) {
    try {
        console.log("Tentando atualizar e-mail para:", email);
        await updateEmail(user, email);
        console.log("E-mail atualizado para:", email);
    } catch (error) {
        console.log("Erro ao atualizar o e-mail:", error.code);
        throw error.code;
    }
}

export async function updateUserPassword(password) {
    try {
        await updatePassword(auth.currentUser, password);
        console.log("Senha alterada com sucesso!");
    } catch (error) {
        console.log("Erro ao alterar a senha:", error.code, error.message);
        throw error.code;
    }
}

//mesma coisa da emailVerification() so que o modelo do email eh diferente
//e o link no email, possibilita a troca de senha
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("E-mail de redefinição de senha enviado!");
    } catch (error) {
        console.log("Erro ao enviar e-mail de redefinição:", error.code);
        throw error.code;
    }
}

export async function delUser(user) {
    try {
        if (!user) throw new Error("Nenhum usuário autenticado.");
        await deleteUser(user);
        console.log("Usuário deletado com sucesso.");
    } catch (error) {
        console.log("Erro ao deletar usuário:", error.message);
        throw error.message;
    }
}

//deleta usuario da base de users da firebase
export async function logOut() {
    try {
        await signOut(auth);
        console.log("Usuário desconectado.");
    } catch (error) {
        console.log("Erro ao desconectar usuário:", error.code);
        throw error.code;
    }
}

//desconecta usuario da conta
export async function reauthenticate(email, password, user) {
    try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        console.log("reautenticação efeituada");
    } catch (error) {
        const errorCode = error.code;
        console.log("Erro ao reautenticar:", error.code);
        throw errorCode;
    }
}

//reautenticacao do usuario, para novo email e nova senha
