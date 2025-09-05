"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RolePermissionsLoading() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Role Information Card Skeleton */}
        <Card className="border-2">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-80" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-3 bg-muted/50 rounded-lg border">
                  <Skeleton className="h-6 w-8 mx-auto mb-2" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Actions Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-80" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permission Groups Skeleton */}
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="text-left space-y-1">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-24" />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-11 w-24" />
                <Skeleton className="h-11 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
