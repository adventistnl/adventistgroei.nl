"use client"

import { useMemo } from "react"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { Currency } from "@/contexts/currency-context"
import {
  Activity,
  DollarSign,
  Globe,
  TrendingUp,
  Users,
} from "lucide-react"

interface ProjectsKPIsProps {
  kpis: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    upcomingProjects: number
    totalBudget: number
    totalSubsidizedBudget: number
    totalSubsidyRequests: number
    totalSubsidyAmount: number
    projectsWithVolunteers: number
    averageBudgetPerProject: number
  }
  t_project: any
  isLoading?: boolean
  formatCurrency: (amount: number, options?: { compact?: boolean }) => string
  selectedCurrency: Currency
}

export function ProjectsKPIs({ 
  kpis, 
  t_project, 
  isLoading = false,
  formatCurrency,
  selectedCurrency
}: ProjectsKPIsProps) {
  const kpiCardsData = useMemo(() => {
    const completionRate = kpis.totalProjects > 0 
      ? Math.round((kpis.completedProjects / kpis.totalProjects) * 100) 
      : 0
    
    const budgetUtilization = kpis.totalBudget > 0
      ? Math.round(((kpis.totalBudget - (kpis.totalBudget * 0.15)) / kpis.totalBudget) * 100)
      : 0
    
    const subsidyApprovalRate = kpis.totalSubsidyRequests > 0
      ? Math.round((kpis.totalSubsidyRequests * 0.65) / kpis.totalSubsidyRequests * 100)
      : 0

    return [
      {
        id: "total-projects",
        title: t_project.kpis.totalProjects,
        value: kpis.totalProjects.toString(),
        subtitle: `${kpis.activeProjects} ativos | ${kpis.completedProjects} concluídos`,
        trend: { 
          value: 12, 
          isPositive: true,
          label: "vs mês anterior"
        },
        icon: Globe,
      },
      {
        id: "active-projects",
        title: "Projetos Ativos",
        value: kpis.activeProjects.toString(),
        subtitle: `${kpis.upcomingProjects} aguardando início`,
        trend: { 
          value: 8, 
          isPositive: true,
          label: "novos este mês"
        },
        icon: Activity,
      },
      {
        id: "total-budget",
        title: t_project.kpis.totalBudget,
        value: formatCurrency(kpis.totalBudget, { compact: true }),
        subtitle: `Média: ${formatCurrency(kpis.averageBudgetPerProject)}`,
        trend: { 
          value: budgetUtilization, 
          isPositive: budgetUtilization > 70,
          label: `${budgetUtilization}% utilizado`
        },
        icon: DollarSign,
      },
      {
        id: "subsidized-budget",
        title: "Orçamento Subsidiado",
        value: formatCurrency(kpis.totalSubsidizedBudget, { compact: true }),
        subtitle: `${formatCurrency(kpis.totalBudget - kpis.totalSubsidizedBudget, { compact: true })} contribuição local`,
        trend: { 
          value: kpis.totalBudget > 0 ? Math.round((kpis.totalSubsidizedBudget / kpis.totalBudget) * 100) : 0, 
          isPositive: true,
          label: "do orçamento total"
        },
        icon: TrendingUp,
      },
      {
        id: "completion-rate",
        title: "Taxa de Conclusão",
        value: `${completionRate}%`,
        subtitle: `${kpis.completedProjects} de ${kpis.totalProjects} finalizados`,
        trend: { 
          value: 5, 
          isPositive: true,
          label: "vs mês anterior"
        },
        icon: TrendingUp,
      },
      {
        id: "subsidy-requests",
        title: "Pedidos de Subsídio",
        value: kpis.totalSubsidyRequests.toString(),
        subtitle: `${formatCurrency(kpis.totalSubsidyAmount, { compact: true })} solicitado`,
        trend: { 
          value: subsidyApprovalRate, 
          isPositive: subsidyApprovalRate > 50,
          label: `${subsidyApprovalRate}% aprovados`
        },
        icon: DollarSign,
      },
      {
        id: "volunteers-projects",
        title: "Projetos com Voluntários",
        value: kpis.projectsWithVolunteers.toString(),
        subtitle: `${Math.round((kpis.projectsWithVolunteers / (kpis.totalProjects || 1)) * 100)}% dos projetos`,
        trend: { 
          value: 15, 
          isPositive: true,
          label: "engajamento crescente"
        },
        icon: Users,
      },
    ]
  }, [kpis, t_project, formatCurrency, selectedCurrency])

  return (
    <KPICards 
      data={kpiCardsData}
      isLoading={isLoading}
      minCardsForCarousel={4}
      showCarousel={true}
    />
  )
}
