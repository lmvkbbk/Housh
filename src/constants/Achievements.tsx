export const ACHIEVEMENTS = {
    firstGoalCreated: {
        title: "Primeira Meta",
        description: "Crie sua primeira meta.",
        icon: "playlist-plus",
        iconLib: "MaterialCommunityIcons",
    },
    firstGoalCompleted: {
        title: "Primeira Conclusão",
        description: "Conclua sua primeira meta.",
        icon: "check-circle",
        iconLib: "Feather",
    },
    fiveGoalsCompleted: {
        title: "5 Metas Concluídas",
        description: "Conclua 5 metas.",
        icon: "star-outline",
        iconLib: "MaterialCommunityIcons",
    },
    thirtyDaysUsage: {
        title: "Usuário Dedicado",
        description: "faca uma sequencia de 30 dias.",
        icon: "calendar-check",
        iconLib: "MaterialCommunityIcons",
    },
    challengeCompleted: {
        title: "Desafio Vencido",
        description: "Conclua um desafio com prazo definido.",
        icon: "flag-checkered",
        iconLib: "FontAwesome",
    },
    fiveGroupGoalsCreated: {
        title: "Líder de Grupos",
        description: "Crie 5 metas em grupo.",
        icon: "account-group",
        iconLib: "MaterialCommunityIcons",
    },
    joinedGroup: {
        title: "Em Boa Companhia",
        description: "Participe de um grupo.",
        icon: "users",
        iconLib: "FontAwesome5",
    },
    groupGoalCompleted: {
        title: "Conquista Coletiva",
        description: "Conclua uma meta em grupo.",
        icon: "check-decagram",
        iconLib: "MaterialCommunityIcons",
    },
    veteranUser: {
        title: "Usuário Veterano",
        description: "Use o app por 6 meses.",
        icon: "medal",
        iconLib: "MaterialCommunityIcons",
    },
};
export type AchievementKey = keyof typeof ACHIEVEMENTS;
