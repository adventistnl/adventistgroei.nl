"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { useMemo } from "react";

export default function AnnualReportsPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Reports & Projects" },
    { name: "Annual Reports" }
  ], []);
  usePageTitle({
    title: "Annual Reports",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Annual Reports</h2>
          <p className="text-muted-foreground">Generate and manage annual reports</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Annual reports page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
