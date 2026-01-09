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
        subtitle: t_project.kpis.activeDeactivted
          .replace('{{active}}', kpis.activeProjects.toString())
          .replace('{{completed}}', kpis.completedProjects.toString()),
        trend: { 
          value: 12, 
          isPositive: true,
          label: t_project.kpis.vsPreviousMonth
        },
        icon: Globe,
      },
      {
        id: "active-projects",
        title: t_project.kpis.activeProjects,
        value: kpis.activeProjects.toString(),
        subtitle: t_project.kpis.waitingToStart.replace('{{count}}', kpis.upcomingProjects.toString()),
        trend: { 
          value: 8, 
          isPositive: true,
          label: t_project.kpis.newThisMonth
        },
        icon: Activity,
      },
      {
        id: "total-budget",
        title: t_project.kpis.totalBudget,
        value: formatCurrency(kpis.totalBudget, { compact: true }),
        subtitle: `${t_project.kpis.average}: ${formatCurrency(kpis.averageBudgetPerProject)}`,
        trend: { 
          value: budgetUtilization, 
          isPositive: budgetUtilization > 70,
          label: t_project.kpis.percentUsed.replace('{{percent}}', budgetUtilization.toString())
        },
        icon: DollarSign,
      },
      {
        id: "subsidized-budget",
        title: t_project.kpis.subsidizedBudget,
        value: formatCurrency(kpis.totalSubsidizedBudget, { compact: true }),
        subtitle: t_project.kpis.localContribution.replace('{{amount}}', formatCurrency(kpis.totalBudget - kpis.totalSubsidizedBudget, { compact: true })),
        trend: { 
          value: kpis.totalBudget > 0 ? Math.round((kpis.totalSubsidizedBudget / kpis.totalBudget) * 100) : 0, 
          isPositive: true,
          label: t_project.kpis.ofTotalBudget
        },
        icon: TrendingUp,
      },
      {
        id: "completion-rate",
        title: t_project.kpis.completionRate,
        value: `${completionRate}%`,
        subtitle: t_project.kpis.finalizedOf.replace('{{completed}}', kpis.completedProjects.toString()).replace('{{total}}', kpis.totalProjects.toString()),
        trend: { 
          value: 5, 
          isPositive: true,
          label: t_project.kpis.vsPreviousMonth
        },
        icon: TrendingUp,
      },
      {
        id: "subsidy-requests",
        title: t_project.kpis.totalSubsidyRequests,
        value: kpis.totalSubsidyRequests.toString(),
        subtitle: `${formatCurrency(kpis.totalSubsidyAmount, { compact: true })} ${t_project.kpis.requested}`,
        trend: { 
          value: subsidyApprovalRate, 
          isPositive: subsidyApprovalRate > 50,
          label: t_project.kpis.approvedPercent.replace('{{percent}}', subsidyApprovalRate.toString())
        },
        icon: DollarSign,
      }
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
