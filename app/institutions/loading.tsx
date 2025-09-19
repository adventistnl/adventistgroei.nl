"use client"

import React from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent } from "@/components/ui/card"

export default function InstitutionsLoading() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          
          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}