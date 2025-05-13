export interface OnboardingPage {
    title: string;
    subtitle: string;
    icon: any;
    buttonText?: string;
}

export const pages: OnboardingPage[] = [
    {
        title: "Bem-vindo ao Goal Rush!",
        subtitle:
            "Descubra como alcançar seus objetivos de forma simples e eficiente.",
        icon: "flag-checkered",
    },
    {
        title: "Alcance suas metas com organização!",
        subtitle:
            "Gerencie metas individuais ou em grupo de forma simples e eficiente",
        icon: "calendar-check-o",
    },
    {
        title: "Suas metas, do seu jeito!",
        subtitle: "Crie e acompanhe metas pessoais com facilidade",
        icon: "user-circle-o",
    },
    {
        title: "Trabalhe em equipe!",
        subtitle: "Participe de grupos e alcance objetivos em conjunto",
        icon: "users",
    },
    {
        title: "Organize e acompanhe seu progresso!",
        subtitle: "Visualize o status de cada meta e acompanhe sua evolução",
        icon: "line-chart",
    },
    {
        title: "Vamos lá?",
        subtitle: "Toque no botão abaixo para começar sua jornada!",
        icon: "rocket",
        buttonText: "Começar agora",
    },
];
