"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useMemo } from "react"
import { usePageTitle } from "@/hooks/use-page-title"

export default function RegionsPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Institutions & Structures" },
    { name: "Regions" }
  ], []);
  usePageTitle({
    title: "Regions",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Regions</h2>
          <p className="text-muted-foreground">Manage geographic regions and territories</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Regions management page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
