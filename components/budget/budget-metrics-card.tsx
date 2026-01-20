"use client"

import { useMemo } from "react"
import { TrendingUp, Building2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrency } from "@/contexts/currency-context"
import { useAnnualBudgetKPIs } from "@/hooks/graphql/use-annual-budget-queries"

interface BudgetMetricsCardProps {
  institutionId?: string
  year: number
  currentLanguage: string
  className?: string
}

export function BudgetMetricsCard({
  institutionId,
  year,
  currentLanguage,
  className = ""
}: BudgetMetricsCardProps) {
  const { formatCurrency } = useCurrency()

  // GraphQL Hook para dados reais
  const { data: kpisData, loading: budgetKpisLoading } = useAnnualBudgetKPIs({
    skip: !institutionId,
    variables: {
      institutionId: institutionId!,
      year: year
    }
  })

  // Processar dados do orçamento
  const budgetData = useMemo(() => {
    if (!kpisData?.budgetKPIs) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        totalAllocated: 0,
        budgetRemaining: 0,
        budgetUtilization: 0,
        percentageSpent: 0,
        percentageAllocated: 0,
        percentageRemaining: 0
      }
    }

    const kpis = kpisData.budgetKPIs
    const totalBudget = kpis.totalInstitutionBudget || 0
    const totalSpent = kpis.totalSpent || 0
    const totalAllocated = kpis.totalAllocated || 0
    const budgetRemaining = kpis.budgetRemaining || 0
    const budgetUtilization = kpis.budgetUtilization || 0

    return {
      totalBudget,
      totalSpent,
      totalAllocated,
      budgetRemaining,
      budgetUtilization,
      percentageSpent: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      percentageAllocated: totalBudget > 0 ? Math.round((totalAllocated / totalBudget) * 100) : 0,
      percentageRemaining: totalBudget > 0 ? Math.round((budgetRemaining / totalBudget) * 100) : 0
    }
  }, [kpisData])

  return (
    <Card className={`p-6 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {currentLanguage === 'pt' ? 'Métricas do Orçamento' : currentLanguage === 'nl' ? 'Budget Metrics' : 'Budget Metrics'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'pt' ? 'Indicadores financeiros principais' : currentLanguage === 'nl' ? 'Belangrijkste financiële indicatoren' : 'Key financial indicators'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgetKpisLoading ? (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        ) : budgetData.totalBudget === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{currentLanguage === 'pt' ? 'Configure o orçamento institucional' : currentLanguage === 'nl' ? 'Stel het institutionele budget in' : 'Set up institutional budget'}</p>
            <p className="text-sm">{currentLanguage === 'pt' ? 'para visualizar as métricas' : currentLanguage === 'nl' ? 'om statistieken te bekijken' : 'to view metrics'}</p>
          </div>
        ) : (
          <>
            {/* Utilização Geral */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {currentLanguage === 'pt' ? 'Utilização Geral' : currentLanguage === 'nl' ? 'Algemeen Gebruik' : 'Overall Utilization'}
                </span>
                <span className="text-lg font-bold" style={{ color: 'hsl(var(--finance-utilization))' }}>
                  {budgetData.budgetUtilization}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.min(budgetData.budgetUtilization, 100)}%`,
                    backgroundColor: 'hsl(var(--finance-utilization-bg))'
                  }}
                />
              </div>
            </div>

            {/* Percentual Gasto */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--finance-spent))' }}>
                  {currentLanguage === 'pt' ? 'Percentual Gasto' : currentLanguage === 'nl' ? 'Uitgegeven Percentage' : 'Spent Percentage'}
                </span>
                <span className="text-lg font-bold" style={{ color: 'hsl(var(--finance-spent))' }}>
                  {budgetData.percentageSpent}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.min(budgetData.percentageSpent, 100)}%`,
                    backgroundColor: 'hsl(var(--finance-spent-bg))'
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(budgetData.totalSpent)} {currentLanguage === 'pt' ? 'de' : currentLanguage === 'nl' ? 'van' : 'of'} {formatCurrency(budgetData.totalBudget)}
              </div>
            </div>

            {/* Percentual Reservado */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--finance-allocated))' }}>
                  {currentLanguage === 'pt' ? 'Percentual Reservado' : currentLanguage === 'nl' ? 'Gereserveerd Percentage' : 'Allocated Percentage'}
                </span>
                <span className="text-lg font-bold" style={{ color: 'hsl(var(--finance-allocated))' }}>
                  {budgetData.percentageAllocated}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.min(budgetData.percentageAllocated, 100)}%`,
                    backgroundColor: 'hsl(var(--finance-allocated-bg))'
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(budgetData.totalAllocated)} {currentLanguage === 'pt' ? 'reservados' : currentLanguage === 'nl' ? 'gereserveerd' : 'allocated'}
              </div>
            </div>

            {/* Percentual Disponível */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--finance-available))' }}>
                  {currentLanguage === 'pt' ? 'Percentual Disponível' : currentLanguage === 'nl' ? 'Beschikbaar Percentage' : 'Available Percentage'}
                </span>
                <span className={`text-lg font-bold`} style={{ 
                  color: budgetData.percentageRemaining < 0 
                    ? 'hsl(var(--finance-spent))' 
                    : 'hsl(var(--finance-available))'
                }}>
                  {budgetData.percentageRemaining}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(Math.abs(budgetData.percentageRemaining), 100)}%`,
                    backgroundColor: budgetData.percentageRemaining < 0 
                      ? 'hsl(var(--finance-spent-bg))' 
                      : 'hsl(var(--finance-available-bg))'
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {budgetData.percentageRemaining < 0 && (
                  <span style={{ color: 'hsl(var(--finance-spent))' }}>
                    {currentLanguage === 'pt' ? 'Orçamento excedido em' : currentLanguage === 'nl' ? 'Budget overschreden met' : 'Budget exceeded by'} 
                  </span>
                )} {formatCurrency(Math.abs(budgetData.budgetRemaining))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}