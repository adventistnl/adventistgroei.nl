"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { 
  TrendingUp, 
  Users,
  MapPin,
  DollarSign
} from "lucide-react"

// Chart configurations
const churchesByRegionConfig = {
  churches: {
    label: "Churches",
    color: "#3b82f6",
  },
  members: {
    label: "Members",
    color: "#10b981",
  },
} satisfies ChartConfig

const usersByRoleConfig = {
  users: {
    label: "Users",
    color: "#f59e0b",
  },
} satisfies ChartConfig

const subsidyOverTimeConfig = {
  requests: {
    label: "Requests",
    color: "#3b82f6",
  },
  amount: {
    label: "Amount",
    color: "#10b981",
  },
} satisfies ChartConfig

const monthlySubsidiesConfig = {
  approved: {
    label: "Approved",
    color: "#22c55e",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  under_review: {
    label: "Under Review",
    color: "#3b82f6",
  },
} satisfies ChartConfig

interface InstitutionsChartsProps {
  churchesByRegionData: Array<{
    region: string
    churches: number
    members: number
  }>
  usersByRoleData: Array<{
    name: string
    value: number
    color: string
  }>
  subsidyOverTimeData: Array<{
    month: string
    requests: number
    amount: number
  }>
  monthlySubsidiesData: Array<{
    month: string
    approved: number
    pending: number
    under_review: number
  }>
  loading?: boolean
  institutionName?: string
}

export function InstitutionsCharts({
  churchesByRegionData,
  usersByRoleData,
  subsidyOverTimeData,
  monthlySubsidiesData,
  loading = false,
  institutionName
}: InstitutionsChartsProps) {
  const { t } = useTranslation()
  const [chartPeriod, setChartPeriod] = React.useState("6m")

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {t('institutions.charts.title', { institution: institutionName || 'All Institutions' })}
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed analytics and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={chartPeriod} onValueChange={setChartPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Churches by Region - Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {t('institutions.charts.churches_by_region')}
              </CardTitle>
              <CardDescription className="mt-1">
                Distribution of churches across regions
              </CardDescription>
            </div>
            <Badge variant="outline">
              {churchesByRegionData.length} regions
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={churchesByRegionConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={churchesByRegionData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="region"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="churches" fill="#3b82f6" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Users by Role - Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                {t('institutions.charts.users_by_role')}
              </CardTitle>
              <CardDescription className="mt-1">
                User distribution by role
              </CardDescription>
            </div>
            <Badge variant="outline">
              {usersByRoleData.reduce((sum, item) => sum + item.value, 0)} users
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={usersByRoleConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={usersByRoleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  {usersByRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                  <Legend />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subsidy Requests Over Time - Line Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                {t('institutions.charts.subsidy_over_time')}
              </CardTitle>
              <CardDescription className="mt-1">
                Monthly subsidy request trends
              </CardDescription>
            </div>
            <Badge variant="outline">
              {subsidyOverTimeData.reduce((sum, item) => sum + item.requests, 0)} requests
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={subsidyOverTimeConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={subsidyOverTimeData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  yAxisId="requests"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  orientation="left"
                />
                <YAxis
                  yAxisId="amount"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  orientation="right"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  yAxisId="requests"
                  dataKey="requests"
                  type="monotone"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
                <Line
                  yAxisId="amount"
                  dataKey="amount"
                  type="monotone"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Legend />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Subsidies - Area Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                {t('institutions.charts.monthly_subsidies')}
              </CardTitle>
              <CardDescription className="mt-1">
                Monthly subsidy amounts by status
              </CardDescription>
            </div>
            <Badge variant="outline">
              {formatCurrency(
                monthlySubsidiesData.reduce(
                  (sum, item) => sum + item.approved + item.pending + item.under_review, 
                  0
                )
              )}
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlySubsidiesConfig} className="h-[300px] w-full">
              <AreaChart accessibilityLayer data={monthlySubsidiesData}>
                <defs>
                  <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillUnderReview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
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
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  dataKey="approved"
                  type="natural"
                  fill="url(#fillApproved)"
                  stroke="#22c55e"
                  stackId="a"
                />
                <Area
                  dataKey="pending"
                  type="natural"
                  fill="url(#fillPending)"
                  stroke="#f59e0b"
                  stackId="a"
                />
                <Area
                  dataKey="under_review"
                  type="natural"
                  fill="url(#fillUnderReview)"
                  stroke="#3b82f6"
                  stackId="a"
                />
                <Legend />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
