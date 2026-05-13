"use client"

import { Mail } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ProfileSection } from "./profile-section"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface EmailPreferencesSectionProps {
  recieveEmails: boolean
  isEditing: boolean
  isSaving?: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onToggle: (value: boolean) => void
}

export function EmailPreferencesSection({
  recieveEmails,
  isEditing,
  isSaving = false,
  onEdit,
  onSave,
  onCancel,
  onToggle,
}: EmailPreferencesSectionProps) {
  const { t } = useTranslation()

  return (
    <ProfileSection
      icon={Mail}
      title={t("profile.sections.email_preferences")}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      showEditButton={true}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-foreground cursor-pointer">
              {t("profile.email_preferences.receive_emails_label")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t("profile.email_preferences.receive_emails_description")}
            </p>
          </div>
          <Switch
            checked={recieveEmails}
            onCheckedChange={isEditing ? onToggle : undefined}
            disabled={!isEditing || isSaving}
            aria-label={t("profile.email_preferences.receive_emails_label")}
            id="recieve-emails-toggle"
          />
        </div>

        {!recieveEmails && (
          <p className="text-xs text-muted-foreground italic px-1">
            {t("profile.email_preferences.opted_out_note")}
          </p>
        )}
      </div>
    </ProfileSection>
  )
}
