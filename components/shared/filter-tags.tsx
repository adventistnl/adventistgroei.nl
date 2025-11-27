"use client"

import * as React from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface FilterTag {
  key: string
  label: string
  count?: number // Opcional: mostrar quantidade de itens
}

interface FilterTagsProps {
  tags: FilterTag[]
  selectedTag: string
  onTagSelect: (tag: string) => void
  title?: string // Opcional: título acima dos filtros
  showTitle?: boolean // Controla se mostra o título
  className?: string
  tagClassName?: string
  showCount?: boolean // Mostra contador ao lado do label
  size?: "sm" | "md" | "lg" // Tamanho dos tags
  variant?: "default" | "pills" | "underline" // Estilo visual
}

/**
 * Componente reutilizável de filtros por tags
 * 
 * Features:
 * - Design monocromático e minimalista
 * - Suporte completo a light/dark mode
 * - Scroll horizontal suave
 * - i18n ready (recebe labels traduzidos)
 * - Título opcional
 * - Contador opcional
 * - Múltiplos tamanhos e variantes
 * - Totalmente responsivo
 * 
 * @example
 * // Exemplo básico
 * <FilterTags
 *   tags={[
 *     { key: "all", label: t.all },
 *     { key: "active", label: t.active, count: 5 }
 *   ]}
 *   selectedTag={selectedFilter}
 *   onTagSelect={setSelectedFilter}
 * />
 * 
 * @example
 * // Com título
 * <FilterTags
 *   tags={tags}
 *   selectedTag={selected}
 *   onTagSelect={setSelected}
 *   title="Filter by Status"
 *   showTitle={true}
 *   showCount={true}
 * />
 */
export function FilterTags({
  tags,
  selectedTag,
  onTagSelect,
  title,
  showTitle = false,
  className,
  tagClassName,
  showCount = false,
  size = "md",
  variant = "default",
}: FilterTagsProps) {
  // Tamanhos dos tags
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 rounded-md",
    md: "text-sm px-3 py-1.5 rounded-lg",
    lg: "text-base px-4 py-2 rounded-lg",
  }

  // Variantes de estilo
  const getVariantClasses = (isSelected: boolean) => {
    switch (variant) {
      case "pills":
        return isSelected
          ? "rounded-full bg-foreground text-background shadow-sm"
          : "rounded-full bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      
      case "underline":
        return isSelected
          ? "rounded-none border-b-2 border-foreground bg-transparent text-foreground font-medium"
          : "rounded-none border-b-2 border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
      
      default: // "default"
        return isSelected
          ? "bg-foreground text-background shadow-sm"
          : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Título opcional */}
      {showTitle && title && (
        <label className="text-sm font-medium text-foreground">
          {title}
        </label>
      )}

      {/* ScrollArea horizontal com tags */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag.key
            
            return (
              <button
                key={tag.key}
                type="button"
                onClick={() => onTagSelect(tag.key)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center gap-1.5 font-medium transition-all duration-200",
                  sizeClasses[size],
                  getVariantClasses(isSelected),
                  tagClassName
                )}
                aria-pressed={isSelected}
                aria-label={`Filter by ${tag.label}`}
              >
                <span>{tag.label}</span>
                
                {/* Contador opcional */}
                {showCount && tag.count !== undefined && (
                  <span
                    className={cn(
                      "text-xs font-normal",
                      isSelected 
                        ? "text-background/80" 
                        : "text-muted-foreground/70"
                    )}
                  >
                    ({tag.count})
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  )
}

/**
 * Hook helper para gerenciar estado de filtros
 * 
 * @example
 * const { selectedTag, setSelectedTag, filteredData } = useFilterTags(
 *   data,
 *   'all',
 *   (item, tag) => tag === 'all' || item.status === tag
 * )
 */
export function useFilterTags<T>(
  data: T[],
  initialTag: string,
  filterFn: (item: T, tag: string) => boolean
) {
  const [selectedTag, setSelectedTag] = React.useState(initialTag)

  const filteredData = React.useMemo(() => {
    if (selectedTag === 'all') return data
    return data.filter((item) => filterFn(item, selectedTag))
  }, [data, selectedTag, filterFn])

  return {
    selectedTag,
    setSelectedTag,
    filteredData,
  }
}
