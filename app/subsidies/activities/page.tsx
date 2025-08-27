"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useMemo } from "react"
import { usePageTitle } from "@/hooks/use-page-title"

export default function SubsidyActivitiesPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Subsidies", href: "/subsidies" },
    { name: "Activities" }
  ], []);
  usePageTitle({
    title: "Subsidy Activities",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Subsidy Activities</h2>
          <p className="text-muted-foreground">Track and manage activities related to subsidies</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Subsidy activities page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
