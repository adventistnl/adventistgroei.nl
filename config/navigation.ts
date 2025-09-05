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
const navMainBase: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Institutions & Structures",
    url: "#",
    icon: Building2,
    items: [
      { title: "Institutions", url: "/institutions" },
      { title: "Regions", url: "/regions" },
      { title: "Churches", url: "/churches" },
      { title: "Departments", url: "/departments" },
    ],
  },
  {
    title: "Users & Access",
    url: "#",
    icon: Users,
    items: [
      { title: "Members", url: "/members" },
      { title: "Volunteers", url: "/volunteers" },
      { title: "Access Management", url: "/access" },
    ],
  },
  {
    title: "Subsidies",
    url: "#",
    icon: DollarSign,
    items: [
      { title: "Subsidies Management", url: "/subsidies" },
      { title: "My Subsidy Requests", url: "/my-subsidies" },
      { title: "Activities", url: "/subsidies/activities" },
      { title: "Receipts", url: "/subsidies/receipts" },
    ],
  },
  {
    title: "Reports & Projects",
    url: "#",
    icon: File,
    items: [
      { title: "Reports", url: "/reports" },
      { title: "Annual Reports", url: "/annual-reports" },
      { title: "Mission Projects", url: "/mission-projects" },
    ],
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
    {
      title: "Communications",
      url: "/communications",
      icon: MessageSquare,
    },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // }
]

// Função estável para obter navegação com estado ativo
export function getNavMainWithActiveState(pathname: string): NavItem[] {
  // Usar memo interno para evitar recriação desnecessária
  return navMainBase.map(item => {
    const isDirectActive = item.url !== "#" && pathname === item.url
    const hasActiveChild = item.items?.some(subItem => pathname === subItem.url) || false
    const isItemActive = isDirectActive || hasActiveChild
    
    return {
      ...item,
      isActive: isItemActive,
      items: item.items?.map(subItem => ({
        ...subItem,
        isActive: pathname === subItem.url
      }))
    }
  })
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
    name: "Institutions & Structures",
    icon: Building,
    items: [
      { name: "Institutions", href: "/institutions", icon: Building },
      { name: "Regions", href: "/regions", icon: Map },
      { name: "Churches", href: "/churches", icon: Church },
      { name: "Departments", href: "/departments", icon: Briefcase },
    ],
  },
  {
    name: "Users & Access",
    icon: Users,
    items: [
      { name: "Members", href: "/members", icon: User },
      { name: "Volunteers", href: "/volunteers", icon: UserCheck },
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
