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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  CheckCircle2,
  Eye,
  Crown
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
import { ProtectedKPICarousel, type ProtectedKPICardData } from "@/components/shared/protected-kpi-carousel"
import { DepartmentProjectOverTimeChart } from "@/components/institutions/charts/department-project-over-time-chart"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { EntityInfoCard } from "@/components/shared/entity-info-card"
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
import { DepartmentLeadersCard } from "@/components/modals/department/department-leaders-card"
import { DepartmentProjectsCard } from "@/components/modals/department/department-projects-card"
import { DepartmentLeaderInfoCard } from "@/components/modals/department/department-leader-info-card"


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS DE IGREJAS
 * Interface dedicada para gerenciar departamentos vinculados a igrejas
 */
export default function ChurchDepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const churches: ChurchData[] = currentInstitutionData?.churches || [];
  
  // Interface estendida para incluir church_name
  type ExtendedDepartmentData = DepartmentData & { church_name?: string };
  
  // Extrair departamentos das igrejas e adicionar church_name
  const departments: ExtendedDepartmentData[] = churches.flatMap(church => 
    church.departments?.map(department => ({ 
      ...department, 
      church_name: church.name 
    })) || []
  );
  
  // Fetch todos os projetos da instituição
  const { 
    data: projectsData, 
    loading: projectsLoading, 
    error: projectsError,
    refetch: refetchProjects
  } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id
  });
  
  const projects = projectsData?.projects || [];
  
  // Debug: Log dados de igrejas e departamentos
  useEffect(() => {
      churches.map(church => ({
      church_id: church.id,
      church_name: church.name,
      departments_count: church.departments?.length || 0,
      departments: church.departments?.map(d => ({ id: d.id, name: d.name, church_id: d.church_id })) || []
    }))
    
    // Validar consistência: todos os departamentos devem ter church_id correspondente
    const inconsistentDepartments = departments.filter(dept => {
      const parentChurch = churches.find(c => c.id === dept.church_id)
      return !parentChurch
    })
    
    if (inconsistentDepartments.length > 0) {
      console.error('[Data Inconsistency] Departments without valid church reference:', inconsistentDepartments)
    }
  }, [churches, departments])
  
  // Debug: Log dados de projetos e sua relação com departamentos
  useEffect(() => {
    if (!projects || projects.length === 0) {
      return
    }
   
    
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
    
    
    // Filtrar projetos que têm church_department_id
    const projectsWithChurchDept = projects.filter((p: any) => p.church_department_id)
    
    if (projectsWithChurchDept.length > 0) {
      projectsWithChurchDept.map((p: any) => ({
        project_title: p.title,
        church_department_id: p.church_department_id,
        church_department_name: p.church_department?.name || 'Unknown',
        church_name: p.church_department?.church?.name || 'Unknown'
      }))
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
    
    
    // Contar projetos por departamento
    const projectsByDepartment = new Map<string, any[]>()
    projectsWithChurchDept.forEach((project: any) => {
      const deptId = project.church_department_id
      if (!projectsByDepartment.has(deptId)) {
        projectsByDepartment.set(deptId, [])
      }
      projectsByDepartment.get(deptId)?.push(project)
    })
    
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
    
    // Identificar departamentos sem projetos
    const departmentsWithoutProjects = departments.filter(dept => 
      !projectsByDepartment.has(dept.id)
    )
  
    
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

  // Filter states - PageFilters
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    church: "all",
    status: "true" // Default to active departments
  })
  
  // Year filter state
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear, currentYear - 1, currentYear - 2].sort((a, b) => b - a)
  })

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
      
        Array.from(map.entries()).map(([dept_id, projs]) => ({
          department_id: dept_id,
          project_count: projs.length,
          projects: projs.map((p: any) => ({ id: p.id, title: p.title, status: p.status }))
        }))
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
    
    enriched.map(d => ({
      id: d.id,
      name: d.name,
      church_name: d.church_name,
      total_projects: d.total_projects,
      open_projects: d.open_projects,
      completed_projects: d.completed_projects,
      projects_from_api: d.projects?.map((p: any) => ({ id: p.id, title: p.title, status: p.status }))
    }))
    
    const departmentsWithDiscrepancy = enriched.filter(d => {
      const kpiData = departmentActivityMap.get(d.id)
      return kpiData && kpiData.project_count !== d.total_projects
    })
    
    if (departmentsWithDiscrepancy.length > 0) {
       departmentsWithDiscrepancy.map(d => {
        const kpiData = departmentActivityMap.get(d.id)
        return {
          department_name: d.name,
          real_project_count: d.total_projects,
          kpi_project_count: kpiData?.project_count || 0,
          difference: d.total_projects - (kpiData?.project_count || 0)
        }
      })
    }
    
    return enriched
  }, [departments, projectsByDepartmentMap, departmentActivityMap])

  // Filter data based on church, status, and year
  const filteredDepartments = useMemo(() => {
    let filtered = enrichedDepartments
    
    // Apply church filter
    if (filterValues.church !== "all") {
      filtered = filtered.filter(dept => dept.church_id === filterValues.church)
    }
    
    // Apply status filter
    if (filterValues.status !== "all") {
      const isActive = filterValues.status === "true"
      filtered = filtered.filter(dept => !dept.is_deleted === isActive)
    }
    
    return filtered
  }, [enrichedDepartments, filterValues])

  // Filter projects by year
  const projectsByYear = useMemo(() => {
    return projects.filter(project => {
      const createdDate = new Date(project.created_at || project.start_at)
      return createdDate.getFullYear() === selectedYear
    })
  }, [projects, selectedYear])

  // Filter users by year for detail view
  const usersByYear = useMemo(() => {
    if (!selectedDepartmentDetail?.users) return []
    
    return selectedDepartmentDetail.users.filter(user => {
      const createdDate = new Date(user.created_at)
      return createdDate.getFullYear() === selectedYear
    })
  }, [selectedDepartmentDetail?.users, selectedYear])

  // Dados para KPI Cards Carrossel com Proteção de Privacidade
  const kpiCardsData: ProtectedKPICardData[] = useMemo(() => {
    
  
    
    const kpiCardsTranslations = (t.church_page as any)?.kpi_cards || {}

    // Total de membros únicos em todos os departamentos de igreja (filtered)
    const uniqueMemberIds = new Set<string>()
    filteredDepartments.forEach(dept => {
      dept.users?.forEach(user => {
        if (!user.is_deleted) {
          uniqueMemberIds.add(user.id)
        }
      })
    })
    const totalMembers = uniqueMemberIds.size

    // Contar projetos reais da API filtrados por ano e departamentos filtrados
    const filteredDeptIds = new Set(filteredDepartments.map(d => d.id))
    const churchProjects = projectsByYear.filter((p: any) => 
      p.church_department_id && filteredDeptIds.has(p.church_department_id)
    )
    const totalProjects = churchProjects.length
    const openProjects = churchProjects.filter((p: any) => 
      p.status !== 'CONCLUDED' && p.status !== 'EXPIRED'
    ).length
    const completedProjects = churchProjects.filter((p: any) => 
      p.status === 'CONCLUDED'
    ).length

    const cards = [
      {
        id: "total_departments",
        title: kpiCardsTranslations.total_departments || "Church Departments",
        value: filteredDepartments.length,
        icon: Layers,
        subtitle: kpiCardsTranslations.total_departments_subtitle || "Total church departments",
        requiredPermission: PermissionResolverName.Departments
      },
      {
        id: "total_members",
        title: kpiCardsTranslations.total_members || "Total Members",
        value: totalMembers,
        icon: Users,
        subtitle: kpiCardsTranslations.total_members_subtitle || "Active department members",
        requiredPermission: PermissionResolverName.Users
      },
      {
        id: "total_projects",
        title: kpiCardsTranslations.total_projects || "Total Projects",
        value: totalProjects,
        icon: TrendingUp,
        subtitle: kpiCardsTranslations.total_projects_subtitle || "All registered projects",
        requiredPermission: [PermissionResolverName.Projects, PermissionResolverName.Departments]
      },
      {
        id: "completed_projects",
        title: kpiCardsTranslations.completed_projects || "Completed Projects",
        value: completedProjects,
        icon: CheckCircle2,
        subtitle: kpiCardsTranslations.completed_projects_subtitle || "Successfully completed",
        requiredPermission: [PermissionResolverName.Projects, PermissionResolverName.Departments]
      }
    ]
  
    
    return cards
  }, [filteredDepartments, projectsByYear, t, kpis]);

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

  // Configure PageFilters
  const pageFilters: FilterConfig[] = useMemo(() => {
    const filters: FilterConfig[] = []
    
    // Add church filter
    if (churches.length > 0) {
      filters.push({
        id: "church",
        label: t.labels?.church || "Church",
        type: "select",
        placeholder: t.fields?.search_church || "Select church...",
        icon: Building,
        options: [
          { label: t.common?.all || "All", value: "all" },
          ...churches.map(church => ({
            label: church.name,
            value: church.id
          }))
        ]
      })
    }
    
    // Add status filter
    filters.push({
      id: "status",
      label: t.common?.status || "Status",
      type: "select",
      placeholder: "Select status...",
      icon: Shield,
      options: [
        { label: t.common?.all || "All", value: "all" },
        { label: t.common?.active || "Active", value: "true" },
        { label: t.common?.inactive || "Inactive", value: "false" }
      ]
    })
    
    return filters
  }, [churches, t])

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }))
  }

  const handleClearFilters = () => {
    setFilterValues({ church: "all", status: "true" })
    toast.success(t.common?.filters_cleared || "Filters cleared", { duration: 1500 })
  }

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(`Cannot add years beyond ${maxAllowedYear}`)
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(`Year ${nextYear} already exists`)
      return
    }

    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    setSelectedYear(nextYear)
    toast.success(`Year ${nextYear} added successfully`)
  }

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t.common?.refreshing || "Refreshing...")
    
    try {
      // Refetch institution data (departments, churches, users)
      await refetchInstitutionById()
      
      // Refetch projects data
      if (refetchProjects) {
        await refetchProjects()
      }
      
      toast.success(t.common?.data_refreshed || "Data refreshed", { duration: 2000 })
    } catch (error) {
      console.error('Error refreshing data:', error)
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
      // Scroll suave para o topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDepartmentDetail(null);
    // Scroll suave para o topo da página ao voltar para a lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  
  // Year Filter Component
  const YearFilter = ({ showAddButton = true }: { showAddButton?: boolean }) => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const canAddMore = Math.max(...availableYears) < maxAllowedYear

    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
          {availableYears.map((year) => (
            <Button
              key={year}
              variant="outline"
              size="sm"
              onClick={() => setSelectedYear(year)}
              className={`
                flex-shrink-0 min-w-[80px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
                ${
                  selectedYear === year 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90' 
                    : 'bg-muted text-muted-foreground border-muted hover:bg-muted/80 hover:text-foreground hover:border-muted-foreground/50'
                }
              `}
            >
              {year}
            </Button>
          ))}
          
          {/* Add New Year Button */}
          {showAddButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddYear}
              disabled={!canAddMore}
              className={`
                flex-shrink-0 min-w-[100px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
                ${
                  canAddMore 
                    ? 'border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/50' 
                    : 'opacity-40 cursor-not-allowed border-dashed border-muted-foreground/20 text-muted-foreground/50'
                }
              `}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.common?.add_year || "Add Year"}
            </Button>
          )}
        </div>
      </div>
    )
  }
  
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
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        
        return (
          <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <WithPermission requiredPermissions={[PermissionResolverName.Department]}>
                    <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      {t.actions?.view_details || "View Details"}
                    </DropdownMenuItem>
                  </WithPermission>
                  {isActive && (
                    <>
                      <WithPermission requiredPermissions={[PermissionResolverName.UpdateDepartment]}>
                        <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {t.actions?.edit_department || "Edit Department"}
                        </DropdownMenuItem>
                      </WithPermission>
                      <WithPermission requiredPermissions={[PermissionResolverName.DeleteDepartment]}>
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t.modals?.delete?.deactivate_department || "Deactivate Department"}
                        </DropdownMenuItem>
                      </WithPermission>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Colunas da tabela de usuários (para detail view)
  const userColumns: ColumnDef<any>[] = [
    {
      id: "user",
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-900">{t.users?.table?.name || "User"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-xs">
                {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email || '-'}</span>
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
              <StatusBadge
                key={role.id}
                label={role.role.name}
                variant="default"
                size="sm"
              />
            )) || <span className="text-xs text-muted-foreground">{t.users?.table?.no_roles || "No roles"}</span>}
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
              size="sm"
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
          <span className="font-medium text-gray-900">{t.labels?.actions || "Actions"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewContact(user.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t.labels?.viewContact || "View Contact"}
                </DropdownMenuItem>
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
                  className="cursor-pointer hover:text-foreground transition-colors"
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

        {/* Header - Show appropriate content for each view */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                  {selectedDepartmentDetail.name}
                </h2>
                <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                  {selectedDepartmentDetail.description || t.detail?.info_card?.no_description || "Department details and member management"}
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
            
            {/* Year Filter for Detail View */}
            <div className="flex items-center gap-3">
              <YearFilter showAddButton={false} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                  {t.church_page?.title  || "Church Departments"}
                </h2>
                <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                  {t.page?.description || "Manage church-level departments and ministries"}
                </p>
              </div>
              
              <div className="flex items-center gap-3">

                <PageFilters
                  filters={pageFilters}
                  values={filterValues}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  triggerLabel={t.common?.filters || "Filters"}
                />
            

                <WithPermission requiredPermissions={[PermissionResolverName.CreateDepartment]}>
                  <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.create_department || "Create Church Department"}
                  </Button>
                </WithPermission>
                
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
            
            {/* Filters Row */}
            <div className="flex items-center gap-3">
              <YearFilter showAddButton={false} />
            </div>
          </div>
        )}

        {/* KPI Cards - Conditional Rendering */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Detail View KPI Cards usando KPICards component com carrossel */}
            {(() => {
              // Filter projects by year for detail view
              const departmentProjects = projectsByYear.filter((p: any) => 
                p.church_department_id === selectedDepartmentDetail.id
              );
              
              const openProjectsCount = departmentProjects.filter((p: any) => 
                p.status !== 'CONCLUDED' && p.status !== 'EXPIRED'
              ).length;
              const completedProjectsCount = departmentProjects.filter((p: any) => 
                p.status === 'CONCLUDED'
              ).length;
              
              const kpiCardsTranslations = ((t as any).church_page?.kpi_cards) || {}
              const detailKPIData: ProtectedKPICardData[] = [
                {
                  id: "members",
                  title: kpiCardsTranslations.members || "Members",
                  value: selectedDepartmentDetail.users?.length || 0,
                  icon: Users,
                  subtitle: kpiCardsTranslations.members_subtitle || "Department members",
                  requiredPermission: PermissionResolverName.Users
                },
                {
                  id: "total_projects",
                  title: kpiCardsTranslations.total_projects || "Total Projects",
                  value: departmentProjects.length,
                  icon: TrendingUp,
                  subtitle: kpiCardsTranslations.total_projects_subtitle || "All registered projects",
                  requiredPermission: [PermissionResolverName.Projects, PermissionResolverName.Departments]
                },
                {
                  id: "completed_projects",
                  title: kpiCardsTranslations.completed_projects || "Completed Projects",
                  value: completedProjectsCount,
                  icon: Shield,
                  subtitle: kpiCardsTranslations.completed_projects_subtitle || "Successfully completed",
                  requiredPermission: [PermissionResolverName.Projects, PermissionResolverName.Departments]
                }
              ];
              
              return (
                <ProtectedKPICarousel
                  data={detailKPIData}
                  isLoading={false}
                  minCardsForCarousel={2}
                  showCarousel={true}
                  skeletonCount={4}
                  customFirstItem={
                    <EntityInfoCard
                      headerTitle={t.detail?.info_card?.header_title || "Department Info"}
                      name={selectedDepartmentDetail.name}
                      description={selectedDepartmentDetail.description || t.detail?.info_card?.no_description || "No description available"}
                      icon={Layers}
                      invertTheme={true}
                      badges={[
                        {
                          label: churches.find(c => c.id === selectedDepartmentDetail.church_id)?.name || t.labels?.institutional || "Institutional",
                          variant: "default",
                          className: "text-xs",
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
                          variant: "default",
                          requiredPermissions: [PermissionResolverName.UpdateDepartment]
                        },
                        {
                          label: t.actions?.delete_department || "Delete Department",
                          icon: Trash2,
                          onClick: () => handleDelete(selectedDepartmentDetail.id, selectedDepartmentDetail.name),
                          variant: "destructive",
                          showSeparatorAfter: false,
                          requiredPermissions: [PermissionResolverName.DeleteDepartment]
                        }
                      ]}
                    />
                  }
                />
              );
            })()}
          </>
        ) : (
            (() => {
              const now = new Date()
              const startOfYear = new Date(now.getFullYear(), 0, 1)
              const totalDays = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0)
              const daysPassed = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
              const percentage = Math.round((daysPassed / totalDays) * 100)
  
              
              const YearProgressCard = (
                <EntityInfoCard
                  headerTitle={`Year progress  - ${now.getFullYear()}`}
                  name={`${daysPassed} / ${totalDays} days`}
                  description={`${percentage}%`}
                  icon={Calendar}
                  invertTheme={true}
                  badges={[
                    {
                      label: `Day ${daysPassed}/${totalDays}`,
                      variant: "default",
                      className: "text-xs font-medium"
                    },
                    {
                      label: `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`,
                      variant: "default",
                      className: "text-xs "
                    }
                  ]}
                />
              )
              

              return (
                <ProtectedKPICarousel
                  data={kpiCardsData}
                  isLoading={isLoading}
                  minCardsForCarousel={2}
                  showCarousel={true}
                  skeletonCount={4}
                  customFirstItem={YearProgressCard}
                />
              )
            })()
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
                        departments={viewMode === 'detail' && selectedDepartmentDetail 
                          ? [selectedDepartmentDetail] 
                          : filteredDepartments
                        }
                        projects={viewMode === 'detail' && selectedDepartmentDetail
                          ? projectsByYear.filter((p: any) => p.church_department_id === selectedDepartmentDetail.id)
                          : projectsByYear.filter((p: any) => {
                              const filteredDeptIds = new Set(filteredDepartments.map(d => d.id))
                              return filteredDeptIds.has(p.church_department_id)
                            })
                        }
                        selectedYear={selectedYear}
                      />
                    ),
                  colSpan: viewMode === 'detail' ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-8",
                },
                ...(viewMode === 'detail' && selectedDepartmentDetail ? [
                  {
                    id: "DepartmentInfoAndProjects",
                    component: (
                      <div className="flex flex-col gap-4 h-[calc(100vh-24rem)] min-h-[600px]">
                        <div className="h-[23%] min-h-[100px]">
                          <DepartmentLeaderInfoCard
                            department={{
                              id: selectedDepartmentDetail.id,
                              name: selectedDepartmentDetail.name,
                              leader_id: selectedDepartmentDetail.leader_id
                            }}
                            users={(currentInstitutionData?.users || []).filter(user => !user.is_deleted).map(u => ({
                              id: u.id,
                              name: u.name,
                              email: u.email,
                              language_preference: u.language_preference || undefined
                            }))}
                            loading={isLoading}
                            showHeader={false}
                          />
                        </div>
                        <div className="flex-1 h-[77%] min-h-[400px]">
                          <DepartmentProjectsCard
                            projects={projectsByYear as any}
                            departmentId={selectedDepartmentDetail.id}
                            departmentName={selectedDepartmentDetail.name}
                            loading={projectsLoading}
                          />
                        </div>
                      </div>
                    ),
                    colSpan: "col-span-12 lg:col-span-5",
                  }
                ] : [
                  {
                    id: "DepartmentLeadersCard",
                    component: (
                      <DepartmentLeadersCard 
                        users={(currentInstitutionData?.users || []).filter(user => !user.is_deleted) as any}
                        departments={departments.map(d => ({
                          id: d.id,
                          name: d.name,
                          church_id: d.church_id,
                          church_name: d.church_name,
                          leader_id: d.leader_id
                        })) as any}
                        departmentType="church"
                        departmentName={t.page?.title || "Church Departments"}
                        loading={isLoading}
                      />
                    ),
                    colSpan: "col-span-12 lg:col-span-4",
                  }
                ])
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
                  {i18n.t('departments.detail.members_table.description', { name: selectedDepartmentDetail.name }) || `List of all members in ${selectedDepartmentDetail.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={userColumns}
                  data={usersByYear}
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
                  data={filteredDepartments}
                  searchKey="name"
                  emptyEntityName={t.entity_name || "Church Departments"}
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
