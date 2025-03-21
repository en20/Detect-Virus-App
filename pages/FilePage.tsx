import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../components/Header';

// Interface para o arquivo selecionado
interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

// Interface para o resultado do scan
interface ScanResult {
  status: string;
  total: number;
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  timeout?: number;
  vendorResults: Array<{
    name: string;
    result: string;
    category: string;
  }>;
}

export default function FilePage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'malicious'>('all');
  const navigation = useNavigation();

  // 1. Função para selecionar arquivo
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      console.log('Seleção de arquivo:', result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      
      setSelectedFile({
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
        size: file.size
      });
      
      // Limpar resultado anterior se houver
      setScanResult(null);
      
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
    }
  };

  // 2. Função para analisar o arquivo selecionado
  const handleAnalyzeFile = async () => {
    if (!selectedFile) {
      Alert.alert('Erro', 'Selecione um arquivo primeiro');
      return;
    }

    setScanning(true);
    
    try {
      // Preparar o arquivo para upload
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name
      } as any);

      console.log('Iniciando upload do arquivo:', selectedFile.name);
      
      // Enviar arquivo para análise
      const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'x-apikey': 'ed18940bf2a5627ab6488436e4b69e7d81105219f3a61ef38db67632da7c5408'
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Falha no upload: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload concluído, ID:', uploadData.data.id);

      // Iniciar polling para verificar o resultado
      let analysisComplete = false;
      let attempts = 0;
      let analysisData = null;

      while (!analysisComplete && attempts < 12) { // 12 tentativas = 2 minutos
        await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10 segundos
        
        attempts++;
        console.log(`Verificando resultados (tentativa ${attempts})...`);
        
        const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${uploadData.data.id}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-apikey': 'ed18940bf2a5627ab6488436e4b69e7d81105219f3a61ef38db67632da7c5408'
          }
        });

        if (!analysisResponse.ok) {
          continue;
        }

        analysisData = await analysisResponse.json();
        console.log('Status:', analysisData.data.attributes.status);
        
        if (analysisData.data.attributes.status === 'completed') {
          analysisComplete = true;
          break;
        }
      }

      if (analysisComplete && analysisData) {
        const { attributes } = analysisData.data;
        
        const vendorResults = Object.entries(attributes.results || {})
          .map(([name, data]: [string, any]) => ({
            name,
            result: data.result || 'unknown',
            category: data.category || 'undetected'
          }))
          .sort((a, b) => {
            const priority = {
              'malicious': 3,
              'suspicious': 2,
              'harmless': 1, 
              'undetected': 0
            };
            return (priority[b.category] || -1) - (priority[a.category] || -1);
          });

        setScanResult({
          status: attributes.status,
          total: attributes.stats.total || 0,
          malicious: attributes.stats.malicious || 0,
          suspicious: attributes.stats.suspicious || 0,
          harmless: attributes.stats.harmless || 0,
          undetected: attributes.stats.undetected || 0,
          vendorResults
        });
      } else {
        throw new Error('Análise não foi concluída no tempo esperado');
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao analisar o arquivo');
    } finally {
      setScanning(false);
    }
  };

  // Renderização da interface
  return (
    <SafeAreaView className="flex-1 bg-[#13132B]" edges={['top']}>
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          className="items-center justify-center"
        >
          <View className="bg-[#6C72F9] rounded-full p-6 mb-4">
            <Ionicons name="document-text" size={48} color="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">Upload de Arquivo</Text>
          <Text className="text-[#B4B4D9] text-center text-base mb-8">
            Analise seus arquivos com segurança
          </Text>
        </MotiView>

        {/* Seleção de Arquivo */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          className="mb-8"
        >
          <LinearGradient
            colors={['rgba(108, 114, 249, 0.2)', 'rgba(108, 114, 249, 0.1)']}
            className="rounded-2xl p-6"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {!selectedFile ? (
              // Botão para selecionar arquivo
              <TouchableOpacity 
                className="border-2 border-dashed border-[#6C72F9] rounded-xl p-8 items-center"
                onPress={handleSelectFile}
                disabled={scanning}
              >
                <MaterialIcons name="cloud-upload" size={48} color="#6C72F9" />
                <Text className="text-white text-lg font-bold mt-4">
                  Selecione um arquivo
                </Text>
                <Text className="text-[#B4B4D9] text-center mt-2">
                  Toque para escolher um arquivo para análise
                </Text>
              </TouchableOpacity>
            ) : (
              // Arquivo selecionado
              <View>
                <View className="bg-[#1C1C3D] rounded-xl p-6 mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="insert-drive-file" size={32} color="#6C72F9" />
                    <View className="ml-3 flex-1">
                      <Text className="text-white font-bold" numberOfLines={1}>
                        {selectedFile.name}
                      </Text>
                      <Text className="text-[#B4B4D9] text-xs">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    </View>
                    <TouchableOpacity onPress={handleSelectFile} disabled={scanning}>
                      <MaterialIcons name="refresh" size={24} color="#6C72F9" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Botão para análise */}
                <TouchableOpacity 
                  className="bg-[#6C72F9] rounded-xl p-4 items-center"
                  onPress={handleAnalyzeFile}
                  disabled={scanning}
                >
                  <Text className="text-white font-bold text-lg">
                    {scanning ? "Analisando..." : "Iniciar Análise"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </MotiView>
        
        {/* Aviso importante */}
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
              <MaterialIcons name="info" size={24} color="#6C72F9" />
              <Text className="text-white text-lg font-bold ml-2">
                Importante
              </Text>
            </View>
            <Text className="text-[#B4B4D9] text-sm leading-5">
              Ao enviar arquivos, você concorda com nossos Termos de Serviço e 
              Política de Privacidade. Não envie arquivos contendo informações 
              pessoais sensíveis.
            </Text>
          </LinearGradient>
        </MotiView>

        {/* Loading state */}
        {scanning && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="items-center mb-8"
          >
            <View className="bg-[#1C1C3D] rounded-xl p-6 w-full items-center">
              <MaterialIcons name="security" size={32} color="#6C72F9" />
              <Text className="text-white text-lg font-bold mt-4">
                Analisando arquivo...
              </Text>
              <Text className="text-[#B4B4D9] text-center mt-2">
                Isso pode levar alguns minutos
              </Text>
            </View>
          </MotiView>
        )}

        {/* Resultados da análise */}
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

              {/* Lista de Vendors */}
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
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 