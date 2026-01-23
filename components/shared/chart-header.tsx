import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  actionsOrientation?: "responsive" | "vertical" | "horizontal"
  className?: string
}

export function ChartHeader({
  title,
  description,
  actions,
  actionsOrientation = "responsive",
  className,
}: ChartHeaderProps) {
  const getActionsContainerClass = () => {
    switch (actionsOrientation) {
      case "vertical":
        return "flex flex-col gap-2"
      case "horizontal":
        return "flex flex-row items-center gap-2"
      case "responsive":
      default:
        return "flex flex-col sm:flex-row items-start sm:items-center gap-2"
    }
  }

  return (
    <CardHeader
      className={cn(
        "flex items-start gap-2 space-y-0 border-b py-5",
        actionsOrientation === "responsive" && "flex-col sm:flex-row",
        actionsOrientation === "horizontal" && "flex-row",
        actionsOrientation === "vertical" && "flex-col",
        className
      )}
    >
      <div className="grid flex-1 gap-1">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {actions && (
        <div className={getActionsContainerClass()}>
          {actions}
        </div>
      )}
    </CardHeader>
  )
}
