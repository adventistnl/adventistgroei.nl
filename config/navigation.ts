import { PermissionResolverName } from "@/types/graphql-global-types"
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  UserCheck,
  MessageSquare,
  FileText,
  Settings,
  User,
  Building,
  Briefcase,
  Map,
  Church,
  Shield,
  Lock,
  File,
  Globe,
  Activity,
  Receipt,
  Building2,
} from "lucide-react"

// Interface for shadcn sidebar navigation items
export interface NavItem {
  title: string
  url: string
  icon?: any
  isActive?: boolean
  items?: NavItem[]
  permissions: PermissionResolverName[]
  translationKey?: string
}

// Interface for navigation sections
export interface NavSection {
  label: string
  translationKey?: string
  items: NavItem[]
}

// Interface for projects/quick access
export interface ProjectItem {
  name: string
  url: string
  icon: any
}

// Legacy interface (manter para compatibilidade)
export interface NavigationItem {
  name: string
  href?: string
  icon: any
  items?: NavigationItem[]
}

// Navegação principal para shadcn sidebar (base - sem isActive hardcoded)
const navSections: NavSection[] = [
  {
    label: "Platform",
    translationKey: "sidebar.platform",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: BarChart3,
        permissions: [],
        translationKey: "sidebar.dashboard"
      },
      {
        title: "Projects", 
        url: "/projects", 
        icon: File,
        permissions: [PermissionResolverName.Projects],
        translationKey: "sidebar.projects" 
      },
    ]
  },
  {
    label: "Structure",
    translationKey: "sidebar.structure",
    items: [
      {
        title: "Institutions",
        url: "/institutions",
        icon: Building,
        permissions: [PermissionResolverName.Institutions],
        translationKey: "sidebar.institutions"
      },
      {
        title: "Inst. Departments",
        url: "/institutional-departments",
        icon: Briefcase,
        permissions: [PermissionResolverName.Departments],
        translationKey: "sidebar.instDepartments"
      },
      {
        title: "Regions",
        url: "/regions",
        icon: Map,
        permissions: [PermissionResolverName.Regions],
        translationKey: "sidebar.regions"
      },
      {
        title: "Churches",
        url: "/churches",
        icon: Church,
        permissions: [PermissionResolverName.Churches],
        translationKey: "sidebar.churches"
      },
      {
        title: "C. Departments",
        url: "/church-departments",
        icon: Briefcase,
        permissions: [PermissionResolverName.Departments],
        translationKey: "sidebar.churchDepartments"
      },
    ]
  },
  {
    label: "Management",
    translationKey: "sidebar.management",
    items: [
      {
        title: "Finance Management",
        url: "#",
        icon: DollarSign,
        items: [
          { title: "Annual Budget", url: "/finance/annual-budget", permissions: [PermissionResolverName.Settings], translationKey: "sidebar.annualBudget" },
          { title: "Subsidy Approvals", url: "/finance/subsidy-approvals", permissions: [PermissionResolverName.Institutions], translationKey: "sidebar.subsidyApprovals" },
        ],
        permissions: [],
        translationKey: "sidebar.financeManagement"
      },
      {
        title: "Users & Access",
        url: "#",
        icon: Users,
        items: [
          { title: "Users", url: "/users", permissions: [PermissionResolverName.Users], translationKey: "sidebar.users" },
          { title: "Access Management", url: "/access", permissions: [PermissionResolverName.Roles], translationKey: "sidebar.accessManagement" },
        ],
        permissions:[],
        translationKey: "sidebar.usersAccess"
      },
    ]
  }
]

/**
 * Coleta todas as permissões de um item e seus subitems recursivamente
 * @param item - Item de navegação
 * @returns Array com todas as permissões encontradas
 */
function collectItemPermissions(item: NavItem): PermissionResolverName[] {
  const permissions: PermissionResolverName[] = [...item.permissions]
  
  if (item.items && item.items.length > 0) {
    item.items.forEach(subItem => {
      permissions.push(...collectItemPermissions(subItem))
    })
  }
  
  return permissions
}

/**
 * Verifica se o usuário possui pelo menos uma das permissões necessárias
 * Para items sem URL (url: "#"), verifica as permissões dos subitems
 * @param item - Item de navegação
 * @param userPermissions - Array com as permissões do usuário
 * @returns true se o usuário tiver pelo menos uma permissão necessária
 */
export function shouldShowNavItem(item: NavItem, userPermissions: PermissionResolverName[]): boolean {
  // Se o item não tem subitems, verifica suas próprias permissões
  if (!item.items || item.items.length === 0) {
    // Se não tem permissões requeridas, mostra sempre
    if (item.permissions.length === 0) return true
    // Verifica se tem pelo menos uma permissão
    return item.permissions.some(permission => userPermissions.includes(permission))
  }
  
  // Para items com subitems (url: "#"), coleta todas as permissões dos filhos
  const allChildPermissions = collectItemPermissions(item)
  
  // Se não tem permissões requeridas nos filhos, mostra sempre
  if (allChildPermissions.length === 0) return true
  
  // Verifica se o usuário tem pelo menos uma das permissões dos filhos
  return allChildPermissions.some(permission => userPermissions.includes(permission))
}

