// metodo que retorna um tempo em dias entre a data atual e uma data passada
export const getRelativeDateInfo = (date: Date) => {
    const today = new Date();
    const inputDate = new Date(date);

    // Remove horários para comparar apenas datas
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
        (inputDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < -1) {
        return {
            Text: `${Math.abs(diffDays)} dias atras`,
            Value: diffDays,
        }; // Devolve o número de dias
    } else if (diffDays > 1) {
        return {
            Text: `Faltam ${Math.abs(diffDays)} dias`,
            Value: Math.abs(diffDays),
        };
    } else if (diffDays === -1) {
        return { Text: "Ontem", Value: -1 };
    } else if (diffDays === 0) {
        return { Text: "Hoje", Value: 0 };
    } else if (diffDays === 1) {
        return { Text: "Amanhã", Value: 1 };
    }
};

// metodo que adiciona dias a uma data
export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
