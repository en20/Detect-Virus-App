import React from 'react';
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

type BottomTabsProps = {
  activeScreen: string;
  onChangeScreen: (screen: string) => void;
};

type TabItem = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

const BottomTabs = ({ activeScreen, onChangeScreen }: BottomTabsProps) => {
  const tabs: TabItem[] = [
    { id: 'FILE', icon: 'file-upload', label: 'ARQUIVO' },
    { id: 'URL', icon: 'link', label: 'URL' },
    { id: 'SEARCH', icon: 'public', label: 'IP' },
  ];

  return (
    <LinearGradient
      colors={['rgba(28, 28, 61, 0.9)', 'rgba(19, 19, 43, 0.95)']}
      className="pt-3 pb-8"
    >
      <MotiView 
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        className="flex-row justify-around items-center"
      >
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.id}
            className="items-center justify-center flex-1" 
            onPress={() => onChangeScreen(tab.id)}
            style={{
              transform: [{ scale: activeScreen === tab.id ? 1.05 : 1 }]
            }}
          >
            <MotiView
              animate={{ 
                scale: activeScreen === tab.id ? [1, 1.1, 1] : 1,
              }}
              transition={{
                type: 'timing',
                duration: 200,
              }}
            >
              <MaterialIcons 
                name={tab.icon}
                size={24} 
                color={activeScreen === tab.id ? '#6C72F9' : 'rgba(255, 255, 255, 0.5)'} 
              />
            </MotiView>
            <Text 
              className={`text-xs mt-1 font-medium ${
                activeScreen === tab.id 
                  ? 'text-[#6C72F9]' 
                  : 'text-white/50'
              }`}
            >
              {tab.label}
            </Text>
            {activeScreen === tab.id && (
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="absolute -bottom-3 w-1 h-1 rounded-full bg-[#6C72F9]"
              />
            )}
          </TouchableOpacity>
        ))}
      </MotiView>
    </LinearGradient>
  );
};

export default BottomTabs; 