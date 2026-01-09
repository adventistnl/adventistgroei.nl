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
  ContactRound,
  TrendingUp,
  Layers,
  Eye,
  Crown,
  Activity,
  DollarSign,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { structureTranslations } from "@/lib/translations/structure"
import { churchTranslations } from "@/lib/translations/churches"
import { UseTable } from "@/components/ui/use-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { ChurchTypeBadge } from "@/components/ui/church-type-badge"
// import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { AddChurchModal, EditChurchModal, DeleteChurchModal, ChurchData, RegionData } from "@/components/modals/church"
import { ChurchesKPICards, KPICardData, KPICards } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { ChurchActivityChart } from "@/components/churches/charts/church-activity-chart"
import { ProjectsByChurchChart } from "@/components/churches/charts/projects-by-church-chart"
import { MembersByChurchChart } from "@/components/churches/charts/members-by-church-chart"
import { UsersByRoleChart } from "@/components/churches/charts/users-by-role-chart"
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
import { PermissionResolverName, AnnualBudgetEntityType } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { ChurchType as ChurchTypeEnum } from "@/types/graphql-global-types"
import { useChurchActivityTimeline } from "@/hooks/use-church-activity-timeline"
// Dados reais de igrejas virão do contexto da instituição

// Timeline de solicitações de subsídio por igreja
// OBS: removido fallback com dados mock — agora utilizamos apenas dados reais (ou 0 / arrays vazios quando não houver)

/**
 * PÁGINA DE GESTÃO DE IGREJAS
 * Interface dedicada para gerenciar igrejas baseada no ERD do AdventistGroei
 */
