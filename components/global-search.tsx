"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Folder, Lock } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { searchTranslations } from "@/lib/translations/search"
import { structureTranslations } from "@/lib/translations/structure"
import toast from "react-hot-toast"
import { useQuery } from "@apollo/client"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { useAuth } from "@/contexts/auth-context"
import { useInstitution } from "@/contexts/institution-context"
import { shouldShowNavItem, navigationSections, NavItem } from "@/config/navigation"
import { PermissionResolverName } from "@/types/graphql-global-types"


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

/**
 * Resolve the translated title for a nav item using its translationKey.
 * Falls back to item.title if no key is found.
 */
function resolveNavItemTitle(item: NavItem, sidebarT: any): string {
  if (item.translationKey?.startsWith('sidebar.')) {
    const key = item.translationKey.split('.')[1] as keyof typeof sidebarT.sidebar
    return sidebarT.sidebar[key] || item.title
  }
  return item.title
}

/**
 * Resolve the translated section label using its translationKey.
 */
function resolveSectionLabel(translationKey: string | undefined, label: string, sidebarT: any): string {
  if (translationKey?.startsWith('sidebar.')) {
    const key = translationKey.split('.')[1] as keyof typeof sidebarT.sidebar
    return sidebarT.sidebar[key] || label
  }
  return label
}

/**
 * Resolve search description for a nav item.
 * Maps translationKey to searchTranslations.descriptions.
 */
function resolveNavItemDescription(item: NavItem, searchT: any): string | undefined {
  if (!item.translationKey) return undefined
  const key = item.translationKey.split('.')[1] as keyof typeof searchT.descriptions
  return searchT.descriptions[key]
}

// Shared state for modal - only one instance should be open
let globalSearchOpen = false

// Search Trigger Button Component (Desktop)
export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const { i18n } = useTranslation()
  const t = searchTranslations[i18n.language as keyof typeof searchTranslations] || searchTranslations.en
  
  // Detect if user is on Mac or Windows/Linux
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K'
  
  // Listen for global search open event
  React.useEffect(() => {
    const handleOpenSearch = () => {
      if (!globalSearchOpen) {
        globalSearchOpen = true
        setIsOpen(true)
      }
    }
    window.addEventListener('open-global-search', handleOpenSearch)
    return () => window.removeEventListener('open-global-search', handleOpenSearch)
  }, [])
  
  // Update global state when modal closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      globalSearchOpen = false
    }
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        className="h-9 gap-2 px-3"
        onClick={() => {
          if (!globalSearchOpen) {
            globalSearchOpen = true
            setIsOpen(true)
          }
        }}
        data-search-trigger
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground">
          {shortcutKey}
        </span>
      </Button>
      
      <GlobalSearch isMobile={false} isOpen={isOpen} onOpenChange={handleOpenChange} />
    </>
  )
}

// Mobile Search Trigger Component
export function MobileSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Listen for global search open event
  React.useEffect(() => {
    const handleOpenSearch = () => {
      if (!globalSearchOpen) {
        globalSearchOpen = true
        setIsOpen(true)
      }
    }
    window.addEventListener('open-global-search', handleOpenSearch)
    return () => window.removeEventListener('open-global-search', handleOpenSearch)
  }, [])
  
  // Update global state when modal closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      globalSearchOpen = false
    }
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-9 w-9"
        onClick={() => {
          if (!globalSearchOpen) {
            globalSearchOpen = true
            setIsOpen(true)
          }
        }}
        data-search-trigger
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <GlobalSearch isMobile={true} isOpen={isOpen} onOpenChange={handleOpenChange} />
    </>
  )
}

