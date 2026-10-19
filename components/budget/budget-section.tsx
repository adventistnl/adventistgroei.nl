"use client"

import { useMemo } from "react"
import { DollarSign } from "lucide-react"
import { useInstitution } from "@/contexts/institution-context"
import { useAnnualBudgetKPIs } from "@/hooks/graphql/use-annual-budget-queries"
import { SpendingOverTimeChart } from "@/components/charts/annual-budget/spending-over-time-chart"

interface BudgetSectionProps {
  selectedYear: number
  currentLanguage: string
  className?: string
}

export function BudgetSection({
  selectedYear,
  currentLanguage,
  className = ""
}: BudgetSectionProps) {
  const { currentInstitutionData } = useInstitution()

  // Transform departments data for budget distribution
  const departmentBudgetData = useMemo(() => {
    const institution = currentInstitutionData
    if (!institution?.departments) return []

    return institution.departments.map((department: any) => {
      // Find annual budget for selected year
      const annualBudget = department.annual_budgets?.find(
        (budget: any) => budget.year === selectedYear
      )

      return {
        id: department.id,
        departmentId: department.id,
        departmentName: department.name,
        departmentDescription: department.description,
        annualBudget: (annualBudget && annualBudget.has_budget_record) ? {
          id: annualBudget.id,
          allocated_amount: parseFloat(annualBudget.allocated_amount) || 0,
          planned_budget: parseFloat(annualBudget.planned_budget) || 0,
          total_expenses: parseFloat(annualBudget.total_expenses) || 0,
          balance: parseFloat(annualBudget.balance) || 0,
        } : null,
        hasBudgetRecord: annualBudget?.has_budget_record || false,
      }
    })
  }, [currentInstitutionData, selectedYear])

  const institutionId = currentInstitutionData?.id
  const year = selectedYear

  // Dados reais consolidados através dos dados transacionais do Ledger fornecidos pelo backend!
  const { data: annualKpiData } = useAnnualBudgetKPIs({
    variables: { year, institutionId: institutionId! },
    fetchPolicy: "network-only",
    skip: !institutionId
  })

  const spendingOverTimeData = annualKpiData?.spendingOverTime || []

  // Se não há instituição selecionada, não renderiza nada
  if (!currentInstitutionData) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold">
            {currentLanguage === 'pt' ? 'Visão Geral do Orçamento' : currentLanguage === 'nl' ? 'Budgetoverzicht' : 'Budget Overview'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentLanguage === 'pt' ? `Distribuição e utilização do orçamento ${selectedYear}` : currentLanguage === 'nl' ? `Budgetverdeling en gebruik ${selectedYear}` : `Budget distribution and utilization ${selectedYear}`}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* First Row: Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">


        </div>

        {/* Second Row: Spending Over Time Chart */}
        {spendingOverTimeData.length > 0 && (
          <div className="w-full">
            <SpendingOverTimeChart
              data={spendingOverTimeData}
              year={selectedYear}
            />
          </div>
        )}
      </div>
    </div>
  )
}