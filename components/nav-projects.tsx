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
}

export const NavProjects = React.memo(function NavProjects({ projects }: NavProjectsProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { navigateWithLoading } = useNavigateWithLoading()

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between px-2 py-1">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWithLoading('/projects/new-project', {
              message: "🚀 Creating new project...",
              showToast: true,
              delay: 700
            })}
            className="h-6 w-6 p-0 hover:bg-sidebar-accent"
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Add Project</span>
          </Button>
        </div>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton 
                onClick={() => navigateWithLoading(`/projects/${project.id}`, {
                  message: `📋 Opening ${project.title}...`,
                  showToast: true,
                  delay: 800
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
                    message: `📋 Opening ${project.title}...`,
                    showToast: true,
                    delay: 800
                  })}>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          {projects.length === 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <Folder className="text-sidebar-foreground/70 sidebar-icon" />
                <span>No projects yet</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
})
