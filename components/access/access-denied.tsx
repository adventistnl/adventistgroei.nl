"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"

export const AccessDenied = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md text-center space-y-6">
        <AlertTriangle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
            {t('projects.accessDenied.title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('projects.accessDenied.message')}
          </p>
        </div>
        <Button 
          onClick={() => window.history.back()} 
          variant="ghost"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {t('projects.accessDenied.goBack')}
        </Button>
      </div>
    </div>
  )
}
