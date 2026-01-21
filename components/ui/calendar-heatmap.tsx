"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

// Type utilities
type UnionKeys<T> = T extends T ? keyof T : never
type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never
type OneOf<T extends {}[]> = {
  [K in keyof T]: Expand<
    T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>
  >
}[number]

// Types
export type Classname = string
export type WeightedDateEntry = {
  date: Date
  weight: number
}

interface IDatesPerVariant {
  datesPerVariant: Date[][]
}

interface IWeightedDates {
  weightedDates: WeightedDateEntry[]
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> &
  OneOf<[IDatesPerVariant, IWeightedDates]> & {
    variantClassnames: Classname[]
    hideNavigation?: boolean
    compactMode?: boolean
  }

// Internal Components

interface CalendarHeaderProps {
  currentMonth?: Date
  onPreviousMonth?: () => void
  onNextMonth?: () => void
  className?: string
}

function CalendarHeader({ 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth,
  className 
}: CalendarHeaderProps) {
  const monthName = currentMonth 
    ? currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousMonth}
        className="h-7 w-7 p-0"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium px-2">{monthName}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextMonth}
        className="h-7 w-7 p-0"
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface CalendarGridProps {
  children: React.ReactNode
  className?: string
  compactMode?: boolean
}

function CalendarGrid({ children, className, compactMode }: CalendarGridProps) {
  return (
    <div className={cn(
      "calendar-grid-wrapper",
      compactMode ? "scale-90 origin-top-left" : "",
      className
    )}>
      {children}
    </div>
  )
}

function useModifers(variantClassnames: Classname[], datesPerVariant: Date[][]) {
  const modifiers = React.useMemo(() => {
    const modifiers: Record<string, Date[]> = {}
    variantClassnames.forEach((_, i) => {
      modifiers[`variant${i + 1}`] = datesPerVariant[i]
    })
    return modifiers
  }, [variantClassnames, datesPerVariant])

  const modifiersClassNames = React.useMemo(() => {
    const modifiersClassNames: Record<string, string> = {}
    variantClassnames.forEach((classname, i) => {
      modifiersClassNames[`variant${i + 1}`] = classname
    })
    return modifiersClassNames
  }, [variantClassnames])

  return [modifiers, modifiersClassNames] as const
}

function categorizeDatesPerVariant(
  weightedDates: WeightedDateEntry[],
  noOfVariants: number
) {
  const categorizedRecord: Date[][] = Array.from({ length: noOfVariants }, () => [])

  if (weightedDates.length === 0) {
    return categorizedRecord
  }

  const sortedEntries = [...weightedDates].sort((a, b) => a.weight - b.weight)
  const minNumber = sortedEntries[0].weight
  const maxNumber = sortedEntries[sortedEntries.length - 1].weight
  const range = (maxNumber - minNumber + 1) / noOfVariants

  sortedEntries.forEach((entry) => {
    const category = Math.min(
      Math.floor((entry.weight - minNumber) / range),
      noOfVariants - 1
    )
    categorizedRecord[category].push(entry.date)
  })

  return categorizedRecord
}

function CalendarHeatmap({
  variantClassnames,
  datesPerVariant,
  weightedDates,
  className,
  classNames,
  showOutsideDays = true,
  hideNavigation = false,
  compactMode = false,
  ...props
}: CalendarProps) {
  const noOfVariants = variantClassnames.length
  weightedDates = weightedDates ?? []
  datesPerVariant =
    datesPerVariant ?? categorizeDatesPerVariant(weightedDates, noOfVariants)

  const [modifiers, modifiersClassNames] = useModifers(
    variantClassnames,
    datesPerVariant
  )

  return (
    <CalendarGrid compactMode={compactMode} className={className}>
      <style jsx global>{`
        .calendar-grid-wrapper .rdp-month_grid {
          max-width: 100%;
          width: fit-content;
          margin: 0 auto;
        }

        .calendar-grid-wrapper .rdp-month_grid {
          max-width: 100%;
          width: fit-content;
          margin: 0 auto;
        }
        
        .calendar-grid-wrapper .rdp-month {
          max-width: 100%;
        }
        
        .calendar-grid-wrapper .rdp-month_caption {
          max-width: 100%;
          justify-content: center;
        }
        
        .calendar-grid-wrapper .rdp-weekdays {
          width: 100%;
          display: flex;

          justify-content: space-between;
    
        }

        .calendar-grid-wrapper .rdp-weekdays .rdp-weekday{
            display: flex;
            justify-content: center;
            flex:1;
            font-size:14px;
            opacity:0.8
        }
        
        .calendar-grid-wrapper .rdp-week {
          max-width: 100%;

        }
      `}</style>
      <DayPicker
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        showOutsideDays={showOutsideDays}
        className={cn("p-2 sm:p-3 max-w-full")}
        classNames={{
          months: "flex flex-col items-center space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-2 flex flex-col items-center",
          caption: cn(
            "flex justify-center pt-1 pb-2 relative items-center min-h-[2.5rem]",
            hideNavigation && "pointer-events-none"
          ),
          caption_label: "text-xs sm:text-sm font-medium px-1",
          nav: cn(
            "space-x-1 flex items-center",
            hideNavigation && "hidden"
          ),
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10"
          ),
          nav_button_previous: "absolute left-0 top-1",
          nav_button_next: "absolute right-0 top-1",
          table: "w-full border-collapse",
          head_row: "flex gap-2",
          head_cell: cn(
            "text-muted-foreground rounded-md font-normal flex items-center justify-center",
            compactMode ? "w-7 h-7 text-[0.6rem]" : "w-8 h-8 sm:w-9 sm:h-9 text-[0.6rem] sm:text-[0.65rem]"
          ),
          row: "flex w-full gap-2",
          cell: cn(
            "text-center text-sm p-0 relative rounded-sm",
            compactMode ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9",
            "[&:has([aria-selected].day-range-end)]:rounded-r-md",
            "[&:has([aria-selected].day-outside)]:bg-accent/50",
            "[&:has([aria-selected])]:bg-accent",
            "first:[&:has([aria-selected])]:rounded-l-md",
            "last:[&:has([aria-selected])]:rounded-r-md",
            "focus-within:relative focus-within:z-20"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            compactMode ? "h-7 w-7 text-[0.7rem]" : "h-8 w-8 sm:h-9 sm:w-9",
            "p-0 font-normal aria-selected:opacity-100 rounded-sm"
          ),
          day_range_end: "day-range-end",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </CalendarGrid>
  )
}

CalendarHeatmap.displayName = "CalendarHeatmap"

// Auxiliary Components for Legend
interface CalendarLegendProps {
  variantClassnames: Classname[]
  labels?: {
    less?: string
    more?: string
  }
  className?: string
  compactMode?: boolean
}

function CalendarLegend({ 
  variantClassnames, 
  labels = { less: 'Less', more: 'More' },
  className,
  compactMode = false
}: CalendarLegendProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-muted-foreground",
      compactMode ? "text-[0.65rem]" : "text-xs",
      className
    )}>
      <span>{labels.less}</span>
      <div className="flex gap-1">
        <div 
          className={cn(
            "bg-muted border border-border rounded-sm",
            compactMode ? "w-2.5 h-2.5" : "w-3 h-3"
          )}
          title="No activity" 
        />
        {variantClassnames.map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-sm",
              compactMode ? "w-2.5 h-2.5" : "w-3 h-3",
              index === 0 && "bg-teal-400 dark:bg-teal-500",
              index === 1 && "bg-teal-600 dark:bg-teal-600",
              index === 2 && "bg-teal-800 dark:bg-teal-700"
            )}
            title={`${index === 0 ? 'Low' : index === 1 ? 'Medium' : 'High'} activity`}
          />
        ))}
      </div>
      <span>{labels.more}</span>
    </div>
  )
}

CalendarLegend.displayName = "CalendarLegend"

export { CalendarHeatmap, CalendarHeader, CalendarGrid, CalendarLegend }
