"use client"

import { useMemo } from "react"
import { DollarSign, Building2 } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { useInstitution } from "@/contexts/institution-context"
import { useAnnualBudgetKPIs } from "@/hooks/graphql/use-annual-budget-queries"
import { BudgetOverviewCard } from "./budget-overview-card"
import { BudgetMetricsCard } from "./budget-metrics-card"
import { DepartmentAllocationList } from "./department-allocation-list"
import { SpendingOverTimeChart } from "@/components/charts/annual-budget/spending-over-time-chart"
import { useQuery } from "@apollo/client"
import { GET_ALL_SUBSIDY_REQUESTS } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

  // Query para buscar dados de subsidies para cruzar com as datas de aprovação
  const { data: subsidyData } = useQuery(GET_ALL_SUBSIDY_REQUESTS)
  
  // Query para buscar histórico de status dos subsídios para obter datas precisas de aprovação
  const { data: subsidyStatusHistoryData } = useQuery(GET_SUBSIDY_STATUS_HISTORY, {
    variables: { subsidyRequestId: "ALL" },
    skip: !subsidyData?.subsidyRequests?.length,
  })

  // Dados reais baseados em subsídios aprovados
  const spendingOverTimeData = useMemo(() => {
    // Função auxiliar para encontrar a data real de aprovação usando o histórico
    const findRealApprovalDate = (subsidyId: string, subsidyApprovedAt: string | null, subsidyUpdatedAt: string) => {
      // Primeiro, tentar usar a data approved_at se existir
      if (subsidyApprovedAt) {
        return subsidyApprovedAt
      }

      // Se tiver histórico de status, procurar pela data de aprovação
      if (subsidyStatusHistoryData?.getSubsidyStatusHistory) {
        const approvalHistory = subsidyStatusHistoryData.getSubsidyStatusHistory.find((history: any) => 
          history.subsidy_request_id === subsidyId && 
          ['APPROVED', 'CLOSED'].includes(history.status?.name?.toUpperCase())
        )
        
        if (approvalHistory) {
          return approvalHistory.changed_at
        }
      }

      // Fallback para updated_at
      return subsidyUpdatedAt
    }

    // Função para contabilizar subsidios aprovados por mês e departamento
    const processSubsidySpendingByMonth = () => {
      if (!subsidyData?.subsidyRequests) {
        return []
      }

      const allMonths = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ]

      // Inicializar estrutura para todos os meses
      const monthlySpending = new Map()
      allMonths.forEach((month, index) => {
        const date = new Date(selectedYear, index, 1)
        monthlySpending.set(month, {
          month: month,
          date: format(date, 'yyyy-MM-dd'),
          departments: []
        })
      })

      // Filtrar subsidios aprovados e fechados
      const approvedSubsidies = subsidyData.subsidyRequests
        .filter((subsidy: any) => {
          const statusMatch = ['APPROVED', 'CLOSED'].includes(subsidy.subsidy_status?.name)
          const hasDepartment = subsidy.department_id
          return statusMatch && hasDepartment
        })

      // Processar subsidios aprovados e fechados
      approvedSubsidies.forEach((subsidy: any) => {
        const deptId = subsidy.department_id
        const deptName = subsidy.department?.name || `Departamento ${deptId}`
        
        // Usar função auxiliar para encontrar a data real de aprovação
        const approvalDate = findRealApprovalDate(subsidy.id, subsidy.approved_at, subsidy.updated_at)
        const approvedAmount = parseFloat(subsidy.approved_amount) || parseFloat(subsidy.total_budget) || 0

        if (approvalDate && new Date(approvalDate).getFullYear() === selectedYear) {
          const monthKey = format(new Date(approvalDate), 'MMM', { locale: ptBR })
          // Garantir que a primeira letra seja maiúscula para corresponder à estrutura
          const normalizedMonthKey = monthKey.charAt(0).toUpperCase() + monthKey.slice(1)

          if (monthlySpending.has(normalizedMonthKey)) {
            const monthData = monthlySpending.get(normalizedMonthKey)
            
            // Buscar se departamento já existe neste mês
            let deptIndex = monthData.departments.findIndex(
              (d: any) => d.departmentId === deptId
            )
            
            if (deptIndex === -1) {
              // Adicionar novo departamento
              monthData.departments.push({
                departmentId: deptId,
                departmentName: deptName,
                amount: approvedAmount
              })
            } else {
              // Somar ao departamento existente
              monthData.departments[deptIndex].amount += approvedAmount
            }
          }
        }
      })

      // Converter para array e manter ordem dos meses
      return Array.from(monthlySpending.values())
    }

    return processSubsidySpendingByMonth()
  }, [subsidyData, subsidyStatusHistoryData, selectedYear])

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