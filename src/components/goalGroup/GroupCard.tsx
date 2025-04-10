import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

interface GroupProps {
  id: string;
  name: string;
  membersCount: number;
  leaderName?: string;
  color: string;
}

const GroupCard: React.FC<GroupProps> = ({ id, name, membersCount, leaderName, color }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color }]} >
      
      <View style={styles.headerRow}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.membersRow}>
          <FontAwesome5 name="users" size={14} color="#f0f0f0" style={styles.icon} />
          <Text style={styles.infoText}>{membersCount} membro{membersCount > 1 ? 's' : ''}</Text>
        </View>
      </View>

      {leaderName && (
        <View style={styles.leaderRow}>
          <FontAwesome5 name="crown" size={14} color="#FFD700" style={styles.icon} />
          <Text style={styles.leaderText}>Líder: {leaderName}</Text>
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
    shadowRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 15,
    color: '#f5f5f5',
  },
  leaderText: {
    fontSize: 14,
    color: '#e0e0e0',
  },
});

export default GroupCard;
