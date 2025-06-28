import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useQuestContext } from '@/contexts/QuestContext';
import { router } from 'expo-router';
import { QuestBottomSheet } from '@/components/QuestBottomSheet';
import { QuestSuccessAnimation } from '@/components/QuestSuccessAnimation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const QuestItem = ({ quest, onPress }: { quest: any; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  // Calculate progress percentage based on actual progress data
  const progressPercentage = quest.totalSteps > 0 ? (quest.progress / quest.totalSteps) * 100 : 0;
  
  // For single-step quests, show 1/1 when completed, 0/1 when not
  const displayProgress = quest.completed ? quest.totalSteps : quest.progress;
  const displayTotal = quest.totalSteps;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.questItem, { 
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadowColor,
      borderColor: colors.borderColor 
    }]}>
      <View style={styles.questHeader}>
        <Text style={[styles.questTitle, { color: colors.text }]}>{quest.title}</Text>
      </View>
      
      <ThemedText style={[styles.questDescription, { color: colors.text }]}>{quest.description}</ThemedText>
      
      <View style={styles.questFooter}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.borderColor }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: quest.completed ? colors.successColor : colors.tint
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {displayProgress}/{displayTotal}
          </Text>
        </View>
        
        <View style={styles.rewardContainer}>
          <Text style={[styles.rewardText, { color: colors.warningColor }]}>🏆 {quest.reward}</Text>
        </View>
      </View>
      
      {quest.completed && (
        <View style={[styles.completedBadge, { backgroundColor: colors.successColor }]}>
          <Text style={styles.completedText}>✓ Abgeschlossen</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function QuestsScreen() {
  const { areas, getCompletedUnlockedQuestsCount, getTotalUnlockedQuestsCount, setSelectedQuest, completeMainQuest, completeSubQuest } = useQuestContext();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<any>(null);
  const [solutionInput, setSolutionInput] = useState('');
  const [solutionError, setSolutionError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successQuestData, setSuccessQuestData] = useState<{ title: string; reward: string } | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  // Flatten all quests from unlocked areas only
  const unlockedQuests = areas
    .filter(area => area.unlocked) // Only include unlocked areas
    .flatMap(area => [
      { ...area.mainQuest, areaName: area.name, isMainQuest: true, areaId: area.id },
      ...area.questList.map(quest => ({ ...quest, areaName: area.name, isMainQuest: false, areaId: area.id }))
    ]);

  const handleQuestPress = (quest: any) => {
    if (quest.completed) {
      Alert.alert('Quest abgeschlossen', 'Diese Quest wurde bereits erfolgreich abgeschlossen!');
    } else {
      // Show quest details with solution word input
      setCurrentQuest(quest);
      setSolutionInput('');
      setSolutionError('');
      setBottomSheetVisible(true);
    }
  };

  const handleSolutionSubmit = () => {
    if (!currentQuest || !currentQuest.solutionWord) {
      Alert.alert('Fehler', 'Kein Lösungswort für diese Quest verfügbar.');
      return;
    }

    const userInput = solutionInput.trim().toLowerCase();
    const correctSolution = currentQuest.solutionWord.toLowerCase();

    if (userInput === correctSolution) {
      // Correct solution - complete the quest
      if (currentQuest.isMainQuest) {
        completeMainQuest(currentQuest.areaId);
        // Show success animation instead of alert
        setSuccessQuestData({
          title: currentQuest.title,
          reward: currentQuest.reward
        });
        setShowSuccessAnimation(true);
      } else {
        completeSubQuest(currentQuest.areaId, currentQuest.id);
        // Show success animation instead of alert
        setSuccessQuestData({
          title: currentQuest.title,
          reward: currentQuest.reward
        });
        setShowSuccessAnimation(true);
      }
      setBottomSheetVisible(false);
      setCurrentQuest(null);
      setSolutionInput('');
    } else {
      // Wrong solution
      setSolutionError('Falsches Lösungswort. Versuche es nochmal!');
    }
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);
    setSuccessQuestData(null);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
    setCurrentQuest(null);
    setSolutionInput('');
    setSolutionError('');
  };

  const handleStartQuest = () => {
    // Set the selected quest and navigate to map
    setSelectedQuest(currentQuest);
    setBottomSheetVisible(false);
    setCurrentQuest(null);
    setSolutionInput('');
    setSolutionError('');
    router.push('/(tabs)/map');
  };

  const completedQuests = getCompletedUnlockedQuestsCount();
  const totalQuests = getTotalUnlockedQuestsCount();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { 
          backgroundColor: colors.navigationBackground,
          borderBottomColor: colors.borderColor 
        }]}>
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, { color: colors.text }]}>
              {completedQuests}/{totalQuests} abgeschlossen
            </Text>
          </View>
        </View>

        {unlockedQuests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              🔒 Keine Quests verfügbar
            </Text>
            <Text style={styles.emptySubtext}>
              Schalte zuerst eine Area auf der Karte frei!
            </Text>
          </View>
        ) : (
          <FlatList
            data={unlockedQuests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <QuestItem quest={item} onPress={() => handleQuestPress(item)} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Quest Bottom Sheet */}
        <QuestBottomSheet
          isVisible={bottomSheetVisible}
          onClose={handleBottomSheetClose}
          quest={currentQuest}
          area={null}
          solutionInput={solutionInput}
          onSolutionInputChange={setSolutionInput}
          onSolutionSubmit={handleSolutionSubmit}
          onStartQuest={handleStartQuest}
          solutionError={solutionError}
          showSolutionInput={false}
          showCancelButton={false}
        />

        {/* Success Animation */}
        {showSuccessAnimation && successQuestData && (
          <QuestSuccessAnimation
            isVisible={showSuccessAnimation}
            onAnimationComplete={handleSuccessAnimationComplete}
            questTitle={successQuestData.title}
            reward={successQuestData.reward}
          />
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  questItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#000000',
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  rewardContainer: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
}); 