export default function ChurchesPage() {
  const { t, i18n } = useTranslation()
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const churches = React.useMemo(() => currentInstitutionData?.churches || [], [currentInstitutionData]);
  const activeChurches = React.useMemo(() => churches.filter((church: any) => !church.is_deleted), [churches]);
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch church activity timeline from backend
  const {
    activityData: churchActivityTimelineData,
    loading: activityTimelineLoading
  } = useChurchActivityTimeline({
    institution_id: currentInstitutionData?.id,
    selectedYear: new Date().getFullYear()
  })
  
  // View mode states - controla se está na lista ou em detalhes
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [selectedChurchDetail, setSelectedChurchDetail] = useState<any | null>(null)
  
  // Modal states
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [isAddChurchModalOpen, setIsAddChurchModalOpen] = useState(false)
  const [isEditChurchModalOpen, setIsEditChurchModalOpen] = useState(false)
  const [isDeleteChurchModalOpen, setIsDeleteChurchModalOpen] = useState(false)
  // const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
  const [selectedChurch, setSelectedChurch] = useState<any>(null)
  const [churchToEdit, setChurchToEdit] = useState<ChurchData | null>(null)
  const [churchToDelete, setChurchToDelete] = useState<ChurchData | null>(null)

  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const tStructure = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  const handleBackToList = React.useCallback(() => {
    setViewMode('list');
    setSelectedChurchDetail(null);
  }, []);

  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {t('common.structure_organization')}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {t('churches.title')}
    </span>
  ), [t])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  // Estatísticas calculadas dos dados
  type ChurchType = typeof churches extends (infer U)[] ? U : any;


  // Calcula total de projetos a partir dos dados reais das churches (apenas ativas)
  const totalProjects = activeChurches.reduce((sum, c: any) => {
    const churchProjects = c.departments?.reduce((s: number, d: any) => s + (d.projects?.length || 0), 0) || 0;
    return sum + churchProjects;
  }, 0)

  // Dados dos KPIs em formato de array para o componente reutilizável
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total-churches",
      title: tChurch.page.totalChurches,
      value: currentInstitutionData?.churchesKpiData?.totalChurches || 0,
      icon: Home,
      subtitle: tChurch.page.active_churches
    },
    {
      id: "total-members", 
      title: tChurch.page.totalMembers,
      value: currentInstitutionData?.churchesKpiData?.totalMembers || 0,
      icon: Users,
      subtitle: tChurch.page.total_members
    },
    {
      id: "total-departments",
      title: tChurch.page.departments,
      value: currentInstitutionData?.churchesKpiData?.totalDepartments || 0,
      icon: Layers,
      subtitle: tChurch.page.active_departments
    },
    {
      id: "total-projects",
      title: tChurch.page.totalProjects,
      value: totalProjects,
      icon: TrendingUp,
      subtitle: tChurch.page.active_projects,
      trend: {
        value: 8.2,
        isPositive: true,
        label: tChurch.page.vs_last_month
      }
    }
  ], [currentInstitutionData?.churchesKpiData, tChurch, totalProjects])
  /**
   * HELPER FUNCTION: generateChurchListChartData
   * 
   * Gera dados dinâmicos para os gráficos da listagem de igrejas baseados nas churches reais.
   * Calcula atividades baseadas em last_updated_by dos usuários e departamentos.
   * 
   * @param churchesList - Array de todas as churches
   * @returns Objeto com dados para os 3 gráficos da lista
   */
  const generateChurchListChartData = (churchesList: any[]) => {
    if (!churchesList || churchesList.length === 0) {
      return {
        churchActivities: [],
        membersByChurch: [],
        projectsByChurch: []
      };
    }

    // Paleta de cores para diferenciar igrejas
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    
    // Calcular atividades por igreja baseado em updated_by e última atividade
    const calculateChurchActivity = (church: any) => {
      let activityScore = 0;
      
      // Score base por igreja ativa
      activityScore += 5;
      
      // Atividade dos usuários (baseado em updated_by e created_at recentes)
      if (church.users && church.users.length > 0) {
        church.users.forEach((user: any) => {
          // Pontos por usuário ativo (não deletado)
          if (!user.is_deleted) {
            activityScore += 2;
            
            // Pontos extras por atividade recente (últimos 30 dias)
            try {
              const userUpdateDate = new Date(user.updated_at || user.created_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              
              if (userUpdateDate > thirtyDaysAgo) {
                activityScore += 5;
              }
              
              // Bonus por usuário criado recentemente (últimos 7 dias)
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              
              if (new Date(user.created_at) > sevenDaysAgo) {
                activityScore += 8;
              }
            } catch (e) {
              // Data inválida, usar apenas pontos básicos
            }
          }
        });
      }
      
      // Atividade dos departamentos
      if (church.departments && church.departments.length > 0) {
        church.departments.forEach((dept: any) => {
          // Pontos por departamento ativo
          if (!dept.is_deleted) {
            activityScore += 3;
            
            // Pontos por atividade recente do departamento
            try {
              const deptUpdateDate = new Date(dept.updated_at || dept.created_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              
              if (deptUpdateDate > thirtyDaysAgo) {
                activityScore += 8;
              }
            } catch (e) {
              // Data inválida
            }
            
            // Atividade dos projetos do departamento
            if (dept.projects && dept.projects.length > 0) {
              dept.projects.forEach((project: any) => {
                if (!project.is_deleted) {
                  activityScore += 1;
                  
                  try {
                    const projectUpdateDate = new Date(project.updated_at || project.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    
                    if (projectUpdateDate > thirtyDaysAgo) {
                      activityScore += 3;
                    }
                  } catch (e) {
                    // Data inválida
                  }
                }
              });
            }
          }
        });
      }
      
      // Atividade da própria igreja
      try {
        const churchUpdateDate = new Date(church.updated_at || church.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (churchUpdateDate > thirtyDaysAgo) {
          activityScore += 10;
        }
      } catch (e) {
        // Data inválida
      }
      
      return Math.max(activityScore, 1); // Mínimo de 1 ponto por igreja
    };

    // CHART 1: Atividades por Igreja baseado em dados reais de utilização
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const churchActivities = months.map((month, index) => {
      const monthData: any = { month };
      
      churchesList.forEach((church: any) => {
        const activityScore = calculateChurchActivity(church);
        
        // Para dados mais realistas, considerar:
        // 1. Distribuição não linear ao longo do ano
        // 2. Variação baseada na atividade real da igreja
        // 3. Zero para meses futuros
        
        let monthlyActivity = 0;
        
        if (index <= currentMonth) {
          // Calcular atividade baseada no score e mês
          const baseActivity = activityScore / 12;
          const monthProgress = (index + 1) / 12;
          
          // Adicionar variação baseada no tipo de atividade da igreja
          const hasRecentActivity = church.updated_at && 
            new Date(church.updated_at) > new Date(currentYear, index, 1);
          
          monthlyActivity = Math.floor(baseActivity * monthProgress * (hasRecentActivity ? 1.5 : 1));
        }
        
        const churchKey = church.name.replace('Igreja ', '').replace(' de ', ' ');
        monthData[churchKey] = Math.max(monthlyActivity, 0);
      });
      
      return monthData;
    });

    // CHART 2: Membros por Igreja (dados REAIS)
    const membersByChurch = churchesList.map((church: any, index: number) => ({
      church: church.name.replace('Igreja ', '').replace(' de ', ' '),
      fullName: church.name,
      members: church.users?.length || 0,           // Contagem REAL
      activeMembers: church.users?.filter((u: any) => !u.is_deleted).length || 0,  // Contagem REAL
      fill: colors[index % colors.length]
    }));

    // CHART 3: Projetos por Igreja (dados REAIS)
    const projectsByChurch = churchesList.map((church: any, index: number) => {
      // Calcula projetos dos departamentos da church (dados REAIS)
      const allProjects = church.departments?.reduce((sum: number, dept: any) => {
        return sum + (dept.projects?.length || 0);
      }, 0) || 0;

      const allActiveProjects = church.departments?.reduce((sum: number, dept: any) => {
        return sum + (dept.projects?.filter((p: any) => !p.is_deleted).length || 0);
      }, 0) || 0;

      return {
        church: church.name.replace('Igreja ', '').replace(' de ', ' '),
        fullName: church.name,
        projects: allProjects,
        activeProjects: allActiveProjects,
        completedProjects: allProjects - allActiveProjects,
        fill: colors[index % colors.length]
      };
    });

    return {
      churchActivities,
      membersByChurch,
      projectsByChurch
    };
  };

  // Função para transformar dados do backend no formato do gráfico
  const transformBackendActivityData = (activityData: any[]) => {
    // Agrupar dados por mês
    const groupedByMonth: { [key: string]: any } = {};
    
    activityData.forEach((item: any) => {
      const monthKey = item.month;
      
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = { month: monthKey };
      }
      
      // Usar nome da igreja (limpo) como key e pontuação de atividade como valor
      const churchName = item.church_name.replace('Igreja ', '').replace(' de ', ' ');
      groupedByMonth[monthKey][churchName] = item.activity_score;
    });
    
    // Converter para array ordenado por mês
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Object.values(groupedByMonth).sort((a: any, b: any) => {
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  };

  // Dados para gráficos - agora vindos do backend via KPI
  const chartData = useMemo(() => {
    // Use church activity timeline data from backend if available
    const churchActivities = churchActivityTimelineData && churchActivityTimelineData.length > 0
      ? churchActivityTimelineData
      : (currentInstitutionData?.churchesActivityData && currentInstitutionData.churchesActivityData.length > 0
          ? transformBackendActivityData(currentInstitutionData.churchesActivityData)
          : generateChurchListChartData(activeChurches).churchActivities);

    return {
      churchActivities,
      membersByChurch: generateChurchListChartData(activeChurches).membersByChurch,
      projectsByChurch: generateChurchListChartData(activeChurches).projectsByChurch
    };
  }, [activeChurches, currentInstitutionData?.churchesActivityData, churchActivityTimelineData]);

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
    const refreshToast = toast.loading(tStructure.refreshing)
    
    try {
      await refetchInstitutionById()
      toast.dismiss(refreshToast)
      toast.success(tStructure.dataRefreshed, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(tStructure.errorRefreshing)
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
        contact_id: (church as any).contact_id || null,
        contact: (church as any).contact || null,
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
      // const contactData: ContactData = {
      //   id: `church_contact_${church.id}`,
      //   name: churchWithContact.contact?.name || church.name || 'Church Contact',
      //   phone: churchWithContact.contact?.phone || '',
      //   mobile: churchWithContact.contact?.mobile || '',
      //   email: churchWithContact.contact?.email || '',
      //   country: churchWithContact.contact?.country || '',
      //   city: churchWithContact.contact?.city || '',
      //   address: churchWithContact.contact?.address || '',
      //   full_address: churchWithContact.contact?.full_address || '',
      //   postal_code: churchWithContact.contact?.postal_code || '',
      //   website: churchWithContact.contact?.website || '',
      //   notes: churchWithContact.contact?.notes || `Contact information for ${church.name}`,
      //   is_primary: true,
      //   created_at: church.created_at,
      //   updated_at: church.created_at,
      //   created_by: 'system',
      //   updated_by: 'system',
      //   is_deleted: false,
      //   deleted_at: null,
      //   deleted_by: null
      // };
      
      // setSelectedContact(contactData);
      setSelectedChurch(church);
      setIsViewContactModalOpen(true);
    }
  };

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
   * Calcula atividades baseadas em last_updated_by e atividade recente dos departamentos.
   * 
   * Se a church não possuir departamentos, retorna arrays vazios (vazio = sem dados).
   * 
   * Fluxo de dados:
   * 1. Church possui múltiplos Departments
   * 2. Cada Department possui múltiplos Members (users)
   * 3. Cada Department pode possuir múltiplos Projects
   * 
   * @param church - Objeto da church com departments, users, projects
   * @returns Objeto com dados reais para os 3 gráficos:
   *   - activities: Timeline de atividades baseada em updated_by
   *   - usersByRole: Dados reais de usuários por role
   *   - projectsByDept: Dados reais de projetos por departamento
   */
  const generateChurchDepartmentData = (church: any) => {
    const departments = church?.departments || [];
    const users = church?.users || [];
    
    // Paleta de cores para diferenciar departamentos visualmente
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    
    // CHART 1: Gera dados de atividades por departamento baseado em updated_by
    const calculateDeptActivity = (dept: any) => {
      let activityScore = 0;
      
      // Atividade dos usuários do departamento
      if (dept.users && dept.users.length > 0) {
        dept.users.forEach((user: any) => {
          if (!user.is_deleted) {
            activityScore += 2;
            
            // Pontos por atividade recente
            const userUpdateDate = new Date(user.updated_at || user.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (userUpdateDate > thirtyDaysAgo) {
              activityScore += 4;
            }
          }
        });
      }
      
      // Atividade dos projetos
      if (dept.projects && dept.projects.length > 0) {
        dept.projects.forEach((project: any) => {
          if (!project.is_deleted) {
            activityScore += 1;
            
            const projectUpdateDate = new Date(project.updated_at || project.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (projectUpdateDate > thirtyDaysAgo) {
              activityScore += 3;
            }
          }
        });
      }
      
      // Atividade do próprio departamento
      const deptUpdateDate = new Date(dept.updated_at || dept.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (deptUpdateDate > thirtyDaysAgo) {
        activityScore += 5;
      }
      
      return activityScore;
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Se não há departamentos, retorna dados vazios para atividades
    const activities = departments.length === 0 ? [] : months.map((month, index) => {
      const monthData: any = { month };
      
      departments.forEach((dept: any) => {
        const activityScore = calculateDeptActivity(dept);
        // Simular progressão ao longo do ano baseada na atividade real
        const monthlyActivity = index <= currentMonth 
          ? Math.floor(activityScore * (index + 1) / 12)
          : 0;
        
        monthData[dept.name] = monthlyActivity;
      });
      
      return monthData;
    });

    // CHART 2: Gera dados de usuários por role (dados REAIS)
    const roleMap = new Map<string, { users: number; activeUsers: number; fullName: string }>();
    
    users.forEach((user: any) => {
      if (user.user_roles && user.user_roles.length > 0) {
        user.user_roles.forEach((userRole: any) => {
          const roleKey = userRole.role.key_code;
          const roleName = userRole.role.name;
          
          if (!roleMap.has(roleKey)) {
            roleMap.set(roleKey, {
              users: 0,
              activeUsers: 0,
              fullName: roleName
            });
          }
          
          const roleData = roleMap.get(roleKey)!;
          roleData.users += 1;
          if (!user.is_deleted) {
            roleData.activeUsers += 1;
          }
        });
      } else {
        // Usuários sem role
        const noRoleKey = 'NO_ROLE';
        if (!roleMap.has(noRoleKey)) {
          roleMap.set(noRoleKey, {
            users: 0,
            activeUsers: 0,
            fullName: 'No Role'
          });
        }
        const roleData = roleMap.get(noRoleKey)!;
        roleData.users += 1;
        if (!user.is_deleted) {
          roleData.activeUsers += 1;
        }
      }
    });

    const usersByRole = Array.from(roleMap.entries())
      .map(([roleKey, data], index) => ({
        role: roleKey,
        fullName: data.fullName,
        users: data.users,
        activeUsers: data.activeUsers,
        fill: colors[index % colors.length]
      }))
      .sort((a, b) => b.users - a.users); // Ordenar por quantidade de usuários

    // CHART 3: Gera dados de projetos por departamento (dados REAIS apenas)
    const projectsByDept = departments.length === 0 ? [] : departments.map((dept: any, index: number) => {
      // Usa contagem REAL de projects - sem simulação
      const totalProjects = dept.projects?.length || 0;
      const activeProjects = dept.projects?.filter((p: any) => !p.is_deleted).length || 0;
      
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
      usersByRole,
      projectsByDept
    };
  };

  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: tChurch.table.name,
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
      header: tChurch.table.region,
      cell: ({ row }) => {
        const region = row.original.region
        
        if (!region) {
          return (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">
                {tChurch.table.no_region}
              </Badge>
            </div>
          )
        }
        
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{region.name}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (!value) return true
        if (value === "__orphaned__") {
          return !row.original.region
        }
        return row.original.region?.name === value
      },
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: tChurch.table.members,
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
      header: tChurch.table.departments,
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
      header: tChurch.table.status,
      cell: ({ row }) => (
        <StatusBadge 
          label={row.original.is_deleted === true ? t('common.inactive') : t('common.active')}
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
      header: tChurch.table.type,
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
      header: tChurch.table.actions,
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
              {tChurch.messages.view_details}
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleViewContact(row.original.id)}>
              <ContactRound className="w-4 h-4 mr-2" />
              {tStructure.viewContact}
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {tChurch.messages.edit_church}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {tChurch.messages.delete_church}
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
      header: tChurch.table.department_name,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground max-w-xs truncate line-clamp-2">
              {row.original.description || tChurch.table.no_description}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "members",
      header: tChurch.table.members,
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
      header: tChurch.table.projects,
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
      header: tChurch.table.status,
      cell: ({ row }) => (
        <StatusBadge 
          label={row.original.is_deleted === true ? t('common.inactive') : t('common.active')}
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
      header: tChurch.table.avatar,
      cell: ({ row }) => {
        const user = row.original
        return (
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar || '/placeholder-user.jpg'} />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                : ''}
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: tChurch.table.name,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {user.email || tChurch.table.no_email}
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
          {tChurch.table.language}
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
          {tChurch.table.roles}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        console.log('User roles:', user);
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
            )) || <span className="text-xs text-muted-foreground">{tChurch.table.no_roles}</span>}
          </div>
        )
      },
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tChurch.table.gender}
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
          {tChurch.table.status}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t('common.active') : t('common.inactive')}
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
                  {t('common.see_all_churches')}
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

        {/* Header - Only show in List View */}
        {viewMode === 'list' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                {tStructure.churchesTitle}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {tStructure.churchesSubtitle}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {tStructure.createChurch}
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
            <ChurchActivityChart data={chartData.churchActivities} loading={activityTimelineLoading} />

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
              {tChurch.page.title}
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
                  title: tChurch.table.region,
                  options: [
                    // Adicionar opção para igrejas órfãs
                    ...(churches.some((c: any) => !c.region) ? [{
                      label: tChurch.table.no_region,
                      value: "__orphaned__"
                    }] : []),
                    // Adicionar opções de regiões
                    ...Array.from(new Set(churches.map((c: any) => c.region?.name).filter(Boolean))).map(name => ({ 
                      label: String(name), 
                      value: String(name) 
                    }))
                  ]
                },
                {
                  id: "status",
                  title: tChurch.table.status,
                  options: [
                    { label: t('common.active'), value: "false" },
                    { label: t('common.inactive'), value: "true" },
                  ]
                },
                {
                  id: "type",
                  title: tChurch.table.type,
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
              // Calcula projetos reais a partir dos departamentos da church
              const churchProjects = selectedChurchDetail.departments?.reduce((s: number, d: any) => s + (d.projects?.length || 0), 0) || 0;
              // Atualmente não há dados de atividades por church no schema -> mostrar 0
              const churchActivities = 0;

              const churchKPIData: KPICardData[] = [
                {
                  id: "church-members",
                  title: tStructure.totalMembers,
                  value: churchMembers,
                  icon: Users,
                  subtitle: "Total members"
                },
                {
                  id: "church-departments",
                  title: tChurch.table.departments,
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
                      description={`${
                        selectedChurchDetail.region?.name 
                          ? selectedChurchDetail.region.name
                          : 'No Region'
                      } • ${churchMembers} members • ${churchDepartments} departments`}
                      icon={Home}
                      badges={[
                        {
                          label: selectedChurchDetail.is_deleted ? t('common.inactive') : t('common.active'),
                          variant: selectedChurchDetail.is_deleted ? "secondary" : "default",
                          className: selectedChurchDetail.is_deleted 
                            ? "bg-gray-100 text-gray-700" 
                            : "bg-green-100 text-green-700"
                        },
                        ...(selectedChurchDetail.region 
                          ? [] 
                          : [{
                              label: 'No Region',
                              variant: "outline" as const,
                              className: "bg-muted/50 text-muted-foreground border-border"
                            }]
                        ),
                        ...(selectedChurchDetail.type ? [{
                          label: selectedChurchDetail.type === 'PLANT' ? 'Church Plant' : selectedChurchDetail.type === 'COMPANY' ? 'Church Company' : 'Standard',
                          variant: "outline" as const
                        }] : [])
                      ]}
                      actions={[
                        {
                          label: tChurch.messages.edit_church,
                          icon: Edit,
                          onClick: () => handleEdit(selectedChurchDetail.id)
                        },
                        {
                          label: t('common.view_contact'),
                          icon: ContactRound,
                          onClick: () => handleViewContact(selectedChurchDetail.id)
                        },
                        {
                          label: tChurch.messages.delete_church,
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
              const departmentChartData = generateChurchDepartmentData(selectedChurchDetail);
              
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
                      data={departmentChartData.activities} 
                      loading={false}
                      mode="departments"
                    />

                    {/* Chart 2: Users by Role within Church */}
                    <UsersByRoleChart 
                      data={departmentChartData.usersByRole} 
                      loading={false}
                      title="Users by Role"
                      description="Distribution of users by their roles within this church"
                    />

                    {/* Chart 3: Projetos por Departamento */}
                    <ProjectsByChurchChart 
                      data={departmentChartData.projectsByDept} 
                      loading={false}
                      mode="departments"
                      onItemClick={(department) => {
                        console.log('Department clicked:', department)
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
                      {tChurch.table.church_members}
                    </CardTitle>
                    <CardDescription>
                      {t('common.all_members_associated_with')} {selectedChurchDetail?.name}
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
                          title: tChurch.table.status,
                          options: [
                            { label: t('common.active'), value: "true" },
                            { label: t('common.inactive'), value: "false" },
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
                      {tChurch.table.church_departments}
                    </CardTitle>
                    <CardDescription>
                      {t('common.all_departments_within')} {selectedChurchDetail?.name}
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
                          title: tChurch.table.status,
                          options: [
                            { label: t('common.active'), value: "false" },
                            { label: t('common.inactive'), value: "true" },
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
        {/* {selectedContact && selectedChurch && (
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
         */}
        
        {/* Add Church Modal */}
        <AddChurchModal
          isOpen={isAddChurchModalOpen}
          onOpenChangeAction={setIsAddChurchModalOpen}
          institutionId={currentInstitutionData?.id || ''}
          onSave={handleChurchSaved}
        />
        
        {/* Edit Church Modal */}
        {churchToEdit && (
          <EditChurchModal
            isOpen={isEditChurchModalOpen}
            onOpenChangeAction={setIsEditChurchModalOpen}
            church={churchToEdit}
            onSave={handleChurchUpdated}
          />
        )}
        
        {/* Delete Church Modal */}
        {churchToDelete && (
          <DeleteChurchModal
            isOpen={isDeleteChurchModalOpen}
            onOpenChangeAction={setIsDeleteChurchModalOpen}
            church={churchToDelete}
            onSuccess={handleChurchDeleted}
          />
        )}
      </div>
      </WithPermission>
    </AppLayout>
  )
}
