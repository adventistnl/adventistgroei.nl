"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  MoreVertical,
  Folder,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  Sprout,
  Plus,
  DollarSign,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ProjectTableData } from "@/components/projects/projects-table"
import { mockDepartments } from "@/data/mockData"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"

interface ProjectHeaderMinimalProps {
  project: ProjectTableData
  onEdit?: () => void
  onDelete?: () => void
  onCreateCommunication?: () => void
  onCreateEvent?: () => void
  /**
   * Variant controls a small visual treatment for special project types.
   * - 'default' : normal folder avatar
   * - 'churchPlanting' : sprout icon + green accent
   * - 'special' : plus icon + orange accent
   */
  variant?: 'default' | 'churchPlanting' | 'special'
  /** Optional funding snapshot to render contribution summary and validate policies */
  funding?: {
    totalBudget?: number
    subsidyBudget?: number
    institutionContribution?: number
    subsidyPercentage?: number
  }
  /** Optional override for funding policies (defaults provided) */
  fundingPolicies?: Partial<{
    max_institution_percent: number
    max_institution_amount: number
    min_church_percent: number
    default_church_percent: number
    default_institution_percent: number
  }>
  /** Users registered in the project */
  users?: UserAvatarData[]
  /** Callback when adding new users to the project */
  onAddUser?: () => void
}

export function ProjectHeaderMinimal({
  project,
  onEdit,
  onDelete,
  onCreateCommunication,
  onCreateEvent,
  variant = 'default',
  funding,
  fundingPolicies: fundingPoliciesProp,
  users = [],
  onAddUser,
}: ProjectHeaderMinimalProps) {
  const router = useRouter()
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // Monochromatic status appearance
  const statusColors: Record<string, string> = {
    planned: "bg-gray-50 text-gray-900 border-gray-200",
    active: "bg-gray-50 text-gray-900 border-gray-200",
    upcoming: "bg-gray-50 text-gray-900 border-gray-200",
    completed: "bg-gray-50 text-gray-900 border-gray-200",
    cancelled: "bg-gray-50 text-gray-900 border-gray-200",
  }

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department?.name || departmentId
  }

  // Variant visual configuration
  const variantConfig: Record<string, { icon: any; accent: string; avatarBg: string }> = {
    default: { icon: Folder, accent: 'border-gray-200', avatarBg: 'bg-gray-900' },
    churchPlanting: { icon: Sprout, accent: 'border-green-500', avatarBg: 'bg-green-600' },
    special: { icon: Plus, accent: 'border-orange-500', avatarBg: 'bg-orange-600' },
  }

  const activeVariant = variant || 'default'
  const VariantIcon = variantConfig[activeVariant].icon
  const variantAccent = variantConfig[activeVariant].accent
  const variantAvatarBg = variantConfig[activeVariant].avatarBg

  // Default funding policy values (can be overridden via props)
  const DEFAULT_FUNDING_POLICIES = {
    max_institution_percent: 65,
    max_institution_amount: 5000,
    min_church_percent: 35,
    default_church_percent: 35,
    default_institution_percent: 65,
  }

  const fundingPolicies = { ...DEFAULT_FUNDING_POLICIES, ...(fundingPoliciesProp || {}) }

  // Funding snapshot (may be partial)
  const totalBudget = funding?.totalBudget || 0
  const institutionContribution = funding?.institutionContribution || 0
  const subsidyBudget = funding?.subsidyBudget || 0
  const subsidyPercentage = funding?.subsidyPercentage ?? fundingPolicies.default_institution_percent

  const institutionPercent = totalBudget > 0 ? (institutionContribution / totalBudget) * 100 : 0

  const exceedsInstitutionAmount = institutionContribution > fundingPolicies.max_institution_amount
  const exceedsInstitutionPercent = institutionPercent > fundingPolicies.max_institution_percent
  const belowMinChurchPercent = totalBudget > 0 ? ((totalBudget - institutionContribution) / totalBudget) * 100 < fundingPolicies.min_church_percent : false

  const handleBack = () => {
    router.push('/projects')
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t.actions.editProject}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onCreateCommunication && (
                <DropdownMenuItem onClick={onCreateCommunication}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t.actions.createCommunication}
                </DropdownMenuItem>
              )}
              {onCreateEvent && (
                <DropdownMenuItem onClick={onCreateEvent}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {t.actions.createEvent}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Minimalist Project Header */}
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 rounded-lg relative">
          <AvatarFallback className={cn("rounded-lg", variantAvatarBg)}>
            <Folder className="w-8 h-8 text-white" />
          </AvatarFallback>

          {/* Variant icon overlay (small) positioned top-right of avatar */}
          <div
            className={cn(
              "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white border-2",
              variantAvatarBg,
              variantAccent
            )}
            aria-hidden
          >
            <VariantIcon className="w-3.5 h-3.5" />
          </div>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Title and Users Row */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="text-3xl font-bold flex-1">{project.title}</h1>
            
            {/* Users Avatar Group - Top Right */}
            <div className="flex items-center gap-2">
              <UsersAvatarGroup 
                users={users}
                maxDisplay={5}
                size="md"
                showLabel={true}
                showAddButton={true}
                onAddUser={onAddUser}
              />
            </div>
          </div>
          
          {project.description && (
            <p className="text-muted-foreground mb-3">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={cn("capitalize", statusColors[project.status])}>
              {t.filters[project.status as keyof typeof t.filters] || project.status}
            </Badge>
            <Badge variant="outline">
              {getDepartmentName(project.department_id)}
            </Badge>
            <Badge variant="outline">
              R$ {project.budget.toLocaleString()}
            </Badge>
          </div>

          {/* Funding summary & policy indicators (optional) */}
          { (totalBudget > 0 || subsidyBudget > 0 || institutionContribution > 0) && (
            <div className="mt-3 flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-full", variantAvatarBg)} aria-hidden />
              <div className="text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Instituição:</span>
                  <span>R$ {institutionContribution.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">({institutionPercent.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">Orçamento total:</span>
                  <span>R$ {totalBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="ml-2 flex items-center gap-2">
                {exceedsInstitutionAmount && (
                  <Badge variant="outline" className="text-red-600 border-red-200">Limite instituição excedido</Badge>
                )}
                {!exceedsInstitutionAmount && exceedsInstitutionPercent && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200">Percentual excede limite</Badge>
                )}
                {!exceedsInstitutionAmount && !exceedsInstitutionPercent && (
                  <Badge variant="outline" className="text-green-700 border-green-200">Política OK</Badge>
                )}
                {belowMinChurchPercent && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200">Igreja abaixo do mínimo</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

