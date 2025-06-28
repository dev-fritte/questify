import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Animated } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useQuestContext } from '@/contexts/QuestContext';

export default function ProfileScreen() {
  const { 
    getCompletedUnlockedQuestsCount, 
    getTotalUnlockedQuestsCount,
    getTotalPoints,
    getCurrentLevel,
    getCurrentXP,
    getXPToNextLevel,
    hasNewAchievement,
    clearNewAchievementBadge,
    onAchievementUnlocked
  } = useQuestContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const scrollViewRef = useRef<ScrollView>(null);
  const achievementsSectionRef = useRef<View>(null);

  // Animation values for achievement icons
  const [achievementAnimations] = useState({
    first: new Animated.Value(1),
    five: new Animated.Value(1),
    all: new Animated.Value(1)
  });

  // Real user data calculated from quest completion
  const totalPoints = getTotalPoints();
  const currentLevel = getCurrentLevel();
  const currentXP = getCurrentXP();
  const xpToNextLevel = getXPToNextLevel();
  const completedQuests = getCompletedUnlockedQuestsCount();
  const totalQuests = getTotalUnlockedQuestsCount();
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  const experienceProgress = (currentXP / xpToNextLevel) * 100;

  // Achievement calculations
  const hasCompletedFirstQuest = completedQuests >= 1;
  const hasCompletedFiveQuests = completedQuests >= 5;
  const hasCompletedAllQuests = completedQuests === totalQuests && totalQuests > 0;

  // Set up achievement callback
  useEffect(() => {
    onAchievementUnlocked(() => {
      // Small delay to ensure the screen is fully loaded
      setTimeout(() => {
        scrollToAchievements();
      }, 100);
    });
  }, []);

  // Animate achievement icons when they change state
  useEffect(() => {
    if (hasCompletedFirstQuest) {
      animateAchievement('first');
    }
  }, [hasCompletedFirstQuest]);

  useEffect(() => {
    if (hasCompletedFiveQuests) {
      animateAchievement('five');
    }
  }, [hasCompletedFiveQuests]);

  useEffect(() => {
    if (hasCompletedAllQuests) {
      animateAchievement('all');
    }
  }, [hasCompletedAllQuests]);

  const animateAchievement = (achievementKey: 'first' | 'five' | 'all') => {
    const animation = achievementAnimations[achievementKey];
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const scrollToAchievements = () => {
    if (achievementsSectionRef.current && scrollViewRef.current) {
      achievementsSectionRef.current.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({
            y: y - 100, // Offset to show some content above
            animated: true,
          });
        },
        () => {
          // Fallback if measureLayout fails
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      );
    }
  };

  // Mock user data - in a real app this would come from a user context or API
  const [user] = useState({
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    avatar: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=M',
    joinDate: '15. März 2024',
  });

  const handleEditProfile = () => {
    Alert.alert('Profil bearbeiten', 'Diese Funktion wird in einer zukünftigen Version verfügbar sein.');
  };

  const handleSettings = () => {
    Alert.alert('Einstellungen', 'Einstellungen werden in einer zukünftigen Version verfügbar sein.');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={[styles.header, { 
          borderBottomColor: colors.borderColor 
        }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={[styles.avatar, { borderColor: colors.tint }]}
              defaultSource={require('@/assets/images/icon.png')}
            />
            <View style={[styles.levelBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.levelText}>{currentLevel}</Text>
            </View>
          </View>
          
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <Text style={[styles.userEmail, { color: colors.text }]}>{user.email}</Text>
          
          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.tint }]} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Profil bearbeiten</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.sectionTitle}>Statistiken</ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { 
              backgroundColor: colors.cardBackground, 
              shadowColor: colors.shadowColor,
              borderColor: colors.borderColor 
            }]}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>{completedQuests}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Abgeschlossene Quests</Text>
            </View>
            
            <View style={[styles.statCard, { 
              backgroundColor: colors.cardBackground, 
              shadowColor: colors.shadowColor,
              borderColor: colors.borderColor 
            }]}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>{totalQuests}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Gesamte Quests</Text>
            </View>
            
            <View style={[styles.statCard, { 
              backgroundColor: colors.cardBackground, 
              shadowColor: colors.shadowColor,
              borderColor: colors.borderColor 
            }]}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>{completionRate}%</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Abschlussrate</Text>
            </View>
            
            <View style={[styles.statCard, { 
              backgroundColor: colors.cardBackground, 
              shadowColor: colors.shadowColor,
              borderColor: colors.borderColor 
            }]}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>{totalPoints}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Gesamtpunkte</Text>
            </View>
          </View>
        </View>

        {/* Experience Section */}
        <View style={styles.experienceSection}>
          <ThemedText style={styles.sectionTitle}>Erfahrung</ThemedText>
          
          <View style={[styles.experienceBar, { 
            backgroundColor: colors.cardBackground, 
            shadowColor: colors.shadowColor,
            borderColor: colors.borderColor 
          }]}>
            <View style={styles.experienceInfo}>
              <Text style={[styles.experienceText, { color: colors.text }]}>
                Level {currentLevel} • {currentXP}/{xpToNextLevel} XP
              </Text>
            </View>
            <View style={[styles.progressBar, { 
              backgroundColor: colors.borderColor,
              borderColor: colors.shadowColor 
            }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${experienceProgress}%`,
                    backgroundColor: colors.successColor
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View ref={achievementsSectionRef} style={styles.achievementsSection}>
          <ThemedText style={styles.sectionTitle}>Erfolge</ThemedText>
          
          <View style={[styles.achievementsList, { 
            backgroundColor: colors.cardBackground, 
            shadowColor: colors.shadowColor,
            borderColor: colors.borderColor 
          }]}>
            <View style={styles.achievementItem}>
              <Animated.View 
                style={[
                  styles.achievementIcon, 
                  { 
                    backgroundColor: hasCompletedFirstQuest ? '#4CAF50' : '#9E9E9E',
                    transform: [{ scale: achievementAnimations.first }]
                  }
                ]}
              >
                <Text style={styles.achievementText}>🏆</Text>
              </Animated.View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Erste Schritte</Text>
                <Text style={styles.achievementDesc}>Schließe deine erste Quest ab</Text>
              </View>
              <View style={[styles.achievementStatus, { backgroundColor: hasCompletedFirstQuest ? '#4CAF50' : '#9E9E9E' }]}>
                <Text style={styles.achievementStatusText}>{hasCompletedFirstQuest ? '✓' : '?'}</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <Animated.View 
                style={[
                  styles.achievementIcon, 
                  { 
                    backgroundColor: hasCompletedFiveQuests ? '#FF9800' : '#9E9E9E',
                    transform: [{ scale: achievementAnimations.five }]
                  }
                ]}
              >
                <Text style={styles.achievementText}>🗺️</Text>
              </Animated.View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Entdecker</Text>
                <Text style={styles.achievementDesc}>Schließe 5 Quests ab</Text>
              </View>
              <View style={[styles.achievementStatus, { backgroundColor: hasCompletedFiveQuests ? '#FF9800' : '#9E9E9E' }]}>
                <Text style={styles.achievementStatusText}>{hasCompletedFiveQuests ? '✓' : '?'}</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <Animated.View 
                style={[
                  styles.achievementIcon, 
                  { 
                    backgroundColor: hasCompletedAllQuests ? '#4A90E2' : '#9E9E9E',
                    transform: [{ scale: achievementAnimations.all }]
                  }
                ]}
              >
                <Text style={styles.achievementText}>⭐</Text>
              </Animated.View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Meister</Text>
                <Text style={styles.achievementDesc}>Schließe alle Quests ab</Text>
              </View>
              <View style={[styles.achievementStatus, { backgroundColor: hasCompletedAllQuests ? '#4A90E2' : '#9E9E9E' }]}>
                <Text style={styles.achievementStatusText}>{hasCompletedAllQuests ? '✓' : '?'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Einstellungen</ThemedText>
          
          <TouchableOpacity style={[styles.settingItem, { 
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadowColor,
            borderColor: colors.borderColor 
          }]} onPress={handleSettings}>
            <Text style={[styles.settingText, { color: colors.text }]}>Benachrichtigungen</Text>
            <Text style={[styles.settingArrow, { color: colors.text }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { 
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadowColor,
            borderColor: colors.borderColor 
          }]} onPress={handleSettings}>
            <Text style={[styles.settingText, { color: colors.text }]}>Datenschutz</Text>
            <Text style={[styles.settingArrow, { color: colors.text }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { 
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadowColor,
            borderColor: colors.borderColor 
          }]} onPress={handleSettings}>
            <Text style={[styles.settingText, { color: colors.text }]}>Über Questify</Text>
            <Text style={[styles.settingArrow, { color: colors.text }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={[styles.accountText, { color: colors.text }]}>
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
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  experienceSection: {
    padding: 20,
  },
  experienceBar: {
    padding: 16,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  experienceInfo: {
    marginBottom: 8,
  },
  experienceText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsSection: {
    padding: 20,
  },
  achievementsList: {
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
    borderWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
  settingArrow: {
    fontSize: 18,
  },
  accountInfo: {
    padding: 20,
    alignItems: 'center',
  },
  accountText: {
    fontSize: 14,
  },
}); 