# Configuration and Environment Setup

## Development Environment Requirements

### Node.js and Package Management
- **Node.js**: Version 18+ (recommended: use nvm for version management)
- **Package Manager**: npm (included with Node.js)
- **Alternative**: bun or pnpm can be used but npm is project standard

### Installation Steps
```bash
# 1. Clone the repository
git clone <repository-url>
cd <project-directory>

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Development Server
- **Host**: `::` (all interfaces)
- **Port**: `8080`
- **URL**: `http://localhost:8080`
- **Hot Reload**: Enabled via Vite
- **Type Checking**: Real-time TypeScript compilation

## Environment Variables

### Current Configuration
The project currently uses **hardcoded Supabase credentials** directly in the client code. This is acceptable for development but should be changed for production.

**File**: `src/integrations/supabase/client.ts`
```typescript
const SUPABASE_URL = "https://waddtxhguitjhdtqydbe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Environment Variable Setup (For Future Use)
Create `.env.local` for local development:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://waddtxhguitjhdtqydbe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Payment Integration (when implemented)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics (when implemented)
VITE_GOOGLE_ANALYTICS_ID=G-...

# Feature Flags (when needed)
VITE_ENABLE_BETA_FEATURES=false
```

### Environment Files Structure
```
.env.local           # Local development (gitignored)
.env.development     # Development defaults
.env.production      # Production overrides
.env.example         # Template file (committed)
```

## Build Configuration

### Vite Configuration
**File**: `vite.config.ts`

**Key Settings**:
- **React Plugin**: SWC-based for fast compilation
- **Path Aliases**: `@` mapped to `./src`
- **Development Server**: IPv6 support on port 8080
- **Component Tagger**: Development-only plugin for Lovable

**Build Targets**:
```bash
npm run build        # Production build
npm run build:dev    # Development build (with dev features)
npm run preview      # Preview production build locally
```

### TypeScript Configuration
**Files**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

**Key Settings**:
- **Target**: ES2020 for modern browser support
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (automatic runtime)
- **Strict Mode**: Enabled for type safety
- **Path Mapping**: `@/*` alias configured

## Code Quality Tools

### ESLint Configuration
**File**: `eslint.config.js`

**Enabled Rules**:
- TypeScript recommended rules
- React hooks rules
- React refresh rules
- Custom rule: `@typescript-eslint/no-unused-vars` disabled

**Linting Command**:
```bash
npm run lint         # Check code quality
```

### Editor Configuration
**Recommended VSCode Extensions**:
- TypeScript and JavaScript support
- ESLint integration
- Tailwind CSS IntelliSense
- Auto import management
- Prettier formatting

**VSCode Settings** (recommended `.vscode/settings.json`):
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Dependency Management

### Core Dependencies
- **React Ecosystem**: react@18.3.1, react-dom@18.3.1, react-router-dom@6.26.2
- **State Management**: @tanstack/react-query@5.56.2
- **UI Framework**: Multiple @radix-ui packages for primitives
- **Styling**: tailwindcss@3.4.11, tailwindcss-animate@1.0.7
- **Backend**: @supabase/supabase-js@2.50.5
- **Form Handling**: react-hook-form@7.53.0, @hookform/resolvers@3.9.0
- **Utilities**: date-fns@3.6.0, lucide-react@0.462.0, clsx@2.1.1

### Development Dependencies
- **Build Tools**: vite@5.4.1, @vitejs/plugin-react-swc@3.5.0
- **Type Checking**: typescript@5.5.3, @types/*
- **Linting**: eslint@9.9.0, typescript-eslint@8.0.1
- **Styling**: autoprefixer@10.4.20, postcss@8.4.47

### Dependency Update Strategy
```bash
# Check for outdated packages
npm outdated

# Update minor/patch versions
npm update

# Update major versions (review breaking changes)
npm install package@latest
```

## Database Configuration

### Supabase Project Setup
- **Project ID**: waddtxhguitjhdtqydbe
- **Region**: Auto-selected by Supabase
- **Pricing Plan**: Free tier (suitable for development)

### Database Access
- **Connection**: Handled automatically by Supabase client
- **Connection Pooling**: Managed by Supabase
- **SSL**: Enforced by default

### Local Development Database
**Option 1: Use Remote Supabase (Current)**
- Pros: Simple setup, matches production
- Cons: Requires internet, shared data

**Option 2: Local Supabase (Future)**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local project
supabase init

# Start local services
supabase start

# Apply migrations
supabase db reset
```

## Deployment Configuration

### Current Platform: Lovable
- **Automatic Deployment**: On git push to main branch
- **Preview Builds**: Available for development
- **Custom Domains**: Available on paid plans
- **SSL**: Automatically provisioned

### Build Process
1. **Install Dependencies**: `npm ci`
2. **Type Check**: TypeScript compilation
3. **Lint Check**: ESLint validation
4. **Build**: `npm run build`
5. **Deploy**: Upload to CDN

### Environment Variable Injection
**Lovable Platform**: Environment variables set in platform UI
**Custom Deployment**: Use hosting platform's environment configuration

## Missing Configuration Items

### 1. Environment Variable Management
**Status**: Not implemented  
**Impact**: All config hardcoded in source  
**Fix**: Move sensitive config to environment variables

### 2. CI/CD Pipeline
**Status**: Basic deployment only  
**Missing**: Automated testing, code quality checks  
**Fix**: Add GitHub Actions or similar CI/CD

### 3. Error Monitoring
**Status**: Not configured  
**Missing**: Sentry or similar error tracking  
**Fix**: Add error monitoring service

### 4. Performance Monitoring
**Status**: Not configured  
**Missing**: Performance metrics and monitoring  
**Fix**: Add performance monitoring tools

### 5. Feature Flags
**Status**: Not implemented  
**Missing**: Runtime feature toggling  
**Fix**: Add feature flag service

## Troubleshooting Common Issues

### Development Server Issues
```bash
# Port already in use
lsof -ti:8080 | xargs kill -9

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# TypeScript errors
npx tsc --noEmit
```

### Build Issues
```bash
# Clear build cache
rm -rf dist node_modules/.vite
npm run build

# Memory issues
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Database Connection Issues
- Check Supabase project status
- Verify API keys are correct
- Check network connectivity
- Review RLS policies for access issues