"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  DollarSign,
  Building,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Pause
} from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { reportsTranslations } from "@/lib/translations/reports"
import { mockDepartments, mockProjects } from "@/data/mockData"

export interface ReportTableData {
  id: string
  title: string
  description: string
  report_type: "financial" | "progress" | "annual"
  project_id: string
  department_id: string
  submission_date: string
  report_status: "approved" | "in_review" | "on_hold" | "needs_adjustment" | "rejected"
  total_project_budget: number
  total_project_budget_spent: number
  total_project_budget_left: number
  total_subsidies_requested: number
  total_subsidies_approved: number
  progress_percentage: number
  report_note: string | null
  attached_file: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

interface ReportsTableProps {
  data: ReportTableData[]
  onView?: (report: ReportTableData) => void
  onEdit?: (report: ReportTableData) => void
  onDelete?: (report: ReportTableData) => void
  onDownload?: (report: ReportTableData) => void
}

export function ReportsTable({ data, onView, onEdit, onDelete, onDownload }: ReportsTableProps) {
  const { i18n } = useTranslation()
  const t = reportsTranslations[i18n.language as keyof typeof reportsTranslations] || reportsTranslations.en

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department?.name || "Unknown Department"
  }

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId)
    return project?.title || "Unknown Project"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { 
        label: t.statuses.approved, 
        className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
        icon: CheckCircle
      },
      in_review: { 
        label: t.statuses.inReview, 
        className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
        icon: Clock
      },
      on_hold: { 
        label: t.statuses.onHold, 
        className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
        icon: Pause
      },
      needs_adjustment: { 
        label: t.statuses.needsAdjustment, 
        className: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
        icon: AlertTriangle
      },
      rejected: { 
        label: t.statuses.rejected, 
        className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
        icon: XCircle
      }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_review
    const Icon = config.icon
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      financial: {
        label: t.types.financial,
        className: "bg-green-100 text-green-700 border-green-200",
        icon: DollarSign
      },
      progress: {
        label: t.types.progress,
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: TrendingUp
      },
      annual: {
        label: t.types.annual,
        className: "bg-purple-100 text-purple-700 border-purple-200",
        icon: FileText
      }
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.progress
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const columns: ColumnDef<ReportTableData>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: t.table.reportTitle,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{row.original.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {row.original.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "project",
      accessorKey: "project_id",
      header: t.table.associatedProject,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            {getProjectName(row.original.project_id)}
          </span>
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
      id: "type",
      accessorKey: "report_type",
      header: t.table.reportType,
      cell: ({ row }) => getTypeBadge(row.original.report_type),
    },
    {
      id: "submission_date",
      accessorKey: "submission_date",
      header: t.table.submissionDate,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(row.original.submission_date).toLocaleDateString('en-US')}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "report_status",
      header: t.table.reportStatus,
      cell: ({ row }) => getStatusBadge(row.original.report_status),
    },
    {
      id: "progress",
      accessorKey: "progress_percentage",
      header: t.table.progress,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {row.original.progress_percentage.toFixed(1)}%
          </div>
          <Progress value={row.original.progress_percentage} className="w-16" />
        </div>
      ),
    },
    {
      id: "budget_spent",
      header: t.table.budgetSpent,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            ${row.original.total_project_budget_spent.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            of ${row.original.total_project_budget.toLocaleString()}
          </div>
        </div>
      ),
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView?.(row.original)}>
              <Eye className="w-4 h-4 mr-2" />
              {t.actions.viewDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.actions.editReport}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload?.(row.original)}>
              <Download className="w-4 h-4 mr-2" />
              {t.actions.downloadReport}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(row.original)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.actions.deleteReport}
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
      searchPlaceholder="Search reports..."
      filterableColumns={[
        {
          id: "department_id",
          title: t.table.department,
          options: mockDepartments.map(dept => ({
            label: dept.name,
            value: dept.id
          }))
        },
        {
          id: "report_type",
          title: t.table.reportType,
          options: [
            { label: t.types.financial, value: "financial" },
            { label: t.types.progress, value: "progress" },
            { label: t.types.annual, value: "annual" }
          ]
        },
        {
          id: "report_status",
          title: t.table.reportStatus,
          options: [
            { label: t.statuses.approved, value: "approved" },
            { label: t.statuses.inReview, value: "in_review" },
            { label: t.statuses.onHold, value: "on_hold" },
            { label: t.statuses.needsAdjustment, value: "needs_adjustment" },
            { label: t.statuses.rejected, value: "rejected" }
          ]
        }
      ]}
    />
  )
}
