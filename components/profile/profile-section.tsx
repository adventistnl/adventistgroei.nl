"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
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
}

export function ProfileSection({
  icon: Icon,
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
}: ProfileSectionProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={isEditing ? onSave : onEdit}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {isEditing ? (
            <Check className="w-4 h-4" />
          ) : (
            <Edit2 className="w-4 h-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {isEditing && (
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
