import { View, Text } from 'react-native'
import { s } from './styles'

//string que o componente vai pedir na criacao
type HeaderProps = {
    title:string;
}

export function Header({title}: HeaderProps) {
    return <View style={s.container}>
        <Text style={s.text}>{title}</Text>
    </View>
}