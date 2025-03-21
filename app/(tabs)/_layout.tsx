import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1C1C3D',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#6C72F9',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({color}) => <Text style={{color}}>Arquivo</Text>,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="file-present" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="url"
        options={{
          tabBarLabel: ({color}) => <Text style={{color}}>URL</Text>,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="link" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: ({color}) => <Text style={{color}}>Buscar</Text>,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 