"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Globe, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

// System configured languages (matching language-selector.tsx)
const systemLanguages = [
  { code: "pt", name: "Português", flag: "🇧🇷", enabled: true },
  { code: "en", name: "English", flag: "��", enabled: true },
  { code: "nl", name: "Nederlands", flag: "��", enabled: true },
]

interface LanguagesTabProps {
  preferredLanguage: string
  setPreferredLanguage: (value: string) => void
  enabledLanguages: string[]
  toggleLanguage: (code: string) => void
}

export function LanguagesTab({
  preferredLanguage,
  setPreferredLanguage,
  enabledLanguages,
  toggleLanguage,
}: LanguagesTabProps) {
  const [openLanguage, setOpenLanguage] = useState(false)

  // Filter to show only enabled languages
  const availableLanguages = systemLanguages.filter((lang) => enabledLanguages.includes(lang.code))

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Languages
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage available languages and your preference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferred Language */}
        <div className="space-y-2">
          <Label className="text-foreground">Preferred Language</Label>
          <Popover open={openLanguage} onOpenChange={setOpenLanguage}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openLanguage}
                className="w-full justify-between h-12 text-base bg-background border-border"
              >
                <span>
                  {preferredLanguage
                    ? `${availableLanguages.find((lang) => lang.code === preferredLanguage)?.flag} ${
                        availableLanguages.find((lang) => lang.code === preferredLanguage)?.name
                      }`
                    : "Select language..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {availableLanguages.map((lang) => (
                    <CommandItem
                      key={lang.code}
                      value={lang.code}
                      onSelect={() => {
                        setPreferredLanguage(lang.code)
                        setOpenLanguage(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          preferredLanguage === lang.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-xl mr-2">{lang.flag}</span>
                      {lang.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <Separator className="bg-border" />

        {/* Available Languages */}
        <div className="space-y-4">
          <Label className="text-foreground">Available Languages</Label>
          <p className="text-sm text-muted-foreground">
            Enable or disable system languages. Only enabled languages will appear in the selector.
          </p>
          <div className="space-y-3">
            {systemLanguages.map((language) => (
              <div
                key={language.code}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium text-foreground">{language.name}</div>
                    <div className="text-sm text-muted-foreground">Code: {language.code}</div>
                  </div>
                </div>
                <Switch
                  checked={enabledLanguages.includes(language.code)}
                  onCheckedChange={() => toggleLanguage(language.code)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
