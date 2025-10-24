"use client"

import * as React from "react"
import { Plus, Building2, RefreshCw } from "lucide-react"
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
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { RegisterInstitutionModal } from "@/components/modals/institution"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

export const InstitutionSwitcher = React.memo(function InstitutionSwitcher() {
  const { institutions, currentInstitutionData, switchInstitution, addInstitution, refetchInstitutions, refetchInstitutionById } = useInstitution()
  const [isReloading, setIsReloading] = React.useState(false)
  // Handler para mudança de instituição com reload e redirect
  const handleInstitutionChange = React.useCallback(async (institutionId: string) => {
    if (institutionId === currentInstitutionData?.id) return

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
  }, [currentInstitutionData, switchInstitution, refetchInstitutions, refetchInstitutionById])

  // Handler para criação de nova instituição
  const handleInstitutionCreated = React.useCallback((data: any) => {
    // Add institution to context
    addInstitution({
      name: data.name,
      denomination: data.denomination,
      language_preference: data.language_preference,
      logo: Building2,
      description: data.description || `${data.denomination} Institution`,
      churches_count: 0,
      members_count: 0,
      active_users: 0,
    })
  }, [addInstitution])

  const fetchInstitutionData = React.useCallback(async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await Promise.all([
          refetchInstitutions?.(),
          refetchInstitutionById?.()
        ]);
        break; // Sai do loop se os dados forem carregados com sucesso
      } catch (error) {
        attempts++;
        if (attempts >= 3) {
          console.error("Falha ao carregar dados após 3 tentativas", error);
          toast.error("❌ Failed to load institution data after multiple attempts");
        }
      }
    }
  }, [refetchInstitutions, refetchInstitutionById]);

  React.useEffect(() => {
    if (!institutions && !currentInstitutionData) {
      fetchInstitutionData();
    }
  }, [institutions, currentInstitutionData, fetchInstitutionData]);
  
  if (!institutions || !currentInstitutionData) {
    return <div>Loading institutions...</div>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="institution-switcher flex items-center gap-2 p-2">
          {/* Institution Logo */}
          <div className="institution-logo bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shrink-0">
            {/* <currentInstitutionData.logo className="sidebar-icon-lg text-sidebar-primary-foreground" /> */}
          </div>

          {/* Institution Select */}
          <div className="institution-select flex-1 min-w-0">
            <Select 
              value={currentInstitutionData.id} 
              onValueChange={handleInstitutionChange}
              disabled={isReloading}
            >
              <SelectTrigger className="h-10 border-0 bg-transparent shadow-none p-0 focus:ring-0">
                <SelectValue>
                  <div className="text-left">
                    <div className="font-medium text-sm truncate">{currentInstitutionData.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {currentInstitutionData.churches_count} churches • {currentInstitutionData.users_count} users
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
                        {/* <institution.logo className="sidebar-icon text-sidebar-primary" /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{institution.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {institution.churches_count} churches • {institution.users_count} users
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
                <WithPermission requiredPermissions={[PermissionResolverName.CreateInstitution]}>
                  <div className="p-3">
                    <RegisterInstitutionModal onSuccess={handleInstitutionCreated}>
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
                    </RegisterInstitutionModal>
                  </div>
                </WithPermission>
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
