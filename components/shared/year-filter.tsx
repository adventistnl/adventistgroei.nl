"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export interface YearFilterProps {
  /**
   * List of available years to display
   */
  availableYears: number[]
  
  /**
   * Currently selected year
   */
  selectedYear: number
  
  /**
   * Callback when year is selected
   */
  onYearChange: (year: number) => void
  
  /**
   * Callback when new year is added
   */
  onAddYear?: (year: number) => void
  
  /**
   * Whether to show the "Add Year" button
   * @default true
   */
  showAddButton?: boolean
  
  /**
   * Maximum allowed year (inclusive)
   * @default current year + 2
   */
  maxAllowedYear?: number
  
  /**
   * Custom className for the container
   */
  className?: string
}

/**
 * YearFilter Component
 * 
 * A reusable year filter component that displays available years as buttons
 * and allows adding new years within a specified range.
 * 
 * @example
 * ```tsx
 * const [years, setYears] = useState([2024, 2023, 2022])
 * const [selected, setSelected] = useState(2024)
 * 
 * <YearFilter
 *   availableYears={years}
 *   selectedYear={selected}
 *   onYearChange={setSelected}
 *   onAddYear={(newYear) => setYears([...years, newYear])}
 * />
 * ```
 */
export function YearFilter({
  availableYears,
  selectedYear,
  onYearChange,
  onAddYear,
  showAddButton = true,
  maxAllowedYear,
  className = ""
}: YearFilterProps) {
  const currentYear = new Date().getFullYear()
  const defaultMaxYear = currentYear + 2
  const maxYear = maxAllowedYear ?? defaultMaxYear
  const canAddMore = Math.max(...availableYears) < maxYear

  const handleAddYear = () => {
    if (!onAddYear) return

    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxYear) {
      toast.error(`Cannot add years beyond ${maxYear}`)
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(`Year ${nextYear} already exists`)
      return
    }

    onAddYear(nextYear)
    toast.success(`Year ${nextYear} added successfully`)
  }

  return (
    <div 
      className={`flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth ${className}`}
      style={{ scrollbarWidth: 'thin' }}
    >
      {availableYears.map((year) => (
        <Button
          key={year}
          variant="outline"
          size="sm"
          onClick={() => onYearChange(year)}
          className={`
            flex-shrink-0 min-w-[80px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
            ${
              selectedYear === year 
                ? 'bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground border-muted hover:bg-muted/80 hover:text-foreground hover:border-muted-foreground/50'
            }
          `}
        >
          {year}
        </Button>
      ))}
      
      {showAddButton && onAddYear && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddYear}
          disabled={!canAddMore}
          className={`
            flex-shrink-0 min-w-[100px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
            ${
              canAddMore 
                ? 'border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/50' 
                : 'opacity-40 cursor-not-allowed border-dashed border-muted-foreground/20 text-muted-foreground/50'
            }
          `}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Year
        </Button>
      )}
    </div>
  )
}
