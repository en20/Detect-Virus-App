import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Header from '../components/Header';

// Define types for scan results
interface VendorResult {
  name: string;
  result: string;
  category: 'malicious' | 'suspicious' | 'harmless' | 'undetected';
}

interface ScanResult {
  total: number;
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  timeout: number;
  status: string;
  vendorResults: VendorResult[];
}

export default function UrlPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'malicious'>('all');
  const navigation = useNavigation();

  const handleAnalyzeUrl = async () => {
    if (!url.trim()) return;

    // Show scanning state
    setScanning(true);
    setScanResult(null);

    // Simulate API delay
    setTimeout(() => {
      // Mock scan result data
      const mockVendorResults: VendorResult[] = [
        { name: "Vendor 1", result: "clean", category: "harmless" },
        { name: "Vendor 2", result: "malware", category: "malicious" },
        { name: "Vendor 3", result: "suspicious file", category: "suspicious" },
        { name: "Vendor 4", result: "undetected", category: "undetected" },
        { name: "Vendor 5", result: "phishing", category: "malicious" },
        { name: "Vendor 6", result: "clean", category: "harmless" },
        { name: "Vendor 7", result: "clean", category: "harmless" }
      ];

      // Set mock result
      setScanResult({
        total: 7,
        harmless: 3,
        malicious: 2,
        suspicious: 1,
        undetected: 1,
        timeout: 0,
        status: "completed",
        vendorResults: mockVendorResults
      });

      // End scanning state
      setScanning(false);
    }, 2000);
  };

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
            <Ionicons name="globe" size={48} color="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Análise de URL</Text>
          <Text className="text-[#B4B4D9] text-center text-base mb-8">
            Verifique a segurança de qualquer link
          </Text>
        </MotiView>

        {/* URL Input Section */}
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
                placeholder="Digite a URL para análise"
                placeholderTextColor="#6C72F9"
                value={url}
                onChangeText={setUrl}
                className="text-white text-base"
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
            <TouchableOpacity 
              className="bg-[#6C72F9] rounded-xl p-4 items-center"
              onPress={handleAnalyzeUrl}
            >
              <Text className="text-white font-bold text-lg">
                Analisar URL
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>

        {/* Features Section */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }}
          className="flex-row flex-wrap justify-between mb-6"
        >
          {[
            { icon: 'security', title: 'Verificação SSL' },
            { icon: 'bug-report', title: 'Detecção de Malware' },
            { icon: 'phishing', title: 'Anti-Phishing' },
            { icon: 'history', title: 'Histórico de Ameaças' },
          ].map((item, index) => (
            <View key={index} className="w-[48%] bg-[#1C1C3D] rounded-xl p-4 mb-4">
              <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#6C72F9" />
              <Text className="text-white mt-2">{item.title}</Text>
            </View>
          ))}
        </MotiView>

        {/* Recent Scans Section */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600 }}
          className="mb-8"
        >
          <LinearGradient
            colors={['rgba(108, 114, 249, 0.15)', 'rgba(28, 28, 61, 0.8)']}
            className="rounded-2xl p-6"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-row items-center mb-4">
              <MaterialIcons name="history" size={24} color="#6C72F9" />
              <Text className="text-white text-lg font-bold ml-2">
                Análises Recentes
              </Text>
            </View>
            <Text className="text-[#B4B4D9] text-sm italic">
              Nenhuma análise recente
            </Text>
          </LinearGradient>
        </MotiView>

        {scanning && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="items-center mb-8"
          >
            <View className="bg-[#1C1C3D] rounded-xl p-6 w-full items-center">
              <MaterialIcons name="security" size={32} color="#6C72F9" />
              <Text className="text-white text-lg font-bold mt-4">
                Analisando URL...
              </Text>
              <Text className="text-[#B4B4D9] text-center mt-2">
                Verificando segurança do link
              </Text>
            </View>
          </MotiView>
        )}

        {scanResult && !scanning && (
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
                    name={scanResult.malicious > 0 || scanResult.suspicious > 0 ? "warning" : "verified"} 
                    size={32} 
                    color={scanResult.malicious > 0 || scanResult.suspicious > 0 ? "#FF6B6B" : "#4CAF50"} 
                  />
                  <Text className="text-white text-lg font-bold ml-2">
                    Resultado da Análise
                  </Text>
                </View>
                <View 
                  className={`px-3 py-1 rounded-full ${
                    scanResult.malicious > 0 
                      ? "bg-[#FF6B6B33]" 
                      : scanResult.suspicious > 0 
                        ? "bg-[#FFB86C33]" 
                        : "bg-[#4CAF5033]"
                  }`}
                >
                  <Text 
                    className={`font-bold ${
                      scanResult.malicious > 0 
                        ? "text-[#FF6B6B]" 
                        : scanResult.suspicious > 0 
                          ? "text-[#FFB86C]" 
                          : "text-[#4CAF50]"
                    }`}
                  >
                    {scanResult.malicious > 0 
                      ? "Perigoso" 
                      : scanResult.suspicious > 0 
                        ? "Suspeito" 
                        : "Seguro"}
                  </Text>
                </View>
              </View>

              {/* Estatísticas em cards */}
              <View className="flex-row flex-wrap justify-between mb-4">
                {[
                  {
                    title: "Total de Scanners",
                    value: scanResult.total || 0,
                    bgColor: "bg-[#1C1C3D99]",
                    textColor: "text-[#6C72F9]"
                  },
                  {
                    title: "Seguros",
                    value: scanResult.harmless || 0,
                    bgColor: "bg-[#4CAF5033]",
                    textColor: "text-[#4CAF50]"
                  },
                  {
                    title: "Maliciosos",
                    value: scanResult.malicious || 0,
                    bgColor: "bg-[#FF6B6B33]",
                    textColor: "text-[#FF6B6B]"
                  },
                  {
                    title: "Suspeitos",
                    value: scanResult.suspicious || 0,
                    bgColor: "bg-[#FFB86C33]",
                    textColor: "text-[#FFB86C]"
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

              {/* Detalhes adicionais */}
              <View className="bg-[#1C1C3D99] p-4 rounded-lg">
                <Text className="text-[#6C72F9] mb-2">Detalhes da análise</Text>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">Não detectados:</Text>
                  <Text className="text-white">{scanResult.undetected || 0}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[#B4B4D9]">Timeout:</Text>
                  <Text className="text-white">{scanResult.timeout || 0}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[#B4B4D9]">Status:</Text>
                  <Text className="text-white">{scanResult.status || "completed"}</Text>
                </View>
              </View>

              {/* Resultados dos Vendors */}
              <View className="mt-4 bg-[#1C1C3D99] p-4 rounded-lg">
                <Text className="text-[#6C72F9] mb-3 text-lg font-bold">Análises de Segurança</Text>
                
                {/* Filtros */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                  <TouchableOpacity 
                    className={`px-3 py-1 rounded-full ${
                      activeFilter === 'all' ? 'bg-[#6C72F9]' : 'bg-[#1C1C3D99]'
                    }`}
                    onPress={() => setActiveFilter('all')}
                  >
                    <Text className="text-white">Todos ({scanResult.vendorResults?.length})</Text>
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
                      Maliciosos ({scanResult.vendorResults?.filter(v => v.category === 'malicious').length})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de Vendors */}
                <ScrollView 
                  className="max-h-[200px]" 
                  showsVerticalScrollIndicator={false}
                >
                  {scanResult.vendorResults
                    ?.filter(vendor => activeFilter === 'all' || vendor.category === 'malicious')
                    .map((vendor, index) => (
                    <View 
                      key={index} 
                      className="flex-row justify-between items-center py-2 border-b border-[#2A2A5A]"
                    >
                      <Text className="text-white flex-1">{vendor.name}</Text>
                      <View 
                        className={`px-2 py-1 rounded-full ${
                          vendor.category === 'malicious' 
                            ? 'bg-[#FF6B6B33]' 
                            : vendor.category === 'suspicious'
                              ? 'bg-[#FFB86C33]'
                              : vendor.category === 'harmless'
                                ? 'bg-[#4CAF5033]'
                                : 'bg-[#1C1C3D99]'
                        }`}
                      >
                        <Text 
                          className={
                            vendor.category === 'malicious' 
                              ? 'text-[#FF6B6B]' 
                              : vendor.category === 'suspicious'
                                ? 'text-[#FFB86C]'
                                : vendor.category === 'harmless'
                                  ? 'text-[#4CAF50]'
                                  : 'text-[#B4B4D9]'
                          }
                        >
                          {vendor.result}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Mensagem de recomendação */}
              <View className="mt-4 p-4 rounded-lg border border-[#2A2A5A]">
                <Text className="text-white text-center">
                  {scanResult.malicious > 0 
                    ? "⚠️ Esta URL foi detectada como maliciosa. Recomendamos não acessá-la."
                    : scanResult.suspicious > 0
                      ? "⚠️ Esta URL apresenta comportamento suspeito. Acesse com cautela."
                      : "✅ Esta URL parece segura, mas sempre mantenha seus dispositivos protegidos."}
                </Text>
              </View>
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 