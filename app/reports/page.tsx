"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/language-selector"
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
import { ReportsTable, ReportTableData } from "@/components/reports/reports-table"
import { CreateReportModal, ReportFormData } from "@/components/modals/project/create-report-modal"
import { ProjectTableData } from "@/components/projects/projects-table"
import { reportsTranslations } from "@/lib/translations/reports"
import {
  mockReports,
  mockDepartments,
  mockProjects,
  reportsKPIs,
  reportsByTypeData,
  reportsByDepartmentData,
  reportsTimelineData,
  reportsStatusData
} from "@/data/mockData"
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  TrendingUp,
  Building,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Download,
  Filter
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInstitution } from "@/contexts/institution-context"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Chart configurations with duotone colors
const reportsChartConfig = {
  reports: {
    label: "Reports",
    color: "#14b8a6", // Teal
  },
  budget: {
    label: "Budget",
    color: "#10b981", // Green
  },
  spent: {
    label: "Spent",
    color: "#3b82f6", // Blue
  },
} satisfies ChartConfig

const timelineChartConfig = {
  submitted: {
    label: "Submitted",
    color: "#3b82f6", // Blue
  },
  approved: {
    label: "Approved",
    color: "#10b981", // Green
  },
  budget_spent: {
    label: "Budget Spent",
    color: "#14b8a6", // Teal
  },
} satisfies ChartConfig

const statusChartConfig = {
  approved: {
    label: "Approved",
    color: "#22c55e", // Green
  },
  in_review: {
    label: "In Review",
    color: "#3b82f6", // Blue
  },
  on_hold: {
    label: "On Hold",
    color: "#f59e0b", // Amber
  },
  needs_adjustment: {
    label: "Needs Adjustment",
    color: "#8b5cf6", // Purple
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444", // Red
  },
} satisfies ChartConfig

