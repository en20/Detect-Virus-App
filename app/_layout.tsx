import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ route }) => ({
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#1C1C3D',
            width: 250,
            position: 'absolute',
          },
          drawerType: 'front',
          overlayColor: 'rgba(0,0,0,0.7)',
          drawerLabelStyle: {
            color: '#fff'
          },
          drawerActiveTintColor: '#6C72F9',
          drawerInactiveTintColor: '#ccc',
          drawerItemStyle: {
            display: route.name === 'index' || route.name === 'about' ? 'flex' : 'none'
          }
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: () => <Text style={{color: '#fff'}}>Início</Text>,
            drawerIcon: ({color}) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: () => <Text style={{color: '#fff'}}>Sobre</Text>,
            drawerIcon: ({color}) => (
              <MaterialIcons name="info" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
