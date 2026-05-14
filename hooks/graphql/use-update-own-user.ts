import { useMutation } from '@apollo/client'
import { UPDATE_OWN_USER } from '@/graphql/mutations/update-own-user'

export interface UpdateOwnUserVariables {
  data: {
    name?: string
    email?: string
    phone?: string
    address?: string
    language_preference?: string
    institution_id?: string
    church_id?: string
    recieve_emails?: boolean
  }
}

export interface UpdateOwnUserResponse {
  updateOwnUser: {
    id: string
    name: string
    email: string
    recieve_emails?: boolean
    contact?: {
      phone?: string
      address?: string
    }
    language_preference?: string
    institution_id?: string
    church_id?: string
    institution?: {
      id: string
      name: string
    }
    church?: {
      id: string
      name: string
    }
    created_at: string
    updated_at: string
  }
}

/**
 * Hook to update the authenticated user's own profile
 * Uses the updateOwnUser mutation which only requires updateOwnUser permission
 * Users can only update their own data, not other users
 */
export function useUpdateOwnUser() {
  return useMutation<UpdateOwnUserResponse, UpdateOwnUserVariables>(UPDATE_OWN_USER, {
    refetchQueries: ['GetUser'], // Refetch user data after update
  })
}
