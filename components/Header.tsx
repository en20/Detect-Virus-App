import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

type HeaderProps = {
  title: string;
  onMenuPress: () => void;
};

const Header = ({ title, onMenuPress }: HeaderProps) => {
  return (
    <View className="flex-row items-center justify-between py-4 px-4">
      <TouchableOpacity 
        onPress={onMenuPress} 
        className="p-2"
        activeOpacity={0.7}
      >
        <MaterialIcons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <Text className="text-[#6C72F9] text-xl font-bold">{title}</Text>
      <TouchableOpacity 
        className="p-2 opacity-0"
        activeOpacity={1}
      >
        <MaterialIcons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Header; 