"use client"

import { useEffect } from "react"
import { Building, Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ProfileSection } from "./profile-section"
import { ProfileField } from "./profile-field"

interface ChurchInfoSectionProps {
  role: string
  institution: string
  church: string
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
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRoleChange,
  onInstitutionChange,
  onChurchChange,
}: ChurchInfoSectionProps) {
  const { t } = useTranslation()
  
  // Debug: Log when props change
  useEffect(() => {
    console.log("⛪ ChurchInfoSection received props:", { role, institution, church, isEditing })
  }, [role, institution, church, isEditing])

  return (
    <ProfileSection
      icon={Building}
      title={t('profile.sections.church_information')}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      showEditButton={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField
          label={t('profile.church.role')}
          value={role}
          isEditing={isEditing}
          onChange={onRoleChange}
        />
        <ProfileField
          label={t('profile.church.institution')}
          value={institution}
          isEditing={isEditing}
          onChange={onInstitutionChange}
        />
        <ProfileField
          label={t('profile.church.church')}
          value={church}
          isEditing={isEditing}
          onChange={onChurchChange}
        />
      </div>
    </ProfileSection>
  )
}
