import { AlertCircle } from "lucide-react"

interface IncompleteFieldBadgeProps {
  field: string
  onClick?: () => void
}

export function IncompleteFieldBadge({ field, onClick }: IncompleteFieldBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/60 bg-muted/30 hover:bg-muted/50 hover:border-border transition-all text-xs text-muted-foreground hover:text-foreground whitespace-nowrap"
    >
      <AlertCircle className="h-3 w-3" />
      <span>{field}</span>
    </button>
  )
}
