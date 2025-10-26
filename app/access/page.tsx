"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Lock,
  Settings,
  Crown,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Activity
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { RoleDistributionChart, PermissionsByGroupChart, UserActivityChart } from "@/components/access/access-charts"
import { UseTable } from "@/components/ui/use-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { AnalyticsGridCarousel } from "@/components/shared/responsive-grid-carousel"

// Role Modals
import { CreateRoleModal, EditRoleModal, DeleteRoleModal } from "@/components/modals/role"

// Data
import {
  users,
  getRoleDistribution,
  getPermissionsByGroup,
  getUserActivityOverTime,
} from "@/data/accessData"
import { useRoles } from "@/hooks/use-roles"
import { Roles_roles as Role } from "@/types/Roles"
import { Permissions_permissions_data as Permission } from "@/types/Permissions"
import { usePermissions } from "@/hooks/use-permissions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useAccessKPI } from "@/hooks/KPI/use-access-kpi"
import { AccessDenied } from "@/components/access/access-denied"

export default function AccessManagementPage() {
  const { t } = useTranslation()
  const { roles } = useRoles({});
  const { permissions } = usePermissions();

  const [isLoading, setIsLoading] = useState(true)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(null)
  const [selectedRoleForDelete, setSelectedRoleForDelete] = useState<Role | null>(null)

  // KPIs via hook integrado
  const {roleDistribution, permissionsByGroup, ...accessKpiData} = useAccessKPI();
  // const userActivityData = getUserActivityOverTime()

  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users & Access" },
    { name: t('access.title') }
  ], [t])

  // KPIs essenciais para overview de roles e permissões
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_roles",
      title: "Total Roles",
      value: roles.length,
      icon: Shield,
      subtitle: "System roles"
    },
    {
      id: "total_permissions",
      title: "Permissions",
      value: permissions.flatMap(p => p.data).length,
      icon: Lock,
      subtitle: "Available permissions"
    },
    {
      id: "admin_roles",
      title: "Admin Roles",
      value: roles.filter(role => role.key_code.includes('ADMIN') || role.key_code.includes('SUPER')).length,
      icon: Crown,
      subtitle: "Administrative roles"
    },
    {
      id: "permission_groups",
      title: "Groups",
      value: permissions.length,
      icon: Activity,
      subtitle: "Permission groups"
    }
  ], [roles, permissions])

  // Componentes individuais de gráficos para o ResponsiveGridCarousel
  const analyticsComponents = useMemo(() => [
    <RoleDistributionChart
      key="role_distribution"
      data={roleDistribution}
      loading={isLoading}
    />,
    <PermissionsByGroupChart
      key="permissions_by_group"
      data={permissionsByGroup}
      loading={isLoading}
    />,
    // <UserActivityChart
    //   key="user_activity"
    //   data={userActivityData}
    //   loading={isLoading}
    // />
  ], [roleDistribution, permissionsByGroup, isLoading])

  usePageTitle({
    title: t('access.title'),
    breadcrumbs
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading("Loading access data...")
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success("Access data loaded successfully!", {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("Failed to load access data")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])


  // Role table columns
  const roleColumns: ColumnDef<Role>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t('access.roles.table.name'),
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{role.name}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {role.key_code}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "key_code",
      accessorKey: "key_code",
      header: "Type",
      cell: ({ row }) => {
        const role = row.original
        return (
          <Badge 
            variant={role.key_code === 'ADMIN' ? 'default' : 'secondary'}
            className="font-mono"
          >
            {role.key_code}
          </Badge>
        )
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: t('access.roles.table.description'),
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate">{row.original.description}</div>
      ),
    },
    {
      id: "permissions_count",
      header: t('access.roles.table.permissions_count'),
      cell: ({ row }) => {
        const role = row.original
        const permissionCount = role.permissions.reduce((sum, group) => sum + group.data.length, 0)
        return (
          <Badge variant="outline">
            {permissionCount} permissions
          </Badge>
        )
      },
    },
    {
      id: "users_count",
      header: t('access.roles.table.users_count'),
      cell: ({ row }) => {
        const userCount = row.original.users?.length || 0
        return (
          <Badge variant="secondary">
            {userCount} users
          </Badge>
        )
      },
    },
    {
      id: "is_fixed",
      header: t('access.roles.table.type'),
      cell: ({ row }) => {
        const isFixed = row.original.is_fixed
        return (
          <Badge variant="secondary">
            {isFixed ? 'Fixed' : 'Customized'}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: t('access.roles.table.actions'),
      cell: ({ row }) => {
        const role = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!role.is_fixed && (
                <DropdownMenuItem
                  onClick={() => {
                  setSelectedRoleForEdit(role)
                  setIsEditRoleOpen(true)
                }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t('access.roles.actions.edit_role')}
                </DropdownMenuItem>
              )}
              <WithPermission requiredPermissions={[PermissionResolverName.UpdateRole]}>
                <DropdownMenuItem
                  onClick={() => handleEditPermissions(role)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t('access.roles.actions.edit_permissions')}
                </DropdownMenuItem>
              </WithPermission>
              {!role.is_fixed && (
                <WithPermission requiredPermissions={[PermissionResolverName.DeleteRole]}>
                  <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedRoleForDelete(role)
                        setIsDeleteRoleOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('access.roles.actions.delete_role')}
                    </DropdownMenuItem>
                </WithPermission>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Permission table columns
  const permissionColumns: ColumnDef<Permission>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t('access.permissions.table.name'),
      cell: ({ row }) => {
        const permission = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{permission.name}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {permission.key_code}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "key_code",
      accessorKey: "key_code",
      header: "Key",
      cell: ({ row }) => {
        const permission = row.original
        return (
          <Badge variant="outline" className="font-mono">
            {permission.key_code}
          </Badge>
        )
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: t('access.permissions.table.description'),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.description}</div>
      ),
    },
    {
      id: "group",
      accessorKey: "group",
      header: t('access.permissions.table.group'),
      cell: ({ row }) => {
        const group = row.original.group
        return (
          <Badge variant="outline" className="font-mono">
            {group}
          </Badge>
        )
      },
    },
  ]

  // Modal handlers
  const handleCreateRoleSuccess = () => {
    // Refresh data or update state as needed
    // In a real app, you might refetch the roles data
  }

  const handleEditRoleSuccess = () => {
    // Refresh data or update state as needed
    setSelectedRoleForEdit(null)
  }

  const handleDeleteRoleSuccess = () => {
    // Refresh data or update state as needed
    setSelectedRoleForDelete(null)
  }

  const handleEditPermissions = (role: Role) => {
    toast.success(`Opening detailed permissions for ${role.name}`)
    window.location.href = `/access/roles/${role.id}`
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
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
      <WithPermission requiredPermissions={[PermissionResolverName.Users, PermissionResolverName.Roles]} fallback={<AccessDenied />}>
        <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">
                {t('access.title')}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {t('access.subtitle')}
              </p>
            </div>
          </div>

          {/* KPI Cards Carrossel */}
          <KPICards 
            data={kpiCardsData}
            isLoading={isLoading}
            minCardsForCarousel={4}
            showCarousel={true}
          />

          <Separator />

          {/* Main Content Tabs */}
          <Tabs defaultValue="roles" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="roles" className="data-[state=active]:bg-background">
                <Shield className="w-4 h-4 mr-2" />
                {t('access.tabs.roles')}
              </TabsTrigger>
              <TabsTrigger value="permissions" className="data-[state=active]:bg-background">
                <Lock className="w-4 h-4 mr-2" />
                {t('access.tabs.permissions')}
              </TabsTrigger>
              <TabsTrigger value="charts" className="data-[state=active]:bg-background">
                <TrendingUp className="w-4 h-4 mr-2" />
                Charts & Analytics
              </TabsTrigger>
            </TabsList>


            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {t('access.roles.title')}
                      </CardTitle>
                      <CardDescription>
                        {t('access.roles.subtitle')}
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsCreateRoleOpen(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('access.roles.actions.create_role')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <UseTable
                    columns={roleColumns}
                    data={roles}
                    searchKey="name"
                    filters={[
                      {
                        id: "key_code",
                        title: "Role Type",
                        options: roles.reduce((acc, role) => {
                          if (!acc.find(item => item.value === role.key_code)) {
                            acc.push({ label: role.key_code, value: role.key_code })
                          }
                          return acc
                        }, [] as { label: string, value: string }[])
                      }
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    {t('access.permissions.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('access.permissions.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UseTable
                    columns={permissionColumns}
                    data={permissions.flatMap(p => p.data.flatMap(perm => perm))}
                    searchKey="name"
                    filters={[
                      {
                        id: "group",
                        title: "Group",
                        options: permissions.reduce((acc, p) => {
                          if (!acc.find(item => item.value === p.group)) {
                            acc.push({ label: p.group, value: p.group })
                          }
                          return acc
                        }, [] as { label: string, value: string }[])
                      }
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Charts & Analytics Tab */}
            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Role Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="w-4 h-4" />
                      Role Distribution
                    </CardTitle>
                    <CardDescription>
                      Overview of role allocation across the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RoleDistributionChart
                      data={roleDistribution}
                      loading={isLoading}
                    />
                  </CardContent>
                </Card>

                {/* Permissions by Group Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lock className="w-4 h-4" />
                      Permissions by Group
                    </CardTitle>
                    <CardDescription>
                      Permission distribution across functional groups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PermissionsByGroupChart
                      data={permissionsByGroup}
                      loading={isLoading}
                    />
                  </CardContent>
                </Card>

                {/* Role Types Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="w-4 h-4" />
                      Role Types
                    </CardTitle>
                    <CardDescription>
                      Breakdown by role categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {roles.reduce((acc, role) => {
                        const type = role.key_code.includes('ADMIN') ? 'Admin' : 
                                    role.key_code.includes('USER') ? 'User' : 
                                    role.key_code.includes('MANAGER') ? 'Manager' : 'Other'
                        const existing = acc.find(item => item.type === type)
                        if (existing) {
                          existing.count++
                        } else {
                          acc.push({ type, count: 1 })
                        }
                        return acc
                      }, [] as { type: string, count: number }[]).map((item, index) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ 
                                backgroundColor: item.type === 'Admin' ? '#ef4444' : 
                                               item.type === 'Manager' ? '#f59e0b' : 
                                               item.type === 'User' ? '#10b981' : '#6b7280'
                              }}
                            />
                            <span className="text-sm font-medium">{item.type}</span>
                          </div>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Permission Groups Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="w-4 h-4" />
                      Permission Groups
                    </CardTitle>
                    <CardDescription>
                      System permission organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {permissions.map((group, index) => (
                        <div key={group.group} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                            />
                            <span className="text-sm font-medium">{group.group}</span>
                          </div>
                          <Badge variant="outline">{group.data.length}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>


          <Separator />
          {/* User Details Sheet */}
          {/* <Sheet open={isUserSheetOpen} onOpenChange={setIsUserSheetOpen}>
            <SheetContent className="w-[600px] sm:max-w-[600px]">
              <SheetHeader>
                <SheetTitle>User Details</SheetTitle>
                <SheetDescription>
                  View and manage user information and permissions
                </SheetDescription>
              </SheetHeader>
              {selectedUser && (
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <span className="text-sm font-medium">{selectedUser.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-mono">{selectedUser.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Institution:</span>
                          <span className="text-sm">{selectedUser.institution_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Church:</span>
                          <span className="text-sm">{selectedUser.church_name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Assigned Roles</h4>
                      <div className="space-y-2">
                        {selectedUser.user_roles.map((role) => (
                          <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <span className="font-medium">{role.name}</span>
                              <Badge variant="outline" className="text-xs">{role.key_code}</Badge>
                            </div>
                            {hasPermission(userPermissions, 'UPDATE_USER') && (
                              <Button size="sm" variant="ghost" className="text-red-600">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet> */}

          {/* Enhanced Role Permissions Sheet */}
          {/* <Sheet open={isRoleSheetOpen} onOpenChange={(open) => {
            if (!open && hasUnsavedChanges) {
              if (confirm(t('access.roles.permissions.unsaved_changes'))) {
                setIsRoleSheetOpen(false)
                setHasUnsavedChanges(false)
                setSelectedPermissions([])
              }
            } else {
              setIsRoleSheetOpen(open)
              if (!open) {
                setSelectedPermissions([])
                setHasUnsavedChanges(false)
              }
            }
          }}>
            <SheetContent className="w-[900px] sm:max-w-[900px] overflow-y-auto">
              <SheetHeader className="space-y-4 pb-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <SheetTitle className="text-xl font-bold">{t('access.roles.permissions.title')}</SheetTitle>
                    <SheetDescription className="text-base">
                      {t('access.roles.permissions.subtitle')}
                    </SheetDescription>
                  </div>
                  {hasUnsavedChanges && (
                    <Badge variant="destructive" className="animate-pulse">
                      {t('access.roles.permissions.unsaved_changes')}
                    </Badge>
                  )}
                </div>
              </SheetHeader>
              
              {selectedRole && (
                <div className="space-y-8 mt-6">
                  <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/30 shadow-lg">
                    <CardHeader className="pb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center shadow-lg">
                              <Shield className="w-8 h-8 text-primary" />
                            </div>
                            {selectedRole.key_code === 'ADMIN' && (
                              <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <CardTitle className="text-2xl font-bold text-foreground">
                                {selectedRole.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-sm font-mono px-3 py-1">
                                  {selectedRole.key_code}
                                </Badge>
                                <Badge 
                                  variant={selectedRole.key_code === 'ADMIN' ? 'default' : 'outline'}
                                  className="text-sm"
                                >
                                  {users.filter(u => u.user_roles.some(r => r.id === selectedRole.id)).length} users
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                              {selectedRole.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Permission Coverage
                          </div>
                          <div className="text-3xl font-bold text-primary">
                            {Math.round((selectedPermissions.length / permissions.length) * 100)}%
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
                              style={{ width: `${(selectedPermissions.length / permissions.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="text-lg font-bold text-blue-600">
                            {selectedPermissions.length}
                          </div>
                          <div className="text-xs text-blue-600/80 font-medium">
                            {t('access.roles.permissions.selected_count', { count: selectedPermissions.length })}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="text-lg font-bold text-green-600">
                            {permissions.length}
                          </div>
                          <div className="text-xs text-green-600/80 font-medium">
                            Total Available
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="text-lg font-bold text-purple-600">
                            {roles.length}
                          </div>
                          <div className="text-xs text-purple-600/80 font-medium">
                            Permission Groups
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="text-lg font-bold text-amber-600">
                            {hasUnsavedChanges ? 'Modified' : 'Saved'}
                          </div>
                          <div className="text-xs text-amber-600/80 font-medium">
                            Status
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            {t('access.roles.permissions.permissions_matrix')}
                          </h4>
                          <p className="text-sm text-muted-foreground max-w-md">
                            Configure which actions this role can perform across different system areas
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Selected: {selectedPermissions.length}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                              Available: {permissions.length}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              Groups: {roles.length}
                            </span>
                          </div>
                        </div>
                        
                        {canUpdateRole && (
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const allPermissionIds = permissions.flatMap(p => p.data.map(perm => perm.id))
                                  setSelectedPermissions(allPermissionIds)
                                  setHasUnsavedChanges(true)
                                  toast.success(
                                    `✅ All ${permissions.length} permissions selected!`, 
                                    { duration: 3000, icon: '🎉' }
                                  )
                                }}
                                className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                                disabled={selectedPermissions.length === permissions.length}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {t('access.roles.permissions.select_all')}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedPermissions([])
                                  setHasUnsavedChanges(true)
                                  toast.success(
                                    '🗑️ All permissions cleared', 
                                    { duration: 2000 }
                                  )
                                }}
                                className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                                disabled={selectedPermissions.length === 0}
                              >
                                <X className="w-4 h-4 mr-2" />
                                {t('access.roles.permissions.select_none')}
                              </Button>
                            </div>
                            
                            <div className="flex gap-1 text-xs">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setExpandedGroups(roles.map(g => g.name))
                                  toast.success('All groups expanded')
                                }}
                                className="h-6 px-2 hover:bg-blue-50"
                              >
                                Expand All
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setExpandedGroups([])
                                  toast.success('All groups collapsed')
                                }}
                                className="h-6 px-2 hover:bg-blue-50"
                              >
                                Collapse All
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    {roles.map((role) => {
                      const isExpanded = expandedGroups.includes(role.name)
                      const roleHasGroup = selectedRole.permissions.some(p => p.group === role.name)
                      const roleGroupPermissions = selectedRole.permissions.find(p => p.group === role.name)?.data || []
                      const groupPermissionIds = role.permissions.flatMap(p => p.data.map(perm => perm.id))
                      const selectedInGroup = selectedPermissions.filter(id => groupPermissionIds.includes(id)).length
                      const allGroupSelected = selectedInGroup === role.permissions.length
                      const someGroupSelected = selectedInGroup > 0 && selectedInGroup < role.permissions.length

                      return (
                            <Card key={role.name} className={`transition-all duration-300 transform hover:scale-[1.01] ${
                              allGroupSelected 
                                ? 'ring-2 ring-green-400/50 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 shadow-lg' 
                                : someGroupSelected
                                  ? 'ring-2 ring-yellow-400/50 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 shadow-md'
                                  : 'hover:shadow-md hover:ring-2 hover:ring-primary/20'
                            }`}>
                              <Collapsible open={isExpanded} onOpenChange={() => {
                                toggleGroup(role.name)
                                toast.success(
                                  isExpanded ? `${role.key_code} collapsed` : `${role.key_code} expanded`,
                                  { duration: 1000, icon: isExpanded ? '🔼' : '🔽' }
                                )
                              }}>
                                <CollapsibleTrigger className="w-full group">
                                  <CardHeader className="hover:bg-muted/20 transition-all duration-200 rounded-t-lg group-hover:shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                          allGroupSelected 
                                            ? 'bg-green-500/20 text-green-600' 
                                            : someGroupSelected
                                              ? 'bg-yellow-500/20 text-yellow-600'
                                              : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                                        }`}>
                                          {isExpanded ? (
                                            <ChevronDown className="w-6 h-6 transform group-hover:scale-110 transition-transform" /> 
                                          ) : (
                                            <ChevronRight className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                                          )}
                                        </div>
                                        
                                        <div className="text-left space-y-2">
                                          <CardTitle className="text-lg flex items-center gap-3">
                                            <span className="group-hover:text-primary transition-colors">
                                              {t(`access.roles.permissions.groups.${role.name}`, { defaultValue: role.key_code })}
                                            </span>
                                            
                                            {canUpdateRole && isExpanded && (
                                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {!allGroupSelected && (
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-3 text-xs hover:bg-green-100 hover:text-green-700 border border-green-200"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      const combined = [...selectedPermissions, ...groupPermissionIds]
                                                      const newSelected = combined.filter((id, index) => combined.indexOf(id) === index)
                                                      setSelectedPermissions(newSelected)
                                                      setHasUnsavedChanges(true)
                                                      toast.success(`✅ All ${role.key_code} permissions selected!`)
                                                    }}
                                                  >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Select All
                                                  </Button>
                                                )}
                                                {selectedInGroup > 0 && (
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-3 text-xs hover:bg-red-100 hover:text-red-700 border border-red-200"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      const newSelected = selectedPermissions.filter(id => !groupPermissionIds.includes(id))
                                                      setSelectedPermissions(newSelected)
                                                      setHasUnsavedChanges(true)
                                                      toast.success(`🗑️ ${role.key_code} permissions cleared`)
                                                    }}
                                                  >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Clear
                                                  </Button>
                                                )}
                                              </div>
                                            )}
                                          </CardTitle>
                                          
                                          <CardDescription className="text-sm leading-relaxed">
                                            {t(`access.roles.permissions.group_descriptions.${role.name}`, { 
                                              defaultValue: role.description 
                                            })}
                                          </CardDescription>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                        <div className="text-right space-y-1">
                                          <Badge 
                                            variant={allGroupSelected ? "default" : someGroupSelected ? "secondary" : "outline"}
                                            className={`text-sm px-4 py-2 font-bold ${
                                              allGroupSelected 
                                                ? 'bg-green-500 text-white shadow-md' 
                                                : someGroupSelected
                                                  ? 'bg-yellow-500 text-white shadow-md'
                                                  : 'bg-muted'
                                            }`}
                                          >
                                            {selectedInGroup}/{role.permissions.length}
                                          </Badge>
                                          <div className="text-xs text-muted-foreground text-center">
                                            {Math.round((selectedInGroup / role.permissions.length) * 100)}%
                                          </div>
                                        </div>
                                        
                                        <div className="relative w-12 h-12">
                                          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                              className="text-muted stroke-current"
                                              fill="none"
                                              strokeWidth="3"
                                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                              className={`stroke-current transition-all duration-500 ${
                                                allGroupSelected ? 'text-green-500' : someGroupSelected ? 'text-yellow-500' : 'text-primary'
                                              }`}
                                              fill="none"
                                              strokeWidth="3"
                                              strokeDasharray={`${(selectedInGroup / role.permissions.length) * 100}, 100`}
                                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                          </svg>
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            {allGroupSelected ? (
                                              <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : someGroupSelected ? (
                                              <Minus className="w-5 h-5 text-yellow-500" />
                                            ) : (
                                              <Circle className="w-5 h-5 text-muted-foreground" />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardHeader>
                                </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="pt-0 pb-6">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative">
                                        {allGroupSelected ? (
                                          <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : someGroupSelected ? (
                                          <Minus className="w-5 h-5 text-yellow-600" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {selectedInGroup} of {role.permissions.length} permissions selected
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {Math.round((selectedInGroup / role.permissions.length) * 100)}% coverage
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {!allGroupSelected && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const combined = [...selectedPermissions, ...groupPermissionIds]
                                            const newSelected = combined.filter((id, index) => combined.indexOf(id) === index)
                                            setSelectedPermissions(newSelected)
                                            setHasUnsavedChanges(true)
                                            toast.success(`All ${role.key_code} permissions selected`, { icon: '✅' })
                                          }}
                                          className="h-8 px-3 hover:bg-green-50 hover:border-green-200"
                                        >
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Select All
                                        </Button>
                                      )}
                                      {selectedInGroup > 0 && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const newSelected = selectedPermissions.filter(id => !groupPermissionIds.includes(id))
                                            setSelectedPermissions(newSelected)
                                            setHasUnsavedChanges(true)
                                            toast.success(`${role.key_code} permissions cleared`, { icon: '🗑️' })
                                          }}
                                          className="h-8 px-3 hover:bg-red-50 hover:border-red-200"
                                        >
                                          <X className="w-3 h-3 mr-1" />
                                          Clear
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                    {role.permissions.flatMap(permData => permData.data).map((permission) => {
                                      const isChecked = selectedPermissions.includes(permission.id)
                                      const wasOriginallyChecked = roleGroupPermissions.some(p => p.id === permission.id)
                                      const isModified = isChecked !== wasOriginallyChecked
                                      
                                      return (
                                        <div 
                                          key={permission.id} 
                                          className={`group relative flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                                            isChecked 
                                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/40 shadow-lg' 
                                              : 'hover:bg-muted/30 hover:border-primary/20 hover:shadow-md border-border'
                                          }`}
                                          onClick={() => {
                                            if (!canUpdateRole) return
                                            
                                            const newSelected = isChecked 
                                              ? selectedPermissions.filter(id => id !== permission.id)
                                              : [...selectedPermissions, permission.id]
                                            
                                            setSelectedPermissions(newSelected)
                                            setHasUnsavedChanges(true)
                                            
                                            toast.success(
                                              isChecked 
                                                ? `❌ ${permission.name} removed`
                                                : `✅ ${permission.name} added`,
                                              { duration: 2000 }
                                            )
                                          }}
                                        >
                                          <div className="relative mt-1">
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                              isChecked 
                                                ? 'bg-primary border-primary text-primary-foreground' 
                                                : 'border-muted-foreground/30 group-hover:border-primary/50'
                                            }`}>
                                              {isChecked && <CheckCircle className="w-4 h-4" />}
                                            </div>
                                            {isModified && (
                                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background animate-pulse" />
                                            )}
                                          </div>
                                          
                                          <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="space-y-1">
                                                <Label 
                                                  htmlFor={permission.id} 
                                                  className="text-sm font-semibold cursor-pointer leading-tight"
                                                >
                                                  {permission.name}
                                                </Label>
                                                <div className="flex items-center gap-2">
                                                  <Badge variant="outline" className="text-xs font-mono bg-muted/50">
                                                    {permission.key_code}
                                                  </Badge>
                                                  {isChecked && (
                                                    <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-200">
                                                      ✓ Active
                                                    </Badge>
                                                  )}
                                                  {!wasOriginallyChecked && isChecked && (
                                                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-600 bg-blue-50">
                                                      + New
                                                    </Badge>
                                                  )}
                                                  {wasOriginallyChecked && !isChecked && (
                                                    <Badge variant="outline" className="text-xs border-red-300 text-red-600 bg-red-50">
                                                      − Removed
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed pr-2">
                                              {permission.description}
                                            </p>
                                          </div>
                                          
                                          <div className="flex flex-col items-center gap-2 mt-1">
                                            {isChecked && (
                                              <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-sm animate-pulse" />
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      )
                    })}
                  </div>
                  
                  {canUpdateRole && (
                    <Card className="sticky bottom-4 bg-background/95 backdrop-blur-xl border-2 shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                hasUnsavedChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                              }`} />
                              <div>
                                <p className="text-sm font-semibold">
                                  {selectedPermissions.length > 0 
                                    ? t('access.roles.permissions.selected_count', { count: selectedPermissions.length })
                                    : 'No permissions selected'
                                  }
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {Math.round((selectedPermissions.length / permissions.length) * 100)}% of total permissions
                                </p>
                              </div>
                            </div>
                            
                            {hasUnsavedChanges && (
                              <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                                  {t('access.roles.permissions.unsaved_changes')} - Don't forget to save!
                                </p>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              {roles.map((group) => {
                                const groupPermissionIds = group.permissions.map(p => p.id)
                                const selectedInGroup = selectedPermissions.filter(id => groupPermissionIds.includes(id)).length
                                const percentage = Math.round((selectedInGroup / group.permissions.length) * 100)
                                
                                return (
                                  <Badge 
                                    key={group.name}
                                    variant={selectedInGroup > 0 ? "default" : "outline"}
                                    className="text-xs"
                                  >
                                    {group.name}: {selectedInGroup}/{group.permissions.length} ({percentage}%)
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                if (hasUnsavedChanges) {
                                  if (confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
                                    setIsRoleSheetOpen(false)
                                    setSelectedPermissions([])
                                    setHasUnsavedChanges(false)
                                  }
                                } else {
                                  setIsRoleSheetOpen(false)
                                  setSelectedPermissions([])
                                }
                              }}
                              className="px-6 h-11"
                            >
                              <X className="w-4 h-4 mr-2" />
                              {t('access.modals.edit_role.cancel')}
                            </Button>
                            <Button 
                              onClick={() => {
                                toast.success(t('access.toasts.permissions_updated'), {
                                  duration: 4000,
                                  icon: '🎉'
                                })
                                // Here you would save to API
                                setIsRoleSheetOpen(false)
                                setSelectedPermissions([])
                                setHasUnsavedChanges(false)
                              }}
                              disabled={!hasUnsavedChanges}
                              className={`px-6 h-11 transition-all duration-200 ${
                                hasUnsavedChanges 
                                  ? 'bg-primary hover:bg-primary/90 shadow-lg scale-105' 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {t('access.modals.edit_role.save')}
                              {hasUnsavedChanges && (
                                <div className="ml-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet> */}

          {/* Role Modals */}
          <CreateRoleModal
            isOpen={isCreateRoleOpen}
            onOpenChange={setIsCreateRoleOpen}
            onSuccess={handleCreateRoleSuccess}
          />

          <EditRoleModal
            isOpen={isEditRoleOpen}
            onOpenChange={setIsEditRoleOpen}
            role={selectedRoleForEdit}
            users={users}
            onSuccess={handleEditRoleSuccess}
            onEditPermissions={handleEditPermissions}
          />

          <DeleteRoleModal
            isOpen={isDeleteRoleOpen}
            onOpenChange={setIsDeleteRoleOpen}
            role={selectedRoleForDelete}
            users={users}
            availableRoles={roles}
            onSuccess={handleDeleteRoleSuccess}
          />
        </div>
      </WithPermission>
    </AppLayout>
  )
}
