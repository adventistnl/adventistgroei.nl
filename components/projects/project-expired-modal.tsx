"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { AlertTriangle, Calendar } from "lucide-react"
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
      <DialogContent className="sm:max-w-[400px] border-amber-200">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <DialogTitle className="text-lg font-medium text-amber-900">
            {t.status?.expiredModalTitle || "Project Expired"}
          </DialogTitle>
          <DialogDescription className="text-amber-700">
            {t.status?.expiredModalDescription || "This project has passed its end date."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="text-center space-y-2">
            <p className="font-medium text-amber-800">{projectTitle}</p>
            <p className="text-sm text-amber-600 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              {i18n.language === 'nl' ? 'Einddatum' : 'End date'}: {formatDate(endDate)}
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-center gap-3 pt-2">
          {onExtendDate && (
            <Button 
              variant="default" 
              onClick={onExtendDate} 
              className="bg-amber-900 hover:bg-amber-800 text-amber-50 border-0"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {t.status?.extendDate || "Extend End Date"}
            </Button>
          )}
          {onConcludeProject && (
            <Button 
              variant="outline" 
              onClick={onConcludeProject} 
              className="border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900"
            >
              {t.status?.concludeProject || "Conclude Project"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
