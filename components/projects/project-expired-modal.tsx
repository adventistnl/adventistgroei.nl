"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { AlertTriangle, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { projectTranslations } from "@/lib/translations/projects"

interface ProjectExpiredModalProps {
  isOpen: boolean
  onClose: () => void
  onExtendDate?: () => void
  onConcludeProject?: () => void
  projectTitle: string
  endDate: string
}

export function ProjectExpiredModal({
  isOpen,
  onClose,
  onExtendDate,
  onConcludeProject,
  projectTitle,
  endDate,
}: ProjectExpiredModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">
            {t.status?.expiredModalTitle || "Project Expired"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t.status?.expiredModalDescription || "This project has passed its end date."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">{projectTitle}</p>
                <p className="text-sm text-amber-700">
                  {i18n.language === 'nl' ? 'Einddatum' : 'End date'}: {formatDate(endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          {onExtendDate && (
            <Button variant="outline" onClick={onExtendDate} className="w-full sm:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              {t.status?.extendDate || "Extend End Date"}
            </Button>
          )}
          {onConcludeProject && (
            <Button onClick={onConcludeProject} className="w-full sm:w-auto">
              {t.status?.concludeProject || "Conclude Project"}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            <X className="h-4 w-4 mr-2" />
            {t.common?.cancel || "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
