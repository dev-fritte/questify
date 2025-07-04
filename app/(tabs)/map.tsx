import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Text, ScrollView, Modal, TextInput, TouchableOpacity, Image, Animated } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useQuestContext } from '@/contexts/QuestContext';
import { MapQuestMarker } from '@/types/QuestArea';
import { QuestMarkerIcon } from '@/components/QuestMarkerIcons';
import { QuestBottomSheet } from '@/components/QuestBottomSheet';
import { QuestSuccessAnimation } from '@/components/QuestSuccessAnimation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

// Lock icon component
const LockIcon = ({ isUnlocked, color }: { isUnlocked: boolean; color: string }) => {
  return (
    <FontAwesome 
      name={isUnlocked ? "unlock" : "lock"} 
      size={12} 
      color={color} 
      style={{ marginRight: 4 }}
    />
  );
};

export default function MapScreen() {
  const { areas, completeMainQuest, completeSubQuest, selectedQuest, clearSelectedQuest } = useQuestContext();
  const [questMarkers, setQuestMarkers] = useState<MapQuestMarker[]>([]);
  const [mapRef, setMapRef] = useState<any>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<any>(null);
  const [currentArea, setCurrentArea] = useState<any>(null);
  const [solutionInput, setSolutionInput] = useState('');
  const [solutionError, setSolutionError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successQuestData, setSuccessQuestData] = useState<{ title: string; reward: string } | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  
  // Animation for legend
  const legendSlideAnim = useRef(new Animated.Value(0)).current;

  // Animation functions for legend
  const animateLegendOut = () => {
    Animated.timing(legendSlideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateLegendIn = () => {
    Animated.timing(legendSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

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

  // Handle selected quest from quest list
  useEffect(() => {
    if (selectedQuest && selectedQuest.coordinates && mapRef) {
      // Zoom to the selected quest
      const region = {
        latitude: selectedQuest.coordinates.latitude,
        longitude: selectedQuest.coordinates.longitude,
        latitudeDelta: 0.005, // Closer zoom
        longitudeDelta: 0.005,
      };
      
      mapRef.animateToRegion(region, 1000);
      
      // Show quest details after a short delay
      setTimeout(() => {
        handleQuestDetails(selectedQuest);
        clearSelectedQuest();
      }, 1200);
    }
  }, [selectedQuest, mapRef]);

  const handleQuestDetails = (quest: any) => {
    if (quest.completed) {
      Alert.alert('Quest abgeschlossen', 'Diese Quest wurde bereits erfolgreich abgeschlossen!');
    } else {
      // Show bottom sheet for quest details
      setCurrentQuest(quest);
      setCurrentArea(null);
      setSolutionInput('');
      setSolutionError('');
      setBottomSheetVisible(true);
      animateLegendOut(); // Animate legend out
    }
  };

  const handleAreaPress = (area: any) => {
    // Calculate the center of the area's polygon
    if (area.coordinates && area.coordinates.length > 0 && mapRef) {
      const coordinates = area.coordinates;
      
      // Calculate the center point of the polygon
      let centerLat = 0;
      let centerLng = 0;
      
      coordinates.forEach((coord: any) => {
        centerLat += coord.latitude;
        centerLng += coord.longitude;
      });
      
      centerLat /= coordinates.length;
      centerLng /= coordinates.length;
      
      // Calculate the bounding box to determine appropriate zoom level
      let minLat = coordinates[0].latitude;
      let maxLat = coordinates[0].latitude;
      let minLng = coordinates[0].longitude;
      let maxLng = coordinates[0].longitude;
      
      coordinates.forEach((coord: any) => {
        minLat = Math.min(minLat, coord.latitude);
        maxLat = Math.max(maxLat, coord.latitude);
        minLng = Math.min(minLng, coord.longitude);
        maxLng = Math.max(maxLng, coord.longitude);
      });
      
      // Calculate appropriate delta values for zoom
      const latDelta = (maxLat - minLat) * 1.5; // Add some padding
      const lngDelta = (maxLng - minLng) * 1.5;
      
      // Animate to the area
      const region = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
        longitudeDelta: Math.max(lngDelta, 0.01),
      };
      
      mapRef.animateToRegion(region, 1000);

      // After zoom, open the main quest's bottom sheet
      setTimeout(() => {
        if (area.mainQuest) {
          setCurrentQuest({ ...area.mainQuest, isMainQuest: true, areaId: area.id });
          setCurrentArea(null);
          setSolutionInput('');
          setSolutionError('');
          setBottomSheetVisible(true);
          animateLegendOut(); // Animate legend out
        }
      }, 1100); // Wait for the zoom animation to finish
    }
  };

  const handleSolutionSubmit = () => {
    if (!currentQuest || !currentQuest.solutionWord) {
      Alert.alert('Fehler', 'Kein Lösungswort für diese Quest verfügbar.');
      return;
    }

    const userInput = solutionInput.trim().toLowerCase();
    const correctSolution = currentQuest.solutionWord.toLowerCase();

    if (userInput === correctSolution) {
      // Correct solution - complete the quest
      if (currentQuest.isMainQuest) {
        completeMainQuest(currentQuest.areaId);
        // Show success animation instead of alert
        setSuccessQuestData({
          title: currentQuest.title,
          reward: currentQuest.reward
        });
        setShowSuccessAnimation(true);
      } else {
        completeSubQuest(currentQuest.areaId, currentQuest.id);
        // Show success animation instead of alert
        setSuccessQuestData({
          title: currentQuest.title,
          reward: currentQuest.reward
        });
        setShowSuccessAnimation(true);
      }
      setBottomSheetVisible(false);
      setCurrentQuest(null);
      setSolutionInput('');
    } else {
      // Wrong solution
      setSolutionError('Falsches Lösungswort. Versuche es nochmal!');
    }
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);
    setSuccessQuestData(null);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
    setCurrentQuest(null);
    setCurrentArea(null);
    setSolutionInput('');
    setSolutionError('');
    animateLegendIn(); // Animate legend in
  };

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
        // Show bottom sheet for main quest
        const questWithArea = { ...quest, isMainQuest: true, areaId: area.id };
        setCurrentQuest(questWithArea);
        setSolutionInput('');
        setSolutionError('');
        setBottomSheetVisible(true);
        animateLegendOut(); // Animate legend out
      }
    } else {
      // For sub quests, extract the quest ID from the marker ID (remove 'sub-' prefix)
      const questId = marker.id.replace('sub-', '');
      const quest = area.questList.find(q => q.id === questId);
      if (!quest) return;

      if (quest.completed) {
        Alert.alert('Quest abgeschlossen', 'Diese Quest wurde bereits erfolgreich abgeschlossen!');
      } else {
        // Show bottom sheet for sub quest
        const questWithArea = { ...quest, isMainQuest: false, areaId: area.id };
        setCurrentQuest(questWithArea);
        setSolutionInput('');
        setSolutionError('');
        setBottomSheetVisible(true);
        animateLegendOut(); // Animate legend out
      }
    }
  };

  const getAreaOverlayColor = (area: any) => {
    if (area.unlocked) {
      return 'rgba(255, 255, 255, 0.15)'; // Misty white overlay for unlocked
    }
    return 'rgba(0, 0, 0, 0.3)'; // Dark overlay for locked
  };

  // Create fog-like texture with multiple overlapping layers
  const createFogLayers = () => {
    const baseCoordinates = getFogOfWarCoordinates();
    const unlockedAreas = areas.filter(area => area.unlocked);
    const holes = unlockedAreas.map(area => area.coordinates);
    
    // Create multiple layers with slight variations for fog texture effect
    const layers = [
      {
        coordinates: baseCoordinates.map(coord => ({
          latitude: coord.latitude + (Math.random() - 0.5) * 0.001,
          longitude: coord.longitude + (Math.random() - 0.5) * 0.001,
        })),
        fillColor: "rgba(0, 0, 0, 0.4)",
        holes: holes
      },
      {
        coordinates: baseCoordinates.map(coord => ({
          latitude: coord.latitude + (Math.random() - 0.5) * 0.002,
          longitude: coord.longitude + (Math.random() - 0.5) * 0.002,
        })),
        fillColor: "rgba(0, 0, 0, 0.3)",
        holes: holes
      },
      {
        coordinates: baseCoordinates.map(coord => ({
          latitude: coord.latitude + (Math.random() - 0.5) * 0.003,
          longitude: coord.longitude + (Math.random() - 0.5) * 0.003,
        })),
        fillColor: "rgba(0, 0, 0, 0.2)",
        holes: holes
      }
    ];
    
    return layers;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.mapContainer}>
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
            ref={(ref) => setMapRef(ref)}
          >
            {/* Fog of War Overlay with Texture */}
            {createFogLayers().map((layer, index) => (
              <Polygon
                key={`fog-layer-${index}`}
                coordinates={layer.coordinates}
                fillColor={layer.fillColor}
                strokeColor="transparent"
                holes={layer.holes}
              />
            ))}

            {/* Quest Area Overlays */}
            {areas.map(area => (
              <Polygon
                key={area.id}
                coordinates={area.coordinates}
                fillColor={getAreaOverlayColor(area)}
                strokeColor={area.unlocked ? '#4CAF50' : '#666'}
                strokeWidth={2}
                onPress={() => handleAreaPress(area)}
              />
            ))}

            {/* Quest Markers */}
            {questMarkers.map(marker => {
              console.log('Rendering marker on map:', marker.id, marker.coordinates);
              console.log('Marker type:', marker.type, 'completed:', marker.completed);
              return (
                <Marker
                  key={marker.id}
                  coordinate={marker.coordinates}
                  tracksViewChanges={false}
                  onPress={() => handleQuestPress(marker)}
                  pinColor={marker.type === 'main' ? 'orange' : 'blue'}
                />
              );
            })}
          </MapView>

          {/* Legend - positioned as overlay within map area */}
          <Animated.View style={[styles.legend, { 
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadowColor,
            borderColor: colors.borderColor,
            transform: [
              {
                translateX: legendSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -200], // Slide left out of screen
                }),
              },
            ],
          }]}>
            <ThemedText style={[styles.legendTitle, { color: colors.text }]}>Legende</ThemedText>
            <View style={styles.legendItem}>
              <QuestMarkerIcon type="main" size={20} />
              <ThemedText style={[styles.legendLabel, { color: colors.text }]}>Hauptquest</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <QuestMarkerIcon type="sub" size={20} />
              <ThemedText style={[styles.legendLabel, { color: colors.text }]}>Unterquest</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <QuestMarkerIcon type="completed" size={20} />
              <ThemedText style={[styles.legendLabel, { color: colors.text }]}>Abgeschlossen</ThemedText>
            </View>
          </Animated.View>
        </View>

        {/* Area Info Panel */}
        <ScrollView style={styles.areaInfo} horizontal showsHorizontalScrollIndicator={false}>
          {areas.map(area => (
            <TouchableOpacity 
              key={area.id} 
              style={[styles.areaCard, { 
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadowColor,
                borderColor: colors.borderColor 
              }]}
              onPress={() => handleAreaPress(area)}
            >
              <ThemedText style={[styles.areaName, { color: colors.text }]}>{area.name}</ThemedText>
              <View style={[styles.areaStatus, { flexDirection: 'row', alignItems: 'center' }]}>
                <LockIcon isUnlocked={area.unlocked} color={colors.text} />
                <Text style={{ color: colors.text, fontSize: 12 }}>
                  {area.unlocked ? 'Freigeschaltet' : 'Gesperrt'}
                </Text>
              </View>
              <Text style={[styles.areaProgress, { color: colors.text }]}>
                {area.progress}/{area.totalQuests} Quests
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quest Bottom Sheet */}
        <QuestBottomSheet
          isVisible={bottomSheetVisible}
          onClose={handleBottomSheetClose}
          quest={currentQuest}
          solutionInput={solutionInput}
          onSolutionInputChange={setSolutionInput}
          onSolutionSubmit={handleSolutionSubmit}
          solutionError={solutionError}
        />

        {/* Success Animation */}
        {showSuccessAnimation && successQuestData && (
          <QuestSuccessAnimation
            isVisible={showSuccessAnimation}
            onAnimationComplete={handleSuccessAnimationComplete}
            questTitle={successQuestData.title}
            reward={successQuestData.reward}
          />
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    position: 'relative',
    width: width,
    height: height * 0.7,
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
    zIndex: 1000,
    elevation: 10,
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
    elevation: 10,
    zIndex: 1000,
  },
  markerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 80,
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  legend: {
    position: 'absolute',
    bottom: 5,
    left: 5,
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
    zIndex: 100,
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
    maxHeight: 80,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalReward: {
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
}); 