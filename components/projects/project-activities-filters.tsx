"use client"

import React, { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, SlidersHorizontal, X } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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
  /** Whether the current user is a member (collaborator) of this project */
  canAddActivity?: boolean
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
  onAddActivity,
  canAddActivity = true,
}: ProjectActivitiesFiltersProps) {
  const { i18n } = useTranslation()
  const langKey = i18n.language as keyof typeof projectTranslations
  const pt = projectTranslations[langKey] || projectTranslations.en
  const [sheetOpen, setSheetOpen] = useState(false)

  const hasSystemPermission = useHasPermission([PermissionResolverName.CreateProjectActivity])
  const canCreateActivity = hasSystemPermission && canAddActivity

  // Count active (non-default) filters for the badge
  const activeFilterCount = [
    subsidyFilter !== "all",
    statusFilter !== "all",
    priorityFilter !== "all",
    tagFilter !== "all",
  ].filter(Boolean).length

  // ── Shared filter selects (used in both layouts) ────────────────
  const FilterSelects = ({ stacked = false }: { stacked?: boolean }) => (
    <>
      <div className={stacked ? "space-y-1.5" : ""}>
        {stacked && <Label className="text-xs text-muted-foreground">{pt.filters.type}</Label>}
        <Select value={subsidyFilter} onValueChange={onSubsidyChange}>
          <SelectTrigger className={`${stacked ? "w-full" : "w-40"} h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary`}>
            <SelectValue placeholder={pt.filters.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allActivities}</SelectItem>
            <SelectItem value="subsidized">{pt.filters.subsidized}</SelectItem>
            <SelectItem value="non-subsidized">{pt.filters.nonSubsidized}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={stacked ? "space-y-1.5" : ""}>
        {stacked && <Label className="text-xs text-muted-foreground">{pt.filters.status}</Label>}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className={`${stacked ? "w-full" : "w-32"} h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary`}>
            <SelectValue placeholder={pt.filters.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allStatuses?.split(' ')?.[0] || "Todos"}</SelectItem>
            <SelectItem value="pending">{pt.filters.pending}</SelectItem>
            <SelectItem value="in_progress">{pt.filters.inProgress}</SelectItem>
            <SelectItem value="completed">{pt.filters.completed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={stacked ? "space-y-1.5" : ""}>
        {stacked && <Label className="text-xs text-muted-foreground">{pt.filters.priority}</Label>}
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className={`${stacked ? "w-full" : "w-32"} h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary`}>
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
      </div>

      <div className={stacked ? "space-y-1.5" : ""}>
        {stacked && <Label className="text-xs text-muted-foreground">{pt.filters.category}</Label>}
        <Select value={tagFilter} onValueChange={onTagChange}>
          <SelectTrigger className={`${stacked ? "w-full" : "w-32"} h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary`}>
            <SelectValue placeholder={pt.filters.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pt.filters.allStatuses?.split(' ')?.[0] || "Todas"}</SelectItem>
            <SelectItem value="reforma">{pt.activityTags.REFORM}</SelectItem>
            <SelectItem value="material">{pt.activityTags.MATERIALS}</SelectItem>
            <SelectItem value="training">{pt.activityTags.TRAINING}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )

  // ── New Activity button (shared) ────────────────────────────────
  const AddActivityButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={fullWidth ? "w-full" : undefined}>
            <Button
              onClick={() => { setSheetOpen(false); onAddActivity() }}
              size="sm"
              className={`h-9 gap-2 font-semibold ${fullWidth ? "w-full" : ""}`}
              disabled={!canCreateActivity}
            >
              <Plus className="w-4 h-4" />
              {pt.filters.newActivity}
            </Button>
          </span>
        </TooltipTrigger>
        {!canCreateActivity && (
          <TooltipContent>
            <p className="text-xs max-w-[200px]">
              {!canAddActivity
                ? (i18n.language === 'pt'
                  ? 'Apenas membros do projeto podem criar atividades.'
                  : i18n.language === 'nl'
                  ? 'Alleen projectleden kunnen activiteiten aanmaken.'
                  : 'Only project members can create activities.')
                : (i18n.language === 'pt'
                  ? 'Você não tem permissão para criar atividades.'
                  : i18n.language === 'nl'
                  ? 'U heeft geen toestemming om activiteiten aan te maken.'
                  : 'You do not have permission to create activities.')}
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="w-full">

      {/* ── MOBILE layout (< lg) ─────────────────────────────── */}
      <div className="flex lg:hidden items-center gap-2 w-full">
        {/* Search — flex-1 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={pt.filters.searchActivities}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary"
          />
        </div>

        {/* Filter Sheet trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-9 shrink-0 border-2 gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85dvh] flex flex-col p-0">
            {/* Sheet header */}
            <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  {i18n.language === 'pt' ? 'Filtros' : i18n.language === 'nl' ? 'Filters' : 'Filters'}
                </SheetTitle>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground gap-1"
                    onClick={() => { onClearFilters(); setSheetOpen(false) }}
                  >
                    <X className="w-3 h-3" />
                    {pt.filters.clear}
                  </Button>
                )}
              </div>
            </SheetHeader>

            {/* Filter content — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              <FilterSelects stacked />
            </div>

            <Separator />

            {/* Footer — Apply + New Activity */}
            <SheetFooter className="px-5 py-4 flex flex-col gap-2 shrink-0">
              <AddActivityButton fullWidth />
              <Button
                variant="outline"
                size="sm"
                className="w-full h-9"
                onClick={() => setSheetOpen(false)}
              >
                {i18n.language === 'pt' ? 'Aplicar' : i18n.language === 'nl' ? 'Toepassen' : 'Apply'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* New Activity — always visible on mobile, prominent */}
        <AddActivityButton />
      </div>

      {/* ── DESKTOP layout (≥ lg) ────────────────────────────── */}
      <div className="hidden lg:flex lg:items-center justify-between gap-3 w-full">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={pt.filters.searchActivities}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary"
          />
        </div>

        {/* Filters + actions */}
        <div className="flex items-center gap-2">
          <FilterSelects />
          <Button variant="outline" size="sm" onClick={onClearFilters} className="h-9 border-2">
            {pt.filters.clear}
          </Button>
          <AddActivityButton />
        </div>
      </div>
    </div>
  )
}
