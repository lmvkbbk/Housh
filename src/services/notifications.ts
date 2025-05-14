import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';


//  config da notificacao
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
    let token: string | undefined;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Permissao para notificações não foi concedida!');
            return;
        }

        const pushToken = await Notifications.getExpoPushTokenAsync();
        token = pushToken.data;
        console.log('Token de notificação:', token); 
    } else {
        alert('Este recurso não está disponível em um emulador. Use um dispositivo físico para testar.');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
        });
    }

    return token;
}

//listen de notificações recebidas
export function listenNotificationsReceived(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
}

//listen de notificacoes clicadas
export function listenNotificationsResponse(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

//cancelar notificações
export async function cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// agendar notificações locais
export async function scheduleLocalNotification(title: string, body: string, secondsFromNow: number) {
  try {

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type : 'timeInterval',
        seconds: secondsFromNow,
        repeats: false,
      },
    });
    console.log("Notificação agendada com sucesso!");
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
  }
}