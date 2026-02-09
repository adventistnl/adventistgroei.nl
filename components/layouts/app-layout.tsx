"use client"

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModernHeader } from "@/components/modern-header"
import { MobileHeader } from "@/components/mobile-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { usePageContext } from "@/contexts/page-context"
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"
import { RefundAlertProvider } from "@/contexts/refund-alert-context"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { pageTitle, breadcrumbs: contextBreadcrumbs } = usePageContext()
  const { breadcrumbs: autoBreadcrumbs } = useBreadcrumbs()

  // Use context breadcrumbs if available, otherwise use auto-generated ones
  const breadcrumbs = contextBreadcrumbs && contextBreadcrumbs.length > 0 ? contextBreadcrumbs : autoBreadcrumbs

  return (
    <ProtectedRoute>
      <RefundAlertProvider>
        <SidebarProvider className="h-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col h-full overflow-hidden">
            {/* Mobile Header - Visível apenas em dispositivos móveis */}
            <div className="md:hidden shrink-0">
              <MobileHeader />
            </div>

            {/* Desktop Header - Visível apenas em desktop */}
            <div className="hidden md:block shrink-0">
              <ModernHeader />
            </div>

            {/* Breadcrumbs - Apenas no desktop */}
            {breadcrumbs && breadcrumbs.length > 1 && (
              <div className="hidden md:block px-6 pt-4 shrink-0">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {breadcrumb.href ? (
                            <BreadcrumbLink href={breadcrumb.href}>
                              {'label' in breadcrumb ? breadcrumb.label : (breadcrumb as any).name}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>
                              {'label' in breadcrumb ? breadcrumb.label : (breadcrumb as any).name}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 pt-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </RefundAlertProvider>
    </ProtectedRoute>
  )
}

export default AppLayout
