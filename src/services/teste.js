import { email, password } from "../database/firebase";
import { delUser, logIn, resetPassword, signIn } from "./authServices";

//testes !!!, so retirar os comentarios
//lembrar de mudar o  email e a senha d teste no src\database\firebase.js

//logIn(email,password);
//signIn(email, password);
//resetPassword(email);

//pra testar a ultima funcao usa esse modelo

/*
signIn(email, password)
  .then((User)=>{
    delUser(User);
  })
  .catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("ERRO: ", errorCode, errorMessage);
  })
*/