"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Activity,
  Calendar,
  Edit,
  Eye,
  Folder,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react"
import { ProjectTableData } from "@/components/projects/projects-table"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export const createProjectColumns = (
  departments: any[],
  t_project: any,
  handlers: {
    handleViewProject: (project: ProjectTableData) => void
    handleEditProject: (project: ProjectTableData) => void
    handleDeleteProject: (project: ProjectTableData) => void
  }
): ColumnDef<ProjectTableData>[] => {
  const { handleViewProject, handleEditProject, handleDeleteProject } = handlers

  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div className="flex items-start">Name</div>
      ),
      cell: ({ row }) => {
        const project = row.original
        const dept = departments.find(d => d.id === project.department_id)
        
        return (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Folder className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-left">{project.title}</span>
              {dept && (
                <span className="text-xs text-muted-foreground text-left">
                  {dept.name}
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const statusText = status === "active" ? t_project.active :
                          status === "completed" ? t_project.completed :
                          t_project.upcoming
        
        const variants = {
          active: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
          completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
          upcoming: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
        }
        
        return (
          <Badge variant="outline" className={variants[status]}>
            {statusText}
          </Badge>
        )
      },
    },
    {
      accessorKey: "registered_users",
      header: "Registered Users",
      cell: ({ row }) => {
        const project = row.original
        const activitiesData = (project as any).activitiesData || []
        
        // Collect all users from activity owners
        const allUsers: Array<{ id: string; name: string; email: string }> = []
        
        activitiesData.forEach((activity: any) => {
          // Add activity owner (only field currently available in schema)
          if (activity.owner) {
            allUsers.push({
              id: activity.owner.id,
              name: activity.owner.name,
              email: activity.owner.email,
            })
          }
        })
        
        // Remove duplicates by id (same user can own multiple activities)
        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user.id, user])).values()
        )
        
        const projectUsers: UserAvatarData[] = uniqueUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'Colaborador',
        }))
        
        return (
          <UsersAvatarGroup 
            users={projectUsers}
            maxDisplay={3}
            size="sm"
            showAddButton={false}
          />
        )
      },
    },
    {
      accessorKey: "activities",
      header: "Activities",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.activities || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "timeline",
      header: "Timeline",
      cell: ({ row }) => {
        const project = row.original
        const startDate = new Date(project.start_at)
        const endDate = new Date(project.end_at)
        
        return (
          <div className="flex items-center gap-1.5 text-xs min-w-[130px]">
            <span className="text-muted-foreground">{format(startDate, "dd/MM/yy")}</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">{format(endDate, "dd/MM/yy")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "days_left",
      header: "Days Left",
      cell: ({ row }) => {
        const project = row.original
        const now = new Date()
        const endDate = new Date(project.end_at)
        const daysLeft = differenceInDays(endDate, now)
        
        // Determine dot and text color
        let dotColor = ""
        let textColor = ""
        
        if (daysLeft < 0) {
          dotColor = "bg-red-500"
          textColor = "text-red-700 dark:text-red-400"
        } else if (daysLeft <= 7) {
          dotColor = "bg-orange-500"
          textColor = "text-orange-700 dark:text-orange-400"
        } else if (daysLeft <= 30) {
          dotColor = "bg-yellow-500"
          textColor = "text-yellow-700 dark:text-yellow-400"
        } else {
          dotColor = "bg-green-500"
          textColor = "text-green-700 dark:text-green-400"
        }
        
        return (
          <Badge variant="outline" className="bg-background border-border font-medium text-xs px-2 py-1 gap-1.5">
            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
            <span className={textColor}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days` : `${daysLeft} days`}
            </span>
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const project = row.original
        
        return (
          <div data-action-button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProject(project)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t_project.viewProject}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditProject(project)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t_project.editProject}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProject(project)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t_project.deleteProject}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
