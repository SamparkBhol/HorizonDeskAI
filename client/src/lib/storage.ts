import { AIMessage, Snippet, Secret, CommandHistory, NovaMessage } from '@/types';

class StorageManager {
  private getStorageKey(key: string): string {
    return `horizondesk_${key}`;
  }

  // AI Messages
  getAIMessages(): AIMessage[] {
    try {
      const data = localStorage.getItem(this.getStorageKey('ai_messages'));
      if (!data) return [];
      return JSON.parse(data).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch {
      return [];
    }
  }

  saveAIMessage(message: Omit<AIMessage, 'id' | 'timestamp'>): void {
    const messages = this.getAIMessages();
    const newMessage: AIMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    messages.push(newMessage);
    localStorage.setItem(this.getStorageKey('ai_messages'), JSON.stringify(messages));
  }

  // Snippets
  getSnippets(): Snippet[] {
    try {
      const data = localStorage.getItem(this.getStorageKey('snippets'));
      if (!data) return [];
      return JSON.parse(data).map((snippet: any) => ({
        ...snippet,
        createdAt: new Date(snippet.createdAt)
      }));
    } catch {
      return [];
    }
  }

  addSnippet(snippet: Omit<Snippet, 'id' | 'createdAt'>): void {
    const snippets = this.getSnippets();
    const newSnippet: Snippet = {
      ...snippet,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    snippets.push(newSnippet);
    localStorage.setItem(this.getStorageKey('snippets'), JSON.stringify(snippets));
  }

  updateSnippet(id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>): void {
    const snippets = this.getSnippets();
    const index = snippets.findIndex(s => s.id === id);
    if (index !== -1) {
      snippets[index] = { ...snippets[index], ...updates };
      localStorage.setItem(this.getStorageKey('snippets'), JSON.stringify(snippets));
    }
  }

  deleteSnippet(id: string): void {
    const snippets = this.getSnippets().filter(s => s.id !== id);
    localStorage.setItem(this.getStorageKey('snippets'), JSON.stringify(snippets));
  }

  // Secrets
  getSecrets(): Secret[] {
    try {
      const data = localStorage.getItem(this.getStorageKey('secrets'));
      if (!data) return [];
      return JSON.parse(data).map((secret: any) => ({
        ...secret,
        createdAt: new Date(secret.createdAt)
      }));
    } catch {
      return [];
    }
  }

  addSecret(secret: Omit<Secret, 'id' | 'createdAt'>): void {
    const secrets = this.getSecrets();
    const newSecret: Secret = {
      ...secret,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    secrets.push(newSecret);
    localStorage.setItem(this.getStorageKey('secrets'), JSON.stringify(secrets));
  }

  updateSecret(id: string, updates: Partial<Omit<Secret, 'id' | 'createdAt'>>): void {
    const secrets = this.getSecrets();
    const index = secrets.findIndex(s => s.id === id);
    if (index !== -1) {
      secrets[index] = { ...secrets[index], ...updates };
      localStorage.setItem(this.getStorageKey('secrets'), JSON.stringify(secrets));
    }
  }

  deleteSecret(id: string): void {
    const secrets = this.getSecrets().filter(s => s.id !== id);
    localStorage.setItem(this.getStorageKey('secrets'), JSON.stringify(secrets));
  }

  // Command History
  getCommandHistory(): CommandHistory[] {
    try {
      const data = localStorage.getItem(this.getStorageKey('command_history'));
      if (!data) return [];
      return JSON.parse(data).map((cmd: any) => ({
        ...cmd,
        timestamp: new Date(cmd.timestamp)
      }));
    } catch {
      return [];
    }
  }

  addCommand(command: string, output: string[]): void {
    const history = this.getCommandHistory();
    const newCommand: CommandHistory = {
      id: crypto.randomUUID(),
      command,
      output,
      timestamp: new Date(),
    };
    history.push(newCommand);
    
    // Keep only last 50 commands
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    localStorage.setItem(this.getStorageKey('command_history'), JSON.stringify(history));
  }

  // Nova Messages
  getNovaMessages(): NovaMessage[] {
    try {
      const data = localStorage.getItem(this.getStorageKey('nova_messages'));
      if (!data) return [];
      return JSON.parse(data).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch {
      return [];
    }
  }

  saveNovaMessage(message: Omit<NovaMessage, 'id' | 'timestamp'>): void {
    const messages = this.getNovaMessages();
    const newMessage: NovaMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    messages.push(newMessage);
    localStorage.setItem(this.getStorageKey('nova_messages'), JSON.stringify(messages));
  }

  // Clear all data
  clearAllData(): void {
    const keys = ['ai_messages', 'snippets', 'secrets', 'command_history', 'nova_messages'];
    keys.forEach(key => localStorage.removeItem(this.getStorageKey(key)));
  }
}

export const storage = new StorageManager();