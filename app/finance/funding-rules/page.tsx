"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  RefreshCw,
  Building,
  DollarSign
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { FundingRulesManager } from "@/components/funding-rules/funding-rules-manager"
import { useInstitution } from "@/contexts/institution-context"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import { PermissionResolverName } from "@/types/graphql-global-types"

export default function FundingRulesPage() {
  const { t } = useTranslation()
  const { currentInstitutionData, loading: isLoading, refetchInstitutionById } = useInstitution()
  const [refreshing, setRefreshing] = useState(false)

  usePageTitle({
    title: "Funding Rules Management"
  })

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing data...")
    
    try {
      await refetchInstitutionById()
      toast.success("Data refreshed successfully", { duration: 2000 })
    } catch (error) {
      toast.error("Error refreshing data")
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  return (
    <AppLayout>
      <WithPermission 
        requiredPermissions={[PermissionResolverName.Institutions]} 
        fallback={<AccessDenied />}
      >
        <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2 flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                Funding Rules Management
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                Manage funding rules and groups for subsidy requests across all institutions
              </p>
              {currentInstitutionData && (
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Building className="w-3 h-3 mr-1" />
                    {currentInstitutionData.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentInstitutionData.denomination}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Funding Rules Manager Component */}
          <FundingRulesManager 
            context="institution"
            entityId={currentInstitutionData?.id}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            title="Institution Funding Rules"
            description="Manage funding rules and groups for this institution's subsidy requests"
            showCharts={true}
            showKPICards={true}
          />
        </div>
      </WithPermission>
    </AppLayout>
  )
}
