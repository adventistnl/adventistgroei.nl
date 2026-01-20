"use client"

import React from "react"
import {
  Clock,
  User,
  Edit3,
  Trash2,
  Plus,
  CheckCircle,
  Flag,
  Tag,
  DollarSign,
  Calendar,
  UserPlus,
  UserMinus,
  Settings
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"

export interface ActivityLog {
  id: string
  activity_id: string
  user_id: string
  action: string
  field_name?: string
  old_value?: string
  new_value?: string
  metadata?: any
  created_at: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface ActivityLogsProps {
  logs: ActivityLog[]
  isLoading?: boolean
}

export function ActivityLogs({ logs, isLoading }: ActivityLogsProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t('activities.logs.no_history')}</p>
      </div>
    )
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATED':
        return <Plus className="w-4 h-4 text-muted-foreground" />
      case 'UPDATED':
        return <Edit3 className="w-4 h-4 text-muted-foreground" />
      case 'DELETED':
        return <Trash2 className="w-4 h-4 text-muted-foreground" />
      case 'STATUS_CHANGED':
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />
      case 'PRIORITY_CHANGED':
        return <Flag className="w-4 h-4 text-muted-foreground" />
      case 'ASSIGNED':
        return <UserPlus className="w-4 h-4 text-muted-foreground" />
      case 'UNASSIGNED':
        return <UserMinus className="w-4 h-4 text-muted-foreground" />
      case 'BUDGET_UPDATED':
        return <DollarSign className="w-4 h-4 text-muted-foreground" />
      case 'DEADLINE_UPDATED':
        return <Calendar className="w-4 h-4 text-muted-foreground" />
      case 'TAG_ADDED':
      case 'TAG_REMOVED':
        return <Tag className="w-4 h-4 text-muted-foreground" />
      case 'SUBSIDIZED_CHANGED':
        return <DollarSign className="w-4 h-4 text-muted-foreground" />
      default:
        return <Settings className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getActionColor = (action: string) => {
    // Use monochromatic muted colors for all actions
    return 'bg-muted/30 border-border hover:bg-muted/50'
  }

  const formatFieldName = (fieldName: string) => {
    return t(`activities.logs.fields.${fieldName}`, fieldName)
  }

  const formatValue = (value: string, fieldName?: string) => {
    try {
      // Try to parse if it's JSON
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed)
      }
      return parsed
    } catch {
      // Status translations
      if (fieldName === 'status') {
        return t(`activities.modal.status_labels.${value}`, value)
      }

      // Priority translations
      if (fieldName === 'priority') {
        return t(`activities.modal.priority_labels.${value}`, value)
      }

      // Boolean values
      if (value === 'true') return t('activities.logs.values.yes')
      if (value === 'false') return t('activities.logs.values.no')

      return value
    }
  }

  const getActionMessage = (log: ActivityLog) => {
    const userName = log.user.name

    switch (log.action) {
      case 'CREATED':
        return t('activities.logs.actions.created', { user: userName })

      case 'DELETED':
        return t('activities.logs.actions.deleted', { user: userName })

      case 'STATUS_CHANGED':
        return (
          <span>
            {t('activities.logs.actions.status_changed', { user: userName })}{' '}
            <span className="font-semibold text-foreground">
              {log.old_value ? formatValue(log.old_value, 'status') : '—'}
            </span>
            {' '}{t('activities.logs.actions.to')}{' '}
            <span className="font-semibold text-foreground">
              {log.new_value ? formatValue(log.new_value, 'status') : '—'}
            </span>
          </span>
        )

      case 'PRIORITY_CHANGED':
        return (
          <span>
            {t('activities.logs.actions.priority_changed', { user: userName })}{' '}
            <span className="font-semibold text-foreground">
              {log.old_value ? formatValue(log.old_value, 'priority') : '—'}
            </span>
            {' '}{t('activities.logs.actions.to')}{' '}
            <span className="font-semibold text-foreground">
              {log.new_value ? formatValue(log.new_value, 'priority') : '—'}
            </span>
          </span>
        )

      case 'BUDGET_UPDATED':
        return (
          <span>
            {t('activities.logs.actions.budget_updated', { user: userName })}{' '}
            <span className="font-semibold text-foreground">
              {log.old_value || '—'}
            </span>
            {' '}{t('activities.logs.actions.to')}{' '}
            <span className="font-semibold text-foreground">
              {log.new_value || '—'}
            </span>
          </span>
        )

      case 'SUBSIDIZED_CHANGED':
        return log.new_value === 'true' 
          ? t('activities.logs.actions.subsidized_marked', { user: userName })
          : t('activities.logs.actions.subsidized_unmarked', { user: userName })

      case 'UPDATED':
        if (log.field_name) {
          return (
            <span>
              {t('activities.logs.actions.field_updated', { 
                user: userName, 
                field: formatFieldName(log.field_name) 
              })}
              {log.old_value && log.new_value && (
                <>
                  {' '}{t('activities.logs.actions.from')}{' '}
                  <span className="font-semibold text-foreground">
                    {formatValue(log.old_value, log.field_name)}
                  </span>
                  {' '}{t('activities.logs.actions.to')}{' '}
                  <span className="font-semibold text-foreground">
                    {formatValue(log.new_value, log.field_name)}
                  </span>
                </>
              )}
            </span>
          )
        }
        return t('activities.logs.actions.field_updated', { 
          user: userName, 
          field: 'activity' 
        })

      default:
        return t('activities.logs.actions.generic_action', { 
          user: userName, 
          action: log.action 
        })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('activities.logs.time.just_now')
    if (diffMins < 60) return t('activities.logs.time.minutes_ago', { count: diffMins })
    if (diffHours < 24) return t('activities.logs.time.hours_ago', { count: diffHours })
    if (diffDays < 7) return t('activities.logs.time.days_ago', { count: diffDays })

    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: diffDays > 365 ? 'numeric' : undefined
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-3">
      {logs.map((log, index) => (
        <div
          key={log.id}
          className={`flex gap-3 p-3 rounded-lg border ${getActionColor(log.action)} transition-all hover:shadow-sm`}
        >
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {log.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Log Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  {getActionMessage(log)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <time
                    className="text-xs text-muted-foreground"
                    title={formatFullDate(log.created_at)}
                  >
                    {formatTimeAgo(log.created_at)}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
