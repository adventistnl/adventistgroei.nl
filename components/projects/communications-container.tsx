"use client"

import React, { useState } from "react"
import { Plus, Search, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/shared/empty-state"
import { CommunicationCard, CommunicationCardData } from "./communication-card"
import { cn } from "@/lib/utils"

interface CommunicationsContainerProps {
  communications: CommunicationCardData[]
  onAddCommunication?: () => void
  onViewCommunication?: (id: string) => void
  onEditCommunication?: (id: string) => void
  onDeleteCommunication?: (id: string) => void
  onDuplicateCommunication?: (id: string) => void
  title?: string
  description?: string
  className?: string
  gridColSpan?: string
}

export function CommunicationsContainer({
  communications,
  onAddCommunication,
  onViewCommunication,
  onEditCommunication,
  onDeleteCommunication,
  onDuplicateCommunication,
  title = "Comunicações",
  description = "Gerencie comunicações do projeto",
  className,
  gridColSpan = "col-span-12",
}: CommunicationsContainerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCommunications = communications.filter((comm) =>
    comm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.author_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn(gridColSpan, className,"mt-4")}>
      <div className="flex flex-col space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>

          {/* Add Button */}
          {onAddCommunication && (
            <Button
              onClick={onAddCommunication}
              size="sm"
              className="gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          )}
        </div>

        {/* Search */}
        {communications.length > 0 && (
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar comunicações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        )}

        {/* Cards Container */}
        {filteredCommunications.length === 0 ? (
          <div className="flex-1 min-h-0">
            <EmptyState
              icon={Megaphone}
              title={searchQuery ? "Nenhuma comunicação encontrada" : "Nenhuma comunicação ainda"}
              description={searchQuery ? "Tente ajustar os filtros de busca" : "Comece criando sua primeira comunicação"}
              fullHeight={true}
            />
          </div>
        ) : (
          <div className="relative flex-1 min-h-0">
            <div className="h-full flex flex-col gap-3 overflow-y-auto pr-2">
              {filteredCommunications.map((communication) => (
                <CommunicationCard
                  key={communication.id}
                  communication={communication}
                  onView={onViewCommunication}
                  onEdit={onEditCommunication}
                  onDelete={onDeleteCommunication}
                  onDuplicate={onDuplicateCommunication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        {filteredCommunications.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">
            <span>
              {filteredCommunications.length} {filteredCommunications.length === 1 ? "comunicação" : "comunicações"}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {communications.length > filteredCommunications.length && `${communications.length} no total`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
