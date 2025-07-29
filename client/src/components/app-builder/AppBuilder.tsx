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
        content: `import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        createdAt: new Date(),
        priority
      };
      setTodos([newTodo, ...todos]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Todo App
        </h1>
        
        {/* Add Todo Form */}
        <div className="mb-6">
          <div className="flex mb-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a new todo..."
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* Filter Buttons */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={\`flex-1 py-2 text-sm rounded-md transition-colors \${
                filter === f 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'
              }\`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {filter === 'all' ? 'No todos yet' : \`No \${filter} todos\`}
            </p>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={\`flex items-center p-3 bg-gray-50 rounded-lg border-l-4 \${
                  todo.completed ? 'opacity-60' : ''
                } \${getPriorityColor(todo.priority)}\`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-3 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <span className={\`\${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
                    {todo.text}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {todo.createdAt.toLocaleDateString()} • {todo.priority} priority
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-2 px-2 py-1 text-red-500 hover:bg-red-100 rounded"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {todos.length} total • {todos.filter(t => !t.completed).length} active • {todos.filter(t => t.completed).length} completed
        </div>
      </div>
    </div>
  );
}

export default App;`
      },
      {
        path: 'src/App.css',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

.priority-indicator {
  width: 4px;
  height: 100%;
  border-radius: 2px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item {
  animation: slideIn 0.3s ease-out;
}`
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
        content: `import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker',
    'AWS', 'GraphQL', 'MongoDB', 'Redux', 'Next.js', 'Tailwind CSS'
  ];

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      technologies: ['React', 'TypeScript', 'Socket.io', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 3,
      title: 'AI Chat Bot',
      description: 'Intelligent chatbot using OpenAI API and natural language processing',
      technologies: ['Python', 'OpenAI', 'FastAPI', 'React'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      demoUrl: '#',
      codeUrl: '#'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Portfolio
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={\`capitalize transition-colors \${
                    activeSection === section 
                      ? 'text-blue-400' 
                      : 'text-gray-300 hover:text-white'
                  }\`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className="w-full h-0.5 bg-white"></span>
                <span className="w-full h-0.5 bg-white"></span>
                <span className="w-full h-0.5 bg-white"></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4">
              {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left py-2 capitalize text-gray-300 hover:text-white"
                >
                  {section}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            John Doe
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Full Stack Developer & UI/UX Designer
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I'm a passionate full-stack developer with over 5 years of experience 
                creating digital solutions that make a difference. I specialize in 
                modern web technologies and love turning complex problems into 
                simple, beautiful designs.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, 
                contributing to open source projects, or sharing my knowledge 
                through technical writing and mentoring.
              </p>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-6xl">👨‍💻</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Skills & Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
                style={{ animationDelay: \`\${index * 0.1}s\` }}
              >
                <span className="text-lg font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: \`\${index * 0.2}s\` }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-600 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={project.demoUrl}
                      className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      Demo
                    </a>
                    <a
                      href={project.codeUrl}
                      className="flex-1 text-center py-2 border border-gray-600 hover:border-gray-500 rounded transition-colors"
                    >
                      Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-lg text-gray-300 mb-8">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:john@example.com"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <span>📧</span>
              <span>john@example.com</span>
            </a>
            <a
              href="https://linkedin.com/in/johndoe"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <span>💼</span>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/johndoe"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <span>🐙</span>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
        <p>&copy; 2024 John Doe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;`
      },
      {
        path: 'src/App.css',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-slideInLeft {
  animation: slideInLeft 0.6s ease-out forwards;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
section {
  scroll-margin-top: 80px;
}`
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
    if (!selectedTemplate || !selectedTemplate.files) return [];
    
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
    if (!files || files.length === 0) return;
    
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