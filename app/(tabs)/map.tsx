import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions, Text, ScrollView } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useQuestContext } from '@/contexts/QuestContext';
import { MapQuestMarker } from '@/types/QuestArea';
import { QuestMarkerIcon } from '@/components/QuestMarkerIcons';

const { width, height } = Dimensions.get('window');

// Quest marker component using SVG icons
const QuestMarker = ({ type, completed, title }: { type: 'main' | 'sub'; completed: boolean; title: string }) => {
  const getMarkerType = () => {
    if (completed) {
      return 'completed';
    }
    return type;
  };

  return (
    <View style={styles.markerContainer}>
      <View style={styles.markerIconContainer}>
        <QuestMarkerIcon type={getMarkerType()} />
      </View>
      <ThemedText style={styles.markerTitle}>{title}</ThemedText>
    </View>
  );
};

export default function MapScreen() {
  const { areas, completeMainQuest, completeSubQuest } = useQuestContext();
  const [questMarkers, setQuestMarkers] = useState<MapQuestMarker[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Konstanz center coordinates
  const initialRegion = {
    latitude: 47.6600,
    longitude: 9.1750,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const [currentRegion, setCurrentRegion] = useState(initialRegion);

  useEffect(() => {
    updateQuestMarkers();
  }, [areas]);

  const updateQuestMarkers = () => {
    const markers: MapQuestMarker[] = [];
    
    areas.forEach(area => {
      // Always show main quest marker
      if (area.mainQuest.coordinates) {
        markers.push({
          id: `main-${area.mainQuest.id}`,
          title: area.mainQuest.title,
          type: 'main',
          coordinates: area.mainQuest.coordinates,
          completed: area.mainQuest.completed,
          areaId: area.id
        });
      }

      // Show sub quests only if area is unlocked
      if (area.unlocked) {
        area.questList.forEach(quest => {
          if (quest.coordinates) {
            markers.push({
              id: `sub-${quest.id}`,
              title: quest.title,
              type: 'sub',
              coordinates: quest.coordinates,
              completed: quest.completed,
              areaId: area.id
            });
          }
        });
      }
    });
    
    setQuestMarkers(markers);
  };

  const handleRegionChange = (region: any) => {
    setCurrentRegion(region);
  };

  // Create dynamic Fog of War coordinates based on current map view
  const getFogOfWarCoordinates = () => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = currentRegion;
    const latOffset = latitudeDelta * 0.6; // Extend beyond visible area
    const lngOffset = longitudeDelta * 0.6;
    
    return [
      { latitude: latitude + latOffset, longitude: longitude - lngOffset }, // Top-left
      { latitude: latitude + latOffset, longitude: longitude + lngOffset }, // Top-right
      { latitude: latitude - latOffset, longitude: longitude + lngOffset }, // Bottom-right
      { latitude: latitude - latOffset, longitude: longitude - lngOffset }, // Bottom-left
    ];
  };

  const handleQuestPress = (marker: MapQuestMarker) => {
    const area = areas.find(a => a.id === marker.areaId);
    if (!area) return;

    if (marker.type === 'main') {
      const quest = area.mainQuest;
      if (quest.completed) {
        Alert.alert('Quest abgeschlossen', 'Diese Hauptquest wurde bereits erfolgreich abgeschlossen!');
      } else {
        Alert.alert(
          quest.title,
          `${quest.description}\n\nSchwierigkeit: ${quest.difficulty}\nBelohnung: ${quest.reward}`,
          [
            { text: 'Abbrechen', style: 'cancel' },
            { 
              text: 'Abschließen', 
              onPress: () => {
                completeMainQuest(area.id);
                Alert.alert(
                  'Quest abgeschlossen!', 
                  'Die Area wurde freigeschaltet! Alle anderen Quests sind jetzt verfügbar.'
                );
              }
            }
          ]
        );
      }
    } else {
      const quest = area.questList.find(q => q.id === marker.id);
      if (!quest) return;

      if (quest.completed) {
        Alert.alert('Quest abgeschlossen', 'Diese Quest wurde bereits erfolgreich abgeschlossen!');
      } else {
        Alert.alert(
          quest.title,
          `${quest.description}\n\nSchwierigkeit: ${quest.difficulty}\nBelohnung: ${quest.reward}`,
          [
            { text: 'Abbrechen', style: 'cancel' },
            { 
              text: 'Abschließen', 
              onPress: () => {
                completeSubQuest(area.id, quest.id);
                Alert.alert('Quest abgeschlossen!', 'Gut gemacht!');
              }
            }
          ]
        );
      }
    }
  };

  const getAreaOverlayColor = (area: any) => {
    if (area.unlocked) {
      return 'rgba(255, 255, 255, 0.15)'; // Misty white overlay for unlocked
    }
    return 'rgba(0, 0, 0, 0.3)'; // Dark overlay for locked
  };

  // Create holes in the fog for unlocked areas
  const createFogOfWarHoles = () => {
    const unlockedAreas = areas.filter(area => area.unlocked);
    return unlockedAreas.map(area => area.coordinates);
  };

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={handleRegionChange}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsCompass={false}
        showsScale={false}
        mapType="standard"
        customMapStyle={[
          {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.attraction",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.government",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.medical",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.place_of_worship",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.school",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.sports_complex",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]}
      >
        {/* Fog of War Overlay */}
        <Polygon
          coordinates={getFogOfWarCoordinates()}
          fillColor="rgba(0, 0, 0, 0.7)"
          strokeColor="transparent"
          holes={createFogOfWarHoles()}
        />

        {/* Quest Area Overlays */}
        {areas.map(area => (
          <Polygon
            key={area.id}
            coordinates={area.coordinates}
            fillColor={getAreaOverlayColor(area)}
            strokeColor={area.unlocked ? '#4CAF50' : '#666'}
            strokeWidth={2}
          />
        ))}

        {/* Quest Markers */}
        {questMarkers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinates}
            onPress={() => handleQuestPress(marker)}
          >
            <QuestMarker
              type={marker.type}
              completed={marker.completed}
              title={marker.title}
            />
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <ThemedText style={styles.legendTitle}>Legende</ThemedText>
        <View style={styles.legendItem}>
          <QuestMarkerIcon type="main" size={20} />
          <ThemedText style={styles.legendLabel}>Hauptquest</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <QuestMarkerIcon type="sub" size={20} />
          <ThemedText style={styles.legendLabel}>Unterquest</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <QuestMarkerIcon type="completed" size={20} />
          <ThemedText style={styles.legendLabel}>Abgeschlossen</ThemedText>
        </View>
      </View>

      {/* Area Info Panel */}
      <ScrollView style={styles.areaInfo} horizontal showsHorizontalScrollIndicator={false}>
        {areas.map(area => (
          <View key={area.id} style={styles.areaCard}>
            <ThemedText style={styles.areaName}>{area.name}</ThemedText>
            <Text style={styles.areaStatus}>
              {area.unlocked ? '🔓 Freigeschaltet' : '🔒 Gesperrt'}
            </Text>
            <Text style={styles.areaProgress}>
              {area.progress}/{area.totalQuests} Quests
            </Text>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.7,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 80,
    color: '#000000',
  },
  legend: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#000000',
    marginLeft: 4,
  },
  areaInfo: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    maxHeight: 100,
  },
  areaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  areaName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  areaStatus: {
    fontSize: 12,
    marginBottom: 2,
  },
  areaProgress: {
    fontSize: 12,
    color: '#666',
  },
}); 