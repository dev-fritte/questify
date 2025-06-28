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

// Funktion zum Generieren einer Quest-Struktur
function generateQuestStructure(name, type, coordinates, question = null, passcode = null, parentArea = null) {
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
    completed: false, // Standardmäßig auf false gesetzt
    progress: Math.floor(Math.random() * 100),
    totalSteps: Math.floor(Math.random() * 5) + 1,
    solutionWord: passcode || (Math.random() > 0.5 ? `lösung_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : undefined),
    coordinates: coordinates,
    parentArea: parentArea
  };
}

// Funktion zum Generieren einer QuestArea-Struktur
function generateQuestAreaStructure(name, coordinates) {
  return {
    id: `area_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: name,
    unlocked: Math.random() > 0.3, // 70% Wahrscheinlichkeit, dass Area freigeschaltet ist
    coordinates: coordinates,
    progress: Math.floor(Math.random() * 100),
    totalQuests: 0 // Wird später berechnet
  };
}

// Hauptfunktion zum Verarbeiten der CSV-Daten
function processQuestData() {
  try {
    // CSV-Datei lesen
    const csvPath = path.join(__dirname, 'questlist.csv');
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
        
        // Neue Spalten: Question (index 4), Passcode (index 5), parentArea (index 6)
        const question = values.length > 4 ? cleanString(values[4]) : null;
        const passcode = values.length > 5 ? cleanString(values[5]) : null;
        const parentArea = values.length > 6 ? cleanString(values[6]) : null;
        
        const coordinates = parseWKT(wkt);
        
        if (coordinates) {
          if (type === 'QuestArea') {
            // QuestArea hinzufügen
            const areaData = generateQuestAreaStructure(name, coordinates);
            questAreas.push(areaData);
          } else if (type === 'MainQuest') {
            // MainQuest hinzufügen
            const questData = generateQuestStructure(name, type, coordinates, question, passcode, parentArea);
            mainQuests.push(questData);
          } else if (type === 'Quest') {
            // Normale Quest hinzufügen
            const questData = generateQuestStructure(name, type, coordinates, question, passcode, parentArea);
            quests.push(questData);
          }
        }
      }
    }
    
    // 1. QuestAreas JSON-Datei erstellen
    const questAreasData = {
      questAreas: questAreas,
      generatedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(__dirname, 'questAreas.json'), JSON.stringify(questAreasData, null, 2), 'utf8');
    
    // 2. MainQuests JSON-Datei erstellen
    const mainQuestsData = {
      mainQuests: mainQuests,
      generatedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(__dirname, 'mainQuests.json'), JSON.stringify(mainQuestsData, null, 2), 'utf8');
    
    // 3. Quests JSON-Datei erstellen
    const questsData = {
      quests: quests,
      generatedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(__dirname, 'quests.json'), JSON.stringify(questsData, null, 2), 'utf8');
    
    // 4. QuestAreas mit ihren Quests verbinden
    const connectedQuestAreas = questAreas.map(area => {
      const areaMainQuests = mainQuests.filter(quest => quest.parentArea === area.name);
      const areaQuests = quests.filter(quest => quest.parentArea === area.name);
      
      const mainQuest = areaMainQuests.length > 0 ? areaMainQuests[0] : null;
      
      return {
        ...area,
        mainQuest: mainQuest,
        questList: areaQuests,
        totalQuests: areaQuests.length + (mainQuest ? 1 : 0)
      };
    });
    
    // 5. MapQuestMarkers generieren
    const mapQuestMarkers = [];
    
    // Alle MainQuests hinzufügen (immer sichtbar)
    mainQuests.forEach(quest => {
      mapQuestMarkers.push({
        id: quest.id,
        title: quest.title,
        type: 'main',
        coordinates: quest.coordinates,
        completed: quest.completed,
        parentArea: quest.parentArea,
        alwaysVisible: true
      });
    });
    
    // SubQuests nur hinzufügen, wenn ihre parentArea freigeschaltet ist
    quests.forEach(quest => {
      const parentArea = connectedQuestAreas.find(area => area.name === quest.parentArea);
      if (parentArea && parentArea.unlocked) {
        mapQuestMarkers.push({
          id: quest.id,
          title: quest.title,
          type: 'sub',
          coordinates: quest.coordinates,
          completed: quest.completed,
          parentArea: quest.parentArea,
          alwaysVisible: false
        });
      }
    });
    
    // 6. Kombinierte mock_data.json erstellen
    const mockData = {
      questAreas: connectedQuestAreas,
      mapQuestMarkers: mapQuestMarkers,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(path.join(__dirname, 'mock_data.json'), JSON.stringify(mockData, null, 2), 'utf8');
    
    // Statistiken ausgeben
    console.log('Daten erfolgreich verarbeitet!');
    console.log(`- ${questAreas.length} QuestAreas`);
    console.log(`- ${mainQuests.length} MainQuests`);
    console.log(`- ${quests.length} Quests`);
    console.log(`- ${mapQuestMarkers.length} MapQuestMarkers (${mainQuests.length} MainQuests + ${mapQuestMarkers.length - mainQuests.length} SubQuests)`);
    console.log('\nDateien erstellt:');
    console.log('- questAreas.json');
    console.log('- mainQuests.json');
    console.log('- quests.json');
    console.log('- mock_data.json');
    
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
  }
}

// Script ausführen
processQuestData(); 