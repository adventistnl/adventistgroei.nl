"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  Building,
  MapPin,
  Home,
  Shield,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  Edit,
  Trash2,
  ArrowLeft,
  Crown,
  AlertTriangle,
  CheckCircle,
  Send,
  Clock,
  TrendingUp,
  Activity,
  Mail,
  MoreHorizontal,
  Phone,
  Globe,
  MapPinIcon,
  Eye,
  ExternalLink
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from "recharts"

// Data
import {
  getUserById,
  getUserStats,
  getUserSubsidyRequests,
  getUserEventRegistrations,
  getUserCommunications,
  getUserAnnualReports,
  getUserSubsidyTrends,
  getUserEventTrends,
  getUserReportTrends,
  getUserCommunicationTrends,
  users,
  institutions,
  churches,
  regions,
  departments,
  roles,
  type User,
  type Institution,
  type Church,
  type Region,
  type Department
} from "@/data/usersData"

// User Modals
import { EditUserModal, DeleteUserModal } from "@/components/modals/user"

// Chat Component
import { ChatDrawer } from "@/components/chat"

// Shared Components
import { UserProfileHeader } from "@/components/shared"

export default function UserProfilePage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState("subsidies")
  
  // Chart period states
  const [subsidyPeriod, setSubsidyPeriod] = useState(12)
  const [eventPeriod, setEventPeriod] = useState(12)
  const [reportPeriod, setReportPeriod] = useState(12)
  const [communicationPeriod, setCommunicationPeriod] = useState(12)

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const loadingToast = toast.loading("Loading user profile...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const userData = getUserById(userId)
        if (!userData) {
          toast.dismiss(loadingToast)
          toast.error("User not found")
          router.push('/users')
          return
        }
        
        setUser(userData)
        toast.dismiss(loadingToast)
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("Failed to load user profile")
        setIsLoading(false)
      }
    }

    if (userId) {
      loadUserData()
    }
  }, [userId, router])

  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users", href: "/users" },
    { name: user?.name || "Profile" }
  ], [user])

  usePageTitle({
    title: user?.name || "User Profile",
    breadcrumbs
  })

  // Get related data
  const userInstitution = useMemo(() => 
    institutions.find(inst => inst.id === user?.institution_id), [user]
  )
  
  const userChurch = useMemo(() => 
    churches.find(church => church.id === user?.church_id), [user]
  )
  
  const userRegion = useMemo(() => 
    regions.find(region => region.id === user?.region_id), [user]
  )
  
  const userDepartment = useMemo(() => 
    departments.find(dept => dept.id === user?.department_id), [user]
  )

  // Get user activity data
  const userStats = useMemo(() => 
    user ? getUserStats(user.id) : null, [user]
  )
  
  const userSubsidies = useMemo(() => 
    user ? getUserSubsidyRequests(user.id) : [], [user]
  )
  
  const userEvents = useMemo(() => 
    user ? getUserEventRegistrations(user.id) : [], [user]
  )
  
  const userCommunications = useMemo(() => 
    user ? getUserCommunications(user.id) : [], [user]
  )
  
  const userReports = useMemo(() => 
    user ? getUserAnnualReports(user.id) : [], [user]
  )

  // Temporal analytics data
  const subsidyTrends = useMemo(() => 
    user ? getUserSubsidyTrends(user.id, subsidyPeriod) : [], [user, subsidyPeriod]
  )
  
  const eventTrends = useMemo(() => 
    user ? getUserEventTrends(user.id, eventPeriod) : [], [user, eventPeriod]
  )
  
  const reportTrends = useMemo(() => 
    user ? getUserReportTrends(user.id, reportPeriod) : [], [user, reportPeriod]
  )
  
  const communicationTrends = useMemo(() => 
    user ? getUserCommunicationTrends(user.id, communicationPeriod) : [], [user, communicationPeriod]
  )

  // Mock current user (in real app, this would come from auth context)
  const currentUser = useMemo(() => 
    users.find(u => u.id === 'u1') || user, [user]
  )

  // Chart configurations (using dashboard style)
  const subsidyChartConfig = {
    requested: { label: "Requested", color: "#8b5cf6" },
    approved: { label: "Approved", color: "#10b981" },
    rejected: { label: "Rejected", color: "#ef4444" }
  } satisfies ChartConfig

  const eventChartConfig = {
    registered: { label: "Registered", color: "#3b82f6" },
    attended: { label: "Attended", color: "#10b981" },
    created: { label: "Created", color: "#f59e0b" }
  } satisfies ChartConfig

  const reportChartConfig = {
    submitted: { label: "Submitted", color: "#0d9488" },
    approved: { label: "Approved", color: "#10b981" },
    pending: { label: "Pending", color: "#f59e0b" }
  } satisfies ChartConfig

  const communicationChartConfig = {
    authored: { label: "Authored", color: "#ea580c" },
    received: { label: "Received", color: "#3b82f6" },
    sent: { label: "Sent", color: "#10b981" }
  } satisfies ChartConfig

  // Period selector component
  const PeriodSelector = ({ value, onChange, options }: {
    value: number
    onChange: (value: number) => void
    options: { value: number; label: string }[]
  }) => (
    <Select value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
      <SelectTrigger className="w-24 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'paid': case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': case 'reserved': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'rejected': case 'canceled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="bg-gradient-to-r from-muted to-muted/50 rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-muted-foreground/20 rounded-full"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-8 bg-muted-foreground/20 rounded w-1/3"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
                    <div className="h-6 bg-muted-foreground/20 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The requested user could not be found.
              </p>
              <Button onClick={() => router.push('/users')} variant="outline">
                Back to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* User Profile Header */}
        <UserProfileHeader
          user={user}
          userInstitution={userInstitution}
          userChurch={userChurch}
          userRegion={userRegion}
          userDepartment={userDepartment}
          onSendMessage={() => setIsMessageDrawerOpen(true)}
          onViewContact={() => setIsContactModalOpen(true)}
          onEditUser={() => setIsEditModalOpen(true)}
          onDeleteUser={() => setIsDeleteModalOpen(true)}
          showBackButton={true}
          onBack={() => router.back()}
        />

        <Separator className="my-6" />

        {/* Activity Analytics with Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{t('users.profile.analytics.title')}</h3>
              <p className="text-muted-foreground">{t('users.profile.analytics.subtitle')}</p>
            </div>
          </div>

          <Tabs value={activeAnalyticsTab} onValueChange={setActiveAnalyticsTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subsidies" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Subsidies
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="communications" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Communications
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Events
              </TabsTrigger>
            </TabsList>

            {/* Subsidies Tab */}
            <TabsContent value="subsidies" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subsidy Chart */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        {t('users.profile.analytics.subsidy_trends')}
                      </CardTitle>
                      <CardDescription>{t('users.profile.analytics.subsidy_description')}</CardDescription>
                    </div>
                    <PeriodSelector
                      value={subsidyPeriod}
                      onChange={setSubsidyPeriod}
                      options={[
                        { value: 6, label: "6M" },
                        { value: 12, label: "1Y" },
                        { value: 24, label: "2Y" }
                      ]}
                    />
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={subsidyChartConfig} className="h-[300px] w-full">
                      <AreaChart data={subsidyTrends}>
                        <defs>
                          <linearGradient id="fillRequested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
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
                        <Area
                          dataKey="approved"
                          type="natural"
                          fill="url(#fillApproved)"
                          stroke="#10b981"
                          stackId="a"
                        />
                        <Area
                          dataKey="requested"
                          type="natural"
                          fill="url(#fillRequested)"
                          stroke="#8b5cf6"
                          stackId="a"
                        />
                        <Legend />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Recent Subsidies Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Subsidy Requests
                    </CardTitle>
                    <CardDescription>Latest subsidy activity and status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userSubsidies.slice(0, 5).map((subsidy) => (
                          <TableRow key={subsidy.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[200px] truncate">{subsidy.description}</div>
                            </TableCell>
                            <TableCell>${subsidy.total_budget.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(subsidy.status)}>
                                {subsidy.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(subsidy.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {userSubsidies.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No subsidy requests found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Events Chart */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Event Participation Trends
                      </CardTitle>
                      <CardDescription>Monthly event registration and attendance</CardDescription>
                    </div>
                    <PeriodSelector
                      value={eventPeriod}
                      onChange={setEventPeriod}
                      options={[
                        { value: 6, label: "6M" },
                        { value: 12, label: "1Y" },
                        { value: 24, label: "2Y" }
                      ]}
                    />
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={eventChartConfig} className="h-[300px] w-full">
                      <LineChart data={eventTrends}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
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
                        <Line
                          dataKey="registered"
                          type="monotone"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          dataKey="attended"
                          type="monotone"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          dataKey="created"
                          type="monotone"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Recent Events Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('users.tables.recent_events')}
                    </CardTitle>
                    <CardDescription>Latest event activity and participation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('users.tables.event')}</TableHead>
                          <TableHead>{t('users.tables.type')}</TableHead>
                          <TableHead>{t('users.tables.status')}</TableHead>
                          <TableHead>{t('users.tables.date')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userEvents.slice(0, 5).map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[200px] truncate">{registration.event.title}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{registration.event.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(registration.status)}>
                                {registration.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(registration.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {userEvents.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              {t('users.tables.no_data')}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reports Chart */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-600" />
                        Report Submission Trends
                      </CardTitle>
                      <CardDescription>Quarterly and annual report submissions</CardDescription>
                    </div>
                    <PeriodSelector
                      value={reportPeriod}
                      onChange={setReportPeriod}
                      options={[
                        { value: 12, label: "1Y" },
                        { value: 24, label: "2Y" },
                        { value: 36, label: "3Y" }
                      ]}
                    />
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={reportChartConfig} className="h-[300px] w-full">
                      <BarChart data={reportTrends}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
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
                        <Bar dataKey="submitted" fill="#0d9488" radius={4} />
                        <Bar dataKey="approved" fill="#10b981" radius={4} />
                        <Bar dataKey="pending" fill="#f59e0b" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Recent Reports Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('users.tables.recent_reports')}
                    </CardTitle>
                    <CardDescription>Latest report submissions and approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('users.tables.report_id')}</TableHead>
                          <TableHead>{t('users.tables.department')}</TableHead>
                          <TableHead>{t('users.tables.status')}</TableHead>
                          <TableHead>{t('users.tables.date')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userReports.slice(0, 5).map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">
                              <div className="font-mono text-xs">#{report.id.slice(0, 8)}</div>
                            </TableCell>
                            <TableCell>{userDepartment?.name || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-700">
                                Submitted
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(report.submission_date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {userReports.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              {t('users.tables.no_data')}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Communications Chart */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                        Communication Activity Trends
                      </CardTitle>
                      <CardDescription>Monthly communication patterns</CardDescription>
                    </div>
                    <PeriodSelector
                      value={communicationPeriod}
                      onChange={setCommunicationPeriod}
                      options={[
                        { value: 6, label: "6M" },
                        { value: 12, label: "1Y" },
                        { value: 24, label: "2Y" }
                      ]}
                    />
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={communicationChartConfig} className="h-[300px] w-full">
                      <AreaChart data={communicationTrends}>
                        <defs>
                          <linearGradient id="fillAuthored" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="fillReceived" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
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
                        <Area
                          dataKey="authored"
                          type="natural"
                          fill="url(#fillAuthored)"
                          stroke="#ea580c"
                          stackId="a"
                        />
                        <Area
                          dataKey="received"
                          type="natural"
                          fill="url(#fillReceived)"
                          stroke="#3b82f6"
                          stackId="a"
                        />
                        <Area
                          dataKey="sent"
                          type="natural"
                          fill="url(#fillSent)"
                          stroke="#10b981"
                          stackId="a"
                        />
                        <Legend />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Recent Communications Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('users.tables.recent_communications')}
                    </CardTitle>
                    <CardDescription>Latest communication activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('users.tables.title')}</TableHead>
                          <TableHead>{t('users.tables.type')}</TableHead>
                          <TableHead>{t('users.tables.priority')}</TableHead>
                          <TableHead>{t('users.tables.date')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userCommunications.slice(0, 5).map((comm) => (
                          <TableRow key={comm.id}>
                            <TableCell className="font-medium">
                              <div className="max-w-[200px] truncate">{comm.title}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{comm.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={comm.priority === 'high' ? 'border-red-200 text-red-700' : 
                                          comm.priority === 'medium' ? 'border-yellow-200 text-yellow-700' : 
                                          'border-green-200 text-green-700'}
                              >
                                {comm.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(comm.published_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {userCommunications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              {t('users.tables.no_data')}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-8" />

        {/* Annual Subsidy Highlights */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{t('users.annual_report.title')}</h3>
              <p className="text-muted-foreground">{t('users.annual_report.description')}</p>
            </div>
            <Select defaultValue="2024">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('users.annual_report.total_requested')}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${(userSubsidies.reduce((sum, s) => sum + s.total_budget, 0)).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('users.annual_report.approved_amount')}</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(userSubsidies.filter(s => s.status === 'approved').reduce((sum, s) => sum + s.total_budget, 0)).toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('users.annual_report.utilization_rate')}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {userSubsidies.length > 0 ? 
                        Math.round((userSubsidies.filter(s => s.status === 'approved').length / userSubsidies.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('users.annual_report.pending_requests')}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {userSubsidies.filter(s => s.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-mono">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Language</span>
                  <Badge variant="outline" className="text-xs">
                    {user.language_preference.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <span className="text-xs font-mono text-muted-foreground">{user.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Login Status</span>
                  <Badge variant={user.is_deleted ? 'destructive' : 'default'}>
                    {user.is_deleted ? 'Disabled' : 'Enabled'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Created</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Assigned Roles</div>
                {user.user_roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm">{role.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{role.key_code}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

                  {/* Recent Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest activities and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recent Subsidies */}
              {userSubsidies.slice(0, 3).map((subsidy) => (
                <div key={subsidy.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Subsidy Request</div>
                    <div className="text-xs text-muted-foreground">{subsidy.description}</div>
                    <div className="text-xs text-muted-foreground">
                      ${subsidy.total_budget.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(subsidy.status)}>
                      {subsidy.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(subsidy.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Recent Events */}
              {userEvents.slice(0, 2).map((registration) => (
                <div key={registration.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Event Registration</div>
                    <div className="text-xs text-muted-foreground">{registration.event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {registration.event.type} • ${registration.event.ticket_amount}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(registration.status)}>
                      {registration.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Recent Communications */}
              {userCommunications.slice(0, 2).map((comm) => (
                <div key={comm.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Communication</div>
                    <div className="text-xs text-muted-foreground">{comm.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {comm.type} • {comm.priority} priority
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(comm.status)}>
                      {comm.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(comm.published_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Show message if no activity */}
              {userSubsidies.length === 0 && userEvents.length === 0 && userCommunications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        </div>


        {/* Chat Drawer */}
        {currentUser && user && (
          <ChatDrawer
            isOpen={isMessageDrawerOpen}
            onOpenChange={setIsMessageDrawerOpen}
            currentUser={currentUser}
            targetUser={user}
          />
        )}

        {/* Contact Modal */}
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </DialogTitle>
              <DialogDescription>
                Contact details for {user.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Contact */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Primary Contact</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{user.email}</div>
                      <div className="text-xs text-muted-foreground">Primary Email</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">+1 (555) 123-4567</div>
                      <div className="text-xs text-muted-foreground">Primary Phone</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">+1 (555) 987-6543</div>
                      <div className="text-xs text-muted-foreground">Mobile</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Address</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">123 Church Street</div>
                      <div className="text-sm text-muted-foreground">Springfield, IL 62701</div>
                      <div className="text-sm text-muted-foreground">United States</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">www.example-church.org</div>
                      <div className="text-xs text-muted-foreground">Website</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Notes</h4>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                Active member of the Springfield Adventist Church. Serves as Youth Ministry coordinator and participates in community outreach programs.
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsContactModalOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Modals */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={user}
          institutions={institutions}
          churches={churches}
          regions={regions}
          departments={departments}
          roles={roles}
          onSuccess={() => {
            toast.success("User updated successfully!")
            // In real app, refetch user data
          }}
        />

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          user={user}
          onSuccess={() => {
            toast.success("User deleted successfully!")
            router.push('/users')
          }}
        />
      </div>
    </AppLayout>
  )
}