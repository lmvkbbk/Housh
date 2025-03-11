import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase.js";

export function logIn(email, password){
    return createUserWithEmailAndPassword(auth, email, password)
    .then((UserCredential) => {
        const user = UserCredential.user;
        return verificationEmail(user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw error;
    });
}

export function sigIn(email,password){
    return signInWithEmailAndPassword(auth, email, password)
        .then((UserCredential)=>{
            const user = UserCredential.user;
            return user;
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            throw error;
    });
}

export function verificationEmail(user){
    return sendEmailVerification(user)
        .then(()=>{
            console.log("email de verificacao enviado: ", user.email);
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage); 
            throw error;
    });
}
  