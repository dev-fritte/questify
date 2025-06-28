import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface AchievementBadgeProps {
  visible: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ visible }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  if (!visible) return null;

  return (
    <View style={[styles.badge, { 
      backgroundColor: colors.warningColor,
      shadowColor: colors.shadowColor 
    }]} />
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    borderRadius: 6,
    width: 12,
    height: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 