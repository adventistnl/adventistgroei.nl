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
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

const searchSuggestions = [
  {
    category: "Main Pages",
    items: [
      { name: "Dashboard", href: "/dashboard", description: "Overview and analytics", icon: "📊" },
      { name: "Members", href: "/members", description: "Manage church members", icon: "👥" },
      { name: "Events", href: "/events", description: "Church events and activities", icon: "📅" },
      { name: "Subsidies", href: "/subsidies", description: "Financial support requests", icon: "💰" },
    ]
  },
  {
    category: "Structure",
    items: [
      { name: "Institutions", href: "/institutions", description: "Church institutions", icon: "🏢" },
      { name: "Regions", href: "/regions", description: "Geographic regions", icon: "🗺️" },
      { name: "Churches", href: "/churches", description: "Local churches", icon: "⛪" },
      { name: "Departments", href: "/departments", description: "Church departments", icon: "📋" },
    ]
  },
  {
    category: "Administration",
    items: [
      { name: "Reports", href: "/reports", description: "System reports", icon: "📈" },
      { name: "Communications", href: "/communications", description: "Send messages", icon: "💬" },
      { name: "Settings", href: "/settings", description: "System settings", icon: "⚙️" },
      { name: "Profile", href: "/profile", description: "User profile", icon: "👤" },
    ]
  }
]

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()

  const filteredSuggestions = React.useMemo(() => {
    if (!searchValue) return searchSuggestions

    return searchSuggestions.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    })).filter(category => category.items.length > 0)
  }, [searchValue])

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
