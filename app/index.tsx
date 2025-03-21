import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Header from "../components/Header";
import TabButton from "../components/TabButton";
import BottomTabs from "../components/BottomTabs";
import FilePage from "../pages/FilePage";
import UrlPage from "../pages/UrlPage";
import SearchPage from "../pages/SearchPage";

type TabType = 'FILE' | 'URL' | 'SEARCH';

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>('FILE');
  const navigation = useNavigation();

  const renderPage = () => {
    switch (activeTab) {
      case 'FILE':
        return <FilePage />;
      case 'URL':
        return <UrlPage />;
      case 'SEARCH':
        return <SearchPage />;
      default:
        return <FilePage />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#13132B]" edges={['top']}>
      <Header 
        title="VIRUSTOTAL TEST APP" 
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
      />
      {/* Content */}
      <ScrollView className="flex-1">
        {renderPage()}
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <BottomTabs 
        activeScreen={activeTab} 
        onChangeScreen={(screen) => setActiveTab(screen as TabType)} 
      />
    </SafeAreaView>
  );
}
