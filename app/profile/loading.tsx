export default function Loading() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 bg-card border-r border-border animate-pulse">
        <div className="p-6 space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
