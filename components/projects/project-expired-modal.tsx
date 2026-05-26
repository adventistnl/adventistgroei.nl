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
import { useHasPermission } from "@/hooks/use-has-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

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
  const canUpdateProject = useHasPermission([PermissionResolverName.UpdateProject])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(
      i18n.language === "pt" ? "pt-BR" : i18n.language === "nl" ? "nl-NL" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-gray-700" />
            </div>
            <DialogTitle className="text-base font-semibold text-gray-900">
              {t.status?.expiredModalTitle || "Project Expired"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            {t.status?.expiredModalDescription || "This project has passed its end date."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 space-y-1">
            <p className="text-sm font-medium text-gray-900 truncate">{projectTitle}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {i18n.language === "nl" ? "Einddatum" : i18n.language === "pt" ? "Data final" : "End date"}:{" "}
                {formatDate(endDate)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onConcludeProject ?? onClose}
            className="border-gray-300"
          >
            {onConcludeProject
              ? (t.status?.concludeProject || "Conclude Project")
              : (i18n.language === "pt" ? "Fechar" : i18n.language === "nl" ? "Sluiten" : "Close")}
          </Button>
          {canUpdateProject && onExtendDate && (
            <Button onClick={onExtendDate} className="bg-gray-900 hover:bg-gray-800 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              {t.status?.extendDate || "Extend End Date"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
