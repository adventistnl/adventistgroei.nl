"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useMemo } from "react"
import { usePageTitle } from "@/hooks/use-page-title"

export default function SubsidyReceiptsPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Subsidies", href: "/subsidies" },
    { name: "Receipts" }
  ], []);
  usePageTitle({
    title: "Subsidy Receipts",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Subsidy Receipts</h2>
          <p className="text-muted-foreground">Manage receipts and documentation for subsidies</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Subsidy receipts page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
