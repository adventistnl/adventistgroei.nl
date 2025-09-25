"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Building2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useInstitution } from "@/contexts/institution-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { InstitutionModal } from "@/components/modals/institution-modal"
import toast from "react-hot-toast"
import { useInstitutions } from "@/hooks/use-institutions"

export const InstitutionSwitcher = React.memo(function InstitutionSwitcher() {
  const { institutions, activeInstitution, switchInstitution, addInstitution, refetchInstitutions, refetchInstitutionById } = useInstitution()
  const [isReloading, setIsReloading] = React.useState(false)

  // Handler para mudança de instituição com reload e redirect
  const handleInstitutionChange = React.useCallback(async (institutionId: string) => {
    if (institutionId === activeInstitution.id) return

    setIsReloading(true)
    const loadingToast = toast.loading("🔄 Switching institution...")

    try {
      // Switch institution
      switchInstitution(institutionId)

      // Refetch dados necessários
      await Promise.all([
        refetchInstitutions?.(),
        refetchInstitutionById?.()
      ])

      // Simular loading time
      await new Promise(resolve => setTimeout(resolve, 800))

      toast.dismiss(loadingToast)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("❌ Failed to switch institution")
    } finally {
      setIsReloading(false)
    }
  }, [activeInstitution, switchInstitution, refetchInstitutions, refetchInstitutionById])

  // Handler para criação de nova instituição
  const handleInstitutionCreated = React.useCallback((data: any) => {
    // Add institution to context
    addInstitution({
      name: data.name,
      denomination: data.denomination,
      language_preference: data.language_preference,
      logo: Building2,
      description: data.description || `${data.denomination} Institution`,
      regions_count: 0,
      churches_count: 0,
      members_count: 0,
      active_users: 0,
    })
  }, [addInstitution])

  if (!activeInstitution) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="institution-switcher flex items-center gap-2 p-2">
          {/* Institution Logo */}
          <div className="institution-logo bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shrink-0">
            <activeInstitution.logo className="sidebar-icon-lg text-sidebar-primary-foreground" />
          </div>

          {/* Institution Select */}
          <div className="institution-select flex-1 min-w-0">
            <Select 
              value={activeInstitution.id} 
              onValueChange={handleInstitutionChange}
              disabled={isReloading}
            >
              <SelectTrigger className="h-10 border-0 bg-transparent shadow-none p-0 focus:ring-0">
                <SelectValue>
                  <div className="text-left">
                    <div className="font-medium text-sm truncate">{activeInstitution.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {activeInstitution.regions_count} regions • {activeInstitution.churches_count} churches
                    </div>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-80">
                {institutions.map((institution) => (
                  <SelectItem 
                    key={institution.id} 
                    value={institution.id}
                    className="p-3"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary/10">
                        <institution.logo className="sidebar-icon text-sidebar-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{institution.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {institution.regions_count} regions • {institution.churches_count} churches
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
                
                {/* Separator */}
                <div className="px-3 py-2">
                  <div className="h-px bg-border"></div>
                </div>
                
                {/* Create New Institution Option */}
                <div className="p-3">
                  <InstitutionModal onSuccess={handleInstitutionCreated}>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 group">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/30 transition-all duration-200">
                        <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                          Create New Institution
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Add a new institution to the system
                        </div>
                      </div>
                    </button>
                  </InstitutionModal>
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Loading Indicator */}
          {isReloading && (
            <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})
