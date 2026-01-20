"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Layers, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Home,
  DollarSign,
  Building,
  Building2,
  ContactRound,
  TrendingUp,
  Calendar,
  Shield,
  MapPin,
  User,
  FileText,
  CheckCircle2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { departmentTranslations } from "@/lib/translations/departments"
import { DataTable } from "@/components/ui/data-table"
import { AddDepartmentModal, EditDepartmentModal, DeleteDepartmentModal } from "@/components/modals/department"
import { useInstitution } from "@/contexts/institution-context"
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { DepartmentsKPICards, KPICardData, KPICards } from "@/components/shared/kpi-cards-carousel"
import { DepartmentProjectOverTimeChart } from "@/components/institutions/charts/department-project-over-time-chart"
import { DepartmentLeadersCard } from "@/components/charts/department-leaders-card"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { EntityInfoCard } from "@/components/shared/entity-info-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Eye } from "lucide-react"

import { CreateDepartment } from "@/types/CreateDepartment"
import NotFound from "@/components/shared/not-found"
import {
   InstitutionById_institution_departments as DepartmentData,
   InstitutionById_institution_churches as ChurchData
} from "@/types/InstitutionById"
import { PermissionResolverName, AnnualBudgetEntityType } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { WithPermission } from "@/hocs/with-permission"
import { useDepartmentKPIs } from "@/hooks/use-department-kpis"
import { GridContainer } from "@/components/shared/grid-container"
import { useQuery } from "@apollo/client"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS DE IGREJAS
 * Interface dedicada para gerenciar departamentos vinculados a igrejas
 */
