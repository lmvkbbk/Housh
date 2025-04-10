import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

interface GoalProps {
  id: number;
  name: string;
  description?: string;
  timeRemaining?: string;
  color: string;
}

const Goal: React.FC<GoalProps> = ({ id, name, description, timeRemaining, color }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.title}>{name}</Text>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {timeRemaining && (
        <View style={styles.timeContainer}>
          <FontAwesome5 name="hourglass-half" size={16} color="#ddd" style={styles.icon} />
          <Text style={styles.timeText}>{timeRemaining}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#f5f5f5',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  timeText: {
    fontSize: 13,
    color: '#e0e0e0',
  },
});

export default Goal;
