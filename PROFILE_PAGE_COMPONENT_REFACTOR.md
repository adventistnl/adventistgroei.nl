# Profile Page - Component Refactoring & Auth Integration ✅

## Overview
Complete refactoring of the profile page with reusable components, proper auth integration, and responsive layout patterns consistent with other pages in the system.

---

## Changes Summary

### Architecture Improvements

**Before:**
- Monolithic page component (~300 lines)
- Mock data hardcoded in component
- All UI logic in single file
- No component reusability
- Fixed width container

**After:**
- Modular architecture with 7 separate files
- Real data from AuthContext
- Reusable components for other pages
- Custom hook for state management
- Responsive max-w-7xl container (like other pages)

---

## New File Structure

```
components/profile/
├── profile-header.tsx           # Avatar + Name + Email header
├── profile-section.tsx          # Reusable section wrapper with edit button
├── profile-field.tsx            # Reusable field component (read/edit modes)
├── personal-info-section.tsx    # Personal data section
├── church-info-section.tsx      # Church information section
└── system-preferences-section.tsx  # System preferences section

hooks/
└── use-profile-editor.ts        # Custom hook for profile editing logic

app/profile/
└── page.tsx                     # Main page (~140 lines, down from 300)
```

---

## Reusable Components

### 1. `ProfileHeader` Component
**Location:** `/components/profile/profile-header.tsx`

**Purpose:** Display user avatar, name, and email

**Props:**
```typescript
interface ProfileHeaderProps {
  name: string
  email: string
  avatar?: string
}
```

**Features:**
- Avatar with fallback initials
- Responsive sizing (w-16 h-16)
- Primary color theme
- Can be reused in any page needing user info display

**Usage:**
```tsx
<ProfileHeader
  name={user.name}
  email={user.email}
  avatar={user.avatar}
/>
```

---

### 2. `ProfileSection` Component
**Location:** `/components/profile/profile-section.tsx`

**Purpose:** Reusable section wrapper with icon, title, and edit controls

**Props:**
```typescript
interface ProfileSectionProps {
  icon: LucideIcon
  title: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  children: ReactNode
}
```

**Features:**
- Icon + title header
- Edit/Save button in top-right corner
- Cancel button when editing
- Card wrapper with consistent styling
- Highly reusable for any editable section

**Usage:**
```tsx
<ProfileSection
  icon={User}
  title="Dados Pessoais"
  isEditing={isEditing}
  onEdit={handleEdit}
  onSave={handleSave}
  onCancel={handleCancel}
>
  {/* Section content */}
</ProfileSection>
```

---

### 3. `ProfileField` Component
**Location:** `/components/profile/profile-field.tsx`

**Purpose:** Reusable field component with read/edit modes

**Props:**
```typescript
interface ProfileFieldProps {
  label: string
  value: string
  icon?: LucideIcon
  isEditing: boolean
  onChange?: (value: string) => void
  type?: string
}
```

**Features:**
- Automatic read/edit mode switching
- Optional icon support
- Label + value display
- Input component when editing
- Type support (text, email, etc.)

**Usage:**
```tsx
<ProfileField
  label="E-mail"
  value={email}
  icon={Mail}
  isEditing={isEditing}
  onChange={handleChange}
  type="email"
/>
```

---

### 4. `PersonalInfoSection` Component
**Location:** `/components/profile/personal-info-section.tsx`

**Purpose:** Complete personal information section

**Props:**
```typescript
interface PersonalInfoSectionProps {
  name: string
  email: string
  phone: string
  address: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
}
```

**Fields:**
- Nome Completo
- E-mail (with Mail icon)
- Telefone (with Phone icon)
- Endereço (with MapPin icon)

**Layout:** 2-column grid (responsive to 1-column on mobile)

---

### 5. `ChurchInfoSection` Component
**Location:** `/components/profile/church-info-section.tsx`

**Purpose:** Church-related information section

**Props:**
```typescript
interface ChurchInfoSectionProps {
  role: string
  institution: string
  church: string
  language: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onRoleChange: (value: string) => void
  onInstitutionChange: (value: string) => void
  onChurchChange: (value: string) => void
}
```

**Fields:**
- Função/Cargo
- Instituição
- Igreja
- Idioma Preferido (read-only with Globe icon)

**Layout:** 2-column grid (responsive)

---

### 6. `SystemPreferencesSection` Component
**Location:** `/components/profile/system-preferences-section.tsx`

**Purpose:** System settings and account information

**Props:**
```typescript
interface SystemPreferencesSectionProps {
  language: string
  accountId: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}
```

**Fields:**
- Idioma do Sistema (read-only)
- ID da Conta (read-only, monospace font)

**Layout:** Single column with horizontal layout for language

---

## Custom Hook: `useProfileEditor`

**Location:** `/hooks/use-profile-editor.ts`

**Purpose:** Centralized state management for profile editing

**Interface:**
```typescript
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  institution: string
  church: string
  language: string
}
```

