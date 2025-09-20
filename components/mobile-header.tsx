"use client"

import * as React from "react"
import { useState } from "react"
import { GlobalSearch, useGlobalSearch } from "@/components/global-search"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NotificationsSidebar } from "@/components/notifications-sidebar"
import { InviteModal } from "@/components/modals/invite-modal"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePageContext } from "@/contexts/page-context"
import { 
  UserPlus, 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Globe,
  X,
  ChevronRight
} from "lucide-react"
import toast from "react-hot-toast"

export function MobileHeader() {
  // Ativar comando de teclado global para busca
  useGlobalSearch()
  
  // Acessar dados de breadcrumb do contexto
  const { pageTitle, breadcrumbs } = usePageContext()
  
  // Estado para controlar o menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleInviteSent = (inviteData: any) => {
    console.log('Invitation sent from mobile header:', inviteData)
    toast.success("Invitation sent successfully!", {
      duration: 3000,
      icon: '📧'
    })
  }

  return (
    <>
      {/* Mobile Header - Visível apenas em dispositivos móveis */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="w-full px-4 py-3">
          <div className="flex h-12 items-center justify-between gap-3">
            
            {/* Left Section - Sidebar Toggle & Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <SidebarTrigger className="h-9 w-9 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-base font-semibold text-foreground truncate">
                  {pageTitle || "Dashboard"}
                </h1>
                {breadcrumbs && breadcrumbs.length > 1 && (
                  <p className="text-xs text-muted-foreground truncate">
                    {breadcrumbs[breadcrumbs.length - 2]?.name}
                  </p>
                )}
              </div>
            </div>

            {/* Right Section - Invite Button & Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              
              {/* Invite Button - Destaque Principal */}
              <InviteModal onInviteSent={handleInviteSent}>
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-9 px-4 font-medium"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </InviteModal>

              {/* Mobile Actions Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-lg font-semibold">Quick Actions</SheetTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    
                    {/* Current Page Info */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Current Page
                      </h3>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="font-medium text-sm">{pageTitle || "Dashboard"}</p>
                        {breadcrumbs && breadcrumbs.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            {breadcrumbs.map((crumb, index) => (
                              <React.Fragment key={index}>
                                {index > 0 && <ChevronRight className="w-3 h-3" />}
                                <span>{crumb.name}</span>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Search Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Search
                      </h3>
                      <div className="w-full">
                        <GlobalSearch />
                      </div>
                    </div>

                    <Separator />

                    {/* Primary Actions */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Primary Actions
                      </h3>
                      <div className="space-y-2">
                        
                        {/* Invite Button - Destaque */}
                        <InviteModal onInviteSent={handleInviteSent}>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md h-11 font-medium justify-start"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <UserPlus className="w-5 h-5 mr-3" />
                            <div className="text-left">
                              <div className="text-sm font-medium">Invite Member</div>
                              <div className="text-xs opacity-90">Send invitation to new users</div>
                            </div>
                          </Button>
                        </InviteModal>

                        {/* Notifications */}
                        <NotificationsSidebar>
                          <Button 
                            variant="outline" 
                            className="w-full h-11 justify-start"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Bell className="w-5 h-5 mr-3" />
                            <div className="text-left">
                              <div className="text-sm font-medium">Notifications</div>
                              <div className="text-xs text-muted-foreground">View recent updates</div>
                            </div>
                          </Button>
                        </NotificationsSidebar>
                      </div>
                    </div>

                    <Separator />

                    {/* Settings & Preferences */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Settings
                      </h3>
                      <div className="space-y-2">
                        
                        {/* Theme Switcher */}
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Theme</p>
                              <p className="text-xs text-muted-foreground">Light / Dark mode</p>
                            </div>
                          </div>
                          <ThemeSwitcher />
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Language</p>
                              <p className="text-xs text-muted-foreground">Choose your language</p>
                            </div>
                          </div>
                          <LanguageSelector />
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - Mantém o header original para desktop */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
        <div className="w-full px-6 py-3">
          <div className="flex h-12 items-center justify-between gap-6">
            
            {/* Left Section - Breadcrumb & Sidebar Toggle */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <SidebarTrigger className="h-9 w-9" />
              <Separator
                orientation="vertical"
                className="h-6"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs && breadcrumbs.length > 0 ? (
                    breadcrumbs.map((crumb: { name: string; href?: string }, index: number) => (
                      <div key={index} className="flex items-center">
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {crumb.href ? (
                            <BreadcrumbLink href={crumb.href} className="text-sm">
                              {crumb.name}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-sm font-medium">
                              {crumb.name}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </div>
                    ))
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-sm font-medium">
                        {pageTitle || "Dashboard"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-md mx-auto">
              <GlobalSearch />
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              
              {/* Notifications */}
              <NotificationsSidebar />

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Language Selector */}
              <LanguageSelector />

              {/* Invite Button - Destaque */}
              <InviteModal onInviteSent={handleInviteSent}>
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex items-center gap-2 h-9 px-4 ml-2 bg-primary hover:bg-primary/90 shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite</span>
                </Button>
              </InviteModal>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
