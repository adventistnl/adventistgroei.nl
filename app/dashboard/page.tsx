"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/shared/language-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Building,
  MapPin,
  UserCheck,
  MessageSquare,
  FileText,
  Activity,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Download,
  BarChart3,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown
} from "lucide-react"
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  growthData,
  usersByInstitutionData,
  budgetVsSubsidyData,
  subsidyStatusData,
  eventParticipationData,
  communicationFlowData,
  dashboardMetrics,
  recentActivities,
  geographicDistribution,
  departmentPerformanceData,
  institutionSpecificData
} from "@/data/mockData"
import { useInstitution } from "@/contexts/institution-context"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { ColumnDef } from "@tanstack/react-table"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { structureTranslations } from "@/lib/translations/structure"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"

// Dados para o gráfico interativo de crescimento
const interactiveGrowthData = [
  { date: "2024-01-01", churches: 156, members: 45000, regions: 28 },
  { date: "2024-01-05", churches: 158, members: 45200, regions: 28 },
  { date: "2024-01-10", churches: 159, members: 45400, regions: 28 },
  { date: "2024-01-15", churches: 161, members: 45800, regions: 29 },
  { date: "2024-01-20", churches: 162, members: 46000, regions: 29 },
  { date: "2024-01-25", churches: 164, members: 46300, regions: 29 },
  { date: "2024-01-30", churches: 165, members: 46500, regions: 30 },
  { date: "2024-02-01", churches: 166, members: 46700, regions: 30 },
  { date: "2024-02-05", churches: 168, members: 47000, regions: 30 },
  { date: "2024-02-10", churches: 169, members: 47200, regions: 30 },
  { date: "2024-02-15", churches: 171, members: 47500, regions: 31 },
  { date: "2024-02-20", churches: 172, members: 47800, regions: 31 },
  { date: "2024-02-25", churches: 174, members: 48100, regions: 31 },
  { date: "2024-02-28", churches: 175, members: 48300, regions: 32 },
  { date: "2024-03-01", churches: 176, members: 48500, regions: 32 },
  { date: "2024-03-05", churches: 178, members: 48800, regions: 32 },
  { date: "2024-03-10", churches: 179, members: 49000, regions: 32 },
  { date: "2024-03-15", churches: 181, members: 49300, regions: 33 },
  { date: "2024-03-20", churches: 182, members: 49600, regions: 33 },
  { date: "2024-03-25", churches: 184, members: 49900, regions: 33 },
  { date: "2024-03-30", churches: 185, members: 50100, regions: 34 },
  { date: "2024-04-01", churches: 186, members: 50300, regions: 34 },
  { date: "2024-04-05", churches: 188, members: 50600, regions: 34 },
  { date: "2024-04-10", churches: 189, members: 50800, regions: 34 },
  { date: "2024-04-15", churches: 191, members: 51100, regions: 35 },
  { date: "2024-04-20", churches: 192, members: 51400, regions: 35 },
  { date: "2024-04-25", churches: 194, members: 51700, regions: 35 },
  { date: "2024-04-30", churches: 195, members: 51900, regions: 36 },
  { date: "2024-05-01", churches: 196, members: 52100, regions: 36 },
  { date: "2024-05-05", churches: 198, members: 52400, regions: 36 },
  { date: "2024-05-10", churches: 199, members: 52700, regions: 36 },
  { date: "2024-05-15", churches: 201, members: 53000, regions: 37 },
  { date: "2024-05-20", churches: 202, members: 53300, regions: 37 },
  { date: "2024-05-25", churches: 204, members: 53600, regions: 37 },
  { date: "2024-05-30", churches: 205, members: 53800, regions: 38 },
  { date: "2024-06-01", churches: 206, members: 54000, regions: 38 },
  { date: "2024-06-05", churches: 208, members: 54300, regions: 38 },
  { date: "2024-06-10", churches: 209, members: 54600, regions: 38 },
  { date: "2024-06-15", churches: 211, members: 54900, regions: 39 },
  { date: "2024-06-20", churches: 212, members: 55200, regions: 39 },
  { date: "2024-06-25", churches: 214, members: 55500, regions: 39 },
  { date: "2024-06-30", churches: 215, members: 55800, regions: 40 },
]

// Mock data para usuários
const mockUsers = [
  { id: 1, name: "João Silva", email: "joao@example.com", role: "Admin", status: "Active", lastLogin: "2024-01-15" },
  { id: 2, name: "Maria Santos", email: "maria@example.com", role: "Manager", status: "Active", lastLogin: "2024-01-14" },
  { id: 3, name: "Pedro Costa", email: "pedro@example.com", role: "User", status: "Inactive", lastLogin: "2024-01-10" },
  { id: 4, name: "Ana Oliveira", email: "ana@example.com", role: "Manager", status: "Active", lastLogin: "2024-01-15" },
  { id: 5, name: "Carlos Lima", email: "carlos@example.com", role: "User", status: "Active", lastLogin: "2024-01-13" },
  { id: 6, name: "Lucia Ferreira", email: "lucia@example.com", role: "Admin", status: "Active", lastLogin: "2024-01-15" },
  { id: 7, name: "Roberto Alves", email: "roberto@example.com", role: "User", status: "Pending", lastLogin: "2024-01-12" },
  { id: 8, name: "Fernanda Rocha", email: "fernanda@example.com", role: "Manager", status: "Active", lastLogin: "2024-01-14" },
]

