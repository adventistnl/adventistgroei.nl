"use client"

import { useMemo, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { DollarSign, Building2, Users } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PrivacyWrapper, InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionDeniedOverlay } from "@/components/shared/permission-denied-overlay"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { type PieSectorDataItem } from "recharts/types/polar/Pie"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartHeader } from "@/components/charts/chart-header"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrency } from "@/contexts/currency-context"
import { useAnnualBudgetKPIs } from "@/hooks/graphql/use-annual-budget-queries"

// Função para obter cores dinâmicas dos departamentos usando variáveis CSS
const getDepartmentColor = (index: number, isDarkMode: boolean = false) => {
  const colors = [
    'var(--chart-2-light)',               // Teal Light - oklch format
    'var(--chart-2-dark)',                // Teal Dark - oklch format
    'var(--chart-2-muted)',               // Teal Muted - oklch format
    'var(--chart-2-accent)',              // Teal Accent - oklch format
    'var(--chart-3)',                     // Gray/Orange - oklch format
    'var(--chart-4)',                     // Yellow/Purple - oklch format
    'var(--chart-5)',                     // Orange/Red - oklch format
  ]
  
  return colors[index % colors.length]
}

interface DepartmentBudgetData {
  id: string
  departmentId: string
  departmentName: string
  departmentDescription?: string
  annualBudget?: {
    id: string
    allocated_amount: number
    planned_budget: number
    total_expenses: number
    balance: number
  } | null
  hasBudgetRecord: boolean
}

interface BudgetOverviewCardProps {
  institutionId?: string
  year: number
  currentLanguage: string
  departmentBudgetData?: DepartmentBudgetData[]
  className?: string
}

