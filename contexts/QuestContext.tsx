import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { questAreas } from '@/data/questAreas';
import mockData from '@/data/mockData.json';
import { QuestArea } from '@/types/QuestArea';

interface QuestContextType {
  areas: QuestArea[];
  selectedQuest: any | null;
  updateArea: (areaId: string, updates: Partial<QuestArea>) => void;
  completeMainQuest: (areaId: string) => void;
  completeSubQuest: (areaId: string, questId: string) => void;
  getCompletedQuestsCount: () => number;
  getTotalQuestsCount: () => number;
  getCompletedUnlockedQuestsCount: () => number;
  getTotalUnlockedQuestsCount: () => number;
  getTotalPoints: () => number;
  getCurrentLevel: () => number;
  getCurrentXP: () => number;
  getXPToNextLevel: () => number;
  hasNewAchievement: () => boolean;
  clearNewAchievementBadge: () => void;
  setSelectedQuest: (quest: any) => void;
  clearSelectedQuest: () => void;
  onAchievementUnlocked: (callback: () => void) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const useQuestContext = () => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuestContext must be used within a QuestProvider');
  }
  return context;
};

interface QuestProviderProps {
  children: ReactNode;
}

const allowedDifficulties = ['Einfach', 'Mittel', 'Schwer'];

function mapMockQuestAreas(areas: any[]): QuestArea[] {
  return areas.map(area => ({
    ...area,
    unlocked: false,
    mainQuest: {
      ...area.mainQuest,
      difficulty: allowedDifficulties.includes(area.mainQuest.difficulty)
        ? area.mainQuest.difficulty
        : 'Einfach',
    },
    questList: area.questList.map((q: any) => ({
      ...q,
      difficulty: allowedDifficulties.includes(q.difficulty)
        ? q.difficulty
        : 'Einfach',
    })),
  }));
}

