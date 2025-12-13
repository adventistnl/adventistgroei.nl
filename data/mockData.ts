// Mock data para Church Growth International Dashboard
// Baseado na estrutura ERD fornecida

// Dados de crescimento ao longo do tempo
export const growthData = [
  {
    date: "Jan 2024",
    institutions: 8,
    churches: 156,
    regions: 28,
    members: 45000
  },
  {
    date: "Feb 2024",
    institutions: 8,
    churches: 162,
    regions: 29,
    members: 46200
  },
  {
    date: "Mar 2024",
    institutions: 8,
    churches: 168,
    regions: 30,
    members: 47800
  },
  {
    date: "Apr 2024",
    institutions: 8,
    churches: 175,
    regions: 32,
    members: 49100
  },
  {
    date: "May 2024",
    institutions: 8,
    churches: 182,
    regions: 33,
    members: 50600
  },
  {
    date: "Jun 2024",
    institutions: 8,
    churches: 189,
    regions: 35,
    members: 52300
  },
  {
    date: "Jul 2024",
    institutions: 8,
    churches: 196,
    regions: 36,
    members: 53800
  },
  {
    date: "Aug 2024",
    institutions: 8,
    churches: 203,
    regions: 38,
    members: 55400
  }
]

// Distribuição de usuários por instituição
export const usersByInstitutionData = [
  {
    institution: "União Sul-Paulista",
    users: 1250,
    churches: 45,
    regions: 8
  },
  {
    institution: "União Central Brasileira",
    users: 980,
    churches: 38,
    regions: 7
  },
  {
    institution: "União Amazônica",
    users: 720,
    churches: 32,
    regions: 6
  },
  {
    institution: "União Nordeste Brasileira",
    users: 890,
    churches: 41,
    regions: 8
  },
  {
    institution: "União Sul-Oeste",
    users: 650,
    churches: 28,
    regions: 5
  },
  {
    institution: "União Norte Brasileira",
    users: 420,
    churches: 19,
    regions: 4
  }
]

// Orçamento vs Subsídios por departamento
export const budgetVsSubsidyData = [
  {
    department: "Evangelismo",
    budget: 150000,
    subsidies_requested: 89000,
    subsidies_approved: 67000
  },
  {
    department: "Educação",
    budget: 200000,
    subsidies_requested: 145000,
    subsidies_approved: 120000
  },
  {
    department: "Saúde",
    budget: 180000,
    subsidies_requested: 95000,
    subsidies_approved: 78000
  },
  {
    department: "Comunicação",
    budget: 120000,
    subsidies_requested: 65000,
    subsidies_approved: 52000
  },
  {
    department: "Juventude",
    budget: 100000,
    subsidies_requested: 78000,
    subsidies_approved: 65000
  },
  {
    department: "Ministério Feminino",
    budget: 80000,
    subsidies_requested: 45000,
    subsidies_approved: 38000
  }
]

// Status das solicitações de subsídio
export const subsidyStatusData = [
  {
    name: "Approved",
    value: 420,
    percentage: 52.5,
    color: "#22c55e"
  },
  {
    name: "Pending",
    value: 245,
    percentage: 30.6,
    color: "#f59e0b"
  },
  {
    name: "Under Review",
    value: 89,
    percentage: 11.1,
    color: "#3b82f6"
  },
  {
    name: "Rejected",
    value: 46,
    percentage: 5.8,
    color: "#ef4444"
  }
]

// Participação em eventos por tipo
export const eventParticipationData = [
  {
    month: "Jan",
    evangelism: 1200,
    show: 800,
    conference: 450,
    workshop: 320
  },
  {
    month: "Feb",
    evangelism: 1350,
    show: 920,
    conference: 380,
    workshop: 290
  },
  {
    month: "Mar",
    evangelism: 1180,
    show: 1100,
    conference: 520,
    workshop: 410
  },
  {
    month: "Apr",
    evangelism: 1420,
    show: 950,
    conference: 480,
    workshop: 380
  },
  {
    month: "May",
    evangelism: 1680,
    show: 1200,
    conference: 650,
    workshop: 520
  },
  {
    month: "Jun",
    evangelism: 1520,
    show: 1350,
    conference: 580,
    workshop: 460
  }
]

// Fluxo de comunicação e mensagens
export const communicationFlowData = [
  {
    date: "2024-01-01",
    communications: 45,
    direct_messages: 230,
    announcements: 12
  },
  {
    date: "2024-01-15",
    communications: 52,
    direct_messages: 280,
    announcements: 15
  },
  {
    date: "2024-02-01",
    communications: 38,
    direct_messages: 195,
    announcements: 8
  },
  {
    date: "2024-02-15",
    communications: 67,
    direct_messages: 320,
    announcements: 18
  },
  {
    date: "2024-03-01",
    communications: 74,
    direct_messages: 410,
    announcements: 22
  },
  {
    date: "2024-03-15",
    communications: 89,
    direct_messages: 380,
    announcements: 19
  },
  {
    date: "2024-04-01",
    communications: 95,
    direct_messages: 450,
    announcements: 25
  },
  {
    date: "2024-04-15",
    communications: 82,
    direct_messages: 390,
    announcements: 16
  }
]

// Métricas principais do dashboard
export const dashboardMetrics = {
  totalUsers: 4910,
  totalInstitutions: 8,
  totalChurches: 203,
  totalRegions: 38,
  pendingSubsidies: 245,
  monthlyGrowth: 12.5,
  budgetUtilization: 78.3,
  eventParticipation: 4250,
  activeMembers: 55400,
  newMembersThisMonth: 420,
  totalDepartments: 156,
  activeCommunications: 89
}

// Atividades recentes
export const recentActivities = [
  {
    id: "1",
    type: "member_registered",
    description: "New member registered in São Paulo Capital",
    user: "Maria Silva",
    timestamp: "2024-08-27T10:30:00Z",
    icon: "user-plus"
  },
  {
    id: "2",
    type: "subsidy_approved",
    description: "Subsidy approved for Evangelism Department",
    user: "Pastor João Santos",
    amount: 15000,
    timestamp: "2024-08-27T09:15:00Z",
    icon: "check-circle"
  },
  {
    id: "3",
    type: "event_created",
    description: "New evangelism event created in Rio de Janeiro",
    user: "Ana Costa",
    timestamp: "2024-08-27T08:45:00Z",
    icon: "calendar"
  },
  {
    id: "4",
    type: "church_registered",
    description: "New church registered in Minas Gerais",
    user: "Pastor Carlos Lima",
    timestamp: "2024-08-26T16:20:00Z",
    icon: "home"
  },
  {
    id: "5",
    type: "communication_sent",
    description: "Weekly newsletter sent to all regions",
    user: "Admin System",
    timestamp: "2024-08-26T14:00:00Z",
    icon: "mail"
  }
]

