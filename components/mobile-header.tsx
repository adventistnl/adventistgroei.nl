"use client"

import * as React from "react"
import { useState } from "react"
import { GlobalSearch, useGlobalSearch, MobileSearchTrigger } from "@/components/global-search"
import { ResponsiveBreadcrumbs } from "@/components/responsive-breadcrumbs"
import { ChatUsersSelector } from "@/components/chat/chat-users-selector"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NotificationsSidebar } from "@/components/notifications-sidebar"
import { InviteModal } from "@/components/modals/invite-modal"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePageContext } from "@/contexts/page-context"
import { mockUsers } from "@/data/mockData"
import { 
  UserPlus, 
  MessageCircle
} from "lucide-react"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

export function MobileHeader() {
  // Ativar comando de teclado global para busca
  useGlobalSearch()
  
  // Acessar dados de breadcrumb do contexto
  const { pageTitle, breadcrumbs } = usePageContext()
  const { t } = useTranslation()
  
  // Estados para controlar os modais
  const [isChatSelectorOpen, setIsChatSelectorOpen] = useState(false)
  
  // Mock current user
  const currentUser = {
    ...mockUsers[0],
    role: "admin",
    is_deleted: false,
    institution_id: "inst-1"
  }

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
            
            {/* Left Section - Sidebar Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <SidebarTrigger className="h-9 w-9 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <ResponsiveBreadcrumbs 
                  breadcrumbs={breadcrumbs || []}
                  pageTitle={pageTitle}
                  maxVisibleItems={1}
                />
              </div>
            </div>

            {/* Right Section - Action Icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              
              {/* Search Icon - Mobile */}
              <MobileSearchTrigger />
              
              {/* Chat Icon - Mobile */}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setIsChatSelectorOpen(true)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              
              {/* Notifications - Mobile */}
              <NotificationsSidebar />
              
              {/* Theme Switcher - Mobile */}
              <ThemeSwitcher />
              
              {/* Language Selector - Mobile */}
              <LanguageSelector />
              
              {/* Invite Button - Destaque Principal */}
              <WithPermission requiredPermissions={[PermissionResolverName.InviteUser, PermissionResolverName.SendInviteEmail]} >
                <InviteModal onInviteSent={handleInviteSent}>
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-9 px-2"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </InviteModal>
              </WithPermission>
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
              <ResponsiveBreadcrumbs 
                breadcrumbs={breadcrumbs || []}
                pageTitle={pageTitle}
                maxVisibleItems={3}
              />
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-md mx-auto">
              <GlobalSearch />
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              
              {/* Chat */}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setIsChatSelectorOpen(true)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              
              {/* Notifications */}
              <NotificationsSidebar />

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Language Selector */}
              <LanguageSelector />

              {/* Invite Button - Destaque */}
              <WithPermission requiredPermissions={[PermissionResolverName.InviteUser, PermissionResolverName.SendInviteEmail]} >
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
              </WithPermission>
            </div>
          </div>
        </div>
      </header>
      
      {/* Chat Users Selector */}
      <ChatUsersSelector
        isOpen={isChatSelectorOpen}
        onOpenChange={setIsChatSelectorOpen}
        currentUser={currentUser}
      />
    </>
  )
}
