import React from 'react';
import { Image } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

interface QuestMarkerIconProps {
  type?: 'main' | 'sub' | 'completed';
  size?: number;
  color?: string;
}

export const MainQuestIcon: React.FC<QuestMarkerIconProps> = ({ 
  size = 40
}) => (
  <Image
    source={require('@/assets/images/area-marker.png')}
    style={{
      width: size,
      height: size,
      resizeMode: 'contain',
    }}
  />
);

export const SubQuestIcon: React.FC<QuestMarkerIconProps> = ({ 
  size = 30
}) => (
  <Image
    source={require('@/assets/images/geschichte-marker.png')}
    style={{
      width: size,
      height: size,
      resizeMode: 'contain',
    }}
  />
);

export const CompletedQuestIcon: React.FC<QuestMarkerIconProps> = ({ 
  size = 35, 
  color = '#4CAF50' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 55 55" preserveAspectRatio="xMidYMid meet">
    {/* Background circle */}
    <Circle
      cx="27.5"
      cy="27.5"
      r="22"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="2"
    />
    {/* Checkmark */}
    <Path
      d="M15 27.5 L22 34.5 L40 16.5"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const QuestMarkerIcon: React.FC<QuestMarkerIconProps> = ({ 
  type = 'sub', 
  size, 
  color 
}) => {
  switch (type) {
    case 'main':
      return <MainQuestIcon size={size} />;
    case 'sub':
      return <SubQuestIcon size={size} />;
    case 'completed':
      return <CompletedQuestIcon size={size} color={color} />;
    default:
      return <SubQuestIcon size={size} />;
  }
}; 