// Dados de distribuição geográfica
export const geographicDistribution = [
  {
    region: "Southeast",
    institutions: 2,
    churches: 89,
    members: 28500,
    percentage: 51.4
  },
  {
    region: "Northeast",
    institutions: 2,
    churches: 52,
    members: 16800,
    percentage: 30.3
  },
  {
    region: "Central",
    institutions: 2,
    churches: 34,
    members: 7200,
    percentage: 13.0
  },
  {
    region: "North",
    institutions: 1,
    churches: 18,
    members: 2100,
    percentage: 3.8
  },
  {
    region: "South",
    institutions: 1,
    churches: 10,
    members: 800,
    percentage: 1.4
  }
]

// Performance de departamentos
export const departmentPerformanceData = [
  {
    name: "Evangelismo",
    budget_used: 89,
    events_completed: 45,
    members_reached: 2800,
    efficiency: 92
  },
  {
    name: "Educação",
    budget_used: 76,
    events_completed: 32,
    members_reached: 1950,
    efficiency: 88
  },
  {
    name: "Saúde",
    budget_used: 68,
    events_completed: 28,
    members_reached: 1200,
    efficiency: 85
  },
  {
    name: "Comunicação",
    budget_used: 82,
    events_completed: 156,
    members_reached: 5500,
    efficiency: 95
  },
  {
    name: "Juventude",
    budget_used: 91,
    events_completed: 67,
    members_reached: 3200,
    efficiency: 89
  }
]

