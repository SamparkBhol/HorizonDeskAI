import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';
import AIConsole from '@/components/ai-console/AIConsole';
import SnippetManager from '@/components/snippet-manager/SnippetManager';
import ScriptSimulator from '@/components/script-simulator/ScriptSimulator';
import SecretVault from '@/components/secret-vault/SecretVault';
import AppBuilder from '@/components/app-builder/AppBuilder';
import Settings from '@/components/settings/Settings';
import NovaBot from '@/components/nova-bot/NovaBot';

export type TabType = 'console' | 'snippets' | 'simulator' | 'vault' | 'builder' | 'settings';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('console');

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {activeTab === 'console' && <AIConsole />}
        {activeTab === 'snippets' && <SnippetManager />}
        {activeTab === 'simulator' && <ScriptSimulator />}
        {activeTab === 'vault' && <SecretVault />}
        {activeTab === 'builder' && <AppBuilder />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <NovaBot />
    </div>
  );
}
