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
import { ProjectFormData } from "@/types/Project"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useQuery } from "@apollo/client"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { useInstitution } from "@/contexts/institution-context"

/**
 * Filters projects to show only those where the user is registered in activities
 * @param projects - All projects from API
 * @param userId - Current user ID
 * @returns Filtered projects where user is assigned to at least one activity
 */
function filterUserProjects(projects: any[], userId: string | undefined): any[] {
  if (!userId || !projects || projects.length === 0) {
    return []
  }

  return projects.filter(project => {
    // Check if project has activities
    if (!project.activities || project.activities.length === 0) {
      return false
    }

    // Check if user is assigned to any activity in this project
    const isUserInProject = project.activities.some((activity: any) => {
      // Check if user is in assignees
      if (activity.assignees && activity.assignees.length > 0) {
        return activity.assignees.some((assignee: any) => 
          assignee.user?.id === userId
        )
      }
      return false
    })

    return isUserInProject
  })
}

// Prepare data structure for sidebar components
function useSidebarData() {
  const { user } = useAuth()
  const { navigation, sections } = useNavigation()
  const { currentInstitutionData } = useInstitution()

  // Fetch projects from API
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS_QUERY, {
    variables: {
      institutionId: currentInstitutionData?.id
    },
    skip: !currentInstitutionData?.id,
  })

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

  // Filter projects to show only where user is registered in activities
  const projects = React.useMemo(() => {
    const allProjects = projectsData?.projects || []
    return filterUserProjects(allProjects, user?.id)
  }, [projectsData, user?.id])

  // Memoize entire data structure
  return React.useMemo(() => ({
    user: userData,
    navMain: navigation,
    navSections: sections,
    projects,
    projectsLoading,
    onAddProject: handleAddProject,
  }), [userData, navigation, sections, projects, projectsLoading, handleAddProject])
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
        <NavMain sections={data.navSections} />
        <NavProjects projects={data.projects} loading={data.projectsLoading} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
})
