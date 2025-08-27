"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useMemo } from "react"
import { usePageTitle } from "@/hooks/use-page-title"

export default function ReportsPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Reports" }
  ], []);
  usePageTitle({
    title: "Reports",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Reports</h2>
          <p className="text-muted-foreground">Generate and view various church reports and analytics</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Reports page content will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}