"use client"

import * as React from "react"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Plus,
  Lock,
  type LucideIcon,
} from "lucide-react"
import toast from "react-hot-toast"
import { DeleteProjectModal } from "@/components/modals/project/delete-project-modal"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useNavigateWithLoading } from "@/hooks/use-navigation-loading"

interface NavProjectsProps {
  projects: any[]
  loading?: boolean
}

export const NavProjects = React.memo(function NavProjects({ projects, loading }: NavProjectsProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { navigateWithLoading } = useNavigateWithLoading()
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<any>(null)

  const handleDeleteProject = React.useCallback((project: any) => {
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }, [])

  const handleShareProject = React.useCallback((project: any) => {
    const projectUrl = `${window.location.origin}/projects/${project.id}`
    navigator.clipboard.writeText(projectUrl).then(() => {
      toast.success(`Link do projeto copiado!`, {
        duration: 2000
      })
    }).catch(() => {
      toast.error('Erro ao copiar link')
    })
  }, [])

  const handleDeleteSuccess = React.useCallback(() => {
    setIsDeleteModalOpen(false)
    setSelectedProject(null)
    toast.success('Projeto deletado com sucesso!', {
      duration: 3000
    })
  }, [])

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between px-2 py-1">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWithLoading('/projects/new-project', {
              message: "Creating new project...",
              showToast: true
            })}
            className="h-6 w-6 p-0 hover:bg-sidebar-accent"
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Add Project</span>
          </Button>
        </div>
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <Folder className="text-sidebar-foreground/70 sidebar-icon animate-pulse" />
                <span>Loading projects...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : projects.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <Folder className="text-sidebar-foreground/70 sidebar-icon" />
                <span>No projects yet</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  onClick={() => navigateWithLoading(`/projects/${project.id}`, {
                    message: `Opening ${project.title}...`,
                    showToast: true
                  })}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Folder className="sidebar-icon text-blue-500 flex-shrink-0" />
                    <span className="truncate flex-1 min-w-0">{project.title}</span>
                    {project.is_private && (
                      <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal className="sidebar-icon" />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => navigateWithLoading(`/projects/${project.id}`, {
                      message: `Opening ${project.title}...`,
                      showToast: true
                    })}>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleShareProject(project)
                    }}>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteProject(project)
                    }}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroup>

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedProject(null)
        }}
        onConfirm={handleDeleteSuccess}
        project={selectedProject ? {
          id: selectedProject.id,
          title: selectedProject.title,
          description: selectedProject.description || '',
          budget: selectedProject.budget || 0,
          activities: selectedProject.activities?.length || 0,
          subsidyRequests: selectedProject.subsidies?.length || 0,
          volunteers: 0,
          documents: 0
        } : null}
      />
    </>
  )
})
