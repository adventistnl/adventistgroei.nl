"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@apollo/client"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  RefreshCw,
  Building,
  DollarSign
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { SubsidyApprovalsManager } from "@/components/finance/subsidy-approvals-manager"
import { useInstitution } from "@/contexts/institution-context"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { GET_ALL_SUBSIDY_REQUESTS } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_SUBSIDY_ANALYTICS } from "@/graphql/queries/SUBSIDY_ANALYTICS_QUERIES"

export default function SubsidyApprovalsPage() {
  const { t } = useTranslation()
  const { currentInstitutionData, loading: institutionLoading } = useInstitution()
  const [refreshing, setRefreshing] = useState(false)

  usePageTitle({
    title: "Subsidy Approvals"
  })

  // Fetch subsidy requests from backend
  const { data: subsidyData, loading: subsidyLoading, error: subsidyError, refetch: refetchSubsidies } = useQuery(GET_ALL_SUBSIDY_REQUESTS, {
    fetchPolicy: 'network-only', // Always fetch from server to ensure fresh data
    onCompleted: () => {
      console.log('✅ Subsidy requests loaded successfully')
    },
    onError: (error) => {
      console.error('❌ Error loading subsidy requests:', error)
      toast.error("Error loading subsidy requests")
    }
  })

  // Fetch analytics data from backend
  const { data: analyticsData, loading: analyticsLoading, refetch: refetchAnalytics } = useQuery(GET_SUBSIDY_ANALYTICS, {
    variables: { institutionId: currentInstitutionData?.id },
    fetchPolicy: 'network-only',
    skip: !currentInstitutionData?.id,
    onCompleted: () => {
      console.log('✅ Analytics data loaded successfully')
    },
    onError: (error) => {
      console.error('❌ Error loading analytics:', error)
    }
  })

  // Combined loading state
  const isLoading = institutionLoading || subsidyLoading || analyticsLoading

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing data...")
    
    try {
      await Promise.all([refetchSubsidies(), refetchAnalytics()])
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
                Subsidy Approvals
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                Review and approve subsidy requests from churches and institutions
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

          {/* Subsidy Approvals Manager Component */}
          <SubsidyApprovalsManager 
            context="institution"
            entityId={currentInstitutionData?.id}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            showCharts={true}
            showKPICards={true}
            subsidyData={subsidyData}
            analyticsData={analyticsData}
            refetchSubsidies={async () => {
              await refetchSubsidies()
              await refetchAnalytics()
            }}
          />
        </div>
      </WithPermission>
    </AppLayout>
  )
}
