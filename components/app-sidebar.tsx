"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { InstitutionSwitcher } from "@/components/institution-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { appData } from "@/config/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/hooks/use-navigation"
import { mockProjects } from "@/data/projectsData"
import { ProjectFormData } from "@/types/Project"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

// Prepare data structure for sidebar components
function useSidebarData() {
  const { user } = useAuth()
  const { navigation } = useNavigation()
  
  // Memoize user data to prevent unnecessary re-renders
  const userData = React.useMemo(() => ({
    name: user?.name || appData.user.name,
    email: user?.email || appData.user.email,
    avatar: appData.user.avatar,
  }), [user?.name, user?.email])
  
  // Handle project creation
  const handleAddProject = React.useCallback((data: ProjectFormData) => {
    // TODO: Implement actual project creation logic
  }, [])
  
  // Memoize entire data structure
  return React.useMemo(() => ({
    user: userData,
    navMain: navigation,
    projects: mockProjects,
    onAddProject: handleAddProject,
  }), [userData, navigation, handleAddProject])
}

export const AppSidebar = React.memo(function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useSidebarData()
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WithPermission requiredPermissions={[PermissionResolverName.Institutions]}>
          <InstitutionSwitcher />
        </WithPermission>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} onAddProject={data.onAddProject} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
})
