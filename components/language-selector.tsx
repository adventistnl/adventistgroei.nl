"use client"

import * as React from "react"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18nReady } from "@/hooks/use-i18n-ready"
import { useLanguageSettings } from "@/contexts/language-settings-context"

export function LanguageSelector() {
  const { isReady, currentLanguage } = useI18nReady()
  const { enabledLanguages, preferredLanguage, setPreferredLanguage } = useLanguageSettings()

  const displayLanguage = enabledLanguages.find((lang) => lang.code === currentLanguage) || enabledLanguages[0]

  // Show minimal loading state
  if (!isReady || !displayLanguage) {
    return (
      <Button variant="outline" size="sm" className="gap-2 h-9 px-3" disabled>
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">...</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 px-3">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{displayLanguage.initials}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {enabledLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setPreferredLanguage(language.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{language.initials}</span>
              <span className="text-sm text-muted-foreground">{language.name}</span>
            </div>
            {preferredLanguage === language.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