export function GlobalSearch({ isMobile = false, isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }: { 
  isMobile?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void 
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const router = useRouter()
  const { i18n } = useTranslation()
  const { user, permissions } = useAuth()
  const { currentInstitutionData } = useInstitution()
  
  // Get translations
  const t = searchTranslations[i18n.language as keyof typeof searchTranslations] || searchTranslations.en
  const sidebarT = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en
  
  // Convert permissions to PermissionResolverName array
  const userPermissions = permissions as unknown as PermissionResolverName[]
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnOpenChange || setInternalIsOpen
  
  // Fetch projects from API
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS_QUERY, {
    variables: {
      institutionId: currentInstitutionData?.id
    },
    skip: !currentInstitutionData?.id || !isOpen,
  })

  // Filter projects to show only where user is registered in activities
  const userProjects = React.useMemo(() => {
    const allProjects = projectsData?.projects || []
    return filterUserProjects(allProjects, user?.id)
  }, [projectsData, user?.id])

  // Get navigation structure directly from navigationSections (single source of truth with sidebar)
  // This ensures all pages in the sidebar are also searchable
  const navStructure = React.useMemo(() => {
    return navigationSections
      .map(section => ({
        ...section,
        items: section.items
          .filter(item => shouldShowNavItem(item as NavItem, userPermissions))
          .map(item => ({
            ...item,
            items: item.items
              ? item.items.filter(sub => shouldShowNavItem(sub as NavItem, userPermissions))
              : undefined
          }))
          .filter(item => !item.items || item.items.length > 0)
      }))
      .filter(section => section.items.length > 0)
  }, [userPermissions])

  const handleNavigation = (href: string, name: string) => {
    setIsOpen(false)
    toast.success(`${name}`, { duration: 2000 })
    router.push(href)
  }

  // Always use Dialog/Modal (both mobile and desktop)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <Command className="rounded-lg border-0 shadow-none">
          <CommandInput placeholder={t.placeholder} className="h-12 text-base" />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>{t.noResults}</CommandEmpty>
            
            {/* Navigation Sections — derived directly from sidebar config */}
            {navStructure.map((section, sectionIndex) => (
              <React.Fragment key={section.label}>
                {sectionIndex > 0 && <CommandSeparator />}
                <CommandGroup heading={resolveSectionLabel(section.translationKey, section.label, sidebarT)}>
                  {section.items.map((item) => {
                    // Items WITH sub-items (e.g. Finance Management): flatten and render each sub-item
                    if (item.items && item.items.length > 0) {
                      return (
                        <React.Fragment key={`group-${item.url}`}>
                          {item.items.map((subItem) => {
                            const Icon = subItem.icon || item.icon
                            const title = resolveNavItemTitle(subItem, sidebarT)
                            const description = resolveNavItemDescription(subItem, t)
                            return (
                              <CommandItem
                                key={subItem.url}
                                onSelect={() => handleNavigation(subItem.url, title)}
                                className="flex items-center gap-3 px-3 py-2"
                              >
                                {Icon && <Icon className="w-4 h-4" />}
                                <div className="flex-1">
                                  <span className="font-medium">{title}</span>
                                  {description && <p className="text-xs text-muted-foreground">{description}</p>}
                                </div>
                              </CommandItem>
                            )
                          })}
                        </React.Fragment>
                      )
                    }

                    // Leaf items (no sub-items)
                    const Icon = item.icon
                    const title = resolveNavItemTitle(item, sidebarT)
                    const description = resolveNavItemDescription(item, t)
                    const shortcutKey = item.translationKey === 'sidebar.dashboard'
                      ? t.shortcuts.dashboard
                      : item.translationKey === 'sidebar.projects'
                      ? t.shortcuts.projects
                      : undefined

                    return (
                      <CommandItem
                        key={item.url}
                        onSelect={() => handleNavigation(item.url, title)}
                        className="flex items-center gap-3 px-3 py-2"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <div className="flex-1">
                          <span className="font-medium">{title}</span>
                          {description && <p className="text-xs text-muted-foreground">{description}</p>}
                        </div>
                        {shortcutKey && <CommandShortcut>{shortcutKey}</CommandShortcut>}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}

            {/* User Projects Section */}
            {userProjects.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={t.pages.projects || "My Projects"}>
                  {projectsLoading ? (
                    <CommandItem disabled className="flex items-center gap-3 px-3 py-2">
                      <Folder className="w-4 h-4 animate-pulse text-blue-500" />
                      <span className="text-muted-foreground">Loading projects...</span>
                    </CommandItem>
                  ) : (
                    userProjects.map((project: any) => (
                      <CommandItem
                        key={project.id}
                        onSelect={() => handleNavigation(`/projects/${project.id}`, project.title)}
                        className="flex items-center gap-3 px-3 py-2"
                      >
                        <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{project.title}</span>
                            {project.is_private && (
                              <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          {project.description && (
                            <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                          )}
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// Hook para comando de teclado global (Cmd+K ou Ctrl+K)
export function useGlobalSearch() {
  React.useEffect(() => {
    let isDispatching = false
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) ou Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        
        // Prevent multiple dispatches
        if (isDispatching) return
        isDispatching = true
        
        // Dispatch custom event to open search modal
        const event = new CustomEvent('open-global-search')
        window.dispatchEvent(event)
        
        // Reset flag after a short delay
        setTimeout(() => {
          isDispatching = false
        }, 100)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
