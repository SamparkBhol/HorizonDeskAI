import { useState, useRef, useEffect } from 'react';
import { Play, Trash2, Terminal, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { storage } from '@/lib/storage';

const quickScripts = [
  { label: 'npm install', command: 'npm install', description: 'Install dependencies', icon: '📦' },
  { label: 'npm run build', command: 'npm run build', description: 'Build for production', icon: '🔨' },
  { label: 'docker build', command: 'docker build -t myapp .', description: 'Build Docker image', icon: '🐳' },
  { label: 'git status', command: 'git status', description: 'Check Git status', icon: '🔄' },
];

const commandSimulations: Record<string, string[]> = {
  'npm install': [
    'npm WARN deprecated package@1.0.0: This package is deprecated',
    'added 1453 packages from 1163 contributors and audited 1454 packages in 45.2s',
    'found 0 vulnerabilities',
    '',
    '✨ Done in 45.23s'
  ],
  'npm run build': [
    'Creating an optimized production build...',
    'Compiled successfully.',
    '',
    'File sizes after gzip:',
    '  45.2 KB  build/static/js/main.js',
    '  2.1 KB   build/static/css/main.css',
    '',
    'The build folder is ready to be deployed.'
  ],
  'docker build': [
    'Sending build context to Docker daemon  156.7MB',
    'Step 1/8 : FROM node:18-alpine',
    ' ---> abc123def456',
    'Step 2/8 : WORKDIR /app',
    ' ---> Using cache',
    ' ---> def456ghi789',
    'Successfully built abc123def456',
    'Successfully tagged myapp:latest'
  ],
  'git status': [
    'On branch main',
    'Your branch is up to date with \'origin/main\'.',
    '',
    'Changes not staged for commit:',
    '  modified:   src/App.js',
    '  modified:   package.json',
    '',
    'no changes added to commit (use "git add" and "git commit")'
  ],
  'ls': [
    'package.json',
    'src/',
    'public/',
    'node_modules/'
  ]
};

interface TerminalLine {
  type: 'command' | 'output' | 'prompt';
  content: string;
  timestamp: Date;
}

export default function ScriptSimulator() {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to HorizonDesk Script Simulator', timestamp: new Date() },
    { type: 'output', content: 'Type a command or select from quick scripts →', timestamp: new Date() },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const executeCommand = async (command: string) => {
    if (!command.trim() || isExecuting) return;

    setIsExecuting(true);
    
    // Add command to terminal
    setTerminalLines(prev => [...prev, {
      type: 'command',
      content: `user@horizon:~$ ${command}`,
      timestamp: new Date()
    }]);

    // Save to history
    const outputs = getCommandOutput(command);
    storage.addCommand(command, outputs);

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add outputs one by one with delay
    for (let i = 0; i < outputs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setTerminalLines(prev => [...prev, {
        type: 'output',
        content: outputs[i],
        timestamp: new Date()
      }]);
    }

    setCurrentInput('');
    setIsExecuting(false);
  };

  const getCommandOutput = (command: string): string[] => {
    const matchedCommand = Object.keys(commandSimulations).find(cmd => 
      command.toLowerCase().includes(cmd.toLowerCase())
    );

    if (matchedCommand) {
      return commandSimulations[matchedCommand];
    }

    if (command.toLowerCase().startsWith('echo ')) {
      return [command.substring(5)];
    }

    if (command.toLowerCase() === 'help') {
      return [
        'Available commands:',
        '  npm install    - Install dependencies',
        '  npm run build  - Build for production',
        '  docker build   - Build Docker image',
        '  git status     - Check Git status',
        '  ls            - List directory contents',
        '  echo <text>   - Print text',
        '  clear         - Clear terminal',
        '  help          - Show this help message'
      ];
    }

    return [`Command '${command}' not found. Type 'help' for available commands.`];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.toLowerCase() === 'clear') {
      setTerminalLines([
        { type: 'output', content: 'Terminal cleared', timestamp: new Date() }
      ]);
      setCurrentInput('');
      return;
    }
    executeCommand(currentInput);
  };

  const clearTerminal = () => {
    setTerminalLines([
      { type: 'output', content: 'Terminal cleared', timestamp: new Date() }
    ]);
  };

  const commandHistory = storage.getCommandHistory();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Terminal Simulator */}
      <div className="lg:col-span-2">
        <div className="glass-panel-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Terminal className="w-8 h-8 mr-3 text-purple-400" />
              Script Simulator
            </h2>
            <Button
              onClick={clearTerminal}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Terminal Output */}
          <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-hidden font-mono text-sm">
            <ScrollArea className="h-full">
              <div ref={scrollRef} className="space-y-1">
                {terminalLines.map((line, index) => (
                  <div 
                    key={index} 
                    className={
                      line.type === 'command' ? 'terminal-text font-semibold' :
                      line.type === 'prompt' ? 'terminal-text' :
                      'text-gray-300'
                    }
                  >
                    {line.content}
                  </div>
                ))}
                {isExecuting && (
                  <div className="terminal-text">
                    <span className="animate-pulse">Executing...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Command Input */}
          <form onSubmit={handleSubmit} className="mt-4 flex space-x-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 terminal-text font-mono">
                $
              </span>
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="npm run build"
                className="pl-8 font-mono bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                disabled={isExecuting}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-500 to-blue-500"
              disabled={isExecuting}
            >
              <Play className="w-5 h-5 mr-2" />
              Run
            </Button>
          </form>
        </div>
      </div>
      
      {/* Quick Scripts & History */}
      <div className="space-y-6">
        {/* Quick Scripts */}
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Scripts</h3>
          <div className="space-y-3">
            {quickScripts.map((script, index) => (
              <button
                key={index}
                onClick={() => executeCommand(script.command)}
                className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors"
                disabled={isExecuting}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">{script.icon}</span>
                  <div>
                    <div className="font-medium">{script.label}</div>
                    <div className="text-xs text-gray-400">{script.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Command History */}
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Command History
          </h3>
          <ScrollArea className="h-48">
            <div className="space-y-2 text-sm">
              {commandHistory.slice(-10).reverse().map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setCurrentInput(entry.command)}
                  className="w-full text-left p-2 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors"
                >
                  <div className="terminal-text font-mono text-xs">{entry.command}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {entry.timestamp.toLocaleString()}
                  </div>
                </button>
              ))}
              {commandHistory.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  No commands executed yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}