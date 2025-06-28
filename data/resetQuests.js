const fs = require('fs');
const path = require('path');

// Function to reset all quests to not completed
function resetQuests(filePath) {
  try {
    console.log(`Reading file: ${filePath}`);
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    let questsReset = 0;
    
    // Reset quests in questAreas
    if (jsonData.questAreas) {
      jsonData.questAreas.forEach(area => {
        if (area.mainQuest && area.mainQuest.completed === true) {
          area.mainQuest.completed = false;
          questsReset++;
        }
        if (area.questList) {
          area.questList.forEach(quest => {
            if (quest.completed === true) {
              quest.completed = false;
              questsReset++;
            }
          });
        }
      });
    }
    
    // Reset standalone quests
    if (jsonData.quests) {
      jsonData.quests.forEach(quest => {
        if (quest.completed === true) {
          quest.completed = false;
          questsReset++;
        }
      });
    }
    
    // Reset main quests
    if (jsonData.mainQuests) {
      jsonData.mainQuests.forEach(quest => {
        if (quest.completed === true) {
          quest.completed = false;
          questsReset++;
        }
      });
    }
    
    // Reset map quest markers
    if (jsonData.mapQuestMarkers) {
      jsonData.mapQuestMarkers.forEach(marker => {
        if (marker.completed === true) {
          marker.completed = false;
          questsReset++;
        }
      });
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`Reset ${questsReset} quests to not completed in ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Reset both JSON files
console.log('Resetting all quests to not completed...\n');

resetQuests(path.join(__dirname, 'mockData.json'));
resetQuests(path.join(__dirname, 'mockDataWithQuestions.json'));

console.log('\nAll quests have been reset to not completed!'); 