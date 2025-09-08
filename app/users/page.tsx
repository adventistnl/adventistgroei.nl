"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/language-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Shield,
  TrendingUp,
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Settings,
  RefreshCw
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts"

// Mock Data
import {
  users,
  roles,
  institutions,
  churches,
  regions,
  departments,
  getUsersKPIs,
  getUsersByRole,
  getUsersByInstitution,
  getUsersByRegion,
  getUserGrowthOverTime,
  type User,
  type Role,
  type Institution,
  type Church,
  type Region,
  type Department
} from "@/data/usersData"

// User Modals
import { CreateUserModal, EditUserModal, DeleteUserModal } from "@/components/modals/user"

// Data Table
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

export default function UsersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Modal states (for future modal components)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)

  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: t('users.title') }
  ], [t])

  usePageTitle({
    title: t('users.title'),
    breadcrumbs
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading("Loading users data...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success("👥 Users data loaded successfully!", {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("❌ Failed to load users data")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    
    const refreshToast = toast.loading("🔄 Refreshing data...")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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

  // Filter users based on search and status
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && !user.is_deleted) ||
                           (statusFilter === 'inactive' && user.is_deleted)
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  // User action handlers
  const handleViewUser = (user: User) => {
    router.push(`/users/${user.id}`)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteUserOpen(true)
  }

  const handleCreateUser = () => {
    setIsCreateUserOpen(true)
  }

  // Get analytics data
  const kpiData = getUsersKPIs()
  const roleDistributionData = getUsersByRole()
  const institutionDistributionData = getUsersByInstitution()
  const regionDistributionData = getUsersByRegion()
  const growthData = getUserGrowthOverTime()

  // User table columns
  const userColumns: ColumnDef<User>[] = [
    {
      id: "avatar",
      header: t('users.table.avatar'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: t('users.table.name'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              ID: {user.id.slice(0, 8)}...
            </div>
          </div>
        )
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: t('users.table.email'),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.email}</div>
      ),
    },
    {
      id: "language",
      accessorKey: "language_preference",
      header: t('users.table.language'),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.language_preference.toUpperCase()}
        </Badge>
      ),
    },
    {
      id: "institution",
      accessorKey: "institution_name",
      header: t('users.table.institution'),
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate">{row.original.institution_name}</div>
      ),
    },
    {
      id: "church",
      accessorKey: "church_name",
      header: t('users.table.church'),
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate">{row.original.church_name}</div>
      ),
    },
    {
      id: "roles",
      header: t('users.table.roles'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex flex-wrap gap-1">
            {user.user_roles.map((role) => (
              <Badge 
                key={role.id} 
                variant={role.key_code === 'ADMIN' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {role.key_code === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
                {role.name}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: "status",
      header: t('users.table.status'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <Badge 
            variant={user.is_deleted ? 'destructive' : 'default'}
            className={user.is_deleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
          >
            {user.is_deleted ? t('users.table.inactive') : t('users.table.active')}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: t('users.table.actions'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                <Eye className="mr-2 h-4 w-4" />
                {t('users.actions.view_details')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('users.actions.edit_user')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteUser(user)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('users.actions.delete_user')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Chart configurations
  const roleChartConfig = {
    users: {
      label: "Users",
      color: "#3b82f6",
    },
  } satisfies ChartConfig

  const institutionChartConfig = {
    users: {
      label: "Users",
      color: "#10b981",
    },
  } satisfies ChartConfig

  const growthChartConfig = {
    active: {
      label: "Active Users",
      color: "#10b981",
    },
    total: {
      label: "Total Users",
      color: "#3b82f6",
    },
  } satisfies ChartConfig

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t('users.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('users.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.kpis.total_users')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {t('users.kpis.total_users_description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.kpis.active_users')}</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{kpiData.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((kpiData.activeUsers / kpiData.totalUsers) * 100)}% {t('users.kpis.of_total')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.kpis.new_users_month')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpiData.newUsersThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                {t('users.kpis.new_users_month_description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.kpis.inactive_users')}</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{kpiData.inactiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                {t('users.kpis.deleted_users_description')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('users.charts.users_by_role')}
              </CardTitle>
              <CardDescription>
                {t('users.charts.users_by_role_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={roleChartConfig} className="h-[300px] w-full">
                <BarChart data={roleDistributionData}>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    dataKey="role" 
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Users by Institution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {t('users.charts.users_by_institution')}
              </CardTitle>
              <CardDescription>
                {t('users.charts.users_by_institution_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={institutionChartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={institutionDistributionData}
                    dataKey="users"
                    nameKey="institution"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                  >
                    {institutionDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"
                        ][index % 5]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('users.charts.user_growth')}
              </CardTitle>
              <CardDescription>
                {t('users.charts.user_growth_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={growthChartConfig} className="h-[300px] w-full">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="active"
                    type="natural"
                    fill="url(#fillActive)"
                    stroke="#10b981"
                    stackId="a"
                  />
                  <Area
                    dataKey="total"
                    type="natural"
                    fill="url(#fillTotal)"
                    stroke="#3b82f6"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('users.table.title')}
                </CardTitle>
                <CardDescription>
                  {t('users.table.description')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={userColumns}
              data={users.filter(u => !u.is_deleted)}
              searchKey="name"
              searchPlaceholder={t('users.table.search_placeholder')}
              filterableColumns={[
                {
                  id: "institution_name",
                  title: "Institution",
                  options: institutions.map(inst => ({ 
                    label: inst.name.length > 30 ? inst.name.substring(0, 30) + '...' : inst.name, 
                    value: inst.name 
                  }))
                },
                {
                  id: "church_name",
                  title: "Church",
                  options: churches.map(church => ({ 
                    label: church.name, 
                    value: church.name 
                  }))
                },
                {
                  id: "language_preference",
                  title: "Language",
                  options: [
                    { label: "English", value: "en" },
                    { label: "Portuguese", value: "pt" },
                    { label: "Spanish", value: "es" },
                    { label: "Dutch", value: "nl" }
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* User Details Sheet */}
        <Sheet open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t('users.modals.user_details.title')}</SheetTitle>
              <SheetDescription>
                {t('users.modals.user_details.description')}
              </SheetDescription>
            </SheetHeader>
            
            {selectedUser && (
              <div className="space-y-6 mt-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('users.modals.user_details.basic_info')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-lg">
                          {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                        <p className="text-muted-foreground">{selectedUser.email}</p>
                        <Badge 
                          variant={selectedUser.is_deleted ? 'destructive' : 'default'}
                          className="mt-1"
                        >
                          {selectedUser.is_deleted ? 'Inactive' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Language:</span>
                        <p className="text-muted-foreground">{selectedUser.language_preference}</p>
                      </div>
                      <div>
                        <span className="font-medium">User ID:</span>
                        <p className="text-muted-foreground font-mono">{selectedUser.id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Organizational Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      {t('users.modals.user_details.contact_info')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Institution:</span>
                        <span className="text-sm">{selectedUser.institution_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Church:</span>
                        <span className="text-sm">{selectedUser.church_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Created:</span>
                        <span className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Updated:</span>
                        <span className="text-sm">{new Date(selectedUser.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Roles & Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {t('users.modals.user_details.roles_permissions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedUser.user_roles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {role.name}
                                {role.key_code === 'ADMIN' && <Crown className="w-4 h-4 text-yellow-500" />}
                              </div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {role.key_code}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => handleEditUser(selectedUser)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    {t('users.actions.edit_user')}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteUser(selectedUser)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('users.actions.delete_user')}
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* User Modals */}
        <CreateUserModal
          isOpen={isCreateUserOpen}
          onOpenChange={setIsCreateUserOpen}
          institutions={institutions}
          churches={churches}
          regions={regions}
          departments={departments}
          roles={roles}
          onSuccess={(userData) => {
            console.log('User created:', userData)
            // Here you would typically refresh the users list
          }}
        />

        <EditUserModal
          isOpen={isEditUserOpen}
          onOpenChange={setIsEditUserOpen}
          user={selectedUser}
          institutions={institutions}
          churches={churches}
          regions={regions}
          departments={departments}
          roles={roles}
          onSuccess={(userData) => {
            console.log('User updated:', userData)
            setSelectedUser(null)
            // Here you would typically refresh the users list
          }}
        />

        <DeleteUserModal
          isOpen={isDeleteUserOpen}
          onOpenChange={setIsDeleteUserOpen}
          user={selectedUser}
          onSuccess={(deletedUser) => {
            console.log('User deleted:', deletedUser.name)
            setSelectedUser(null)
            // Here you would typically refresh the users list
          }}
        />
      </div>
    </AppLayout>
  )
}
