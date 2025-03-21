import React from 'react';
import { View, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

const LegalInfo = () => (
  <View className="px-8 mb-4">
    <Text className="text-gray-400 text-center text-xs">
      By submitting data above, you are agreeing to our Terms of Service and Privacy Notice, 
      and to the sharing of your sample submission with the security community.
    </Text>

    <View className="flex-row items-center mt-4 justify-center">
      <MaterialIcons name="info-outline" size={16} color="#666" />
      <Text className="text-gray-400 text-xs ml-2">
        Want to automate submissions? Check our API
      </Text>
    </View>
  </View>
);

export default LegalInfo; 