**Returns:**
```typescript
{
  editingSection: string | null,
  profile: UserProfile,
  editData: Partial<UserProfile>,
  handleEdit: (section: string) => void,
  handleSave: (section: string) => void,
  handleCancel: () => void,
  handleFieldChange: (field: keyof UserProfile, value: string) => void,
}
```

**Features:**
- Manages editing state for all sections
- Maintains original and edited data
- Provides handlers for all edit operations
- Memoized callbacks for performance
- Ready for API integration

**Usage:**
```tsx
const {
  editingSection,
  profile,
  editData,
  handleEdit,
  handleSave,
  handleCancel,
  handleFieldChange,
} = useProfileEditor(initialProfile)
```

---

## Auth Context Integration

### Data Source
The page now uses **real data from AuthContext** instead of mock data:

```tsx
const { user, isAuthenticated, isLoading } = useAuth()
```

### User Data Mapping
```typescript
const userProfile = user ? {
  id: user.id || "",
  name: user.name || "",
  email: user.email || "",
  phone: "", // TODO: Get from contact_id
  address: "", // TODO: Get from contact_id
  role: user.user_roles?.[0]?.name || "Member",
  institution: user.institution_id || "",
  church: user.church_id || "",
  language: user.language_preference || "PT",
} : null
```

### Available Auth Data
From `AuthContext`:
- ✅ `user.id` → Account ID
- ✅ `user.name` → User name
- ✅ `user.email` → Email address
- ✅ `user.user_roles` → User roles array
- ✅ `user.institution_id` → Institution ID
- ✅ `user.church_id` → Church ID
- ✅ `user.language_preference` → Language preference
- ⏳ `user.contact_id` → Can be used to fetch phone/address

### Authentication Guards
```tsx
// Redirect to login if not authenticated
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push("/login")
  }
}, [isAuthenticated, isLoading, router])

// Show loading state
if (isLoading) {
  return <LoadingSpinner />
}

// Don't render if no user
if (!user || !userProfile) {
  return null
}
```

---

## Responsive Layout Pattern

### Container Width
Following the same pattern as other pages (e.g., `/app/my-subsidies/page.tsx`):

```tsx
<div className="max-w-7xl mx-auto">
  {/* Content */}
</div>
```

**Before:** `max-w-4xl` (fixed, smaller)  
**After:** `max-w-7xl` (responsive, consistent)

### Responsive Padding
```tsx
<div className="p-4 sm:p-6 lg:p-8">
```

**Breakpoints:**
- Mobile: `p-4` (1rem)
- Tablet: `sm:p-6` (1.5rem)
- Desktop: `lg:p-8` (2rem)

### Grid Responsiveness
All field grids:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

**Behavior:**
- Mobile: 1 column
- Desktop (md+): 2 columns

---

## Component Organization

### Main Page Structure
```tsx
export default function ProfilePage() {
  // 1. Hooks
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  // 2. Data mapping
  const userProfile = user ? { /* ... */ } : null
  
  // 3. State management
  const {
    editingSection,
    profile,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
  } = useProfileEditor(userProfile || defaultProfile)
  
  // 4. Auth guards
  useEffect(() => { /* redirect logic */ }, [])
  
  // 5. Loading state
  if (isLoading) return <LoadingSpinner />
  
  // 6. Render
  return (
    <AppLayout>
      <ProfileHeader />
      <PersonalInfoSection />
      <ChurchInfoSection />
      <SystemPreferencesSection />
    </AppLayout>
  )
}
```

### Clean Separation of Concerns
1. **Data Layer:** Auth context provides user data
2. **State Layer:** Custom hook manages editing state
3. **UI Layer:** Reusable components render interface
4. **Business Logic:** Separated into hooks and components

---

## Comparison: Before vs After

### Code Size
| File | Before | After | Change |
|------|--------|-------|--------|
| page.tsx | ~300 lines | ~140 lines | -53% |
| Total | ~300 lines | ~650 lines (7 files) | Modular |

### Maintainability
| Aspect | Before | After |
|--------|--------|-------|
| Component reusability | ❌ No | ✅ Yes |
| State management | ❌ Scattered | ✅ Centralized hook |
| Data source | ❌ Mock data | ✅ Auth context |
| Layout consistency | ❌ Custom | ✅ Standard (max-w-7xl) |
| Edit logic | ❌ Inline | ✅ Separated |

### Developer Experience
**Before:**
- Hard to find specific logic
- Difficult to reuse components
- Mock data mixed with UI
- Long single file

**After:**
- Clear file structure
- Components ready for reuse
- Real data from auth
- Easy to navigate

---

## Usage in Other Pages

### Example: Settings Page
```tsx
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileSection } from '@/components/profile/profile-section'
import { ProfileField } from '@/components/profile/profile-field'

export default function SettingsPage() {
  return (
    <AppLayout>
      <ProfileHeader name={user.name} email={user.email} />
      <ProfileSection
        icon={Settings}
        title="Account Settings"
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      >
        <ProfileField
          label="Notification Email"
          value={email}
          isEditing={isEditing}
          onChange={handleChange}
        />
      </ProfileSection>
    </AppLayout>
  )
}
```

