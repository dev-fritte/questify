const fs = require('fs');
const path = require('path');

// Funktion zum Parsen der WKT-Koordinaten
function parseWKT(wkt) {
  if (wkt.startsWith('POINT')) {
    // POINT (longitude latitude)
    const match = wkt.match(/POINT\s*\(([^)]+)\)/);
    if (match) {
      const [longitude, latitude] = match[1].trim().split(' ').map(Number);
      return { latitude, longitude };
    }
  } else if (wkt.startsWith('POLYGON')) {
    // POLYGON ((longitude1 latitude1; longitude2 latitude2; ...))
    const match = wkt.match(/POLYGON\s*\(\(([^)]+)\)\)/);
    if (match) {
      const coordinates = match[1]
        .split(';')
        .map(coord => {
          const [longitude, latitude] = coord.trim().split(' ').map(Number);
          return { latitude, longitude };
        });
      return coordinates;
    }
  }
  return null;
}

// Funktion zum Bereinigen von Strings
function cleanString(str) {
  return str.replace(/[\r\n]/g, '').trim();
}

// Funktion zum Generieren von Mockdaten für eine Quest
function generateQuestData(name, type, coordinates, question = null, passcode = null) {
  const rewards = ['50 XP', '100 XP', '150 XP', '200 XP', '250 XP'];
  const fallbackDescriptions = [
    'Entdecke die versteckten Schätze dieser Gegend.',
    'Löse das Rätsel und finde den geheimen Pfad.',
    'Erkunde die historischen Stätten und sammle Hinweise.',
    'Finde die versteckten Symbole und entschlüssle die Botschaft.',
    'Entdecke die lokalen Legenden und Geschichten.'
  ];

  return {
    id: `quest_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    title: name,
    description: question || fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)],
    reward: rewards[Math.floor(Math.random() * rewards.length)],
    completed: Math.random() > 0.7, // 30% Wahrscheinlichkeit, dass Quest abgeschlossen ist
    progress: Math.floor(Math.random() * 100),
    totalSteps: Math.floor(Math.random() * 5) + 1,
    solutionWord: passcode || (Math.random() > 0.5 ? `lösung_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : undefined),
    coordinates: coordinates
  };
}

// Funktion zum Generieren von Mockdaten für eine QuestArea
function generateQuestAreaData(name, coordinates, quests, mainQuests) {
  const areaQuests = quests.filter(quest => quest.areaId === name);
  const areaMainQuests = mainQuests.filter(quest => quest.areaId === name);
  
  const mainQuest = areaMainQuests.length > 0 ? areaMainQuests[0] : null;
  
  return {
    id: `area_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: name,
    mainQuest: mainQuest || generateQuestData(`${name} Hauptquest`, 'MainQuest', coordinates[0]),
    unlocked: false, // Deaktiviere alle Areas standardmäßig
    questList: areaQuests,
    coordinates: coordinates,
    progress: Math.floor(Math.random() * 100),
    totalQuests: areaQuests.length + (mainQuest ? 1 : 0)
  };
}

// Hauptfunktion zum Generieren der Mockdaten
function generateMockData() {
  try {
    // CSV-Datei mit Fragen und Passcodes lesen
    const csvPath = path.join(__dirname, 'questlist_with_questions.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    console.log('CSV Headers:', headers);
    
    const questAreas = [];
    const quests = [];
    const mainQuests = [];
    
    // CSV-Zeilen parsen (ab Zeile 2, da Zeile 1 Header ist)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(',');
      
      if (values.length >= 4) {
        const wkt = cleanString(values[0]);
        const name = cleanString(values[1]);
        const type = cleanString(values[2]);
        const forArea = cleanString(values[3]);
        
        // Neue Spalten: Question (index 4) und Passcode (index 5)
        const question = values.length > 4 ? cleanString(values[4]) : null;
        const passcode = values.length > 5 ? cleanString(values[5]) : null;
        
        console.log(`Processing: ${name} (${type}) - Question: "${question}" - Passcode: "${passcode}"`);
        
        const coordinates = parseWKT(wkt);
        
        if (coordinates) {
          if (type === 'QuestArea') {
            // QuestArea hinzufügen
            questAreas.push({
              name: name,
              coordinates: coordinates
            });
          } else if (type === 'MainQuest') {
            // MainQuest hinzufügen
            const questData = generateQuestData(name, type, coordinates, question, passcode);
            questData.areaId = forArea;
            mainQuests.push(questData);
          } else if (type === 'Quest') {
            // Normale Quest hinzufügen
            const questData = generateQuestData(name, type, coordinates, question, passcode);
            questData.areaId = forArea;
            quests.push(questData);
          }
        }
      }
    }
    
    // QuestAreas mit ihren Quests generieren
    const generatedQuestAreas = questAreas.map(area => 
      generateQuestAreaData(area.name, area.coordinates, quests, mainQuests)
    );
    
    // MapQuestMarkers generieren
    const mapQuestMarkers = [
      ...mainQuests.map(quest => ({
        id: quest.id,
        title: quest.title,
        type: 'main',
        coordinates: quest.coordinates,
        completed: quest.completed,
        areaId: quest.areaId
      })),
      ...quests.map(quest => ({
        id: quest.id,
        title: quest.title,
        type: 'sub',
        coordinates: quest.coordinates,
        completed: quest.completed,
        areaId: quest.areaId
      }))
    ];
    
    // Mockdaten zusammenstellen
    const mockData = {
      questAreas: generatedQuestAreas,
      mapQuestMarkers: mapQuestMarkers,
      generatedAt: new Date().toISOString()
    };
    
    // JSON-Datei schreiben
    const outputPath = path.join(__dirname, 'mockDataWithQuestions.json');
    fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2), 'utf8');
    
    console.log('Mockdaten mit Fragen erfolgreich generiert!');
    console.log(`- ${generatedQuestAreas.length} QuestAreas`);
    console.log(`- ${mainQuests.length} MainQuests`);
    console.log(`- ${quests.length} Quests`);
    console.log(`- ${mapQuestMarkers.length} MapQuestMarkers`);
    console.log(`Datei gespeichert: ${outputPath}`);
    
  } catch (error) {
    console.error('Fehler beim Generieren der Mockdaten:', error);
  }
}

// Script ausführen
generateMockData(); 