// Manter compatibilidade - flatten all sections into single array
const navMainBase: NavItem[] = navSections.flatMap(section => section.items)

// Export sections for new sidebar
export const navigationSections = navSections

// Legacy navMainBase array for backwards compatibility
const _legacyNavMainBase: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    permissions: [],
    translationKey: "sidebar.dashboard"
  },
  {
    title: "Structure & Organization",
    url: "#",
    icon: Building2,
    items: [
      { title: "Institutions", url: "/institutions", permissions: [PermissionResolverName.Institutions], translationKey: "sidebar.institutions" },
      { title: "Inst. Departments", url: "/institutional-departments", permissions: [PermissionResolverName.Departments], translationKey: "sidebar.instDepartments" },
      { title: "Regions", url: "/regions", permissions: [PermissionResolverName.Regions], translationKey: "sidebar.regions" },
      // { title: "Regions Example", url: "/regions-example", permissions: [PermissionResolverName.Regions] },
      { title: "Churches", url: "/churches", permissions: [PermissionResolverName.Churches], translationKey: "sidebar.churches" },
      { title: "C. Departments", url: "/church-departments", permissions: [PermissionResolverName.Departments], translationKey: "sidebar.churchDepartments" },
    ],
    permissions:[],
    translationKey: "sidebar.structureOrganization"
  },
    {
    title: "Finance Management",
    url: "#",
    icon: DollarSign,
    items: [
      { title: "Annual Budget", url: "/finance/annual-budget", permissions: [PermissionResolverName.Settings], translationKey: "sidebar.annualBudget" },
      // { title: "Funding Rules", url: "/finance/funding-rules", permissions: [PermissionResolverName.Institutions] },
      { title: "Subsidy Approvals", url: "/finance/subsidy-approvals", permissions: [PermissionResolverName.Institutions], translationKey: "sidebar.subsidyApprovals" },
    ],
    permissions: [],
    translationKey: "sidebar.financeManagement"
  },
  {
    title: "Users & Access",
    url: "#",
    icon: Users,
    items: [
      { title: "Users", url: "/users", permissions: [PermissionResolverName.Users], translationKey: "sidebar.users" },
      { title: "Access Management", url: "/access", permissions: [PermissionResolverName.Roles], translationKey: "sidebar.accessManagement" },
    ],
    permissions:[],
    translationKey: "sidebar.usersAccess"
  },
  // {
  //   title: "Subsidies",
  //   url: "#",
  //   icon: DollarSign,
  //   items: [
  //     { title: "Subsidies Management", url: "/subsidies" },
  //     { title: "My Subsidy Requests", url: "/my-subsidies" },
  //     { title: "Activities", url: "/subsidies/activities" },
  //     { title: "Receipts", url: "/subsidies/receipts" },
  //   ],
  // },

  // {
  //   title: "Reports & Projects",
  //   url: "#",
  //   icon: File,
  //   items: [
  //     { title: "Projects", url: "/projects", permissions: [PermissionResolverName.Projects] },
  //     { title: "Reports", url: "/reports", permissions: [] },
  //   ],
  //    permissions: []
  // },
  { title: "Projects", 
    url: "/projects", 
    permissions: [PermissionResolverName.Projects],
    translationKey: "sidebar.projects" 
  },

  // {
  //   title: "Events",
  //   url: "/events",
  //   icon: Calendar,
  //   permissions: []
  // },
  //   {
  //     title: "Communications",
  //     url: "/communications",
  //     icon: MessageSquare,
  //     permissions: [PermissionResolverName.Communications]
  //   },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    //   permissions: [PermissionResolverName.Settings]
    // }
]

// Função estável para obter navegação com estado ativo
export function getNavMainWithActiveState(
  pathname: string,
  userPermissions: PermissionResolverName[] = []
): NavItem[] {
  // Usar memo interno para evitar recriação desnecessária
  return navMainBase
    .filter(item => shouldShowNavItem(item, userPermissions))
    .map(item => {
      // Verifica se é uma rota direta ou se o pathname começa com o URL do item
      // Isso permite que /projects/123 ative o item /projects
      const isDirectActive = item.url !== "#" && (
        pathname === item.url || 
        (item.url !== "/" && pathname.startsWith(item.url + "/"))
      )
      
      // Verifica se algum subitem está ativo
      const hasActiveChild = item.items?.some(subItem => 
        pathname === subItem.url || 
        (subItem.url !== "/" && pathname.startsWith(subItem.url + "/"))
      ) || false
      
      const isItemActive = isDirectActive || hasActiveChild
      
      // Filtrar subitems baseado em permissões
      const filteredSubItems = item.items?.filter(subItem => 
        shouldShowNavItem(subItem, userPermissions)
      )
      
      return {
        ...item,
        isActive: isItemActive,
        items: filteredSubItems?.map(subItem => ({
          ...subItem,
          isActive: pathname === subItem.url || 
            (subItem.url !== "/" && pathname.startsWith(subItem.url + "/"))
        }))
      }
    })
}