export const QuestProvider: React.FC<QuestProviderProps> = ({ children }) => {
  // Use questAreas from mockData.json, mapped to correct types
  const [areas, setAreas] = useState<QuestArea[]>(mapMockQuestAreas(mockData.questAreas));
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);
  const [hasNewAchievementBadge, setHasNewAchievementBadge] = useState(false);
  const [lastCompletedQuestsCount, setLastCompletedQuestsCount] = useState(0);
  const [achievementCallback, setAchievementCallback] = useState<(() => void) | null>(null);

  // Check for new achievements whenever quests are completed
  const checkForNewAchievements = (completedQuestsCount: number) => {
    const previousCount = lastCompletedQuestsCount;
    const totalQuests = getTotalQuestsCount();
    
    // Check if any achievement milestones were reached
    const achievements = [
      { milestone: 1, name: 'first' },
      { milestone: 5, name: 'five' },
      { milestone: totalQuests, name: 'all' }
    ];
    
    for (const achievement of achievements) {
      if (completedQuestsCount >= achievement.milestone && previousCount < achievement.milestone) {
        setHasNewAchievementBadge(true);
        // Call the achievement callback if it exists
        if (achievementCallback) {
          achievementCallback();
        }
        break;
      }
    }
    
    setLastCompletedQuestsCount(completedQuestsCount);
  };

  const updateArea = (areaId: string, updates: Partial<QuestArea>) => {
    setAreas(prevAreas =>
      prevAreas.map(area =>
        area.id === areaId ? { ...area, ...updates } : area
      )
    );
  };

  const completeMainQuest = (areaId: string) => {
    setAreas(prevAreas =>
      prevAreas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            mainQuest: { 
              ...area.mainQuest, 
              completed: true,
              progress: area.mainQuest.totalSteps // Set progress to total steps when completed
            },
            unlocked: true,
            progress: area.progress + 1
          };
        }
        return area;
      })
    );
    
    // Check for new achievements after completing a quest
    const newCompletedCount = getCompletedQuestsCount();
    checkForNewAchievements(newCompletedCount);
  };

  const completeSubQuest = (areaId: string, questId: string) => {
    setAreas(prevAreas =>
      prevAreas.map(area => {
        if (area.id === areaId) {
          const updatedQuestList = area.questList.map(quest =>
            quest.id === questId ? { 
              ...quest, 
              completed: true,
              progress: quest.totalSteps // Set progress to total steps when completed
            } : quest
          );
          
          const completedQuests = updatedQuestList.filter(q => q.completed).length;
          
          return {
            ...area,
            questList: updatedQuestList,
            progress: completedQuests + (area.mainQuest.completed ? 1 : 0)
          };
        }
        return area;
      })
    );
    
    // Check for new achievements after completing a quest
    const newCompletedCount = getCompletedQuestsCount();
    checkForNewAchievements(newCompletedCount);
  };

  const getCompletedQuestsCount = () => {
    return areas.reduce((total, area) => {
      const mainQuestCompleted = area.mainQuest.completed ? 1 : 0;
      const subQuestsCompleted = area.questList.filter(q => q.completed).length;
      return total + mainQuestCompleted + subQuestsCompleted;
    }, 0);
  };

  const getTotalQuestsCount = () => {
    return areas.reduce((total, area) => {
      return total + 1 + area.questList.length; // 1 for main quest + sub quests
    }, 0);
  };

  const getCompletedUnlockedQuestsCount = () => {
    return areas.reduce((total, area) => {
      if (area.unlocked) {
        const mainQuestCompleted = area.mainQuest.completed ? 1 : 0;
        const subQuestsCompleted = area.questList.filter(q => q.completed).length;
        return total + mainQuestCompleted + subQuestsCompleted;
      }
      return total;
    }, 0);
  };

  const getTotalUnlockedQuestsCount = () => {
    return areas.reduce((total, area) => {
      if (area.unlocked) {
        return total + 1 + area.questList.length; // 1 for main quest + sub quests
      }
      return total;
    }, 0);
  };

  const getTotalPoints = () => {
    return areas.reduce((total, area) => {
      let areaPoints = 0;
      
      // Add main quest points if completed
      if (area.mainQuest.completed) {
        const points = parseInt(area.mainQuest.reward.match(/\d+/)?.[0] || '0');
        areaPoints += points;
      }
      
      // Add sub quest points if completed
      area.questList.forEach(quest => {
        if (quest.completed) {
          const points = parseInt(quest.reward.match(/\d+/)?.[0] || '0');
          areaPoints += points;
        }
      });
      
      return total + areaPoints;
    }, 0);
  };

  const getCurrentLevel = () => {
    const totalXP = getTotalPoints();
    // Level calculation: every 100 XP = 1 level, starting from level 1
    return Math.floor(totalXP / 100) + 1;
  };

  const getCurrentXP = () => {
    const totalXP = getTotalPoints();
    const currentLevel = getCurrentLevel();
    // XP within current level (remainder after level calculation)
    return totalXP % 100;
  };

  const getXPToNextLevel = () => {
    // Always 100 XP to next level in this system
    return 100;
  };

  const hasNewAchievement = () => {
    return hasNewAchievementBadge;
  };

  const clearNewAchievementBadge = () => {
    setHasNewAchievementBadge(false);
  };

  const clearSelectedQuest = () => {
    setSelectedQuest(null);
  };

  const value: QuestContextType = {
    areas,
    selectedQuest,
    updateArea,
    completeMainQuest,
    completeSubQuest,
    getCompletedQuestsCount,
    getTotalQuestsCount,
    getCompletedUnlockedQuestsCount,
    getTotalUnlockedQuestsCount,
    getTotalPoints,
    getCurrentLevel,
    getCurrentXP,
    getXPToNextLevel,
    hasNewAchievement,
    clearNewAchievementBadge,
    setSelectedQuest,
    clearSelectedQuest,
    onAchievementUnlocked: (callback: () => void) => {
      setAchievementCallback(callback);
    },
  };

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
}; 