/**
 * CHART HEADER COMPONENT - EXAMPLES
 * 
 * Componente reutilizável para headers de gráficos com suporte a:
 * - Responsividade automática
 * - Actions customizadas (filtros, botões, selects)
 * - Orientação flexível (responsive, horizontal, vertical)
 */

import { ChartHeader } from "./chart-header"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartLine, ChartColumnBig } from "lucide-react"

// ============================================================================
// EXAMPLE 1: Header Simples (sem actions)
// ============================================================================
export function SimpleChartHeader() {
  return (
    <ChartHeader
      title="Revenue Overview"
      description="Total revenue for the current year"
    />
  )
}

// ============================================================================
// EXAMPLE 2: Header com Filtro de Período (Responsive)
// ============================================================================
export function HeaderWithTimeFilter() {
  return (
    <ChartHeader
      title="Sales Activity"
      description="Monthly sales performance"
      actionsOrientation="responsive"
      actions={
        <Select defaultValue="12m">
          <SelectTrigger className="w-[160px] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m">Last 12 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  )
}

// ============================================================================
// EXAMPLE 3: Header com Toggle de Tipo de Gráfico + Filtro (Como subsidy-activity-chart)
// ============================================================================
export function HeaderWithChartTypeAndFilter() {
  return (
    <ChartHeader
      title="Subsidy Activity"
      description="45 requests totaling €125K"
      actionsOrientation="responsive"
      actions={
        <>
          {/* Toggle de tipo de gráfico */}
          <div className="flex items-center border rounded-md">
            <Button
              variant="default"
              size="sm"
              className="rounded-r-none border-r-0 h-8"
            >
              <ChartLine />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-l-none h-8"
            >
              <ChartColumnBig />
            </Button>
          </div>

          {/* Filtro de período */}
          <Select defaultValue="12m">
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    />
  )
}

// ============================================================================
// EXAMPLE 4: Header com Múltiplos Botões (Horizontal)
// ============================================================================
export function HeaderWithHorizontalActions() {
  return (
    <ChartHeader
      title="Budget Distribution"
      description="Allocation by department"
      actionsOrientation="horizontal"
      actions={
        <>
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">Print</Button>
          <Button variant="default" size="sm">Refresh</Button>
        </>
      }
    />
  )
}

// ============================================================================
// EXAMPLE 5: Header com Actions em Vertical (Mobile-first)
// ============================================================================
export function HeaderWithVerticalActions() {
  return (
    <ChartHeader
      title="Team Performance"
      description="Individual metrics"
      actionsOrientation="vertical"
      actions={
        <>
          <Select defaultValue="team">
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">All Teams</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="month">
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    />
  )
}

// ============================================================================
// EXAMPLE 6: Header com className customizada
// ============================================================================
export function HeaderWithCustomClass() {
  return (
    <ChartHeader
      title="Custom Styled Header"
      description="With custom background and padding"
      className="bg-blue-50 dark:bg-blue-950/20 py-6"
      actions={
        <Button variant="outline" size="sm">Settings</Button>
      }
    />
  )
}

// ============================================================================
// PROPS INTERFACE (Para referência)
// ============================================================================
/**
 * interface ChartHeaderProps {
 *   title: string                                         // Título do gráfico (obrigatório)
 *   description?: string                                   // Descrição opcional
 *   actions?: React.ReactNode                             // Elementos de ação (filtros, botões, etc.)
 *   actionsOrientation?: "responsive" | "vertical" | "horizontal"  // Layout das actions (padrão: responsive)
 *   className?: string                                    // Classes CSS customizadas
 * }
 */

// ============================================================================
// COMPORTAMENTO RESPONSIVO
// ============================================================================
/**
 * actionsOrientation="responsive" (padrão):
 * - Mobile (<640px): Stack vertical (flex-col)
 * - Desktop (≥640px): Layout horizontal (flex-row)
 * 
 * actionsOrientation="horizontal":
 * - Sempre horizontal em todos os tamanhos de tela
 * 
 * actionsOrientation="vertical":
 * - Sempre vertical em todos os tamanhos de tela
 */
