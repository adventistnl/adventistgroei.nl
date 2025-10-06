export { ContactViewEditModal } from './contact-view-edit-modal'
export type { ContactViewEditModalProps } from './contact-view-edit-modal'

// Contact data type
export interface ContactData {
  id: string
  name?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  country?: string | null
  city?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  is_primary?: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

// Backward compatibility - export under old name as well
export { ContactViewEditModal as ViewContactModal } from './contact-view-edit-modal'