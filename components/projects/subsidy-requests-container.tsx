"use client"

import * as React from "react"
import { Plus, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubsidyRequestCard, SubsidyRequestCardData } from "./subsidy-request-card"
import { cn } from "@/lib/utils"

interface SubsidyRequestsContainerProps {
  /** Array of subsidy request data */
  subsidies: SubsidyRequestCardData[]
  /** Callback when "Add Subsidy" button is clicked */
  onAddSubsidy?: () => void
  /** Callback when a card's edit action is triggered */
  onEditSubsidy?: (id: string) => void
  /** Callback when a card's delete action is triggered */
  onDeleteSubsidy?: (id: string) => void
  /** Callback when a card's view action is triggered */
  onViewSubsidy?: (id: string) => void
  /** Callback when a card's duplicate action is triggered */
  onDuplicateSubsidy?: (id: string) => void
  /** Optional title for the container */
  title?: string
  /** Optional description for the container */
  description?: string
  /** Grid column span (e.g., "col-span-12", "col-span-6") for responsive width control */
  gridColSpan?: string
  /** Optional custom className for the container */
  className?: string
}

export function SubsidyRequestsContainer({
  subsidies,
  onAddSubsidy,
  onEditSubsidy,
  onDeleteSubsidy,
  onViewSubsidy,
  onDuplicateSubsidy,
  title = "Solicitações de Subsídio",
  description,
  gridColSpan = "col-span-12",
  className,
}: SubsidyRequestsContainerProps) {
  return (
    <div className={cn(gridColSpan, className, "h-full")}>
      <div className="h-full flex flex-col space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>

          {/* Add Button */}
          {onAddSubsidy && (
            <Button
              onClick={onAddSubsidy}
              size="sm"
              className="gap-2 bg-gray-900 hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          )}
        </div>

        {/* Cards Container */}
        {subsidies.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Inbox className="h-5 w-5 text-gray-400" />
            </div>
            <h4 className="mt-3 text-xs font-medium text-gray-900">
              Nenhuma solicitação de subsídio
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              Comece criando uma nova solicitação.
            </p>
            {onAddSubsidy && (
              <Button
                onClick={onAddSubsidy}
                variant="outline"
                size="sm"
                className="mt-3 gap-2 h-7 text-xs"
              >
                <Plus className="h-3 w-3" />
                Criar Solicitação
              </Button>
            )}
          </div>
        ) : (
          /* Cards Column - Full height with vertical scroll */
          <div className="relative flex-1 min-h-0">
            <div className="h-full flex flex-col gap-3 overflow-y-auto pr-2">
              {subsidies.map((subsidy) => (
                <SubsidyRequestCard
                  key={subsidy.id}
                  data={subsidy}
                  onEdit={onEditSubsidy}
                  onDelete={onDeleteSubsidy}
                  onView={onViewSubsidy}
                  onDuplicate={onDuplicateSubsidy}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Info (optional) */}
        {subsidies.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-500 flex-shrink-0">
            <span>
              {subsidies.length} solicitaç{subsidies.length === 1 ? "ão" : "ões"}
            </span>
            <span>
              Total:{" "}
              <span className="font-semibold text-gray-700">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                }).format(subsidies.reduce((sum, s) => sum + s.requested_amount, 0))}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
