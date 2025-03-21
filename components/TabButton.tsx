import React from 'react';
import { Text, TouchableOpacity } from "react-native";

type TabButtonProps = {
  tab: string;
  isActive: boolean;
  onPress: () => void;
};

const TabButton = ({ tab, isActive, onPress }: TabButtonProps) => (
  <TouchableOpacity 
    className={`px-4 py-2 ${isActive ? 'border-b-2 border-[#6C72F9]' : ''}`}
    onPress={onPress}
  >
    <Text className={isActive ? 'text-[#6C72F9]' : 'text-gray-400'}>
      {tab}
    </Text>
  </TouchableOpacity>
);

export default TabButton; 