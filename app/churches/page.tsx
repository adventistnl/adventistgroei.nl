"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { useMemo } from "react";

export default function ChurchesPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Institutions & Structures" },
    { name: "Churches" }
  ], []);
  usePageTitle({
    title: "Churches",
    breadcrumbs
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Churches</h2>
          <p className="text-muted-foreground">Manage churches and congregations</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Churches management page will be implemented here.</p>
        </div>
      </div>
    </AppLayout>
  )
}