export default function ReportsPage() {
  const { t, i18n } = useTranslation()
  const { activeInstitution } = useInstitution()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [reports, setReports] = useState<ReportTableData[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectTableData | null>(null)
  
  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  
  // Get translations for current language (English primary)
  const t_reports = reportsTranslations["en"] // Force English as requested

  const breadcrumbs = useMemo(() => [
    { name: t_reports.reportsPage }
  ], [t_reports])

  usePageTitle({
    title: t_reports.reportsPage,
    breadcrumbs
  })

  // Transform mock data to table format
  const transformReportsData = (reportsData: typeof mockReports): ReportTableData[] => {
    return reportsData.map(report => ({
      ...report,
      report_type: report.report_type as "financial" | "progress" | "annual",
      report_status: report.report_status as "approved" | "in_review" | "on_hold" | "needs_adjustment" | "rejected",
      total_project_budget_left: report.total_project_budget - report.total_project_budget_spent
    }))
  }

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = transformReportsData(mockReports)
    
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(report => report.department_id === selectedDepartment)
    }
    
    if (selectedType !== "all") {
      filtered = filtered.filter(report => report.report_type === selectedType)
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(report => report.report_status === selectedStatus)
    }
    
    if (selectedPeriod !== "all") {
      const now = new Date()
      const filterDate = new Date()
      
      switch (selectedPeriod) {
        case "30d":
          filterDate.setDate(now.getDate() - 30)
          break
        case "90d":
          filterDate.setDate(now.getDate() - 90)
          break
        case "6m":
          filterDate.setMonth(now.getMonth() - 6)
          break
        case "1y":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
        case "current":
          filterDate.setMonth(0, 1) // Start of current year
          break
      }
      
      if (selectedPeriod !== "all") {
        filtered = filtered.filter(report => new Date(report.submission_date) >= filterDate)
      }
    }
    
    return filtered
  }, [selectedDepartment, selectedType, selectedStatus, selectedPeriod])

  // Calculate KPIs based on filtered data
  const kpis = useMemo(() => {
    const filtered = filteredData
    return {
      totalReports: filtered.length,
      approvedReports: filtered.filter(r => r.report_status === "approved").length,
      pendingReports: filtered.filter(r => ["in_review", "on_hold", "needs_adjustment"].includes(r.report_status)).length,
      rejectedReports: filtered.filter(r => r.report_status === "rejected").length,
      totalBudgetSpent: filtered.reduce((sum, r) => sum + r.total_project_budget_spent, 0),
      totalBudgetApproved: filtered.reduce((sum, r) => sum + r.total_subsidies_approved, 0),
      averageProgress: filtered.length > 0 ? filtered.reduce((sum, r) => sum + r.progress_percentage, 0) / filtered.length : 0,
    }
  }, [filteredData])

  // Simulate data loading
  useEffect(() => {
    const loadReportsData = async () => {
      const loadingToast = toast.loading(t_reports.toasts.loadingData)
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setReports(transformReportsData(mockReports))
        
        toast.dismiss(loadingToast)
        toast.success("📊 Reports data loaded successfully!", {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t_reports.toasts.errorLoading)
        setIsLoading(false)
      }
    }

    loadReportsData()
  }, [t_reports])

  const handleRefresh = async () => {
    setRefreshing(true)
    
    const refreshToast = toast.loading("Refreshing reports data...")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setReports(transformReportsData(mockReports))
      
      toast.dismiss(refreshToast)
      toast.success(t_reports.toasts.dataRefreshed, {
        duration: 2000
      })
      
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(t_reports.toasts.errorLoading)
    } finally {
      setRefreshing(false)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "department":
        setSelectedDepartment(value)
        break
      case "type":
        setSelectedType(value)
        break
      case "status":
        setSelectedStatus(value)
        break
      case "period":
        setSelectedPeriod(value)
        break
    }
    toast.success(t_reports.toasts.filterApplied, { duration: 1500 })
  }

  const handleViewReport = (report: ReportTableData) => {
    toast.success(`👁️ Viewing report: ${report.title}`, { duration: 2000 })
  }

  const handleEditReport = (report: ReportTableData) => {
    toast.success(`✏️ Editing report: ${report.title}`, { duration: 2000 })
  }

  const handleDeleteReport = (report: ReportTableData) => {
    setReports(prev => prev.filter(r => r.id !== report.id))
    toast.success(t_reports.toasts.reportDeleted, { duration: 3000 })
  }

  const handleDownloadReport = (report: ReportTableData) => {
    toast.success(`📄 Downloading report: ${report.title}`, { duration: 2000 })
  }

  const handleCreateReport = () => {
    // Create a default project for the modal when creating from reports page
    const defaultProject: ProjectTableData = {
      id: "default",
      department_id: mockDepartments[0]?.id || "1",
      title: "General Report",
      description: "General report creation",
      budget: 0,
      is_private: false,
      required_volunteers: false,
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      language_preference: "en",
      institutionId: activeInstitution?.id || "1",
      status: "active",
      subsidyRequests: 0,
      subsidyAmount: 0,
      activities: 0
    }
    
    setSelectedProject(defaultProject)
    setIsCreateModalOpen(true)
  }

  const handleCreateSubmit = (data: ReportFormData) => {
    const newReport: ReportTableData = {
      id: `new-${Date.now()}`,
      title: data.title,
      description: data.description,
      report_type: data.report_type,
      project_id: selectedProject?.id || "default",
      department_id: selectedProject?.department_id || mockDepartments[0]?.id || "1",
      submission_date: data.submission_date.toISOString(),
      report_status: data.report_status,
      total_project_budget: data.project_budget_total,
      total_project_budget_spent: data.project_budget_spent,
      total_project_budget_left: data.project_budget_total - data.project_budget_spent,
      total_subsidies_requested: data.total_subsidies_requested,
      total_subsidies_approved: data.total_subsidies_approved,
      progress_percentage: data.completion_percentage,
      report_note: data.report_note,
      attached_file: data.attached_file_path,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "current_user",
      updated_by: "current_user"
    }

    setReports(prev => [newReport, ...prev])
    setIsCreateModalOpen(false)
    setSelectedProject(null)
    toast.success(t_reports.toasts.reportCreated, { duration: 3000 })
  }

  // Period selector component
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t_reports.reportsDashboard}
            </h2>
            <p className="text-muted-foreground">
              Comprehensive view of all project reports and their financial status
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedDepartment} onValueChange={(value) => handleFilterChange("department", value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t_reports.filters.allDepartments}</SelectItem>
                {mockDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t_reports.filters.allTypes}</SelectItem>
                <SelectItem value="financial">{t_reports.types.financial}</SelectItem>
                <SelectItem value="progress">{t_reports.types.progress}</SelectItem>
                <SelectItem value="annual">{t_reports.types.annual}</SelectItem>
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
            
            <Button onClick={handleCreateReport} className="gap-2">
              <Plus className="w-4 h-4" />
              {t_reports.actions.createReport}
            </Button>
            
            <LanguageSelector />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_reports.kpis.totalReports}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalReports}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {kpis.approvedReports} approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_reports.kpis.totalBudgetSpent}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${kpis.totalBudgetSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${kpis.totalBudgetApproved.toLocaleString()} approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_reports.kpis.averageProgress}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.averageProgress.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {kpis.pendingReports} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_reports.kpis.approvedReports}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{kpis.approvedReports}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((kpis.approvedReports / (kpis.totalReports || 1)) * 100)}% approval rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Reports by Type */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  {t_reports.charts.reportsByType}
                </CardTitle>
                <CardDescription className="mt-1">
                  Distribution of reports by type
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={statusChartConfig} className="h-[350px] w-full">
                <RechartsPieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={reportsByTypeData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    strokeWidth={2}
                    paddingAngle={2}
                  >
                    {reportsByTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#14b8a6", "#3b82f6", "#8b5cf6"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Reports by Department */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t_reports.charts.reportsByDepartment}
                </CardTitle>
                <CardDescription className="mt-1">
                  Budget spent and progress by department
                </CardDescription>
              </div>
              <PeriodSelector
                value={selectedPeriod}
                onChange={(value) => handleFilterChange("period", value)}
                options={[
                  { value: "all", label: "All Time" },
                  { value: "30d", label: "30D" },
                  { value: "90d", label: "90D" },
                  { value: "6m", label: "6M" },
                  { value: "1y", label: "1Y" }
                ]}
              />
            </CardHeader>
            <CardContent>
              <ChartContainer config={reportsChartConfig} className="h-[350px] w-full">
                <BarChart data={reportsByDepartmentData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="department"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={11}
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
                  <Legend />
                  <Bar dataKey="reports" fill="#14b8a6" radius={4} name="Reports" />
                  <Bar dataKey="budget_spent" fill="#3b82f6" radius={4} name="Budget Spent" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                {t_reports.charts.reportsTimeline}
              </CardTitle>
              <CardDescription className="mt-1">
                Monthly report submissions and budget spent
              </CardDescription>
            </div>
            <PeriodSelector
              value={selectedPeriod}
              onChange={(value) => handleFilterChange("period", value)}
              options={[
                { value: "6m", label: t_reports.filters.last6Months },
                { value: "1y", label: t_reports.filters.lastYear },
                { value: "current", label: t_reports.filters.currentYear }
              ]}
            />
          </CardHeader>
          <CardContent>
            <ChartContainer config={timelineChartConfig} className="h-[400px] w-full">
              <AreaChart data={reportsTimelineData}>
                <defs>
                  <linearGradient id="fillSubmitted" x1="0" y1="0" x2="0" y2="1">
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
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="submitted"
                  type="natural"
                  fill="url(#fillSubmitted)"
                  stroke="#3b82f6"
                  stackId="a"
                  name="Submitted"
                />
                <Area
                  dataKey="approved"
                  type="natural"
                  fill="url(#fillApproved)"
                  stroke="#10b981"
                  stackId="a"
                  name="Approved"
                />
                <Legend />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t_reports.reportsOverview}
              </CardTitle>
              <CardDescription>
                Detailed table with all reports and their information
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={selectedStatus} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t_reports.filters.allStatuses}</SelectItem>
                  <SelectItem value="approved">{t_reports.statuses.approved}</SelectItem>
                  <SelectItem value="in_review">{t_reports.statuses.inReview}</SelectItem>
                  <SelectItem value="on_hold">{t_reports.statuses.onHold}</SelectItem>
                  <SelectItem value="needs_adjustment">{t_reports.statuses.needsAdjustment}</SelectItem>
                  <SelectItem value="rejected">{t_reports.statuses.rejected}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ReportsTable
              data={filteredData}
              onView={handleViewReport}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onDownload={handleDownloadReport}
            />
          </CardContent>
        </Card>

        {/* Create Report Modal */}
        {selectedProject && (
          <CreateReportModal
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false)
              setSelectedProject(null)
            }}
            onSubmit={handleCreateSubmit}
            project={selectedProject}
          />
        )}
      </div>
    </AppLayout>
  )
}