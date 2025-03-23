import {getDatabase, push, ref, set } from "firebase/database";
import { signIn } from "./authServices.js";
import { email, password } from "../database/firebase.js";

const db = getDatabase();

export const createGroup = async(nameGroup, userUid) => {
    try {
        const groupRef = push(ref(db, "goalGroups"));
        await set(groupRef, {
            name: nameGroup,
            createBy: userUid,
        })
        console.log("Grupo Criado: ", groupRef.key);
    } catch (error) {
        console.log("Error, Grupo n foi criado: ", error);
        throw error;
    }
};