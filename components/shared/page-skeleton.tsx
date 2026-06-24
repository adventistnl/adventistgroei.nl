/**
 * PAGE SKELETON COMPONENTS
 *
 * Biblioteca de skeletons reutilizáveis para loading states de página.
 * Use em vez de AppLoader fullScreen para manter o layout visível enquanto os dados chegam.
 *
 * @example
 * // Dashboard
 * if (loading) return <DashboardPageSkeleton />
 *
 * @example
 * // Projects list
 * if (loading) return <ProjectsPageSkeleton />
 */

import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AppLayout } from "@/components/layouts/app-layout"

// ---------------------------------------------------------------------------
// Blocos atômicos
// ---------------------------------------------------------------------------

/** Skeleton de um card KPI (título + valor + trend) */
export function SkeletonKPICard() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3 min-w-[180px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

/** Skeleton de linha de tabela com avatar + dados + badge */
export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-0">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  )
}

/** Skeleton de header de página com título + subtítulo + badge */
export function SkeletonPageHeader() {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2 mt-1">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton de card de gráfico (área de chart vazia) */
export function SkeletonChartCard({ height = "h-64" }: { height?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${height} rounded-lg`} />
      </CardContent>
    </Card>
  )
}

/** Skeleton de tabela completa (header + N linhas + pagination) */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pb-4 space-y-3">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="border rounded-lg mx-6 mb-6 overflow-hidden">
          {/* Table header */}
          <div className="flex gap-4 p-4 border-b bg-muted/30">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
          {/* Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 pb-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Skeleton de página completa — Dashboard
// ---------------------------------------------------------------------------

export function DashboardPageSkeleton() {
  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <SkeletonPageHeader />

        <Separator />

        {/* KPI Carousel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonKPICard key={i} />
            ))}
          </div>
        </div>

        {/* Date / Time placeholder */}
        <Skeleton className="h-6 w-72" />

        {/* Charts row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <SkeletonChartCard height="h-72" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <SkeletonChartCard height="h-72" />
          </div>
        </div>

        <Separator />

        {/* Second charts row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <SkeletonChartCard height="h-56" />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <SkeletonChartCard height="h-56" />
          </div>
        </div>

        <Separator />

        {/* Users Table */}
        <SkeletonTable rows={5} />
      </div>
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// Skeleton de página completa — Projects List
// ---------------------------------------------------------------------------

export function ProjectsPageSkeleton() {
  return (
    <AppLayout>
      <div className="space-y-6 w-full">
        <SkeletonPageHeader />
        <Separator />
        <SkeletonTable rows={8} />
      </div>
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// Skeleton de página completa — Project Detail
// ---------------------------------------------------------------------------

export function ProjectDetailSkeleton() {
  return (
    <AppLayout>
      <div className="space-y-6 w-full">
        {/* Project header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-72" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <div className="flex gap-1 border-b pb-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-b-none" />
          ))}
        </div>

        {/* Tab content — cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonKPICard key={i} />
          ))}
        </div>

        <SkeletonTable rows={6} />
      </div>
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// Skeleton genérico — Header + KPIs + Tabela
// Usado nas páginas: Regions, Churches, Access, Reports, Inst.Departments, Church Departments
// ---------------------------------------------------------------------------

export function GenericPageSkeleton({ kpiCount = 4 }: { kpiCount?: number }) {
  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">

        {/* Page Header */}
        <SkeletonPageHeader />

        {/* KPI Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          kpiCount <= 3 ? 'lg:grid-cols-3' :
          kpiCount <= 4 ? 'lg:grid-cols-4' :
          'lg:grid-cols-3 xl:grid-cols-6'
        }`}>
          {Array.from({ length: kpiCount }).map((_, i) => (
            <SkeletonKPICard key={i} />
          ))}
        </div>

        {/* Chart (opcional — aparece em algumas páginas) */}
        <SkeletonChartCard height="h-64" />

        {/* Table */}
        <SkeletonTable rows={6} />

      </div>
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------

export function ProfilePageSkeleton() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="w-full space-y-8">

          {/* Profile Header — avatar + nome + email */}
          <div className="flex items-center gap-6 p-6 rounded-2xl border bg-card">
            <Skeleton className="h-20 w-20 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>

          {/* Personal Data Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Church Data Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-52" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// Skeleton de página completa — Users
// ---------------------------------------------------------------------------

export function UsersPageSkeleton() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-72 mt-2" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonKPICard key={i} />
          ))}
        </div>

        {/* Growth Chart */}
        <SkeletonChartCard height="h-72" />

        {/* Users Table */}
        <SkeletonTable rows={8} />

      </div>
    </AppLayout>
  )
}
