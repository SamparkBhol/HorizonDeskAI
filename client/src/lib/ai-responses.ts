interface AIResponse {
  message: string;
  code?: string;
}

export function getAIResponse(input: string): AIResponse {
  const lowerInput = input.toLowerCase();

  // Docker-related responses
  if (lowerInput.includes('dockerfile') || lowerInput.includes('docker')) {
    if (lowerInput.includes('next') || lowerInput.includes('nextjs') || lowerInput.includes('react')) {
      return {
        message: "I'll create a Dockerfile for a Next.js application with NGINX for production deployment.",
        code: `# Multi-stage build for Next.js with NGINX
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage with NGINX
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/out /usr/share/nginx/html

# Custom NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
      };
    }
    
    return {
      message: "Here's a Dockerfile for a Node.js application with best practices:",
      code: `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]`
    };
  }

  // CI/CD Pipeline responses
  if (lowerInput.includes('github') && (lowerInput.includes('action') || lowerInput.includes('ci') || lowerInput.includes('deploy'))) {
    return {
      message: "I'll create a GitHub Action workflow for deploying a Node.js application:",
      code: `name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      run: |
        echo "Deploying to production server..."
        # Add your deployment commands here`
    };
  }

  // Environment configuration
  if (lowerInput.includes('env') || lowerInput.includes('environment') || lowerInput.includes('config')) {
    return {
      message: "Here's a comprehensive .env template for a full-stack application:",
      code: `# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SENDGRID_API_KEY=SG...

# Application Settings
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001

# File Upload
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info`
    };
  }

  // Package.json generation
  if (lowerInput.includes('package.json') || lowerInput.includes('dependencies')) {
    return {
      message: "I'll create a modern package.json with essential dependencies:",
      code: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "Modern web application",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "test": "jest",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "typescript": "^5.0.0"
  }
}`
    };
  }

  // API routes or endpoints
  if (lowerInput.includes('api') || lowerInput.includes('endpoint') || lowerInput.includes('route')) {
    return {
      message: "Here's a REST API structure with Express.js:",
      code: `// routes/api.js
const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update(req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;`
    };
  }

  // Default response
  return {
    message: `I can help you generate various configurations and code snippets. Try asking me about:

• Dockerfile for different frameworks (Next.js, React, Node.js)
• GitHub Actions for CI/CD pipelines
• Environment configuration (.env files)
• Package.json with modern dependencies
• API routes and endpoints
• Database schemas and migrations
• Authentication and security setup

What would you like me to help you build?`
  };
}