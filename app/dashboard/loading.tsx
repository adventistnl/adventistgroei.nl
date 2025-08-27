export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="fixed top-0 left-0 z-40 h-screen w-64 bg-background/95 backdrop-blur-sm border-r border-border lg:relative lg:translate-x-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg animate-pulse"></div>
              <div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="flex-1 p-4 space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="h-14 bg-muted rounded animate-pulse mb-3"></div>
            <div className="h-12 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 lg:ml-0 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <div className="h-8 w-96 bg-muted rounded animate-pulse mb-2"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4"></div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-6 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Activities and Actions Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-64 bg-muted rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-6 w-24 bg-muted rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
