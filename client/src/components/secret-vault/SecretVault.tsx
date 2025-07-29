import { useState, useEffect } from 'react';
import { Plus, Key, Copy, Edit2, Trash2, Download, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { storage } from '@/lib/storage';
import { cryptoManager } from '@/lib/crypto';
import { Secret } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function SecretVault() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSecrets();
  }, []);

  const loadSecrets = () => {
    const savedSecrets = storage.getSecrets();
    setSecrets(savedSecrets);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', value: '' });
    setEditingSecret(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value) {
      toast({
        title: "Error",
        description: "Name and value are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const encryptedValue = await cryptoManager.encrypt(formData.value);

      if (editingSecret) {
        storage.updateSecret(editingSecret.id, {
          ...formData,
          value: encryptedValue,
        });
        toast({
          title: "Success",
          description: "Secret updated successfully!",
        });
      } else {
        storage.addSecret({
          ...formData,
          value: encryptedValue,
        });
        toast({
          title: "Success",
          description: "Secret added successfully!",
        });
      }

      loadSecrets();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encrypt secret. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (encryptedValue: string) => {
    try {
      const decryptedValue = await cryptoManager.decrypt(encryptedValue);
      await navigator.clipboard.writeText(decryptedValue);
      toast({
        title: "Success",
        description: "Secret copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy secret to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteSecret(id);
    loadSecrets();
    toast({
      title: "Success",
      description: "Secret deleted successfully!",
    });
  };

  const getSecretIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('database') || lowerName.includes('db')) return '🗄️';
    if (lowerName.includes('api') || lowerName.includes('key')) return '🔑';
    if (lowerName.includes('password') || lowerName.includes('pass')) return '🔒';
    if (lowerName.includes('token')) return '🎫';
    return '🔐';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="glass-panel-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Key className="w-8 h-8 mr-3 text-yellow-400" />
              Encrypted Secret Vault
            </h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500"
                  onClick={resetForm}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Secret
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSecret ? 'Edit Secret' : 'Add New Secret'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="DATABASE_URL"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Production database connection string"
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Secret Value</Label>
                    <Textarea
                      id="value"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Enter your secret value..."
                      className="font-mono"
                      required
                    />
                  </div>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your secret will be encrypted using AES-256-GCM before storage.
                    </AlertDescription>
                  </Alert>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSecret ? 'Update' : 'Add'} Secret
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Alert className="mb-6 border-green-500/20 bg-green-500/10">
            <Shield className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <strong>Vault Secured</strong> - All secrets encrypted with Web Crypto API (AES-256-GCM)
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {secrets.map((secret) => (
              <div
                key={secret.id}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl">
                      {getSecretIcon(secret.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{secret.name}</h3>
                      <p className="text-sm text-gray-400">{secret.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(secret.value)}
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(secret.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {secrets.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50">🔒</div>
                <p className="text-lg mb-2">No secrets stored</p>
                <p className="text-sm">Add your first secret to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="glass-panel-dark rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Vault Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Secrets</span>
              <span className="font-semibold">{secrets.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Encryption</span>
              <span className="text-green-400 text-sm">AES-256-GCM</span>
            </div>
          </div>
        </div>
        
        <div className="glass-panel-dark rounded-2xl p-6 border-yellow-500/20">
          <Alert>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription>
              <strong className="text-yellow-400">Security Notice</strong>
              <br />
              All secrets are encrypted locally using Web Crypto API. Never stored in plain text.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}