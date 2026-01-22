"use client"

import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"
import { useHasPermission } from "@/hooks/use-has-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProjectActivitiesFiltersProps {
  subsidyFilter: string
  statusFilter: string
  priorityFilter: string
  tagFilter: string
  searchQuery: string
  onSubsidyChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onTagChange: (value: string) => void
  onSearchChange: (value: string) => void
  onClearFilters: () => void
  onAddActivity: () => void
}

export function ProjectActivitiesFilters({
  subsidyFilter,
  statusFilter,
  priorityFilter,
  tagFilter,
  searchQuery,
  onSubsidyChange,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onSearchChange,
  onClearFilters,
  onAddActivity
}: ProjectActivitiesFiltersProps) {
  const { t, i18n } = useTranslation()
  const langKey = i18n.language as keyof typeof projectTranslations
  const pt = projectTranslations[langKey] || projectTranslations.en
  
  // Check permission to create project activities
  const canCreateActivity = useHasPermission([PermissionResolverName.CreateProjectActivity])
  
  return (
    <div className="flex items-center justify-between m-0">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={pt.filters.searchActivities}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50"
        />
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center gap-3">
        <Select value={subsidyFilter} onValueChange={onSubsidyChange}>
          <SelectTrigger className="w-40 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder={pt.filters.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allActivities}</SelectItem>
            <SelectItem value="subsidized">{pt.filters.subsidized}</SelectItem>
            <SelectItem value="non-subsidized">{pt.filters.nonSubsidized}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder={pt.filters.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allStatuses?.split(' ')?.[0] || "Todos"}</SelectItem>
            <SelectItem value="pending">{pt.filters.pending}</SelectItem>
            <SelectItem value="in_progress">{pt.filters.inProgress}</SelectItem>
            <SelectItem value="completed">{pt.filters.completed}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-32 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder={pt.filters.priority} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allStatuses?.split(' ')?.[0] || "Todas"}</SelectItem>
            <SelectItem value="urgent">{pt.filters.urgent}</SelectItem>
            <SelectItem value="high">{pt.filters.high}</SelectItem>
            <SelectItem value="medium">{pt.filters.medium}</SelectItem>
            <SelectItem value="low">{pt.filters.low}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={onTagChange}>
          <SelectTrigger className="w-32 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder={pt.filters.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allStatuses?.split(' ')?.[0] || "Todas"}</SelectItem>
            <SelectItem value="reforma">{pt.activityTags.REFORM}</SelectItem>
            <SelectItem value="material">{pt.activityTags.MATERIALS}</SelectItem>
            <SelectItem value="training">{pt.activityTags.TRAINING}</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onClearFilters} className="h-9 border-2">
          {pt.filters.clear}
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  onClick={onAddActivity} 
                  size="sm" 
                  className="h-9"
                  disabled={!canCreateActivity}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {pt.filters.newActivity}
                </Button>
              </div>
            </TooltipTrigger>
            {!canCreateActivity && (
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  {i18n.language === 'pt' 
                    ? 'Você não tem permissão para criar atividades. Entre em contato com o administrador para solicitar acesso.'
                    : i18n.language === 'nl'
                    ? 'U heeft geen toestemming om activiteiten aan te maken. Neem contact op met de beheerder om toegang aan te vragen.'
                    : 'You do not have permission to create activities. Contact the administrator to request access.'}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
