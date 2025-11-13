"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Home, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  MapPin,
  DollarSign,
  ContactRound,
  TrendingUp,
  Layers,
  Eye,
  Building2,
  Crown,
  Activity
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { structureTranslations } from "@/lib/translations/structure"
import { UseTable } from "@/components/ui/use-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { ChurchTypeBadge } from "@/components/ui/church-type-badge"
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { AnnualBudgetViewEditModal, AnnualBudgetData } from "@/components/modals/annual-budget"
import { AddChurchModal, EditChurchModal, DeleteChurchModal, ChurchData, RegionData } from "@/components/modals/church"
import { ChurchesKPICards, KPICardData, KPICards } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { ChurchActivityChart } from "@/components/churches/charts/church-activity-chart"
import { ProjectsByChurchChart } from "@/components/churches/charts/projects-by-church-chart"
import { MembersByChurchChart } from "@/components/churches/charts/members-by-church-chart"
import { EntityInfoCard } from "@/components/shared/entity-info-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useInstitution } from '@/contexts/institution-context'
import { CreateChurch } from "@/types/CreateChurch"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { ChurchType as ChurchTypeEnum } from "@/types/graphql-global-types"
// Dados reais de igrejas virão do contexto da instituição

// Timeline de solicitações de subsídio por igreja
const MOCK_SUBSIDY_TIMELINE = [
  { month: 'Jan', 'Central SP': 8, 'Vila Madalena': 5, 'Mooca': 4, 'Campinas': 10, 'Rio de Janeiro': 7 },
  { month: 'Feb', 'Central SP': 10, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 12, 'Rio de Janeiro': 8 },
  { month: 'Mar', 'Central SP': 9, 'Vila Madalena': 7, 'Mooca': 4, 'Campinas': 13, 'Rio de Janeiro': 9 },
  { month: 'Apr', 'Central SP': 11, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 14, 'Rio de Janeiro': 10 },
  { month: 'May', 'Central SP': 12, 'Vila Madalena': 8, 'Mooca': 6, 'Campinas': 15, 'Rio de Janeiro': 11 },
  { month: 'Jun', 'Central SP': 12, 'Vila Madalena': 8, 'Mooca': 6, 'Campinas': 15, 'Rio de Janeiro': 11 },
]

/**
 * MOCK DATA: DEPARTMENT ANALYTICS
 * 
 * Estes dados são utilizados como fallback quando uma church não possui departamentos.
 * Na view de detalhes da church, a função generateChurchDepartmentData() gera dados
 * dinâmicos baseados nos departamentos reais. Estes mocks garantem que os gráficos
 * sempre tenham dados para exibir.
 * 
 * Estrutura:
 * - MOCK_DEPARTMENT_ACTIVITIES: Atividades (ações) em projetos ao longo do tempo
 *   Cada departamento registra projetos, e cada projeto pode ter múltiplas atividades
 * - MOCK_MEMBERS_BY_DEPARTMENT: Distribuição de membros por departamento
 * - MOCK_PROJECTS_BY_DEPARTMENT: Projetos ativos e concluídos por departamento
 */

// Mock data: Atividades em projetos por departamento (para gráfico de timeline)
const MOCK_DEPARTMENT_ACTIVITIES = [
  { month: 'Jan', 'Youth Ministry': 12, 'Worship': 8, 'Education': 6, 'Community': 5, 'Evangelism': 7 },
  { month: 'Feb', 'Youth Ministry': 15, 'Worship': 10, 'Education': 8, 'Community': 6, 'Evangelism': 9 },
  { month: 'Mar', 'Youth Ministry': 14, 'Worship': 9, 'Education': 7, 'Community': 7, 'Evangelism': 8 },
  { month: 'Apr', 'Youth Ministry': 16, 'Worship': 11, 'Education': 9, 'Community': 8, 'Evangelism': 10 },
  { month: 'May', 'Youth Ministry': 18, 'Worship': 12, 'Education': 10, 'Community': 9, 'Evangelism': 11 },
  { month: 'Jun', 'Youth Ministry': 20, 'Worship': 13, 'Education': 11, 'Community': 10, 'Evangelism': 12 },
]

