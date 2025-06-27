import React, { createContext, useContext, useState, ReactNode } from 'react';
import { questAreas } from '@/data/questAreas';
import { QuestArea } from '@/types/QuestArea';

interface QuestContextType {
  areas: QuestArea[];
  updateArea: (areaId: string, updates: Partial<QuestArea>) => void;
  completeMainQuest: (areaId: string) => void;
  completeSubQuest: (areaId: string, questId: string) => void;
  getCompletedQuestsCount: () => number;
  getTotalQuestsCount: () => number;
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

export const QuestProvider: React.FC<QuestProviderProps> = ({ children }) => {
  const [areas, setAreas] = useState<QuestArea[]>(questAreas);

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
            mainQuest: { ...area.mainQuest, completed: true },
            unlocked: true,
            progress: area.progress + 1
          };
        }
        return area;
      })
    );
  };

  const completeSubQuest = (areaId: string, questId: string) => {
    setAreas(prevAreas =>
      prevAreas.map(area => {
        if (area.id === areaId) {
          const updatedQuestList = area.questList.map(quest =>
            quest.id === questId ? { ...quest, completed: true } : quest
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

  const value: QuestContextType = {
    areas,
    updateArea,
    completeMainQuest,
    completeSubQuest,
    getCompletedQuestsCount,
    getTotalQuestsCount,
  };

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
}; 