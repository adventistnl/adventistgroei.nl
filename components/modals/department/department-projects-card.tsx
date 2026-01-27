"use client"

import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  User
} from "lucide-react"
import { departmentTranslations } from "@/lib/translations/departments"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { WithPermission } from "@/hocs/with-permission"

interface Project {
  id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at?: string
  owner_id?: string
  owner?: {
    id: string
    name: string
    email: string
  } | null
  church_department_id?: string
  department_id?: string
  budget?: number
  subsidized_budget?: number
}

interface DepartmentProjectsCardProps {
  projects?: Project[]
  departmentId?: string
  departmentName: string
  loading?: boolean
  privacyConfig?: any
}

/**
 * COMPONENTE DE CARD DE PROJETOS DO DEPARTAMENTO
 * Exibe todos os projetos vinculados a um departamento específico
 * 
 * Lógica:
 * - Filtra projetos pelo department_id ou church_department_id
 * - Agrupa por status (Em Progresso, Concluídos, Outros)
 * - Exibe em seções expansíveis
 * - Ordena por data de atualização
 */
export function DepartmentProjectsCard({ 
  projects = [],
  departmentId,
  departmentName,
  loading = false,
  privacyConfig
}: DepartmentProjectsCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en
  const router = useRouter()

  const [expandedStatus, setExpandedStatus] = useState<string | null>('IN_PROGRESS')

  const handleCreateProject = () => {
    router.push('/projects/new')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Filtrar e agrupar projetos
  const groupedProjects = useMemo(() => {
    // Filtrar projetos do departamento
    const deptProjects = departmentId 
      ? projects.filter(p => 
          p.church_department_id === departmentId || 
          p.department_id === departmentId
        )
      : projects

    // Debug: Log financial data from projects
    console.log('💰 [Department Projects Card] Financial Data Analysis:', {
      departmentId,
      departmentName,
      totalProjects: deptProjects.length,
      projectsWithBudget: deptProjects.filter(p => p.budget && p.budget > 0).length,
      projectsWithSubsidy: deptProjects.filter(p => p.subsidized_budget && p.subsidized_budget > 0).length,
      projectsWithoutFinancialData: deptProjects.filter(p => !p.budget && !p.subsidized_budget).length,
      projectDetails: deptProjects.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        budget: p.budget || 0,
        subsidized_budget: p.subsidized_budget || 0,
        hasBudget: !!p.budget && p.budget > 0,
        hasSubsidy: !!p.subsidized_budget && p.subsidized_budget > 0
      }))
    })

    // Agrupar por status - CORRIGIDO
    // In Progress: apenas IN_PROGRESS, PLANNING, EXECUTION
    const inProgress = deptProjects.filter(p => 
      ['IN_PROGRESS', 'ON_HOLD'].includes(p.status)
    )
    
    // Completed: apenas CONCLUDED
    const completed = deptProjects.filter(p => p.status === 'CONCLUDED')
    
    // Others: todos os outros status (DRAFT, EXPIRED, CANCELLED, ON_HOLD, IN_REVIEW, etc.)
    const others = deptProjects.filter(p => 
      !['IN_PROGRESS', 'ON_HOLD','IN_REVIEW', 'CONCLUDED'].includes(p.status)
    )

    // Calcular totais monetários
    const totalBudget = deptProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0)
    const totalSubsidy = deptProjects.reduce((sum, p) => sum + Number(p.subsidized_budget || 0), 0)
    const inProgressBudget = inProgress.reduce((sum, p) => sum + Number(p.budget || 0), 0)
    const completedBudget = completed.reduce((sum, p) => sum + Number(p.budget || 0), 0)

    // Debug: Log calculated totals
    console.log('📊 [Department Projects Card] Calculated Financial Totals:', {
      departmentId,
      departmentName,
      totalBudget,
      totalSubsidy,
      inProgressBudget,
      completedBudget,
      contributionPercentage: totalBudget > 0 ? (totalSubsidy / totalBudget) * 100 : 0,
      budgetDistribution: {
        inProgress: {
          count: inProgress.length,
          budget: inProgressBudget,
          percentage: totalBudget > 0 ? (inProgressBudget / totalBudget) * 100 : 0
        },
        completed: {
          count: completed.length,
          budget: completedBudget,
          percentage: totalBudget > 0 ? (completedBudget / totalBudget) * 100 : 0
        }
      }
    })

    return {
      inProgress: inProgress.sort((a, b) => 
        new Date(b.updated_at || b.created_at).getTime() - 
        new Date(a.updated_at || a.created_at).getTime()
      ),
      completed: completed.sort((a, b) => 
        new Date(b.updated_at || b.created_at).getTime() - 
        new Date(a.updated_at || a.created_at).getTime()
      ),
      others: others.sort((a, b) => 
        new Date(b.updated_at || b.created_at).getTime() - 
        new Date(a.updated_at || a.created_at).getTime()
      ),
      total: deptProjects.length,
      totalBudget,
      totalSubsidy,
      inProgressBudget,
      completedBudget,
      contributionPercentage: totalBudget > 0 ? (totalSubsidy / totalBudget) * 100 : 0
    }
  }, [projects, departmentId, departmentName])

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "error"; icon: any }> = {
      'IN_PROGRESS': { 
        label: t.projects?.status?.in_progress || 'In Progress', 
        variant: 'default',
        icon: Clock
      },
      'ON_HOLD': { 
        label: t.projects?.status?.on_hold || 'On Hold', 
        variant: 'default',
        icon: Target
      },
      'IN_REVIEW': { 
        label: t.projects?.status?.in_review || 'In Review', 
        variant: 'default',
        icon: Clock
      },
      'CONCLUDED': { 
        label: t.projects?.status?.concluded || 'Concluded', 
        variant: 'success',
        icon: CheckCircle2
      },
      'EXPIRED': { 
        label: t.projects?.status?.expired || 'Expired', 
        variant: 'error',
        icon: AlertCircle
      },
      'CANCELLED': { 
        label: t.projects?.status?.cancelled || 'Cancelled', 
        variant: 'error',
        icon: AlertCircle
      },
    }
    
    return statusMap[status] || { 
      label: status, 
      variant: 'default' as const,
      icon: FileText
    }
  }

  const renderProjectsList = (projectsList: Project[]) => {
    if (projectsList.length === 0) {
      return (
        <div className="text-sm text-muted-foreground italic py-2">
          {t.projects?.no_projects || "No projects"}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {projectsList.map((project) => {
          const statusInfo = getStatusInfo(project.status)
          const StatusIcon = statusInfo.icon
          
          return (
            <div
              key={project.id}
              className="p-3 rounded-md border bg-card hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <h4 className="font-medium text-sm line-clamp-1">
                      {project.title}
                    </h4>
                  </div>
                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <StatusBadge
                  label={statusInfo.label}
                  variant={statusInfo.variant}
                  showDot
                  size="sm"
                  className="flex-shrink-0"
                />
              </div>
              
              {/* Owner Info */}
              <div className="flex items-center gap-2 pt-2 border-t">
                {project.owner ? (
                  <>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-[10px] bg-muted">
                        {getInitials(project.owner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground truncate">
                        {t.projects?.owner_label || "Owner:"} <span className="text-foreground font-medium">{project.owner.name}</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">
                      {t.projects?.no_owner || "No owner assigned"}
                    </p>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <WithPermission
        requiredPermissions={[PermissionResolverName.Projects]}
        fallback={<PermissionDeniedOverlay height="600px" blurIntensity="medium">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col pb-0">
              <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-2.5 rounded-md border bg-card">
                    <Skeleton className="h-6 w-full mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
              <Separator className="flex-shrink-0" />
              <div className="flex-1 overflow-y-auto space-y-3 mt-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </PermissionDeniedOverlay>}
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div className="h-5 bg-muted rounded animate-pulse w-40" />
              </div>
              <div className="h-3 bg-muted rounded animate-pulse w-56" />
            </div>
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden flex flex-col pb-0">
          {/* KPI Stats Skeleton */}
          <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-2.5 rounded-md border bg-card">
                <div className="h-6 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse w-16" />
              </div>
            ))}
          </div>

          <Separator className="flex-shrink-0" />

          {/* Projects List Skeleton */}
          <div className="flex-1 overflow-y-auto space-y-3 mt-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="pl-2 space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="p-3 rounded-md border bg-card">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-full" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Footer Skeleton */}
        <div className="border-t bg-muted/30 p-3 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-muted rounded animate-pulse w-20" />
                <div className="h-5 bg-muted rounded animate-pulse w-24" />
              </div>
            ))}
          </div>
        </div>
      </Card>
      </WithPermission>
    )
  }

  return (
    <WithPermission
      requiredPermissions={[PermissionResolverName.Projects]}
      fallback={<PermissionDeniedOverlay height="600px" blurIntensity="medium">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col pb-0">
            <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-2.5 rounded-md border bg-card">
                  <Skeleton className="h-6 w-full mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            <Separator className="flex-shrink-0" />
            <div className="flex-1 overflow-y-auto space-y-3 mt-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </PermissionDeniedOverlay>}
    >
    <Card className="h-full flex flex-col">
      {/* Fixed Header */}
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-muted-foreground" />
              {t.projects?.title || "Department Projects"}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {t.projects?.description?.replace('{{departmentName}}', departmentName) || `All projects linked to ${departmentName}`}
            </CardDescription>
          </div>
          <WithPermission requiredPermissions={[PermissionResolverName.CreateProject]}>
            <Button
              onClick={handleCreateProject}
              size="sm"
              className="h-8 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {t.projects?.create_button || "Create Project"}
            </Button>
          </WithPermission>

        </div>
      </CardHeader>
      
      {/* Scrollable Content Area */}
      <CardContent className="flex-1 overflow-hidden flex flex-col pb-0">
        {groupedProjects.total === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-6">
            {/* Empty state illustration */}
            <div className="relative w-full max-w-sm bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="space-y-3 w-full px-6">
                {/* Empty project cards stack */}
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="h-12 bg-muted/40 rounded-md relative"
                      style={{ 
                        opacity: 1 - (i * 0.3),
                        transform: `translateY(-${i * 2}px)`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center px-3 gap-2">
                        <div className="h-6 w-6 bg-muted/60 rounded" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-muted/60 rounded w-2/3" />
                          <div className="h-1.5 bg-muted/60 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  {t.projects?.empty_state?.title || "No Projects Yet"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.projects?.empty_state?.description || "This department doesn't have any projects. Click 'Create Project' to get started."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Fixed KPI Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0">
              <div className="p-2.5 rounded-md border bg-card">
                <div className="text-xl font-semibold">
                  {groupedProjects.inProgress.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {t.projects?.kpi?.in_progress || "In Progress"}
                </div>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <div className="text-xl font-semibold">
                  {groupedProjects.completed.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {t.projects?.kpi?.completed || "Completed"}
                </div>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <div className="text-xl font-semibold">
                  {groupedProjects.total}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {t.common?.total || "Total"}
                </div>
              </div>
            </div>

            <Separator className="flex-shrink-0" />

            {/* Scrollable Projects Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mt-3">
              {/* In Progress Projects */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto hover:bg-accent/50"
                  onClick={() => setExpandedStatus(expandedStatus === 'IN_PROGRESS' ? null : 'IN_PROGRESS')}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {t.projects?.sections?.in_progress || "In Progress"}
                    </span>
                    <Badge variant="outline" className="ml-2 h-5 text-xs">
                      {groupedProjects.inProgress.length}
                    </Badge>
                  </div>
                  {expandedStatus === 'IN_PROGRESS' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedStatus === 'IN_PROGRESS' && (
                  <div className="pl-2">
                    {renderProjectsList(groupedProjects.inProgress)}
                  </div>
                )}
              </div>

              {/* Completed Projects */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto hover:bg-accent/50"
                  onClick={() => setExpandedStatus(expandedStatus === 'CONCLUDED' ? null : 'CONCLUDED')}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {t.projects?.sections?.completed || "Completed"}
                    </span>
                    <Badge variant="outline" className="ml-2 h-5 text-xs">
                      {groupedProjects.completed.length}
                    </Badge>
                  </div>
                  {expandedStatus === 'CONCLUDED' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedStatus === 'CONCLUDED' && (
                  <div className="pl-2">
                    {renderProjectsList(groupedProjects.completed)}
                  </div>
                )}
              </div>

              {/* Other Status Projects */}
              {groupedProjects.others.length > 0 && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto hover:bg-accent/50"
                    onClick={() => setExpandedStatus(expandedStatus === 'OTHERS' ? null : 'OTHERS')}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {t.projects?.sections?.others || "Others"}
                      </span>
                      <Badge variant="outline" className="ml-2 h-5 text-xs">
                        {groupedProjects.others.length}
                      </Badge>
                    </div>
                    {expandedStatus === 'OTHERS' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedStatus === 'OTHERS' && (
                    <div className="pl-2">
                      {renderProjectsList(groupedProjects.others)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      {/* Fixed Financial Footer */}
      {groupedProjects.total > 0 && privacyConfig && (
        <PrivacyWrapper
          config={privacyConfig}
          showToggle={false}
          className="border-t bg-muted/30"
          fallback={
            <div className="border-t bg-muted/30 p-3 flex-shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-foreground/60" />
                    <span className="text-xs text-muted-foreground">
                      {t.projects?.footer?.total_budget || "Total Budget"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 blur-[1px] opacity-40">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-foreground/60" />
                    <span className="text-xs text-muted-foreground">
                      {t.projects?.footer?.total_subsidy || "Total Subsidy"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 blur-[1px] opacity-40">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                    ))}
                  </div>
                </div>

                <div className="col-span-2 border-t pt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t.projects?.footer?.distribution || "Budget Distribution"}
                    </span>
                    <div className="flex items-center justify-center gap-1 blur-[1px] opacity-40">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <div className="p-3 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {/* Total Budget */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-foreground/60" />
                  <span className="text-xs text-muted-foreground">
                    {t.projects?.footer?.total_budget || "Total Budget"}
                  </span>
                </div>
                <div className="text-base font-semibold">
                  {formatCurrency(groupedProjects.totalBudget)}
                </div>
              </div>

              {/* Total Subsidy Requested */}
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-foreground/60" />
                  <span className="text-xs text-muted-foreground">
                    {t.projects?.footer?.total_subsidy || "Total Subsidy"}
                  </span>
                </div>
                <div className="text-base font-semibold">
                  {formatCurrency(groupedProjects.totalSubsidy)}
                </div>
              </div>

              {/* Budget Distribution */}
              <div className="col-span-2 border-t space-y-1.5">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    {t.projects?.footer?.distribution || "Budget Distribution"}
                  </span>
                  <span className="text-xs font-medium">
                    {groupedProjects.contributionPercentage.toFixed(1)}% {t.projects?.footer?.subsidized || "subsidized"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PrivacyWrapper>
      )}
      
      {/* Footer sem privacidade quando privacyConfig não está disponível */}
      {groupedProjects.total > 0 && !privacyConfig && (
        <div className="border-t bg-muted/30 p-3 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            {/* Total Budget */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-foreground/60" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {t.projects?.financial?.total_budget || "Total Project Budget"}
                </span>
              </div>
              <div className="text-base font-semibold">
                {formatCurrency(groupedProjects.totalBudget)}
              </div>
            </div>

            {/* Total Subsidy Requested */}
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-foreground/60" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {t.projects?.financial?.contribution_requested || "Contribution Requested"}
                </span>
              </div>
              <div className="text-base font-semibold">
                {formatCurrency(groupedProjects.totalSubsidy)}
              </div>
            </div>

            {/* Budget Distribution */}
            <div className="col-span-2 border-t space-y-1.5">
              {/* Contribution Percentage */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-muted-foreground">
                  {t.projects?.financial?.contribution_rate || "Contribution Rate"}
                </span>
                <span className="text-xs font-medium">
                  {groupedProjects.contributionPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
    </WithPermission>
  )
}