export default function ChurchDepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const churches: ChurchData[] = currentInstitutionData?.churches || [];
  
  // Extrair departamentos das igrejas e adicionar church_name
  const departments: DepartmentData[] = churches.flatMap(church => 
    church.departments?.map(department => ({ 
      ...department, 
      church_name: church.name 
    })) || []
  );
  
  // Fetch todos os projetos da instituição
  const { 
    data: projectsData, 
    loading: projectsLoading, 
    error: projectsError 
  } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id
  });
  
  const projects = projectsData?.projects || [];
  
  // Debug: Log dados de igrejas e departamentos
  useEffect(() => {
    console.log('🏛️ [Church Departments Page] Total Churches:', churches.length)
    console.log('📋 [Church Departments Page] Total Departments:', departments.length)
    console.log('📊 [Church Departments Page] Departments by Church:', 
      churches.map(church => ({
        church_id: church.id,
        church_name: church.name,
        departments_count: church.departments?.length || 0,
        departments: church.departments?.map(d => ({ id: d.id, name: d.name, church_id: d.church_id })) || []
      }))
    )
    
    // Validar consistência: todos os departamentos devem ter church_id correspondente
    const inconsistentDepartments = departments.filter(dept => {
      const parentChurch = churches.find(c => c.id === dept.church_id)
      return !parentChurch
    })
    
    if (inconsistentDepartments.length > 0) {
      console.error('❌ [Data Inconsistency] Departments without valid church reference:', inconsistentDepartments)
    }
  }, [churches, departments])
  
  // Debug: Log dados de projetos e sua relação com departamentos
  useEffect(() => {
    if (!projects || projects.length === 0) {
      console.log('📦 [Projects Data] No projects found')
      return
    }
    
    console.log('📦 [Projects Data] Total Projects:', projects.length)
    console.log('📦 [Projects Data] Projects Loading:', projectsLoading)
    
    // Mapear todos os projetos com seus department_id e church_department_id
    const projectsMapping = projects.map((project: any) => ({
      project_id: project.id,
      project_title: project.title,
      department_id: project.department_id,
      church_department_id: project.church_department_id,
      owner_id: project.owner_id,
      status: project.status,
      has_church_department: !!project.church_department_id,
      church_department_name: project.church_department?.name || null,
      church_name: project.church_department?.church?.name || project.Church?.name || null
    }))
    
    console.log('📦 [Projects Data] All Projects with Department Links:', projectsMapping)
    
    // Filtrar projetos que têm church_department_id
    const projectsWithChurchDept = projects.filter((p: any) => p.church_department_id)
    console.log(`📦 [Projects Data] Projects with church_department_id: ${projectsWithChurchDept.length}/${projects.length}`)
    
    if (projectsWithChurchDept.length > 0) {
      console.log('📦 [Projects Data] Projects linked to Church Departments:', 
        projectsWithChurchDept.map((p: any) => ({
          project_title: p.title,
          church_department_id: p.church_department_id,
          church_department_name: p.church_department?.name || 'Unknown',
          church_name: p.church_department?.church?.name || 'Unknown'
        }))
      )
    }
    
    // Validar se os church_department_id dos projetos correspondem aos departamentos da página
    const departmentIds = new Set(departments.map(d => d.id))
    const projectDepartmentMatches = projectsWithChurchDept.map((project: any) => {
      const matchesDepartment = departmentIds.has(project.church_department_id)
      return {
        project_title: project.title,
        church_department_id: project.church_department_id,
        church_department_name: project.church_department?.name || 'Unknown',
        matches_page_department: matchesDepartment,
        department_found: matchesDepartment ? departments.find(d => d.id === project.church_department_id)?.name : null
      }
    })
    
    console.log('🔍 [Projects-Departments Validation] Church Department Matches:', projectDepartmentMatches)
    
    // Contar projetos por departamento
    const projectsByDepartment = new Map<string, any[]>()
    projectsWithChurchDept.forEach((project: any) => {
      const deptId = project.church_department_id
      if (!projectsByDepartment.has(deptId)) {
        projectsByDepartment.set(deptId, [])
      }
      projectsByDepartment.get(deptId)?.push(project)
    })
    
    console.log('📊 [Projects by Department] Project Count per Church Department:', 
      Array.from(projectsByDepartment.entries()).map(([dept_id, projs]) => {
        const dept = departments.find(d => d.id === dept_id)
        return {
          department_id: dept_id,
          department_name: dept?.name || projs[0]?.church_department?.name || 'Unknown',
          church_name: dept?.church_name || projs[0]?.church_department?.church?.name || 'Unknown',
          project_count: projs.length,
          projects: projs.map((p: any) => ({ id: p.id, title: p.title, status: p.status }))
        }
      })
    )
    
    // Identificar departamentos sem projetos
    const departmentsWithoutProjects = departments.filter(dept => 
      !projectsByDepartment.has(dept.id)
    )
    
    if (departmentsWithoutProjects.length > 0) {
      console.log('⚠️ [Departments Without Projects] Departments with no linked projects:', 
        departmentsWithoutProjects.map(d => ({
          department_id: d.id,
          department_name: d.name,
          church_name: d.church_name
        }))
      )
    }
    
    // Log erro se houver
    if (projectsError) {
      console.error('❌ [Projects Data] Error loading projects:', projectsError)
    }
    
  }, [projects, departments, projectsLoading, projectsError])
  
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en
  const [refreshing, setRefreshing] = useState(false)

  // Fetch department KPIs
  // Pass church_id as a flag to get ALL church departments from the institution (not institutional departments)
  const {
    kpis,
    activityData,
    loading: kpisLoading
  } = useDepartmentKPIs({
    institution_id: currentInstitutionData?.id,
    church_id: 'all',
    selectedYear: new Date().getFullYear()
  })

  const isLoading = !currentInstitutionData || kpisLoading
  
  // View mode states - controla se está na lista ou em detalhes
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [selectedDepartmentDetail, setSelectedDepartmentDetail] = useState<DepartmentData | null>(null)
  
  // Modal states
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false)
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false)
  const [isDeleteDepartmentModalOpen, setIsDeleteDepartmentModalOpen] = useState(false)
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)

  usePageTitle({
    title: t.church_page?.title || "Church Departments"
  })

  // Criar mapeamento de dados de atividade por department_id
  const departmentActivityMap = useMemo(() => {
    const map = new Map<string, any>()
    activityData.forEach(data => {
      map.set(data.department_id, data)
    })
    return map
  }, [activityData])

  // Criar mapeamento de projetos reais da API por church_department_id
  const projectsByDepartmentMap = useMemo(() => {
    const map = new Map<string, any[]>()
    
    if (projects && projects.length > 0) {
      // Filtrar apenas projetos com church_department_id (projetos de departamentos de igreja)
      const churchDeptProjects = projects.filter((p: any) => p.church_department_id)
      
      churchDeptProjects.forEach((project: any) => {
        const deptId = project.church_department_id
        if (!map.has(deptId)) {
          map.set(deptId, [])
        }
        map.get(deptId)?.push(project)
      })
      
      console.log('🗺️ [Projects Map] Projects grouped by church_department_id:', 
        Array.from(map.entries()).map(([dept_id, projs]) => ({
          department_id: dept_id,
          project_count: projs.length,
          projects: projs.map((p: any) => ({ id: p.id, title: p.title, status: p.status }))
        }))
      )
    }
    
    return map
  }, [projects])

  // Enriquecer departments com dados de projetos da API REAL
  const enrichedDepartments = useMemo(() => {
    const enriched = departments.map(dept => {
      // Buscar projetos reais vinculados a este departamento via church_department_id
      const deptProjects = projectsByDepartmentMap.get(dept.id) || []
      
      // Calcular projetos abertos e concluídos
      const openProjects = deptProjects.filter((p: any) => 
        p.status !== 'CONCLUDED' && p.status !== 'EXPIRED'
      ).length
      
      const completedProjects = deptProjects.filter((p: any) => 
        p.status === 'CONCLUDED'
      ).length
      
      return {
        ...dept,
        open_projects: openProjects,
        completed_projects: completedProjects,
        total_projects: deptProjects.length,
        // Guardar os projetos para uso posterior se necessário
        projects: deptProjects
      }
    })
    
    // Debug: Log enriched departments with project counts from REAL API data
    console.log('📊 [Church Departments] Enriched Departments with REAL Project Data:', 
      enriched.map(d => ({
        id: d.id,
        name: d.name,
        church_name: d.church_name,
        total_projects: d.total_projects,
        open_projects: d.open_projects,
        completed_projects: d.completed_projects,
        projects_from_api: d.projects?.map((p: any) => ({ id: p.id, title: p.title, status: p.status }))
      }))
    )
    
    // Comparação entre dados da API de projetos vs. KPI hook (se houver discrepância)
    const departmentsWithDiscrepancy = enriched.filter(d => {
      const kpiData = departmentActivityMap.get(d.id)
      return kpiData && kpiData.project_count !== d.total_projects
    })
    
    if (departmentsWithDiscrepancy.length > 0) {
      console.warn('⚠️ [Data Discrepancy] Departments with different project counts between API sources:', 
        departmentsWithDiscrepancy.map(d => {
          const kpiData = departmentActivityMap.get(d.id)
          return {
            department_name: d.name,
            real_project_count: d.total_projects,
            kpi_project_count: kpiData?.project_count || 0,
            difference: d.total_projects - (kpiData?.project_count || 0)
          }
        })
      )
    }
    
    return enriched
  }, [departments, projectsByDepartmentMap, departmentActivityMap])

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => {
    if (!kpis) return []

    const kpiCardsTranslations = (t.church_page as any)?.kpi_cards || {}

    // Total de churches únicas que têm departamentos
    const uniqueChurches = new Set(departments.map(d => d.church_id));
    const totalChurches = uniqueChurches.size;

    return [
      {
        id: "total_departments",
        title: kpiCardsTranslations.total_departments || "Church Departments",
        value: kpis.totalDepartments,
        icon: Layers,
        subtitle: kpiCardsTranslations.total_departments_subtitle || "Total church departments"
      },
      {
        id: "total_churches",
        title: kpiCardsTranslations.total_churches || "Total Churches",
        value: totalChurches,
        icon: Home,
        subtitle: kpiCardsTranslations.total_churches_subtitle || "Churches with departments"
      },
      {
        id: "total_projects",
        title: kpiCardsTranslations.total_projects || "Total Projects",
        value: kpis.totalProjects,
        icon: TrendingUp,
        subtitle: kpiCardsTranslations.total_projects_subtitle || "All registered projects"
      },
      {
        id: "open_projects",
        title: kpiCardsTranslations.open_projects || "Open Projects",
        value: kpis.openProjects,
        icon: FileText,
        subtitle: kpiCardsTranslations.open_projects_subtitle || "Projects in progress"
      },
      {
        id: "completed_projects",
        title: kpiCardsTranslations.completed_projects || "Completed Projects",
        value: kpis.completedProjects,
        icon: CheckCircle2,
        subtitle: kpiCardsTranslations.completed_projects_subtitle || "Successfully completed"
      }
    ]
  }, [kpis, departments, t]);

  // Dados para gráficos (apenas nome e orçamento)
  const chartData = useMemo(() => {
    return {
      budgetByDepartment: departments.map(d => {
        const latestBudget = d.annual_budgets?.[0];
        return {
          department: d.name,
          budget: latestBudget?.planned_budget || 0
        };
      }),
      userRequests: [],
      budgetTimeline: [],
      subsidyRequestsByDepartment: [] // TODO: implementar quando backend fornecer
    };
  }, [departments]);

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(t.common?.loading || "Loading...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.dismiss(loadingToast)
        toast.success(t.common?.data_loaded || "Data loaded successfully", { duration: 3000 })

      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t.common?.error || "An error occurred")
      }
    }

    loadData()
  }, [])

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t.common?.refreshing || "Refreshing...")
    
    try {
      await refetchInstitutionById()
      toast.success(t.common?.data_refreshed || "Data refreshed", { duration: 2000 })
    } catch (error) {
      toast.error(t.common?.error_refreshing || "Error refreshing")
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleCreate = () => {
    setIsAddDepartmentModalOpen(true)
  }
  
  const handleCreateInstitutional = () => {
    setIsAddDepartmentModalOpen(true)
  }
  
  const handleViewDetails = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartmentDetail(department);
      setViewMode('detail');
    }
  };
  
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDepartmentDetail(null);
  };
  
  const handleEdit = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartment(department);
      setIsEditDepartmentModalOpen(true);
    }
  };
  
  const handleDelete = (id: string, name: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartment(department);
      setIsDeleteDepartmentModalOpen(true);
    }
  };
  
  const handleViewContact = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department && (department as any).contact) {
      const contact = (department as any).contact;
      const contactData: ContactData = {
        id: `contact_${department.id}`,
        name: contact.name,
        phone: contact.phone,
        mobile: null,
        email: contact.email,
        country: null,
        city: contact.city,
        address: null,
        full_address: null,
        postal_code: null,
        website: null,
        notes: null,
        is_primary: true,
        created_at: department.created_at,
        updated_at: department.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedContact(contactData);
      setIsViewContactModalOpen(true);
    }
  };

  const handleDepartmentSaved = (department: CreateDepartment) => {
    toast.success(t.toasts?.created || "Church department created successfully")
    handleRefresh()
  }
  
  const handleDepartmentUpdated = (department: DepartmentData) => {
    toast.success(t.toasts?.updated || "Church department updated successfully")
    handleRefresh()
  }
  
  const handleDepartmentDeleted = (department: DepartmentData) => {
    toast.success(t.toasts?.deleted || "Church department deleted successfully")
    handleRefresh()
  }

  if (!currentInstitutionData) return <NotFound />
  
  // Colunas da tabela de departamentos
  const departmentColumns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-900">{t.labels?.name || "Name"}</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3 max-w-[300px]">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground max-w-xs truncate line-clamp-2">{row.original.description || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      id: "church_id",
      accessorKey: "church_id",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.labels?.church || "Church"}
        </div>
      ),
      cell: ({ row }) => {
        const church = churches.find((c: ChurchData) => c.id === row.original.church_id)
        
        // Log quando não encontrar a igreja correspondente
        if (!church && row.original.church_id) {
          console.warn('⚠️ [Church Not Found] Department has church_id but church not found:', {
            departmentId: row.original.id,
            departmentName: row.original.name,
            church_id: row.original.church_id,
            church_name: row.original.church_name,
            availableChurches: churches.map(c => ({ id: c.id, name: c.name }))
          })
        }
        
        return (
          <div className="flex items-center justify-center gap-2">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1.5 px-2.5 py-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{church?.name || row.original.church_name || '-'}</span>
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true
        return row.getValue(id) === value
      },
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: () => (
        <div className="flex items-center justify-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-900">{t.stats?.members || "Members"}</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="font-medium text-foreground">{row.original.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "total_projects",
      header: () => (
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-900">{t.stats?.projects || "Projects"}</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="font-medium text-foreground">{row.original.total_projects || 0}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-900">{t.common?.status || "Status"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t.common?.active || "Active" : t.common?.inactive || "Inactive"}
              variant={isActive ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-gray-900">{t.common?.actions || "Actions"}</span>
        </div>
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
              <Eye className="w-4 h-4 mr-2" />
              {t.actions?.view_details || "View Details"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.actions?.edit_department || "Edit Department"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t.actions?.delete_department || "Delete Department"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Colunas da tabela de usuários (para detail view)
  const userColumns: ColumnDef<any>[] = [
    {
      id: "avatar",
      header: t.users?.table?.avatar || "Avatar",
      cell: ({ row }) => {
        const user = row.original
        return (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: t.users?.table?.name || "Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {user.email || '-'}
            </div>
          </div>
        )
      },
    },
    {
      id: "language",
      accessorKey: "language_preference",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.users?.table?.language || "Language"}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs font-mono">
            {row.original.language_preference?.toUpperCase() || 'N/A'}
          </Badge>
        </div>
      ),
    },
    {
      id: "roles",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.users?.table?.roles || "Roles"}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {user.user_roles?.map((role: any) => (
              <Badge 
                key={role.id} 
                variant={role.role.key_code === 'ADMIN' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {role.role.key_code === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
                {role.role.name}
              </Badge>
            )) || <span className="text-xs text-muted-foreground">{t.users?.table?.no_roles || "No roles"}</span>}
          </div>
        )
      },
    },
    {
      id: "gender",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.users?.table?.gender || "Gender"}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const genderLabel = user.gender ? `${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1).toLowerCase()}` : 'N/A';
        return (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              {genderLabel}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.users?.table?.status || "Status"}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t.users?.table?.active || "Active" : t.users?.table?.inactive || "Inactive"}
              variant={isActive ? "success" : "error"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
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
      <WithPermission requiredPermissions={[PermissionResolverName.Departments]} fallback={<AccessDenied/>}>
      
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Breadcrumbs Navigation - Only in Detail View */}
        {viewMode === 'detail' && selectedDepartmentDetail && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToList();
                  }}
                  className="cursor-pointer hover:text-foreground"
                >
                  {t.breadcrumb?.all_departments || "See All Church Departments"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {selectedDepartmentDetail.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header - Only show in List View */}
        {viewMode === 'list' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                {t.page?.title || "Church Departments"}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {t.page?.description || "Manage church-level departments and ministries"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {t.create_department || "Create Church Department"}
              </Button>
              
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
        )}

        {/* KPI Cards - Conditional Rendering */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Detail View KPI Cards usando KPICards component com carrossel */}
            {(() => {
              const projects = (selectedDepartmentDetail as any).projects || [];
              const openProjectsCount = projects.filter((p: any) => 
                p.status !== 'COMPLETED' && !p.is_completed
              ).length;
              const completedProjectsCount = projects.filter((p: any) => 
                p.status === 'COMPLETED' || p.is_completed
              ).length;
              
              const kpiCardsTranslations = ((t as any).church_page?.kpi_cards) || {}
              const detailKPIData: KPICardData[] = [
                {
                  id: "members",
                  title: kpiCardsTranslations.members || "Members",
                  value: selectedDepartmentDetail.users?.length || 0,
                  icon: Users,
                  subtitle: kpiCardsTranslations.members_subtitle || "Department members",
                },
                {
                  id: "total_projects",
                  title: kpiCardsTranslations.total_projects || "Total Projects",
                  value: projects.length,
                  icon: TrendingUp,
                  subtitle: kpiCardsTranslations.total_projects_subtitle || "All registered projects",
                },
                {
                  id: "open_projects",
                  title: kpiCardsTranslations.open_projects || "Open Projects",
                  value: openProjectsCount,
                  icon: Calendar,
                  subtitle: kpiCardsTranslations.open_projects_subtitle || "Projects in progress",
                },
                {
                  id: "completed_projects",
                  title: kpiCardsTranslations.completed_projects || "Completed Projects",
                  value: completedProjectsCount,
                  icon: Shield,
                  subtitle: kpiCardsTranslations.completed_projects_subtitle || "Successfully completed",
                }
              ];
              
              const customFirstCard = (
                <EntityInfoCard
                  headerTitle={t.detail?.info_card?.header_title || "Department Info"}
                  name={selectedDepartmentDetail.name}
                  description={selectedDepartmentDetail.description || t.detail?.info_card?.no_description || "No description available"}
                  icon={Layers}
                  badges={[
                    {
                      label: churches.find(c => c.id === selectedDepartmentDetail.church_id)?.name || t.labels?.institutional || "Institutional",
                      variant: "outline",
                      className: "text-xs"
                    },
                    {
                      label: !selectedDepartmentDetail.is_deleted ? t.common?.active || "Active" : t.common?.inactive || "Inactive",
                      variant: !selectedDepartmentDetail.is_deleted ? "default" : "secondary",
                      className: !selectedDepartmentDetail.is_deleted 
                        ? "text-xs bg-green-100 text-green-700" 
                        : "text-xs bg-gray-100 text-gray-700"
                    }
                  ]}
                  actions={[
                    {
                      label: t.actions?.edit_department || "Edit Department",
                      icon: Edit,
                      onClick: () => handleEdit(selectedDepartmentDetail.id),
                      variant: "default"
                    },
                    {
                      label: t.actions?.delete_department || "Delete Department",
                      icon: Trash2,
                      onClick: () => handleDelete(selectedDepartmentDetail.id, selectedDepartmentDetail.name),
                      variant: "destructive",
                      showSeparatorAfter: false
                    }
                  ]}
                />
              );
              
              return (
                <KPICards
                  data={detailKPIData}
                  isLoading={false}
                  minCardsForCarousel={3}
                  showCarousel={true}
                  customFirstCard={customFirstCard}
                />
              );
            })()}
          </>
        ) : (
            <KPICards
              data={kpiCardsData}
              isLoading={isLoading}
              minCardsForCarousel={2}
              showCarousel={true}
            />
        )}

        <Separator />

        {/* Charts Section - Visible in both views */}
        <GridContainer
            items={[
                {
                  id: "DepartmentProjectOverTimeChart",
                    component: (
                      <DepartmentProjectOverTimeChart 
                        loading={isLoading || projectsLoading} 
                        departments={departments}
                        projects={projects}
                        selectedYear={new Date().getFullYear()}
                      />
                    ),
                  colSpan: "col-span-12 lg:col-span-8",
                },
                {
                  id: "DepartmentLeadersCard",
                    component: (
                      <DepartmentLeadersCard 
                        institutionId={currentInstitutionData?.id} 
                        loading={isLoading}
                        departmentType="church"
                      />
                    ),
                  colSpan: "col-span-12 lg:col-span-4",
                },
              ]}
            gap="lg"
          />

        <Separator />

        {/* Conditional Content - Users Table or Departments Table */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t.detail?.members_table?.title || "Department Members"}
                </CardTitle>
                <CardDescription>
                  {`${t.detail?.members_table?.description || "List of all members in"} ${selectedDepartmentDetail.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={userColumns}
                  data={selectedDepartmentDetail.users || []}
                  searchKey="name"
                  emptyEntityName={selectedDepartmentDetail.name}
                  filters={[
                    {
                      id: "status",
                      title: t.common?.status || "Status",
                      options: [
                        { label: t.common?.active || "Active", value: "true" },
                        { label: t.common?.inactive || "Inactive", value: "false" }
                      ]
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Departments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  {t.table_title || "Church Departments"}
                </CardTitle>
                <CardDescription>{t.table_description || "Complete list of church departments with management actions"}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={departmentColumns}
                  data={enrichedDepartments}
                  searchKey="name"
                  emptyEntityName={t.entity_name || "Church Departments"}
                  filters={[
                {
                  id: "church_id",
                  title: t.labels?.church || "Church",
                  options: churches.map(church => ({
                    label: church.name,
                    value: church.id
                  }))
                },
                {
                  id: "status",
                  title: t.common?.status || "Status",
                  options: [
                    { label: t.common?.active || "Active", value: "true" },
                    { label: t.common?.inactive || "Inactive", value: "false" }
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>
          </>
        )}
        
        {/* Add Department Modal - CHURCH DEPARTMENT */}
        <AddDepartmentModal
          isOpen={isAddDepartmentModalOpen}
          onOpenChange={setIsAddDepartmentModalOpen}
          institutionId={currentInstitutionData.id}
          churches={churches as any}
          onSave={handleDepartmentSaved}
          departmentType="church"
        />
        
        {/* Edit Department Modal */}
        {selectedDepartment && (
          <EditDepartmentModal
            isOpen={isEditDepartmentModalOpen}
            onOpenChange={setIsEditDepartmentModalOpen}
            department={selectedDepartment as any}
            churches={churches as any}
            onSave={handleDepartmentUpdated as any}
          />
        )}
        
        {/* Delete Department Modal */}
        {selectedDepartment && (
          <DeleteDepartmentModal
            isOpen={isDeleteDepartmentModalOpen}
            onOpenChange={setIsDeleteDepartmentModalOpen}
            department={selectedDepartment as any}
            onSuccess={handleDepartmentDeleted as any}
          />
        )}
        
        {/* View Contact Modal */}
        {/* TODO: Fix ContactViewEditModal - requires updateMutation and entityId props */}
        {/* {selectedContact && (
          <ContactViewEditModal
            isOpen={isViewContactModalOpen}
            onOpenChange={setIsViewContactModalOpen}
            contact={selectedContact as any}
          />
        )} */}
        
      </div>
      </WithPermission>
    </AppLayout>
  )
}
