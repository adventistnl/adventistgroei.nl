"use client"

import { useState, useCallback, useEffect } from "react"

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

export function useProfileEditor(initialProfile: UserProfile) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [editData, setEditData] = useState<Partial<UserProfile>>(initialProfile)

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

  const handleSave = useCallback((section: string) => {
    setProfile({ ...profile, ...editData })
    setEditingSection(null)
    // TODO: Add API call to save data
  }, [profile, editData])

  const handleCancel = useCallback(() => {
    setEditData(profile)
    setEditingSection(null)
  }, [profile])

  const handleFieldChange = useCallback((field: keyof UserProfile, value: string) => {
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
