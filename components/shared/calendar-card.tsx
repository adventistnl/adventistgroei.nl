"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Info } from "lucide-react"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import { ptBR, nl, enUS } from "date-fns/locale"

interface CalendarCardProps {
  /**
   * Title of the calendar card
   */
  title?: string
  /**
   * Description text below the title
   */
  description?: string
  /**
   * Initial selected date
   */
  defaultDate?: Date
  /**
   * Callback when date changes
   */
  onDateChange?: (date: Date | undefined) => void
  /**
   * Show selected date badge
   */
  showSelectedDateBadge?: boolean
  /**
   * Show month/year dropdowns for faster navigation
   */
  showDropdowns?: boolean
  /**
   * Custom className for the card
   */
  className?: string
  /**
   * Custom className for the calendar
   */
  calendarClassName?: string
  /**
   * Disable dates before this date
   */
  disableBefore?: Date
  /**
   * Disable dates after this date
   */
  disableAfter?: Date
  /**
   * Show footer with additional info
   */
  showFooter?: boolean
  /**
   * Custom footer content
   */
  footerContent?: React.ReactNode
  /**
   * Locale for date formatting
   */
  locale?: string
}

export function CalendarCard({
  title,
  description,
  defaultDate = new Date(),
  onDateChange,
  showSelectedDateBadge = true,
  showDropdowns = true,
  className,
  calendarClassName,
  disableBefore,
  disableAfter,
  showFooter = false,
  footerContent,
  locale: localeProp
}: CalendarCardProps) {
  const { i18n } = useTranslation()
  const [date, setDate] = React.useState<Date | undefined>(defaultDate)

  // Determine locale for date-fns
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

  const handleDateChange = React.useCallback((newDate: Date | undefined) => {
    setDate(newDate)
    onDateChange?.(newDate)
  }, [onDateChange])

  // Format selected date for display
  const formattedDate = React.useMemo(() => {
    if (!date) return null
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: dateFnsLocale })
  }, [date, dateFnsLocale])

  // Calculate disabled dates function
  const disabledDates = React.useMemo(() => {
    if (!disableBefore && !disableAfter) return undefined
    
    return (date: Date) => {
      if (disableBefore && date < disableBefore) return true
      if (disableAfter && date > disableAfter) return true
      return false
    }
  }, [disableBefore, disableAfter])

  return (
      <CardContent className="flex flex-col bg-card text-card-foregroundflex rounded-xl p-4 border shadow-sm h-full flex flex-col">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <CardTitle >
                    {title}
                </CardTitle>
                </div>
            </div>
            {description && (
                <CardDescription >
                {description}
                </CardDescription>
            )}
        </CardHeader>

        {/* Calendar Component */}
        <div className="w-full flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className={`rounded-md  max-w-full ${calendarClassName || ''}`}
            captionLayout={showDropdowns ? "dropdown" : "buttons"}
            locale={dateFnsLocale}
            disabled={disabledDates}
            fromYear={1900}
            toYear={new Date().getFullYear() + 10}
          />
        </div>
      </CardContent>
  )
}

/**
 * Compact variant without Card wrapper - just the Calendar
 */
export function CalendarCompact({
  defaultDate = new Date(),
  onDateChange,
  showDropdowns = true,
  className,
  disableBefore,
  disableAfter,
  locale: localeProp
}: Omit<CalendarCardProps, 'title' | 'description' | 'showSelectedDateBadge' | 'showFooter' | 'footerContent' | 'calendarClassName'> & {
  className?: string
}) {
  const { i18n } = useTranslation()
  const [date, setDate] = React.useState<Date | undefined>(defaultDate)

  // Determine locale for date-fns
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

  const handleDateChange = React.useCallback((newDate: Date | undefined) => {
    setDate(newDate)
    onDateChange?.(newDate)
  }, [onDateChange])

  // Calculate disabled dates function
  const disabledDates = React.useMemo(() => {
    if (!disableBefore && !disableAfter) return undefined
    
    return (date: Date) => {
      if (disableBefore && date < disableBefore) return true
      if (disableAfter && date > disableAfter) return true
      return false
    }
  }, [disableBefore, disableAfter])

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateChange}
      className={`rounded-md border shadow-sm ${className || ''}`}
      captionLayout={showDropdowns ? "dropdown" : "buttons"}
      locale={dateFnsLocale}
      disabled={disabledDates}
      fromYear={1900}
      toYear={new Date().getFullYear() + 10}
    />
  )
}
