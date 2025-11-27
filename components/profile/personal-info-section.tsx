import { User, Mail, Phone, MapPin, Globe } from "lucide-react"
import { ProfileSection } from "./profile-section"
import { ProfileField } from "./profile-field"
import { LanguageSelectorInput } from "@/components/shared/language-selector-input"
import { LanguagePreference } from "@/types/globalTypes"

interface PersonalInfoSectionProps {
  name: string
  email: string
  phone: string
  address: string
  language: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
  onLanguageChange: (value: string) => void
}

export function PersonalInfoSection({
  name,
  email,
  phone,
  address,
  language,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  onLanguageChange,
}: PersonalInfoSectionProps) {

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
        {isEditing ? (
          <LanguageSelectorInput
            label="Idioma Preferido"
            value={language}
            onValueChange={onLanguageChange}
            variant="select"
            required
          />
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Idioma Preferido</div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">{getLanguageName(language as LanguagePreference)}</p>
            </div>
          </div>
        )}
      </div>
    </ProfileSection>
  )
}

const getLanguageName = (code: LanguagePreference) => {
  const languages: Record<LanguagePreference, string> = {
    [LanguagePreference.en]: "English",
    [LanguagePreference.nl]: "Nederlands",
  }
  return languages[code] || code
}
