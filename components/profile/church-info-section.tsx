"use client"

import { useEffect } from "react"
import { Building, Globe } from "lucide-react"
import { ProfileSection } from "./profile-section"
import { ProfileField } from "./profile-field"

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

export function ChurchInfoSection({
  role,
  institution,
  church,
  language,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRoleChange,
  onInstitutionChange,
  onChurchChange,
}: ChurchInfoSectionProps) {
  // Debug: Log when props change
  useEffect(() => {
    console.log("⛪ ChurchInfoSection received props:", { role, institution, church, language, isEditing })
  }, [role, institution, church, language, isEditing])

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      EN: "English",
      PT: "Português",
      ES: "Español",
      FR: "Français",
      DE: "Deutsch",
    }
    return languages[code] || code
  }

  return (
    <ProfileSection
      icon={Building}
      title="Informações da Igreja"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField
          label="Função/Cargo"
          value={role}
          isEditing={isEditing}
          onChange={onRoleChange}
        />
        <ProfileField
          label="Instituição"
          value={institution}
          isEditing={isEditing}
          onChange={onInstitutionChange}
        />
        <ProfileField
          label="Igreja"
          value={church}
          isEditing={isEditing}
          onChange={onChurchChange}
        />
        <ProfileField
          label="Idioma Preferido"
          value={getLanguageName(language)}
          icon={Globe}
          isEditing={false}
        />
      </div>
    </ProfileSection>
  )
}