// Colunas para a tabela de usuários
const userColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    header: "Roles",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {user.user_roles?.map((role: any) => (
            <Badge 
              key={role.id} 
              variant={role.role.key_code === 'ADMIN' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {role.role.key_code === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
              {role.role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "is_deleted",
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.is_deleted;
      const color = status ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {status ? "Inactive" : "Active"}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "lastLogin",
  //   header: "Last Login",
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("lastLogin"))
  //     return date.toLocaleDateString()
  //   },
  // },
  // {
  //   accessorKey: "lastLogin",
  //   header: "Last Login",
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("lastLogin"))
  //     return date.toLocaleDateString()
  //   },
  // },
]


// Configurações dos gráficos com cores distintas
const interactiveGrowthChartConfig = {
  visitors: {
    label: "Growth Metrics",
  },
  churches: {
    label: "Churches",
    color: "#3b82f6", // Blue
  },
  members: {
    label: "Members",
    color: "#10b981", // Green
  },
} satisfies ChartConfig

const usersChartConfig = {
  users: {
    label: "Users",
    color: "#f59e0b", // Amber
  },
} satisfies ChartConfig

const budgetChartConfig = {
  budget: {
    label: "Budget",
    color: "#10b981", // Green
  },
  subsidies_requested: {
    label: "Requested",
    color: "#f59e0b", // Amber
  },
  subsidies_approved: {
    label: "Approved",
    color: "#3b82f6", // Blue
  },
} satisfies ChartConfig

const subsidyStatusChartConfig = {
  approved: {
    label: "Approved",
    color: "#22c55e", // Green
  },
  pending: {
    label: "Pending",
    color: "#f59e0b", // Amber
  },
  under_review: {
    label: "Under Review",
    color: "#3b82f6", // Blue
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444", // Red
  },
} satisfies ChartConfig

const eventsChartConfig = {
  evangelism: {
    label: "Evangelism",
    color: "#ef4444", // Red
  },
  show: {
    label: "Shows",
    color: "#3b82f6", // Blue
  },
  conference: {
    label: "Conferences",
    color: "#10b981", // Green
  },
  workshop: {
    label: "Workshops",
    color: "#8b5cf6", // Purple
  },
} satisfies ChartConfig

const communicationChartConfig = {
  communications: {
    label: "Communications",
    color: "#3b82f6", // Blue
  },
  direct_messages: {
    label: "Direct Messages",
    color: "#10b981", // Green
  },
  announcements: {
    label: "Announcements",
    color: "#f59e0b", // Amber
  },
} satisfies ChartConfig

const departmentPerformanceChartConfig = {
  efficiency: {
    label: "Efficiency",
    color: "#8b5cf6", // Purple
  },
  budget_used: {
    label: "Budget Used %",
    color: "#f59e0b", // Amber
  },
  events_completed: {
    label: "Events Completed",
    color: "#10b981", // Green
  },
} satisfies ChartConfig

// Componentes individuais dos gráficos
const GrowthChart = () => (
  <Card className="h-full">
    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <div className="grid flex-1 gap-1">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Growth Analysis
        </CardTitle>
        <CardDescription>
          Detailed growth analysis with time filtering
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
      <ChartContainer
        config={interactiveGrowthChartConfig}
        className="aspect-auto h-[300px] w-full"
      >
        <AreaChart data={interactiveGrowthData.slice(-30)}>
          <defs>
            <linearGradient id="fillChurches" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillMembers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })
                }}
                indicator="dot"
              />
            }
          />
          <Area dataKey="members" type="natural" fill="url(#fillMembers)" stroke="#10b981" stackId="a" />
          <Area dataKey="churches" type="natural" fill="url(#fillChurches)" stroke="#3b82f6" stackId="a" />
          <Legend />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
)

const UsersChart = () => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Distribution
        </CardTitle>
        <CardDescription className="mt-1">
          Active users by institution
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={usersChartConfig} className="h-[300px] w-full">
        <BarChart accessibilityLayer data={usersByInstitutionData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="institution"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={10}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="users" fill="#f59e0b" radius={6} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
)

const SubsidyStatusChart = () => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Subsidy Status
        </CardTitle>
        <CardDescription className="mt-1">
          Request status breakdown
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={subsidyStatusChartConfig} className="h-[300px] w-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={subsidyStatusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            strokeWidth={2}
            paddingAngle={2}
          >
            {subsidyStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <Legend />
          </Pie>
        </PieChart>
      </ChartContainer>
    </CardContent>
  </Card>
)

