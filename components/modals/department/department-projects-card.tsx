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
import { useRouter } from "next/navigation"

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
  loading = false 
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

    // Agrupar por status - CORRIGIDO
    // In Progress: apenas IN_PROGRESS, PLANNING, EXECUTION
    const inProgress = deptProjects.filter(p => 
      ['IN_PROGRESS', 'PLANNING', 'EXECUTION'].includes(p.status)
    )
    
    // Completed: apenas CONCLUDED
    const completed = deptProjects.filter(p => p.status === 'CONCLUDED')
    
    // Others: todos os outros status (DRAFT, EXPIRED, CANCELLED, ON_HOLD, IN_REVIEW, etc.)
    const others = deptProjects.filter(p => 
      !['IN_PROGRESS', 'PLANNING', 'EXECUTION', 'CONCLUDED'].includes(p.status)
    )

    // Calcular totais monetários
    const totalBudget = deptProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0)
    const totalSubsidy = deptProjects.reduce((sum, p) => sum + Number(p.subsidized_budget || 0), 0)
    const inProgressBudget = inProgress.reduce((sum, p) => sum + Number(p.budget || 0), 0)
    const completedBudget = completed.reduce((sum, p) => sum + Number(p.budget || 0), 0)

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
  }, [projects, departmentId])

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "error"; icon: any }> = {
      'IN_PROGRESS': { 
        label: 'In Progress', 
        variant: 'default',
        icon: Clock
      },
      'PLANNING': { 
        label: 'Planning', 
        variant: 'default',
        icon: Target
      },
      'EXECUTION': { 
        label: 'Execution', 
        variant: 'default',
        icon: Clock
      },
      'CONCLUDED': { 
        label: 'Concluded', 
        variant: 'success',
        icon: CheckCircle2
      },
      'EXPIRED': { 
        label: 'Expired', 
        variant: 'error',
        icon: AlertCircle
      },
      'CANCELLED': { 
        label: 'Cancelled', 
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
          No projects
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
                        Owner: <span className="text-foreground font-medium">{project.owner.name}</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">
                      No owner assigned
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="h-5 bg-muted rounded animate-pulse w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Department Projects
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {departmentName}
            </CardDescription>
          </div>
          <Button
            onClick={handleCreateProject}
            size="sm"
            className="h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Project
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto space-y-3 pb-0">
        {groupedProjects.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No projects found for this department
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2.5 rounded-md border bg-card">
                <div className="text-xl font-semibold">
                  {groupedProjects.inProgress.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  In Progress
                </div>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <div className="text-xl font-semibold">
                  {groupedProjects.completed.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Completed
                </div>
              </div>
              <div className="p-2.5 rounded-md border bg-card">
                <div className="text-xl font-semibold">
                  {groupedProjects.total}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Total
                </div>
              </div>
            </div>

            <Separator />

            {/* In Progress Projects */}
            {groupedProjects.inProgress.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto hover:bg-accent/50"
                  onClick={() => setExpandedStatus(expandedStatus === 'IN_PROGRESS' ? null : 'IN_PROGRESS')}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      In Progress
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
            )}

            {/* Completed Projects */}
            {groupedProjects.completed.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto hover:bg-accent/50"
                  onClick={() => setExpandedStatus(expandedStatus === 'CONCLUDED' ? null : 'CONCLUDED')}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      Completed
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
            )}

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
                      Others
                    </span>
                    <Badge variant="outline" className="ml-2 h-5 text-xs">

      {/* Financial Footer */}
      {groupedProjects.total > 0 && (
        <div className="border-t bg-muted/30 p-3 mt-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* Total Budget */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-foreground/60" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Total Budget
                </span>
              </div>
              <div className="text-base font-semibold">
                {formatCurrency(groupedProjects.totalBudget)}
              </div>
            </div>

            {/* Total Subsidy Requested */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-foreground/60" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Subsidy Requested
                </span>
              </div>
              <div className="text-base font-semibold">
                {formatCurrency(groupedProjects.totalSubsidy)}
              </div>
            </div>

            {/* Budget Distribution */}
            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>In Progress: {formatCurrency(groupedProjects.inProgressBudget)}</span>
                <span>Completed: {formatCurrency(groupedProjects.completedBudget)}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                {groupedProjects.totalBudget > 0 && (
                  <>
                    <div 
                      className="bg-foreground/60"
                      style={{ 
                        width: `${(groupedProjects.inProgressBudget / groupedProjects.totalBudget) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-foreground/40"
                      style={{ 
                        width: `${(groupedProjects.completedBudget / groupedProjects.totalBudget) * 100}%` 
                      }}
                    />
                  </>
                )}
              </div>

              {/* Contribution Percentage */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-muted-foreground">
                  Contribution Rate
                </span>
                <span className="text-xs font-medium">
                  {groupedProjects.contributionPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
