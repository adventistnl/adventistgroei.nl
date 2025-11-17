"use client"

import { useEffect } from "react"
import { User, Mail, Phone, MapPin } from "lucide-react"
import { ProfileSection } from "./profile-section"
import { ProfileField } from "./profile-field"

interface PersonalInfoSectionProps {
  name: string
  email: string
  phone: string
  address: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
}

export function PersonalInfoSection({
  name,
  email,
  phone,
  address,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
}: PersonalInfoSectionProps) {
  // Debug: Log when props change
  useEffect(() => {
    console.log("📝 PersonalInfoSection received props:", { name, email, phone, address, isEditing })
  }, [name, email, phone, address, isEditing])

  return (
    <ProfileSection
      icon={User}
      title="Dados Pessoais"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField
          label="Nome Completo"
          value={name}
          isEditing={isEditing}
          onChange={onNameChange}
        />
        <ProfileField
          label="E-mail"
          value={email}
          icon={Mail}
          isEditing={isEditing}
          onChange={onEmailChange}
          type="email"
        />
        <ProfileField
          label="Telefone"
          value={phone}
          icon={Phone}
          isEditing={isEditing}
          onChange={onPhoneChange}
        />
        <ProfileField
          label="Endereço"
          value={address}
          icon={MapPin}
          isEditing={isEditing}
          onChange={onAddressChange}
        />
      </div>
    </ProfileSection>
  )
}
