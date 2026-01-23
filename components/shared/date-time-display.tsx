"use client"

import React, { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DateTimeDisplayProps {
  /**
   * Custom className for the container
   */
  className?: string
  
  /**
   * Show seconds in time display
   */
  showSeconds?: boolean
  
  /**
   * Locale for date formatting (default: 'en-US')
   */
  locale?: string
  
  /**
   * Timezone (default: user's local timezone)
   */
  timezone?: string
}

/**
 * DateTimeDisplay Component
 * 
 * Displays current date, time, and year progress information.
 * 
 * Left side: Day of week, date, and current time
 * Right side: Days remaining in month, current year, and year progress pie chart
 * 
 * @example
 * ```tsx
 * <DateTimeDisplay locale="pt-BR" showSeconds={false} />
 * ```
 */
export function DateTimeDisplay({
  className,
  showSeconds = false,
  locale = "en-US",
  timezone
}: DateTimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format date parts
  const dayOfWeek = currentTime.toLocaleDateString(locale, { 
    weekday: 'long',
    timeZone: timezone 
  })
  
  const month = currentTime.toLocaleDateString(locale, { 
    month: 'short',
    timeZone: timezone 
  })
  
  const day = currentTime.toLocaleDateString(locale, { 
    day: 'numeric',
    timeZone: timezone 
  })
  
  const year = currentTime.toLocaleDateString(locale, { 
    year: 'numeric',
    timeZone: timezone 
  })

  // Format time
  const timeString = currentTime.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    timeZone: timezone,
    hour12: false
  })

  // Calculate days remaining in month
  const lastDayOfMonth = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth() + 1,
    0
  ).getDate()
  
  const currentDay = currentTime.getDate()
  const daysRemainingInMonth = lastDayOfMonth - currentDay

  // Calculate year progress
  const startOfYear = new Date(currentTime.getFullYear(), 0, 1)
  const endOfYear = new Date(currentTime.getFullYear(), 11, 31, 23, 59, 59)
  const totalYearMs = endOfYear.getTime() - startOfYear.getTime()
  const elapsedYearMs = currentTime.getTime() - startOfYear.getTime()
  const yearProgress = Math.min(Math.max((elapsedYearMs / totalYearMs) * 100, 0), 100)

  // SVG Pie Chart
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (yearProgress / 100) * circumference

  return (
    <Card className={cn("p-3 sm:p-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
        {/* Left Side - Current Date & Time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-foreground">
                {dayOfWeek}
              </span>
              <span className="text-xs text-muted-foreground">
                {month} {day}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-base sm:text-lg font-bold font-mono tabular-nums">
              {timeString}
            </span>
          </div>
        </div>

        {/* Right Side - Month & Year Progress */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* Days Remaining & Year */}
          <div className="text-left sm:text-right">
            <div className="flex items-center sm:justify-end gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {daysRemainingInMonth} {daysRemainingInMonth === 1 ? 'day' : 'days'} left
              </Badge>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {year}
            </div>
          </div>

          {/* Year Progress Pie Chart */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg 
              width="45" 
              height="45" 
              viewBox="0 0 50 50"
              className="transform -rotate-90 sm:w-[50px] sm:h-[50px]"
            >
              {/* Background circle - subtle in both modes */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-muted-foreground/20"
              />
              
              {/* Progress circle - vibrant with gradient effect */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="text-primary transition-all duration-500 ease-out dark:text-primary/90"
                style={{
                  filter: 'drop-shadow(0 0 2px hsl(var(--primary) / 0.5))'
                }}
              />
            </svg>
            
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-foreground tabular-nums">
                {Math.round(yearProgress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Compact variant - Single line display
 */
export function DateTimeDisplayCompact({
  className,
  showSeconds = false,
  locale = "en-US",
  timezone
}: DateTimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatted = currentTime.toLocaleDateString(locale, { 
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone 
  })
  
  const timeString = currentTime.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    timeZone: timezone,
    hour12: false
  })

  const startOfYear = new Date(currentTime.getFullYear(), 0, 1)
  const endOfYear = new Date(currentTime.getFullYear(), 11, 31, 23, 59, 59)
  const totalYearMs = endOfYear.getTime() - startOfYear.getTime()
  const elapsedYearMs = currentTime.getTime() - startOfYear.getTime()
  const yearProgress = Math.min(Math.max((elapsedYearMs / totalYearMs) * 100, 0), 100)

  return (
    <div className={cn("flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm", className)}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
        <span className="font-mono font-semibold">{timeString}</span>
      </div>
      
      <div className="hidden sm:block h-4 w-px bg-border" />
      
      <span className="text-muted-foreground">{formatted}</span>
      
      <div className="hidden sm:block h-4 w-px bg-border" />
      
      <Badge variant="outline" className="text-xs whitespace-nowrap">
        {Math.round(yearProgress)}% of {currentTime.getFullYear()}
      </Badge>
    </div>
  )
}
