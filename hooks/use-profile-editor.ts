"use client"

import { useState, useCallback, useEffect } from "react"
import { useUser } from "./use-user"
import { useAuth } from "@/contexts/auth-context"
import { UpdateUserVariables } from "@/types/UpdateUser"

// Extended profile type for display purposes
export interface ExtendedProfile extends UpdateUserVariables {
  institution_name?: string
  church_name?: string
  role?: string
}

export function useProfileEditor(initialProfile: ExtendedProfile, refetchUser?: () => void) {
  const { updateUser , user} = useUser({id: initialProfile.id})
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
      // Prepare the update data
      const updateData = {
        id: profile.id,
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        language_preference: editData.language_preference,
        institution_id: editData.institution_id,
        church_id: editData.church_id,
      }

      console.log("🚀 Updating user with data:", updateData)
      
      // Call the mutation
      const result = await updateUser({ variables: updateData })
      
      if (result.data) {
        // Update local profile state with the saved data
        setProfile({ ...profile, ...editData })
        setEditingSection(null)
        
        // Refetch user data to get updated information
        if (refetchUser) {
          console.log("🔄 Refetching user data...")
          await refetchUser()
        }
        
        // Update auth context if this is the logged user
        if (authUser && authUser.id === profile.id) {
          const updatedAuthUser = {
            ...authUser,
            name: editData.name || authUser.name,
            email: editData.email || authUser.email,
            language_preference: editData.language_preference || authUser.language_preference,
            // Update contact if exists
            contact: authUser.contact ? {
              ...authUser.contact,
              phone: editData.phone || authUser.contact.phone,
              address: editData.address || authUser.contact.address,
            } : null
          }
          console.log("🔄 Updating auth context with new user data...")
          updateAuthUser(updatedAuthUser)
        }
        
        console.log("✅ User updated successfully")
      }
    } catch (error) {
      console.error("❌ Error updating user:", error)
      // You might want to show a toast or error message here
    }
  }, [profile, editData, updateUser, refetchUser])

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
  }
}
