"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Command as CommandIcon, ArrowRight, BarChart3, Users, Calendar, DollarSign, Building, File, MessageSquare, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { searchTranslations } from "@/lib/translations/search"
import toast from "react-hot-toast"

// Navigation structure with icons
const getNavStructure = (t: any) => [
  { 
    title: t.pages.dashboard, 
    url: "/dashboard", 
    icon: BarChart3,
    description: t.descriptions.dashboard,
    shortcut: t.shortcuts.dashboard
  },
  { 
    title: t.structure, 
    url: "#", 
    icon: Building,
    items: [
      { title: t.pages.institutions, url: "/institutions", icon: Building, description: t.descriptions.institutions },
      { title: t.pages.regions, url: "/regions", icon: Building, description: t.descriptions.regions },
      { title: t.pages.churches, url: "/churches", icon: Building, description: t.descriptions.churches },
      { title: t.pages.departments, url: "/institutional-departments", icon: Building, description: t.descriptions.departments },
    ]
  },
  { 
    title: t.usersAccess, 
    url: "#", 
    icon: Users,
    items: [
      { title: t.pages.users, url: "/users", icon: User, description: t.descriptions.users },
      { title: t.pages.access, url: "/access", icon: Settings, description: t.descriptions.access },
    ]
  },
  { 
    title: t.reportsProjects, 
    url: "#", 
    icon: File,
    items: [
      { title: t.pages.projects, url: "/projects", icon: File, description: t.descriptions.projects, shortcut: t.shortcuts.projects },
      { title: t.pages.reports, url: "/reports", icon: BarChart3, description: t.descriptions.reports },
    ]
  },
  { title: t.pages.events, url: "/events", icon: Calendar, description: t.descriptions.events, shortcut: t.shortcuts.events },
  { title: t.pages.communications, url: "/communications", icon: MessageSquare, description: t.descriptions.communications },
]

// Mobile Search Trigger Component
export function MobileSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-9 w-9"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <GlobalSearch isMobile={true} isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

export function GlobalSearch({ isMobile = false, isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }: { 
  isMobile?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void 
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const router = useRouter()
  const { i18n } = useTranslation()
  
  // Get translations
  const t = searchTranslations[i18n.language as keyof typeof searchTranslations] || searchTranslations.en
  
  // Use external state if provided (for mobile), otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnOpenChange || setInternalIsOpen

  // Get navigation structure with translations
  const navStructure = React.useMemo(() => getNavStructure(t), [t])

  const handleNavigation = (href: string, name: string) => {
    setIsOpen(false)
    toast.success(`🚀 ${name}`, { duration: 2000 })
    router.push(href)
  }

  // Mobile version - Modal with Command component
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <Command className="rounded-lg border-0 shadow-none">
            <CommandInput placeholder={t.placeholder} className="h-12 text-base" />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>{t.noResults}</CommandEmpty>
              
              {/* Main Pages */}
              <CommandGroup heading={t.suggestions}>
                {navStructure.filter(item => !item.items).map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.url}
                      onSelect={() => handleNavigation(item.url, item.title)}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex-1">
                        <span className="font-medium">{item.title}</span>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              {/* Structure & Organization */}
              {navStructure.filter(item => item.items).map((group) => (
                <React.Fragment key={group.title}>
                  <CommandSeparator />
                  <CommandGroup heading={group.title}>
                    {group.items?.map((item) => {
                      const Icon = item.icon
                      return (
                        <CommandItem
                          key={item.url}
                          onSelect={() => handleNavigation(item.url, item.title)}
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <Icon className="w-4 h-4" />
                          <div className="flex-1">
                            <span className="font-medium">{item.title}</span>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </React.Fragment>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between h-10 px-3 bg-background/80 border-border hover:bg-background focus:ring-2 focus:ring-primary/20"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t.placeholder}</span>
          </div>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-muted/80">
            <CommandIcon className="w-3 h-3 mr-1" />
            K
          </Badge>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[400px] p-0" align="center">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder={t.placeholder} />
          <CommandList>
            <CommandEmpty>{t.noResults}</CommandEmpty>
            
            {/* Main Pages */}
            <CommandGroup heading={t.suggestions}>
              {navStructure.filter(item => !item.items).map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem
                    key={item.url}
                    onSelect={() => handleNavigation(item.url, item.title)}
                    className="flex items-center gap-3"
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <span>{item.title}</span>
                    </div>
                    {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {/* Structure & Organization */}
            {navStructure.filter(item => item.items).map((group) => (
              <React.Fragment key={group.title}>
                <CommandSeparator />
                <CommandGroup heading={group.title}>
                  {group.items?.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.url}
                        onSelect={() => handleNavigation(item.url, item.title)}
                        className="flex items-center gap-3"
                      >
                        <Icon className="w-4 h-4" />
                        <div className="flex-1">
                          <span>{item.title}</span>
                        </div>
                        {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Hook para comando de teclado global
export function useGlobalSearch() {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Trigger search popover/dialog
        const searchTrigger = document.querySelector('[role="combobox"]') as HTMLButtonElement
        if (searchTrigger) {
          searchTrigger.click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
