# Settings Page - Component Architecture

## 📁 File Structure

```
app/settings/
└── page.tsx                      # Main settings page with tabs

components/settings/
├── system-preferences-tab.tsx    # System configuration (language, date, currency, dark mode)
├── languages-tab.tsx             # Language management (preferred + available languages)
└── notifications-status-tab.tsx  # Notifications and user status (online/away/offline)
```

## 🎯 Overview

The settings page has been refactored into a modular, maintainable architecture using tabs for better organization and user experience.

### Main Page (`app/settings/page.tsx`)

**Responsibilities:**
- State management for all settings
- Tab navigation using shadcn/ui Tabs component
- Coordination between different settings sections
- Save functionality with toast notifications

**State Variables:**
- `isDarkMode`: Dark mode toggle
- `defaultLanguage`: System default language
- `preferredLanguage`: User's preferred language
- `dateFormat`: Date display format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- `currency`: System currency (EUR, USD, GBP, CAD)
- `userStatus`: User availability status (online, away, offline)
- `enabledLanguages`: Array of enabled language codes
- `notificationsEnabled`: Notifications toggle

**Features:**
- Dark mode applies class to `document.documentElement`
- Toast notifications on save
- Responsive layout with max-w-7xl container
- Three tabs for organized settings access

---

## 📋 Components

### 1. SystemPreferencesTab

**File:** `components/settings/system-preferences-tab.tsx`

**Purpose:** Configure core system settings

**Props:**
```typescript
interface SystemPreferencesTabProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  defaultLanguage: string
  setDefaultLanguage: (value: string) => void
  dateFormat: string
  setDateFormat: (value: string) => void
  currency: string
  setCurrency: (value: string) => void
}
```

**Features:**
- Default language selection (EN, ES, PT, NL, TWI, PAP)
- Date format options (3 formats)
- Currency selection (4 currencies)
- Dark mode toggle with visual feedback

**Layout:** 2-column grid on desktop, 1-column on mobile

---

### 2. LanguagesTab

**File:** `components/settings/languages-tab.tsx`

**Purpose:** Manage system languages and user preferences

**Props:**
```typescript
interface LanguagesTabProps {
  preferredLanguage: string
  setPreferredLanguage: (value: string) => void
  enabledLanguages: string[]
  toggleLanguage: (code: string) => void
}
```

**Features:**
- Preferred language selection (filtered by enabled languages)
- Enable/disable individual languages with toggle switches
- Language cards with flag emoji, name, and code
- Visual separation with Separator component

**Available Languages:**
- 🇺🇸 English (en) - enabled by default
- 🇪🇸 Spanish (es) - enabled by default
- 🇧🇷 Portuguese (pt) - enabled by default
- 🇳🇱 Dutch (nl) - enabled by default
- 🇬🇭 Twi (twi) - disabled by default
- 🇦🇼 Papiamento (pap) - disabled by default

---

### 3. NotificationsStatusTab

**File:** `components/settings/notifications-status-tab.tsx`

**Purpose:** Control notifications and user availability status

**Props:**
```typescript
interface NotificationsStatusTabProps {
  notificationsEnabled: boolean
  setNotificationsEnabled: (value: boolean) => void
  userStatus: UserStatus
  setUserStatus: (value: UserStatus) => void
}

type UserStatus = "online" | "offline" | "away"
```

**Features:**
- Notifications toggle (enable/disable system notifications)
- User status selector with 3 options:
  - **Online** 🟢 - Available for messages (green theme)
  - **Away** 🟡 - Currently inactive (yellow theme)
  - **Offline** ⚫ - Not available (gray theme)
- Visual feedback with colored dots and CheckCircle icon
- Hover states and smooth transitions
- Dark mode support for status buttons

**Layout:** 3-column grid for status buttons on desktop, 1-column on mobile

---

## 🎨 Design Patterns

### Consistent Styling
- All components use Card wrappers from shadcn/ui
- Consistent border-border and bg-card classes
- Responsive padding: p-4 sm:p-6 lg:p-8
- Space-y-6 for vertical spacing

### Color System
- `text-foreground` for primary text
- `text-muted-foreground` for secondary text
- `bg-background` for input backgrounds
- `bg-card` for card backgrounds
- `border-border` for borders

### Status Colors
- Green (500/600/950) for online
- Yellow (500/600/950) for away
- Gray (400/600/950) for offline

### Icons
All icons from Lucide React:
- Settings (System Preferences)
- Globe (Languages)
- Bell (Notifications)
- CheckCircle (Status selected)
- Save (Save button)

---

## 🔧 Usage Example

```tsx
import SettingsPage from "@/app/settings/page"

// The page is fully self-contained with state management
// Just navigate to /settings to access all functionality
```

### Adding a New Setting

1. **Add state to main page:**
```tsx
const [newSetting, setNewSetting] = useState(defaultValue)
```

2. **Create new component (if needed):**
```tsx
// components/settings/new-tab.tsx
export function NewTab({ newSetting, setNewSetting }: NewTabProps) {
  return <Card>...</Card>
}
```

3. **Add tab to main page:**
```tsx
<TabsTrigger value="new-tab">New Tab</TabsTrigger>

<TabsContent value="new-tab">
  <NewTab newSetting={newSetting} setNewSetting={setNewSetting} />
</TabsContent>
```

---

## ✅ Benefits

1. **Modularity:** Each settings section is in its own file
2. **Maintainability:** Easy to find and update specific settings
3. **Reusability:** Components can be reused in other contexts
4. **Scalability:** Simple to add new settings sections
5. **Type Safety:** Full TypeScript support with interfaces
6. **User Experience:** Tab navigation for better organization
7. **Responsive:** Mobile-first design with adaptive layouts

---

## 🚀 Future Enhancements

Potential improvements:
- Persist settings to backend API
- Add validation for settings values
- Implement settings search/filter
- Add keyboard shortcuts for navigation
- Create settings export/import functionality
- Add settings history/undo functionality
- Integrate with i18n for multilingual support
