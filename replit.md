# HorizonDesk.AI - Developer Platform

## Overview

HorizonDesk.AI is a frontend-only AI-enhanced developer platform designed for professional developers and small teams. It provides tools for managing dev workflows, generating code snippets, simulating scripts, and building low-code applications. The platform features a modern glassmorphism UI with terminal-inspired elements and an interactive AI assistant named Nova.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **State Management**: TanStack Query for server state, local React state for UI
- **Storage**: Browser-based storage (localStorage, IndexedDB) with Web Crypto API

### Backend Architecture (Minimal)
- **Server**: Express.js for development server only
- **Database**: Drizzle ORM with PostgreSQL schema (configured but not actively used)
- **Data Persistence**: All data stored client-side using browser storage APIs
- **Session Management**: In-memory storage implementation for development

### Design System
- **Theme**: Dark mode with glassmorphism effects
- **Typography**: Inter font family
- **Color Palette**: Blue/purple gradient accents with neutral grays
- **Components**: Consistent design tokens via CSS custom properties
- **Animations**: Smooth transitions and ambient lighting effects

## Key Components

### 1. AI Console
- **Purpose**: Natural language interface for generating development configs and scripts
- **Features**: Hardcoded AI responses for Docker, CI/CD, and environment configs
- **Storage**: Chat history persisted in localStorage
- **UI**: Terminal-inspired interface with syntax highlighting

### 2. Snippet Manager
- **Purpose**: Store, categorize, and manage code snippets
- **Features**: Search, filtering by language/tags, import/export functionality
- **Storage**: localStorage with full CRUD operations
- **UI**: Grid layout with syntax highlighting and metadata display

### 3. Script Simulator
- **Purpose**: Simulate command-line operations with realistic output
- **Features**: Predefined script simulations (npm, docker, git commands)
- **Storage**: Command history tracking
- **UI**: Terminal-style interface with animated output

### 4. Secret Vault
- **Purpose**: Encrypted storage for API keys and sensitive configuration
- **Features**: Web Crypto API encryption, secure export/import
- **Storage**: Encrypted data in localStorage
- **Security**: Client-side encryption with PBKDF2 key derivation

### 5. App Builder
- **Purpose**: Low-code application templates and generators
- **Features**: Predefined templates (Todo app, portfolio, etc.)
- **Storage**: Template configurations and user customizations
- **UI**: Live code preview with export functionality

### 6. Nova Bot
- **Purpose**: Interactive AI assistant for development guidance
- **Features**: Contextual help, hardcoded responses for common queries
- **Storage**: Chat history and user preferences
- **UI**: Floating chat interface with quick action buttons

## Data Flow

### Client-Side Storage Pattern
1. **Data Input**: User interactions trigger state updates
2. **Local Processing**: Business logic handled in React components
3. **Storage Operations**: StorageManager class handles localStorage/IndexedDB operations
4. **State Synchronization**: React state updated after successful storage operations
5. **UI Updates**: Components re-render based on state changes

### Security Flow (Secret Vault)
1. **Input**: User provides sensitive data and optional password
2. **Encryption**: CryptoManager encrypts data using Web Crypto API
3. **Storage**: Encrypted data stored in localStorage
4. **Retrieval**: Data decrypted on-demand for display
5. **Export**: Encrypted blobs can be shared securely

## External Dependencies

### Core Dependencies
- **@radix-ui/***: Accessible UI primitives for complex components
- **@tanstack/react-query**: Server state management and caching
- **lucide-react**: Icon library for consistent iconography
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management
- **wouter**: Lightweight routing solution

### Development Dependencies
- **vite**: Fast build tool with HMR support
- **typescript**: Type safety and developer experience
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Storage and Crypto
- **Web APIs**: localStorage, IndexedDB, Web Crypto API (native browser APIs)
- **No external storage**: All data persisted client-side

### Database Configuration (Unused)
- **drizzle-orm**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Note**: Database is configured but not actively used; app is frontend-only

## Deployment Strategy

### Build Process
1. **Development**: Vite dev server with HMR
2. **Build**: Vite production build with code splitting
3. **Assets**: Static assets bundled and optimized
4. **Output**: Static files suitable for any CDN/hosting platform

### Hosting Requirements
- **Type**: Static site hosting (Vercel, Netlify, Hostinger)
- **Requirements**: HTML/CSS/JS serving capability only
- **No backend**: All functionality runs in browser
- **Storage**: Browser-local storage only

### Environment Configuration
- **Development**: Local Vite server with live reload
- **Production**: Static file serving with client-side routing
- **Database**: PostgreSQL configured for potential future use
- **Environment Variables**: DATABASE_URL for development setup

### Performance Considerations
- **Bundle Splitting**: Vite automatically splits vendor and app code
- **Lazy Loading**: Route-based code splitting implemented
- **Caching**: TanStack Query provides client-side caching
- **Assets**: Images and static assets optimized by Vite

The application is designed to be completely self-contained in the browser, requiring no backend infrastructure for core functionality while maintaining the flexibility to add server-side features in the future.