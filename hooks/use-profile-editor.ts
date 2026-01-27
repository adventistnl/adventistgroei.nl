"use client"

import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useUpdateOwnUser } from "./graphql/use-update-own-user"
import toast from "react-hot-toast"

// Extended profile type for display purposes
export interface ExtendedProfile {
  id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  language_preference?: string
  institution_id?: string
  church_id?: string
  institution_name?: string
  church_name?: string
  role?: string
}

export function useProfileEditor(initialProfile: ExtendedProfile, refetchUser?: () => void) {
  const [updateOwnUser, { loading: updateLoading }] = useUpdateOwnUser()
  const { updateAuthUser, user: authUser } = useAuth()
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [profile, setProfile] = useState<ExtendedProfile>(initialProfile)
  const [editData, setEditData] = useState<Partial<ExtendedProfile>>(initialProfile)

  // Sync profile when initialProfile changes (e.g., when user data loads)
  useEffect(() => {
    console.log("🔄 useProfileEditor: Syncing with new initialProfile", initialProfile)
    setProfile(initialProfile)
    setEditData(initialProfile)
  }, [initialProfile])

  const handleEdit = useCallback((section: string) => {
    setEditingSection(section)
    setEditData(profile)
  }, [profile])

  const handleSave = useCallback(async (section: string) => {
    try {
      // Prepare the update data - only send fields that were actually changed
      const updateData: any = {}
      
      if (editData.name && editData.name !== profile.name) {
        updateData.name = editData.name
      }
      if (editData.email && editData.email !== profile.email) {
        updateData.email = editData.email
      }
      if (editData.phone !== undefined && editData.phone !== profile.phone) {
        // Remove máscara do telefone antes de salvar (apenas números)
        updateData.phone = editData.phone.replace(/\D/g, '')
      }
      if (editData.address !== undefined && editData.address !== profile.address) {
        updateData.address = editData.address
      }
      if (editData.language_preference && editData.language_preference !== profile.language_preference) {
        updateData.language_preference = editData.language_preference
      }
      if (editData.institution_id && editData.institution_id !== profile.institution_id) {
        updateData.institution_id = editData.institution_id
      }
      if (editData.church_id && editData.church_id !== profile.church_id) {
        updateData.church_id = editData.church_id
      }

      // Only proceed if there are changes
      if (Object.keys(updateData).length === 0) {
        toast('No changes to save', { 
          duration: 2000 
        })
        setEditingSection(null)
        return
      }

      console.log("Updating own user profile with data:", updateData)
      
      // Call the updateOwnUser mutation
      const result = await updateOwnUser({
        variables: {
          data: updateData
        }
      })
      
      if (result.data) {
        const updatedUser = result.data.updateOwnUser
        
        // Update local profile state with the saved data
        const newProfile = {
          ...profile,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.contact?.phone || '',
          address: updatedUser.contact?.address || '',
          language_preference: updatedUser.language_preference || 'en',
          institution_id: updatedUser.institution_id || '',
          church_id: updatedUser.church_id || '',
          institution_name: updatedUser.institution?.name || '',
          church_name: updatedUser.church?.name || '',
        }
        
        setProfile(newProfile)
        setEditData(newProfile)
        setEditingSection(null)
        
        // Refetch user data to get updated information
        if (refetchUser) {
          console.log("Refetching user data...")
          await refetchUser()
        }
        
        // Update auth context
        if (authUser) {
          const updatedAuthUser = {
            ...authUser,
            name: updatedUser.name,
            email: updatedUser.email,
            language_preference: updatedUser.language_preference || authUser.language_preference,
            contact: authUser.contact ? {
              ...authUser.contact,
              phone: updatedUser.contact?.phone || authUser.contact.phone || '',
              address: updatedUser.contact?.address || authUser.contact.address || '',
            } : undefined
          }
          console.log("Updating auth context with new user data...")
          updateAuthUser(updatedAuthUser)
        }
        
        toast.success('Profile updated successfully!')
        console.log("User profile updated successfully")
      }
    } catch (error: any) {
      console.error("Error updating user profile:", error)
      
      // Show user-friendly error message
      if (error.message?.includes('permission')) {
        toast.error('You do not have permission to update your profile')
      } else if (error.message?.includes('email')) {
        toast.error('Invalid email address')
      } else {
        toast.error('Failed to update profile. Please try again.')
      }
    }
  }, [profile, editData, updateOwnUser, refetchUser, authUser, updateAuthUser])

  const handleCancel = useCallback(() => {
    setEditData(profile)
    setEditingSection(null)
  }, [profile])

  const handleFieldChange = useCallback((field: keyof ExtendedProfile, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }, [])

  return {
    editingSection,
    profile,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    updateLoading,
  }
}