// Mock departments data with budget tracking
export const mockDepartments = [
  { 
    id: "1", 
    name: "Evangelismo", 
    description: "Evangelism and outreach programs", 
    annual_budget: 150000,
    institution_id: "usp",
    church_id: null,
    contact_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { 
    id: "2", 
    name: "Educação", 
    description: "Educational programs and initiatives", 
    annual_budget: 200000,
    institution_id: "usp",
    church_id: null,
    contact_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { 
    id: "3", 
    name: "Saúde", 
    description: "Health and wellness programs", 
    annual_budget: 180000,
    institution_id: "ucb",
    church_id: null,
    contact_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { 
    id: "4", 
    name: "Comunicação", 
    description: "Communication and media programs", 
    annual_budget: 120000,
    institution_id: "usp",
    church_id: null,
    contact_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { 
    id: "5", 
    name: "Juventude", 
    description: "Youth and young adult programs", 
    annual_budget: 100000,
    institution_id: "usp",
    church_id: null,
    contact_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { 
    id: "6", 
    name: "Ministério Feminino", 
    description: "Women's ministry programs", 
    annual_budget: 80000,
    institution_id: "ucb",
    church_id: null,
    contact_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

// Mock subsidy statuses
export const mockSubsidyStatuses = [
  { id: "1", name: "Pending Review", description: "Awaiting initial review", order: 1, color: "#f59e0b" },
  { id: "2", name: "Under Review", description: "Currently being reviewed", order: 2, color: "#3b82f6" },
  { id: "3", name: "Approved", description: "Request approved", order: 3, color: "#22c55e" },
  { id: "4", name: "Rejected", description: "Request rejected", order: 4, color: "#ef4444" },
  { id: "5", name: "Completed", description: "Project completed", order: 5, color: "#6b7280" }
]

// Mock events data
export const mockEvents = [
  {
    id: "1",
    target_type: "department",
    target_id: "1",
    title: "Campanha Evangelística Regional",
    description: "Grande campanha evangelística para a região centro-oeste",
    contact_id: "contact1",
    type: "evangelism",
    language_preference: "pt",
    max_participants: 500,
    ticket_amount: 0,
    location: "Centro de Convenções - Brasília",
    subscription_expires_at: "2024-07-30T23:59:59Z",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    target_type: "institution",
    target_id: "usp",
    title: "Seminário Educacional",
    description: "Seminário sobre métodos educacionais adventistas",
    contact_id: "contact2",
    type: "show",
    language_preference: "pt",
    max_participants: 200,
    ticket_amount: 50.00,
    location: "Auditório UNASP - São Paulo",
    subscription_expires_at: "2024-05-15T23:59:59Z",
    created_at: "2024-01-10T14:20:00Z",
    updated_at: "2024-01-10T14:20:00Z"
  }
]

// Mock communications data
export const mockCommunications = [
  {
    id: "1",
    institution_id: "usp",
    title: "Lançamento do Projeto Evangelístico",
    content: "Estamos lançando uma nova campanha evangelística regional. Participem!",
    type: "announcement",
    priority: "high",
    status: "published",
    language_preference: "pt",
    schedule_at: "2024-03-01T09:00:00Z",
    published_at: "2024-03-01T09:00:00Z",
    author_id: "user1",
    created_at: "2024-02-28T15:30:00Z",
    updated_at: "2024-02-28T15:30:00Z"
  },
  {
    id: "2",
    institution_id: "usp",
    title: "Programa Educacional - Inscrições Abertas",
    content: "As inscrições para o novo programa educacional estão abertas. Não percam!",
    type: "notification",
    priority: "medium",
    status: "scheduled",
    language_preference: "pt",
    schedule_at: "2024-04-01T08:00:00Z",
    published_at: null,
    author_id: "user2",
    created_at: "2024-03-15T11:20:00Z",
    updated_at: "2024-03-15T11:20:00Z"
  }
]

// Mock communication recipients
export const mockCommunicationRecipients = [
  {
    id: "1",
    communication_id: "1",
    target_type: "department",
    target_id: "1",
    created_at: "2024-02-28T15:30:00Z",
    updated_at: "2024-02-28T15:30:00Z"
  },
  {
    id: "2",
    communication_id: "1",
    target_type: "institution",
    target_id: "usp",
    created_at: "2024-02-28T15:30:00Z",
    updated_at: "2024-02-28T15:30:00Z"
  },
  {
    id: "3",
    communication_id: "2",
    target_type: "department",
    target_id: "2",
    created_at: "2024-03-15T11:20:00Z",
    updated_at: "2024-03-15T11:20:00Z"
  }
]

// Mock projects data
export const mockProjects = [
  {
    id: "1",
    department_id: "1",
    title: "Campanha Evangelística Centro-Oeste",
    description: "Campanha evangelística regional focada em plantio de igrejas e evangelismo público",
    budget: 25000,
    is_private: false,
    is_event: true,
    required_volunteers: true,
    type: "Global",
    eventId: "1",
    start_at: "2024-03-01",
    end_at: "2024-08-31",
    language_preference: "pt",
    institutionId: "usp",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    status: "active"
  },
  {
    id: "2",
    department_id: "2",
    title: "Programa Educacional Adventista",
    description: "Implementação de programa educacional em comunidades carentes",
    budget: 45000,
    is_private: false,
    is_event: false,
    required_volunteers: true,
    type: "Local",
    eventId: null,
    start_at: "2024-02-15",
    end_at: "2024-12-15",
    language_preference: "pt",
    institutionId: "usp",
    created_at: "2024-01-10T14:20:00Z",
    updated_at: "2024-01-10T14:20:00Z",
    status: "active"
  },
  {
    id: "3",
    department_id: "3",
    title: "Clínica Móvel de Saúde",
    description: "Atendimento médico itinerante em comunidades rurais",
    budget: 35000,
    is_private: false,
    is_event: false,
    required_volunteers: true,
    type: "Local",
    eventId: null,
    start_at: "2024-04-01",
    end_at: "2024-10-31",
    language_preference: "pt",
    institutionId: "ucb",
    created_at: "2024-01-20T16:45:00Z",
    updated_at: "2024-01-20T16:45:00Z",
    status: "upcoming"
  },
  {
    id: "4",
    department_id: "4",
    title: "Projeto Comunicação Digital",
    description: "Modernização da comunicação institucional através de mídias digitais",
    budget: 18000,
    is_private: true,
    is_event: false,
    required_volunteers: false,
    type: "Local",
    eventId: null,
    start_at: "2024-01-01",
    end_at: "2024-06-30",
    language_preference: "pt",
    institutionId: "usp",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T09:15:00Z",
    status: "active"
  },
  {
    id: "5",
    department_id: "5",
    title: "Acampamento de Jovens 2024",
    description: "Acampamento anual para jovens com foco em liderança e espiritualidade",
    budget: 22000,
    is_private: false,
    is_event: true,
    required_volunteers: true,
    type: "Global",
    eventId: "2",
    start_at: "2024-07-15",
    end_at: "2024-07-22",
    language_preference: "pt",
    institutionId: "usp",
    created_at: "2024-01-12T11:30:00Z",
    updated_at: "2024-01-12T11:30:00Z",
    status: "upcoming"
  },
  {
    id: "6",
    department_id: "6",
    title: "Seminário Ministério Feminino",
    description: "Seminário de capacitação para líderes do ministério feminino",
    budget: 12000,
    is_private: false,
    is_event: false,
    required_volunteers: false,
    type: "Local",
    eventId: null,
    start_at: "2024-05-10",
    end_at: "2024-05-12",
    language_preference: "pt",
    institutionId: "ucb",
    created_at: "2024-01-08T13:15:00Z",
    updated_at: "2024-01-08T13:15:00Z",
    status: "upcoming"
  },
  {
    id: "7",
    department_id: "1",
    title: "Projeto Plantio de Igrejas Norte",
    description: "Plantio de novas congregações na região norte",
    budget: 40000,
    is_private: false,
    is_event: false,
    required_volunteers: true,
    type: "Global",
    eventId: null,
    start_at: "2023-09-01",
    end_at: "2024-02-29",
    language_preference: "pt",
    institutionId: "ucb",
    created_at: "2023-08-15T10:30:00Z",
    updated_at: "2023-08-15T10:30:00Z",
    status: "completed"
  },
  {
    id: "8",
    department_id: "2",
    title: "Biblioteca Comunitária Digital",
    description: "Implementação de biblioteca digital em escolas adventistas",
    budget: 28000,
    is_private: false,
    is_event: false,
    required_volunteers: false,
    type: "Local",
    eventId: null,
    start_at: "2024-06-01",
    end_at: "2024-11-30",
    language_preference: "pt",
    institutionId: "usp",
    created_at: "2024-02-10T15:45:00Z",
    updated_at: "2024-02-10T15:45:00Z",
    status: "upcoming"
  }
]

// Mock churches for subsidy requests
export const mockChurches = [
  { id: "church1", name: "Igreja Central São Paulo", region: "São Paulo" },
  { id: "church2", name: "Igreja Vila Mariana", region: "São Paulo" },
  { id: "church3", name: "Igreja Brasília Norte", region: "Distrito Federal" },
  { id: "church4", name: "Igreja Campinas Central", region: "São Paulo" },
  { id: "church5", name: "Igreja Rio de Janeiro", region: "Rio de Janeiro" },
  { id: "church6", name: "Igreja Belo Horizonte", region: "Minas Gerais" }
]

// Mock users for subsidy requests
export const mockUsers = [
  { id: "user1", name: "Pastor João Silva", email: "joao.silva@adventist.org" },
  { id: "user2", name: "Maria Santos", email: "maria.santos@adventist.org" },
  { id: "user3", name: "Dr. Carlos Lima", email: "carlos.lima@adventist.org" },
  { id: "user4", name: "Ana Costa", email: "ana.costa@adventist.org" },
  { id: "user5", name: "Pastor Roberto Oliveira", email: "roberto.oliveira@adventist.org" },
  { id: "user6", name: "Lucia Fernandes", email: "lucia.fernandes@adventist.org" }
]

// Enhanced mock subsidy requests
export const mockSubsidyRequests = [
  {
    id: "1",
    institution_id: "usp",
    requester_id: "user1",
    department_project_id: "1",
    church_id: "church1",
    description: "Subsídio para campanha evangelística regional - materiais, equipamentos e logística",
    total_budget: 15000,
    subsidy_statuses_id: "3",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-02-15T14:30:00Z",
    project_id: "1",
    completion_rate: 75,
    approved_amount: 11250,
    pending_amount: 3750
  },
  {
    id: "2",
    institution_id: "usp",
    requester_id: "user2",
    department_project_id: "2",
    church_id: "church2",
    description: "Subsídio para programa educacional - material didático e capacitação",
    total_budget: 25000,
    subsidy_statuses_id: "2",
    created_at: "2024-01-25T14:30:00Z",
    updated_at: "2024-03-01T09:15:00Z",
    project_id: "2",
    completion_rate: 40,
    approved_amount: 10000,
    pending_amount: 15000
  },
  {
    id: "3",
    institution_id: "ucb",
    requester_id: "user3",
    department_project_id: "3",
    church_id: "church3",
    description: "Subsídio para clínica móvel de saúde - equipamentos médicos e medicamentos",
    total_budget: 20000,
    subsidy_statuses_id: "1",
    created_at: "2024-02-01T09:15:00Z",
    updated_at: "2024-02-01T09:15:00Z",
    project_id: "3",
    completion_rate: 35,
    approved_amount: 7000,
    pending_amount: 13000
  },
  {
    id: "4",
    institution_id: "usp",
    requester_id: "user4",
    department_project_id: "4",
    church_id: "church4",
    description: "Subsídio para projeto de comunicação digital - plataforma e treinamento",
    total_budget: 8000,
    subsidy_statuses_id: "3",
    created_at: "2024-01-18T16:20:00Z",
    updated_at: "2024-02-25T11:45:00Z",
    project_id: "4",
    completion_rate: 100,
    approved_amount: 8000,
    pending_amount: 0
  },
  {
    id: "5",
    institution_id: "usp",
    requester_id: "user5",
    department_project_id: "5",
    church_id: "church5",
    description: "Subsídio para acampamento de jovens - local, alimentação e atividades",
    total_budget: 12000,
    subsidy_statuses_id: "2",
    created_at: "2024-02-05T11:45:00Z",
    updated_at: "2024-03-15T16:20:00Z",
    project_id: "5",
    completion_rate: 30,
    approved_amount: 3600,
    pending_amount: 8400
  },
  {
    id: "6",
    institution_id: "ucb",
    requester_id: "user6",
    department_project_id: "6",
    church_id: "church6",
    description: "Subsídio para seminário ministério feminino - palestrantes e material",
    total_budget: 6000,
    subsidy_statuses_id: "1",
    created_at: "2024-02-08T13:30:00Z",
    updated_at: "2024-02-08T13:30:00Z",
    project_id: "6",
    completion_rate: 0,
    approved_amount: 0,
    pending_amount: 6000
  },
  {
    id: "7",
    institution_id: "usp",
    requester_id: "user1",
    department_project_id: "1",
    church_id: "church2",
    description: "Subsídio adicional para evangelismo - expansão para novas regiões",
    total_budget: 18000,
    subsidy_statuses_id: "2",
    created_at: "2024-03-01T08:00:00Z",
    updated_at: "2024-03-10T14:20:00Z",
    project_id: "1",
    completion_rate: 15,
    approved_amount: 2700,
    pending_amount: 15300
  }
]

// Mock subsidy activities
export const mockSubsidyActivities = [
  {
    id: "1",
    subsidy_request_id: "1",
    name: "Material de Evangelismo",
    description: "Impressão de folhetos e materiais evangelísticos",
    budget_amount: 5000,
    status: "approved",
    created_at: "2024-01-20T10:30:00Z",
    updated_at: "2024-01-20T10:30:00Z"
  },
  {
    id: "2",
    subsidy_request_id: "1",
    name: "Equipamento de Som",
    description: "Aluguel de equipamento de som para eventos",
    budget_amount: 7000,
    status: "pending",
    created_at: "2024-01-20T10:35:00Z",
    updated_at: "2024-01-20T10:35:00Z"
  },
  {
    id: "3",
    subsidy_request_id: "1",
    name: "Transporte",
    description: "Custos de transporte para evangelistas",
    budget_amount: 3000,
    status: "approved",
    created_at: "2024-01-20T10:40:00Z",
    updated_at: "2024-01-20T10:40:00Z"
  },
  {
    id: "4",
    subsidy_request_id: "2",
    name: "Material Didático",
    description: "Compra de livros e material didático",
    budget_amount: 15000,
    status: "under_review",
    created_at: "2024-01-25T14:45:00Z",
    updated_at: "2024-01-25T14:45:00Z"
  },
  {
    id: "5",
    subsidy_request_id: "2",
    name: "Capacitação de Professores",
    description: "Treinamento para educadores locais",
    budget_amount: 10000,
    status: "approved",
    created_at: "2024-01-25T15:00:00Z",
    updated_at: "2024-01-25T15:00:00Z"
  },
  {
    id: "6",
    subsidy_request_id: "3",
    name: "Equipamentos Médicos",
    description: "Compra de equipamentos básicos para atendimento",
    budget_amount: 12000,
    status: "pending",
    created_at: "2024-02-01T09:30:00Z",
    updated_at: "2024-02-01T09:30:00Z"
  },
  {
    id: "7",
    subsidy_request_id: "3",
    name: "Medicamentos",
    description: "Compra de medicamentos básicos",
    budget_amount: 8000,
    status: "approved",
    created_at: "2024-02-01T09:45:00Z",
    updated_at: "2024-02-01T09:45:00Z"
  },
  {
    id: "8",
    subsidy_request_id: "4",
    name: "Plataforma Digital",
    description: "Desenvolvimento de plataforma de comunicação",
    budget_amount: 6000,
    status: "approved",
    created_at: "2024-01-18T16:30:00Z",
    updated_at: "2024-01-18T16:30:00Z"
  },
  {
    id: "9",
    subsidy_request_id: "4",
    name: "Treinamento Digital",
    description: "Capacitação da equipe em ferramentas digitais",
    budget_amount: 2000,
    status: "completed",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z"
  },
  {
    id: "10",
    subsidy_request_id: "5",
    name: "Local do Acampamento",
    description: "Aluguel do local para o acampamento de jovens",
    budget_amount: 8000,
    status: "pending",
    created_at: "2024-02-05T12:00:00Z",
    updated_at: "2024-02-05T12:00:00Z"
  },
  {
    id: "11",
    subsidy_request_id: "5",
    name: "Alimentação",
    description: "Custos com alimentação durante o acampamento",
    budget_amount: 4000,
    status: "approved",
    created_at: "2024-02-05T12:15:00Z",
    updated_at: "2024-02-05T12:15:00Z"
  }
]

// Mock subsidy receipts
export const mockSubsidyReceipts = [
  {
    id: "1",
    subsidy_activities_id: "1",
    file_path: "/receipts/receipt_001.pdf",
    amount: 4500,
    approved: true,
    description: "Compra de materiais gráficos",
    receipt_date: "2024-02-15T00:00:00Z",
    created_at: "2024-02-16T10:30:00Z",
    updated_at: "2024-02-16T10:30:00Z"
  },
  {
    id: "2",
    subsidy_activities_id: "1",
    file_path: "/receipts/receipt_002.pdf",
    amount: 500,
    approved: true,
    description: "Taxa de entrega",
    receipt_date: "2024-02-16T00:00:00Z",
    created_at: "2024-02-17T14:20:00Z",
    updated_at: "2024-02-17T14:20:00Z"
  },
  {
    id: "3",
    subsidy_activities_id: "3",
    file_path: "/receipts/receipt_003.pdf",
    amount: 2800,
    approved: true,
    description: "Combustível e pedágio",
    receipt_date: "2024-02-20T00:00:00Z",
    created_at: "2024-02-21T09:15:00Z",
    updated_at: "2024-02-21T09:15:00Z"
  },
  {
    id: "4",
    subsidy_activities_id: "5",
    file_path: "/receipts/receipt_004.pdf",
    amount: 8500,
    approved: true,
    description: "Curso de capacitação - Parte 1",
    receipt_date: "2024-03-01T00:00:00Z",
    created_at: "2024-03-02T16:45:00Z",
    updated_at: "2024-03-02T16:45:00Z"
  },
  {
    id: "5",
    subsidy_activities_id: "5",
    file_path: "/receipts/receipt_005.pdf",
    amount: 1500,
    approved: false,
    description: "Material complementar",
    receipt_date: "2024-03-05T00:00:00Z",
    created_at: "2024-03-06T11:30:00Z",
    updated_at: "2024-03-06T11:30:00Z"
  },
  {
    id: "6",
    subsidy_activities_id: "7",
    file_path: "/receipts/receipt_006.pdf",
    amount: 7200,
    approved: true,
    description: "Compra de medicamentos básicos",
    receipt_date: "2024-03-10T00:00:00Z",
    created_at: "2024-03-11T08:20:00Z",
    updated_at: "2024-03-11T08:20:00Z"
  },
  {
    id: "7",
    subsidy_activities_id: "8",
    file_path: "/receipts/receipt_007.pdf",
    amount: 5500,
    approved: true,
    description: "Desenvolvimento da plataforma - Fase 1",
    receipt_date: "2024-02-28T00:00:00Z",
    created_at: "2024-03-01T13:45:00Z",
    updated_at: "2024-03-01T13:45:00Z"
  },
  {
    id: "8",
    subsidy_activities_id: "9",
    file_path: "/receipts/receipt_008.pdf",
    amount: 2000,
    approved: true,
    description: "Treinamento completo da equipe",
    receipt_date: "2024-02-25T00:00:00Z",
    created_at: "2024-02-26T15:30:00Z",
    updated_at: "2024-02-26T15:30:00Z"
  },
  {
    id: "9",
    subsidy_activities_id: "11",
    file_path: "/receipts/receipt_009.pdf",
    amount: 3500,
    approved: true,
    description: "Compra de alimentos - Parte 1",
    receipt_date: "2024-03-15T00:00:00Z",
    created_at: "2024-03-16T10:00:00Z",
    updated_at: "2024-03-16T10:00:00Z"
  }
]

// Project monthly progress data
export const projectMonthlyProgressData = [
  { month: "Jan 2024", budget_used: 0, subsidies_approved: 0, activities_completed: 0 },
  { month: "Fev 2024", budget_used: 8000, subsidies_approved: 7500, activities_completed: 2 },
  { month: "Mar 2024", budget_used: 15000, subsidies_approved: 12800, activities_completed: 3 },
  { month: "Abr 2024", budget_used: 22000, subsidies_approved: 18200, activities_completed: 4 },
  { month: "Mai 2024", budget_used: 25000, subsidies_approved: 21000, activities_completed: 5 },
  { month: "Jun 2024", budget_used: 25000, subsidies_approved: 23500, activities_completed: 6 }
]

// Projects timeline data for charts
export const projectsTimelineData = [
  { month: "Jan 2024", created: 2, completed: 1, total_budget: 67000, subsidies_requested: 35000 },
  { month: "Feb 2024", created: 3, completed: 0, total_budget: 85000, subsidies_requested: 51000 },
  { month: "Mar 2024", created: 1, completed: 2, total_budget: 25000, subsidies_requested: 15000 },
  { month: "Apr 2024", created: 2, completed: 1, total_budget: 63000, subsidies_requested: 38000 },
  { month: "May 2024", created: 1, completed: 0, total_budget: 22000, subsidies_requested: 12000 },
  { month: "Jun 2024", created: 0, completed: 1, total_budget: 0, subsidies_requested: 0 },
  { month: "Jul 2024", created: 1, completed: 0, total_budget: 22000, subsidies_requested: 12000 },
  { month: "Aug 2024", created: 0, completed: 2, total_budget: 0, subsidies_requested: 0 }
]

// Projects by department data with budget utilization
export const projectsByDepartmentData = [
  { 
    department: "Evangelismo", 
    projects: 2, 
    budget: 65000, 
    subsidies: 27000, 
    completion_rate: 50,
    annual_budget: 150000,
    budget_used: 65000,
    budget_utilization: 43.3,
    remaining_budget: 85000
  },
  { 
    department: "Educação", 
    projects: 2, 
    budget: 73000, 
    subsidies: 40000, 
    completion_rate: 0,
    annual_budget: 200000,
    budget_used: 73000,
    budget_utilization: 36.5,
    remaining_budget: 127000
  },
  { 
    department: "Saúde", 
    projects: 1, 
    budget: 35000, 
    subsidies: 20000, 
    completion_rate: 0,
    annual_budget: 180000,
    budget_used: 35000,
    budget_utilization: 19.4,
    remaining_budget: 145000
  },
  { 
    department: "Comunicação", 
    projects: 1, 
    budget: 18000, 
    subsidies: 8000, 
    completion_rate: 0,
    annual_budget: 120000,
    budget_used: 18000,
    budget_utilization: 15.0,
    remaining_budget: 102000
  },
  { 
    department: "Juventude", 
    projects: 1, 
    budget: 22000, 
    subsidies: 12000, 
    completion_rate: 0,
    annual_budget: 100000,
    budget_used: 22000,
    budget_utilization: 22.0,
    remaining_budget: 78000
  },
  { 
    department: "Min. Feminino", 
    projects: 1, 
    budget: 12000, 
    subsidies: 6000, 
    completion_rate: 0,
    annual_budget: 80000,
    budget_used: 12000,
    budget_utilization: 15.0,
    remaining_budget: 68000
  }
]

// Subsidy status distribution
export const subsidyStatusDistribution = [
  { status: "Aprovado", count: 2, percentage: 33.3, color: "#22c55e" },
  { status: "Em Análise", count: 2, percentage: 33.3, color: "#3b82f6" },
  { status: "Pendente", count: 2, percentage: 33.3, color: "#f59e0b" },
  { status: "Rejeitado", count: 0, percentage: 0, color: "#ef4444" }
]

// Mock reports data with enhanced structure
export const mockReports = [
  {
    id: "1",
    title: "Financial Report Q1 2024 - Evangelistic Campaign",
    description: "Detailed financial report for the first quarter evangelistic campaign covering budget allocation and expenditure analysis",
    report_type: "financial",
    project_id: "1",
    department_id: "1",
    submission_date: "2024-03-31T23:59:59Z",
    report_status: "approved",
    total_project_budget: 25000,
    total_project_budget_spent: 18500,
    total_project_budget_left: 6500,
    total_subsidies_requested: 33000,
    total_subsidies_approved: 18500,
    progress_percentage: 85.2,
    report_note: "Project executed as planned with strong community engagement and successful outreach activities",
    attached_file: "/reports/financial_q1_2024_evangelism.pdf",
    created_at: "2024-03-25T10:30:00Z",
    updated_at: "2024-04-02T14:20:00Z",
    created_by: "user1",
    updated_by: "user1",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "2",
    title: "Progress Report - Educational Program Implementation",
    description: "Mid-term progress assessment of educational program implementation in underserved communities",
    report_type: "progress",
    project_id: "2",
    department_id: "2",
    submission_date: "2024-06-30T23:59:59Z",
    report_status: "in_review",
    total_project_budget: 45000,
    total_project_budget_spent: 22000,
    total_project_budget_left: 23000,
    total_subsidies_requested: 25000,
    total_subsidies_approved: 22000,
    progress_percentage: 55.8,
    report_note: "Project progressing well, some activities delayed due to seasonal factors but overall on track",
    attached_file: null,
    created_at: "2024-06-28T16:45:00Z",
    updated_at: "2024-06-28T16:45:00Z",
    created_by: "user2",
    updated_by: "user2",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "3",
    title: "Annual Report 2024 - Mobile Health Clinic",
    description: "Comprehensive annual report for mobile health clinic project including social impact assessment",
    report_type: "annual",
    project_id: "3",
    department_id: "3",
    submission_date: "2024-12-31T23:59:59Z",
    report_status: "needs_adjustment",
    total_project_budget: 35000,
    total_project_budget_spent: 12000,
    total_project_budget_left: 23000,
    total_subsidies_requested: 20000,
    total_subsidies_approved: 12000,
    progress_percentage: 42.5,
    report_note: "Project launched successfully, requires timeline adjustments for better community reach",
    attached_file: "/reports/annual_2024_mobile_clinic.pdf",
    created_at: "2024-12-20T14:30:00Z",
    updated_at: "2024-12-22T09:15:00Z",
    created_by: "user3",
    updated_by: "user3",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "4",
    title: "Financial Report Q2 2024 - Digital Communication Project",
    description: "Second quarter financial analysis for digital communication modernization initiative",
    report_type: "financial",
    project_id: "4",
    department_id: "4",
    submission_date: "2024-06-30T23:59:59Z",
    report_status: "approved",
    total_project_budget: 18000,
    total_project_budget_spent: 16200,
    total_project_budget_left: 1800,
    total_subsidies_requested: 8000,
    total_subsidies_approved: 8000,
    progress_percentage: 95.8,
    report_note: "Highly successful digital transformation with excellent ROI and user adoption rates",
    attached_file: "/reports/financial_q2_2024_digital_comm.pdf",
    created_at: "2024-06-25T11:45:00Z",
    updated_at: "2024-07-02T09:30:00Z",
    created_by: "user4",
    updated_by: "user4",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "5",
    title: "Progress Report - Youth Camp 2024",
    description: "Interim progress report for annual youth leadership camp including participant feedback and outcomes",
    report_type: "progress",
    project_id: "5",
    department_id: "5",
    submission_date: "2024-08-15T23:59:59Z",
    report_status: "on_hold",
    total_project_budget: 22000,
    total_project_budget_spent: 8500,
    total_project_budget_left: 13500,
    total_subsidies_requested: 12000,
    total_subsidies_approved: 8500,
    progress_percentage: 68.3,
    report_note: "Camp preparation on schedule, waiting for final venue confirmation before proceeding",
    attached_file: null,
    created_at: "2024-08-10T14:20:00Z",
    updated_at: "2024-08-12T16:15:00Z",
    created_by: "user5",
    updated_by: "user5",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "6",
    title: "Financial Report - Women's Ministry Seminar",
    description: "Complete financial breakdown for women's ministry leadership seminar including speaker fees and materials",
    report_type: "financial",
    project_id: "6",
    department_id: "6",
    submission_date: "2024-05-20T23:59:59Z",
    report_status: "rejected",
    total_project_budget: 12000,
    total_project_budget_spent: 3200,
    total_project_budget_left: 8800,
    total_subsidies_requested: 6000,
    total_subsidies_approved: 3200,
    progress_percentage: 28.7,
    report_note: "Initial phase completed, budget reallocation needed for expanded program scope",
    attached_file: "/reports/financial_womens_ministry_2024.pdf",
    created_at: "2024-05-15T09:30:00Z",
    updated_at: "2024-05-22T13:45:00Z",
    created_by: "user6",
    updated_by: "user6",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Reports chart data
export const reportsTimelineData = [
  { month: "Jan 2024", submitted: 1, approved: 1, in_review: 0, budget_spent: 18500 },
  { month: "Feb 2024", submitted: 0, approved: 0, in_review: 1, budget_spent: 22000 },
  { month: "Mar 2024", submitted: 1, approved: 1, in_review: 0, budget_spent: 18500 },
  { month: "Apr 2024", submitted: 1, approved: 0, in_review: 1, budget_spent: 16200 },
  { month: "May 2024", submitted: 1, approved: 0, in_review: 0, budget_spent: 3200 },
  { month: "Jun 2024", submitted: 2, approved: 1, in_review: 1, budget_spent: 38200 },
  { month: "Jul 2024", submitted: 0, approved: 1, in_review: 0, budget_spent: 16200 },
  { month: "Aug 2024", submitted: 1, approved: 0, in_review: 0, budget_spent: 8500 }
]

export const reportsByTypeData = [
  { type: "Financial", count: 3, budget_total: 55000, budget_spent: 37900, percentage: 50 },
  { type: "Progress", count: 2, budget_total: 67000, budget_spent: 30500, percentage: 33.3 },
  { type: "Annual", count: 1, budget_total: 35000, budget_spent: 12000, percentage: 16.7 }
]

export const reportsByDepartmentData = [
  { department: "Evangelismo", reports: 1, budget_spent: 18500, budget_approved: 18500, avg_progress: 85.2 },
  { department: "Educação", reports: 1, budget_spent: 22000, budget_approved: 22000, avg_progress: 55.8 },
  { department: "Saúde", reports: 1, budget_spent: 12000, budget_approved: 12000, avg_progress: 42.5 },
  { department: "Comunicação", reports: 1, budget_spent: 16200, budget_approved: 8000, avg_progress: 95.8 },
  { department: "Juventude", reports: 1, budget_spent: 8500, budget_approved: 8500, avg_progress: 68.3 },
  { department: "Min. Feminino", reports: 1, budget_spent: 3200, budget_approved: 3200, avg_progress: 28.7 }
]

export const reportsStatusData = [
  { status: "Approved", count: 2, percentage: 33.3, color: "#22c55e" },
  { status: "In Review", count: 1, percentage: 16.7, color: "#3b82f6" },
  { status: "On Hold", count: 1, percentage: 16.7, color: "#f59e0b" },
  { status: "Needs Adjustment", count: 1, percentage: 16.7, color: "#8b5cf6" },
  { status: "Rejected", count: 1, percentage: 16.7, color: "#ef4444" }
]

// Reports KPIs
export const reportsKPIs = {
  totalReports: 6,
  approvedReports: 2,
  pendingReports: 3,
  rejectedReports: 1,
  totalBudgetSpent: 80400,
  totalBudgetApproved: 70200,
  averageProgress: 62.7,
  totalSubsidiesApproved: 70200
}

// Projects KPIs
export const projectsKPIs = {
  totalProjects: 8,
  activeProjects: 3,
  completedProjects: 1,
  upcomingProjects: 4,
  totalBudget: 225000,
  totalSubsidyRequests: 6,
  totalSubsidyAmount: 86000,
  averageProjectBudget: 28125,
  projectsWithVolunteers: 6,
  departmentsInvolved: 6
}

// Dados específicos por instituição
export const institutionSpecificData = {
  usp: {
    // União Sul-Paulista
    dashboardMetrics: {
      totalUsers: 1250,
      totalRegions: 12,
      totalChurches: 89,
      pendingSubsidies: 45,
      monthlyGrowth: 15.2,
      budgetUtilization: 82.5,
      activeMembers: 28500,
      newMembersThisMonth: 180
    },
    growthData: [
      { date: "Jan 2024", churches: 85, members: 27000, regions: 11 },
      { date: "Feb 2024", churches: 86, members: 27200, regions: 11 },
      { date: "Mar 2024", churches: 87, members: 27500, regions: 12 },
      { date: "Apr 2024", churches: 88, members: 27800, regions: 12 },
      { date: "May 2024", churches: 89, members: 28100, regions: 12 },
      { date: "Jun 2024", churches: 89, members: 28500, regions: 12 },
    ],
    recentActivities: [
      {
        id: "usp-1",
        description: "New member registered in São Paulo Capital",
        user: "Maria Silva",
        timestamp: "2024-08-27T10:30:00Z",
        type: "member_registered"
      },
      {
        id: "usp-2", 
        description: "Evangelism event approved in Campinas",
        user: "Pastor João Santos",
        timestamp: "2024-08-27T09:15:00Z",
        type: "event_created"
      }
    ]
  },
  ucb: {
    // União Central Brasileira
    dashboardMetrics: {
      totalUsers: 890,
      totalRegions: 8,
      totalChurches: 52,
      pendingSubsidies: 28,
      monthlyGrowth: 8.7,
      budgetUtilization: 75.3,
      activeMembers: 16800,
      newMembersThisMonth: 95
    },
    growthData: [
      { date: "Jan 2024", churches: 48, members: 15800, regions: 7 },
      { date: "Feb 2024", churches: 49, members: 16000, regions: 7 },
      { date: "Mar 2024", churches: 50, members: 16200, regions: 8 },
      { date: "Apr 2024", churches: 51, members: 16400, regions: 8 },
      { date: "May 2024", churches: 52, members: 16600, regions: 8 },
      { date: "Jun 2024", churches: 52, members: 16800, regions: 8 },
    ],
    recentActivities: [
      {
        id: "ucb-1",
        description: "New church registered in Brasília",
        user: "Pastor Ana Costa", 
        timestamp: "2024-08-27T08:45:00Z",
        type: "church_registered"
      },
      {
        id: "ucb-2",
        description: "Youth subsidy approved for R$ 12,000",
        user: "Admin System",
        timestamp: "2024-08-26T16:20:00Z",
        type: "subsidy_approved"
      }
    ]
  },
  // Projects specific data for each institution
  projectsData: {
    usp: {
      totalProjects: 5,
      activeProjects: 2,
      totalBudget: 132000,
      subsidyRequests: 4,
      subsidyAmount: 60000
    },
    ucb: {
      totalProjects: 3,
      activeProjects: 1,
      totalBudget: 87000,
      subsidyRequests: 2,
      subsidyAmount: 26000
    }
  }
}

// Mock Activities for Projects
export const mockProjectActivities = [
  // Activities for Project 1 - Campanha Evangelística Centro-Oeste
  {
    id: "act-1",
    project_id: "1",
    name: "Reforma do Auditório Principal",
    description: "Renovação completa do auditório com sistema de som e iluminação moderna para as reuniões evangelísticas",
    budget_amount: 15000,
    spent_amount: 12500,
    is_subsidized: true,
    subsidy_amount: 10000,
    subsidy_percentage: 66.67,
    activity_tag: "reforma",
    status: "in_progress",
    priority: "high",
    start_date: "2024-03-15",
    end_date: "2024-05-30",
    created_at: "2024-03-01T10:30:00Z",
    updated_at: "2024-04-15T14:20:00Z",
    assigned_users: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Coordenador'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'Tesoureiro'
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro.costa@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Secretário'
      }
    ]
  },
  {
    id: "act-2", 
    project_id: "1",
    name: "Compra de Material Evangelístico",
    description: "Aquisição de livros, folhetos e materiais audiovisuais para distribuição durante a campanha",
    budget_amount: 5000,
    spent_amount: 4800,
    is_subsidized: true,
    subsidy_amount: 3000,
    subsidy_percentage: 60,
    activity_tag: "material",
    status: "completed",
    priority: "medium",
    start_date: "2024-03-01",
    end_date: "2024-03-31",
    created_at: "2024-03-01T10:30:00Z",
    updated_at: "2024-03-31T16:45:00Z",
    assigned_users: [
      {
        id: '4',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=9',
        role: 'Membro'
      }
    ]
  },
  {
    id: "act-3",
    project_id: "1", 
    name: "Treinamento de Evangelistas",
    description: "Capacitação dos membros voluntários para atuarem como evangelistas locais",
    budget_amount: 3000,
    spent_amount: 2800,
    is_subsidized: false,
    subsidy_amount: 0,
    subsidy_percentage: 0,
    activity_tag: "training",
    status: "completed",
    priority: "high",
    start_date: "2024-02-15",
    end_date: "2024-03-10",
    created_at: "2024-02-15T09:15:00Z",
    updated_at: "2024-03-10T18:30:00Z"
  },
  // Activities for Project 2 - Programa Educacional Adventista
  {
    id: "act-4",
    project_id: "2",
    name: "Construção de Biblioteca Comunitária",
    description: "Edificação de biblioteca para atender as necessidades educacionais da comunidade",
    budget_amount: 25000,
    spent_amount: 18000,
    is_subsidized: true,
    subsidy_amount: 18000,
    subsidy_percentage: 72,
    activity_tag: "reforma",
    status: "in_progress", 
    priority: "high",
    start_date: "2024-02-20",
    end_date: "2024-08-15",
    created_at: "2024-02-15T11:20:00Z",
    updated_at: "2024-04-20T15:10:00Z",
    assigned_users: [
      {
        id: '5',
        name: 'Carlos Ferreira',
        email: 'carlos.ferreira@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=7',
        role: 'Diácono'
      },
      {
        id: '6',
        name: 'Beatriz Lima',
        email: 'beatriz.lima@adventist.nl',
        initials: 'BL',
        role: 'Anciã'
      },
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Coordenador'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'Tesoureiro'
      }
    ]
  },
  {
    id: "act-5",
    project_id: "2",
    name: "Aquisição de Livros Didáticos",
    description: "Compra de materiais educacionais e livros para as diferentes faixas etárias",
    budget_amount: 8000,
    spent_amount: 6500,
    is_subsidized: true,
    subsidy_amount: 5000,
    subsidy_percentage: 62.5,
    activity_tag: "material",
    status: "in_progress",
    priority: "medium",
    start_date: "2024-03-01",
    end_date: "2024-07-31",
    created_at: "2024-02-15T11:20:00Z",
    updated_at: "2024-04-10T13:25:00Z",
    assigned_users: [
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro.costa@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Secretário'
      },
      {
        id: '4',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@adventist.nl',
        avatar: 'https://i.pravatar.cc/150?img=9',
        role: 'Membro'
      }
    ]
  },
  {
    id: "act-6",
    project_id: "2",
    name: "Capacitação de Professores Voluntários",
    description: "Treinamento pedagógico para voluntários que atuarão como educadores",
    budget_amount: 4000,
    spent_amount: 3200,
    is_subsidized: false,
    subsidy_amount: 0,
    subsidy_percentage: 0,
    activity_tag: "training",
    status: "completed",
    priority: "high",
    start_date: "2024-02-15",
    end_date: "2024-03-30",
    created_at: "2024-02-15T11:20:00Z",
    updated_at: "2024-03-30T17:45:00Z"
  },
  // Activities for Project 3 - Clínica Móvel de Saúde
  {
    id: "act-7",
    project_id: "3",
    name: "Adaptação do Veículo Médico",
    description: "Modificação estrutural de van para funcionamento como clínica móvel",
    budget_amount: 20000,
    spent_amount: 0,
    is_subsidized: true,
    subsidy_amount: 15000,
    subsidy_percentage: 75,
    activity_tag: "reforma",
    status: "pending",
    priority: "high",
    start_date: "2024-04-01",
    end_date: "2024-06-30",
    created_at: "2024-01-20T16:45:00Z",
    updated_at: "2024-01-20T16:45:00Z"
  },
  {
    id: "act-8",
    project_id: "3",
    name: "Compra de Equipamentos Médicos",
    description: "Aquisição de equipamentos básicos para atendimento médico itinerante",
    budget_amount: 12000,
    spent_amount: 0,
    is_subsidized: true,
    subsidy_amount: 8000,
    subsidy_percentage: 66.67,
    activity_tag: "material",
    status: "pending",
    priority: "high",
    start_date: "2024-05-01",
    end_date: "2024-07-15",
    created_at: "2024-01-20T16:45:00Z",
    updated_at: "2024-01-20T16:45:00Z"
  },
  {
    id: "act-9",
    project_id: "3",
    name: "Treinamento de Profissionais de Saúde",
    description: "Capacitação de enfermeiros e médicos voluntários para atendimento móvel",
    budget_amount: 2500,
    spent_amount: 0,
    is_subsidized: false,
    subsidy_amount: 0,
    subsidy_percentage: 0,
    activity_tag: "training",
    status: "pending",
    priority: "medium",
    start_date: "2024-06-01",
    end_date: "2024-06-15",
    created_at: "2024-01-20T16:45:00Z",
    updated_at: "2024-01-20T16:45:00Z"
  },
  // Activities for Project 4 - Projeto Comunicação Digital
  {
    id: "act-10",
    project_id: "4",
    name: "Desenvolvimento de Website Institucional",
    description: "Criação de nova plataforma web moderna e responsiva",
    budget_amount: 8000,
    spent_amount: 6000,
    is_subsidized: false,
    subsidy_amount: 0,
    subsidy_percentage: 0,
    activity_tag: "reforma",
    status: "in_progress",
    priority: "high",
    start_date: "2024-01-15",
    end_date: "2024-05-31",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-04-10T14:30:00Z"
  },
  {
    id: "act-11",
    project_id: "4",
    name: "Produção de Conteúdo Digital",
    description: "Criação de vídeos, podcasts e materiais gráficos para redes sociais",
    budget_amount: 6000,
    spent_amount: 4500,
    is_subsidized: false,
    subsidy_amount: 0,
    subsidy_percentage: 0,
    activity_tag: "material",
    status: "in_progress",
    priority: "medium",
    start_date: "2024-02-01",
    end_date: "2024-06-15",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-04-05T11:20:00Z"
  },
  {
    id: "act-12",
    project_id: "4",
    name: "Treinamento em Mídias Sociais",
    description: "Capacitação da equipe para gestão profissional das redes sociais",
    budget_amount: 2000,
    spent_amount: 2000,
    is_subsidized: false,
    subsidy_amount: 0,
    subsidy_percentage: 0,
    activity_tag: "training",
    status: "completed",
    priority: "medium",
    start_date: "2024-01-10",
    end_date: "2024-01-25",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-25T16:45:00Z"
  }
]

// Helper function to get activities by project ID
export const getActivitiesByProjectId = (projectId: string) => {
  return mockProjectActivities.filter(activity => activity.project_id === projectId)
}