export function BudgetOverviewCard({
  institutionId,
  year,
  currentLanguage,
  departmentBudgetData = [],
  className = ""
}: BudgetOverviewCardProps) {
  const { formatCurrency } = useCurrency()
  const id = "budget-pie-interactive"

  // GraphQL Hook para dados reais de KPIs
  const { data: kpisData, loading: budgetKpisLoading } = useAnnualBudgetKPIs({
    skip: !institutionId,
    variables: {
      institutionId: institutionId!,
      year: year
    }
  })

  // Processar dados do orçamento institucional
  const institutionBudgetData = useMemo(() => {
    if (!kpisData?.budgetKPIs) {
      return {
        totalBudget: 0,
        totalAllocated: 0,
        budgetRemaining: 0
      }
    }

    const kpis = kpisData.budgetKPIs
    return {
      totalBudget: kpis.totalInstitutionBudget || 0,
      totalAllocated: kpis.totalAllocated || 0,
      budgetRemaining: kpis.budgetRemaining || 0
    }
  }, [kpisData])

  // Processar dados dos departamentos - usar mesma lógica do DepartmentAllocationList
  const processedDepartments = useMemo(() => {
    if (!kpisData?.budgetKPIs || !departmentBudgetData.length) {
      return []
    }

    const totalInstitutionBudget = kpisData.budgetKPIs.totalInstitutionBudget || 0

    return departmentBudgetData
      .filter(dept => {
        const hasRecord = dept.hasBudgetRecord
        const hasBudget = !!dept.annualBudget
        // Usar planned_budget se allocated_amount for 0
        const hasAmount = dept.annualBudget && 
          (dept.annualBudget.allocated_amount > 0 || dept.annualBudget.planned_budget > 0)
        
        return hasRecord && hasBudget && hasAmount
      })
      .map(dept => {
        const budget = dept.annualBudget!
        // Usar planned_budget se allocated_amount for 0
        const allocatedAmount = budget.allocated_amount > 0 ? budget.allocated_amount : budget.planned_budget
        const spentAmount = budget.total_expenses
        const remainingAmount = budget.balance
        
        const percentageOfTotal = totalInstitutionBudget > 0 
          ? Math.round((allocatedAmount / totalInstitutionBudget) * 100) 
          : 0
        
        const utilizationRate = allocatedAmount > 0 
          ? Math.round((spentAmount / allocatedAmount) * 100) 
          : 0

        return {
          ...dept,
          allocatedAmount,
          spentAmount,
          remainingAmount,
          percentageOfTotal,
          utilizationRate,
          status: utilizationRate > 90 ? 'high' : utilizationRate > 50 ? 'medium' : 'low'
        }
      })
      .sort((a, b) => b.allocatedAmount - a.allocatedAmount) // Ordenar por maior alocação
  }, [kpisData, departmentBudgetData])

  // Dados para o gráfico de distribuição por departamento (formato chart config)
  const { chartData, chartConfig } = useMemo(() => {
    if (institutionBudgetData.totalBudget === 0) {
      return { chartData: [], chartConfig: {} }
    }

    const data: Array<{
      name: string
      value: number
      amount: number
      fill: string
      percentage: number
      type: 'department' | 'available'
      departmentId?: string
    }> = []

    const config: ChartConfig = {
      value: { label: "Value" }
    }

    const totalBudget = institutionBudgetData.totalBudget
    const budgetRemaining = institutionBudgetData.budgetRemaining

    // Processar departamentos com dados processados - usar valores reais de alocação
    if (processedDepartments.length > 0) {
      processedDepartments.forEach((dept, index) => {
        const allocatedAmount = dept.allocatedAmount
        const percentage = dept.percentageOfTotal
        
        // Garantir que todos os departamentos com valores sejam incluídos
        if (allocatedAmount > 0) {
          const departmentKey = `dept_${dept.id}`
          const color = getDepartmentColor(index)
          
          data.push({
            name: departmentKey,
            value: allocatedAmount,
            amount: allocatedAmount,
            fill: color,
            percentage,
            type: 'department',
            departmentId: dept.id
          })
          
          config[departmentKey] = {
            label: dept.departmentName,
            color
          }
        }
      })
    }

    // Apenas adicionar valor disponível se houver - removemos o fallback do allocated_total
    if (budgetRemaining > 0) {
      const availablePercentage = Math.round((budgetRemaining / totalBudget) * 100)
      const availableKey = 'available'
      const availableColor = 'var(--chart-2-green)'
      
      data.push({
        name: availableKey,
        value: budgetRemaining,
        amount: budgetRemaining,
        fill: availableColor,
        percentage: availablePercentage,
        type: 'available'
      })
      
      config[availableKey] = {
        label: currentLanguage === 'pt' ? 'Disponível' : currentLanguage === 'nl' ? 'Beschikbaar' : 'Available',
        color: availableColor
      }
    }

    return { chartData: data, chartConfig: config }
  }, [institutionBudgetData, processedDepartments, currentLanguage])

  // Estado para controlar o item ativo no gráfico
  const [activeItem, setActiveItem] = useState<string>('')
  
  // Atualizar activeItem quando chartData muda - priorizar 'available' como padrão
  useEffect(() => {
    if (chartData.length > 0 && !activeItem) {
      // Procurar primeiro por item 'available'
      const availableItem = chartData.find(item => item.type === 'available')
      if (availableItem) {
        setActiveItem(availableItem.name)
      } else {
        // Se não houver 'available', usar o primeiro item
        setActiveItem(chartData[0].name)
      }
    }
  }, [chartData, activeItem])
  
  // Index do item ativo
  const activeIndex = useMemo(
    () => chartData.findIndex((item) => item.name === activeItem),
    [activeItem, chartData]
  )

  // Lista de chaves para o select
  const itemKeys = useMemo(() => chartData.map((item) => item.name), [chartData])

  // Função para lidar com o click no PIE chart
  const handlePieClick = (data: any, index: number) => {
    if (data && data.name) {
      setActiveItem(data.name)
    }
  }

  // Dados do item ativo
  const activeData = useMemo(() => {
    if (activeIndex >= 0 && chartData[activeIndex]) {
      return chartData[activeIndex]
    }
    return chartData[0] || { name: '', value: 0, amount: 0, percentage: 0, fill: '', type: 'available' as const }
  }, [chartData, activeIndex])

  // Estatísticas dos departamentos usando dados processados
  const departmentStats = useMemo(() => {
    const totalDepartments = departmentBudgetData.length
    const departmentsWithBudget = departmentBudgetData.filter(dept => dept.hasBudgetRecord).length
    const departmentsWithAllocation = processedDepartments.length

    return {
      totalDepartments,
      departmentsWithBudget,
      departmentsWithAllocation
    }
  }, [departmentBudgetData, processedDepartments])

  // Privacy configuration for budget data
  const privacyConfig = {
    id: `budget-overview-${institutionId}-${year}`,
    level: 'confidential' as const,
    allowedRoles: ['ADMIN', 'FINANCE_MANAGER', 'FINANCIAL_MANAGER', 'CFO', 'SUPER_ADMIN'],
    defaultHidden: false,
    persistent: true,
    blurIntensity: 'high' as const,
  }

  return (
    <WithPermission
      requiredPermissions={[PermissionResolverName.AnnualBudgets]}
      fallback={
        <PermissionDeniedOverlay height="500px" blurIntensity="medium">
          {/* Skeleton do Budget Overview Card */}
          <Card data-chart={id} className={`bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col min-h-[300px] ${className}`}>
            <CardHeader className="flex-row items-start space-y-0 pb-0">
              <div className="grid gap-1 w-full">
                <div className="flex w-full justify-between">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-4 w-96 mt-2" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
              <div className="flex flex-col items-center gap-4 py-8">
                <Skeleton className="w-[100px] h-[100px] rounded-full" />
                <Skeleton className="w-32 h-6" />
              </div>
            </CardContent>
            <div className="mt-3 pt-3 border-t mx-6 pb-4">
              <div className="max-w-sm mx-auto space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </Card>
        </PermissionDeniedOverlay>
      }
    >
      <PrivacyWrapper
        config={privacyConfig}
        showToggle={false}
        fallback={
          <Card data-chart={id} className={`bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col min-h-[500px] ${className}`}>
            <CardHeader className="flex-row items-start space-y-0 pb-0">
              <div className="grid gap-1">
                <div className="flex w-full justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {currentLanguage === 'pt' 
                      ? 'Distribuição de Orçamento' 
                      : currentLanguage === 'nl' 
                      ? 'Budgetverdeling' 
                      : 'Budget Distribution'}
                  </CardTitle>
                  {/* <InlinePrivacyToggle config={privacyConfig} /> */}
                </div>
                <CardDescription>
                  {currentLanguage === 'pt' 
                    ? 'Informação financeira protegida' 
                    : currentLanguage === 'nl' 
                    ? 'Beveiligde financiële informatie' 
                    : 'Protected financial information'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
              <div className="text-center text-muted-foreground py-8">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">
                  {currentLanguage === 'pt' 
                    ? 'Dados financeiros confidenciais' 
                    : currentLanguage === 'nl' 
                    ? 'Vertrouwelijke financiële gegevens' 
                    : 'Confidential financial data'}
                </p>
                <p className="text-sm">
                  {currentLanguage === 'pt' 
                    ? 'Requer permissões de gestão financeira' 
                    : currentLanguage === 'nl' 
                    ? 'Vereist financiële beheerrechten' 
                    : 'Requires financial management permissions'}
                </p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card data-chart={id} className={`bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col min-h-[500px] ${className}`}>
        <ChartStyle id={id} config={chartConfig} />
        <ChartHeader
          title={
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="w-5 h-5" />
              {currentLanguage === 'pt' ? 'Distribuição por Departamentos' : currentLanguage === 'nl' ? 'Verdeling per Afdeling' : 'Department Distribution'}
            </div>
          }
          description={
            currentLanguage === 'pt' 
              ? `${departmentStats.departmentsWithAllocation} de ${departmentStats.totalDepartments} departamentos com orçamento alocado` 
              : currentLanguage === 'nl' 
              ? `${departmentStats.departmentsWithAllocation} van ${departmentStats.totalDepartments} afdelingen met toegewezen budget` 
              : `${departmentStats.departmentsWithAllocation} of ${departmentStats.totalDepartments} departments with allocated budget`
          }
          actions={
            chartData.length > 0 ? (
              <Select value={activeItem} onValueChange={setActiveItem}>
                <SelectTrigger
                  className="w-full sm:w-[180px] rounded-lg pl-2.5"
                  aria-label="Select a department"
                >
                  <SelectValue placeholder="Selecionar departamento" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl max-h-[200px] overflow-y-auto">
                  {/* Mostrar departamentos ordenados por valor alocado (maior primeiro) */}
                  {itemKeys
                    .filter((key) => {
                      const chartItem = chartData.find(item => item.name === key)
                      return chartItem && chartItem.type === 'department' && chartItem.amount > 0
                    })
                    .sort((a, b) => {
                      // Ordenar por valor decrescente
                      const itemA = chartData.find(item => item.name === a)
                      const itemB = chartData.find(item => item.name === b)
                      return (itemB?.amount || 0) - (itemA?.amount || 0)
                    })
                    .map((key, index) => {
                      const config = chartConfig[key as keyof typeof chartConfig]
                      const chartItem = chartData.find(item => item.name === key)
                      if (!config || !chartItem) return null

                      return (
                        <SelectItem
                          key={key}
                          value={key}
                          className="rounded-lg [&_span]:flex"
                        >
                          <div className="flex items-center justify-between w-full text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className="flex h-3 w-3 shrink-0 rounded-xs"
                                style={{
                                  backgroundColor: config.color,
                                }}
                              />
                              <span className="font-medium truncate max-w-[100px]">{config?.label}</span>
                            </div>
                            <span className="text-muted-foreground ml-2 font-semibold">
                              {chartItem.percentage}%
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  
                  {/* Separador dinâmico */}
                  {itemKeys.some(key => chartData.find(item => item.name === key && item.type === 'department' && item.amount > 0)) &&
                  itemKeys.some(key => chartData.find(item => item.name === key && item.type === 'available' && item.amount > 0)) && (
                    <div className="border-t my-1" />
                  )}
                  
                  {/* Valor disponível com destaque */}
                  {itemKeys
                    .filter((key) => {
                      const chartItem = chartData.find(item => item.name === key)
                      return chartItem && chartItem.type === 'available' && chartItem.amount > 0
                    })
                    .map((key) => {
                      const config = chartConfig[key as keyof typeof chartConfig]
                      const chartItem = chartData.find(item => item.name === key)
                      if (!config || !chartItem) return null

                      return (
                        <SelectItem
                          key={key}
                          value={key}
                          className="rounded-lg [&_span]:flex"
                        >
                          <div className="flex items-center justify-between w-full text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className="flex h-3 w-3 shrink-0 rounded-xs"
                                style={{
                                  backgroundColor: config.color,
                                }}
                              />
                              <span className="font-medium" style={{ color: 'hsl(var(--budget-available))' }}>{config?.label}</span>
                            </div>
                            <span className="ml-2 font-semibold" style={{ color: 'hsl(var(--budget-available))' }}>
                              {chartItem.percentage}%
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            ) : undefined
          }
        />
      <CardContent className="flex flex-1 justify-center pb-0">
        {budgetKpisLoading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="w-24 h-4" />
          </div>
        ) : institutionBudgetData.totalBudget === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{currentLanguage === 'pt' ? 'Nenhum orçamento institucional definido' : currentLanguage === 'nl' ? 'Geen institutioneel budget gedefinieerd' : 'No institutional budget defined'}</p>
            <p className="text-sm">{currentLanguage === 'pt' ? 'para o ano' : currentLanguage === 'nl' ? 'voor het jaar' : 'for year'} {year}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{currentLanguage === 'pt' ? 'Nenhum orçamento alocado ou disponível' : currentLanguage === 'nl' ? 'Geen toegewezen of beschikbaar budget' : 'No allocated or available budget'}</p>
            <p className="text-sm">{currentLanguage === 'pt' ? 'para o ano' : currentLanguage === 'nl' ? 'voor het jaar' : 'for year'} {year}</p>
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => [
                    `${chartData.find(item => item.name === name)?.percentage || 0}%`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={4}
                stroke="hsl(var(--background))"
                activeIndex={activeIndex}
                onClick={handlePieClick}
                className="cursor-pointer"
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 8} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 20}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox && activeData) {
                      const isDepartment = activeData.type === 'department'
                      const departmentInfo = isDepartment && processedDepartments.find(dept => 
                        `dept_${dept.id}` === activeData.name
                      )
                      
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy - 10}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {activeData.percentage}%
                          </tspan>
                          {isDepartment && departmentInfo && (
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 15}
                              className="fill-primary text-sm font-medium"
                            >
                              {departmentInfo.departmentName.length > 9 
                                ? `${departmentInfo.departmentName.substring(0, 9)}...`
                                : departmentInfo.departmentName
                              }
                            </tspan>
                          )}
                          {activeData.type === 'available' && (
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 15}
                              className="text-sm font-medium"
                              fill="var(--chart-2-green)"
                            >
                              {currentLanguage === 'pt' ? 'Disponível' : currentLanguage === 'nl' ? 'Beschikbaar' : 'Available'}
                            </tspan>
                          )}
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      
      {/* Summary Info - Footer Minimalista */}
      {!budgetKpisLoading && institutionBudgetData.totalBudget > 0 && (
        <div className="mt-3 pt-3 border-t mx-6 pb-4">
          <div className="max-w-sm mx-auto space-y-3">
            {/* KPIs em colunas compactas */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {currentLanguage === 'pt' ? 'Alocado' : currentLanguage === 'nl' ? 'Toegewezen' : 'Allocated'}
                </p>
                <p className="font-bold text-sm text-primary">
                  {Math.round((institutionBudgetData.totalAllocated / institutionBudgetData.totalBudget) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {currentLanguage === 'pt' ? 'Disponível' : currentLanguage === 'nl' ? 'Beschikbaar' : 'Available'}
                </p>
                <p className="font-bold text-sm" style={{ color: 'var(--chart-2-green)' }}>
                  {Math.round((institutionBudgetData.budgetRemaining / institutionBudgetData.totalBudget) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {currentLanguage === 'pt' ? 'Deptos' : currentLanguage === 'nl' ? 'Afd.' : 'Depts'}
                </p>
                <p className="font-bold text-sm text-foreground">
                  {departmentStats.departmentsWithAllocation}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      )}
        </Card>
      </PrivacyWrapper>
    </WithPermission>
  )
}