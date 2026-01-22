"use client"

import React, { useState, useMemo, useEffect } from "react"
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
import { createPrivacyConfig } from "@/config/privacy-roles.config"

// Components
import { SubsidyApprovalsManager } from "@/components/finance/subsidy-approvals-manager"
import { GlobalPrivacyToggle } from "@/components/shared/global-privacy-toggle"
import { useInstitution } from "@/contexts/institution-context"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { GET_ALL_SUBSIDY_REQUESTS } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_SUBSIDY_ANALYTICS } from "@/graphql/queries/SUBSIDY_ANALYTICS_QUERIES"
import { subsidyApprovalsTranslations } from "@/lib/translations/subsidy-approvals"

export default function SubsidyApprovalsPage() {
  const { t, i18n } = useTranslation()
  const { currentInstitutionData, loading: institutionLoading } = useInstitution()
  const [refreshing, setRefreshing] = useState(false)
  
  const translations = subsidyApprovalsTranslations[i18n.language as keyof typeof subsidyApprovalsTranslations] || subsidyApprovalsTranslations.en

  // Privacy configurations for KPIs (memoized to ensure stable IDs)
  const PRIVACY_CONFIGS = useMemo(() => ({
    totalRequests: createPrivacyConfig('kpi-subsidy-total-requests', 'FINANCIAL_DATA'),
    pendingReview: createPrivacyConfig('kpi-subsidy-pending-review', 'FINANCIAL_DATA'),
    totalRequested: createPrivacyConfig('kpi-subsidy-total-requested', 'FINANCIAL_DATA'),
    totalApproved: createPrivacyConfig('kpi-subsidy-total-approved', 'FINANCIAL_DATA'),
    approvalRate: createPrivacyConfig('kpi-subsidy-approval-rate', 'FINANCIAL_DATA'),
    tableMonetaryValues: createPrivacyConfig('subsidy-table-monetary-values', 'FINANCIAL_DATA'),
    kanbanMonetaryValues: createPrivacyConfig('subsidy-kanban-monetary-values', 'FINANCIAL_DATA'),
    byDepartmentChart: createPrivacyConfig('subsidy-chart-by-department', 'FINANCIAL_DATA'),
    overTimeChart: createPrivacyConfig('subsidy-chart-over-time', 'FINANCIAL_DATA'),
    statusOverviewChart: createPrivacyConfig('subsidy-chart-status-overview', 'FINANCIAL_DATA'),
  }), [])

  usePageTitle({
    title: translations.pageTitle
  })

  // Fetch subsidy requests from backend
  const { data: subsidyData, loading: subsidyLoading, error: subsidyError, refetch: refetchSubsidies } = useQuery(GET_ALL_SUBSIDY_REQUESTS, {
    fetchPolicy: 'network-only', // Always fetch from server to ensure fresh data
  })

  // Handle subsidy error with useEffect (Apollo Client v3.14+)
  useEffect(() => {
    if (subsidyError) {
      toast.error(translations.toasts.loadingError)
    }
  }, [subsidyError, translations.toasts.loadingError])

  // Fetch analytics data from backend
  const { data: analyticsData, loading: analyticsLoading, refetch: refetchAnalytics } = useQuery(GET_SUBSIDY_ANALYTICS, {
    variables: { institutionId: currentInstitutionData?.id },
    fetchPolicy: 'network-only',
    skip: !currentInstitutionData?.id,
  })

  // Combined loading state
  const isLoading = institutionLoading || subsidyLoading || analyticsLoading

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(translations.toasts.refreshing)
    
    try {
      await Promise.all([refetchSubsidies(), refetchAnalytics()])
      toast.success(translations.toasts.refreshSuccess, { duration: 2000 })
    } catch (error) {
      toast.error(translations.toasts.refreshError)
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  return (
    <AppLayout>
      <WithPermission 
        requiredPermissions={[PermissionResolverName.SubsidyRequest]} 
        fallback={<AccessDenied />}
      >
        <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2 flex items-center gap-3">
                {translations.pageTitle}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {translations.pageDescription}
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
              <GlobalPrivacyToggle 
                variant="icon"
                size="icon"
                showLabel={false}
              />
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
            privacyConfigs={PRIVACY_CONFIGS}
          />
        </div>
      </WithPermission>
    </AppLayout>
  )
}
