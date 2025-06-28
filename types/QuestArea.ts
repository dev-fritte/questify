export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  progress: number;
  totalSteps: number;
  solutionWord?: string;
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