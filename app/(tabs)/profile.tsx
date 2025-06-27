import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useQuestContext } from '@/contexts/QuestContext';

export default function ProfileScreen() {
  const { getCompletedQuestsCount, getTotalQuestsCount } = useQuestContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Mock user data - in a real app this would come from a user context or API
  const [user] = useState({
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    avatar: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=M',
    level: 5,
    experience: 1250,
    experienceToNextLevel: 2000,
    joinDate: '15. März 2024',
    totalPoints: 450
  });

  const completedQuests = getCompletedQuestsCount();
  const totalQuests = getTotalQuestsCount();
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  const experienceProgress = (user.experience / user.experienceToNextLevel) * 100;

  const handleEditProfile = () => {
    Alert.alert('Profil bearbeiten', 'Diese Funktion wird in einer zukünftigen Version verfügbar sein.');
  };

  const handleSettings = () => {
    Alert.alert('Einstellungen', 'Einstellungen werden in einer zukünftigen Version verfügbar sein.');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              defaultSource={require('@/assets/images/icon.png')}
            />
            <View style={[styles.levelBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.levelText}>{user.level}</Text>
            </View>
          </View>
          
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Profil bearbeiten</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.sectionTitle}>Statistiken</ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedQuests}</Text>
              <Text style={styles.statLabel}>Abgeschlossene Quests</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalQuests}</Text>
              <Text style={styles.statLabel}>Gesamte Quests</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Abschlussrate</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.totalPoints}</Text>
              <Text style={styles.statLabel}>Gesamtpunkte</Text>
            </View>
          </View>
        </View>

        {/* Experience Section */}
        <View style={styles.experienceSection}>
          <ThemedText style={styles.sectionTitle}>Erfahrung</ThemedText>
          
          <View style={styles.experienceBar}>
            <View style={styles.experienceInfo}>
              <Text style={styles.experienceText}>
                Level {user.level} • {user.experience}/{user.experienceToNextLevel} XP
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${experienceProgress}%`,
                    backgroundColor: colors.tint
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <ThemedText style={styles.sectionTitle}>Erfolge</ThemedText>
          
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.achievementText}>🏆</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Erste Schritte</Text>
                <Text style={styles.achievementDesc}>Schließe deine erste Quest ab</Text>
              </View>
              <View style={[styles.achievementStatus, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.achievementStatusText}>✓</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FF9800' }]}>
                <Text style={styles.achievementText}>🗺️</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Entdecker</Text>
                <Text style={styles.achievementDesc}>Schließe 5 Quests ab</Text>
              </View>
              <View style={[styles.achievementStatus, { backgroundColor: '#FF9800' }]}>
                <Text style={styles.achievementStatusText}>✓</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#9E9E9E' }]}>
                <Text style={styles.achievementText}>⭐</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Meister</Text>
                <Text style={styles.achievementDesc}>Schließe alle Quests ab</Text>
              </View>
              <View style={[styles.achievementStatus, { backgroundColor: '#9E9E9E' }]}>
                <Text style={styles.achievementStatusText}>?</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Einstellungen</ThemedText>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSettings}>
            <Text style={styles.settingText}>Benachrichtigungen</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSettings}>
            <Text style={styles.settingText}>Datenschutz</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSettings}>
            <Text style={styles.settingText}>Über Questify</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountText}>
            Mitglied seit: {user.joinDate}
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#4A90E2',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  experienceSection: {
    padding: 20,
  },
  experienceBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  experienceInfo: {
    marginBottom: 8,
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsSection: {
    padding: 20,
  },
  achievementsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementText: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  achievementStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsSection: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 18,
    color: '#666',
  },
  accountInfo: {
    padding: 20,
    alignItems: 'center',
  },
  accountText: {
    fontSize: 14,
    color: '#999',
  },
}); 