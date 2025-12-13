"use client"

import * as React from "react"
import { MoreVertical, FileText, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface SubsidyRequestCardData {
  id: string
  title: string
  requested_at: string | Date
  status: "pending" | "approved" | "rejected" | "in_review"
  requested_amount: number
  institution_name?: string
}

interface SubsidyRequestCardProps {
  data: SubsidyRequestCardData
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onDuplicate?: (id: string) => void
  className?: string
}

export function SubsidyRequestCard({
  data,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  className,
}: SubsidyRequestCardProps) {
  const statusConfig: Record<
    SubsidyRequestCardData["status"],
    { label: string; className: string }
  > = {
    pending: { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200" },
    approved: { label: "Aprovado", className: "bg-green-50 text-green-700 border-green-200" },
    rejected: { label: "Rejeitado", className: "bg-red-50 text-red-700 border-red-200" },
    in_review: { label: "Em Análise", className: "bg-blue-50 text-blue-700 border-blue-200" },
  }

  const currentStatus = statusConfig[data.status]

  const formattedDate = React.useMemo(() => {
    const date = typeof data.requested_at === "string" ? new Date(data.requested_at) : data.requested_at
    return format(date, "dd MMM yyyy", { locale: ptBR })
  }, [data.requested_at])

  const formattedAmount = React.useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(data.requested_amount)
  }, [data.requested_amount])

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-sm",
        className
      )}
    >
      {/* Header: Icon + Title + Menu */}
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
          <FileText className="h-4 w-4 text-gray-600" />
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-xs font-semibold text-gray-900">{data.title}</h4>
          {data.institution_name && (
            <p className="truncate text-[10px] text-gray-500">{data.institution_name}</p>
          )}
        </div>

        {/* Three-dot menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-3 w-3 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(data.id)}>
                Visualizar
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(data.id)}>
                Editar
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={() => onDuplicate(data.id)}>
                Duplicar
              </DropdownMenuItem>
            )}
            {(onEdit || onView || onDuplicate) && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(data.id)}
                className="text-red-600 focus:text-red-600"
              >
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
        <span>Solicitado:</span>
        <span className="font-medium text-gray-700">{formattedDate}</span>
      </div>

      {/* Status Badge + Amount in same row */}
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className={cn("text-[10px] font-medium px-1.5 py-0.5", currentStatus.className)}>
          {currentStatus.label}
        </Badge>

        {/* Amount */}
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-gray-400" />
          <span className="text-sm font-bold text-gray-900">{formattedAmount}</span>
        </div>
      </div>
    </div>
  )
}
