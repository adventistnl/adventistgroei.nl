"use client"

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNavigateWithLoading } from "@/hooks/use-navigation-loading"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export const NavUser = React.memo(function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const router = useRouter()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { i18n } = useTranslation()
  const t = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en

  // Memoizar props do DropdownMenuContent para evitar re-renders
  const dropdownProps = React.useMemo(() => ({
    className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
    side: isMobile ? "bottom" as const : "right" as const,
    align: "end" as const,
    sideOffset: 4,
  }), [isMobile])

  // Memoizar handlers para estabilidade
  const handleLogout = React.useCallback(async () => {
    // Show loading before logout action
    navigateWithLoading('/login', {
      message: t.navigationMessages.signingOut,
      showToast: true
    })
    
    // Execute logout logic
    setTimeout(() => {
      logout()
    }, 300)
    
  }, [logout, navigateWithLoading])

  const handleProfileClick = React.useCallback(() => {
    navigateWithLoading("/profile", {
      message: t.navigationMessages.openingProfile
    })
  }, [navigateWithLoading])

  const handleNotificationsClick = React.useCallback(() => {
    navigateWithLoading("/settings?tab=notifications", {
      message: t.navigationMessages.openingNotifications
    })
  }, [navigateWithLoading])

  const handleSettingsClick = React.useCallback(() => {
    navigateWithLoading("/settings", {
      message: t.navigationMessages.openingSettings
    })
  }, [navigateWithLoading])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto sidebar-icon" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent {...dropdownProps}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <BadgeCheck className="sidebar-icon" />
                Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={handleNotificationsClick}>
                <Bell className="sidebar-icon" />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="sidebar-icon" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})
