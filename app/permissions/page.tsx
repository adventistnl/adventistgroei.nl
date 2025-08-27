"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"

export default function PermissionsPage() {
  usePageTitle({ 
    title: "Permissions",
    breadcrumbs: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Users & Access" },
      { name: "Permissions" }
    ]
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Permissions</h2>
          <p className="text-muted-foreground">Manage system permissions and access controls</p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">Permissions management page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
