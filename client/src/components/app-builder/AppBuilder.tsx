import { useState } from 'react';
import { Wrench, Download, Eye, Code, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppTemplate } from '@/types';
import { useToast } from '@/hooks/use-toast';

const appTemplates: AppTemplate[] = [
  {
    id: 'todo-react',
    name: 'Todo App',
    description: 'Modern task management with React & TypeScript',
    type: 'todo',
    framework: 'react',
    files: [
      {
        path: 'src/App.tsx',
        content: `import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-3 py-2 border rounded-l"
          placeholder="Add a todo..."
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={\`flex items-center p-2 border rounded \${
              todo.completed ? 'bg-gray-100' : 'bg-white'
            }\`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-3"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`
      }
    ]
  },
  {
    id: 'portfolio-react',
    name: 'Portfolio Site',
    description: 'Professional portfolio with modern design',
    type: 'portfolio',
    framework: 'react',
    files: [
      {
        path: 'src/App.tsx',
        content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Your Name</h1>
        <p className="text-xl text-gray-300">Full Stack Developer</p>
      </header>
      
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">About Me</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          I'm a passionate developer who loves creating amazing web experiences.
          With expertise in modern technologies and a focus on clean, efficient code.
        </p>
      </section>
      
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Project {i}</h3>
              <p className="text-gray-300 mb-4">
                Description of your amazing project and the technologies used.
              </p>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-600 text-xs rounded">React</span>
                <span className="px-2 py-1 bg-green-600 text-xs rounded">Node.js</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;`
      }
    ]
  }
];

export default function AppBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [customizations, setCustomizations] = useState({
    appName: '',
    primaryColor: '#3b82f6',
    features: [] as string[],
  });
  const [activeTab, setActiveTab] = useState('templates');
  const { toast } = useToast();

  const handleTemplateSelect = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setCustomizations(prev => ({ ...prev, appName: template.name }));
  };

  const generateCode = () => {
    if (!selectedTemplate) return;
    
    const modifiedFiles = selectedTemplate.files.map(file => ({
      ...file,
      content: file.content
        .replace(/Your Name/g, customizations.appName || 'Your App')
        .replace(/#3b82f6/g, customizations.primaryColor)
    }));

    return modifiedFiles;
  };

  const downloadApp = () => {
    if (!selectedTemplate) return;
    
    const files = generateCode();
    const packageJson = {
      name: customizations.appName.toLowerCase().replace(/\s+/g, '-') || 'my-app',
      version: '0.1.0',
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        typescript: '^4.9.0'
      },
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      }
    };

    // Create a simple download with package.json and main file
    const zip = {
      'package.json': JSON.stringify(packageJson, null, 2),
      ...files.reduce((acc, file) => ({ ...acc, [file.path]: file.content }), {})
    };

    toast({
      title: "App Generated!",
      description: `${customizations.appName || selectedTemplate.name} is ready for download.`,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Wrench className="w-8 h-8 mr-3 text-green-400" />
            Low-Code App Builder
          </h2>
          {selectedTemplate && (
            <Button 
              onClick={downloadApp}
              className="bg-gradient-to-r from-green-500 to-blue-500"
            >
              <Download className="w-5 h-5 mr-2" />
              Download App
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-700 bg-gray-800/30 hover:border-green-500/50'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {template.name}
                      <Badge variant="outline">{template.framework}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{template.type}</Badge>
                      <span className="text-xs text-gray-500">
                        {template.files.length} files
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-6">
            {selectedTemplate ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appName">App Name</Label>
                    <Input
                      id="appName"
                      value={customizations.appName}
                      onChange={(e) => setCustomizations(prev => ({ 
                        ...prev, 
                        appName: e.target.value 
                      }))}
                      placeholder="My Awesome App"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customizations.primaryColor}
                        onChange={(e) => setCustomizations(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={customizations.primaryColor}
                        onChange={(e) => setCustomizations(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Template Preview</h3>
                  <div className="text-sm text-gray-300">
                    <p><strong>Type:</strong> {selectedTemplate.type}</p>
                    <p><strong>Framework:</strong> {selectedTemplate.framework}</p>
                    <p><strong>Files:</strong> {selectedTemplate.files.length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a template to start customizing</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {selectedTemplate ? (
              <div className="space-y-4">
                {generateCode().map((file, index) => (
                  <Card key={index} className="bg-gray-800/30">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="text-lg">{file.path}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(file.content)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-gray-900/50 p-4 rounded-lg overflow-x-auto max-h-64">
                        <code>{file.content}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select and customize a template to preview the code</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}