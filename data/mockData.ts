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
  }
}
