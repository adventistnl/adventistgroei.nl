"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartHeader } from "@/components/charts/chart-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Lock,
  Settings,
  Crown,
  Activity,
  Users,
  Building
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { UseTable } from "@/components/ui/use-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { RoleDistributionChart } from "@/components/charts/role-distribution-chart"
import { RolePermissionsChart } from "@/components/charts/role-permissions-chart"
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"

// Role Modals
import { CreateRoleModal, EditRoleModal, DeleteRoleModal } from "@/components/modals/role"

// Data
import { users } from "@/data/accessData"
import { useRoles } from "@/hooks/use-roles"
import { Roles_roles as Role } from "@/types/Roles"
import { Permissions_permissions_data as Permission } from "@/types/Permissions"
import { usePermissions } from "@/hooks/use-permissions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { useInstitution } from "@/contexts/institution-context"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { useHasPermission } from "@/hooks/use-has-permission"

export default function AccessManagementPage() {
  const { t } = useTranslation()
  const { roles, refetchAllRoles } = useRoles();
  const { currentInstitutionData, loading: institutionLoading } = useInstitution()
  const { permissions } = usePermissions();

  const [isLoading, setIsLoading] = useState(true)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(null)
  const [selectedRoleForDelete, setSelectedRoleForDelete] = useState<Role | null>(null)

  // Permission checks for actions column
  const hasUpdateRolePermission = useHasPermission([PermissionResolverName.UpdateRole])
  const hasDeleteRolePermission = useHasPermission([PermissionResolverName.DeleteRole])
  const hasAnyRoleActionPermission = hasUpdateRolePermission || hasDeleteRolePermission

  // Filter states
  const [roleFilterValues, setRoleFilterValues] = useState<Record<string, any>>({
    key_code: 'all'
  })
  const [permissionFilterValues, setPermissionFilterValues] = useState<Record<string, any>>({
    group: 'all'
  })

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

  // Processar dados para o gráfico de distribuição de roles
  const roleDistributionData = useMemo(() => {
    // Contar quantos usuários tem cada role
    const roleCounts = new Map<string, { id: string; name: string; key_code: string; count: number }>()
    
    // Inicializar todos os roles com contagem 0
    roles.forEach(role => {
      roleCounts.set(role.id, {
        id: role.id,
        name: role.name,
        key_code: role.key_code,
        count: 0
      })
    })
    
    // Contar usuários por role
    const institutionUsers = currentInstitutionData?.users || []
    institutionUsers.forEach(user => {
      user.user_roles?.forEach(userRole => {
        const roleData = roleCounts.get(userRole.role.id)
        if (roleData) {
          roleData.count += 1
        }
      })
    })
    
    return Array.from(roleCounts.values()).map(role => ({
      id: role.id,
      name: role.name,
      key_code: role.key_code,
      userCount: role.count
    }))
  }, [roles, currentInstitutionData])

  const totalUsersWithRoles = useMemo(() => {
    return currentInstitutionData?.users?.filter(user => 
      user.user_roles && user.user_roles.length > 0
    ).length || 0
  }, [currentInstitutionData])

  // Processar dados para o gráfico de permissões por role
  const rolePermissionsData = useMemo(() => {
    return roles.map(role => {
      const permissionCount = role.permissions.reduce((sum, group) => sum + group.data.length, 0)
      return {
        id: role.id,
        name: role.name,
        key_code: role.key_code,
        permissionCount
      }
    })
  }, [roles])

  // Filter roles based on selected filters
  const filteredRoles = useMemo(() => {
    let filtered = roles

    // Apply role type filter
    if (roleFilterValues.key_code && roleFilterValues.key_code !== 'all') {
      filtered = filtered.filter(role => role.key_code === roleFilterValues.key_code)
    }

    return filtered
  }, [roles, roleFilterValues])

  // Filter permissions based on selected filters
  const filteredPermissions = useMemo(() => {
    let allPermissions = permissions.flatMap(p => p.data.flatMap(perm => perm))

    // Apply group filter
    if (permissionFilterValues.group && permissionFilterValues.group !== 'all') {
      allPermissions = allPermissions.filter(perm => perm.group === permissionFilterValues.group)
    }

    return allPermissions
  }, [permissions, permissionFilterValues])

  usePageTitle({
    title: t('access.title')
  })

  // Configure PageFilters for Roles
  const rolePageFilters: FilterConfig[] = useMemo(() => {
    // Get unique role types
    const uniqueRoleTypes = Array.from(
      new Set(roles.map(role => role.key_code))
    ).sort()

    return [
      {
        id: 'key_code',
        label: 'Role Type',
        type: 'select',
        placeholder: 'All Role Types',
        icon: Shield,
        options: [
          { label: 'All Role Types', value: 'all' },
          ...uniqueRoleTypes.map(type => ({
            label: type,
            value: type
          }))
        ],
        defaultValue: 'all'
      }
    ]
  }, [roles])

  // Configure PageFilters for Permissions
  const permissionPageFilters: FilterConfig[] = useMemo(() => {
    // Get unique permission groups
    const uniqueGroups = Array.from(
      new Set(permissions.map(p => p.group))
    ).sort()

    return [
      {
        id: 'group',
        label: 'Permission Group',
        type: 'select',
        placeholder: 'All Groups',
        icon: Lock,
        options: [
          { label: 'All Groups', value: 'all' },
          ...uniqueGroups.map(group => ({
            label: group,
            value: group
          }))
        ],
        defaultValue: 'all'
      }
    ]
  }, [permissions])

  const hasShownLoadingToast = useRef(false)

  // Load data
  useEffect(() => {
    if (hasShownLoadingToast.current) return
    hasShownLoadingToast.current = true

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


  // Role table base columns
  const baseRoleColumns: ColumnDef<Role>[] = [
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
        const isAdmin = role.key_code === 'ADMIN' || role.key_code.includes('ADMIN')
        return (
          <StatusBadge 
            label={role.key_code}
            variant="neutral"
            icon={isAdmin ? Crown : Shield}
            size="sm"
          />
        )
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: t('access.roles.table.description'),
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate line-clamp-2">{row.original.description}</div>
      ),
    },
    {
      id: "permissions_count",
      header: t('access.roles.table.permissions_count'),
      cell: ({ row }) => {
        const role = row.original
        const permissionCount = role.permissions.reduce((sum, group) => sum + group.data.length, 0)
        return (
          <StatusBadge 
            label={`${permissionCount} permissions`}
            variant="neutral"
            icon={Lock}
            size="sm"
          />
        )
      },
    },
    {
      id: "users_count",
      header: t('access.roles.table.users_count'),
      cell: ({ row }) => {
        const userCount = row.original.users?.length || 0
        return (
          <StatusBadge 
            label={`${userCount} users`}
            variant="neutral"
            icon={Users}
            size="sm"
          />
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
  ]

  // Actions column - only included if user has permissions
  const actionsColumn: ColumnDef<Role> = {
    id: "actions",
    header: () => <div className="text-right">{t('access.roles.table.actions')}</div>,
    cell: ({ row }) => {
      const role = row.original
      
      // Determine which actions are available
      const canEditRole = !role.is_fixed
      const canEditPermissions = hasUpdateRolePermission
      const canDeleteRole = !role.is_fixed && hasDeleteRolePermission
      
      // If no actions available, don't render dropdown
      if (!canEditRole && !canEditPermissions && !canDeleteRole) {
        return null
      }
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEditRole && (
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
            {canEditPermissions && (
              <DropdownMenuItem
                onClick={() => handleEditPermissions(role)}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t('access.roles.actions.edit_permissions')}
              </DropdownMenuItem>
            )}
            {canDeleteRole && (
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
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }

  // Combine columns conditionally
  const roleColumns = hasAnyRoleActionPermission 
    ? [...baseRoleColumns, actionsColumn]
    : baseRoleColumns

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
          <StatusBadge 
            label={permission.key_code}
            variant="neutral"
            size="sm"
          />
        )
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: t('access.permissions.table.description'),
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate line-clamp-2">{row.original.description}</div>
      ),
    },
    {
      id: "group",
      accessorKey: "group",
      header: t('access.permissions.table.group'),
      cell: ({ row }) => {
        const group = row.original.group
        return (
          <StatusBadge 
            label={group || '-'}
            variant="neutral"
            size="sm"
          />
        )
      },
    },
  ]

  // Modal handlers
  const handleCreateRoleSuccess = () => {
    refetchAllRoles();
    // Refresh data or update state as needed
    // In a real app, you might refetch the roles data
  }

  const handleEditRoleSuccess = () => {
    // Refresh data or update state as needed
    setSelectedRoleForEdit(null)
    refetchAllRoles();
  }

  const handleDeleteRoleSuccess = () => {
    // Refresh data or update state as needed
    setSelectedRoleForDelete(null)
    refetchAllRoles();
  }

  const handleEditPermissions = (role: Role) => {
    toast.success(`Opening detailed permissions for ${role.name}`)
    window.location.href = `/access/roles/${role.id}`
  }

  const handleRoleFilterChange = (filterId: string, value: any) => {
    setRoleFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }))
  }

  const handleClearRoleFilters = () => {
    setRoleFilterValues({ key_code: 'all' })
    toast.success('Filters cleared', { duration: 1500 })
  }

  const handlePermissionFilterChange = (filterId: string, value: any) => {
    setPermissionFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }))
  }

  const handleClearPermissionFilters = () => {
    setPermissionFilterValues({ group: 'all' })
    toast.success('Filters cleared', { duration: 1500 })
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
              {currentInstitutionData && (
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Building className="w-3 h-3 mr-1" />
                    {currentInstitutionData.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentInstitutionData.denomination}
                  </Badge>
                </div>
              )}
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

          <ResponsiveGridCarousel
            enableAutoplay={false}
            gap="gap-6"
            className="w-full"
          >
            <RoleDistributionChart
              roles={roleDistributionData}
              totalUsers={totalUsersWithRoles}
              isLoading={isLoading}
            />

            {/* Role Permissions Chart */}
            <RolePermissionsChart
              roles={rolePermissionsData}
              isLoading={isLoading}
            />
          </ResponsiveGridCarousel>


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
            </TabsList>


            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-6">
              <Card>
                <ChartHeader
                  title={t('access.roles.title')}
                  description={t('access.roles.subtitle')}
                  actionsOrientation="responsive"
                  actions={
                    <>
                      {rolePageFilters.length > 0 && (
                        <PageFilters
                          filters={rolePageFilters}
                          values={roleFilterValues}
                          onChange={handleRoleFilterChange}
                          onClear={handleClearRoleFilters}
                          triggerLabel="Filters"
                          align="end"
                          width={320}
                          showClearButton={true}
                        />
                      )}
                      <WithPermission requiredPermissions={[PermissionResolverName.CreateRole]}>
                        <Button 
                          onClick={() => setIsCreateRoleOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('access.roles.actions.create_role')}
                        </Button>
                      </WithPermission>
                    </>
                  }
                />
                <CardContent className="overflow-hidden p-0">
                  <UseTable
                    columns={roleColumns}
                    data={filteredRoles}
                    searchKey="name"
                    emptyMessage={t('access.roles.table.no_results') || "No roles found"}
                    emptyEntityName="role"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <ChartHeader
                  title={t('access.permissions.title')}
                  description={t('access.permissions.subtitle')}
                  actionsOrientation="responsive"
                  actions={
                    permissionPageFilters.length > 0 ? (
                      <PageFilters
                        filters={permissionPageFilters}
                        values={permissionFilterValues}
                        onChange={handlePermissionFilterChange}
                        onClear={handleClearPermissionFilters}
                        triggerLabel="Filters"
                        align="end"
                        width={320}
                        showClearButton={true}
                      />
                    ) : null
                  }
                />
                <CardContent className="overflow-hidden p-0">
                  <UseTable
                    columns={permissionColumns}
                    data={filteredPermissions}
                    searchKey="name"
                    emptyMessage={t('access.permissions.table.no_results') || "No permissions found"}
                    emptyEntityName="permission"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>


          <Separator />

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
