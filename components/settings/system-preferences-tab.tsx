"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Settings, Check, ChevronsUpDown, Sun, Moon, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, createElement } from "react"

const systemLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Portuguese", flag: "��" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
]

const currencies = [
  { value: "eur", label: "EUR (€)" },
  { value: "usd", label: "USD ($)" },
  { value: "gbp", label: "GBP (£)" },
  { value: "cad", label: "CAD (C$)" },
]

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
]

interface SystemPreferencesTabProps {
  themeMode: string
  setThemeMode: (value: string) => void
  defaultLanguage: string
  setDefaultLanguage: (value: string) => void
  currency: string
  setCurrency: (value: string) => void
}

export function SystemPreferencesTab({
  themeMode,
  setThemeMode,
  defaultLanguage,
  setDefaultLanguage,
  currency,
  setCurrency,
}: SystemPreferencesTabProps) {
  const [openLanguage, setOpenLanguage] = useState(false)
  const [openCurrency, setOpenCurrency] = useState(false)
  const [openTheme, setOpenTheme] = useState(false)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5" />
          System Preferences
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure your default system settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Mode Preference */}
          <div className="space-y-2">
            <Label className="text-foreground">Mode Preference</Label>
            <Popover open={openTheme} onOpenChange={setOpenTheme}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTheme}
                  className="w-full justify-between h-12 text-base bg-background border-border"
                >
                  <span className="flex items-center gap-2">
                    {themeMode ? (
                      <>
                        {themeOptions.find((mode) => mode.value === themeMode)?.icon &&
                          createElement(themeOptions.find((mode) => mode.value === themeMode)!.icon, {
                            className: "w-4 h-4",
                          })}
                        {themeOptions.find((mode) => mode.value === themeMode)?.label}
                      </>
                    ) : (
                      "Select theme mode..."
                    )}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search theme mode..." />
                  <CommandEmpty>No theme mode found.</CommandEmpty>
                  <CommandGroup>
                    {themeOptions.map((mode) => (
                      <CommandItem
                        key={mode.value}
                        value={mode.value}
                        onSelect={() => {
                          setThemeMode(mode.value)
                          setOpenTheme(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            themeMode === mode.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <mode.icon className="mr-2 h-4 w-4" />
                        {mode.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Default Language */}
          <div className="space-y-2">
            <Label className="text-foreground">Default Language</Label>
            <Popover open={openLanguage} onOpenChange={setOpenLanguage}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openLanguage}
                  className="w-full justify-between h-12 text-base bg-background border-border"
                >
                  <span>
                    {defaultLanguage
                      ? `${systemLanguages.find((lang) => lang.code === defaultLanguage)?.flag} ${
                          systemLanguages.find((lang) => lang.code === defaultLanguage)?.name
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
                    {systemLanguages.map((lang) => (
                      <CommandItem
                        key={lang.code}
                        value={lang.code}
                        onSelect={() => {
                          setDefaultLanguage(lang.code)
                          setOpenLanguage(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            defaultLanguage === lang.code ? "opacity-100" : "opacity-0"
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

          {/* Currency */}
          <div className="space-y-2">
            <Label className="text-foreground">Currency</Label>
            <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCurrency}
                  className="w-full justify-between h-12 text-base bg-background border-border"
                >
                  <span>
                    {currency
                      ? currencies.find((curr) => curr.value === currency)?.label
                      : "Select currency..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search currency..." />
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((curr) => (
                      <CommandItem
                        key={curr.value}
                        value={curr.value}
                        onSelect={() => {
                          setCurrency(curr.value)
                          setOpenCurrency(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currency === curr.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {curr.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
