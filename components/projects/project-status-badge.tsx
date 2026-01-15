"use client"

import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"
import { ProjectStatus } from "@/types/graphql-global-types"

interface ProjectStatusBadgeProps {
  status: ProjectStatus | string
  size?: 'sm' | 'md' | 'lg'
  showDot?: boolean
  variant?: 'badge' | 'status'
}

/**
 * Unified component for displaying project status badges.
 * Uses translated labels and consistent styling across the app.
 */
export function ProjectStatusBadge({ 
  status, 
  size = 'sm', 
  showDot = true,
  variant = 'status'
}: ProjectStatusBadgeProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const config: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'default'; color: string }> = {
    [ProjectStatus.Draft]: { 
      label: t.status?.draft || 'Draft', 
      variant: 'neutral', 
      color: '#9ca3af' 
    },
    [ProjectStatus.InProgress]: { 
      label: t.status?.inProgress || 'In Progress', 
      variant: 'success', 
      color: '#22c55e' 
    },
    [ProjectStatus.InReview]: { 
      label: t.status?.inReview || 'In Review', 
      variant: 'info', 
      color: '#3b82f6' 
    },
    [ProjectStatus.OnHold]: { 
      label: t.status?.onHold || 'On Hold', 
      variant: 'warning', 
      color: '#f59e0b' 
    },
    [ProjectStatus.Expired]: { 
      label: t.status?.expired || 'Expired', 
      variant: 'error', 
      color: '#ef4444' 
    },
    [ProjectStatus.Concluded]: { 
      label: t.status?.concluded || 'Concluded', 
      variant: 'neutral', 
      color: '#6b7280' 
    },
  }

  // Fallback for unknown status
  const statusConfig = config[status] || { 
    label: status, 
    variant: 'default' as const, 
    color: '#9ca3af' 
  }

  if (variant === 'badge') {
    const badgeClasses: Record<string, string> = {
      [ProjectStatus.Draft]: 'bg-gray-100 text-gray-700 border-gray-200',
      [ProjectStatus.InProgress]: 'bg-green-100 text-green-700 border-green-200',
      [ProjectStatus.InReview]: 'bg-blue-100 text-blue-700 border-blue-200',
      [ProjectStatus.OnHold]: 'bg-amber-100 text-amber-700 border-amber-200',
      [ProjectStatus.Expired]: 'bg-red-100 text-red-700 border-red-200',
      [ProjectStatus.Concluded]: 'bg-slate-100 text-slate-700 border-slate-200',
    }

    return (
      <Badge 
        variant="outline" 
        className={badgeClasses[status] || 'bg-gray-100 text-gray-700 border-gray-200'}
      >
        {statusConfig.label}
      </Badge>
    )
  }

  return (
    <StatusBadge
      label={statusConfig.label}
      variant={statusConfig.variant}
      showDot={showDot}
      dotColor={statusConfig.color}
      size={size}
    />
  )
}
