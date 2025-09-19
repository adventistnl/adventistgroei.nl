"use client"

import * as React from "react"
import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface InviteData {
  role: string
  type: "email" | "link"
  email?: string
  expiresAt: number
  invitedBy: string
  timestamp: number
}

interface RoleBadgeProps {
  inviteData: InviteData | null
  roleLabels: Record<string, string>
}

/**
 * Badge que exibe o role do convite
 * Aparece apenas quando há dados de convite válidos
 */
export function RoleBadge({ inviteData, roleLabels }: RoleBadgeProps) {
  if (!inviteData) return null

  return (
    <div className="flex items-center justify-center gap-0.5rem mb-2rem">
      <Badge variant="secondary" className="flex items-center gap-0.25rem text-0.75rem">
        <Shield className="w-0.75rem h-0.75rem" />
        {roleLabels[inviteData.role as keyof typeof roleLabels] || inviteData.role}
      </Badge>
    </div>
  )
}
