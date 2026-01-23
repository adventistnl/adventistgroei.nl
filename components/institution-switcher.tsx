"use client"

import * as React from "react"
import { Plus, Building2, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useInstitution } from "@/contexts/institution-context"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
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
import { useHasPermission } from "@/hooks/use-has-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AdventistLogo } from "./ui/adventist-logo"

// Helper: truncates text and adds ellipsis if longer than limit
function truncateText(text: string | undefined, limit = 32) {
  if (!text) return ""
  if (text.length <= limit) return text
  return text.slice(0, limit - 1).trimEnd() + "..."
}

export const InstitutionSwitcher = React.memo(function InstitutionSwitcher() {
  const { institutions, currentInstitutionData, switchInstitution, addInstitution, refetchInstitutions, refetchInstitutionById } = useInstitution()
  const { t } = useTranslation()
  const [isReloading, setIsReloading] = React.useState(false)
  // Verifica se o usuário tem permissão para ver/alterar instituições
  const canSwitchInstitution = useHasPermission([PermissionResolverName.Institutions], [], true)
  // Handler para mudança de instituição com reload e redirect
  const handleInstitutionChange = React.useCallback(async (institutionId: string) => {
    if (institutionId === currentInstitutionData?.id) return

    setIsReloading(true)
    const loadingToast = toast.loading(t('institution_switcher.switching', { defaultValue: 'Switching institution...' }))

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
      toast.error(t('institution_switcher.switch_failed', { defaultValue: '❌ Failed to switch institution' }))
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
          toast.error(t('institution_switcher.load_failed', { defaultValue: '❌ Failed to load institution data after multiple attempts' }));
        }
      }
    }
  }, [refetchInstitutions, refetchInstitutionById]);

  React.useEffect(() => {
    if (!institutions && !currentInstitutionData) {
      fetchInstitutionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutions, currentInstitutionData]);
  
  if (!institutions || !currentInstitutionData) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="institution-switcher flex items-center gap-2 p-2 bg-sidebar">
            {/* Loading Spinner */}
            <div className="institution-logo text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-muted animate-pulse shrink-0r">
              <LoadingSpinner 
                icon={Building2}
                size="sm"
              />
            </div>
            

            {/* Institution Info Skeleton */}
            <div className="institution-select flex-1 min-w-0">
              <div className="space-y-2">
                {/* Title Skeleton */}
                <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                {/* Description Skeleton */}
                <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
              </div>
            </div>


          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="institution-switcher flex items-center gap-2 p-2 bg-sidebar">
          {/* Institution Logo */}
          <div className="institution-logo text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shrink-0">
            {/* Use ícone Building2 como fallback/placeholder */}
            <AdventistLogo className="w-full h-full text-primary" />
            {/* <Building2 className="sidebar-icon-lg text-sidebar-primary-foreground" /> */}
          </div>

          {/* Institution Select */}
          <div className="institution-select flex-1 min-w-0">
            {canSwitchInstitution ? (
              <Select 
                value={currentInstitutionData.id} 
                onValueChange={handleInstitutionChange}
                disabled={isReloading}
              >
                  <SelectTrigger className="h-10 border-0 bg-transparent shadow-none p-0 focus:ring-0">
                  <SelectValue>
                    <div className="text-left">
                      <div title={currentInstitutionData.name} className="font-medium text-sm truncate max-w-[160px]">{truncateText(currentInstitutionData.name, 32)}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {t('institution_switcher.churches_and_users', { defaultValue: '{{churches}} churches • {{users}} users', churches: currentInstitutionData.churches_count, users: currentInstitutionData.users_count })}
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
                          <Building2 className="sidebar-icon text-sidebar-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div title={institution.name} className="font-medium text-sm">{institution.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {t('institution_switcher.churches_and_users', { defaultValue: '{{churches}} churches • {{users}} users', churches: institution.churches_count, users: institution.users_count })}
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
                              {t('institution_switcher.create_institution', { defaultValue: 'Create New Institution' })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t('institution_switcher.create_description', { defaultValue: 'Add a new institution to the system' })}
                            </div>
                          </div>
                        </button>
                      </RegisterInstitutionModal>
                    </div>
                  </WithPermission>
                </SelectContent>
              </Select>
                ) : (
              // Usuário sem permissão: mostrar apenas nome + ícone (não interativo)
              <div className="flex items-center gap-2">
                <div className="min-w-0">
                  <div title={currentInstitutionData.name} className="font-medium text-sm truncate max-w-[160px]">{truncateText(currentInstitutionData.name, 32)}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[160px]">{t('institution_switcher.churches_and_users', { defaultValue: '{{churches}} churches • {{users}} users', churches: currentInstitutionData.churches_count, users: currentInstitutionData.users_count })}</div>
                </div>
              </div>
            )}
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

