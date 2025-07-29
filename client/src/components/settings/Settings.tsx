import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/storage';

interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  autoSave: boolean;
  notifications: boolean;
  developerMode: boolean;
  aiAssistant: boolean;
  terminalHistory: number;
  codeEditor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    lineNumbers: boolean;
    minimap: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
    usageData: boolean;
  };
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'en',
  autoSave: true,
  notifications: true,
  developerMode: false,
  aiAssistant: true,
  terminalHistory: 50,
  codeEditor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
  },
  privacy: {
    analytics: false,
    crashReports: true,
    usageData: false,
  }
};

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('horizondesk_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        // Use defaults if parsing fails
      }
    }
  }, []);

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newSettings;
    });
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('horizondesk_settings', JSON.stringify(settings));
    setUnsavedChanges(false);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setUnsavedChanges(true);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'horizondesk-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Settings file has been downloaded.",
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...imported });
        setUnsavedChanges(true);
        toast({
          title: "Settings Imported",
          description: "Settings have been imported successfully.",
        });
      } catch {
        toast({
          title: "Import Failed",
          description: "Invalid settings file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all application data? This cannot be undone.')) {
      storage.clearAllData();
      localStorage.removeItem('horizondesk_settings');
      toast({
        title: "Data Cleared",
        description: "All application data has been removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-emerald-400" />
            Settings
          </h2>
          {unsavedChanges && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Unsaved Changes
            </Badge>
          )}
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-800/30">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30">
              <CardHeader>
                <CardTitle>Behavior</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave">Auto Save</Label>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="aiAssistant">AI Assistant (Nova)</Label>
                  <Switch
                    id="aiAssistant"
                    checked={settings.aiAssistant}
                    onCheckedChange={(checked) => updateSetting('aiAssistant', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card className="bg-gray-800/30">
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    min="10"
                    max="24"
                    value={settings.codeEditor.fontSize}
                    onChange={(e) => updateSetting('codeEditor.fontSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tabSize">Tab Size</Label>
                  <Select 
                    value={settings.codeEditor.tabSize.toString()} 
                    onValueChange={(value) => updateSetting('codeEditor.tabSize', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="wordWrap">Word Wrap</Label>
                  <Switch
                    id="wordWrap"
                    checked={settings.codeEditor.wordWrap}
                    onCheckedChange={(checked) => updateSetting('codeEditor.wordWrap', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lineNumbers">Line Numbers</Label>
                  <Switch
                    id="lineNumbers"
                    checked={settings.codeEditor.lineNumbers}
                    onCheckedChange={(checked) => updateSetting('codeEditor.lineNumbers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="minimap">Minimap</Label>
                  <Switch
                    id="minimap"
                    checked={settings.codeEditor.minimap}
                    onCheckedChange={(checked) => updateSetting('codeEditor.minimap', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gray-800/30">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-gray-400">Help improve the app by sharing usage analytics</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) => updateSetting('privacy.analytics', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="crashReports">Crash Reports</Label>
                    <p className="text-sm text-gray-400">Automatically send crash reports to help fix bugs</p>
                  </div>
                  <Switch
                    id="crashReports"
                    checked={settings.privacy.crashReports}
                    onCheckedChange={(checked) => updateSetting('privacy.crashReports', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="usageData">Usage Data</Label>
                    <p className="text-sm text-gray-400">Share feature usage data for product improvements</p>
                  </div>
                  <Switch
                    id="usageData"
                    checked={settings.privacy.usageData}
                    onCheckedChange={(checked) => updateSetting('privacy.usageData', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-gray-800/30">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="developerMode">Developer Mode</Label>
                  <Switch
                    id="developerMode"
                    checked={settings.developerMode}
                    onCheckedChange={(checked) => updateSetting('developerMode', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terminalHistory">Terminal History Size</Label>
                  <Input
                    id="terminalHistory"
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.terminalHistory}
                    onChange={(e) => updateSetting('terminalHistory', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="bg-gray-800/30">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={exportSettings} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      style={{ display: 'none' }}
                      id="import-settings"
                    />
                    <Button 
                      onClick={() => document.getElementById('import-settings')?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Settings
                    </Button>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <Button 
                    onClick={clearAllData} 
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    This will remove all snippets, secrets, chat history, and settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-8">
          <Button onClick={resetSettings} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={!unsavedChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}