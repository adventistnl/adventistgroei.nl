"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Edit2, Check, X } from "lucide-react"

interface ProfileSectionProps {
  icon: LucideIcon
  title: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  children: ReactNode
  showEditButton?: boolean // Novo: controla visibilidade do botão
}

export function ProfileSection({
  icon: Icon,
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
  showEditButton = true, // Padrão: mostrar botão
}: ProfileSectionProps) {
  const { t } = useTranslation()
  
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        {showEditButton && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t('profile.actions.cancel')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={onSave}
                  className="h-8"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {t('profile.actions.save')}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {children}
      </CardContent>
    </Card>
  )
}
