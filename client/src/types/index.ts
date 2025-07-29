export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  isCode?: boolean;
  timestamp: Date;
}

export interface Snippet {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

export interface Secret {
  id: string;
  name: string;
  description: string;
  value: string; // encrypted
  createdAt: Date;
}

export interface CommandHistory {
  id: string;
  command: string;
  output: string[];
  timestamp: Date;
}

export interface AppTemplate {
  id: string;
  name: string;
  description: string;
  type: 'todo' | 'portfolio' | 'dashboard' | 'blog' | 'ecommerce';
  framework: 'react' | 'vue' | 'vanilla';
  files: { path: string; content: string }[];
  preview?: string;
}

export interface NovaMessage {
  id: string;
  sender: 'user' | 'nova';
  content: string;
  timestamp: Date;
  actions?: { label: string; command: string }[];
}