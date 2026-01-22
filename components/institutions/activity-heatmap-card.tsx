"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarHeatmap, CalendarLegend } from "@/components/ui/calendar-heatmap"
import { cn } from "@/lib/utils"

interface ActivityHeatmapCardProps {
  projects: any[]
  users: any[]
  loading?: boolean
  compactMode?: boolean
  selectedYear?: number
}

export function ActivityHeatmapCard({
  projects = [],
  users = [],
  loading = false,
  compactMode = false,
  selectedYear,
}: ActivityHeatmapCardProps) {
  const { t } = useTranslation()

  // Fallback translations
  const translations = React.useMemo(() => ({
    title: t('institutions.activityHeatmap.title') || "Activity Heatmap",
    description: t('institutions.activityHeatmap.description') || "Daily activity intensity based on projects created and users registered",
    no_data: t('institutions.activityHeatmap.no_data') || "No activity data available",
    less: t('institutions.activityHeatmap.less') || "Less",
    more: t('institutions.activityHeatmap.more') || "More",
    days_with_activity: t('institutions.activityHeatmap.days_with_activity') || "days with activity"
  }), [t])

  // Aggregate activity data from projects and user registrations
  const activityData = React.useMemo(() => {
    const activityMap = new Map<string, number>()

    // Filter by year if selectedYear is provided
    const filterByYear = (dateStr: string) => {
      if (!selectedYear) return true
      const date = new Date(dateStr)
      return date.getFullYear() === selectedYear
    }

    // Count project creation dates
    projects
      .filter(p => p && !p.is_deleted && (p.created_at || p.start_at))
      .forEach(project => {
        try {
          const createdDate = new Date(project.created_at || project.start_at)
          // Validate date and filter by year
          if (!isNaN(createdDate.getTime()) && filterByYear(project.created_at || project.start_at)) {
            const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD
            activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1)
          }
        } catch (error) {
          console.warn('Invalid project date:', project)
        }
      })

    // Count user registration dates
    users
      .filter(u => u && !u.is_deleted && u.created_at)
      .forEach(user => {
        try {
          const createdDate = new Date(user.created_at)
          // Validate date and filter by year
          if (!isNaN(createdDate.getTime()) && filterByYear(user.created_at)) {
            const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD
            activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1)
          }
        } catch (error) {
          console.warn('Invalid user date:', user)
        }
      })

    // Convert to weighted dates array
    return Array.from(activityMap.entries()).map(([dateStr, count]) => ({
      date: new Date(dateStr + 'T12:00:00'), // Set to noon to avoid timezone issues
      weight: count,
    }))
  }, [projects, users, selectedYear])

  // Variant classnames for activity intensity (GitHub-style)
  const variantClassnames = React.useMemo(() => {
    return [
      "text-white hover:text-white bg-teal-400 hover:bg-teal-400 dark:bg-teal-500 dark:hover:bg-teal-500",
      "text-white hover:text-white bg-teal-600 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-600",
      "text-white hover:text-white bg-teal-800 hover:bg-teal-800 dark:bg-teal-700 dark:hover:bg-teal-700",
    ]
  }, [])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (activityData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            {translations.title}
          </CardTitle>
          <CardDescription className="text-xs">
            {translations.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {translations.no_data}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={compactMode ? "pb-3" : ""}>
        <CardTitle className={cn(
          "flex items-center gap-2",
          compactMode ? "text-xs" : "text-sm"
        )}>
          <Activity className={compactMode ? "w-3 h-3" : "w-4 h-4"} />
          {translations.title}
        </CardTitle>
        <CardDescription className={compactMode ? "text-[0.65rem]" : "text-xs"}>
          {translations.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden flex flex-col justify-between flex-1">
        <div className="max-w-full">
          <CalendarHeatmap
            variantClassnames={variantClassnames}
            weightedDates={activityData}
            className="w-full"
            compactMode={compactMode}
          />
        </div>
        
        {/* Legend and Stats */}
        <div className={cn(
          "flex flex-col items-start border-t border-border pt-3 justify-between gap-3",
          compactMode ? "mt-2" : "mt-4"
        )}>
          <CalendarLegend
            variantClassnames={variantClassnames}
            labels={{
              less: translations.less,
              more: translations.more
            }}
            compactMode={compactMode}
          />
          <div className={cn(
            "text-muted-foreground",
            compactMode ? "text-[0.65rem]" : "text-xs"
          )}>
            <span className="font-medium">{activityData.length}</span> {translations.days_with_activity}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
