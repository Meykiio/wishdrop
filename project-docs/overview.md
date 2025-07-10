# WishDrop - Project Overview

## What is WishDrop?
WishDrop is a wish-granting platform that connects people in need ("wishers") with generous donors who want to help fulfill dreams and wishes. The platform facilitates crowdfunding-style donations with a gamified social layer including karma points, badges, and leaderboards.

## Target Audience
- **Primary**: Individuals needing financial help for various causes (education, medical, family, emergency, etc.)
- **Secondary**: Donors looking to make meaningful contributions and earn social recognition
- **Tertiary**: Community organizations and administrators managing the platform

## Key Features
- User authentication and role-based profiles (wisher/donor/admin)
- Wish creation with media, categorization, and urgency levels
- Donation system with anonymous options and messaging
- Karma points and badge reward system
- Leaderboards for top donors and most successful wishers
- Admin tools for content moderation and reporting
- Real-time progress tracking and goal visualization

## Technical Stack Overview

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 with custom HSL design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM 6.26.2
- **State Management**: React Context + React Query (TanStack Query 5.56.2)
- **Forms**: React Hook Form 7.53.0 with Zod validation
- **Icons**: Lucide React 0.462.0
- **Toast Notifications**: Sonner + Radix UI Toast
- **Date Handling**: date-fns 3.6.0

### Backend & Infrastructure  
- **Backend-as-a-Service**: Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (email/password)
- **File Storage**: Supabase Storage (for wish media)
- **API**: Auto-generated REST API via PostgREST

### Development & Build Tools
- **Linting**: ESLint 9.9.0 with TypeScript support
- **Package Manager**: npm
- **Development Server**: Vite dev server on port 8080
- **Deployment**: Lovable platform integration

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives  
│   ├── AuthForm.tsx    # Login/signup forms
│   ├── WishCard.tsx    # Individual wish display
│   ├── WishForm.tsx    # Wish creation form
│   ├── DonationModal.tsx # Donation flow
│   ├── UserProfile.tsx # User profile management
│   ├── Navbar.tsx      # Main navigation
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client & types
└── lib/               # Utility functions

supabase/
├── config.toml        # Supabase project config
└── migrations/        # Database schema & RLS policies
```

## Business Logic Flow
1. **User Registration**: Email/password signup → Profile creation → Role selection
2. **Wish Creation**: Form submission → Media upload → Database storage → Public listing
3. **Discovery**: Browse/filter wishes → View details → Donation modal
4. **Donation**: Amount/message input → Payment processing → Karma rewards → Progress updates
5. **Gamification**: Track donations → Award badges → Update leaderboards
6. **Administration**: Content moderation → User management → Platform oversight

## Data Models
- **Users/Profiles**: Authentication + extended profile data with roles
- **Wishes**: Title, description, category, amount, media, urgency, status
- **Donations**: Amount, donor, wish reference, anonymity options
- **Badges**: Achievement definitions with criteria
- **User Badges**: Many-to-many relationship tracking earned achievements
- **Reports**: Content moderation and safety reporting system

## Security Model
- Row Level Security (RLS) enforced at database level
- Role-based access control (wisher/donor/admin)
- Authenticated endpoints for sensitive operations
- Anonymous donation options for privacy
- Content reporting and moderation capabilities

## Current State
The application is functional with core features implemented but requires significant polish, bug fixes, and feature completion before production readiness.