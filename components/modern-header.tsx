"use client"

import * as React from "react"
import { GlobalSearch, useGlobalSearch } from "@/components/global-search"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NotificationsSidebar } from "@/components/notifications-sidebar"
import { ChatUsersSelector } from "@/components/chat/chat-users-selector"
import { InviteModal } from "@/components/modals/invite-modal"
import { Button } from "@/components/ui/button"
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
import { UserPlus, MessageCircle } from "lucide-react"
import { mockUsers } from "@/data/mockData"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

export function ModernHeader() {
  // Ativar comando de teclado global para busca
  useGlobalSearch()
  
  // Acessar dados de breadcrumb do contexto
  const { pageTitle, breadcrumbs } = usePageContext()
  
  // Estado para o chat
  const [isChatSelectorOpen, setIsChatSelectorOpen] = React.useState(false)
  
  // Mock current user
  const currentUser = {
    ...mockUsers[0],
    role: "admin",
    is_deleted: false,
    institution_id: "inst-1"
  }

  const handleInviteSent = (inviteData: any) => {
    console.log('Invitation sent from header:', inviteData)
    // Aqui você pode atualizar estado global ou fazer outras ações
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-6 py-3">
        <div className="flex h-12 items-center justify-between gap-6">
          
          {/* Left Section - Breadcrumb & Sidebar Toggle */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SidebarTrigger className="h-9 w-9" />
            <Separator
              orientation="vertical"
              className="h-6"
            />
            <Breadcrumb className="hidden sm:flex">
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
            {/* Mobile: Show only current page */}
            <div className="sm:hidden">
              <span className="text-sm font-medium text-foreground">
                {pageTitle || "Dashboard"}
              </span>
            </div>
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

            {/* Invite Button - Far Right */}
            <WithPermission requiredPermissions={[PermissionResolverName.InviteUser, PermissionResolverName.SendInviteEmail]} >
              <InviteModal onInviteSent={handleInviteSent}>
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex items-center gap-2 h-9 px-4 ml-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Invite</span>
                </Button>
              </InviteModal>
            </WithPermission>
          </div>
        </div>
      </div>
      
      {/* Chat Users Selector */}
      <ChatUsersSelector
        isOpen={isChatSelectorOpen}
        onOpenChange={setIsChatSelectorOpen}
        currentUser={currentUser}
      />
    </header>
  )
}
