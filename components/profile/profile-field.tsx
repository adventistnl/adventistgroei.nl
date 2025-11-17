"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileFieldProps {
  label: string
  value: string
  icon?: LucideIcon
  isEditing: boolean
  onChange?: (value: string) => void
  type?: string
}

export function ProfileField({
  label,
  value,
  icon: Icon,
  isEditing,
  onChange,
  type = "text",
}: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {isEditing ? (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-background border-border"
        />
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <p className="text-foreground">{value}</p>
        </div>
      )}
    </div>
  )
}
