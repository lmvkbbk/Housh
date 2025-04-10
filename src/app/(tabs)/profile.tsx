import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Header } from '../../components/header';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import colors from '@/src/styles/colors';
import { auth } from '@/src/database/firebase';
import componentColors from '@/src/styles/componentColors';
import { router } from 'expo-router';

interface PerfilProps {
  userName?: string;
  userImage?: string;
  userPoints?: number;
  userGroups?: number;
  userGoals?: number;
}

const Perfil: React.FC<PerfilProps> = ({ 
  userName = auth.currentUser?.displayName || 'Usuário',
  userImage = auth.currentUser?.photoURL || null,
  userPoints = 0,
  userGroups = 0,
  userGoals = 0,
}) => {     
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.screen}>
      <Header title="Perfil" />

      <Modal 
        animationType="fade"
        transparent 
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.profileModalContainer}>
            {userImage ? (
              <Image source={{ uri: userImage.toString() + '?' + new Date() }} style={styles.profileImageLarge} />
            ) : (
              <Text style={styles.subtitle}>Foto de perfil ainda não escolhida</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <AntDesign name="close" size={30} color={componentColors.textPrimary} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.contentBox}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/editProfile')}>
            <MaterialCommunityIcons name="account-edit" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              {userImage ? (
                <Image source={{ uri: userImage }} style={styles.image} />
              ) : (
                <MaterialIcons name="account-circle" size={150} color="#ccc" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userName}</Text>

          <View style={styles.pointsContainer}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.pointsText}>{userPoints} pontos</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Ionicons name="flash" size={24} color="orange" />
            <Text style={styles.pointsText}>{userPoints} dias de sequência</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-done-circle" size={26} color="#4CAF50" />
              <Text style={styles.statNumber}>{userGoals}</Text>
              <Text style={styles.statLabel}>Metas</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="account-group" size={26} color="#2196F3" />
              <Text style={styles.statNumber}>{userGroups}</Text>
              <Text style={styles.statLabel}>Grupos</Text>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            <TouchableOpacity style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Conquistas</Text>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.achievementsList}>
              <TouchableOpacity style={styles.achievementsItem}>
                <AntDesign name='plus' size={22} color={colors.white}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.achievementsItem}>
                <AntDesign name='plus' size={22} color={colors.white}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.achievementsItem}>
                <AntDesign name='plus' size={22} color={colors.white}/>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: componentColors.background,
  },
  contentBox: {
    height: '87%',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: colors.grey2,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  profileModalContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 25,
  },
  profileImageLarge: {
    width: '80%',
    height: '100%',
    borderRadius: 25,
  },
  closeButton: {
    position: 'absolute',
    right: 50,
    top: 10,
    alignSelf: 'flex-end',
  },
  closeIcon: {
    paddingBottom: 10,
  },
  editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: colors.grey1,
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: colors.grey1,
    borderRadius: 80,
    padding: 5,
    borderWidth: 2,
    borderColor: componentColors.primary,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  pointsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.grey1,
    padding: 12,
    borderRadius: 15,
    width: '45%',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  achievementsContainer: {
    width: '100%',
    marginTop: 25,
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  achievementsItem: {
    backgroundColor: colors.grey1,
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: componentColors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    width: '95%',
  },
});

export default Perfil;
