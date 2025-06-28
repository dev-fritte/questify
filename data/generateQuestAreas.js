const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync').parse;

console.log('Script started');

// Helper function to parse WKT coordinates
const parseWKT = (wkt) => {
  if (!wkt) return null;
  if (wkt.startsWith('POINT')) {
    const match = wkt.match(/POINT \(([^)]+)\)/);
    if (match) {
      const [longitude, latitude] = match[1].split(' ').map(Number);
      return { latitude, longitude };
    }
  } else if (wkt.startsWith('POLYGON')) {
    const match = wkt.match(/POLYGON \(\(([^)]+)\)\)/);
    if (match) {
      const coords = match[1].split(',').map(coord => {
        const [longitude, latitude] = coord.trim().split(' ').map(Number);
        return { latitude, longitude };
      });
      return coords;
    }
  }
  return null;
};

const removeDiacritics = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

// Fix encoding issues in area names
const fixEncoding = (str) => {
  return str
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã¶/g, 'ö')
    .replace(/ÃŸ/g, 'ß')
    .replace(/Ã„/g, 'Ä')
    .replace(/Ãœ/g, 'Ü')
    .replace(/Ã–/g, 'Ö');
};

// Normalize area names for matching
const normalizeAreaName = (str) => {
  return removeDiacritics(fixEncoding(str));
};

// Read CSV file
const csvPath = path.join(__dirname, 'questlist_utf8.csv');
console.log('CSV path:', csvPath);

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found!');
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf8');
console.log('CSV content length:', csvContent.length);

// Print header row
const headerRow = csvContent.split('\n')[0];
console.log('Header row:', headerRow);

// Parse CSV using csv-parse
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

console.log('Parsed records:', records.length);
if (records.length > 0) {
  console.log('First record:', records[0]);
  console.log('Field names:', Object.keys(records[0]));
}

// Extract QuestAreas
const questAreas = records
  .filter(item => item.type.trim() === 'QuestArea')
  .map(area => {
    const coordinates = parseWKT(area.WKT);
    return {
      id: normalizeAreaName(area.name).replace(/\s+/g, '-'),
      name: fixEncoding(area.name),
      coordinates: coordinates || [],
      mainQuest: null,
      questList: [],
      unlocked: false,
      progress: 0,
      totalQuests: 0
    };
  });

console.log('Found QuestAreas:', questAreas.length);

// Extract MainQuests and assign them to QuestAreas
const mainQuests = records.filter(item => item.type.trim() === 'MainQuest');
console.log('Found MainQuests:', mainQuests.length);

mainQuests.forEach(mainQuest => {
  const coordinates = parseWKT(mainQuest.WKT);
  const questArea = questAreas.find(area => normalizeAreaName(area.name) === normalizeAreaName(mainQuest.forArea));
  
  if (questArea && coordinates) {
    questArea.mainQuest = {
      id: `${questArea.id}-main`,
      title: fixEncoding(mainQuest.name),
      description: `Entdecke ${fixEncoding(mainQuest.name)} in ${questArea.name}`,
      difficulty: 'Mittel',
      reward: '150 Punkte',
      completed: false,
      progress: 0,
      totalSteps: 1,
      solutionWord: fixEncoding(mainQuest.name).toLowerCase().replace(/\s+/g, ''),
      coordinates: coordinates
    };
  }
});

// Extract regular Quests and assign them to QuestAreas
const regularQuests = records.filter(item => item.type.trim() === 'Quest');
console.log('Found regular Quests:', regularQuests.length);

regularQuests.forEach(quest => {
  const coordinates = parseWKT(quest.WKT);
  
  if (coordinates) {
    // Find the QuestArea that contains this quest
    const questArea = questAreas.find(area => {
      if (!area.coordinates || area.coordinates.length === 0) return false;
      // Simple point-in-polygon check (for demonstration)
      const centerLat = area.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / area.coordinates.length;
      const centerLng = area.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / area.coordinates.length;
      const distance = Math.sqrt(
        Math.pow(coordinates.latitude - centerLat, 2) + 
        Math.pow(coordinates.longitude - centerLng, 2)
      );
      return distance < 0.01; // Rough approximation
    });
    if (questArea) {
      questArea.questList.push({
        id: `${questArea.id}-${questArea.questList.length + 1}`,
        title: fixEncoding(quest.name),
        description: `Entdecke ${fixEncoding(quest.name)}`,
        difficulty: 'Einfach',
        reward: '50 Punkte',
        completed: false,
        progress: 0,
        totalSteps: 1,
        solutionWord: fixEncoding(quest.name).toLowerCase().replace(/\s+/g, ''),
        coordinates: coordinates
      });
    }
  }
});

// Calculate totals and set first area as unlocked
questAreas.forEach((area, index) => {
  area.totalQuests = (area.mainQuest ? 1 : 0) + area.questList.length;
  if (index === 0) area.unlocked = true; // First area unlocked by default
});

// Generate TypeScript file content
const tsContent = `import { QuestArea } from '../types/QuestArea';\n\nexport const questAreas: QuestArea[] = ${JSON.stringify(questAreas, null, 2)};\n`;

// Write to file
const outputPath = path.join(__dirname, 'questAreas.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`Generated ${questAreas.length} quest areas:`);
questAreas.forEach(area => {
  console.log(`- ${area.name}: ${area.totalQuests} quests (${area.mainQuest ? '1 main quest' : 'no main quest'}, ${area.questList.length} regular quests)`);
});

console.log('Script completed successfully!'); 