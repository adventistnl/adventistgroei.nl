"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { format } from "date-fns"
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  History,
  Building,
  RefreshCw,
  Clock,
  User,
  ExternalLink,
  ArrowRightLeft,
  Wallet,
  X,
  Calendar as CalendarIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dynamic from "next/dynamic"
const Calendar = dynamic(
  () => import("@/components/ui/calendar").then(m => m.Calendar),
  { ssr: false, loading: () => <div className="p-4 text-sm text-muted-foreground">Loading calendar...</div> }
)
import { useCurrency } from "@/contexts/currency-context"
import { useInstitution } from "@/contexts/institution-context"
import { useLedgerHistory, useAvailableYears } from "@/hooks/graphql/use-annual-budget-queries"
import { UseTable } from "@/components/ui/use-table"
import { ColumnDef } from "@tanstack/react-table"
import { YearFilter } from "@/components/shared/year-filter"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"
import { startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { type DateRange } from "react-day-picker"

/**
 * PÁGINA DE HISTÓRICO DO LIVRO RAZÃO (LEDGER HISTORY)
 * Interface para visualização detalhada de todas as movimentações financeiras.
 */
export default function LedgerHistoryPage() {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { currentInstitutionData } = useInstitution()

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [globalSearch, setGlobalSearch] = useState("")
  const [localSearch, setLocalSearch] = useState("")

  // Table pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  })

  // Debounce global search to improve typing fluidity
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalSearch(localSearch)
      setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch])

  const [filters, setFilters] = useState<{
    departmentName: string;
    type: string;
    dateRange: DateRange | undefined;
  }>({
    departmentName: "all",
    type: "all",
    dateRange: undefined
  })

  // 1. Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [filters, selectedYear])

  // Reset dateRange when year changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, dateRange: undefined }))
  }, [selectedYear])

  // Hook para buscar anos disponíveis
  const { data: availableYearsData } = useAvailableYears()

  const availableYears = useMemo(() => {
    if (availableYearsData?.annualBudgets) {
      return Array.from(new Set(availableYearsData.annualBudgets.map((b: { year: number }) => b.year)))
        .sort((a: number, b: number) => b - a)
    }
    return [new Date().getFullYear()]
  }, [availableYearsData])

  // Helper to generate absolute UTC boundaries to prevent timezone shifting
  const getUtcBoundaries = (range?: DateRange) => {
    if (!range?.from) return { startDate: undefined, endDate: undefined }
    
    // start of day UTC
    const startDate = new Date(Date.UTC(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), 0, 0, 0))
    
    const toDate = range.to || range.from
    // end of day UTC
    const endDate = new Date(Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59, 999))
    
    return { startDate, endDate }
  }

  const { startDate, endDate } = getUtcBoundaries(filters.dateRange)

  // Hook principal - Paginated backend request
  const { data, loading, refetch } = useLedgerHistory({
    year: selectedYear,
    institutionId: currentInstitutionData?.id,
    departmentId: filters.departmentName !== "all" ? filters.departmentName : undefined,
    type: filters.type !== "all" ? filters.type : undefined,
    search: globalSearch || undefined,
    startDate,
    endDate,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize
  }, {
    skip: !currentInstitutionData?.id,
  })

  // Frontend caching to prevent table skeleton flicker while typing/paginating
  const [cachedData, setCachedData] = useState<{ items: any[], totalCount: number, pageCount: number }>({
    items: [],
    totalCount: 0,
    pageCount: 0
  })

  // Update cache when data arrives
  useEffect(() => {
    if (data?.ledgerHistory && !loading) {
      setCachedData({
        items: data.ledgerHistory.items || [],
        totalCount: data.ledgerHistory.totalCount || 0,
        pageCount: data.ledgerHistory.pageInfo?.totalPages || 0
      })
    }
  }, [data, loading])

  // Export full logic can be handled here - we export what is in cache, or theoretically perform a lazy fetch.
  // We will export cached for now, allowing backend to filter.
  const ledgerHistoryData = cachedData.items

  usePageTitle({
    title: t('budget.history.title', 'Financial Ledger History')
  })

  const handleRefresh = async () => {
    const refreshToast = toast.loading(t('budget.messages.refreshing', 'Refreshing data...'))
    try {
      await refetch()
      toast.success(t('budget.messages.refresh_success', 'Data refreshed successfully'))
    } catch (e) {
      toast.error(t('budget.messages.refresh_error', 'Failed to refresh data'))
    } finally {
      toast.dismiss(refreshToast)
    }
  }

  const handleExportCSV = async () => {
    const exportToast = toast.loading(t('budget.history.exporting', 'Preparing export...'))
    
    try {
      const entriesToExport = ledgerHistoryData

      if (!entriesToExport || entriesToExport.length === 0) {
        toast.error(t('budget.history.export_error_empty', 'No data to export'))
        return
      }

      // Cabeçalhos
      const headers = [
        t('budget.history.table.date', 'Date'),
        t('budget.history.table.type', 'Type'),
        t('budget.history.table.entity', 'Entity'),
        t('budget.history.table.description', 'Description'),
        t('budget.history.table.created_by_name', 'Created By'),
        t('budget.history.table.created_by', 'Email'),
        t('budget.history.table.amount', 'Amount')
      ]

      const rows = entriesToExport.map((entry: LedgerHistoryEntry) => {
        const date = format(new Date(entry.date), "dd/MM/yyyy HH:mm")
        const type = t(`budget.history.types.${entry.type.toLowerCase()}`, entry.type.replace(/_/g, ' '))
        const entity = entry.entityName || ''
        const description = `"${(entry.description || '').replace(/"/g, '""')}"`
        const creatorName = entry.createdByName || ''
        const creatorEmail = entry.createdBy || ''
        const amount = entry.amount.toString().replace('.', ',')

        return [date, type, entity, description, creatorName, creatorEmail, amount].join(',')
      })

      const csvContent = [headers.join(','), ...rows].join('\n')
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `ledger-history-${selectedYear}.csv`)
      link.click()
      URL.revokeObjectURL(url)

      toast.success(t('budget.history.export_success', 'CSV exported successfully'))
    } catch (e) {
      toast.error(t('budget.history.export_error', 'Failed to export CSV'))
    } finally {
      toast.dismiss(exportToast)
    }
  }

  const columns: ColumnDef<LedgerHistoryEntry>[] = [
    {
      accessorKey: "date",
      header: t('budget.history.table.date', 'Date'),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {format(new Date(row.original.date), "dd/MM/yyyy")}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono uppercase">
            <Clock className="w-3 h-3" />
            {format(new Date(row.original.date), "HH:mm")}
          </span>
        </div>
      )
    },
    {
      accessorKey: "category",
      id: "category",
      header: () => null,
      cell: () => null,
      enableHiding: true,
    },
    {
      accessorKey: "type",
      header: t('budget.history.table.type', 'Type'),
      cell: ({ row }) => {
        const type = row.original.type
        const category = row.original.category

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {category === 'TRANSFER' ? (
                <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
              ) : (
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                  <Wallet className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                </div>
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {category}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {t(`budget.history.types.${type.toLowerCase()}`, type.replace(/_/g, ' '))}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "entityName",
      header: t('budget.history.table.entity', 'Entity'),
      cell: ({ row }) => {
        // Parse KEY|value format from backend (e.g. "PROJECT|My Campaign")
        const formatRelatedEntity = (raw: string | null | undefined) => {
          if (!raw) return null
          const sep = raw.indexOf('|')
          if (sep === -1) return raw // legacy plain string fallback
          const key = raw.substring(0, sep)
          const value = raw.substring(sep + 1)
          const keyMap: Record<string, string> = {
            PROJECT:     t('budget.history.table.related_project', 'Project'),
            SUBSIDY:     t('budget.history.table.related_subsidy', 'Subsidy'),
            DESTINATION: t('budget.history.table.related_destination', 'Destination'),
            ORIGIN:      t('budget.history.table.related_origin', 'Origin'),
          }
          return `${keyMap[key] ?? key}: ${value}`
        }

        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Building className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {row.original.entityName}
              </span>
            </div>
            {row.original.relatedEntity && (
              <div className="flex items-center gap-1 opacity-70">
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs italic">
                  {formatRelatedEntity(row.original.relatedEntity)}
                </span>
              </div>
            )}
          </div>
        )
      }
    },

    {
      accessorKey: "description",
      header: t('budget.history.table.description', 'Description'),
      cell: ({ row }) => (
        <div className="group relative py-1">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-normal min-w-[200px]" title={row.original.description}>
            {row.original.description}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <User className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground break-all">
              {row.original.createdByName
                ? <>{row.original.createdByName} <span className="opacity-60">({row.original.createdBy})</span></>
                : row.original.createdBy
              }
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">{t('budget.history.table.amount', 'Amount')}</div>,
      cell: ({ row }) => {
        const amount = row.original.amount
        const isPositive = amount > 0
        return (
          <div className="text-right">
            <div className={`text-sm font-black tracking-tight ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isPositive ? "+" : ""}{formatCurrency(amount)}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8">

        {/* Header Section - Matched with Annual Budget */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('budget.history.title', 'Financial Ledger History')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('budget.history.subtitle', 'Follow all your organization\'s financial movements')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <YearFilter
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />

            <Separator orientation="vertical" className="h-8" />

            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              {t('budget.history.export_csv', 'Export CSV')}
            </Button>
          </div>
        </div>
        {/* Filters Bar */}
        <Card className="p-4 border-2 text-foreground bg-background">
          <div className="flex flex-col gap-3">

            {/* Search — always full width */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('budget.history.table.search_placeholder', 'Search description, entity or user...')}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-primary transition-colors text-foreground bg-background"
              />
            </div>

            {/* Filter fields — responsive grid, each field fills its cell */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">

              {/* Date range */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal border-slate-200 bg-background text-foreground",
                      !filters.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {filters.dateRange?.from ? (
                        filters.dateRange.to ? (
                          <>{format(filters.dateRange.from, "dd/MM/yy")} – {format(filters.dateRange.to, "dd/MM/yy")}</>
                        ) : (
                          format(filters.dateRange.from, "dd/MM/yy")
                        )
                      ) : (
                        t('budget.history.filter_date', 'Filter by date')
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(v) => setFilters(prev => ({ ...prev, dateRange: v }))}
                    numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2}
                  />
                </PopoverContent>
              </Popover>

              {/* Entity */}
              <Select
                value={filters.departmentName}
                onValueChange={(v) => setFilters(prev => ({ ...prev, departmentName: v }))}
              >
                <SelectTrigger className="w-full h-10 border-slate-200 bg-background text-foreground">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <SelectValue placeholder={t('budget.history.table.entity', 'Entity')} />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground">
                  <SelectItem value="all">{t('budget.history.all_entities', 'All Entities')}</SelectItem>
                  {Array.from(new Set(ledgerHistoryData.map((e: LedgerHistoryEntry) => e.entityName))).filter(Boolean).sort().map((name: string | undefined) => (
                    name ? <SelectItem key={name} value={name}>{name}</SelectItem> : null
                  ))}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select
                value={filters.type}
                onValueChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger className="w-full h-10 border-slate-200 bg-background text-foreground">
                  <div className="flex items-center gap-2 min-w-0">
                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <SelectValue placeholder={t('budget.history.filter_type', 'Type')} />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground">
                  <SelectItem value="all">{t('budget.history.all_types', 'All Types')}</SelectItem>
                  <SelectItem value="TRANSACTION">{t('budget.history.categories.transaction', 'Department Transactions')}</SelectItem>
                  <SelectItem value="TRANSFER">{t('budget.history.categories.transfer', 'Institutional Transfers')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear filters */}
              {(filters.departmentName !== "all" || filters.type !== "all" || localSearch || filters.dateRange) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters({ departmentName: "all", type: "all", dateRange: undefined })
                    setLocalSearch("")
                  }}
                  className="w-full h-10 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('budget.history.clear_filters', 'Clear')}
                </Button>
              )}
            </div>
          </div>
        </Card>



        {/* Main Ledger Table */}
        <Card>
          <CardContent className="p-0">
            {loading && cachedData.items.length === 0 ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className={loading ? "opacity-50 pointer-events-none transition-opacity duration-200 relative" : "transition-opacity duration-200 relative"}>
                <UseTable
                  columns={columns}
                  data={ledgerHistoryData}
                  showSearch={false}
                  manualPagination={true}
                  pageCount={cachedData.pageCount}
                  totalCount={cachedData.totalCount}
                  paginationState={pagination}
                  onPaginationChange={(p) => {
                    const newPagination = typeof p === 'function' ? p(pagination) : p;
                    setPagination(newPagination);
                  }}
                  translations={{
                    rowsPerPage: t('budget.history.table.rows_per_page', 'Rows per page'),
                    showingResults: (from, to, total) => t('budget.history.table.showing_results', { from, to, total, defaultValue: `Showing ${from} to ${to} of ${total} results` }),
                    previous: t('budget.buttons.previous', 'Previous'),
                    next: t('budget.buttons.next', 'Next'),
                    noResults: t('budget.history.empty', 'No ledger entries found'),
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
