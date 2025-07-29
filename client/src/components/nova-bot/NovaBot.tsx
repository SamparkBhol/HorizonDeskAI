import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Zap, Code, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { NovaMessage } from '@/types';
import { storage } from '@/lib/storage';

const quickActions = [
  { label: 'Debug Help', command: 'help debug', icon: '🐛' },
  { label: 'Best Practices', command: 'show best practices', icon: '⭐' },
  { label: 'Performance Tips', command: 'performance optimization', icon: '⚡' },
  { label: 'Security Guide', command: 'security checklist', icon: '🔒' },
];

const novaResponses: Record<string, { message: string; actions?: { label: string; command: string }[] }> = {
  'help debug': {
    message: "I'll help you debug! Here are some common debugging strategies:\n\n1. Check browser console for errors\n2. Use console.log() to trace data flow\n3. Verify API endpoints and responses\n4. Check network tab for failed requests\n5. Validate your state management\n\nWhat specific issue are you facing?",
    actions: [
      { label: 'Console Errors', command: 'console error help' },
      { label: 'API Issues', command: 'api debugging' }
    ]
  },
  'show best practices': {
    message: "Here are key development best practices:\n\n✅ Code Organization:\n- Use consistent naming conventions\n- Keep components small and focused\n- Implement proper error boundaries\n\n✅ Performance:\n- Lazy load components when possible\n- Optimize images and assets\n- Use React.memo for expensive components\n\n✅ Security:\n- Validate user inputs\n- Use HTTPS in production\n- Keep dependencies updated",
    actions: [
      { label: 'Code Style Guide', command: 'code style guide' },
      { label: 'React Patterns', command: 'react patterns' }
    ]
  },
  'performance optimization': {
    message: "Performance optimization strategies:\n\n🚀 Frontend Optimization:\n- Bundle splitting with React.lazy()\n- Image optimization (WebP, lazy loading)\n- Minimize re-renders with useMemo/useCallback\n- Use React DevTools Profiler\n\n🚀 Code Optimization:\n- Remove unused dependencies\n- Tree shaking for smaller bundles\n- Enable gzip compression\n- Optimize CSS (remove unused styles)",
    actions: [
      { label: 'Bundle Analysis', command: 'bundle analysis' },
      { label: 'React Performance', command: 'react performance' }
    ]
  },
  'security checklist': {
    message: "Security checklist for web apps:\n\n🔐 Essential Security:\n- Input validation & sanitization\n- HTTPS everywhere\n- Content Security Policy (CSP)\n- Secure authentication flows\n\n🔐 Data Protection:\n- Encrypt sensitive data\n- Use secure session management\n- Implement proper CORS policies\n- Regular security audits\n\n🔐 Dependencies:\n- Keep packages updated\n- Use npm audit regularly\n- Avoid packages with known vulnerabilities",
    actions: [
      { label: 'Auth Best Practices', command: 'auth security' },
      { label: 'Data Encryption', command: 'encryption guide' }
    ]
  }
};

export default function NovaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<NovaMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = storage.getNovaMessages();
    if (savedMessages.length === 0) {
      const welcomeMessage: NovaMessage = {
        id: crypto.randomUUID(),
        sender: 'nova',
        content: "Hi! I'm Nova, your AI development assistant. I can help with debugging, best practices, performance optimization, and more. What would you like to work on?",
        timestamp: new Date(),
        actions: quickActions.map(action => ({ label: action.label, command: action.command }))
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

  const getNovaResponse = (message: string): { message: string; actions?: { label: string; command: string }[] } => {
    const lowerMessage = message.toLowerCase();
    
    // Find direct matches
    for (const [key, response] of Object.entries(novaResponses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return response;
      }
    }
    
    // Keyword-based responses
    if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      return novaResponses['help debug'];
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('slow')) {
      return novaResponses['performance optimization'];
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
      return novaResponses['security checklist'];
    }
    
    if (lowerMessage.includes('best') || lowerMessage.includes('practice')) {
      return novaResponses['show best practices'];
    }

    // Default response
    return {
      message: "I'd be happy to help! I can assist with:\n\n• Debugging and troubleshooting\n• Development best practices\n• Performance optimization\n• Security guidelines\n• Code reviews and suggestions\n\nTry asking me about debugging, performance, security, or best practices!",
      actions: quickActions.map(action => ({ label: action.label, command: action.command }))
    };
  };

  const handleSend = async (prompt?: string) => {
    const messageText = prompt || input.trim();
    if (!messageText) return;

    const userMessage: NovaMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    storage.saveNovaMessage({ sender: 'user', content: messageText });
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = getNovaResponse(messageText);
      
      const novaMessage: NovaMessage = {
        id: crypto.randomUUID(),
        sender: 'nova',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions,
      };

      setMessages(prev => [...prev, novaMessage]);
      storage.saveNovaMessage({ 
        sender: 'nova', 
        content: response.message,
        actions: response.actions 
      });
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Nova Assistant</h3>
            <p className="text-xs text-gray-400">AI Development Helper</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                message.sender === 'nova' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {message.sender === 'nova' ? 'N' : 'U'}
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.actions.map((action, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-500/20 text-xs"
                        onClick={() => handleSend(action.command)}
                      >
                        {action.label}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                N
              </div>
              <div className="flex-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Nova anything..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 text-sm"
          />
          <Button 
            onClick={() => handleSend()}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}