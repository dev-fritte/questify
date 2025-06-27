import { QuestArea } from '../types/QuestArea';

export const questAreas: QuestArea[] = [
  {
    id: 'altstadt',
    name: 'Altstadt Konstanz',
    mainQuest: {
      id: 'altstadt-main',
      title: 'Entdecke die Altstadt',
      description: 'Erkunde die historische Altstadt von Konstanz und finde die wichtigsten Sehenswürdigkeiten',
      difficulty: 'Einfach',
      reward: '100 Punkte',
      completed: false,
      progress: 0,
      totalSteps: 1,
      solutionWord: 'altstadt',
      coordinates: {
        latitude: 47.6600,
        longitude: 9.1750
      }
    },
    unlocked: false,
    questList: [
      {
        id: 'altstadt-1',
        title: 'Münster Unserer Lieben Frau',
        description: 'Besuche das Konstanzer Münster und mache ein Foto',
        difficulty: 'Einfach',
        reward: '25 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'münster',
        coordinates: {
          latitude: 47.6620,
          longitude: 9.1750
        }
      },
      {
        id: 'altstadt-2',
        title: 'Imperia',
        description: 'Finde die Imperia-Statue am Hafen',
        difficulty: 'Einfach',
        reward: '30 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'imperia',
        coordinates: {
          latitude: 47.6580,
          longitude: 9.1780
        }
      },
      {
        id: 'altstadt-3',
        title: 'Rathaus Konstanz',
        description: 'Besuche das historische Rathaus am Marktplatz',
        difficulty: 'Mittel',
        reward: '50 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'rathaus',
        coordinates: {
          latitude: 47.6610,
          longitude: 9.1760
        }
      }
    ],
    coordinates: [
      { latitude: 47.6580, longitude: 9.1730 },
      { latitude: 47.6640, longitude: 9.1730 },
      { latitude: 47.6640, longitude: 9.1780 },
      { latitude: 47.6580, longitude: 9.1780 }
    ],
    progress: 0,
    totalQuests: 4
  },
  {
    id: 'hafen',
    name: 'Hafen & Seepromenade',
    mainQuest: {
      id: 'hafen-main',
      title: 'Erkunde den Hafen',
      description: 'Entdecke den Konstanzer Hafen und die Seepromenade',
      difficulty: 'Mittel',
      reward: '150 Punkte',
      completed: false,
      progress: 0,
      totalSteps: 1,
      solutionWord: 'hafen',
      coordinates: {
        latitude: 47.6560,
        longitude: 9.1800
      }
    },
    unlocked: false,
    questList: [
      {
        id: 'hafen-1',
        title: 'Seepromenade',
        description: 'Spaziere die Seepromenade entlang und genieße den Blick auf den Bodensee',
        difficulty: 'Einfach',
        reward: '40 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'promenade',
        coordinates: {
          latitude: 47.6550,
          longitude: 9.1820
        }
      },
      {
        id: 'hafen-2',
        title: 'Fährhafen',
        description: 'Besuche den Fährhafen nach Meersburg',
        difficulty: 'Einfach',
        reward: '35 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'fähre',
        coordinates: {
          latitude: 47.6570,
          longitude: 9.1830
        }
      },
      {
        id: 'hafen-3',
        title: 'Yachthafen',
        description: 'Erkunde den Yachthafen und die Boote',
        difficulty: 'Mittel',
        reward: '60 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'yacht',
        coordinates: {
          latitude: 47.6540,
          longitude: 9.1850
        }
      }
    ],
    coordinates: [
      { latitude: 47.6530, longitude: 9.1780 },
      { latitude: 47.6590, longitude: 9.1780 },
      { latitude: 47.6590, longitude: 9.1880 },
      { latitude: 47.6530, longitude: 9.1880 }
    ],
    progress: 0,
    totalQuests: 4
  },
  {
    id: 'universitaet',
    name: 'Universitätsviertel',
    mainQuest: {
      id: 'universitaet-main',
      title: 'Entdecke die Universität',
      description: 'Erkunde das Universitätsviertel und die Campus-Gebäude',
      difficulty: 'Schwer',
      reward: '200 Punkte',
      completed: false,
      progress: 0,
      totalSteps: 1,
      solutionWord: 'universität',
      coordinates: {
        latitude: 47.6680,
        longitude: 9.1700
      }
    },
    unlocked: false,
    questList: [
      {
        id: 'universitaet-1',
        title: 'Universitätsbibliothek',
        description: 'Besuche die moderne Universitätsbibliothek',
        difficulty: 'Einfach',
        reward: '30 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'bibliothek',
        coordinates: {
          latitude: 47.6690,
          longitude: 9.1720
        }
      },
      {
        id: 'universitaet-2',
        title: 'Campus-Grün',
        description: 'Erkunde die Grünflächen und Gärten des Campus',
        difficulty: 'Mittel',
        reward: '45 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'campus',
        coordinates: {
          latitude: 47.6670,
          longitude: 9.1710
        }
      },
      {
        id: 'universitaet-3',
        title: 'Studentenleben',
        description: 'Entdecke 3 Studentencafés oder -kneipen',
        difficulty: 'Schwer',
        reward: '80 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'studenten',
        coordinates: {
          latitude: 47.6680,
          longitude: 9.1690
        }
      }
    ],
    coordinates: [
      { latitude: 47.6660, longitude: 9.1680 },
      { latitude: 47.6700, longitude: 9.1680 },
      { latitude: 47.6700, longitude: 9.1730 },
      { latitude: 47.6660, longitude: 9.1730 }
    ],
    progress: 0,
    totalQuests: 4
  },
  {
    id: 'paradies',
    name: 'Paradies & Insel Mainau',
    mainQuest: {
      id: 'paradies-main',
      title: 'Entdecke das Paradies',
      description: 'Erkunde das Paradies-Viertel und die Insel Mainau',
      difficulty: 'Schwer',
      reward: '250 Punkte',
      completed: false,
      progress: 0,
      totalSteps: 1,
      solutionWord: 'paradies',
      coordinates: {
        latitude: 47.6720,
        longitude: 9.1850
      }
    },
    unlocked: false,
    questList: [
      {
        id: 'paradies-1',
        title: 'Insel Mainau',
        description: 'Besuche die Blumeninsel Mainau',
        difficulty: 'Mittel',
        reward: '100 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'mainau',
        coordinates: {
          latitude: 47.7050,
          longitude: 9.1950
        }
      },
      {
        id: 'paradies-2',
        title: 'Paradies-Garten',
        description: 'Spaziere durch die Gärten im Paradies-Viertel',
        difficulty: 'Einfach',
        reward: '35 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'garten',
        coordinates: {
          latitude: 47.6730,
          longitude: 9.1860
        }
      },
      {
        id: 'paradies-3',
        title: 'Seeblick',
        description: 'Genieße den Panoramablick auf den Bodensee',
        difficulty: 'Einfach',
        reward: '40 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: 'seeblick',
        coordinates: {
          latitude: 47.6740,
          longitude: 9.1870
        }
      }
    ],
    coordinates: [
      { latitude: 47.6710, longitude: 9.1830 },
      { latitude: 47.6750, longitude: 9.1830 },
      { latitude: 47.6750, longitude: 9.1880 },
      { latitude: 47.6710, longitude: 9.1880 }
    ],
    progress: 0,
    totalQuests: 4
  }
]; 