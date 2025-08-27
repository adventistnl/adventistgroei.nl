"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"

export default function AnnualReportsPage() {
  usePageTitle({ 
    title: "Annual Reports",
    breadcrumbs: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Reports & Projects" },
      { name: "Annual Reports" }
    ]
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
