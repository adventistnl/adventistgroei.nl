"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  ContactRound,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Building,
  Building2,
  Layers,
  RefreshCw
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Hooks
import { useUserKPI } from "@/hooks/KPI/use-users-kpi"
import { useLanguageOptions } from '@/hooks/use-language-preferences'

// Lazy load modals
const CreateUserModal = React.lazy(() => import("@/components/modals/user").then(module => ({ default: module.CreateUserModal })))
const EditUserModal = React.lazy(() => import("@/components/modals/user").then(module => ({ default: module.EditUserModal })))
const DeleteUserModal = React.lazy(() => import("@/components/modals/user").then(module => ({ default: module.DeleteUserModal })))
const ContactViewEditModal = React.lazy(() => import("@/components/modals/contact/contact-view-edit-modal").then(module => ({ default: module.ContactViewEditModal })))

// Components
import { UseTable } from "@/components/ui/use-table"
import { KPICards, type KPICardData } from "@/components/shared/kpi-cards-carousel"
import { StatusBadge } from "@/components/ui/status-badge"
import { PageFilters, type FilterConfig } from "@/components/shared/page-filters"
import { ColumnDef } from "@tanstack/react-table"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useInstitution } from "@/contexts/institution-context"
import { InstitutionById_institution_users as User } from "@/types/InstitutionById"
import { useRoles } from "@/hooks/use-roles"
import { AccessDenied } from "@/components/access/access-denied"
import { UsersByStructureOverviewChart, UserStructureGrowthChart } from "@/components/charts/dashboard"
import { useQuery } from "@apollo/client"
import { GET_INSTITUTIONS_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY"
import { GET_ALL_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"
import { YearFilter } from "@/components/shared/year-filter"

export default function UsersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { currentInstitutionData, institutions, refetchInstitutionById} = useInstitution()
  const { roles } = useRoles(); // Obtém os roles através do hook
  const languageOptions = useLanguageOptions(); // Usando o novo hook

  // Data from institution context
  const churches = currentInstitutionData?.churches || []
  const departments = currentInstitutionData?.departments || []
  const users = currentInstitutionData?.users || []
  
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)

  // Modal states
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [isViewContactOpen, setIsViewContactOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const current = new Date().getFullYear()
    return [current, current - 1, current - 2]
  })
  
  // Page filters state
  const [pageFilters, setPageFilters] = useState<Record<string, any>>({
    church: '',
    departmentType: '',
    status: ''
  })

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    setPageFilters(prev => ({ ...prev, [filterId]: value }))
  }

  // Clear all filters
  const handleClearFilters = () => {
    setPageFilters({
      church: '',
      departmentType: '',
      status: ''
    })
  }
  
  // Filter users by selected year based on created_at and page filters
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      // Year filter
      const createdYear = new Date(user.created_at).getFullYear()
      if (createdYear !== selectedYear) return false
      
      // Church filter
      if (pageFilters.church && pageFilters.church !== '') {
        if (!user.church || user.church.name !== pageFilters.church) return false
      }
      
      // Department Type filter
      if (pageFilters.departmentType && pageFilters.departmentType !== '') {
        const deptInfo = getDepartmentInfo(user)
        if (deptInfo.type !== pageFilters.departmentType) return false
      }
      
      // Status filter
      if (pageFilters.status && pageFilters.status !== '') {
        if (pageFilters.status === 'active' && user.is_deleted) return false
        if (pageFilters.status === 'inactive' && !user.is_deleted) return false
      }
      
      return true
    })
  }, [users, selectedYear, pageFilters])

    // GraphQL Queries
    const { data: institutionsData, loading: institutionsLoading, refetch: refetchInstitutions } = useQuery(GET_INSTITUTIONS_LIGHT_QUERY)
    const { data: regionsData, loading: regionsLoading, refetch: refetchRegions } = useQuery(GET_REGIONS_QUERY)
    const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY)
    const { data: departmentsData, loading: departmentsLoading, refetch: refetchDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
      variables: { institution_id: currentInstitutionData?.id }
    })
    const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_ALL_USERS_QUERY, {
      variables: { institution_id: currentInstitutionData?.id }
    })
    const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useQuery(GET_ALL_ROLES_QUERY)
  

  const displayedInstitution = currentInstitutionData

      // Extract data from queries
  const allInstitutions = institutionsData?.institutions || []
  const allRegions = regionsData?.regions || []
  const allChurches = churchesData?.churches || []
  const allDepartments = departmentsData?.departments || []
  const allUsers = usersData?.users || []
  const allRoles = rolesData?.roles || []

  usePageTitle({
    title: t('users.title')
  })
  
  // DEBUG: Validação dos dados que entram na tabela de Users
  React.useEffect(() => {
    console.log('🔍 [USERS PAGE TABLE DEBUG] ===================================')
    console.log('👥 Total filteredUsers:', filteredUsers.length)
    console.log('👥 First 3 users data:', filteredUsers.slice(0, 3).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      church: u.church ? { id: u.church.id, name: u.church.name } : null,
      user_roles: u.user_roles?.map((ur: any) => ({
        id: ur.id,
        role: { id: ur.role?.id, name: ur.role?.name, key_code: ur.role?.key_code }
      })),
      is_deleted: u.is_deleted,
      created_at: u.created_at
    })))
    console.log('👥 Sample user_roles structure:', filteredUsers[0]?.user_roles)
    console.log('👥 Does first user have user_roles?', !!filteredUsers[0]?.user_roles)
    console.log('👥 User_roles length:', filteredUsers[0]?.user_roles?.length)
    console.log('🔍 [END USERS PAGE TABLE DEBUG] ===================================')
  }, [filteredUsers])
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(t('users.loading'))
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success(t('users.loaded'), {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t('users.load_error'))
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

    // Handle add year
  const handleAddYearCallback = (newYear: number) => {
    setAvailableYears(prev => [...prev, newYear].sort((a, b) => b - a))
    setSelectedYear(newYear)
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    
    const refreshToast = toast.loading(`🔄 ${t('users.refreshing')}`)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(refreshToast)
      toast.success(`${t('users.refreshed')}`, {
        duration: 2000
      })
      
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(`${t('users.refresh_error')}`)
    } finally {
      setRefreshing(false)
    }
  }

  // User action handlers
  const handleViewContact = (user: User) => {
    setSelectedUser(user)
    setIsViewContactOpen(true)
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

  // Helper function to get department info (moved up for filter usage)
  const getDepartmentInfo = React.useCallback((user: User) => {
    // Check if user has department_id in church context
    const churchDepartment = churches
      .flatMap(church => church.departments || [])
      .find(dept => dept.users?.some(u => u.id === user.id))
    
    if (churchDepartment) {
      return {
        type: 'Church Departmental',
        departmentName: churchDepartment.name,
        departmentId: churchDepartment.id
      }
    }

    // Check if user has department_id in institutional context
    const institutionalDepartment = departments.find(dept => 
      dept.users?.some(u => u.id === user.id)
    )
    
    if (institutionalDepartment) {
      return {
        type: 'Institutional Departmental',
        departmentName: institutionalDepartment.name,
        departmentId: institutionalDepartment.id
      }
    }

    return {
      type: 'No Departmental',
      departmentName: '-',
      departmentId: null
    }
  }, [churches, departments])

  // KPIs calculados com dados filtrados por ano
  const totalUsers = filteredUsers.length
  const activeUsers = filteredUsers.filter(user => !user.is_deleted).length
  const inactiveUsers = filteredUsers.filter(user => user.is_deleted).length

  // Prepare KPI Cards data
  const kpiCardsData: KPICardData[] = [
    {
      id: "total-users",
      title: t('users.kpis.total_users'),
      value: totalUsers,
      subtitle: t('users.kpis.total_users_description'),
      icon: Users,
    },
    {
      id: "active-users",
      title: t('users.kpis.active_users'),
      value: activeUsers,
      subtitle: `${Math.round((activeUsers / totalUsers) * 100)}% ${t('users.kpis.of_total')}`,
      icon: UserCheck,
    },
    {
      id: "inactive-users",
      title: t('users.kpis.inactive_users'),
      value: inactiveUsers,
      subtitle: t('users.kpis.deleted_users_description'),
      icon: UserX,
    },
  ]

  // Filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: 'church',
      label: t('users.filters.church'),
      type: 'select',
      placeholder: t('users.filters.church'),
      icon: Building2,
      options: churches.map(church => ({
        label: church.name,
        value: church.name
      }))
    },
    {
      id: 'departmentType',
      label: t('users.filters.department_type'),
      type: 'select',
      placeholder: t('users.filters.department_type'),
      icon: Layers,
      options: [
        { label: t('users.filters.church_departmental'), value: 'Church Departmental' },
        { label: t('users.filters.institutional_departmental'), value: 'Institutional Departmental' },
        { label: t('users.filters.no_departmental'), value: 'No Departmental' }
      ]
    },
    {
      id: 'status',
      label: t('users.filters.status'),
      type: 'select',
      placeholder: t('users.filters.status'),
      icon: Shield,
      options: [
        { label: t('users.table.active'), value: 'active' },
        { label: t('users.table.inactive'), value: 'inactive' }
      ]
    }
  ]

  // User table columns
  const userColumns: ColumnDef<User>[] = [
    {
      id: "user",
      accessorKey: "name",
      header: t('users.table.name'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border-2 border-border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "church_name",
      accessorKey: "church.name",
      header: () => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>{t('users.table.church')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const churchName = row.original.church?.name
        
        if (!churchName) {
          return <StatusBadge label={t('users.table.no_church') || "No Church"} variant="neutral" size="sm" />
        }
        
        return <StatusBadge label={churchName} variant="info" size="sm" icon={Building2} />
      },
    },
    {
      id: "department_type",
      header: t('users.table.department_type') || "Department Type",
      cell: ({ row }) => {
        const user = row.original
        const deptInfo = getDepartmentInfo(user)
        
        if (deptInfo.type === 'No Departmental') {
          return <StatusBadge label={t('users.filters.no_departmental')} variant="neutral" size="sm" />
        } else if (deptInfo.type === 'Church Departmental') {
          return <StatusBadge label={t('users.filters.church_departmental')} variant="info" size="sm" icon={Building2} />
        } else {
          return <StatusBadge label={t('users.filters.institutional_departmental')} variant="default" size="sm" icon={Building} />
        }
      },
    },
    {
      id: "department_name",
      header: () => (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>{t('users.table.department') || "Department"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        const deptInfo = getDepartmentInfo(user)
        
        if (deptInfo.type === 'No Departmental' || deptInfo.departmentName === '-') {
          return <StatusBadge label={t('users.table.no_department') || "No Department"} variant="neutral" size="sm" />
        }
        
        // Usar ícone diferente dependendo do tipo de departamento
        const icon = deptInfo.type === 'Church Departmental' ? Building2 : Building
        
        return <StatusBadge label={deptInfo.departmentName} variant="default" size="sm" icon={icon} />
      },
    },
    {
      id: "roles",
      header: t('users.table.roles'),
      cell: ({ row }) => {
        const user = row.original
        
        if (!user.user_roles || user.user_roles.length === 0) {
          return <StatusBadge label={t('users.table.no_role')} variant="neutral" size="sm" />
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {user.user_roles?.map((userRole) => {
              const isAdmin = userRole.role.key_code === 'ADMIN'
              return (
                <StatusBadge
                  key={userRole.id}
                  label={userRole.role.name}
                  variant="neutral"
                  icon={isAdmin ? Crown : Shield}
                  size="sm"
                />
              )
            })}
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
          <StatusBadge
            label={user.is_deleted ? t('users.table.inactive') : t('users.table.active')}
            variant={user.is_deleted ? 'error' : 'success'}
            showDot
            size="sm"
          />
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t('users.table.actions')}</div>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end" data-action-button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewContact(user)}>
                  <ContactRound className="mr-2 h-4 w-4" />
                  {t('users.actions.view_contact') || "View Contact"}
                </DropdownMenuItem>
                <WithPermission requiredPermissions={[PermissionResolverName.UpdateUser]} >
                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('users.actions.edit_user')}
                  </DropdownMenuItem>
                </WithPermission>
                <WithPermission requiredPermissions={[PermissionResolverName.DeleteUser]} >
                  <DropdownMenuItem 
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600"
                  >
                  <UserX  className="mr-2 h-4 w-4" />
                    {t('users.actions.deactivate_user')}
                  </DropdownMenuItem>
                </WithPermission>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
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
      <WithPermission requiredPermissions={[PermissionResolverName.Users]} fallback={<AccessDenied />}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2 flex items-center gap-3">
                {t('users.title')}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {t('users.subtitle')}
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
                <div className="flex-1 mt-4">
                  <YearFilter
                    availableYears={availableYears}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    onAddYear={handleAddYearCallback}
                    showAddButton={false}
                  />
                </div>
            </div>
            
            <div className="flex items-center gap-3">
              <PageFilters
                filters={filterConfigs}
                values={pageFilters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                triggerLabel={t('users.filters.title') || 'Filters'}
                align="end"
                width={350}
              />
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

          {/* KPI Cards Carousel */}
          <KPICards
            data={kpiCardsData}
            isLoading={isLoading}
            showCarousel={true}
            minCardsForCarousel={3}
            skeletonCount={3}
            variant="minimal"
          />

            <UserStructureGrowthChart
              loading={isLoading}
              users={filteredUsers}
              departments={displayedInstitution?.departments || allDepartments}
              regions={allRegions}
              churches={displayedInstitution?.churches || allChurches}
              selectedYear={selectedYear}
            />

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
            <CardContent className="overflow-hidden p-0">
              <UseTable
                columns={userColumns}
                data={filteredUsers}
                searchKey="name"
                emptyMessage={t('users.table.no_users') || "No users found"}
                emptyEntityName="user"
              />
            </CardContent>
          </Card>

          {/* Contact View Modal */}
          {selectedUser && (
            <ContactViewEditModal
              isOpen={isViewContactOpen}
              onOpenChange={setIsViewContactOpen}
              contact={{
                __typename: 'Contact',
                id: selectedUser.contact_id || '',
                name: selectedUser.name,
                email: selectedUser.email,
                phone: null,
                mobile: null,
                country: null,
                city: null,
                address: null,
                full_address: null,
                postal_code: null,
                website: null,
                notes: null,
                is_primary: true,
                is_deleted: selectedUser.is_deleted,
                created_at: selectedUser.created_at,
                updated_at: selectedUser.updated_at,
                created_by: selectedUser.created_by,
                updated_by: selectedUser.updated_by,
                deleted_at: selectedUser.deleted_at,
                deleted_by: selectedUser.deleted_by,
                _count: {
                  __typename: 'ContactCount',
                  Church: 0,
                  Department: 0,
                  Event: 0,
                  User: 1
                }
              }}
              entityName={selectedUser.name}
              entityType="User"
              readonly={true}
              updateMutation={async () => ({ data: undefined })}
              entityId={selectedUser.id}
            />
          )}

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
                            {selectedUser.is_deleted ? t('users.table.inactive') : t('users.table.active')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">{t('users.details.language')}:</span>
                          <p className="text-muted-foreground">{selectedUser.language_preference}</p>
                        </div>
                        <div>
                          <span className="font-medium">{t('users.details.user_id')}:</span>
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
                          <span className="text-sm font-medium">{t('users.details.institution')}:</span>
                          <span className="text-sm">{selectedUser.institution.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t('users.details.church')}:</span>
                          <span className="text-sm">{selectedUser.church?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t('users.details.created')}:</span>
                          <span className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t('users.details.updated')}:</span>
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
                        {selectedUser.user_roles?.map((role) => (
                          <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {role.role.name}
                                  {role.role.key_code === 'ADMIN' && <Crown className="w-4 h-4 text-yellow-500" />}
                                </div>
                                <div className="text-xs text-muted-foreground">{role.role.description}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="font-mono">
                              {role.role.key_code}
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
          <WithPermission requiredPermissions={[PermissionResolverName.CreateUser]}>
            <Suspense fallback={<div>Loading...</div>}>
              <CreateUserModal
                isOpen={isCreateUserOpen}
                onOpenChange={setIsCreateUserOpen}
                institutions={institutions}
                churches={churches}
                departments={departments}
                roles={roles}
                onSuccess={async (userData) => {
                  // Refetch is already handled by the modal internally
                  toast.success(t('users.toasts.user_created'), {
                    duration: 3000
                  })
                }}
              />
            </Suspense>
          </WithPermission>
          <WithPermission requiredPermissions={[PermissionResolverName.UpdateUser]}>
            <Suspense fallback={<div>Loading...</div>}>
              <EditUserModal
                isOpen={isEditUserOpen}
                onOpenChange={setIsEditUserOpen}
                user={selectedUser}
                institutions={institutions}
                churches={churches}
                departments={departments}
                roles={roles}
                onSuccess={async (userData) => {
                  setSelectedUser(null)
                  // Refetch is already handled by the modal internally
                }}
              />
            </Suspense>
          </WithPermission>
          <WithPermission requiredPermissions={[PermissionResolverName.DeleteUser]}>
            <Suspense fallback={<div>Loading...</div>}>
              <DeleteUserModal
                isOpen={isDeleteUserOpen}
                onOpenChange={setIsDeleteUserOpen}
                user={selectedUser}
                onSuccess={async (deletedUser) => {
                  setSelectedUser(null)
                  // Refetch is already handled by the modal internally
                  toast.success(t('users.toasts.user_deleted'), {
                    duration: 3000
                  })
                }}
              />
            </Suspense>
          </WithPermission>
        </div>
      </WithPermission>
    </AppLayout>
  )
}
