import { Settings, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabType } from '@/pages/dashboard';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'console' as TabType, label: 'AI Console', icon: '>' },
  { id: 'snippets' as TabType, label: 'Snippets', icon: '📄' },
  { id: 'simulator' as TabType, label: 'Simulator', icon: '💻' },
  { id: 'vault' as TabType, label: 'Vault', icon: '🔒' },
  { id: 'builder' as TabType, label: 'Builder', icon: '🏗️' },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="glass-panel-dark p-4 border-b border-gray-700/50 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              HorizonDesk.AI
            </h1>
            <p className="text-xs text-gray-400">AI-Enhanced Developer Platform</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="glass-panel p-2 rounded-lg hover:bg-white/20">
            <Sun className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="glass-panel p-2 rounded-lg hover:bg-white/20">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}