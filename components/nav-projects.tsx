"use client"

import * as React from "react"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Plus,
  Lock,
  type LucideIcon,
} from "lucide-react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"

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
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

interface NavProjectsProps {
  projects: any[]
  loading?: boolean
}

export const NavProjects = React.memo(function NavProjects({ projects, loading }: NavProjectsProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const maxProjects = 3
  const hasMoreProjects = projects.length > maxProjects
  const displayedProjects = projects.slice(0, maxProjects)

  const handleShareProject = React.useCallback((project: any) => {
    const projectUrl = `${window.location.origin}/projects/${project.id}`
    navigator.clipboard.writeText(projectUrl).then(() => {
      toast.success(t.sidebar.projectLinkCopied, {
        duration: 2000
      })
    }).catch(() => {
      toast.error(t.sidebar.errorCopyingLink)
    })
  }, [t])

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between px-2 py-1">
          <SidebarGroupLabel>{t.sidebar.projects}</SidebarGroupLabel>
          <WithPermission requiredPermissions={[PermissionResolverName.CreateProject]}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWithLoading('/projects/new-project', {
                message: t.sidebar.creatingNewProject,
                showToast: true
              })}
              className="h-6 w-6 p-0 hover:bg-sidebar-accent"
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">{t.sidebar.addProject}</span>
            </Button>
          </WithPermission>
     
        </div>
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <Folder className="text-sidebar-foreground/70 sidebar-icon animate-pulse" />
                <span>{t.sidebar.loadingProjects}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : projects.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <Folder className="text-sidebar-foreground/70 sidebar-icon" />
                <span>{t.sidebar.noProjectsYet}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            displayedProjects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  onClick={() => navigateWithLoading(`/projects/${project.id}`, {
                    message: t.sidebar.openingProject.replace('{{title}}', project.title),
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
                      <span className="sr-only">{t.sidebar.more}</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => navigateWithLoading(`/projects/${project.id}`, {
                      message: t.sidebar.openingProject.replace('{{title}}', project.title),
                      showToast: true
                    })}>
                      <Folder className="text-muted-foreground" />
                      <span>{t.sidebar.viewProject}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      handleShareProject(project)
                    }}>
                      <Forward className="text-muted-foreground" />
                      <span>{t.sidebar.shareProject}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
        {hasMoreProjects && (
          <div className="px-2 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWithLoading('/projects', {
                message: t.sidebar.loadingProjects,
                showToast: false
              })}
              className="w-full text-xs"
            >
              {t.sidebar.seeMore}
            </Button>
          </div>
        )}
      </SidebarGroup>
    </>
  )
})