// Mock data: Membros por departamento
const MOCK_MEMBERS_BY_DEPARTMENT = [
  { 
    department: 'Youth Ministry', 
    fullName: 'Youth Ministry',
    members: 45,
    activeMembers: 42,
    fill: '#3b82f6'
  },
  { 
    department: 'Worship', 
    fullName: 'Worship Department',
    members: 32,
    activeMembers: 30,
    fill: '#8b5cf6'
  },
  { 
    department: 'Education', 
    fullName: 'Christian Education',
    members: 28,
    activeMembers: 26,
    fill: '#10b981'
  },
  { 
    department: 'Community', 
    fullName: 'Community Outreach',
    members: 24,
    activeMembers: 22,
    fill: '#f59e0b'
  },
  { 
    department: 'Evangelism', 
    fullName: 'Evangelism Department',
    members: 20,
    activeMembers: 18,
    fill: '#ef4444'
  },
]

// Mock data: Projetos por departamento
const MOCK_PROJECTS_BY_DEPARTMENT = [
  { 
    department: 'Youth Ministry', 
    fullName: 'Youth Ministry',
    projects: 8,
    activeProjects: 6,
    completedProjects: 2,
    fill: '#3b82f6'
  },
  { 
    department: 'Worship', 
    fullName: 'Worship Department',
    projects: 5,
    activeProjects: 4,
    completedProjects: 1,
    fill: '#8b5cf6'
  },
  { 
    department: 'Education', 
    fullName: 'Christian Education',
    projects: 6,
    activeProjects: 5,
    completedProjects: 1,
    fill: '#10b981'
  },
  { 
    department: 'Community', 
    fullName: 'Community Outreach',
    projects: 4,
    activeProjects: 3,
    completedProjects: 1,
    fill: '#f59e0b'
  },
  { 
    department: 'Evangelism', 
    fullName: 'Evangelism Department',
    projects: 7,
    activeProjects: 5,
    completedProjects: 2,
    fill: '#ef4444'
  },
]

/**
 * PÁGINA DE GESTÃO DE IGREJAS
 * Interface dedicada para gerenciar igrejas baseada no ERD do AdventistGroei
 */
