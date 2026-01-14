"use client"

import { useMemo } from "react"
import { Building, TrendingUp, AlertTriangle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrency } from "@/contexts/currency-context"
import { useAnnualBudgetKPIs } from "@/hooks/graphql/use-annual-budget-queries"

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

interface DepartmentAllocationListProps {
  institutionId?: string
  year: number
  currentLanguage: string
  departmentBudgetData?: DepartmentBudgetData[]
  className?: string
}

export function DepartmentAllocationList({
  institutionId,
  year,
  currentLanguage,
  departmentBudgetData = [],
  className = ""
}: DepartmentAllocationListProps) {
  const { formatCurrency } = useCurrency()

  // GraphQL Hook para dados reais de KPIs
  const { data: kpisData, loading: budgetKpisLoading } = useAnnualBudgetKPIs({
    skip: !institutionId,
    variables: {
      institutionId: institutionId!,
      year: year
    }
  })

  // Processar dados dos departamentos
  const processedDepartments = useMemo(() => {
    if (!kpisData?.budgetKPIs || !departmentBudgetData.length) {
      return []
    }

    const totalInstitutionBudget = kpisData.budgetKPIs.totalInstitutionBudget || 0

    return departmentBudgetData
      .filter(dept => dept.hasBudgetRecord && dept.annualBudget)
      .map(dept => {
        const budget = dept.annualBudget!
        const allocatedAmount = budget.allocated_amount
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return AlertTriangle
      case 'medium': return TrendingUp
      case 'low': return Building
      default: return Building
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building className="w-5 h-5" />
          {currentLanguage === 'pt' ? 'Alocação por Departamento' : currentLanguage === 'nl' ? 'Toewijzing per Afdeling' : 'Department Allocations'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'pt' 
            ? 'Detalhamento do orçamento alocado para cada departamento' 
            : currentLanguage === 'nl' 
            ? 'Uitsplitsing van het budget toegewezen aan elke afdeling' 
            : 'Budget allocation breakdown by department'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {budgetKpisLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-48 h-3" />
                  </div>
                  <Skeleton className="w-20 h-6" />
                </div>
              ))}
            </>
          ) : processedDepartments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>
                {currentLanguage === 'pt' 
                  ? 'Nenhum departamento com orçamento alocado' 
                  : currentLanguage === 'nl' 
                  ? 'Geen afdelingen met toegewezen budget' 
                  : 'No departments with allocated budget'}
              </p>
              <p className="text-sm">
                {currentLanguage === 'pt' 
                  ? 'Configure orçamentos departamentais para visualizar' 
                  : currentLanguage === 'nl' 
                  ? 'Stel afdelingsbudgetten in om weer te geven' 
                  : 'Set up departmental budgets to view'}
              </p>
            </div>
          ) : (
            processedDepartments.map((dept) => {
              const StatusIcon = getStatusIcon(dept.status)
              
              return (
                <div key={dept.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(dept.status)}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{dept.departmentName}</h4>
                      <Badge variant="outline" className="text-xs">
                        {dept.percentageOfTotal}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">
                          {currentLanguage === 'pt' ? 'Participação:' : currentLanguage === 'nl' ? 'Aandeel:' : 'Share:'} 
                        </span> {dept.percentageOfTotal}%
                      </div>
                      <div>
                        <span className="font-medium">
                          {currentLanguage === 'pt' ? 'Gasto:' : currentLanguage === 'nl' ? 'Uitgegeven:' : 'Spent:'} 
                        </span> {formatCurrency(dept.spentAmount)}
                      </div>
                      <div>
                        <span className="font-medium">
                          {currentLanguage === 'pt' ? 'Restante:' : currentLanguage === 'nl' ? 'Resterend:' : 'Remaining:'} 
                        </span> {formatCurrency(dept.remainingAmount)}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          {currentLanguage === 'pt' ? 'Utilização:' : currentLanguage === 'nl' ? 'Gebruik:' : 'Utilization:'} {dept.utilizationRate}%
                        </span>
                        <StatusIcon className="w-3 h-3" />
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${getStatusColor(dept.status)}`}
                          style={{ width: `${Math.min(dept.utilizationRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}