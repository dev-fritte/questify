import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AchievementBadgeProps {
  visible: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.badge} />
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#FF9800',
    borderRadius: 6,
    width: 12,
    height: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 