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
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t('activities.logs.no_history')}</p>
      </div>
    )
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATED':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'UPDATED':
        return <Edit3 className="w-4 h-4 text-blue-600" />
      case 'DELETED':
        return <Trash2 className="w-4 h-4 text-red-600" />
      case 'STATUS_CHANGED':
        return <CheckCircle className="w-4 h-4 text-purple-600" />
      case 'PRIORITY_CHANGED':
        return <Flag className="w-4 h-4 text-orange-600" />
      case 'ASSIGNED':
        return <UserPlus className="w-4 h-4 text-blue-600" />
      case 'UNASSIGNED':
        return <UserMinus className="w-4 h-4 text-gray-600" />
      case 'BUDGET_UPDATED':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'DEADLINE_UPDATED':
        return <Calendar className="w-4 h-4 text-red-600" />
      case 'TAG_ADDED':
      case 'TAG_REMOVED':
        return <Tag className="w-4 h-4 text-indigo-600" />
      case 'SUBSIDIZED_CHANGED':
        return <DollarSign className="w-4 h-4 text-emerald-600" />
      default:
        return <Settings className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATED':
        return 'bg-green-50 border-green-200'
      case 'UPDATED':
        return 'bg-blue-50 border-blue-200'
      case 'DELETED':
        return 'bg-red-50 border-red-200'
      case 'STATUS_CHANGED':
        return 'bg-purple-50 border-purple-200'
      case 'PRIORITY_CHANGED':
        return 'bg-orange-50 border-orange-200'
      case 'ASSIGNED':
      case 'UNASSIGNED':
        return 'bg-blue-50 border-blue-200'
      case 'BUDGET_UPDATED':
      case 'SUBSIDIZED_CHANGED':
        return 'bg-green-50 border-green-200'
      case 'DEADLINE_UPDATED':
        return 'bg-red-50 border-red-200'
      case 'TAG_ADDED':
      case 'TAG_REMOVED':
        return 'bg-indigo-50 border-indigo-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
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
            <span className="font-semibold text-gray-700">
              {log.old_value ? formatValue(log.old_value, 'status') : '—'}
            </span>
            {' '}{t('activities.logs.actions.to')}{' '}
            <span className="font-semibold text-gray-700">
              {log.new_value ? formatValue(log.new_value, 'status') : '—'}
            </span>
          </span>
        )

      case 'PRIORITY_CHANGED':
        return (
          <span>
            {t('activities.logs.actions.priority_changed', { user: userName })}{' '}
            <span className="font-semibold text-gray-700">
              {log.old_value ? formatValue(log.old_value, 'priority') : '—'}
            </span>
            {' '}{t('activities.logs.actions.to')}{' '}
            <span className="font-semibold text-gray-700">
              {log.new_value ? formatValue(log.new_value, 'priority') : '—'}
            </span>
          </span>
        )

      case 'BUDGET_UPDATED':
        return (
          <span>
            {t('activities.logs.actions.budget_updated', { user: userName })}{' '}
            <span className="font-semibold text-gray-700">
              {log.old_value || '—'}
            </span>
            {' '}{t('activities.logs.actions.to')}{' '}
            <span className="font-semibold text-gray-700">
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
                  <span className="font-semibold text-gray-700">
                    {formatValue(log.old_value, log.field_name)}
                  </span>
                  {' '}{t('activities.logs.actions.to')}{' '}
                  <span className="font-semibold text-gray-700">
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
            <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
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
                <p className="text-sm text-gray-700 leading-snug">
                  {getActionMessage(log)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <time
                    className="text-xs text-gray-500"
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
