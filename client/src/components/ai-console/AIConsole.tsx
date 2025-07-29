import { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIResponse } from '@/lib/ai-responses';
import { storage } from '@/lib/storage';
import { AIMessage } from '@/types';

const quickActions = [
  { label: 'Dockerfile Generator', prompt: 'Create Dockerfile for Next.js + NGINX', icon: '🐳' },
  { label: 'CI/CD Pipeline', prompt: 'Generate GitHub Action to deploy Node app', icon: '⚡' },
  { label: 'Environment Config', prompt: 'Create .env template for full-stack app', icon: '🔧' },
];

export default function AIConsole() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = storage.getAIMessages();
    if (savedMessages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        content: "Hello! I'm your AI development assistant. Ask me to generate configs, scripts, or help with your development workflow.",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (prompt?: string) => {
    const messageText = prompt || input.trim();
    if (!messageText) return;

    const userMessage: AIMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    storage.saveAIMessage({ sender: 'user', content: messageText });
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(messageText);
      
      const aiMessage: AIMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      storage.saveAIMessage({ sender: 'ai', content: response.message });

      if (response.code) {
        const codeMessage: AIMessage = {
          id: crypto.randomUUID(),
          sender: 'ai',
          content: response.code,
          isCode: true,
          timestamp: new Date(),
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, codeMessage]);
          storage.saveAIMessage({ sender: 'ai', content: response.code, isCode: true });
        }, 500);
      }

      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat Interface */}
      <div className="lg:col-span-2">
        <div className="glass-panel-dark rounded-2xl p-6 ambient-glow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Lightbulb className="w-8 h-8 mr-3 text-blue-400" />
              AI Dev Console
            </h2>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              ● Online
            </span>
          </div>
          
          {/* Chat History */}
          <ScrollArea className="bg-gray-900/50 rounded-xl p-4 mb-4 h-96">
            <div ref={scrollRef} className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    message.sender === 'ai' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {message.sender === 'ai' ? 'AI' : 'U'}
                  </div>
                  <div className="flex-1">
                    {message.isCode ? (
                      <pre className="text-sm bg-gray-900/50 p-3 rounded-lg overflow-x-auto mt-2">
                        <code className="terminal-text">{message.content}</code>
                      </pre>
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{message.content}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="flex space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: 'Create Dockerfile for Next.js + NGINX' or 'Generate GitHub Action for Node.js deploy'"
              className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
            />
            <Button 
              onClick={() => handleSend()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Quick Actions & Recent */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSend(action.prompt)}
                className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">{action.icon}</span>
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-gray-400">{action.prompt}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Recent Generations */}
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
          <div className="space-y-3">
            {messages.filter(m => m.sender === 'ai' && m.isCode).slice(-3).map((message) => (
              <div key={message.id} className="p-3 bg-gray-800/30 rounded-lg">
                <div className="text-sm font-medium mb-1">Generated Code</div>
                <div className="text-xs text-gray-400">
                  {message.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
            {messages.filter(m => m.isCode).length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <div className="w-12 h-12 mx-auto mb-3 opacity-50">📄</div>
                <p>No recent generations</p>
                <p className="text-xs">Generated files will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}