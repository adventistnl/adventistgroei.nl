"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  CalendarPlus,
  Megaphone,
  Copy,
  Globe,
  Lock,
  Users,
  Calendar,
  Building,
  MapPin,
  FileText
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { projectTranslations } from "@/lib/translations/projects"
import { mockDepartments } from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

interface ProjectHeaderProps {
  project: ProjectTableData
  onEdit?: () => void
  onDelete?: () => void
  onCreateEvent?: () => void
  onCreateCommunication?: () => void
  onDuplicate?: () => void
  onCreateReport?: () => void
}

export function ProjectHeader({ 
  project, 
  onEdit, 
  onDelete, 
  onCreateEvent, 
  onCreateCommunication, 
  onDuplicate,
  onCreateReport 
}: ProjectHeaderProps) {
  const { i18n } = useTranslation()
  const router = useRouter()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department?.name || "Unknown Department"
  }

  // Get status display configuration based on backend status
  const getProjectStatus = (project: ProjectTableData) => {
    const statusConfig: Record<string, { text: string; className: string }> = {
      DRAFT: { text: t.status?.draft || 'Draft', className: "bg-gray-100 text-gray-700 border-gray-200" },
      IN_PROGRESS: { text: t.status?.inProgress || 'In Progress', className: "bg-green-100 text-green-700 border-green-200" },
      IN_REVIEW: { text: t.status?.inReview || 'In Review', className: "bg-blue-100 text-blue-700 border-blue-200" },
      ON_HOLD: { text: t.status?.onHold || 'On Hold', className: "bg-amber-100 text-amber-700 border-amber-200" },
      EXPIRED: { text: t.status?.expired || 'Expired', className: "bg-red-100 text-red-700 border-red-200" },
      CONCLUDED: { text: t.status?.concluded || 'Concluded', className: "bg-slate-100 text-slate-700 border-slate-200" },
    }
    
    return statusConfig[project.status] || statusConfig.DRAFT
  }

  const handleBack = () => {
    router.push("/projects")
  }

  const status = getProjectStatus(project)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToProjects}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateReport}
              className="gap-2 text-teal-600 border-teal-200 hover:bg-teal-50"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Relatório</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t.actions.editProject}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  {t.actions.duplicateProject}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreateEvent}>
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  {t.actions.createEvent}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCreateCommunication}>
                  <Megaphone className="w-4 h-4 mr-2" />
                  {t.actions.createCommunication}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCreateReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Criar Relatório
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t.deleteProject}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Project Title and Status */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {project.is_private ? (
                <Lock className="w-6 h-6 text-amber-600" />
              ) : (
                <Globe className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-2">{project.title}</CardTitle>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Project Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={status.className}>
              {status.text}
            </Badge>
            
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Building className="w-3 h-3 mr-1" />
              {getDepartmentName(project.department_id)}
            </Badge>
            
            {project.is_private && (
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                <Lock className="w-3 h-3 mr-1" />
                {t.private}
              </Badge>
            )}
            
            {project.required_volunteers && (
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                <Users className="w-3 h-3 mr-1" />
                {t.volunteers}
              </Badge>
            )}
            
            {project.is_event && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Calendar className="w-3 h-3 mr-1" />
                Evento
              </Badge>
            )}
            
            <Badge variant="outline" className="text-gray-600 border-gray-200">
              <MapPin className="w-3 h-3 mr-1" />
              {project.type || "Local"}
            </Badge>
            
            <Badge variant="outline" className="text-slate-600 border-slate-200">
              {project.language_preference.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Project Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Orçamento Total</p>
            <p className="text-lg font-semibold">R$ {project.budget.toLocaleString()}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Período</p>
            <p className="text-lg font-semibold">
              {new Date(project.start_at).toLocaleDateString('pt-BR')} - {new Date(project.end_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Pedidos de Subsídio</p>
            <p className="text-lg font-semibold">
              {project.subsidyRequests || 0} ({(project.subsidyAmount || 0).toLocaleString()} R$)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}