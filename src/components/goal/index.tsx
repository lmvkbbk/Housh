import { View, Text} from 'react-native'
import React from 'react'
import { colors } from '@/app/styles/colors'
import { s } from './styles';

type GoalProps = {
    name: string;
    description?: string;
    timeRemaining?: string;
    color: string;
    teamgoal?: boolean;
};

const Goal: React.FC<GoalProps> = ({ name, description, timeRemaining, color }) => {
    return (
      <View style={[s.container, { backgroundColor: color }]}>
        <Text style={s.name}>{name}</Text>
        {description && <Text style={s.description}>{description}</Text>}
        <View style={{backgroundColor: colors.black}}>
          {timeRemaining && <Text style={s.timeRemaining}>{timeRemaining}</Text>}
        </View>
      </View>
    );
  };

export default Goal;