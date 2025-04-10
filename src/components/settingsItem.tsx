import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';// ou defina o seu próprio
import colors from '../styles/colors';

interface Props {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
  color?: string;
}

export default function SettingsItem({ icon, title, onPress, color}: Props) {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconTitle}>
        <MaterialIcons name={icon} size={24} color={color? color: colors.white } />
        <Text style={{
            color: color? color: colors.white,
            fontSize: 16,
            marginLeft: 10,
        }}
        >{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={color? color: colors.white }  />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
