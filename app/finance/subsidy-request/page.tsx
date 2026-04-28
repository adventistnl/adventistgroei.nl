"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@apollo/client"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  CheckCircle, 
  RefreshCw,
  Building,
  DollarSign,
  ShieldAlert
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { createPrivacyConfig } from "@/config/privacy-roles.config"

// Components
import { SubsidyRequestManager } from "@/components/finance/subsidy-request-manager"
import { GlobalPrivacyToggle } from "@/components/shared/global-privacy-toggle"
import { useInstitution } from "@/contexts/institution-context"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { GET_ALL_SUBSIDY_REQUESTS } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_SUBSIDY_ANALYTICS } from "@/graphql/queries/SUBSIDY_ANALYTICS_QUERIES"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"

export default function SubsidyRequestPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { currentInstitutionData, loading: institutionLoading } = useInstitution()
  const [refreshing, setRefreshing] = useState(false)
  const [filterByResponsible, setFilterByResponsible] = useState(true) // Default: mostrar apenas pedidos do usuário
  
  const translations = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations] || subsidyRequestTranslations.en

  // Get user initials for the filter button
  const userInitials = React.useMemo(() => {
    if (!user?.name) return '??'
    const names = user.name.trim().split(' ')
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase()
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }, [user?.name])

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
    onError: (error) => {
      console.error('[SubsidyApprovals] GraphQL Error:', error)
      console.error('[SubsidyApprovals] Network Error:', error.networkError)
      console.error('[SubsidyApprovals] GraphQL Errors:', error.graphQLErrors)
    }
  })

  // 🔍 DEBUG: Log subsidy data
  useEffect(() => {
    console.log('[DEBUG] SubsidyData:', {
      hasData: !!subsidyData,
      subsidyRequests: subsidyData?.subsidyRequests,
      requestsCount: subsidyData?.subsidyRequests?.length,
      loading: subsidyLoading,
      error: subsidyError
    })
  }, [subsidyData, subsidyLoading, subsidyError])

  // Handle subsidy error with useEffect (Apollo Client v3.14+)
  useEffect(() => {
    if (subsidyError) {
      const errorMessage = subsidyError.graphQLErrors?.[0]?.message || 
                          subsidyError.message || 
                          translations.toasts.loadingError
      console.error('[SubsidyApprovals] Error details:', {
        message: errorMessage,
        graphQLErrors: subsidyError.graphQLErrors,
        networkError: subsidyError.networkError
      })
      toast.error(`${translations.toasts.loadingError}: ${errorMessage}`)
    }
  }, [subsidyError, translations.toasts.loadingError])

  // Fetch analytics data from backend
  const { data: analyticsData, loading: analyticsLoading, refetch: refetchAnalytics } = useQuery(GET_SUBSIDY_ANALYTICS, {
    variables: { institutionId: currentInstitutionData?.id },
    fetchPolicy: 'network-only',
    skip: !currentInstitutionData?.id,
  })

  // 🔍 DEBUG: Log analytics data
  useEffect(() => {
    console.log('[DEBUG] AnalyticsData:', {
      hasData: !!analyticsData,
      analytics: analyticsData,
      loading: analyticsLoading,
      institutionId: currentInstitutionData?.id,
      skipped: !currentInstitutionData?.id
    })
  }, [analyticsData, analyticsLoading, currentInstitutionData?.id])

  // 🔍 DEBUG: Log institution data
  useEffect(() => {
    console.log('[DEBUG] InstitutionData:', {
      hasData: !!currentInstitutionData,
      institutionId: currentInstitutionData?.id,
      institutionName: currentInstitutionData?.name,
      usersCount: currentInstitutionData?.users?.length,
      loading: institutionLoading
    })
  }, [currentInstitutionData, institutionLoading])

  // Combined loading state
  const isLoading = institutionLoading || subsidyLoading || analyticsLoading

  // Show loading/success toast: track true→false transition of isLoading
  const loadingToastRef = useRef<string | undefined>(undefined)
  const wasLoadingRef = useRef(false)
  const successShownRef = useRef(false)

  useEffect(() => {
    if (successShownRef.current) return

    if (isLoading && !wasLoadingRef.current) {
      wasLoadingRef.current = true
      loadingToastRef.current = toast.loading(translations.toasts.refreshing || 'Loading subsidy requests...')
    } else if (!isLoading && wasLoadingRef.current && loadingToastRef.current !== undefined) {
      successShownRef.current = true
      toast.dismiss(loadingToastRef.current)
      loadingToastRef.current = undefined
      toast.success(translations.toasts.refreshSuccess || 'Data loaded successfully', { duration: 3000 })
    }
  }, [isLoading])

  // 🔍 DEBUG: Log props being passed to SubsidyRequestManager
  useEffect(() => {
    console.log('[DEBUG] Props for SubsidyRequestManager:', {
      context: 'institution',
      entityId: currentInstitutionData?.id,
      institutionUsersCount: currentInstitutionData?.users?.length,
      isLoading,
      hasSubsidyData: !!subsidyData,
      subsidyRequestsCount: subsidyData?.subsidyRequests?.length,
      hasAnalyticsData: !!analyticsData,
      filterByUserId: filterByResponsible ? user?.id : undefined,
      userId: user?.id,
      filterByResponsible
    })
  }, [currentInstitutionData, subsidyData, analyticsData, isLoading, filterByResponsible, user?.id])

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
        requiredPermissions={[PermissionResolverName.SubsidyRequests, PermissionResolverName.SubsidyStatuses]} 
        fallback={
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-card-foreground flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-xl border p-6 sm:p-8 shadow-sm w-full max-w-md backdrop-blur-sm">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <ShieldAlert className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-semibold">
                  {'Access Denied'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {'You do not have permission to view subsidy requests.'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {'Contact your administrator to request access.'}
                </p>
              </div>
            </div>
          </div>
        }
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
              {/* Filter by User Responsible Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filterByResponsible ? "default" : "outline"}
                      size="icon"
                      onClick={() => setFilterByResponsible(!filterByResponsible)}
                      className={`relative h-10 w-10 rounded-full transition-all ${
                        filterByResponsible 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {userInitials}
                      </span>
                      {filterByResponsible && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[70]">
                    <p className="font-medium">
                      {filterByResponsible 
                        ? translations.filters?.showingMyRequests || 'Mostrando apenas meus pedidos'
                        : translations.filters?.showAllRequests || 'Mostrar apenas meus pedidos'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user?.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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

          {/* Subsidy Request Manager Component */}
          <SubsidyRequestManager 
            context="institution"
            entityId={currentInstitutionData?.id}
            institutionUsers={currentInstitutionData?.users || []}
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
            filterByUserId={filterByResponsible ? user?.id : undefined}
          />
        </div>
      </WithPermission>
    </AppLayout>
  )
}
