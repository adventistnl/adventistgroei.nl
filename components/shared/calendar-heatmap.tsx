"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { useTranslation } from "react-i18next"
import { format, startOfYear, endOfYear, eachDayOfInterval, isBefore, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths, getDay } from "date-fns"
import { ptBR, nl, enUS } from "date-fns/locale"

/**
 * Activity data for a specific date
 */
export interface ActivityData {
  date: Date | string
  count: number
  label?: string
  metadata?: Record<string, any>
}

/**
 * Heatmap cell data structure
 */
interface HeatmapCell {
  x: number
  y: number
  date: Date
  value: number
  color: string
  isHighlighted?: boolean
  activity?: ActivityData
}

/**
 * Custom cell component props
 */
interface CustomCellProps {
  x: number
  y: number
  width: number
  height: number
  cell: HeatmapCell
  rounded: string
  onClick?: (date: Date, activity?: ActivityData) => void
  currentLanguage: string
  dateFnsLocale: any
}

/**
 * Custom cell component similar to MUI approach
 */
function CustomCell({ x, y, width, height, cell, rounded, onClick, currentLanguage, dateFnsLocale }: CustomCellProps) {
  const handleClick = () => {
    onClick?.(cell.date, cell.activity)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={`
              absolute border transition-all duration-200
              ${cell.color}
              ${rounded}
              cursor-pointer
              hover:scale-105 hover:shadow-sm
              disabled:cursor-not-allowed disabled:hover:scale-100
            `}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
            }}
            disabled={!isBefore(cell.date, new Date()) && !isSameDay(cell.date, new Date())}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <div className="font-medium">
              {format(cell.date, 'PPP', { locale: dateFnsLocale })}
            </div>
            <div className="text-muted-foreground">
              {cell.activity?.count || 0} {currentLanguage === 'pt' ? 'atividades' : currentLanguage === 'nl' ? 'activiteiten' : 'activities'}
            </div>
            {cell.activity?.label && (
              <div className="text-muted-foreground">{cell.activity.label}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface CalendarHeatmapProps {
  /**
   * Title of the heatmap
   */
  title?: string
  /**
   * Description text
   */
  description?: string
  /**
   * Array of activity data for each day
   */
  activities?: ActivityData[]
  /**
   * Year to display (defaults to current year)
   */
  year?: number
  /**
   * Maximum activity count for color scaling
   */
  maxActivityCount?: number
  /**
   * Color scheme for the heatmap
   * - 'mono': Monochromatic gray gradient
   * - 'blue': Blue monochromatic gradient
   * - 'green': Green monochromatic gradient
   * - 'purple': Purple monochromatic gradient
   * - 'orange': Orange monochromatic gradient
   */
  colorScheme?: 'mono' | 'blue' | 'green' | 'purple' | 'orange'
  /**
   * Show legend with color scale
   */
  showLegend?: boolean
  /**
   * Show month navigation
   */
  showNavigation?: boolean
  /**
   * Variant: 'full' shows entire year, 'monthly' shows one month at a time
   */
  variant?: 'full' | 'monthly'
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Container size - defines max height
   * - 'sm': 300px max height
   * - 'md': 400px max height
   * - 'lg': 500px max height
   */
  containerSize?: 'sm' | 'md' | 'lg'
  /**
   * Whether the container should have fixed size or be responsive
   * - true: Uses fixed min/max heights
   * - false: Uses responsive heights (default)
   */
  fixedSize?: boolean
  /**
   * Custom className
   */
  className?: string
  /**
   * Locale for date formatting
   */
  locale?: string
  /**
   * Callback when a day is clicked
   */
  onDayClick?: (date: Date, activity?: ActivityData) => void
}

/**
 * Calculate dynamic cell size and grid dimensions
 */
function calculateGridDimensions(
  daysCount: number, 
  containerSize: 'sm' | 'md' | 'lg', 
  viewMode: 'monthly' | 'yearly',
  fixedSize: boolean = false,
  availableWidth?: number,
  availableHeight?: number
): {
  cellSize: number
  gridWidth: number
  gridHeight: number
  cols: number
  rows: number
} {
  // Dimensões base mais conservadoras e responsivas
  const baseDimensions: Record<string, { width: number; height: number }> = {
    sm: { width: 280, height: 200 },
    md: { width: 400, height: 280 },
    lg: { width: 560, height: 360 },
  }
  
  // Use available space or fallback to base dimensions
  const containerWidth = availableWidth || baseDimensions[containerSize].width
  const containerHeight = availableHeight || baseDimensions[containerSize].height
  
  // Padding adaptativo baseado no modo de visualização
  const padding = viewMode === 'monthly' ? 8 : 12
  const gap = 1
  
  let cols: number
  let rows: number
  
  if (viewMode === 'monthly') {
    cols = 7 // 7 days per week
    rows = Math.ceil(daysCount / 7)
  } else {
    // Yearly view - organize by weeks
    cols = 53 // ~53 weeks per year
    rows = 7 // 7 days per week
  }
  
  // Garantir espaço mínimo mas sempre dentro dos limites
  const availWidth = Math.max(containerWidth - padding * 2, 160)
  const availHeight = Math.max(containerHeight - padding * 2, 120)
  
  // Calculate cell size baseado no espaço real disponível
  const maxCellWidth = Math.floor((availWidth - (cols - 1) * gap) / cols)
  const maxCellHeight = Math.floor((availHeight - (rows - 1) * gap) / rows)
  
  // Garantir células quadradas e totalmente responsivas
  const minCellSize = 2
  const maxCellSize = viewMode === 'monthly' ? 24 : (fixedSize ? 20 : 16)
  const cellSize = Math.max(minCellSize, Math.min(maxCellWidth, maxCellHeight, maxCellSize))
  
  // Grid final sempre dentro dos limites do container
  const calculatedGridWidth = cols * cellSize + (cols - 1) * gap
  const calculatedGridHeight = rows * cellSize + (rows - 1) * gap
  
  const gridWidth = Math.min(calculatedGridWidth, availWidth)
  const gridHeight = Math.min(calculatedGridHeight, availHeight)
  
  return {
    cellSize,
    gridWidth,
    gridHeight,
    cols,
    rows,
  }
}

/**
 * Get color intensity class for year completion
 */
function getIntensityClass(count: number, maxCount: number, colorScheme: string, isPast: boolean): string {
  // Dias futuros sempre em cinza claro
  if (!isPast || count === 0) return 'bg-gray-100 border-gray-200 hover:bg-gray-200'
  
  // Dias passados em cor mais forte para mostrar progresso
  const colorMaps = {
    mono: 'bg-gray-600 border-gray-700 hover:bg-gray-700',
    blue: 'bg-blue-500 border-blue-600 hover:bg-blue-600', 
    green: 'bg-green-500 border-green-600 hover:bg-green-600',
    purple: 'bg-purple-500 border-purple-600 hover:bg-purple-600',
    orange: 'bg-orange-500 border-orange-600 hover:bg-orange-600',
  }
  
  return colorMaps[colorScheme as keyof typeof colorMaps] || colorMaps.mono
}

/**
 * Generate heatmap cells data
 */
function generateHeatmapCells(
  daysToDisplay: Date[],
  activityMap: Map<string, ActivityData>,
  calculatedMaxCount: number,
  colorScheme: string,
  gridDims: { cellSize: number; cols: number; rows: number },
  viewMode: 'monthly' | 'yearly'
): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const gap = 1 // Reduced gap for better space utilization
  
  daysToDisplay.forEach((day, index) => {
    let x: number, y: number
    
    if (viewMode === 'monthly') {
      // Monthly: arrange by week rows
      const weekIndex = Math.floor(index / 7)
      const dayIndex = index % 7
      x = dayIndex * (gridDims.cellSize + gap)
      y = weekIndex * (gridDims.cellSize + gap)
    } else {
      // Yearly: arrange by week columns (GitHub style)
      const startOfYearDay = getDay(startOfYear(day))
      const dayOfYear = Math.floor((day.getTime() - startOfYear(day).getTime()) / (1000 * 60 * 60 * 24))
      const weekCol = Math.floor((dayOfYear + startOfYearDay) / 7)
      const dayRow = (dayOfYear + startOfYearDay) % 7
      
      x = weekCol * (gridDims.cellSize + gap)
      y = dayRow * (gridDims.cellSize + gap)
    }
    
    const dateKey = format(day, 'yyyy-MM-dd')
    const activity = activityMap.get(dateKey)
    const isPast = isBefore(day, new Date()) || isSameDay(day, new Date())
    
    cells.push({
      x,
      y,
      date: day,
      value: activity?.count || 0,
      color: getIntensityClass(activity?.count || 0, calculatedMaxCount, colorScheme, isPast),
      activity,
    })
  })
  
  return cells
}

/**
 * Generate year completion data - shows passed days vs future days
 */
function generateYearCompletionData(year: number): ActivityData[] {
  const start = startOfYear(new Date(year, 0, 1))
  const end = endOfYear(new Date(year, 11, 31))
  const days = eachDayOfInterval({ start, end })
  const today = new Date()
  
  return days.map(date => {
    const isPast = isBefore(date, today) || isSameDay(date, today)
    return {
      date,
      count: isPast ? 1 : 0, // 1 for passed days, 0 for future days
      label: isPast ? 'Dia concluído' : 'Dia futuro',
    }
  })
}

export function CalendarHeatmap({
  title,
  description,
  activities,
  year = new Date().getFullYear(),
  maxActivityCount,
  colorScheme = 'mono',
  showLegend = false,
  showNavigation = true,
  variant = 'monthly',
  size = 'md',
  containerSize = 'md',
  fixedSize = false,
  className,
  locale: localeProp,
  onDayClick,
}: CalendarHeatmapProps) {
  const { i18n } = useTranslation()
  
  // Always show yearly view for year progress
  const viewMode = 'yearly'
  
  // Determine locale
  const currentLanguage = localeProp || i18n?.language || 'en'
  const dateFnsLocale = React.useMemo(() => {
    switch (currentLanguage) {
      case 'pt':
      case 'pt-BR':
        return ptBR
      case 'nl':
      case 'nl-NL':
        return nl
      default:
        return enUS
    }
  }, [currentLanguage])

  // Use year completion data if no activities provided
  const activityData = React.useMemo(() => {
    return activities && activities.length > 0 ? activities : generateYearCompletionData(year)
  }, [activities, year])

  // Calculate max activity count for scaling
  const calculatedMaxCount = React.useMemo(() => {
    if (maxActivityCount) return maxActivityCount
    return Math.max(...activityData.map(a => a.count), 1)
  }, [activityData, maxActivityCount])

  // Create activity map for quick lookup
  const activityMap = React.useMemo(() => {
    const map = new Map<string, ActivityData>()
    activityData.forEach(activity => {
      const dateKey = format(new Date(activity.date), 'yyyy-MM-dd')
      map.set(dateKey, activity)
    })
    return map
  }, [activityData])

  // Get days to display - always full year
  const daysToDisplay = React.useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1))
    const end = endOfYear(new Date(year, 11, 31))
    return eachDayOfInterval({ start, end })
  }, [year])

  // Calculate grid dimensions com espaço disponível
  const gridDimensions = React.useMemo(() => {
    return calculateGridDimensions(
      daysToDisplay.length, 
      containerSize, 
      viewMode, 
      fixedSize
    )
  }, [daysToDisplay.length, containerSize, viewMode, fixedSize])

  // Generate heatmap cells
  const heatmapCells = React.useMemo(() => {
    return generateHeatmapCells(
      daysToDisplay,
      activityMap,
      calculatedMaxCount,
      colorScheme,
      gridDimensions,
      viewMode
    )
  }, [daysToDisplay, activityMap, calculatedMaxCount, colorScheme, gridDimensions, viewMode])

  // Size configurations
  const sizeConfig = {
    sm: { rounded: 'rounded', text: 'text-xs' },
    md: { rounded: 'rounded', text: 'text-sm' },
    lg: { rounded: 'rounded', text: 'text-base' },
  }
  const config = sizeConfig[size]

  // Container configuration - totalmente responsivo e adaptável
  const containerConfig = React.useMemo(() => {
    if (fixedSize) {
      return {
        sm: { height: 'h-[240px]', maxWidth: 'w-full max-w-sm', container: 'max-w-sm mx-auto' },
        md: { height: 'h-[300px]', maxWidth: 'w-full max-w-md', container: 'max-w-md mx-auto' },
        lg: { height: 'h-[400px]', maxWidth: 'w-full max-w-lg', container: 'max-w-lg mx-auto' },
      }
    } else {
      return {
        sm: { height: 'h-auto', maxWidth: 'w-full', container: 'w-full' },
        md: { height: 'h-auto', maxWidth: 'w-full', container: 'w-full' },
        lg: { height: 'h-auto', maxWidth: 'w-full', container: 'w-full' },
      }
    }
  }, [fixedSize])
  const containerStyle = containerConfig[containerSize]

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const handleDayClick = (date: Date, activity?: ActivityData) => {
    onDayClick?.(date, activity)
  }

  // Calculate year progress statistics
  const stats = React.useMemo(() => {
    const today = new Date()
    const startOfCurrentYear = startOfYear(new Date(year, 0, 1))
    const endOfCurrentYear = endOfYear(new Date(year, 11, 31))
    const totalDaysInYear = eachDayOfInterval({ start: startOfCurrentYear, end: endOfCurrentYear }).length
    const daysPassed = daysToDisplay.filter(d => isBefore(d, today) || isSameDay(d, today)).length
    const yearProgress = Math.round((daysPassed / totalDaysInYear) * 100)
    const daysRemaining = totalDaysInYear - daysPassed
    
    return {
      daysPassed,
      daysRemaining,
      totalDays: totalDaysInYear,
      yearProgress,
      progressLabel: `${yearProgress}% ${currentLanguage === 'pt' ? 'concluído' : currentLanguage === 'nl' ? 'voltooid' : 'completed'}`
    }
  }, [daysToDisplay, year, currentLanguage])

  return (
    <Card className={`${className} flex justify-between`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className={config.text}>
              {title || (currentLanguage === 'pt' ? 'Progresso Anual' : currentLanguage === 'nl' ? 'Jaarlijkse Voortgang' : 'Year Progress')} {year}
            </CardTitle>
          </div>
        </div>
        {description && (
          <CardDescription className={config.text}>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Heatmap Grid - Container Totalmente Responsivo */}
        <div className={`${containerStyle.height} ${containerStyle.container} relative m-0 overflow-hidden bg-muted/10 rounded-lg p-3`}>
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
              style={{
                maxWidth: `${gridDimensions.gridWidth + 8}px`,
                maxHeight: `${gridDimensions.gridHeight + 8}px`,
              }}
            >
              <div
                className="relative"
                style={{
                  width: `${gridDimensions.gridWidth}px`,
                  height: `${gridDimensions.gridHeight}px`,
                }}
              >
              {heatmapCells.map((cell, index) => (
                <CustomCell
                  key={index}
                  x={cell.x}
                  y={cell.y}
                  width={gridDimensions.cellSize}
                  height={gridDimensions.cellSize}
                  cell={cell}
                  rounded={config.rounded}
                  onClick={handleDayClick}
                  currentLanguage={currentLanguage}
                  dateFnsLocale={dateFnsLocale}
                />
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex items-center justify-between py-3 px-1 bg-muted/5 rounded-md">
            <div className="flex items-center gap-3">
              <span className={`${config.text} text-muted-foreground font-medium`}>
                {currentLanguage === 'pt' ? 'Futuro' : currentLanguage === 'nl' ? 'Toekomst' : 'Future'}
              </span>
              <div className="flex gap-2">
                <div className="w-4 h-4 aspect-square rounded-sm border-2 bg-gray-100 border-gray-200" />
                <div className={`w-4 h-4 aspect-square rounded-sm border-2 ${colorScheme === 'mono' ? 'bg-gray-600 border-gray-700' : colorScheme === 'blue' ? 'bg-blue-500 border-blue-600' : colorScheme === 'green' ? 'bg-green-500 border-green-600' : colorScheme === 'purple' ? 'bg-purple-500 border-purple-600' : 'bg-orange-500 border-orange-600'}`} />
              </div>
              <span className={`${config.text} text-muted-foreground font-medium`}>
                {currentLanguage === 'pt' ? 'Passado' : currentLanguage === 'nl' ? 'Verleden' : 'Past'}
              </span>
            </div>
            
            <div className={`${config.text} text-muted-foreground font-mono`}>
              {Math.round((stats.daysPassed / stats.totalDays) * 100)}% {currentLanguage === 'pt' ? 'completo' : currentLanguage === 'nl' ? 'compleet' : 'complete'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Compact variant - minimal UI, just the heatmap grid
 */
export function CalendarHeatmapCompact({
  activities,
  year = new Date().getFullYear(),
  maxActivityCount,
  colorScheme = 'mono',
  size = 'sm',
  containerSize = 'sm',
  className,
  locale: localeProp,
  onDayClick,
  fixedSize = false,
}: Omit<CalendarHeatmapProps, 'title' | 'description' | 'showLegend' | 'showNavigation' | 'variant'>) {
  const { i18n } = useTranslation()
  
  const currentLanguage = localeProp || i18n?.language || 'en'
  const dateFnsLocale = React.useMemo(() => {
    switch (currentLanguage) {
      case 'pt':
      case 'pt-BR':
        return ptBR
      case 'nl':
      case 'nl-NL':
        return nl
      default:
        return enUS
    }
  }, [currentLanguage])

  const activityData = React.useMemo(() => {
    return activities && activities.length > 0 ? activities : generateMockActivities(year)
  }, [activities, year])

  const calculatedMaxCount = React.useMemo(() => {
    if (maxActivityCount) return maxActivityCount
    return Math.max(...activityData.map(a => a.count), 1)
  }, [activityData, maxActivityCount])

  const activityMap = React.useMemo(() => {
    const map = new Map<string, ActivityData>()
    activityData.forEach(activity => {
      const dateKey = format(new Date(activity.date), 'yyyy-MM-dd')
      map.set(dateKey, activity)
    })
    return map
  }, [activityData])

  const start = startOfYear(new Date(year, 0, 1))
  const end = endOfYear(new Date(year, 11, 31))
  const daysToDisplay = eachDayOfInterval({ start, end })

  // Calculate grid dimensions for yearly view
  const gridDimensions = React.useMemo(() => {
    return calculateGridDimensions(daysToDisplay.length, containerSize, 'yearly', fixedSize)
  }, [daysToDisplay.length, containerSize, fixedSize])

  // Generate heatmap cells for yearly view
  const heatmapCells = React.useMemo(() => {
    return generateHeatmapCells(
      daysToDisplay,
      activityMap,
      calculatedMaxCount,
      colorScheme,
      gridDimensions,
      'yearly'
    )
  }, [daysToDisplay, activityMap, calculatedMaxCount, colorScheme, gridDimensions])

  const sizeConfig = {
    sm: { rounded: 'rounded' },
    md: { rounded: 'rounded-md' },
    lg: { rounded: 'rounded-lg' },
  }
  const config = sizeConfig[size]

  const containerConfig = React.useMemo(() => {
    if (fixedSize) {
      return {
        sm: { height: 'h-[240px]', container: 'max-w-sm mx-auto' },
        md: { height: 'h-[300px]', container: 'max-w-md mx-auto' },
        lg: { height: 'h-[400px]', container: 'max-w-lg mx-auto' },
      }
    } else {
      return {
        sm: { height: 'h-auto', container: 'w-full' },
        md: { height: 'h-auto', container: 'w-full' },
        lg: { height: 'h-auto', container: 'w-full' },
      }
    }
  }, [fixedSize])
  const containerStyle = containerConfig[containerSize]

  const handleDayClick = (date: Date, activity?: ActivityData) => {
    onDayClick?.(date, activity)
  }

  return (
    <div className={`${containerStyle.height} ${containerStyle.container} relative overflow-hidden bg-muted/10 rounded-lg p-4 ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
          style={{
            maxWidth: `${gridDimensions.gridWidth + 8}px`,
            maxHeight: `${gridDimensions.gridHeight + 8}px`,
          }}
        >
          <div
            className="relative"
            style={{
              width: `${gridDimensions.gridWidth}px`,
              height: `${gridDimensions.gridHeight}px`,
            }}
          >
          {heatmapCells.map((cell, index) => (
            <CustomCell
              key={index}
              x={cell.x}
              y={cell.y}
              width={gridDimensions.cellSize}
              height={gridDimensions.cellSize}
              cell={cell}
              rounded={config.rounded}
              onClick={handleDayClick}
              currentLanguage={currentLanguage}
              dateFnsLocale={dateFnsLocale}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
