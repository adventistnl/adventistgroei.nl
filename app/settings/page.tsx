"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"
import { useToast } from "@/hooks/use-toast"
import { SystemPreferencesTab } from "@/components/settings/system-preferences-tab"
import { LanguagesTab } from "@/components/settings/languages-tab"
import { NotificationsStatusTab } from "@/components/settings/notifications-status-tab"

const systemLanguages = [
  { code: "en", name: "English", flag: "🇺🇸", enabled: true },
  { code: "es", name: "Spanish", flag: "🇪🇸", enabled: true },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", enabled: true },
  { code: "nl", name: "Dutch", flag: "🇳🇱", enabled: true },
  { code: "twi", name: "Twi", flag: "🇬🇭", enabled: false },
  { code: "pap", name: "Papiamento", flag: "🇦🇼", enabled: false },
]

type UserStatus = "online" | "offline" | "away"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [preferredLanguage, setPreferredLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("dd-mm-yyyy")
  const [currency, setCurrency] = useState("eur")
  const [userStatus, setUserStatus] = useState<UserStatus>("online")
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(
    systemLanguages.filter((lang) => lang.enabled).map((lang) => lang.code)
  )
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
      duration: 3000,
    })
  }

  const toggleLanguage = (code: string) => {
    setEnabledLanguages((prev) => {
      if (prev.includes(code)) {
        return prev.filter((lang) => lang !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground">Manage your system preferences and configuration</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="preferences" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                System Preferences
              </TabsTrigger>
              <TabsTrigger
                value="languages"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Languages
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Notifications & Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences">
              <SystemPreferencesTab
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                defaultLanguage={defaultLanguage}
                setDefaultLanguage={setDefaultLanguage}
                dateFormat={dateFormat}
                setDateFormat={setDateFormat}
                currency={currency}
                setCurrency={setCurrency}
              />
            </TabsContent>

            <TabsContent value="languages">
              <LanguagesTab
                preferredLanguage={preferredLanguage}
                setPreferredLanguage={setPreferredLanguage}
                enabledLanguages={enabledLanguages}
                toggleLanguage={toggleLanguage}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsStatusTab
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
                userStatus={userStatus}
                setUserStatus={setUserStatus}
              />
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="bg-foreground hover:bg-muted-foreground text-background">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
