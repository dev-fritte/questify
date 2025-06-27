import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Text as ThemedText } from '@/components/Themed';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

interface QuestBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  quest?: any;
  area?: any;
  solutionInput?: string;
  onSolutionInputChange?: (text: string) => void;
  onSolutionSubmit?: () => void;
  onStartQuest?: () => void;
  onUnlockArea?: () => void;
  solutionError?: string;
  showSolutionInput?: boolean;
  showCancelButton?: boolean;
}

export const QuestBottomSheet: React.FC<QuestBottomSheetProps> = ({
  isVisible,
  onClose,
  quest,
  area,
  solutionInput = '',
  onSolutionInputChange,
  onSolutionSubmit,
  onStartQuest,
  onUnlockArea,
  solutionError = '',
  showSolutionInput = true,
  showCancelButton = true,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Variables
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Custom backdrop component
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    []
  );

  // Show bottom sheet when quest is available
  React.useEffect(() => {
    if (isVisible && quest) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, quest]);

  if (!quest) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 1 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.indicator}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ThemedText style={styles.title}>{quest.title}</ThemedText>
        <Text style={styles.description}>{quest.description}</Text>
        
        <Text style={styles.reward}>Belohnung: {quest.reward}</Text>
        
        {showSolutionInput && (
          <View style={styles.inputContainer}>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Lösungswort eingeben"
              value={solutionInput}
              onChangeText={onSolutionInputChange}
              onSubmitEditing={onSolutionSubmit}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {solutionError && <Text style={styles.error}>{solutionError}</Text>}
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          {onSolutionSubmit && showSolutionInput && (
            <TouchableOpacity style={styles.button} onPress={onSolutionSubmit}>
              <Text style={styles.buttonText}>Abschließen</Text>
            </TouchableOpacity>
          )}
          
          {onStartQuest && (
            <TouchableOpacity style={[styles.button, styles.startButton]} onPress={onStartQuest}>
              <Text style={styles.buttonText}>Auf Karte starten</Text>
            </TouchableOpacity>
          )}
          
          {showCancelButton && (
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onSolutionSubmit}>
              <Text style={styles.buttonText}>Bestätigen</Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
  },
  indicator: {
    backgroundColor: '#cccccc',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 22,
  },
  reward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  startButton: {
    backgroundColor: '#FF9800',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  error: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 