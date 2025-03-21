import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Header from '../components/Header';

interface IPResult {
  id: string;
  country: string;
  continent: string;
  asn: number;
  as_owner: string;
  network: string;
  regional_internet_registry: string;
  last_analysis_stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
  };
  last_analysis_results: Record<string, {
    method: string;
    engine_name: string;
    category: string;
    result: string;
  }>;
}

export default function IPPage() {
  const [ipAddress, setIpAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [ipResult, setIpResult] = useState<IPResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'malicious'>('all');

  // Função para validar IP
  const isValidIP = (ip: string) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleIPLookup = async () => {
    if (!ipAddress.trim()) {
      Alert.alert('Erro', 'Por favor, digite um endereço IP');
      return;
    }
    
    if (!isValidIP(ipAddress)) {
      Alert.alert('Erro', 'Por favor, digite um endereço IPv4 válido (ex: 8.8.8.8)');
      return;
    }

    setSearching(true);
    setIpResult(null);

    try {
      const response = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-apikey': 'ed18940bf2a5627ab6488436e4b69e7d81105219f3a61ef38db67632da7c5408'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log('IP Lookup Response:', JSON.stringify(data, null, 2));
      
      if (data.data?.attributes) {
        setIpResult({
          id: data.data.id,
          country: data.data.attributes.country || 'Desconhecido',
          continent: data.data.attributes.continent || 'Desconhecido',
          asn: data.data.attributes.asn || 0,
          as_owner: data.data.attributes.as_owner || 'Desconhecido',
          network: data.data.attributes.network || 'Desconhecido',
          regional_internet_registry: data.data.attributes.regional_internet_registry || 'Desconhecido',
          last_analysis_stats: data.data.attributes.last_analysis_stats,
          last_analysis_results: data.data.attributes.last_analysis_results
        });
      } else {
        throw new Error('Dados incompletos ou inválidos');
      }
    } catch (error) {
      console.error('IP Lookup error:', error);
      Alert.alert('Erro', 'Falha ao analisar o endereço IP. Tente novamente mais tarde.');
    } finally {
      setSearching(false);
    }
  };

  // Lista de IPs populares para teste
  const popularIPs = ['8.8.8.8', '1.1.1.1', '208.67.222.222', '9.9.9.9'];

  return (
    <SafeAreaView className="flex-1 bg-[#13132B]" edges={['top']}>
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          className="items-center justify-center"
        >
          <View className="bg-[#6C72F9] rounded-full p-6 mb-4">
            <Ionicons name="wifi" size={48} color="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Análise de IP</Text>
          <Text className="text-[#B4B4D9] text-center text-base mb-8">
            Verifique a reputação de um endereço IP
          </Text>
        </MotiView>

        {/* IP Input Section */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          className="mb-6"
        >
          <LinearGradient
            colors={['rgba(108, 114, 249, 0.15)', 'rgba(28, 28, 61, 0.8)']}
            className="rounded-2xl p-6"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="bg-[#1C1C3D] rounded-xl p-4 mb-4">
              <TextInput
                placeholder="Digite um endereço IP (ex: 8.8.8.8)"
                placeholderTextColor="#6C72F9"
                value={ipAddress}
                onChangeText={setIpAddress}
                className="text-white text-base"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity 
              className="bg-[#6C72F9] rounded-xl p-4 items-center"
              onPress={handleIPLookup}
            >
              <Text className="text-white font-bold text-lg">
                Analisar IP
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>

        {/* Popular IPs */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }}
          className="mb-6"
        >
          <LinearGradient
            colors={['rgba(108, 114, 249, 0.15)', 'rgba(28, 28, 61, 0.8)']}
            className="rounded-2xl p-6"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-row items-center mb-4">
              <MaterialIcons name="trending-up" size={24} color="#6C72F9" />
              <Text className="text-white text-lg font-bold ml-2">
                IPs Populares
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {popularIPs.map((ip, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-[#1C1C3D] rounded-full px-4 py-2"
                  onPress={() => setIpAddress(ip)}
                >
                  <Text className="text-[#6C72F9]">{ip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </MotiView>

        {/* Features Section */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600 }}
          className="flex-row flex-wrap justify-between mb-6"
        >
          {[
            { icon: 'cloud-off', title: 'Blacklists' },
            { icon: 'place', title: 'Geolocalização' },
            { icon: 'router', title: 'Info de Rede' },
            { icon: 'security', title: 'Análise de Segurança' },
          ].map((item, index) => (
            <View key={index} className="w-[48%] bg-[#1C1C3D] rounded-xl p-4 mb-4">
              <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#6C72F9" />
              <Text className="text-white mt-2">{item.title}</Text>
            </View>
          ))}
        </MotiView>

        {searching && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="items-center mb-8"
          >
            <View className="bg-[#1C1C3D] rounded-xl p-6 w-full items-center">
              <MaterialIcons name="wifi" size={32} color="#6C72F9" />
              <Text className="text-white text-lg font-bold mt-4">
                Analisando IP...
              </Text>
              <Text className="text-[#B4B4D9] text-center mt-2">
                Verificando reputação do endereço
              </Text>
            </View>
          </MotiView>
        )}

        {ipResult && !searching && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="items-center mb-8"
          >
            <View className="bg-[#1C1C3D] rounded-xl p-6 w-full">
              {/* Header com ícone e status */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <MaterialIcons 
                    name={ipResult.last_analysis_stats.malicious > 0 ? "warning" : "verified"} 
                    size={32} 
                    color={ipResult.last_analysis_stats.malicious > 0 ? "#FF6B6B" : "#4CAF50"} 
                  />
                  <Text className="text-white text-lg font-bold ml-2">
                    IP: {ipResult.id}
                  </Text>
                </View>
                <View 
                  className={`px-3 py-1 rounded-full ${
                    ipResult.last_analysis_stats.malicious > 0 
                      ? "bg-[#FF6B6B33]" 
                      : "bg-[#4CAF5033]"
                  }`}
                >
                  <Text 
                    className={`font-bold ${
                      ipResult.last_analysis_stats.malicious > 0 
                        ? "text-[#FF6B6B]" 
                        : "text-[#4CAF50]"
                    }`}
                  >
                    {ipResult.last_analysis_stats.malicious > 0 
                      ? "Malicioso" 
                      : "Seguro"}
                  </Text>
                </View>
              </View>

              {/* Informações geográficas */}
              <View className="bg-[#1C1C3D99] p-4 rounded-lg mb-4">
                <Text className="text-[#6C72F9] mb-3">Informações Geográficas</Text>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">País:</Text>
                  <Text className="text-white">{ipResult.country}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">Continente:</Text>
                  <Text className="text-white">{ipResult.continent}</Text>
                </View>
              </View>

              {/* Informações de rede */}
              <View className="bg-[#1C1C3D99] p-4 rounded-lg mb-4">
                <Text className="text-[#6C72F9] mb-3">Informações de Rede</Text>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">ASN:</Text>
                  <Text className="text-white">{ipResult.asn}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">Proprietário:</Text>
                  <Text className="text-white">{ipResult.as_owner}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">Rede:</Text>
                  <Text className="text-white">{ipResult.network}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[#B4B4D9]">Registro:</Text>
                  <Text className="text-white">{ipResult.regional_internet_registry}</Text>
                </View>
              </View>

              {/* Estatísticas em cards */}
              <View className="flex-row flex-wrap justify-between mb-4">
                {[
                  {
                    title: "Total de Scanners",
                    value: Object.keys(ipResult.last_analysis_results).length,
                    bgColor: "bg-[#1C1C3D99]",
                    textColor: "text-[#6C72F9]"
                  },
                  {
                    title: "Seguros",
                    value: ipResult.last_analysis_stats.harmless || 0,
                    bgColor: "bg-[#4CAF5033]",
                    textColor: "text-[#4CAF50]"
                  },
                  {
                    title: "Maliciosos",
                    value: ipResult.last_analysis_stats.malicious || 0,
                    bgColor: "bg-[#FF6B6B33]",
                    textColor: "text-[#FF6B6B]"
                  },
                  {
                    title: "Não Detectados",
                    value: ipResult.last_analysis_stats.undetected || 0,
                    bgColor: "bg-[#1C1C3D99]",
                    textColor: "text-white"
                  }
                ].map((item, index) => (
                  <View 
                    key={index} 
                    className={`w-[48%] ${item.bgColor} p-4 rounded-lg mb-3 h-[80px] justify-center`}
                  >
                    <Text className={`${item.textColor} text-sm`}>{item.title}</Text>
                    <Text className="text-white text-lg font-bold mt-1">{item.value}</Text>
                  </View>
                ))}
              </View>

              {/* Lista de detectores */}
              <View className="mt-4 bg-[#1C1C3D99] p-4 rounded-lg">
                <Text className="text-[#6C72F9] mb-3 text-lg font-bold">Detectores</Text>
                
                {/* Filtros */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                  <TouchableOpacity 
                    className={`px-3 py-1 rounded-full ${
                      activeFilter === 'all' ? 'bg-[#6C72F9]' : 'bg-[#1C1C3D99]'
                    }`}
                    onPress={() => setActiveFilter('all')}
                  >
                    <Text className="text-white">Todos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className={`px-3 py-1 rounded-full ${
                      activeFilter === 'malicious' ? 'bg-[#FF6B6B33]' : 'bg-[#FF6B6B33]'
                    }`}
                    onPress={() => setActiveFilter('malicious')}
                  >
                    <Text 
                      className={`${
                        activeFilter === 'malicious' ? 'text-white' : 'text-[#FF6B6B]'
                      }`}
                    >
                      Maliciosos ({ipResult.last_analysis_stats.malicious})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de detectores */}
                <ScrollView 
                  className="max-h-[200px]" 
                  showsVerticalScrollIndicator={false}
                >
                  {Object.entries(ipResult.last_analysis_results)
                    .filter(([_, data]) => activeFilter === 'all' || data.category === 'malicious')
                    .map(([name, data], index) => (
                    <View 
                      key={index} 
                      className="flex-row justify-between items-center py-2 border-b border-[#2A2A5A]"
                    >
                      <Text className="text-white flex-1">{name}</Text>
                      <View 
                        className={`px-2 py-1 rounded-full ${
                          data.category === 'malicious' 
                            ? 'bg-[#FF6B6B33]' 
                            : data.category === 'suspicious'
                              ? 'bg-[#FFB86C33]'
                              : data.category === 'harmless'
                                ? 'bg-[#4CAF5033]'
                                : 'bg-[#1C1C3D99]'
                        }`}
                      >
                        <Text 
                          className={
                            data.category === 'malicious' 
                              ? 'text-[#FF6B6B]' 
                              : data.category === 'suspicious'
                                ? 'text-[#FFB86C]'
                                : data.category === 'harmless'
                                  ? 'text-[#4CAF50]'
                                  : 'text-[#B4B4D9]'
                          }
                        >
                          {data.result || data.category}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Mensagem de recomendação */}
              <View className="mt-4 p-4 rounded-lg border border-[#2A2A5A]">
                <Text className="text-white text-center">
                  {ipResult.last_analysis_stats.malicious > 0 
                    ? "⚠️ Este IP foi detectado como malicioso por alguns serviços. Recomendamos cautela."
                    : "✅ Este IP aparenta ser seguro, mas sempre mantenha seus dispositivos protegidos."}
                </Text>
              </View>
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 