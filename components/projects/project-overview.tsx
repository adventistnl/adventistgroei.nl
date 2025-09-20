"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Calendar
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { projectTranslations } from "@/lib/translations/projects"
import { 
  mockSubsidyRequests, 
  mockSubsidyActivities, 
  mockSubsidyReceipts,
  projectMonthlyProgressData
} from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

interface ProjectOverviewProps {
  project: ProjectTableData
}

// Chart configurations
const budgetChartConfig = {
  used: {
    label: "Usado",
    color: "#3b82f6", // Blue
  },
  approved: {
    label: "Aprovado",
    color: "#10b981", // Green
  },
  pending: {
    label: "Pendente",
    color: "#f59e0b", // Amber
  },
  remaining: {
    label: "Restante",
    color: "#e5e7eb", // Gray
  },
} satisfies ChartConfig

const progressChartConfig = {
  progress: {
    label: "Progresso",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const activitiesChartConfig = {
  budget: {
    label: "Orçamento",
    color: "#3b82f6", // Blue
  },
  approved: {
    label: "Aprovado",
    color: "#10b981", // Green
  },
} satisfies ChartConfig

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  
  const [selectedPeriod, setSelectedPeriod] = useState("6m")

  // Calculate project metrics
  const projectMetrics = useMemo(() => {
    const subsidyRequests = mockSubsidyRequests.filter(req => req.project_id === project.id)
    const activities = subsidyRequests.flatMap(req => 
      mockSubsidyActivities.filter(act => act.subsidy_request_id === req.id)
    )
    const receipts = activities.flatMap(act =>
      mockSubsidyReceipts.filter(rec => rec.subsidy_activities_id === act.id)
    )
    
    const totalSubsidyRequested = subsidyRequests.reduce((sum, req) => sum + req.total_budget, 0)
    const totalApproved = receipts.filter(rec => rec.approved).reduce((sum, rec) => sum + rec.amount, 0)
    const totalPending = activities.filter(act => act.status === "pending").reduce((sum, act) => sum + act.budget_amount, 0)
    
    // Calculate project duration and progress
    const startDate = new Date(project.start_at)
    const endDate = new Date(project.end_at)
    const now = new Date()
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    const progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
    
    return {
      totalSubsidyRequested,
      totalApproved,
      totalPending,
      activitiesCount: activities.length,
      receiptsCount: receipts.length,
      approvedReceiptsCount: receipts.filter(rec => rec.approved).length,
      budgetUtilization: (totalApproved / project.budget) * 100,
      totalDays,
      elapsedDays,
      remainingDays,
      progressPercentage,
      activities
    }
  }, [project])

  // Budget distribution data
  const budgetDistributionData = [
    { name: "Aprovado", value: projectMetrics.totalApproved, color: "#10b981" },
    { name: "Pendente", value: projectMetrics.totalPending, color: "#f59e0b" },
    { name: "Restante", value: project.budget - projectMetrics.totalApproved - projectMetrics.totalPending, color: "#e5e7eb" }
  ].filter(item => item.value > 0)

  // Activities budget data
  const activitiesBudgetData = projectMetrics.activities.map(activity => {
    const receipts = mockSubsidyReceipts.filter(rec => rec.subsidy_activities_id === activity.id)
    const approvedAmount = receipts.filter(rec => rec.approved).reduce((sum, rec) => sum + rec.amount, 0)
    
    return {
      name: activity.name.length > 15 ? `${activity.name.substring(0, 15)}...` : activity.name,
      budget: activity.budget_amount,
      approved: approvedAmount,
      status: activity.status
    }
  })

  // Progress radial data
  const progressData = [
    {
      name: "Progresso",
      value: projectMetrics.progressPercentage,
      fill: "#3b82f6"
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {project.budget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics.budgetUtilization.toFixed(1)}% utilizado
            </p>
            <Progress value={projectMetrics.budgetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {projectMetrics.totalApproved.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics.approvedReceiptsCount} recibos aprovados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.activitiesCount}</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics.receiptsCount} recibos no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso do Projeto</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.progressPercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics.remainingDays} dias restantes
            </p>
            <Progress value={projectMetrics.progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Budget Distribution - Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Distribuição do Orçamento
              </CardTitle>
              <CardDescription className="mt-1">
                Distribuição do orçamento por status
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={budgetChartConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={budgetDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  {budgetDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Project Progress - Radial Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progresso do Projeto
              </CardTitle>
              <CardDescription className="mt-1">
                Progresso temporal do projeto
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={progressChartConfig} className="h-[300px] w-full">
              <RadialBarChart
                data={progressData}
                startAngle={90}
                endAngle={-270}
                innerRadius={80}
                outerRadius={120}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#3b82f6"
                />
              </RadialBarChart>
            </ChartContainer>
            <div className="text-center mt-4">
              <p className="text-2xl font-bold">{projectMetrics.progressPercentage.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">
                {projectMetrics.elapsedDays} de {projectMetrics.totalDays} dias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities Budget Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Orçamento por Atividade
            </CardTitle>
            <CardDescription className="mt-1">
              Comparação entre orçamento planejado e aprovado
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={activitiesChartConfig} className="h-[350px] w-full">
            <BarChart data={activitiesBudgetData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$ ${Number(value).toLocaleString()}`}
                fontSize={11}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" radius={4} name="Orçamento Planejado" />
              <Bar dataKey="approved" fill="#10b981" radius={4} name="Valor Aprovado" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Progress Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="w-5 h-5" />
              Progresso Mensal
            </CardTitle>
            <CardDescription className="mt-1">
              Evolução mensal do projeto
            </CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Meses</SelectItem>
              <SelectItem value="6m">6 Meses</SelectItem>
              <SelectItem value="1y">1 Ano</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={budgetChartConfig} className="h-[350px] w-full">
            <AreaChart data={projectMonthlyProgressData}>
              <defs>
                <linearGradient id="fillUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$ ${Number(value).toLocaleString()}`}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="budget_used"
                type="natural"
                fill="url(#fillUsed)"
                stroke="#3b82f6"
                stackId="a"
                name="Orçamento Usado"
              />
              <Area
                dataKey="subsidies_approved"
                type="natural"
                fill="url(#fillApproved)"
                stroke="#10b981"
                stackId="a"
                name="Subsídios Aprovados"
              />
              <Legend />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
