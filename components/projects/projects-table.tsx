"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Globe,
  Lock,
  Calendar,
  DollarSign,
  Building,
  CalendarPlus,
  Megaphone,
  Copy
} from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { projectTranslations } from "@/lib/translations/projects"
import { useQuery } from "@apollo/client"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { format } from "date-fns"
import { ptBR, enUS, nl } from "date-fns/locale"

export interface ProjectTableData {
  id: string
  department_id: string
  title: string
  description: string
  budget: number
  is_private: boolean
  required_volunteers: boolean
  start_at: string
  end_at: string
  created_at?: string
  language_preference: string
  institutionId: string
  // Names for display
  institutionName?: string
  departmentName?: string
  status: "active" | "upcoming" | "completed"
  subsidyRequests?: number
  subsidyAmount?: number
  activities?: number
  is_event?: boolean
  type?: "Local" | "Global"
  eventId?: string | null
  // Relations
  Institution?: {
    id: string
    name: string
  }
  institution?: {
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
    church?: {
      id: string
      name: string
    }
  }
  Church?: {
    id: string
    name: string
  }
  church?: {
    id: string
    name: string
  }
  owner?: {
    id: string
    name: string
    email: string
  }
}

interface ProjectsTableProps {
  data: ProjectTableData[]
  onView?: (project: ProjectTableData) => void
  onEdit?: (project: ProjectTableData) => void
  onDelete?: (project: ProjectTableData) => void
  onCreateEvent?: (project: ProjectTableData) => void
  onCreateCommunication?: (project: ProjectTableData) => void
  onDuplicate?: (project: ProjectTableData) => void
}

export function ProjectsTable({
  data,
  onView,
  onEdit,
  onDelete,
  onCreateEvent,
  onCreateCommunication,
  onDuplicate
}: ProjectsTableProps) {
  const { i18n } = useTranslation()
  const { currentInstitutionData } = useInstitution()
  const { formatCurrency } = useCurrency()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const dateLocale = React.useMemo(() => {
    switch (i18n.language) {
      case 'pt': return ptBR
      case 'nl': return nl
      default: return enUS
    }
  }, [i18n.language])

  const institutionId = currentInstitutionData?.id

  // Fetch departments
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  const departments = departmentsData?.departments || []

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId)
    return department?.name || "Unknown"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { 
        label: t.active, 
        className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
      },
      upcoming: { 
        label: t.upcoming, 
        className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" 
      },
      completed: { 
        label: t.completed, 
        className: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200" 
      }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const columns: ColumnDef<ProjectTableData>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: t.table.projectTitle,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            {row.original.is_private ? (
              <Lock className="w-4 h-4 text-amber-600" />
            ) : (
              <Globe className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{row.original.title}</div>
            <div className="text-xs text-muted-foreground max-w-xs truncate line-clamp-2">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "department",
      accessorKey: "department_id",
      header: t.table.department,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            {getDepartmentName(row.original.department_id)}
          </span>
        </div>
      ),
    },
    {
      id: "budget",
      accessorKey: "budget",
      header: t.table.budget,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium">
            {formatCurrency(row.original.budget)}
          </span>
        </div>
      ),
    },
    {
      id: "dates",
      header: t.table.period,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="text-sm">
            <div>{format(new Date(row.original.start_at), "P", { locale: dateLocale })}</div>
            <div className="text-xs text-muted-foreground">
              - {format(new Date(row.original.end_at), "P", { locale: dateLocale })}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "subsidy_info",
      header: t.table.subsidyRequests,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-sm">
            {row.original.subsidyRequests || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(row.original.subsidyAmount || 0)}
          </div>
        </div>
      ),
    },
    {
      id: "volunteers",
      header: t.table.volunteers,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.required_volunteers ? (
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Users className="w-3 h-3 mr-1" />
              {t.table.yes}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-600 border-gray-200">
              {t.table.no}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t.table.status,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: t.table.actions,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onView?.(row.original)}>
              <Eye className="w-4 h-4 mr-2" />
              {t.actions.viewDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.actions.editProject}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(row.original)}>
              <Copy className="w-4 h-4 mr-2" />
              {t.actions.duplicateProject}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onCreateEvent?.(row.original)}>
              <CalendarPlus className="w-4 h-4 mr-2" />
              {t.actions.createEvent}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateCommunication?.(row.original)}>
              <Megaphone className="w-4 h-4 mr-2" />
              {t.actions.createCommunication}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(row.original)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.deleteProject}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder={t.searchProjects}
      filterableColumns={[
        {
          id: "department_id",
          title: t.table.department,
          options: departments.map(dept => ({
            label: dept.name,
            value: dept.id
          }))
        },
        {
          id: "status",
          title: t.table.status,
          options: [
            { label: t.active, value: "active" },
            { label: t.upcoming, value: "upcoming" },
            { label: t.completed, value: "completed" }
          ]
        }
      ]}
      translations={{
        search: t.searchProjects,
        clearFilters: t.table.clearFilters,
        columns: t.table.columns,
        rowsPerPage: t.table.rowsPerPage,
        showingResults: (from, to, total) => t.table.showingResults
          .replace('{{from}}', from.toString())
          .replace('{{to}}', to.toString())
          .replace('{{total}}', total.toString()),
        previous: t.table.previous,
        next: t.table.next,
        noResults: t.table.noResults,
        all: t.filters?.allDepartments?.split(' ')?.[0] || "All" // "Todos" / "Alle" / "All"
      }}
    />
  )
}
