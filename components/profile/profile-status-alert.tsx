import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { IncompleteFieldBadge } from "./incomplete-field-badge"

interface IncompleteField {
  key: string
  label: string
  section: "personal" | "church"
}

interface ProfileStatusAlertProps {
  incompleteFields: IncompleteField[]
  onFieldClick?: (section: "personal" | "church") => void
}

export function ProfileStatusAlert({ incompleteFields, onFieldClick }: ProfileStatusAlertProps) {
  const { t } = useTranslation()
  const isComplete = incompleteFields.length === 0

  if (isComplete) {
    return (
      <Alert variant="default" className="border-border/50 bg-card/50">
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        <AlertDescription className="text-foreground text-sm">
          <span className="font-medium">{t('profile.status.active')}:</span>
          <span className="text-muted-foreground ml-1">{t('profile.alerts.profile_complete')}</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="default" className="border-border/50 bg-card/50">
      <AlertDescription className="text-foreground">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">{t('profile.alerts.incomplete_profile')}:</span>
            <span className="text-muted-foreground ml-1">{t('profile.alerts.complete_profile_description')}</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {incompleteFields.map((field) => (
              <IncompleteFieldBadge
                key={field.key}
                field={field.label}
                onClick={() => onFieldClick?.(field.section)}
              />
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
