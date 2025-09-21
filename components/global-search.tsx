"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Command, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

// Import navigation structure
const navMainBase = [
  { title: "Dashboard", url: "/dashboard", icon: null },
  { 
    title: "Structure & Organization", 
    url: "#", 
    icon: null,
    items: [
      { title: "Institutions", url: "/institutions" },
      { title: "Regions", url: "/regions" },
      { title: "Churches", url: "/churches" },
      { title: "Departments", url: "/departments" },
    ]
  },
  { 
    title: "Users & Access", 
    url: "#", 
    icon: null,
    items: [
      { title: "Users", url: "/users" },
      { title: "Access Management", url: "/access" },
    ]
  },
  { 
    title: "Reports & Projects", 
    url: "#", 
    icon: null,
    items: [
      { title: "Projects", url: "/projects" },
      { title: "Reports", url: "/reports" },
    ]
  },
  { title: "Events", url: "/events", icon: null },
  { title: "Communications", url: "/communications", icon: null },
]

// Dynamic search suggestions based on navigation
const getSearchSuggestions = () => {
  const suggestions: { category: string; items: { name: string; href: string; description: string; icon: string }[] }[] = []
  
  navMainBase.forEach((navItem: any) => {
    if (navItem.items && navItem.items.length > 0) {
      // Group with sub-items
      suggestions.push({
        category: navItem.title,
        items: navItem.items.map((subItem: any) => ({
          name: subItem.title,
          href: subItem.url,
          description: `Access ${subItem.title.toLowerCase()} management`,
          icon: getIconForPage(subItem.url)
        }))
      })
    } else {
      // Single page
      const existingMainCategory = suggestions.find(s => s.category === "Main Pages")
      const newItem = {
        name: navItem.title,
        href: navItem.url,
        description: `Access ${navItem.title.toLowerCase()}`,
        icon: getIconForPage(navItem.url)
      }
      
      if (existingMainCategory) {
        existingMainCategory.items.push(newItem)
      } else {
        suggestions.push({
          category: "Main Pages",
          items: [newItem]
        })
      }
    }
  })
  
  return suggestions
}

const getIconForPage = (url: string): string => {
  const iconMap: { [key: string]: string } = {
    "/dashboard": "📊",
    "/institutions": "🏢",
    "/regions": "🗺️",
    "/churches": "⛪",
    "/departments": "📋",
    "/users": "👥",
    "/access": "🔐",
    "/projects": "📁",
    "/reports": "📈",
    "/events": "📅",
    "/communications": "💬",
    "/settings": "⚙️",
    "/profile": "👤"
  }
  return iconMap[url] || "📄"
}

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
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()
  
  // Use external state if provided (for mobile), otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnOpenChange || setInternalIsOpen

  // Get dynamic suggestions from navigation
  const searchSuggestions = React.useMemo(() => getSearchSuggestions(), [])

  const filteredSuggestions = React.useMemo(() => {
    if (!searchValue) return searchSuggestions

    return searchSuggestions.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    })).filter(category => category.items.length > 0)
  }, [searchValue, searchSuggestions])

  const handleNavigation = (href: string, name: string) => {
    setIsOpen(false)
    setSearchValue("")
    toast.success(`🚀 Navigating to ${name}`, { duration: 2000 })
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredSuggestions.length > 0) {
      const firstItem = filteredSuggestions[0].items[0]
      if (firstItem) {
        handleNavigation(firstItem.href, firstItem.name)
      }
    }
  }

  // Mobile version - Modal with just search field
  if (isMobile) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md p-0">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Search className="w-4 h-4" />
                Search
              </DialogTitle>
            </DialogHeader>
            
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <Input
                  placeholder="Search pages, features..."
                  className="h-12 text-base border-2"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                
                {filteredSuggestions.length > 0 && (
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredSuggestions.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        {categoryIndex > 0 && <div className="h-px bg-border my-2" />}
                        <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                          {category.category}
                        </p>
                        {category.items.map((item, itemIndex) => (
                          <button
                            key={itemIndex}
                            onClick={() => handleNavigation(item.href, item.name)}
                            className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-muted rounded-md transition-colors"
                          >
                            <span className="text-base">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{item.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                
                {searchValue && filteredSuggestions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No results found for "{searchValue}"</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search pages, features..."
            className="pl-10 pr-16 h-10 bg-background/80 border-border focus:bg-background transition-all focus:ring-2 focus:ring-primary/20"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-muted/80">
              <Command className="w-3 h-3 mr-1" />
              K
            </Badge>
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-[400px] p-0" 
        align="center"
        sideOffset={8}
      >
        <div className="p-2">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {categoryIndex > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {category.category}
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {category.items.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      onClick={() => handleNavigation(item.href, item.name)}
                      className="flex items-center gap-3 px-2 py-2.5 cursor-pointer hover:bg-accent"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </div>
            ))
          ) : searchValue ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{searchValue}"</p>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start typing to search...</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook para comando de teclado global
export function useGlobalSearch() {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Focar no input de busca
        const searchInput = document.querySelector('[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
