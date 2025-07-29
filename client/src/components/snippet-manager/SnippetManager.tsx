import { useState, useEffect } from 'react';
import { Plus, Search, Copy, Edit2, Trash2, Download, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/storage';
import { Snippet } from '@/types';
import { useToast } from '@/hooks/use-toast';

const languages = ['JavaScript', 'TypeScript', 'Python', 'React', 'Vue', 'HTML', 'CSS', 'Docker', 'YAML', 'JSON', 'Shell'];
const categories = ['All Snippets', 'React', 'Node.js', 'Docker', 'Config Files', 'Scripts', 'Components', 'Utilities'];

export default function SnippetManager() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Snippets');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    language: '',
    tags: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    const savedSnippets = storage.getSnippets();
    setSnippets(savedSnippets);
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Snippets' || 
                           snippet.language === selectedCategory ||
                           snippet.tags.includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', code: '', language: '', tags: '' });
    setEditingSnippet(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      toast({
        title: "Error",
        description: "Name and code are required fields.",
        variant: "destructive",
      });
      return;
    }

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    if (editingSnippet) {
      storage.updateSnippet(editingSnippet.id, {
        ...formData,
        tags,
      });
      toast({
        title: "Success",
        description: "Snippet updated successfully!",
      });
    } else {
      storage.addSnippet({
        ...formData,
        tags,
      });
      toast({
        title: "Success",
        description: "Snippet added successfully!",
      });
    }

    loadSnippets();
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setFormData({
      name: snippet.name,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      tags: snippet.tags.join(', '),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteSnippet(id);
    loadSnippets();
    toast({
      title: "Success",
      description: "Snippet deleted successfully!",
    });
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Success",
        description: "Code copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(snippets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'snippets.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All Snippets') return snippets.length;
    return snippets.filter(snippet => 
      snippet.language === category || snippet.tags.includes(category.toLowerCase())
    ).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Snippet Library */}
      <div className="lg:col-span-3">
        <div className="glass-panel-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <div className="w-8 h-8 mr-3 text-green-400">📄</div>
              Smart Snippet Manager
            </h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-green-500 to-blue-500"
                  onClick={resetForm}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Snippet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSnippet ? 'Edit Snippet' : 'Add New Snippet'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Snippet name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={formData.language} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="react, hooks, api"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Textarea
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Paste your code here..."
                      className="min-h-32 font-mono"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSnippet ? 'Update' : 'Add'} Snippet
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search snippets by name, tag, or language..."
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          {/* Snippet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-green-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{snippet.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{snippet.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">{snippet.language}</Badge>
                      {snippet.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(snippet.code)}
                      className="text-gray-400 hover:text-green-400"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(snippet)}
                      className="text-gray-400 hover:text-yellow-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(snippet.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <pre className="text-sm bg-gray-900/50 p-3 rounded-lg overflow-x-auto">
                  <code className="terminal-text">{snippet.code}</code>
                </pre>
                <div className="mt-3 text-xs text-gray-400">
                  Created {snippet.createdAt.toLocaleDateString()} • {snippet.language}
                </div>
              </div>
            ))}
            
            {filteredSnippets.length === 0 && (
              <div className="col-span-2 text-center text-gray-400 py-12">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50">📄</div>
                <p className="text-lg mb-2">No snippets found</p>
                <p className="text-sm">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first snippet to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-500/20 text-green-400'
                    : 'hover:bg-gray-700/30'
                }`}
              >
                {category} ({getCategoryCount(category)})
              </button>
            ))}
          </div>
        </div>
        
        {/* Export Options */}
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Export</h3>
          <div className="space-y-3">
            <Button
              onClick={handleExportAll}
              className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            >
              <Download className="w-5 h-5 mr-2" />
              Export All (JSON)
            </Button>
            <Button
              onClick={() => toast({ title: "Info", description: "ZIP export feature coming soon!" })}
              className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            >
              <Archive className="w-5 h-5 mr-2" />
              Export Archive (ZIP)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}