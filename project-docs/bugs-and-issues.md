
# Bugs and Issues

## Critical Bugs (#critical #production-blocking)

### ✅ FIXED: Select Component Empty String Values
**File**: `src/components/WishFilters.tsx`  
**Symptoms**: App crashes with error "A <Select.Item /> must have a value prop that is not an empty string"  
**Reproduction**: Navigate to /wishes page, try to open any filter dropdown  
**Root Cause**: Empty string values used in Select components instead of meaningful default values  
**Tags**: #ui #select #crash  
**Fix**: Replaced all empty string values with "all" default values and proper validation

### ✅ FIXED: Profile Creation Race Conditions  
**File**: `src/hooks/useAuth.tsx`  
**Symptoms**: Users sometimes stuck in loading state, profile data inconsistent  
**Reproduction**: Sign up → immediate navigation → profile undefined  
**Root Cause**: Race condition between auth trigger and profile creation  
**Tags**: #auth #async #data-integrity  
**Fix**: Added retry logic and fallback profile creation, improved auth state management

### ✅ FIXED: Image Upload Storage Errors
**File**: `src/components/WishForm.tsx`  
**Symptoms**: File upload fails with 400 status, storage bucket issues  
**Reproduction**: Create wish → upload image → form submission fails  
**Root Cause**: Storage bucket configuration or RLS policy issues  
**Tags**: #storage #upload #supabase  
**Fix**: Added graceful degradation - wishes can be created without images, improved error handling

## High Priority Bugs (#high #user-impacting)

### ✅ FIXED: TypeScript Role Enum Mismatches
**File**: `src/components/UserProfile.tsx`  
**Symptoms**: TypeScript compilation errors for admin role handling  
**Reproduction**: Admin user tries to edit profile  
**Root Cause**: State types don't include all enum values from database  
**Tags**: #typescript #types #auth  
**Fix**: Updated role state type to include 'admin' option

### 5. Navigation State Management
**File**: `src/components/Navbar.tsx`  
**Symptoms**: User dropdown shows wrong options, logout doesn't refresh properly  
**Reproduction**: Login → navigate → user state inconsistent  
**Root Cause**: Auth state not properly synchronized across components  
**Tags**: #auth #navigation #state

### 6. Donation Modal Error Handling
**File**: `src/components/DonationModal.tsx`  
**Symptoms**: No validation feedback, form can submit invalid data  
**Reproduction**: Empty amount → submit → silent failure or crash  
**Root Cause**: Missing form validation and error boundary  
**Tags**: #forms #validation #donations

## Medium Priority Bugs (#medium #ui-ux)

### ✅ PARTIALLY FIXED: Loading States Incomplete
**Files**: Multiple components  
**Symptoms**: No loading indicators, users confused about app state  
**Reproduction**: Any async operation → no feedback  
**Root Cause**: Missing loading UI patterns  
**Tags**: #ui #loading #feedback  
**Status**: Added loading components and Profile page loading state, more components need updates

### 8. Responsive Design Issues
**Files**: Various components  
**Symptoms**: Layout breaks on mobile, cards not properly sized  
**Reproduction**: Resize browser, test on mobile devices  
**Root Cause**: Incomplete responsive design implementation  
**Tags**: #responsive #mobile #css

### 9. Toast Message Inconsistency
**Files**: Multiple components using useToast  
**Symptoms**: Some actions show success/error toasts, others don't  
**Reproduction**: Various user actions → inconsistent feedback  
**Root Cause**: Inconsistent implementation across components  
**Tags**: #ui #feedback #toast

## Low Priority Issues (#low #polish)

### 10. Accessibility Issues
**Files**: Various components  
**Symptoms**: Missing ARIA labels, keyboard navigation issues  
**Reproduction**: Screen reader testing, tab navigation  
**Root Cause**: Accessibility not prioritized in initial development  
**Tags**: #accessibility #a11y

### 11. SEO Meta Tags Missing
**File**: `index.html`  
**Symptoms**: Poor social sharing, no meta descriptions  
**Reproduction**: Share links on social media → poor preview  
**Root Cause**: No SEO optimization implemented  
**Tags**: #seo #meta #marketing

### ✅ FIXED: Console Warnings  
**Files**: Various components  
**Symptoms**: Development console shows warnings about keys, deprecated props  
**Reproduction**: Open dev tools → multiple warnings visible  
**Root Cause**: Code quality issues, missing keys, etc.  
**Tags**: #code-quality #warnings #dev-experience  
**Fix**: Addressed major TypeScript errors and React warnings during Sprint 1
