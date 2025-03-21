import React from 'react';
import { View, Text, ScrollView, Animated, Dimensions } from "react-native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const AboutPage = () => {
  // Use the useNavigation hook to get the navigation object in Expo Router
  const navigation = useNavigation();
  
  const CardSection = ({ icon, title, content, delay = 0 }: { icon: React.ReactNode, title: string, content: string, delay?: number } ) => (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay, type: 'timing', duration: 800 }}
      className="mb-6"
    >
      <LinearGradient
        colors={['rgba(108, 114, 249, 0.15)', 'rgba(28, 28, 61, 0.8)']}
        className="rounded-2xl p-6"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-row items-center mb-4">
          <View className="bg-[#6C72F9] rounded-full p-2 mr-3">
            {icon}
          </View>
          <Text className="text-white text-xl font-bold">{title}</Text>
        </View>
        <Text className="text-[#B4B4D9] leading-6 text-base">
          {content}
        </Text>
      </LinearGradient>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#13132B]" edges={['top']}>
      <Header 
        title="SOBRE NÓS" 
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
      />
      
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          className="items-center justify-center py-8"
        >
          <View className="bg-[#6C72F9] rounded-full p-6 mb-4">
            <Ionicons name="shield-checkmark" size={48} color="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Virus Scanner</Text>
          <Text className="text-[#B4B4D9] text-center text-base mb-8">
            Sua segurança é nossa prioridade
          </Text>
        </MotiView>

        {/* Cards Section */}
        <CardSection
          icon={<MaterialIcons name="security" size={24} color="#fff" />}
          title="Nossa Missão"
          content="Proporcionar uma plataforma segura e eficiente para a detecção e análise de vírus e malwares, protegendo usuários contra ameaças digitais através de tecnologia avançada e confiável."
          delay={200}
        />

        <CardSection
          icon={<MaterialIcons name="groups" size={24} color="#fff" />}
          title="Quem Somos"
          content="Somos uma equipe dedicada de especialistas em segurança cibernética, unidos pela missão de tornar a internet um lugar mais seguro. Nossa aplicação oferece ferramentas poderosas para verificar arquivos, URLs e realizar pesquisas de segurança com precisão e eficiência."
          delay={400}
        />

        <CardSection
          icon={<MaterialIcons name="history" size={24} color="#fff" />}
          title="Nossa História"
          content="Fundada em 2023, nossa plataforma nasceu da necessidade de democratizar a segurança digital. Desde então, temos evoluído constantemente, incorporando as mais recentes tecnologias de detecção de ameaças e mantendo nosso compromisso com a proteção dos usuários."
          delay={600}
        />

        {/* Stats Section */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 800, type: 'timing', duration: 800 }}
          className="flex-row justify-between mb-8 mt-4"
        >
          <View className="items-center bg-[#1C1C3D] rounded-xl p-4 flex-1 mx-1">
            <Text className="text-[#6C72F9] text-2xl font-bold">100K+</Text>
            <Text className="text-[#B4B4D9] text-sm">Arquivos Analisados</Text>
          </View>
          <View className="items-center bg-[#1C1C3D] rounded-xl p-4 flex-1 mx-1">
            <Text className="text-[#6C72F9] text-2xl font-bold">99.9%</Text>
            <Text className="text-[#B4B4D9] text-sm">Taxa de Precisão</Text>
          </View>
        </MotiView>

        {/* Footer Section */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1000 }}
          className="items-center mb-8"
        >
          <Text className="text-[#6C72F9] text-sm font-bold mb-2">
            Versão 1.0.0
          </Text>
          <Text className="text-[#B4B4D9] text-xs text-center">
            © 2023 Virus Scanner. Todos os direitos reservados.
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutPage; 