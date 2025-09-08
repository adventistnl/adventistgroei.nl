# User Profile Header Component

A reusable header component for user profile pages with responsive design and monochromatic styling.

## Features

- ✅ **Responsive Design**: Mobile-first with collapsible details
- ✅ **Monochromatic Tags**: Clean, professional appearance with icons only
- ✅ **Standardized Layout**: Consistent action button and status positioning
- ✅ **Role Display**: Role badges positioned above user name
- ✅ **Status Indicators**: Distinct colors for active/inactive users
- ✅ **Action Menu**: Dropdown with customizable actions
- ✅ **Internationalization**: Complete EN/NL translation support
- ✅ **Flexible Props**: Configurable callbacks for different contexts

## Usage

```tsx
import { UserProfileHeader } from "@/components/shared"

function UserDetailPage() {
  return (
    <UserProfileHeader
      user={user}
      userInstitution={userInstitution}
      userChurch={userChurch}
      userRegion={userRegion}
      userDepartment={userDepartment}
      onSendMessage={() => setIsChatOpen(true)}
      onViewContact={() => setIsContactOpen(true)}
      onEditUser={() => setIsEditOpen(true)}
      onDeleteUser={() => setIsDeleteOpen(true)}
      showBackButton={true}
      onBack={() => router.back()}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `User` | ✅ | User object with all user data |
| `userInstitution` | `Institution` | ❌ | User's institution details |
| `userChurch` | `Church` | ❌ | User's church details |
| `userRegion` | `Region` | ❌ | User's region details |
| `userDepartment` | `Department` | ❌ | User's department details |
| `showBackButton` | `boolean` | ❌ | Show/hide back navigation button |
| `onBack` | `() => void` | ❌ | Callback for back button |
| `onSendMessage` | `() => void` | ❌ | Callback for send message action |
| `onViewContact` | `() => void` | ❌ | Callback for view contact action |
| `onEditUser` | `() => void` | ❌ | Callback for edit user action |
| `onDeleteUser` | `() => void` | ❌ | Callback for delete user action |
| `className` | `string` | ❌ | Additional CSS classes |

## Responsive Behavior

### Desktop Layout
```
[Avatar] [Name + Email + Org Tags]     [Status] [Action Menu]
         [Roles above name]            [Language]
```

### Mobile Layout
```
[Avatar] [Name + Email]
         [Roles above name]
         [Collapsible Org Details]
         [Status + Language + Action Menu]
```

## Organization Tags

Monochromatic tags with icons only:

```typescript
const organizationTags = [
  {
    icon: Building,
    label: "Institution",
    value: userInstitution?.name,
    color: "text-blue-600"
  },
  {
    icon: Home,
    label: "Church", 
    value: userChurch?.name,
    color: "text-blue-600"
  },
  {
    icon: MapPin,
    label: "Region",
    value: userRegion?.name || 'None',
    color: "text-green-600"
  },
  {
    icon: Shield,
    label: "Department",
    value: userDepartment?.name || 'None',
    color: "text-emerald-600"
  }
]
```

## Status Colors

Distinct color coding for user status:

```typescript
// Active User
className="bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"

// Inactive User  
className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
```

## Mobile Collapsible

Organization details collapse on mobile for better space utilization:

```tsx
<div className="sm:hidden">
  <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
    <CollapsibleTrigger asChild>
      <Button variant="outline" size="sm" className="w-full justify-between">
        <span className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          Organization Details
        </span>
        {isDetailsOpen ? <ChevronDown /> : <ChevronRight />}
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      {/* Organization tags */}
    </CollapsibleContent>
  </Collapsible>
</div>
```

## Action Menu

Customizable dropdown menu with conditional actions:

```tsx
<DropdownMenuContent align="end" className="w-48">
  {onSendMessage && (
    <DropdownMenuItem onClick={onSendMessage}>
      <Send className="w-4 h-4 mr-2" />
      Send Message
    </DropdownMenuItem>
  )}
  {/* More conditional actions */}
</DropdownMenuContent>
```

## Styling

- **Monochromatic**: Neutral colors with minimal accent colors
- **Professional**: Clean, business-appropriate design
- **Consistent**: Uses shadcn/ui components throughout
- **Accessible**: Proper contrast and keyboard navigation

## Example Implementations

### User Detail Page
```tsx
<UserProfileHeader
  user={user}
  userInstitution={institution}
  userChurch={church}
  userRegion={region}
  userDepartment={department}
  showBackButton={true}
  onBack={() => router.back()}
  onEditUser={() => setEditModalOpen(true)}
  onDeleteUser={() => setDeleteModalOpen(true)}
/>
```

### User Card in List
```tsx
<UserProfileHeader
  user={user}
  userInstitution={institution}
  userChurch={church}
  showBackButton={false}
  onSendMessage={() => openChat(user)}
  onViewContact={() => showContact(user)}
  className="mb-4"
/>
```

### Admin Dashboard
```tsx
<UserProfileHeader
  user={selectedUser}
  userInstitution={institution}
  userChurch={church}
  userRegion={region}
  userDepartment={department}
  onEditUser={() => openEditModal(selectedUser)}
  onDeleteUser={() => openDeleteModal(selectedUser)}
/>
```
