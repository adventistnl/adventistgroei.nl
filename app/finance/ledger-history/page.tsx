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
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [filters, setFilters] = useState({
    departmentName: "all",
    type: "all"
  })

  usePageTitle({
    title: t('budget.history.title', 'Financial Ledger History')
  })

  // Hook para buscar anos disponíveis
  const { data: availableYearsData } = useAvailableYears()

  const availableYears = useMemo(() => {
    if (availableYearsData?.annualBudgets) {
      return Array.from(new Set(availableYearsData.annualBudgets.map((b: any) => b.year)))
        .sort((a: any, b: any) => b - a)
    }
    return [new Date().getFullYear()]
  }, [availableYearsData])

  // Hook principal - busca dados da instituição
  const { data, loading, refetch } = useLedgerHistory({
    year: selectedYear,
    institutionId: currentInstitutionData?.id,
  }, {
    skip: !currentInstitutionData?.id
  })

  // 1. Filtragem Global (Aplicada ANTES dos KPIs e da Tabela)
  const filteredEntries = useMemo(() => {
    let entries = data?.ledgerHistory || []

    // Filtro por Departamento (Busca por nome na lista flat)
    if (filters.departmentName !== "all") {
      entries = entries.filter((e: any) => e.entityName === filters.departmentName)
    }

    // Filtro por Tipo de Categoria (TRANSACTION vs TRANSFER)
    if (filters.type !== "all") {
      entries = entries.filter((e: any) => e.category === filters.type)
    }

    // Busca Global
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      entries = entries.filter((e: any) =>
        e.description?.toLowerCase().includes(search) ||
        e.entityName?.toLowerCase().includes(search) ||
        e.createdBy?.toLowerCase().includes(search) ||
        e.relatedEntity?.toLowerCase().includes(search)
      )
    }

    return entries
  }, [data, filters, globalSearch])

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

  const columns: ColumnDef<any>[] = [
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
      header: t('history.table.type', 'Type'),
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
      cell: ({ row }) => (
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
                {row.original.relatedEntity}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: "description",
      header: t('budget.history.table.description', 'Description'),
      cell: ({ row }) => (
        <div className="group relative py-1">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-normal min-w-[200px]" title={row.original.description}>
            {row.original.description}
          </p>
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <User className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground italic break-all">
              By: {row.original.createdBy}
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
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        {/* Filters Bar - Styled as Card for better consistency */}
        <Card className="p-4 border-2">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('budget.history.table.search_placeholder', 'Search description, entity or user...')}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Select
                value={filters.departmentName}
                onValueChange={(v) => setFilters(prev => ({ ...prev, departmentName: v }))}
              >
                <SelectTrigger className="w-[300px] h-10 border-slate-200 bg-background">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder={t('budget.history.table.entity', 'Entity')} />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">{t('budget.history.all_entities', 'All Entities')}</SelectItem>
                  {Array.from(new Set((data?.ledgerHistory || []).map((e: any) => e.entityName))).sort().map((name: string) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger className="w-[300px] h-10 border-slate-200 bg-background">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder={t('budget.history.filter_type', 'Type')} />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">{t('budget.history.all_types', 'All Types')}</SelectItem>
                  <SelectItem value="TRANSACTION">{t('budget.history.categories.transaction', 'Department Transactions')}</SelectItem>
                  <SelectItem value="TRANSFER">{t('budget.history.categories.transfer', 'Institutional Transfers')}</SelectItem>
                </SelectContent>
              </Select>

              {(filters.departmentName !== "all" || filters.type !== "all" || globalSearch) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters({ departmentName: "all", type: "all" })
                    setGlobalSearch("")
                  }}
                  className="h-10 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <UseTable
                columns={columns}
                data={filteredEntries}
                showSearch={false}
                translations={{
                  rowsPerPage: t('budget.history.table.rows_per_page', 'Rows per page'),
                  showingResults: (from, to, total) => t('budget.history.table.showing_results', { from, to, total, defaultValue: `Showing ${from} to ${to} of ${total} results` }),
                  previous: t('budget.buttons.previous', 'Previous'),
                  next: t('budget.buttons.next', 'Next'),
                  noResults: t('budget.history.empty', 'No ledger entries found'),
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