const BudgetChart = () => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Budget Analysis
        </CardTitle>
        <CardDescription className="mt-1">
          Budget allocation vs subsidy requests
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={budgetChartConfig} className="h-[300px] w-full">
        <BarChart accessibilityLayer data={budgetVsSubsidyData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="department" tickLine={false} tickMargin={10} axisLine={false} fontSize={11} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `R$ ${Number(value).toLocaleString()}`}
            fontSize={11}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="budget" fill="#10b981" radius={4} />
          <Bar dataKey="subsidies_requested" fill="#f59e0b" radius={4} />
          <Bar dataKey="subsidies_approved" fill="#3b82f6" radius={4} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { institutions, currentInstitutionData } = useInstitution()
  const currentLanguage = i18n?.language || 'en'
  const ts = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en

  const users = institutions?.flatMap(inst => inst.users) || []
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [refreshing, setRefreshing] = useState(false)
  
  // Estados para filtros individuais de cada gráfico
  const [growthPeriod, setGrowthPeriod] = useState("6m")
  const [usersPeriod, setUsersPeriod] = useState("all")
  const [budgetPeriod, setBudgetPeriod] = useState("current")
  const [subsidyPeriod, setSubsidyPeriod] = useState("all")
  const [eventsPeriod, setEventsPeriod] = useState("6m")
  const [commPeriod, setCommPeriod] = useState("3m")

  // Dados específicos da instituição ativa
  // const currentInstitutionData = React.useMemo(() => {
  //   if (!currentInstitutionData) return institutionSpecificData.usp;
  //   return institutionSpecificData[currentInstitutionData.id as keyof typeof institutionSpecificData] || institutionSpecificData.usp;
  // }, [currentInstitutionData?.id])

  // Dados para KPI Cards
  const kpiCardsData = [
    {
      id: "total-users",
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: { value: 12, isPositive: true },
      icon: Users,
    },
    {
      id: "active-churches",
      title: "Active Churches",
      value: "156",
      change: "28 regions",
      trend: { value: 0, isPositive: true },
      icon: MapPin,
    },
    {
      id: "pending-subsidies",
      title: "Pending Subsidies",
      value: "23",
      change: "85% utilized",
      trend: { value: -5, isPositive: false },
      icon: DollarSign,
    },
    {
      id: "active-members",
      title: "Active Members",
      value: "54,200",
      change: "Last 30 days",
      trend: { value: 8, isPositive: true },
      icon: UserCheck,
    },
  ]

  const breadcrumbs = useMemo(() => [
    { name: t('dashboard.title') }
  ], [t])

  usePageTitle({
    title: t('dashboard.title'),
    breadcrumbs
  })

  // Simular carregamento de dados
  useEffect(() => {
    const loadDashboardData = async () => {
      const loadingToast = toast.loading(t('common.loading'))
      
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        toast.dismiss(loadingToast)
        toast.success("Dashboard loaded successfully", {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t('common.error'))
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [t])

  const handleRefresh = async () => {
    setRefreshing(true)
    
    const refreshToast = toast.loading("🔄 Refreshing data...")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.dismiss(refreshToast)
      toast.success("✅ Data refreshed successfully!", {
        duration: 2000
      })
      
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error("❌ Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }

  // Componente para seletor de período
  const PeriodSelector = ({ value, onChange, options }: {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const quickActions = [
    { icon: Users, label: t('actions.add_member'), href: "/members", color: "text-blue-600" },
    { icon: Calendar, label: t('actions.create_event'), href: "/events", color: "text-green-600" },
    { icon: DollarSign, label: t('actions.manage_subsidies'), href: "/subsidies", color: "text-yellow-600" },
    { icon: FileText, label: t('actions.view_reports'), href: "/reports", color: "text-purple-600" },
    { icon: MessageSquare, label: t('actions.send_communication'), href: "/communications", color: "text-pink-600" },
    { icon: Building, label: t('actions.manage_departments'), href: "/departments", color: "text-indigo-600" }
  ]

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <WithPermission requiredPermissions={[PermissionResolverName.Institutions]}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t('dashboard.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('dashboard.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          minCardsForCarousel={4}
          showCarousel={true}
        />

        {/* Charts Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Analytics Overview</h3>
          <ResponsiveGridCarousel autoplayDelay={4000} className="p-4">
            <GrowthChart />
            {/* <UsersChart /> */}
            <SubsidyStatusChart />
            <BudgetChart />
          </ResponsiveGridCarousel>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">User Management</h3>
          <UseTable
            columns={userColumns}
            data={users}
            searchKey="name"
            filters={[
              {
                id: "role",
                title: "Role",
                options: Array.from(new Set(users?.flatMap(user => user?.user_roles?.map(role => role.role.name) || []) || [])).map(role => ({
                  label: role,
                  value: role
                }))
              },
              {
                id: "status",
                title: "Status",
                options: [
                  { label: ts.active, value: "active" },
                  { label: ts.inactive, value: "inactive" },
                ]
              }
            ]}
          />
        </div>

      </div>
      </WithPermission>
    </AppLayout>
  )
}