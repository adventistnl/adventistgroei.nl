"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle, DollarSign, FolderKanban, Building2, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '@/contexts/currency-context'
import { subsidyRequestTranslations } from '@/lib/translations/subsidy-request'
import { UsersAvatarGroup, UserAvatarData } from '@/components/shared/users-avatar-group'

interface ConfirmRefundDoneModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  refundAmount: number
  isLoading?: boolean
  projectName?: string
  departmentName?: string
  requester?: UserAvatarData | null
  projectOwner?: UserAvatarData | null
}

export const ConfirmRefundDoneModal: React.FC<ConfirmRefundDoneModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  refundAmount,
  isLoading = false,
  projectName = '',
  departmentName = '',
  requester = null,
  projectOwner = null
}) => {
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [confirmAwareness, setConfirmAwareness] = useState<boolean>(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    projectInfo: false,
    importantNotice: false,
    awareness: false
  })

  const t = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]?.refund ||
    subsidyRequestTranslations.en.refund

  const handleClose = () => {
    if (!isLoading) {
      setConfirmAwareness(false)
      setCollapsedSections({
        projectInfo: false,
        importantNotice: false,
        awareness: false
      })
      onClose()
    }
  }

  const handleConfirm = () => {
    if (confirmAwareness && !isLoading) {
      onConfirm()
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Prepare users for avatar group
  const responsibleUsers: UserAvatarData[] = []
  if (requester) responsibleUsers.push(requester)
  if (projectOwner && projectOwner.id !== requester?.id) responsibleUsers.push(projectOwner)

  const isSubmitEnabled = confirmAwareness && !isLoading

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
            <CheckCircle2 className="w-4 h-4" />
            {t.confirmRefundDone}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {t.confirmRefundDoneAction}
          </DialogDescription>

          {/* Mini KPIs */}
          <div className="grid grid-cols-1 gap-2 mt-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{t.refundAmount}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(refundAmount)}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 p-1">
            
            {/* Project Information Section */}
            {(projectName || departmentName || responsibleUsers.length > 0) && renderCollapsibleSection(
              'projectInfo',
              <FolderKanban className="w-4 h-4 text-gray-500" />,
              t.projectInfo,
              <div className="flex flex-col gap-1 mt-4 space-y-3">
                {projectName && (
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{projectName}</span>
                  </div>
                )}
                {departmentName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{departmentName}</span>
                  </div>
                )}
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

            {/* Important Notice Section */}
            {renderCollapsibleSection(
              'importantNotice',
              <AlertCircle className="w-4 h-4 text-gray-500" />,
              t.importantNotice,
              <div className="mt-4 space-y-3">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-bold">{t.confirmCompletionIntro}</span>
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 ml-4 list-disc">
                  <li>
                    {t.completionNotice1.replace('{{amount}}', formatCurrency(refundAmount))}
                  </li>
                  <li>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{t.completionNotice2}</span> {t.completionNotice2Detail}
                  </li>
                  <li>
                    {t.completionNotice3}
                  </li>
                  <li>
                    {t.completionNotice4} <span className="font-bold text-gray-900 dark:text-gray-100">{t.completionNotice4Detail}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Awareness Confirmation Section */}
            <div className="flex flex-row items-start gap-3 p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
              <Checkbox
                id="confirm-awareness"
                checked={confirmAwareness}
                onCheckedChange={(checked) => setConfirmAwareness(checked as boolean)}
                disabled={isLoading}
                className="mt-0.5 flex-shrink-0"
              />
              <Label
                htmlFor="confirm-awareness"
                className="flex flex-col items-start text-xs text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer flex-1"
              >
                <span className="font-bold">
                  {t.confirmAwarenessLabel.replace('{{amount}}', formatCurrency(refundAmount))}
                </span>{' '}
                {t.confirmAwarenessDetail}
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
            onClick={handleConfirm}
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
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t.confirmButton}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
