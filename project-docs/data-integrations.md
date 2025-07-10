# Data Integrations Guide

## Database Architecture

### Supabase Configuration
- **Project ID**: `waddtxhguitjhdtqydbe`
- **URL**: `https://waddtxhguitjhdtqydbe.supabase.co`
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Client**: `@supabase/supabase-js` v2.50.5

### Core Tables and Schemas

#### 1. Profiles Table (`public.profiles`)
**Purpose**: Extended user information beyond auth.users  
**Key Fields**:
- `id` (UUID, FK to auth.users) - Primary key
- `email` (TEXT) - User email address
- `name` (TEXT) - Display name
- `role` (user_role ENUM) - 'wisher' | 'donor' | 'admin'
- `karma` (INTEGER) - Points earned from donations
- `profile_pic` (TEXT) - Avatar image URL
- `bio`, `location`, `phone` - Optional profile data
- `is_verified` (BOOLEAN) - Verification status
- `created_at`, `updated_at` - Timestamps

**RLS Policies**:
- Public read access for all profiles
- Users can insert/update their own profile only
- No delete permissions (CASCADE from auth.users)

#### 2. Wishes Table (`public.wishes`)
**Purpose**: User-created wish/request entries  
**Key Fields**:
- `id` (UUID) - Primary key
- `user_id` (UUID, FK to profiles) - Wish creator
- `title`, `description` - Wish content
- `category` (wish_category ENUM) - 8 predefined categories
- `amount` (INTEGER) - Target amount in cents
- `urgency` (wish_urgency ENUM) - 'low' | 'medium' | 'high'
- `status` (wish_status ENUM) - 'pending' | 'funded' | 'expired' | 'rejected'
- `media_url` (TEXT) - Uploaded image/video URL
- `location` (TEXT) - Geographic location
- `is_private` (BOOLEAN) - Visibility setting
- `expires_at` (TIMESTAMPTZ) - Expiration date (default +30 days)

**RLS Policies**:
- Public read for non-private wishes or own wishes
- Users can CRUD their own wishes only
- Automatic expiration handling needed

#### 3. Donations Table (`public.donations`)
**Purpose**: Financial contributions to wishes  
**Key Fields**:
- `id` (UUID) - Primary key
- `wish_id` (UUID, FK to wishes) - Target wish
- `donor_id` (UUID, FK to profiles) - Donor (nullable for anonymous)
- `amount` (INTEGER) - Donation amount in cents
- `is_anonymous` (BOOLEAN) - Hide donor identity
- `message` (TEXT) - Optional message to wisher
- `stripe_session_id` (TEXT) - Payment processor reference
- `status` (TEXT) - 'pending' | 'completed' | 'failed'

**RLS Policies**:
- Viewable by donor and wish owner only
- Insert allowed for authenticated users
- No update/delete permissions (financial audit trail)

#### 4. Badges Table (`public.badges`)
**Purpose**: Achievement definitions  
**Key Fields**:
- `id` (UUID) - Primary key
- `name`, `description` - Badge information
- `icon` (TEXT) - Icon identifier or URL
- `criteria_amount`, `criteria_count` - Earning thresholds

**Current Badges**:
- "Generous Heart" - $100+ total donations
- "Flex King" - $25,000+ total donations
- Additional badges need to be seeded

#### 5. User_Badges Table (`public.user_badges`)
**Purpose**: Many-to-many relationship for earned badges  
**Key Fields**:
- `user_id` (UUID, FK to profiles)
- `badge_id` (UUID, FK to badges)
- `earned_at` (TIMESTAMPTZ) - Achievement timestamp
- `reason` (TEXT) - Achievement context

### Database Functions and Triggers

#### 1. New User Profile Creation
**Function**: `handle_new_user()`  
**Trigger**: `on_auth_user_created` (AFTER INSERT on auth.users)  
**Purpose**: Automatically create profile when user signs up  
**Implementation**: Extracts email and name from auth metadata

#### 2. Karma and Badge Updates
**Function**: `update_user_karma()`  
**Trigger**: `update_karma_on_donation` (AFTER UPDATE on donations)  
**Purpose**: Award karma points and badges when donations complete  
**Logic**: 1 karma point per dollar donated, check badge criteria

### Storage Configuration

#### Supabase Storage Buckets
- **wishes**: Public bucket for wish media (images/videos)
- **media**: General storage bucket
- **Policies**: User can upload to their own folder structure
- **RLS**: Upload/read permissions based on user authentication

### Critical Database Issues

#### 1. Storage Bucket Errors
**Problem**: File uploads failing with 400 status codes  
**Root Cause**: RLS policies or bucket configuration issues  
**Impact**: Users cannot attach media to wishes  
**Fix Needed**: Review storage policies and bucket permissions

#### 2. Profile Creation Race Conditions
**Problem**: Profile sometimes not created after user signup  
**Root Cause**: Trigger execution timing or failures  
**Impact**: Users stuck in loading state  
**Fix Needed**: Improve error handling in profile creation

#### 3. Missing Badge Seeding
**Problem**: Badge table exists but no default badges defined  
**Root Cause**: Migration doesn't include badge data  
**Impact**: Badge system non-functional  
**Fix Needed**: Seed default badge set

### Required Environment Variables

#### Development
```bash
# Automatically included in Supabase client
SUPABASE_URL=https://waddtxhguitjhdtqydbe.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Production (when needed)
```bash
# Stripe integration (not yet implemented)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_... # Backend only

# Email service (not yet implemented)  
EMAIL_SERVICE_API_KEY=...

# Push notifications (not yet implemented)
FIREBASE_CONFIG=...
```

### Database Query Patterns

#### Common Queries
```sql
-- Get wishes with donation progress
SELECT w.*, p.name as creator_name, 
       COALESCE(SUM(d.amount), 0) as total_donated
FROM wishes w
JOIN profiles p ON w.user_id = p.id
LEFT JOIN donations d ON w.id = d.wish_id AND d.status = 'completed'
WHERE w.status = 'pending' AND w.is_private = false
GROUP BY w.id, p.name
ORDER BY w.created_at DESC;

-- Get user leaderboard by karma
SELECT p.*, COUNT(d.id) as donation_count, SUM(d.amount) as total_donated
FROM profiles p
LEFT JOIN donations d ON p.id = d.donor_id AND d.status = 'completed'
GROUP BY p.id
ORDER BY p.karma DESC
LIMIT 10;

-- Get user badges
SELECT p.name, b.name as badge_name, ub.earned_at
FROM profiles p
JOIN user_badges ub ON p.id = ub.user_id
JOIN badges b ON ub.badge_id = b.id
WHERE p.id = $1;
```

### Data Migration Notes
- **Current Version**: Single migration file with full schema
- **Future Migrations**: Should be incremental and backward-compatible
- **RLS Policies**: Critical for security, test thoroughly before production
- **Indexes**: Need to add performance indexes for common queries
- **Constraints**: Consider adding check constraints for data validation

### Integration Testing Requirements
- Test RLS policies with different user roles
- Verify trigger functions execute correctly
- Test storage upload/download flows
- Validate badge earning logic
- Test donation flow from creation to completion