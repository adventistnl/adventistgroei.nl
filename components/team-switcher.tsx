"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Building2, Users, MapPin, Church } from "lucide-react"
import { useInstitution } from "@/contexts/institution-context"
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
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

export const InstitutionSwitcher = React.memo(function InstitutionSwitcher() {
  const { isMobile } = useSidebar()
  const { institutions, currentInstitutionData, switchInstitution } = useInstitution()

  // Memoizar props do DropdownMenuContent
  const dropdownProps = React.useMemo(() => ({
    className: "w-80 rounded-lg",
    align: "start" as const,
    side: isMobile ? "bottom" as const : "right" as const,
    sideOffset: 4,
  }), [isMobile])

  // Handler para mudança de instituição
  const handleInstitutionChange = React.useCallback((institutionId: string) => {
    switchInstitution(institutionId)
  }, [switchInstitution])

  if (!currentInstitutionData) {
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
                {/* <logo className="sidebar-icon-lg text-sidebar-primary-foreground" /> */}

              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentInstitutionData.name}</span>
                <span className="truncate text-xs">{currentInstitutionData.description}</span>
              </div>
              <ChevronsUpDown className="ml-auto sidebar-icon" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent {...dropdownProps}>
            <DropdownMenuLabel className="text-muted-foreground text-xs px-3 py-2">
              Church Growth International - Institutions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {institutions.map((institution, index) => (
              <DropdownMenuItem
                key={institution.id}
                onClick={() => handleInstitutionChange(institution.id)}
                className="gap-3 p-3 cursor-pointer"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary/10">
                  {/* <institution.logo className="sidebar-icon text-sidebar-primary" /> */}
                </div>
                <div className="flex-1 grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{institution.name}</span>
                    {institution.id === currentInstitutionData.id && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {institution.regions_count} regions • {institution.churches_count} churches • {institution.users_count} users
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {institution.users_count} users
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {institution.regions_count} regions
                    </div>
                    <div className="flex items-center gap-1">
                      <Church className="w-3 h-3" />
                      {institution.churches_count} churches
                    </div>
                  </div>
                </div>
                <DropdownMenuShortcut className="text-xs">⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 p-3 text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg border border-dashed">
                <Plus className="sidebar-icon" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Add Institution</div>
                <div className="text-xs">Create new institution</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})
