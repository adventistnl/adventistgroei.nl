"use client"

import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, AlertCircle, Building2, FolderKanban, ChevronDown } from "lucide-react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { REQUEST_SUBSIDY_REFUND } from "@/graphql/mutations/REFUND_MUTATIONS"
import { UPDATE_SUBSIDY_REQUEST } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { GET_ALL_SUBSIDY_STATUSES } from "@/graphql/queries/SUBSIDY_STATUS_QUERIES"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import { LanguagePreference } from "@/types/graphql-global-types"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"

export interface RequestRefundModalProps {
  isOpen: boolean
  onClose: () => void
  subsidyId: string
  currentAmount: number
  projectName: string
  departmentName: string
  requester: UserAvatarData | null
  projectOwner: UserAvatarData | null
  onSuccess?: () => void
}

export function RequestRefundModal({
  isOpen,
  onClose,
  subsidyId,
  currentAmount,
  projectName,
  departmentName,
  requester,
  projectOwner,
  onSuccess
}: RequestRefundModalProps) {
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [refundAmount, setRefundAmount] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [confirmAwareness, setConfirmAwareness] = useState<boolean>(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    projectInfo: false,
    refundDetails: false,
    importantNotice: false,
    awareness: false
  })

  const [requestRefund, { loading: isLoading }] = useMutation(REQUEST_SUBSIDY_REFUND, {
    // Force refetch to update the UI immediately
    refetchQueries: ['GetAllSubsidyRequests', 'GetSubsidyRequestById'],
    awaitRefetchQueries: true,
  })

  const [updateSubsidyStatus] = useMutation(UPDATE_SUBSIDY_REQUEST, {
    refetchQueries: ['GetAllSubsidyRequests', 'GetSubsidyRequestById'],
    awaitRefetchQueries: true,
  })

  // Fetch subsidy statuses to get WAITING_REFUND status ID
  const { data: statusesData } = useQuery(GET_ALL_SUBSIDY_STATUSES)

  const t = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund ||
    subsidyRequestTranslations.en.refund

  // Helper to get status ID by name
  const getStatusIdByName = (statusName: string): string | null => {
    if (!statusesData?.subsidyStatuses) return null
    const status = statusesData.subsidyStatuses.find((s: any) => s.name?.toUpperCase() === statusName.toUpperCase())
    return status?.id || null
  }

  const handleSubmit = async () => {
    const amount = parseFloat(refundAmount)

    // Validations
    if (!refundAmount || amount <= 0) {
      toast.error(t.refundAmountRequired)
      return
    }

    if (!reason.trim()) {
      toast.error(t.refundReasonRequired)
      return
    }

    if (amount > currentAmount) {
      toast.error(`Refund amount cannot exceed ${formatCurrency(currentAmount)}`)
      return
    }

    try {
      await requestRefund({
        variables: {
          id: subsidyId,
          refundAmount: amount,
          reason: reason.trim(),
          language: i18n.language as LanguagePreference
        }
      })

      // Automatically change status to WAITING_REFUND
      const waitingRefundStatusId = getStatusIdByName('WAITING_REFUND')
      if (waitingRefundStatusId) {
        try {
          await updateSubsidyStatus({
            variables: {
              id: subsidyId,
              data: {
                subsidy_status_id: waitingRefundStatusId
              },
              language: i18n.language as LanguagePreference
            }
          })
        } catch (statusError) {
          console.warn('Failed to update status to WAITING_REFUND:', statusError)
          // Don't show error to user - refund was successful
        }
      }

      toast.success(t.refundRequestSuccess, { duration: 3000 })

      // Reset form
      setRefundAmount("")
      setReason("")
      setConfirmAwareness(false)

      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (error: any) {
      console.error('Error requesting refund:', error)

      // Apollo can return errors in different ways
      let graphQLError = error?.graphQLErrors?.[0]
      if (!graphQLError && error?.networkError?.result?.errors) {
        graphQLError = error.networkError.result.errors[0]
      }

      const errorMessage = graphQLError?.message || error?.message || "Error requesting refund"
      toast.error(errorMessage, { duration: 5000 })
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setRefundAmount("")
      setReason("")
      setConfirmAwareness(false)
      setCollapsedSections({
        projectInfo: false,
        refundDetails: false,
        importantNotice: false,
        awareness: false
      })
      onClose()
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const handleMaxAmount = () => {
    setRefundAmount(currentAmount.toString())
  }

  // Prepare users for avatar group
  const responsibleUsers: UserAvatarData[] = []
  if (requester) responsibleUsers.push(requester)
  if (projectOwner && projectOwner.id !== requester?.id) responsibleUsers.push(projectOwner)

  const isSubmitEnabled =
    refundAmount &&
    parseFloat(refundAmount) > 0 &&
    reason.trim().length > 0 &&
    confirmAwareness &&
    !isLoading

  const renderCollapsibleSection = (
    sectionKey: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey]
    
    return (
      <div className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            }`}
          />
        </button>
        
        {!isCollapsed && (
          <div className="animate-in fade-in-0 duration-200 slide-in-from-top-1">
            {content}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {t.refundModalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {t.refundModalDescription}
          </DialogDescription>

          {/* Mini KPIs */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{t.subsidyAmount}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(currentAmount)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{t.refundingAmount}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {refundAmount ? formatCurrency(parseFloat(refundAmount)) : formatCurrency(0)}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 p-1">
            
            {/* Project Information Section */}
            {renderCollapsibleSection(
              'projectInfo',
              <FolderKanban className="w-4 h-4 text-gray-500" />,
              t.projectInfo,
              <div className="flex flex-col gap-1 mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{projectName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{departmentName}</span>
                </div>
                {responsibleUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{t.responsibles}:</span>
                    <UsersAvatarGroup
                      users={responsibleUsers}
                      maxDisplay={3}
                      size="md"
                      showAddButton={false}
                      ownerUserId={projectOwner?.id}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Refund Details Section */}

              <div className="space-y-4">
                <div className="mt-4 space-y-2">
                  <Label htmlFor="refund-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.refundAmountLabel}
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="refund-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        max={currentAmount}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-9 border-gray-300 dark:border-gray-700"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleMaxAmount}
                      disabled={isLoading}
                      className="px-3 border-gray-300 dark:border-gray-700 text-xs py-4 font-semibold"
                    >
                      {t.maxButton}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t.maximum}: {formatCurrency(currentAmount)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refund-reason" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.refundReason}
                  </Label>
                  <Textarea
                    id="refund-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t.refundReasonPlaceholder}
                    className="min-h-[80px] resize-none border-gray-300 dark:border-gray-700"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">
                    {reason.length}/500 {t.characters}
                  </p>
                </div>
              </div>
        

            {/* Important Notice Section */}
            {renderCollapsibleSection(
              'importantNotice',
              <AlertCircle className="w-4 h-4 text-gray-500" />,
              t.importantNotice,
              <div className="mt-4 space-y-3">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.noticeIntro}
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 ml-4 list-disc">
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{t.noticeResponsibles}</span> {t.noticeResponsiblesDetail}
                  </li>
                  <li>
                    {t.noticeBudget} <span className="font-semibold text-gray-900 dark:text-gray-100">{departmentName}</span>.
                  </li>
                  <li>
                    {t.noticeHistory} <span className="font-semibold text-gray-900 dark:text-gray-100">{t.noticeHistoryDetail}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Awareness Confirmation Section */}

              <div className="flex items-start gap-3 p-3 border border-gray-300 dark:border-gray-700 rounded-md">
                <Checkbox
                  id="confirm-awareness"
                  checked={confirmAwareness}
                  onCheckedChange={(checked) => setConfirmAwareness(checked as boolean)}
                  disabled={isLoading}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="confirm-awareness"
                  className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer"
                >
                  {t.awarenessLabel}
                </Label>
              </div>
            

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            size="sm"
            className="border-gray-300 dark:border-gray-700"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            size="sm"
            className="min-w-[140px] bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin mr-2" />
                {t.processing}
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                {t.submit}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
