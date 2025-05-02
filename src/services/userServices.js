import { get, push, ref, set, update } from "firebase/database";
import { db } from "../database/firebase";

//cria um usuario no banco de dados
export async function creatUserDatabase(userUID) {
    try {
        const userRef = ref(db, `Users/${userUID}`);
        await set(userRef, {
            Points: 0,
            GoalsPoints: 0,
            TeamsNumber: 0,
            DaysInSequence: 0,
        });
    } catch (error) {
        console.log("Error, usuario nao registrado", error);
        throw error;
    }
}

//retorna dados do usuario
export const getUserData = async (userUID) => {
    const userRef = ref(db, `Users/${userUID}`);
    const dataUser = await get(userRef);
    return dataUser ? Object.keys(dataUser.val()) : null;
};

//retorna grupos de um usuario, com todos os dados
export const getUserGroups = async (userUID) => {
    const userRef = ref(db, `Users/${userUID}/Groups`);
    const groups = await get(userRef);
    return groups.exists() ? Object.keys(groups.val()) : null;
};

//retorna metas de um usuario, com todos os dados
export const getUserGoals = async (userUID) => {
    const userRef = ref(db, `Users/${userUID}/Goals`);
    const goals = await get(userRef);
    return goals.exists() ? goals.val() : null;
};

//salva key do grupo dentro do usuario
export async function addGroupInUser(userUID, groupKey) {
    try {
        const userRef = ref(db, `Users/${userUID}/Groups`);
        await update(userRef, {
            [groupKey]: true,
        });
    } catch (error) {
        console.log(
            "Nao foi possivel adicionar grupo na base de dados do Usuario",
            error,
        );
        throw error;
    }
}

//guarda a meta do usuario no db, pra evitar perda de metas de desinstalacao acindetal
export async function addGoalInUser(userUid, goalData) {
    try {
        const userRef = ref(db, `Users/${userUid}/Goals`);
        const goalName = goalData.name;

        if (goalData.timeRemaining === undefined) {
            goalData.timeRemaining = null;
        }

        await update(userRef, {
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
/*  exemplo de uso da funcao
    await addGoalInUser('uid123', {
        name: 'Estudar React Native',
        description: 'Completar curso de RN',
        time: '3 dias',
        status: 'pendente',
    });
*/

//adiciona uma quantidade de pontos ao usuario
export async function updateUserPoints(userUID, pointsIncrease) {
    try {
        const userRef = ref(db, `Users/${userUID}`);
        await update(userRef, { Points: pointsIncrease });
    } catch (error) {
        console.log("Error ao atualizar os pontos do usuario");
        throw error;
    }
}

// adiciona +1 nas metas Completas do usuario
export async function updateUserGoalPoints(userUID) {
    try {
        const userRef = ref(db, `Users/${userUID}`);
        const userData = await get(userRef);
        const currentGoalsPoints = userData.val()?.GoalsPoints || 0;
        const goalsPointsIncrese = currentGoalsPoints++;
        await update(userRef, { GoalsPoints: goalsPointsIncrese });
    } catch (error) {
        console.log("Error ao atualizar os pontos de metas do usuario", error);
        throw error;
    }
}

//atualiza o numero de times participantes do usuario, provisorio por enquanto
export async function updateUserTeamsNumber(userUID) {
    try {
        const userRef = ref(db, `Users/${userUID}`);
        const userData = await get(userRef);
        const currentTeamsNumber = userData.val()?.TeamsNumber || 0;
        const teamsNumberIncrease = currentTeamsNumber++;
        await update(userRef, { TeamsNumber: teamsNumberIncrease });
    } catch (error) {
        console.log(
            "Error ao atualizar o numero de times participantes do usuario",
            error,
        );
        throw error;
    }
}

// adiociona +1 na sequencia de dias do usuario
export async function updateUserDaysSequency(userUID) {
    try {
        const userRef = ref(db, `Users/${userUID}`);
        const userData = await get(userRef);
        const currentDays = userData.val()?.DaysInSequence || 0;
        const daysInSequenceIncrease = currentDays++;
        await update(userRef, { DaysInSequence: daysInSequenceIncrease });
    } catch (error) {
        console.log("Erro ao atualizar a sequencia de dias do usuario", error);
        throw error;
    }
}
