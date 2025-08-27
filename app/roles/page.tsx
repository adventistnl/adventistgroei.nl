"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useMemo } from "react"
import { usePageTitle } from "@/hooks/use-page-title"

export default function RolesPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users & Access" },
    { name: "Roles" }
  ], []);
  usePageTitle({
    title: "Roles",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Roles</h2>
          <p className="text-muted-foreground">Manage user roles and access levels</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Roles management page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
