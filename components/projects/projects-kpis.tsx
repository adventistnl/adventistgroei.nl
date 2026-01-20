"use client"

import { useMemo } from "react"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { Currency } from "@/contexts/currency-context"
import {
  Activity,
  Calendar,
  DollarSign,
  Globe,
  TrendingUp,
} from "lucide-react"

interface ProjectsKPIsProps {
  kpis: {
    totalProjects: number
    completedProjects: number
    upcomingProjects: number
    totalBudget: number
    totalAllocated: number
    projectsWithVolunteers: number
    averageBudgetPerProject: number
    averageAllocatedPerProject: number
    yearProgress: {
      percent: number
      dayOfYear: number
      totalDaysInYear: number
      daysRemaining: number
    }
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

    return [
      {
        id: "total-projects",
        title: t_project.kpis.totalProjects,
        value: kpis.totalProjects.toString(),
        subtitle: t_project.kpis.waitingToStart.replace('{{count}}', kpis.upcomingProjects.toString()),
        trend: { 
          value: 12, 
          isPositive: true,
          label: t_project.kpis.vsPreviousMonth
        },
        icon: Globe,
      },
      {
        id: "year-progress",
        title: t_project.kpis.yearProgress,
        value: `${kpis.yearProgress.percent}%`,
        subtitle: t_project.kpis.currentDay
          .replace('{{current}}', kpis.yearProgress.dayOfYear.toString())
          .replace('{{total}}', kpis.yearProgress.totalDaysInYear.toString()),
        trend: { 
          value: kpis.yearProgress.daysRemaining, 
          isPositive: kpis.yearProgress.daysRemaining > 0,
          label: t_project.kpis.daysRemaining.replace('{{days}}', kpis.yearProgress.daysRemaining.toString())
        },
        icon: Calendar,
      },
      {
        id: "total-allocated",
        title: t_project.kpis.totalAllocated,
        value: formatCurrency(kpis.totalAllocated, { compact: true }),
        subtitle: `${t_project.kpis.average}: ${formatCurrency(kpis.averageAllocatedPerProject)}`,
        trend: { 
          value: kpis.totalBudget > 0 ? Math.round((kpis.totalAllocated / kpis.totalBudget) * 100) : 0, 
          isPositive: true,
          label: t_project.kpis.ofTotalBudget
        },
        icon: DollarSign,
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
      }
    ]
  }, [kpis, t_project, formatCurrency])

  return (
    <KPICards 
      data={kpiCardsData}
      isLoading={isLoading}
      minCardsForCarousel={4}
      showCarousel={true}
    />
  )
}
