import { User, Mail, Phone, MapPin, Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()

  return (
    <ProfileSection
      icon={User}
      title={t('profile.sections.personal_data')}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField
          label={t('profile.personal.full_name')}
          value={name}
          isEditing={isEditing}
          onChange={onNameChange}
        />
        <ProfileField
          label={t('profile.personal.email')}
          value={email}
          icon={Mail}
          isEditing={isEditing}
          onChange={onEmailChange}
          type="email"
        />
        <ProfileField
          label={t('profile.personal.phone')}
          value={phone}
          icon={Phone}
          isEditing={isEditing}
          onChange={onPhoneChange}
        />
        <ProfileField
          label={t('profile.personal.address')}
          value={address}
          icon={MapPin}
          isEditing={isEditing}
          onChange={onAddressChange}
        />
        {isEditing ? (
          <LanguageSelectorInput
            label={t('profile.personal.preferred_language')}
            value={language}
            onValueChange={onLanguageChange}
            variant="combobox"
            required
          />
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{t('profile.personal.preferred_language')}</div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">{getLanguageName(language as LanguagePreference, t)}</p>
            </div>
          </div>
        )}
      </div>
    </ProfileSection>
  )
}

const getLanguageName = (code: LanguagePreference, t: any) => {
  const languages: Record<LanguagePreference, string> = {
    [LanguagePreference.en]: t('profile.languages.en'),
    [LanguagePreference.nl]: t('profile.languages.nl'),
  }
  return languages[code] || code
}
