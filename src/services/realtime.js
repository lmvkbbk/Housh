import { get, push, ref, set, update } from "firebase/database";
import { db } from "../database/firebase";
import { addGroupInUser } from "../services/userServices.js";

// cria um grupo no banco de dados
export async function createGroupDatabase(nameGroup, userUID) {
    try {
        const groupRef = push(ref(db, "goalGroups"));
        await set(groupRef, {
            name: nameGroup,
            createBy: userUID,
            createdAt: Date.now(),
            members: {
                [userUID]: true,
            },
        });
        console.log("Grupo Criado: ", groupRef.key);
        addGroupInUser(userUID, groupRef.key);
    } catch (error) {
        console.log("Error, Grupo n foi criado: ", error);
        throw error;
    }
}