export default function ChurchesPage() {
  const { i18n } = useTranslation()
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const churches = React.useMemo(() => currentInstitutionData?.churches || [], [currentInstitutionData]);
  
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // View mode states - controla se está na lista ou em detalhes
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [selectedChurchDetail, setSelectedChurchDetail] = useState<any | null>(null)
  
  // Modal states
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isAddChurchModalOpen, setIsAddChurchModalOpen] = useState(false)
  const [isEditChurchModalOpen, setIsEditChurchModalOpen] = useState(false)
  const [isDeleteChurchModalOpen, setIsDeleteChurchModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
  const [selectedChurch, setSelectedChurch] = useState<any>(null)
  const [selectedBudget, setSelectedBudget] = useState<AnnualBudgetData | null>(null)
  const [churchToEdit, setChurchToEdit] = useState<ChurchData | null>(null)
  const [churchToDelete, setChurchToDelete] = useState<ChurchData | null>(null)
  
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
  
  const handleBackToList = React.useCallback(() => {
    setViewMode('list');
    setSelectedChurchDetail(null);
  }, []);

  usePageTitle({
    title: viewMode === 'detail' && selectedChurchDetail 
      ? selectedChurchDetail.name 
      : t.churchesTitle
  })

  // Estatísticas calculadas dos dados
  type ChurchType = typeof churches extends (infer U)[] ? U : any;
  const kpiData = useMemo(() => {
    const totalChurches = churches.length;
    const totalMembers = churches.reduce((sum: number, c: ChurchType) => sum + ((c as any).members_count || 0), 0);
    const totalDepartments = churches.reduce((sum: number, c: ChurchType) => sum + ((c as any).departments_count || 0), 0);
    const totalSubsidyRequests = churches.reduce((sum: number, c: ChurchType) => sum + ((c as any).subsidy_requests || 0), 0);
    const totalBudget = churches.reduce((sum: number, c: ChurchType) => sum + ((c as any).total_budget || 0), 0);
    const totalUsedBudget = churches.reduce((sum: number, c: ChurchType) => sum + ((c as any).used_budget || 0), 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((totalUsedBudget / totalBudget) * 100) : 0;
    const avgMembersPerChurch = totalChurches > 0 ? Math.round(totalMembers / totalChurches) : 0;
    return {
      totalChurches,
      totalMembers,
      totalDepartments,
      totalSubsidyRequests,
      totalBudget,
      totalUsedBudget,
      budgetUtilization,
      avgMembersPerChurch
    };
  }, [churches]);

  // Mock data for projects
  const MOCK_PROJECTS_BY_CHURCH = [
    { church: "Igreja Central de São Paulo", projects: 12 },
    { church: "Igreja de Vila Madalena", projects: 8 },
    { church: "Igreja da Mooca", projects: 6 },
    { church: "Igreja de Campinas", projects: 15 },
    { church: "Igreja do Rio de Janeiro", projects: 10 },
  ]

  const totalProjects = MOCK_PROJECTS_BY_CHURCH.reduce((sum, item) => sum + item.projects, 0)

  // Dados dos KPIs em formato de array para o componente reutilizável
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total-churches",
      title: t.totalChurches,
      value: kpiData.totalChurches,
      icon: Home,
      subtitle: "Active churches"
    },
    {
      id: "total-members", 
      title: t.totalMembers,
      value: kpiData.totalMembers,
      icon: Users,
      subtitle: "Total members"
    },
    {
      id: "total-departments",
      title: t.departments,
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: "Active departments"
    },
    {
      id: "total-projects",
      title: "Total Projects",
      value: totalProjects,
      icon: TrendingUp,
      subtitle: "Active projects",
      trend: {
        value: 8.2,
        isPositive: true,
        label: "vs last month"
      }
    }
  ], [kpiData, t, totalProjects])

  // Mock data for charts - simplified for easy integration
  const MOCK_CHURCH_ACTIVITIES = [
    { month: 'Jan', 'Central SP': 8, 'Vila Madalena': 5, 'Mooca': 4, 'Campinas': 10, 'Rio': 7 },
    { month: 'Feb', 'Central SP': 10, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 12, 'Rio': 8 },
    { month: 'Mar', 'Central SP': 9, 'Vila Madalena': 7, 'Mooca': 4, 'Campinas': 13, 'Rio': 9 },
    { month: 'Apr', 'Central SP': 11, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 14, 'Rio': 10 },
    { month: 'May', 'Central SP': 12, 'Vila Madalena': 8, 'Mooca': 6, 'Campinas': 15, 'Rio': 11 },
    { month: 'Jun', 'Central SP': 13, 'Vila Madalena': 9, 'Mooca': 7, 'Campinas': 16, 'Rio': 12 },
  ]

  const MOCK_MEMBERS_BY_CHURCH = [
    { 
      church: 'Central SP', 
      fullName: 'Igreja Central de São Paulo',
      members: 450,
      activeMembers: 420,
      fill: '#3b82f6'
    },
    { 
      church: 'Campinas', 
      fullName: 'Igreja de Campinas',
      members: 380,
      activeMembers: 350,
      fill: '#8b5cf6'
    },
    { 
      church: 'Rio', 
      fullName: 'Igreja do Rio de Janeiro',
      members: 320,
      activeMembers: 295,
      fill: '#ef4444'
    },
    { 
      church: 'Vila Madalena', 
      fullName: 'Igreja de Vila Madalena',
      members: 280,
      activeMembers: 260,
      fill: '#10b981'
    },
    { 
      church: 'Mooca', 
      fullName: 'Igreja da Mooca',
      members: 220,
      activeMembers: 200,
      fill: '#f59e0b'
    },
  ]

  const MOCK_PROJECTS_BY_CHURCH_CHART = [
    { 
      church: 'Campinas', 
      fullName: 'Igreja de Campinas',
      projects: 15,
      activeProjects: 12,
      completedProjects: 3,
      fill: '#8b5cf6'
    },
    { 
      church: 'Central SP', 
      fullName: 'Igreja Central de São Paulo',
      projects: 12,
      activeProjects: 9,
      completedProjects: 3,
      fill: '#3b82f6'
    },
    { 
      church: 'Rio', 
      fullName: 'Igreja do Rio de Janeiro',
      projects: 10,
      activeProjects: 7,
      completedProjects: 3,
      fill: '#ef4444'
    },
    { 
      church: 'Vila Madalena', 
      fullName: 'Igreja de Vila Madalena',
      projects: 8,
      activeProjects: 6,
      completedProjects: 2,
      fill: '#10b981'
    },
    { 
      church: 'Mooca', 
      fullName: 'Igreja da Mooca',
      projects: 6,
      activeProjects: 4,
      completedProjects: 2,
      fill: '#f59e0b'
    },
  ]

  // Dados para gráficos
  const chartData = useMemo(() => ({
    churchActivities: MOCK_CHURCH_ACTIVITIES,
    membersByChurch: MOCK_MEMBERS_BY_CHURCH,
    projectsByChurch: MOCK_PROJECTS_BY_CHURCH_CHART
  }), []);

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    // Apenas mostrar o estado de loading sem toast de sucesso ao carregar a página
    // O toast de sucesso deve aparecer apenas quando o usuário fizer refresh manual
    setIsLoading(false)
  }, [])

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t.refreshing)
    
    try {
      await refetchInstitutionById()
      toast.dismiss(refreshToast)
      toast.success(t.dataRefreshed, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(t.errorRefreshing)
    } finally {
      setRefreshing(false)
    }
  }

  const handleCreate = () => {
    setIsAddChurchModalOpen(true)
  }
  
  const handleViewDetails = (id: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      setSelectedChurchDetail(church);
      setViewMode('detail');
    }
  };
  
  const handleEdit = (id: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      const churchData = {
        id: church.id,
        institution_id: church.institution_id,
        name: church.name,
        region_id: church.region_id,
        contact_id: null,
        type: (church as any).type || null,
        created_at: church.created_at,
        updated_at: church.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      } as ChurchData;
      setChurchToEdit(churchData);
      setIsEditChurchModalOpen(true);
    }
  };
  const handleDelete = (id: string, name: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      const churchData: ChurchData = {
        id: church.id,
        institution_id: church.institution_id,
        name: church.name,
        region_id: church.region_id,
        contact_id: null,
        created_at: church.created_at,
        updated_at: church.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setChurchToDelete(churchData);
      setIsDeleteChurchModalOpen(true);
    }
  };
  const handleViewContact = (id: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      // Use type assertion to access extended properties
      const churchWithContact = church as any;
      
      // Create contact data from church information
      const contactData: ContactData = {
        id: `church_contact_${church.id}`,
        name: churchWithContact.contact?.name || church.name || 'Church Contact',
        phone: churchWithContact.contact?.phone || '',
        mobile: churchWithContact.contact?.mobile || '',
        email: churchWithContact.contact?.email || '',
        country: churchWithContact.contact?.country || '',
        city: churchWithContact.contact?.city || '',
        address: churchWithContact.contact?.address || '',
        full_address: churchWithContact.contact?.full_address || '',
        postal_code: churchWithContact.contact?.postal_code || '',
        website: churchWithContact.contact?.website || '',
        notes: churchWithContact.contact?.notes || `Contact information for ${church.name}`,
        is_primary: true,
        created_at: church.created_at,
        updated_at: church.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false,
        deleted_at: null,
        deleted_by: null
      };
      
      setSelectedContact(contactData);
      setSelectedChurch(church);
      setIsViewContactModalOpen(true);
    }
  };
  const handleViewBudget = (id: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      // Use type assertion for budget properties
      const churchWithBudget = church as any;
      
      const budgetData: AnnualBudgetData = {
        id: `budget_${church.id}`,
        year: new Date().getFullYear(),
        planned_budget: churchWithBudget.total_budget || 0,
        total_expenses: churchWithBudget.used_budget || 0,
        balance: (churchWithBudget.total_budget || 0) - (churchWithBudget.used_budget || 0),
        notes: `Budget for ${church.name} church`,
        approved_by: 'admin',
        created_at: church.created_at,
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedChurch(church);
      setSelectedBudget(budgetData);
      setIsBudgetModalOpen(true);
    }
  };
  
  const handleBudgetSaved = (budget: AnnualBudgetData) => {
    toast.success("Budget updated successfully")
    handleRefresh()
  }
  
  const handleChurchSaved = (church: CreateChurch) => {
    handleRefresh()
  }
  
  const handleChurchUpdated = (church: ChurchData) => {
    toast.success("Church updated successfully")
    handleRefresh()
  }
  
  const handleChurchDeleted = (church: ChurchData) => {
    toast.success("Church deleted successfully")
    handleRefresh()
  }

  /**
   * HELPER FUNCTION: generateChurchDepartmentData
   * 
   * Gera dados dinâmicos para os gráficos de analytics baseados nos departamentos reais da church.
   * Esta função garante que os dados exibidos sejam consistentes e fáceis de manter.
   * 
   * Fluxo de dados:
   * 1. Church possui múltiplos Departments
   * 2. Cada Department possui múltiplos Projects
   * 3. Cada Project possui múltiplas Activities (ações registradas)
   * 4. Cada Department possui múltiplos Members (users)
   * 
   * @param church - Objeto da church com departments, users, projects
   * @returns Objeto com dados formatados para os 3 gráficos:
   *   - activities: Timeline de atividades por departamento ao longo dos meses
   *   - membersByDept: Distribuição de membros (total e ativos) por departamento
   *   - projectsByDept: Distribuição de projetos (ativos e concluídos) por departamento
   * 
   * Se a church não tiver departamentos, retorna dados mock como fallback.
   */
  const generateChurchDepartmentData = (church: any) => {
    const departments = church?.departments || [];
    
    // Fallback: Se não há departamentos, usa dados mock
    if (departments.length === 0) {
      return {
        activities: MOCK_DEPARTMENT_ACTIVITIES,
        membersByDept: MOCK_MEMBERS_BY_DEPARTMENT,
        projectsByDept: MOCK_PROJECTS_BY_DEPARTMENT
      };
    }

    // Paleta de cores para diferenciar departamentos visualmente
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    
    // CHART 1: Gera dados de atividades por mês para cada departamento
    // Simula atividades (ações) registradas em projetos ao longo do tempo
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const activities = months.map((month, monthIndex) => {
      const monthData: any = { month };
      
      // Limita a 5 departamentos para não sobrecarregar o gráfico
      departments.slice(0, 5).forEach((dept: any, deptIndex: number) => {
        // TODO: Substituir por contagem real de activities quando disponível no backend
        // Atualmente simula crescimento de atividades ao longo dos meses
        const baseActivities = 5;
        const monthlyGrowth = monthIndex * 2;
        const deptOffset = deptIndex * 3;
        const randomVariation = Math.random() * 5;
        
        monthData[dept.name] = Math.floor(baseActivities + monthlyGrowth + deptOffset + randomVariation);
      });
      
      return monthData;
    });

    // CHART 2: Gera dados de membros por departamento
    const membersByDept = departments.map((dept: any, index: number) => ({
      department: dept.name,
      fullName: dept.name,
      // Usa contagem real de users se disponível, senão simula
      members: dept.users?.length || Math.floor(15 + Math.random() * 30),
      activeMembers: dept.users?.filter((u: any) => !u.is_deleted).length || Math.floor(10 + Math.random() * 25),
      fill: colors[index % colors.length]
    }));

    // CHART 3: Gera dados de projetos por departamento
    const projectsByDept = departments.map((dept: any, index: number) => {
      // Usa contagem real de projects se disponível, senão simula
      const totalProjects = dept.projects?.length || Math.floor(3 + Math.random() * 8);
      // Assume que ~70% dos projetos estão ativos
      const activeProjects = Math.floor(totalProjects * 0.7);
      
      return {
        department: dept.name,
        fullName: dept.name,
        projects: totalProjects,
        activeProjects: activeProjects,
        completedProjects: totalProjects - activeProjects,
        fill: colors[index % colors.length]
      };
    });

    return {
      activities,
      membersByDept,
      projectsByDept
    };
  };

  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
          </div>
        </div>
      ),
    },
    {
      id: "region",
      accessorKey: "region_name",
      header: t.region,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.region.name}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.original.region?.name === value
      },
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: t.members,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users.length || 0}</span>
        </div>
      ),
    },
    {
      id: "departments",
      accessorKey: "departments_count",
      header: t.departments,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.departments.length}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge 
          label={row.original.is_deleted === true ? t.inactive : t.active}
          variant={row.original.is_deleted === false ? 'success' : 'neutral'}
          showDot
        />
      ),
      filterFn: (row, id, value) => {
        if (!value) return true
        const isDeleted = row.original.is_deleted
        return value === "true" ? isDeleted === true : isDeleted === false
      },
    },
    {
      id: "type",
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const churchType = row.original.type as ChurchTypeEnum
        return (
          <ChurchTypeBadge 
            type={churchType}
            showIcon
          />
        )
      },
    },
    {
      id: "actions",
      header: t.actions,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" data-action-button>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewContact(row.original.id)}>
              <ContactRound className="w-4 h-4 mr-2" />
              {t.viewContact}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.editChurch}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t.deleteChurch}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Colunas da tabela de departamentos (para detail view)
  const departmentColumns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Department Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "members",
      header: "Members",
      cell: ({ row }) => {
        const membersCount = row.original.users?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{membersCount}</span>
          </div>
        );
      },
    },
    {
      id: "projects",
      header: "Projects",
      cell: ({ row }) => {
        const projectsCount = row.original.projects?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{projectsCount}</span>
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge 
          label={row.original.is_deleted === true ? t.inactive : t.active}
          variant={row.original.is_deleted === false ? 'success' : 'neutral'}
          showDot
        />
      ),
    },
    // TODO: Implementar action buttons para departments
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" size="sm" data-action-button>
    //           <MoreHorizontal className="w-4 h-4" />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent>
    //         <DropdownMenuItem onClick={() => {
    //           // Navigate to department details page
    //           console.log('View department details:', row.original.id);
    //           toast('Department details - Coming soon!');
    //         }}>
    //           <Eye className="w-4 h-4 mr-2" />
    //           View Details
    //         </DropdownMenuItem>
    //         <DropdownMenuItem onClick={() => {
    //           // Edit department functionality
    //           console.log('Edit department:', row.original.id);
    //           toast('Edit department - Coming soon!');
    //         }}>
    //           <Edit className="w-4 h-4 mr-2" />
    //           Edit Department
    //         </DropdownMenuItem>
    //         <DropdownMenuItem onClick={() => {
    //           // View/manage department budget
    //           console.log('Manage department budget:', row.original.id);
    //           toast('Manage budget - Coming soon!');
    //         }}>
    //           <DollarSign className="w-4 h-4 mr-2" />
    //           Manage Budget
    //         </DropdownMenuItem>
    //         <DropdownMenuItem onClick={() => {
    //           // Delete department
    //           console.log('Delete department:', row.original.id);
    //           toast('Delete department - Coming soon!');
    //         }}>
    //           <Trash2 className="w-4 h-4 mr-2" />
    //           Delete Department
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ];

  // Colunas da tabela de membros (para detail view)
  const memberColumns: ColumnDef<any>[] = [
    {
      id: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        const user = row.original
        return (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {user.first_name?.[0]}{user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div>
            <div className="font-medium">{user.first_name} {user.last_name}</div>
            <div className="text-xs text-muted-foreground">
              {user.email || 'No email'}
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
          Language
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
          Roles
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
            )) || <span className="text-xs text-muted-foreground">No roles</span>}
          </div>
        )
      },
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          Gender
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const genderLabel = user.gender || 'N/A';
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
          Status
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? "Active" : "Inactive"}
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
    // TODO: Implementar action buttons para members
    // {
    //   id: "actions",
    //   header: () => (
    //     <div className="text-center font-medium text-gray-900">
    //       Actions
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     const user = row.original
    //     return (
    //       <div className="flex justify-center">
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button variant="ghost" size="sm" data-action-button>
    //               <MoreHorizontal className="w-4 h-4" />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end">
    //             <DropdownMenuItem onClick={() => {
    //               // Navigate to user details page
    //               console.log('View user details:', user.id);
    //               toast('Navigating to user details - Coming soon!');
    //             }}>
    //               <Eye className="mr-2 h-4 w-4" />
    //               View Details
    //             </DropdownMenuItem>
    //             <DropdownMenuItem onClick={() => {
    //               // Edit user functionality
    //               console.log('Edit user:', user.id);
    //               toast('Edit user - Coming soon!');
    //             }}>
    //               <Edit className="mr-2 h-4 w-4" />
    //               Edit User
    //             </DropdownMenuItem>
    //             <DropdownMenuItem 
    //               onClick={() => {
    //                 // Delete/remove user from church
    //                 console.log('Remove user from church:', user.id);
    //                 toast('Remove user - Coming soon!');
    //               }}
    //               className="text-red-600"
    //             >
    //               <Trash2 className="mr-2 h-4 w-4" />
    //               Remove from Church
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     )
    //   },
    // },
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
      <WithPermission requiredPermissions={[PermissionResolverName.Churches]} fallback={<AccessDenied />}>
      
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Breadcrumbs Navigation - Only in Detail View */}
        {viewMode === 'detail' && selectedChurchDetail && (
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
                  See All Churches
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {selectedChurchDetail.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {viewMode === 'detail' && selectedChurchDetail 
                ? `${selectedChurchDetail.name} - Details`
                : t.churchesTitle
              }
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {viewMode === 'detail' && selectedChurchDetail
                ? selectedChurchDetail.contact?.city || "Church details, departments and members"
                : t.churchesSubtitle
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {viewMode === 'list' && (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {t.createChurch}
              </Button>
            )}
            
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

        {/* Conditional View: List or Detail */}
        {viewMode === 'list' ? (
          <>
            {/* KPI Cards */}
            <ChurchesKPICards data={kpiCardsData} />

            <Separator />

            {/* Charts Section - 3 New Charts in Carousel */}
            <div className="space-y-6">
          <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
            {/* Chart 1: Church Activities & Projects Timeline - Area Chart with Gradients */}
            <ChurchActivityChart data={chartData.churchActivities} loading={false} />

            {/* Chart 2: Members by Church - Horizontal Bar Chart */}
            <MembersByChurchChart data={chartData.membersByChurch} loading={false} />

            {/* Chart 3: Projects by Church - Interactive Pie Chart */}
            <ProjectsByChurchChart data={chartData.projectsByChurch} loading={false} />
          </ResponsiveGridCarousel>
        </div>

        {/* Churches Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {t.churches}
            </CardTitle>
            <CardDescription>Lista completa de igrejas com ações de gerenciamento</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <UseTable
              columns={columns}
              data={churches}
              searchKey="name"
              filters={[
                {
                  id: "region",
                  title: t.region,
                  options: Array.from(new Set(churches.map((c: any) => c.region?.name).filter(Boolean))).map(name => ({ 
                    label: String(name), 
                    value: String(name) 
                  }))
                },
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: t.active, value: "false" },
                    { label: t.inactive, value: "true" },
                  ]
                },
                {
                  id: "type",
                  title: "Type",
                  options: [
                    { label: "Standard", value: "STANDARD" },
                    { label: "Church Plant", value: "PLANT" },
                    { label: "Company", value: "COMPANY" },
                  ]
                }
              ]}
              emptyEntityName="churches"
            />
          </CardContent>
        </Card>
          </>
        ) : (
          /* Detail View */
          <div className="space-y-6">
            {/* Church Info Card + KPI Cards usando KPICards com customFirstCard */}
            {selectedChurchDetail && (() => {
              // Calcular KPIs específicos da church
              const churchMembers = selectedChurchDetail.users?.length || 0;
              const churchDepartments = selectedChurchDetail.departments?.length || 0;
              const churchProjects = MOCK_PROJECTS_BY_CHURCH.find(
                p => p.church.includes(selectedChurchDetail.name.split(' ')[selectedChurchDetail.name.split(' ').length - 1])
              )?.projects || 0;
              const churchActivities = MOCK_SUBSIDY_TIMELINE.reduce((sum, month) => {
                const churchKey = Object.keys(month).find(key => 
                  key !== 'month' && selectedChurchDetail.name.includes(key.replace('Central ', '').replace('Vila ', '').replace('Rio de Janeiro', 'Rio'))
                );
                return sum + (churchKey ? (month as any)[churchKey] : 0);
              }, 0);

              const churchKPIData: KPICardData[] = [
                {
                  id: "church-members",
                  title: t.totalMembers,
                  value: churchMembers,
                  icon: Users,
                  subtitle: "Total members"
                },
                {
                  id: "church-departments",
                  title: t.departments,
                  value: churchDepartments,
                  icon: Layers,
                  subtitle: "Active departments"
                },
                {
                  id: "church-projects",
                  title: "Total Projects",
                  value: churchProjects,
                  icon: TrendingUp,
                  subtitle: "Active projects"
                },
                {
                  id: "church-activities",
                  title: "Activities",
                  value: churchActivities,
                  icon: Activity,
                  subtitle: "Total activities (YTD)"
                }
              ];

              return (
                <KPICards
                  data={churchKPIData}
                  variant="minimal"
                  showCarousel={true}
                  minCardsForCarousel={3}
                  customFirstCard={
                    <EntityInfoCard
                      headerTitle="Church Information"
                      name={selectedChurchDetail.name}
                      description={`${selectedChurchDetail.region?.name || 'Unknown Region'} • ${churchMembers} members • ${churchDepartments} departments`}
                      icon={Home}
                      badges={[
                        {
                          label: selectedChurchDetail.is_deleted ? t.inactive : t.active,
                          variant: selectedChurchDetail.is_deleted ? "secondary" : "default",
                          className: selectedChurchDetail.is_deleted 
                            ? "bg-gray-100 text-gray-700" 
                            : "bg-green-100 text-green-700"
                        },
                        ...(selectedChurchDetail.type ? [{
                          label: selectedChurchDetail.type === 'PLANT' ? 'Church Plant' : selectedChurchDetail.type === 'COMPANY' ? 'Church Company' : 'Standard',
                          variant: "outline" as const
                        }] : [])
                      ]}
                      actions={[
                        {
                          label: t.editChurch,
                          icon: Edit,
                          onClick: () => handleEdit(selectedChurchDetail.id)
                        },
                        {
                          label: t.viewContact,
                          icon: ContactRound,
                          onClick: () => handleViewContact(selectedChurchDetail.id)
                        },
                        {
                          label: t.deleteChurch,
                          icon: Trash2,
                          onClick: () => handleDelete(selectedChurchDetail.id, selectedChurchDetail.name),
                          variant: "destructive",
                          showSeparatorAfter: true
                        }
                      ]}
                    />
                  }
                />
              );
            })()}

            <Separator />

            {/* Charts Section - Department Analytics */}
            {selectedChurchDetail && (() => {
              // Gera dados dinâmicos baseados nos departamentos da church
              const chartData = generateChurchDepartmentData(selectedChurchDetail);
              
              return (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Department Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Overview of activities, members, and projects across all departments
                    </p>
                  </div>
                  <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
                    {/* Chart 1: Atividades em Projetos por Departamento - Timeline */}
                    <ChurchActivityChart 
                      data={chartData.activities} 
                      loading={false}
                      mode="departments"
                    />

                    {/* Chart 2: Membros por Departamento */}
                    <MembersByChurchChart 
                      data={chartData.membersByDept} 
                      loading={false}
                      mode="departments"
                    />

                    {/* Chart 3: Projetos por Departamento */}
                    <ProjectsByChurchChart 
                      data={chartData.projectsByDept} 
                      loading={false}
                      mode="departments"
                      onItemClick={(department) => {
                        console.log('Department clicked:', department)
                        // Aqui você pode adicionar lógica adicional quando um departamento for clicado
                        // Por exemplo, abrir um modal com mais detalhes, filtrar tabelas, etc.
                      }}
                    />
                  </ResponsiveGridCarousel>
                </div>
              );
            })()}

            <Separator />

            {/* Tabs for Members and Departments */}
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="members" className="gap-2">
                  <Users className="w-4 h-4" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="departments" className="gap-2">
                  <Layers className="w-4 h-4" />
                  Departments
                </TabsTrigger>
              </TabsList>

              {/* Members Tab */}
              <TabsContent value="members" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Church Members
                    </CardTitle>
                    <CardDescription>
                      All members associated with {selectedChurchDetail?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <UseTable
                      columns={memberColumns}
                      data={selectedChurchDetail?.users || []}
                      searchKey="first_name"
                      filters={[
                        {
                          id: "is_deleted",
                          title: "Status",
                          options: [
                            { label: "Active", value: "true" },
                            { label: "Inactive", value: "false" },
                          ]
                        }
                      ]}
                      emptyEntityName="members"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Church Departments
                    </CardTitle>
                    <CardDescription>
                      All departments within {selectedChurchDetail?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <UseTable
                      columns={departmentColumns}
                      data={selectedChurchDetail?.departments || []}
                      searchKey="name"
                      filters={[
                        {
                          id: "is_deleted",
                          title: "Status",
                          options: [
                            { label: "Active", value: "false" },
                            { label: "Inactive", value: "true" },
                          ]
                        }
                      ]}
                      emptyEntityName="departments"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* View Contact Modal */}
        {selectedContact && selectedChurch && (
          <ContactViewEditModal
            isOpen={isViewContactModalOpen}
            onOpenChange={setIsViewContactModalOpen}
            contact={{ 
              ...selectedContact, 
              is_deleted: selectedContact.is_deleted ?? false,
              is_primary: selectedContact.is_primary ?? false,
              _count: { Department: 0, Church: 0, Event: 0, User: 0 } 
            } as any}
            entityName={selectedChurch.name}
            entityType="Church"
            entityId={selectedChurch.id}
            updateMutation={async () => {
              // Mock update function - replace with actual church contact update mutation
              return { data: selectedContact };
            }}
            onSave={(updatedContact) => {
              if (updatedContact) {
                toast.success('Contact updated successfully');
                handleRefresh();
              }
            }}
          />
        )}
        
        {/* Annual Budget Modal */}
        {selectedChurch && (
          <AnnualBudgetViewEditModal
            isOpen={isBudgetModalOpen}
            onOpenChange={setIsBudgetModalOpen}
            budget={selectedBudget}
            entityType="church"
            entityName={selectedChurch.name}
            onSave={handleBudgetSaved}
          />
        )}
        
        {/* Add Church Modal */}
        <AddChurchModal
          isOpen={isAddChurchModalOpen}
          onOpenChange={setIsAddChurchModalOpen}
          institutionId={currentInstitutionData?.id || ''}
          onSave={handleChurchSaved}
        />
        
        {/* Edit Church Modal */}
        {churchToEdit && (
          <EditChurchModal
            isOpen={isEditChurchModalOpen}
            onOpenChange={setIsEditChurchModalOpen}
            church={churchToEdit}
            onSave={handleChurchUpdated}
          />
        )}
        
        {/* Delete Church Modal */}
        {churchToDelete && (
          <DeleteChurchModal
            isOpen={isDeleteChurchModalOpen}
            onOpenChange={setIsDeleteChurchModalOpen}
            church={churchToDelete}
            onSuccess={handleChurchDeleted}
          />
        )}
      </div>
      </WithPermission>
    </AppLayout>
  )
}
