"use client"

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModernHeader } from "@/components/modern-header"
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ModernHeader />
          
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 1 && (
            <div className="px-6 pt-4">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {'isActive' in breadcrumb && breadcrumb.isActive ? (
                          <BreadcrumbPage>{'label' in breadcrumb ? breadcrumb.label : breadcrumb.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={'href' in breadcrumb ? breadcrumb.href : breadcrumb.href}>
                            {'label' in breadcrumb ? breadcrumb.label : breadcrumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
          
          <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

export default AppLayout
