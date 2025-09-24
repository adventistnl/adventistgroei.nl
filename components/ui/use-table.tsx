"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { 
  ChevronDown, 
  ChevronRight,
  Search, 
  Settings2, 
  X
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface FilterConfig {
  id: string
  title: string
  options: { label: string; value: string }[]
}

interface UseTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  filters?: FilterConfig[]
  searchKey?: string
  className?: string
  onRowClick?: (row: TData) => void
}

export function UseTable<TData, TValue>({
  data,
  columns,
  filters = [],
  searchKey = "name",
  className = "",
  onRowClick,
}: UseTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    // Inicializar com todas as colunas visíveis por padrão
    const initialVisibility: VisibilityState = {}
    
    columns.forEach((column) => {
      if (column.id) {
        initialVisibility[column.id] = true
      }
    })
    return initialVisibility
  })
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        ...columnVisibility,
        // Ocultar colunas progressivamente em telas menores
        // Em mobile (sm): apenas primeira coluna + select + actions
        // Em tablet (md): primeira + segunda coluna + select + actions
        // Em desktop (lg+): todas as colunas
      },
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Hook para gerenciar visibilidade responsiva das colunas
  React.useEffect(() => {
    const updateColumnVisibility = () => {
      const newVisibility = { ...columnVisibility }
      const dataColumns = columns.filter(col => col.id && col.id !== 'select' && col.id !== 'actions')
      
      if (window.innerWidth < 480) {
        // Mobile muito pequeno: apenas actions (sem colunas de dados)
        dataColumns.forEach((col) => {
          newVisibility[col.id!] = false
        })
      } else if (window.innerWidth < 640) {
        // Mobile pequeno: apenas primeira coluna de dados
        dataColumns.forEach((col, index) => {
          newVisibility[col.id!] = index === 0
        })
      } else if (window.innerWidth < 768) {
        // Mobile grande: primeira e segunda coluna
        dataColumns.forEach((col, index) => {
          newVisibility[col.id!] = index <= 1
        })
      } else if (window.innerWidth < 1024) {
        // Tablet: primeira, segunda e terceira coluna
        dataColumns.forEach((col, index) => {
          newVisibility[col.id!] = index <= 2
        })
      } else if (window.innerWidth < 1280) {
        // Desktop pequeno: primeira, segunda, terceira e quarta coluna
        dataColumns.forEach((col, index) => {
          newVisibility[col.id!] = index <= 3
        })
      } else {
        // Desktop grande: todas as colunas
        dataColumns.forEach((col) => {
          newVisibility[col.id!] = true
        })
      }
      
      setColumnVisibility(newVisibility)
    }

    updateColumnVisibility()
    window.addEventListener('resize', updateColumnVisibility)
    
    return () => window.removeEventListener('resize', updateColumnVisibility)
  }, [columns])

  const clearFilters = () => {
    setGlobalFilter("")
    setColumnFilters([])
    table.resetColumnFilters()
  }

  const hasActiveFilters = globalFilter !== "" || columnFilters.length > 0
  const activeFiltersCount = columnFilters.length + (globalFilter ? 1 : 0)

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }))
  }

  // Componente de Search Bar
  const SearchBar = ({ className: searchClassName = "" }: { className?: string }) => (
    <div className={`relative ${searchClassName}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={t('common.search') || "Search..."}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="pl-10 border-2 focus:border-primary"
      />
      {globalFilter && (
        <Button
          variant="ghost"
          onClick={() => setGlobalFilter("")}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent border border-transparent hover:border-border rounded"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )

  return (
    <div className={`w-full h-full max-w-screen space-y-4 px-2 sm:px-4 ${className}`}>
      {/* Top Bar - Always Visible */}
      <div className="flex flex-col gap-4">
        {/* Search Bar - Always on top */}
        <SearchBar className="w-full" />
        
        {/* Controls Row */}
        <div className="flex gap-3 md:flex-row md:items-center justify-between">
          {/* Filters Row - Always Flex Row */}
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {filters.length > 0 && (
              <>
                {filters.map((filter) => {
                  const filterValue = table.getColumn(filter.id)?.getFilterValue() as string
                  const isActive = !!filterValue
                  
                  return (
                    <Select
                      key={filter.id}
                      value={filterValue || "all"}
                      onValueChange={(value) =>
                        table.getColumn(filter.id)?.setFilterValue(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger className={`w-[120px] h-8 border-2 ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <SelectValue placeholder={filter.title} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {filter.title}</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                })}
                
                {/* Clear Filters Button - Minimalista */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 w-8 p-0 hover:bg-muted/50 shrink-0"
                    title="Clear all filters"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
          </div>
          
          {/* Column Visibility - Always visible */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-2 hover:border-primary/50">
                <Settings2 className="h-4 w-4 mr-2" />
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selection Info */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {Object.keys(rowSelection).length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRowSelection({})}
            className="h-6 px-2"
          >
            Clear selection
            <X className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActionHeader = header.column.id === 'actions'
                    return (
                      <TableHead 
                        key={header.id} 
                        className={`whitespace-nowrap ${isActionHeader ? 'text-right' : 'text-left'}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    {/* Main Row */}
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={`${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""} ${expandedRows[row.id] ? "bg-muted/30" : ""}`}
                      onClick={(e) => {
                        // Don't expand if clicking on action buttons
                        if (!(e.target as HTMLElement).closest('[data-action-button]')) {
                          onRowClick?.(row.original)
                        }
                      }}
                    >
                      {/* Mobile Expand Button */}
                      <TableCell className="md:hidden w-6 p-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRowExpansion(row.id)
                          }}
                          className="h-5 w-5 p-0 shrink-0"
                        >
                          {expandedRows[row.id] ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      </TableCell>
                      
                      {/* Regular Cells */}
                      {row.getVisibleCells().map((cell) => {
                        const isActionCell = cell.column.id === 'actions'
                        return (
                          <TableCell 
                            key={cell.id} 
                            className={`whitespace-nowrap ${isActionCell ? 'text-right' : 'text-left'}`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    
                    {/* Mobile Expanded Row */}
                    <TableRow className="md:hidden">
                      <TableCell colSpan={columns.length + 1} className="p-0">
                        <Collapsible open={expandedRows[row.id]}>
                          <CollapsibleContent className="space-y-0">
                            <div className="border-t bg-muted/20 p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Mostrar TODAS as colunas na expansão, exceto select, mobile expand e actions */}
                                {row.getAllCells().map((cell, index) => {
                                  // Pular colunas select, mobile expand button e actions
                                  if (cell.column.id === 'select' || cell.column.id === 'mobile-expand' || cell.column.id === 'actions') {
                                    return null
                                  }
                                  
                                  return (
                                    <div key={cell.id} className="space-y-1">
                                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {typeof cell.column.columnDef.header === 'string' 
                                          ? cell.column.columnDef.header 
                                          : cell.column.id}
                                      </div>
                                      <div className="text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-center text-sm font-medium">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
