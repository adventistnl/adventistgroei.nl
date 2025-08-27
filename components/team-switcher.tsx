"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface TeamSwitcherProps {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}

export const TeamSwitcher = React.memo(function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  
  // Memoizar o primeiro time para evitar re-renders desnecessários
  const activeTeam = React.useMemo(() => teams[0], [teams])
  const [selectedTeam, setSelectedTeam] = React.useState(activeTeam)

  // Memoizar props do DropdownMenuContent
  const dropdownProps = React.useMemo(() => ({
    className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
    align: "start" as const,
    side: isMobile ? "bottom" as const : "right" as const,
    sideOffset: 4,
  }), [isMobile])

  // Memoizar handler para evitar re-renders
  const handleTeamChange = React.useCallback((team: typeof teams[0]) => {
    setSelectedTeam(team)
  }, [])

  if (!selectedTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <selectedTeam.logo className="sidebar-icon-lg text-sidebar-primary-foreground" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{selectedTeam.name}</span>
                <span className="truncate text-xs">{selectedTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto sidebar-icon" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent {...dropdownProps}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="sidebar-icon shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="sidebar-icon" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})
