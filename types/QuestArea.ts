export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  reward: string;
  completed: boolean;
  progress: number;
  totalSteps: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface QuestArea {
  id: string;
  name: string;
  mainQuest: Quest;
  unlocked: boolean;
  questList: Quest[];
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  progress: number;
  totalQuests: number;
}

export interface MapQuestMarker {
  id: string;
  title: string;
  type: 'main' | 'sub';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  completed: boolean;
  areaId: string;
} 