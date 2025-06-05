import { get, ref, set, update, remove } from "firebase/database";
import { db } from "@/src/firebase/config";
import {
    addGroupInUser,
    removeUserFromGroup,
} from "@/src/services/userServices";

// Cria um grupo no banco de dados
export async function createGroupDatabase(dataGroup, userUID) {
    if (!dataGroup || !dataGroup.codeGroup) {
        throw new Error("Dados do grupo inválidos: 'codeGroup' é obrigatório.");
    }
    if (!userUID) {
        throw new Error("UID do usuário é obrigatório.");
    }

    try {
        const groupCode = dataGroup.codeGroup;
        const groupRef = ref(db, `goalGroups/${groupCode}`);

        await set(groupRef, dataGroup);
        await addGroupInUser(userUID, groupRef.key);
    } catch (error) {
        console.error("Erro ao criar grupo no banco de dados:", error);
        throw new Error(
            "Não foi possível criar o grupo. Tente novamente mais tarde.",
        );
    }
}

// Adiciona um usuário a um grupo existente
export async function addUserInGroup(userUID, codeGroup) {
    if (!userUID || !codeGroup) {
        throw new Error("UID do usuário e código do grupo são obrigatórios.");
    }

    try {
        const groupRef = ref(db, `goalGroups/${codeGroup}/members`);
        await update(groupRef, {
            [userUID]: true,
        });
    } catch (error) {
        console.error("Erro ao adicionar usuário ao grupo:", error);
        throw new Error("Não foi possível adicionar o usuário ao grupo.");
    }
}

export async function removeGroupFromUser(userUID, groupCode) {
    try {
        const groupRef = ref(db, `Users/${userUID}/Groups/${groupCode}`);
        await remove(groupRef);
        console.log(`Grupo ${groupCode} removido do usuário ${userUID}`);
    } catch (error) {
        console.error("Erro ao remover grupo do usuário:", error);
    }
}

export async function leaveGroup(userUID, code) {
    await Promise.all([
        removeUserFromGroup(userUID, code),
        removeGroupFromUser(userUID, code),
    ]);
}

// Busca dados de um grupo pelo código
export async function getGroup(code) {
    if (!code) {
        throw new Error("Código do grupo é obrigatório.");
    }

    try {
        const groupRef = ref(db, `goalGroups/${code}`);
        const snapshot = await get(groupRef);

        if (!snapshot.exists()) {
            return null;
        }

        return snapshot.val();
    } catch (error) {
        console.error("Erro ao buscar grupo:", error);
        throw new Error(
            "Erro ao buscar grupo. Verifique sua conexão ou tente novamente.",
        );
    }
}

export async function promoveUserInGroup(userUID, codeGroup) {
    try {
        const userRef = ref(db, `goalGroups/${codeGroup}/viceLeaders`);
        await set(userRef, {
            [userUID]: true,
        });
    } catch (error) {
        console.log("Erro ao colocar vice-líder em db:", error);
        throw error;
    }
}
export async function demoteUserInGroup(userUID, codeGroup) {
    try {
        const groupRef = ref(db, `goalGroups/${codeGroup}/viceLeaders`);
        await update(groupRef, {
            [userUID]: null,
        });
    } catch (error) {
        console.log("Erro ao remover vice-líder:", error);
        throw error;
    }
}

export async function renameGroupName(newNameGroup, codeGroup) {
    try {
        const groupRef = ref(db, `goalGroups/${codeGroup}`);
        await update(groupRef, {
            name: newNameGroup,
        });
        console.log("nome atualizado com sucesso!");
    } catch (error) {
        console.log("Erro ao atualizar o nome do grupo:", error);
    }
}

export async function updateGoalInGroup(codeGroup, goalData) {
    try {
        const groupRef = ref(
            db,
            `goalGroups/${codeGroup}/Goals/${goalData.id}`,
        );

        if (goalData.description === undefined) {
            goalData.description = null;
        }

        await update(groupRef, goalData);
    } catch (error) {
        console.log(
            "Nao foi possivel adicionar metas ao banco de dados",
            error,
        );
        throw error;
    }
}

export async function addGoalInGroup(codeGroup, goalData) {
    try {
        const groupRef = ref(db, `goalGroups/${codeGroup}/Goals`);
        const goalName = goalData.id;

        if (goalData.description === undefined) {
            goalData.description = null;
        }

        await update(groupRef, {
            [goalName]: goalData,
        });
    } catch (error) {
        console.log(
            "Nao foi possivel adicionar metas ao banco de dados",
            error,
        );
        throw error;
    }
}

export const getGoalInGroup = async (codeGroup) => {
    const userRef = ref(db, `goalGroups/${codeGroup}/Goals`);
    const goalsSnapshot = await get(userRef);

    if (!goalsSnapshot.exists()) return [];

    const goalsData = goalsSnapshot.val();

    // Converte o objeto para array
    const goalsArray = Object.values(goalsData);

    return goalsArray;
};

export async function updateStatusGoalInGroup(codeGroup, goalId, newStatus) {
    try {
        const goalRef = ref(db, `goalGroups/${codeGroup}/Goals/${goalId}`);

        await update(goalRef, { status: newStatus });
    } catch (error) {
        console.log("Erro ao atualizar o status da meta:", error);
    }
}

export async function updateUserGoalInGroup(codeGroup, goalId, newUser) {
    try {
        const goalRef = ref(db, `goalGroups/${codeGroup}/Goals/${goalId}`);

        await update(goalRef, { user: newUser });

        console.log("user atualizado com sucesso!");
    } catch (error) {
        console.log("Erro ao atualizar o user da meta:", error);
    }
}

export async function removeGoalInGroup(codeGroup, goalId) {
    try {
        const goalRef = ref(db, `goalGroups/${codeGroup}/Goals/${goalId}`);
        await remove(goalRef);
        console.log("Meta removida com sucesso");
    } catch (error) {
        console.error("Erro ao remover meta:", error);
    }
}

export async function deleteGroup(groupId, groupMembers) {
    try {
        const goalRef = ref(db, `goalGroups/${groupId}`);
        await Promise.all(
            Object.keys(groupMembers).map(async (memberUid) => {
                await removeGroupFromUser(memberUid, groupId);
                console.log(`removeu grupo do usuário ${memberUid}`);
            }),
        );
        await remove(goalRef);
        console.log("Grupo Deletado");
    } catch (error) {
        console.log("Erro ao deletar grupo:", error);
    }
}