// Função para obter seções com estado ativo
export function getNavSectionsWithActiveState(
  pathname: string,
  userPermissions: PermissionResolverName[] = []
): NavSection[] {
  return navSections
    .map(section => {
      // Filtrar items da seção baseado em permissões
      const filteredItems = section.items
        .filter(item => shouldShowNavItem(item, userPermissions))
        .map(item => {
          const isDirectActive = item.url !== "#" && (
            pathname === item.url || 
            (item.url !== "/" && pathname.startsWith(item.url + "/"))
          )
          
          const hasActiveChild = item.items?.some(subItem => 
            pathname === subItem.url || 
            (subItem.url !== "/" && pathname.startsWith(subItem.url + "/"))
          ) || false
          
          const isItemActive = isDirectActive || hasActiveChild
          
          // Filtrar subitems baseado em permissões
          const filteredSubItems = item.items?.filter(subItem => 
            shouldShowNavItem(subItem, userPermissions)
          )
          
          return {
            ...item,
            isActive: isItemActive,
            items: filteredSubItems?.map(subItem => ({
              ...subItem,
              isActive: pathname === subItem.url || 
                (subItem.url !== "/" && pathname.startsWith(subItem.url + "/"))
            }))
          }
        })
      
      return {
        ...section,
        items: filteredItems
      }
    })
    // Remover seções que ficaram vazias após filtrar items
    .filter(section => section.items.length > 0)
}

// Export da navegação (usar getNavMainWithActiveState para estado dinâmico)
export const navMain = navMainBase

// Projetos/Links rápidos
export const projects: ProjectItem[] = [
]

// Dados do usuário e organização
export const appData = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/placeholder-user.jpg",
  },
}

// Legacy exports (manter para compatibilidade)
export const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  {
    name: "Structure & Organization",
    icon: Building,
    items: [
      { name: "Institutions", href: "/institutions", icon: Building },
      { name: "Inst. Departments", href: "/institutional-departments", icon: Briefcase },
      // { name: "Regions Example", href: "/regions-example", icon: Map },
      { name: "Regions", href: "/regions", icon: Map },
      { name: "Churches", href: "/churches", icon: Church },
      { name: "Church Departments", href: "/church-departments", icon: Briefcase },
    ],
  },
  {
    name: "Users & Access",
    icon: Users,
    items: [
      { name: "Users", href: "/users", icon: User },
      { name: "Access Management", href: "/access", icon: Shield },
    ],
  },
  {
    name: "Subsidies",
    icon: DollarSign,
    items: [
      { name: "Subsidies Management", href: "/subsidies", icon: DollarSign },
      { name: "My Subsidy Requests", href: "/my-subsidies", icon: User },
      { name: "Activities", href: "/subsidies/activities", icon: Activity },
      { name: "Receipts", href: "/subsidies/receipts", icon: Receipt },
    ],
  },
  {
    name: "Reports & Projects",
    icon: File,
    items: [
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Annual Reports", href: "/annual-reports", icon: File },
      { name: "Mission Projects", href: "/mission-projects", icon: Globe },
    ],
  },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Communications", href: "/communications", icon: MessageSquare },
  // { name: "Settings", href: "/settings", icon: Settings }
]

// Profile & Settings (separado para bottom da navegação)
// export const profileItems: NavigationItem[] = [
//   { name: "My Profile", href: "/profile", icon: User },
//   { name: "Settings", href: "/settings", icon: Settings },
// ]

// Helper function to check if a path is active
export const isPathActive = (pathname: string, href: string): boolean => {
  if (pathname === href) return true
  
  // Check if it's a subsidies route
  if (href.startsWith("/subsidies") && pathname.startsWith("/subsidies")) {
    return true
  }
  
  // Check if it's a my-subsidies route
  if (href.startsWith("/my-subsidies") && pathname.startsWith("/my-subsidies")) {
    return true
  }
  
  return false
}

// Helper function to check if any child item is active
export const isItemActive = (item: NavigationItem, pathname: string): boolean => {
  if (item.href) {
    return isPathActive(pathname, item.href)
  }
  if (item.items) {
    return item.items.some(child => child.href && isPathActive(pathname, child.href))
  }
  return false
}

// Helper function to get sections that should be auto-opened
export const getAutoOpenSections = (pathname: string): string[] => {
  const sectionsToOpen: string[] = []
  
  navigation.forEach(item => {
    if (item.items && isItemActive(item, pathname)) {
      sectionsToOpen.push(item.name)
    }
  })
  
  return sectionsToOpen
}
