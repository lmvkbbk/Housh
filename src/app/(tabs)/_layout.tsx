//Esse arquivo organiza o app na estrutura de abas.
import { Tabs } from 'expo-router';
import { colors } from '../styles/colors';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: colors.black
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.grey2,
        tabBarActiveBackgroundColor: colors.grey1,
        tabBarStyle:{
          backgroundColor: colors.black,
          borderTopColor: colors.grey1,
        },
      }}
    >
      <Tabs.Screen name="perfil"
      options={{
        tabBarIcon: ({color, size}) =>(<Feather name="user" size={size} color={color} />)
      }}
      />

      <Tabs.Screen name="index"
      options={{
        tabBarIcon: ({color, size}) =>(<Feather name="home" size={size} color={color} />)
      }}
      />

      <Tabs.Screen name="teams"
      options={{
        tabBarIcon: ({color, size}) =>(<FontAwesome name="group" size={size} color={color} />)
      }}
      />

      <Tabs.Screen name="settings"
      options={{
        tabBarIcon: ({color, size}) =>(<Ionicons name="settings" size={size} color={color} />)
      }}
      />
    </Tabs>
  )
}

// tabBarbadge em options (notificacao pronta)
//Por padrao eh exibida a primeira da lista(caso nenhuma chame index), o title eh o nome da aba, name o nome da pasta
// notifications, deep linking com notifications, fastlane olhar sobre dps
//esqueci