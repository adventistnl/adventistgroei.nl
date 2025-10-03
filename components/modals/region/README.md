# Region Modals

This directory contains React components for managing regions within institutions.

## Components

### AddRegionModal

A multi-step modal component for creating new regions, following the same pattern as the institution registration modal.

**Features:**
- 🗺️ 3-step wizard interface with progress bar
- ✅ Form validation with real-time feedback
- 🌍 Country selection with searchable dropdown
- 📧 Contact information (email, phone, website)
- 📝 Optional description field
- 🎨 Consistent design with institution modal
- 🌐 i18n ready (uses structure translations)

**Schema Fields (based on database):**
```sql
regions {
  id string pk
  institution_id string [ref: > institutions.id]
  name string
  parent_region_id string null [ref: > regions.id] -- Not used in this modal
  contact_id string null [ref: > contacts.id] -- Created with basic info
  annual_budget_id string null [ref: > annual_budgets.id] -- Not used in this modal
  created_at timestamp
  updated_at timestamp
  created_by string
  updated_by string
  is_deleted boolean default false
  deleted_at timestamp null
  deleted_by string null
}
```

**Step Flow:**
1. **Basic Information**: Region name and country selection
2. **Contact Information**: Email (required), phone, and website (optional)
3. **Additional Details**: Description (optional)

## Usage

```tsx
import { AddRegionModal } from '@/components/modals/region/add-region-modal'

// Use as a trigger wrapper
<AddRegionModal
  institutionId="institution-123"
  onSuccess={(data) => {
    console.log('Region created:', data)
    // Handle success (refetch data, show notification, etc.)
  }}
>
  <Button>
    <MapPin className="w-4 h-4 mr-2" />
    Add Region
  </Button>
</AddRegionModal>
```

## Props

### AddRegionModal

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | ✅ | Trigger element (button, etc.) |
| `institutionId` | `string` | ✅ | ID of the institution this region belongs to |
| `onSuccess` | `(data: AddRegionFormData) => void` | ❌ | Called when region is successfully created |

### AddRegionFormData

```tsx
interface AddRegionFormData {
  name: string
  description?: string
  email: string
  phone?: string
  website?: string
  country: string
}
```

## Validation Rules

- **Name**: Required, minimum 2 characters
- **Country**: Required, selected from predefined list
- **Email**: Required, valid email format
- **Website**: Optional, must start with http:// or https:// if provided
- **Phone**: Optional, free text format
- **Description**: Optional, free text

## Design Patterns

This modal follows the established patterns from the institution registration modal:

1. **Multi-step wizard** with progress indicator
2. **Responsive design** with mobile-first approach
3. **Consistent styling** using Shadcn/UI components
4. **Form validation** with inline error messages
5. **Loading states** with toast notifications
6. **Keyboard navigation** and accessibility
7. **Icon usage** with green color theme for regions (🗺️)

## Integration Notes

- The modal integrates with the structure translations system
- Uses the same country list as the institution modal
- Follows the trigger pattern (children as trigger element)
- Contact information is kept minimal (essential fields only)
- Parent regions and annual budgets are not handled in this modal
- Institution ID is passed as prop (not selected in modal)

## Future Enhancements

- Add parent region selection (when needed)
- Integrate with GraphQL mutations
- Add validation for duplicate region names
- Add support for region hierarchy visualization
- Implement region transfer between institutions