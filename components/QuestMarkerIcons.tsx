import React from 'react';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

interface QuestMarkerIconProps {
  type?: 'main' | 'sub' | 'completed';
  size?: number;
  color?: string;
}

export const MainQuestIcon: React.FC<QuestMarkerIconProps> = ({ 
  size = 40, 
  color = '#FF6B35' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
    {/* Background circle */}
    <Circle
      cx="30"
      cy="30"
      r="25"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="3"
    />
    {/* Question mark */}
    <SvgText
      x="30"
      y="38"
      fontSize="20"
      fontWeight="bold"
      fill="#FFFFFF"
      textAnchor="middle"
    >
      ?
    </SvgText>
  </Svg>
);

export const SubQuestIcon: React.FC<QuestMarkerIconProps> = ({ 
  size = 30, 
  color = '#4A90E2' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
    {/* Background circle */}
    <Circle
      cx="25"
      cy="25"
      r="20"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="2"
    />
    {/* Dot in center */}
    <Circle
      cx="25"
      cy="25"
      r="6"
      fill="#FFFFFF"
    />
  </Svg>
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
      return <MainQuestIcon size={size} color={color} />;
    case 'sub':
      return <SubQuestIcon size={size} color={color} />;
    case 'completed':
      return <CompletedQuestIcon size={size} color={color} />;
    default:
      return <SubQuestIcon size={size} color={color} />;
  }
}; 