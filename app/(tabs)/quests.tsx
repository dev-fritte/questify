import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useQuestContext } from '@/contexts/QuestContext';

const QuestItem = ({ quest, onPress }: { quest: any; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Einfach': return '#4CAF50';
      case 'Mittel': return '#FF9800';
      case 'Schwer': return '#F44336';
      default: return '#666';
    }
  };

  const progressPercentage = quest.totalSteps > 0 ? (quest.progress / quest.totalSteps) * 100 : 0;

  return (
    <TouchableOpacity onPress={onPress} style={styles.questItem}>
      <ThemedView style={styles.questHeader}>
        <ThemedText style={styles.questTitle}>{quest.title}</ThemedText>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quest.difficulty) }]}>
          <Text style={styles.difficultyText}>{quest.difficulty}</Text>
        </View>
      </ThemedView>
      
      <ThemedText style={styles.questDescription}>{quest.description}</ThemedText>
      
      <View style={styles.questFooter}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: quest.completed ? '#4CAF50' : colors.tint
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {quest.progress}/{quest.totalSteps}
          </Text>
        </View>
        
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>🏆 {quest.reward}</Text>
        </View>
      </View>
      
      {quest.completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Abgeschlossen</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function QuestsScreen() {
  const { areas, getCompletedQuestsCount, getTotalQuestsCount } = useQuestContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Flatten all quests from all areas
  const allQuests = areas.flatMap(area => [
    { ...area.mainQuest, areaName: area.name, isMainQuest: true },
    ...area.questList.map(quest => ({ ...quest, areaName: area.name, isMainQuest: false }))
  ]);

  const handleQuestPress = (quest: any) => {
    if (quest.completed) {
      Alert.alert('Quest abgeschlossen', 'Diese Quest wurde bereits erfolgreich abgeschlossen!');
    } else {
      Alert.alert(
        quest.title,
        `Möchtest du diese Quest starten?\n\n${quest.description}\n\nBelohnung: ${quest.reward}`,
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Starten', onPress: () => {
            Alert.alert('Quest gestartet', 'Viel Erfolg bei deiner Quest!');
          }}
        ]
      );
    }
  };

  const completedQuests = getCompletedQuestsCount();
  const totalQuests = getTotalQuestsCount();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Quests</ThemedText>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {completedQuests}/{totalQuests} abgeschlossen
          </Text>
        </View>
      </View>

      <FlatList
        data={allQuests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestItem quest={item} onPress={() => handleQuestPress(item)} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
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
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
}); 