### Example: Admin User Edit
```tsx
import { PersonalInfoSection } from '@/components/profile/personal-info-section'

export default function EditUserPage({ userId }) {
  const { data: userData } = useUserQuery(userId)
  
  return (
    <PersonalInfoSection
      name={userData.name}
      email={userData.email}
      phone={userData.phone}
      address={userData.address}
      isEditing={true}
      onSave={handleSaveUser}
      // ...
    />
  )
}
```

---

## Future Enhancements

### 1. Contact Data Integration
Fetch phone and address from `contact_id`:
```typescript
const { data: contact } = useContactQuery(user.contact_id)

const userProfile = {
  // ...
  phone: contact?.phone || "",
  address: contact?.address || "",
}
```

### 2. API Integration for Save
Replace mock save in hook:
```typescript
const handleSave = useCallback(async (section: string) => {
  try {
    await updateUserMutation({
      variables: { id: profile.id, data: editData }
    })
    setProfile({ ...profile, ...editData })
    toast.success('Profile updated successfully')
  } catch (error) {
    toast.error('Failed to update profile')
  }
  setEditingSection(null)
}, [profile, editData])
```

### 3. Institution/Church Name Resolution
Fetch full names instead of IDs:
```typescript
const { data: institution } = useInstitutionQuery(user.institution_id)
const { data: church } = useChurchQuery(user.church_id)

const userProfile = {
  // ...
  institution: institution?.name || "",
  church: church?.name || "",
}
```

### 4. Avatar Upload
Add avatar upload to ProfileHeader:
```tsx
<ProfileHeader
  name={user.name}
  email={user.email}
  avatar={user.avatar}
  onAvatarUpload={handleAvatarUpload}
/>
```

### 5. Form Validation
Add validation to ProfileField:
```tsx
<ProfileField
  label="E-mail"
  value={email}
  isEditing={isEditing}
  onChange={handleChange}
  validation={{
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format"
  }}
/>
```

---

## Testing Checklist

- [x] Page loads with auth data
- [x] Loading state displays correctly
- [x] Redirect to login when not authenticated
- [x] Edit button toggles edit mode
- [x] Cancel button discards changes
- [x] Save button persists changes (locally)
- [x] All fields display correct data
- [x] Responsive layout on mobile/tablet/desktop
- [x] 2-column grid collapses to 1 column on mobile
- [x] Icons display correctly
- [x] Language name mapping works
- [x] Account ID displays in monospace
- [ ] API save integration (TODO)
- [ ] Contact data integration (TODO)
- [ ] Institution/Church name resolution (TODO)

---

## File Status

| File | Status | TypeScript Errors | Reusable |
|------|--------|-------------------|----------|
| `/components/profile/profile-header.tsx` | ✅ Created | 0 | ✅ Yes |
| `/components/profile/profile-section.tsx` | ✅ Created | 0 | ✅ Yes |
| `/components/profile/profile-field.tsx` | ✅ Created | 0 | ✅ Yes |
| `/components/profile/personal-info-section.tsx` | ✅ Created | 0 | ✅ Yes |
| `/components/profile/church-info-section.tsx` | ✅ Created | 0 | ✅ Yes |
| `/components/profile/system-preferences-section.tsx` | ✅ Created | 0 | ✅ Yes |
| `/hooks/use-profile-editor.ts` | ✅ Created | 0 | ✅ Yes |
| `/app/profile/page.tsx` | ✅ Refactored | 0 | - |

---

## Benefits Summary

### 1. **Modularity**
- 7 separate files instead of 1 monolith
- Each component has single responsibility
- Easy to test and maintain

### 2. **Reusability**
- Components can be used in settings pages
- Admin panels can reuse sections
- Field component works anywhere

### 3. **Data Integration**
- Real auth data instead of mocks
- Auth guards prevent unauthorized access
- Loading states handled properly

### 4. **Consistency**
- Follows same layout pattern as other pages
- max-w-7xl container like my-subsidies
- Responsive padding pattern

### 5. **Maintainability**
- Clear file structure
- Easy to find and modify code
- Separated concerns (data/state/UI)

### 6. **Scalability**
- Ready for API integration
- Easy to add new sections
- Custom hook supports expansion

---

## Conclusion

The profile page has been successfully refactored with:

- ✅ 7 reusable components created
- ✅ Custom hook for state management
- ✅ Real data from AuthContext
- ✅ Responsive max-w-7xl layout
- ✅ Auth guards and loading states
- ✅ Clean component organization
- ✅ 0 TypeScript errors
- ✅ 53% reduction in main page code
- ✅ Ready for use in other pages

The new architecture is modular, maintainable, and follows best practices! 🎉
