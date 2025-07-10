# Authentication System Documentation

## Overview
WishDrop uses Supabase Auth for authentication with email/password as the primary method. The system extends basic auth with role-based access control and profile management.

## Authentication Flow

### 1. User Registration
**Route**: `/auth` (signup mode)  
**Components**: `AuthForm.tsx`  
**Process**:
1. User enters email, password, and name
2. `supabase.auth.signUp()` called with user metadata
3. Database trigger `on_auth_user_created` fires
4. Profile record created in `public.profiles` table
5. User receives email verification (if enabled)
6. Automatic redirect to main dashboard

**Code Implementation**:
```typescript
// In AuthForm.tsx
const signUp = async (email: string, password: string, name: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // Stored in user_metadata
    },
  });
  if (error) throw error;
};
```

### 2. User Login  
**Route**: `/auth` (signin mode)  
**Components**: `AuthForm.tsx`  
**Process**:
1. User enters email and password
2. `supabase.auth.signInWithPassword()` called
3. Auth state change triggers profile fetch
4. User redirected to main dashboard
5. Navigation updates based on user role

**Code Implementation**:
```typescript
// In AuthForm.tsx
const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};
```

### 3. Session Management
**Hook**: `useAuth()` in `src/hooks/useAuth.tsx`  
**Responsibilities**:
- Manage user and profile state
- Handle auth state changes
- Provide auth methods to components
- Handle profile creation/updates

**State Management**:
```typescript
interface AuthContextType {
  user: User | null;           // Supabase auth user
  profile: Profile | null;     // Extended profile data
  loading: boolean;            // Auth state loading
  signUp: (email, password, name) => Promise<void>;
  signIn: (email, password) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates) => Promise<void>;
}
```

### 4. Profile Creation and Management
**Database Trigger**: `handle_new_user()`  
**Triggered**: After INSERT on `auth.users`  
**Process**:
1. Extract email and name from user metadata
2. Create record in `public.profiles` table
3. Set default role as 'wisher'
4. Initialize karma to 0

**Fallback Logic**: If trigger fails, `useAuth` detects missing profile and creates one manually.

## Role-Based Access Control

### User Roles
Defined in `user_role` enum:
- **wisher**: Can create wishes, receive donations
- **donor**: Focuses on giving donations, earning karma
- **admin**: Platform management privileges

### Role Assignment
- **Default**: All new users start as 'wisher'
- **User Choice**: Can change role in profile settings
- **Admin Assignment**: Admins can only be set manually in database

### Role-Based Features

#### Wisher Role Features
- Create and manage wishes
- Receive donations
- Send thank-you messages
- View donation history
- Basic leaderboard participation

#### Donor Role Features  
- Browse and filter wishes
- Make donations (anonymous or public)
- Earn karma and badges
- Compete in leaderboards
- View donation impact

#### Admin Role Features
- All wisher and donor features
- Content moderation tools
- User management capabilities
- Platform analytics access
- Badge and system management

## Protected Routes

### Authentication Guards
**Implementation**: `Navigate` redirects in page components  
**Logic**:
```typescript
// In protected pages like MakeWish.tsx
if (!user) {
  return <Navigate to="/auth" replace />;
}

// Auto-redirect authenticated users from auth page
if (user) {
  return <Navigate to="/" replace />;
}
```

### Route Protection Matrix
| Route | Anonymous | Authenticated | Admin Only |
|-------|-----------|---------------|------------|
| `/` | ✅ | ✅ | ✅ |
| `/auth` | ✅ | ➡️ `/` | ➡️ `/` |
| `/wishes` | ✅ | ✅ | ✅ |
| `/make-wish` | ➡️ `/auth` | ✅ | ✅ |
| `/profile` | ➡️ `/auth` | ✅ | ✅ |
| `/leaderboard` | ✅ | ✅ | ✅ |
| `/admin/*` | ➡️ `/auth` | ❌ | ✅ |

## Database Security (RLS)

### Profiles Table Policies
```sql
-- Public read access for user discovery
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Users can only modify their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Profile creation via trigger or fallback
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### Wishes Table Policies
```sql
-- Public wishes visible to all, private only to creator
CREATE POLICY "Public wishes are viewable by everyone" 
ON public.wishes FOR SELECT 
USING (NOT is_private OR auth.uid() = user_id);

-- Full CRUD for wish creators only
CREATE POLICY "Users can insert their own wishes" 
ON public.wishes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishes" 
ON public.wishes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishes" 
ON public.wishes FOR DELETE USING (auth.uid() = user_id);
```

### Donations Table Policies
```sql
-- Donations visible to donor and wish creator only
CREATE POLICY "Donations are viewable by wish owner and donor" 
ON public.donations FOR SELECT 
USING (auth.uid() = donor_id OR auth.uid() = (
  SELECT user_id FROM wishes WHERE id = wish_id
));

-- Authenticated users can create donations
CREATE POLICY "Authenticated users can insert donations" 
ON public.donations FOR INSERT WITH CHECK (auth.uid() = donor_id);
```

## Current Issues and Bugs

### 1. Profile Creation Race Conditions
**Problem**: Profile sometimes not created after signup  
**Symptoms**: Users stuck in loading state, profile is null  
**Root Cause**: Race condition between auth trigger and profile fetch  
**Current Workaround**: Manual profile creation in `useAuth`  
**Proper Fix**: Improve trigger reliability and error handling

### 2. Auth State Synchronization
**Problem**: Inconsistent auth state across components  
**Symptoms**: Navigation shows wrong options, stale user data  
**Root Cause**: Auth state changes not properly propagated  
**Fix Needed**: Better state management in auth context

### 3. Admin Role Management
**Problem**: No UI for admin role assignment  
**Symptoms**: Admins must be created manually in database  
**Impact**: Admin features inaccessible  
**Fix Needed**: Admin management interface

### 4. Session Persistence Issues
**Problem**: Users logged out unexpectedly  
**Symptoms**: Frequent login prompts, lost auth state  
**Root Cause**: Session handling configuration  
**Fix Needed**: Review Supabase client configuration

## Security Considerations

### Current Security Measures
- Row Level Security enforced on all tables
- Role-based access control for features  
- Password-based authentication with Supabase
- Email verification available (configurable)
- Secure password storage handled by Supabase

### Security Gaps to Address
- No password reset functionality implemented
- No rate limiting on auth endpoints
- No suspicious activity monitoring
- Missing admin activity logging
- No two-factor authentication option

### Recommended Security Enhancements
1. Implement password reset flow
2. Add rate limiting for auth attempts
3. Monitor and log admin actions
4. Add suspicious activity detection
5. Consider 2FA for admin accounts
6. Implement session timeout policies

## Testing Strategy

### Authentication Test Cases
- User registration with valid/invalid data
- Login with correct/incorrect credentials
- Profile creation and updates
- Role-based feature access
- Session persistence and expiration
- RLS policy enforcement

### Integration Testing
- Auth state changes across components
- Protected route redirects
- Profile data consistency
- Database trigger execution
- Cross-role feature access