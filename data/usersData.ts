// Mock data for Users Management page
// Based on the ERD structure

export interface User {
  id: string
  institution_id: string
  church_id: string
  region_id?: string
  department_id?: string
  name: string
  email: string
  language_preference: string
  contact_id: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  user_roles: UserRole[]
  institution_name?: string
  church_name?: string
  region_name?: string
  department_name?: string
}

export interface UserRole {
  id: string
  name: string
  description: string
  key_code: string
}

export interface Role {
  id: string
  name: string
  description: string
  key_code: string
}

export interface Institution {
  id: string
  name: string
  denomination: string
  language_preference: "en" | "nl"
  contact_id: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface Church {
  id: string
  institution_id: string
  name: string
  region_id: string
  contact_id: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface Region {
  id: string
  institution_id: string
  name: string
  parent_region_id: string | null
  contact_id: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface Department {
  id: string
  institution_id: string
  church_id: string
  name: string
  description: string
  annual_budget: number
  contact_id: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface Contact {
  id: string
  name: string | null
  phone: string | null
  mobile: string | null
  email: string | null
  country: string | null
  city: string | null
  address: string | null
  full_address: string | null
  postal_code: string | null
  website: string | null
  notes: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface SubsidyRequest {
  id: string
  institution_id: string
  requester_id: string
  department_project_id: string
  church_id: string
  description: string
  total_budget: number
  status: "pending" | "approved" | "rejected" | "under_review"
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface Event {
  id: string
  target_type: "institution" | "region" | "department" | "church" | "user"
  target_id: string | null
  title: string
  description: string
  contact_id: string
  type: "show" | "evangelism"
  language_preference: "en" | "nl"
  max_participants: number
  ticket_amount: number
  subscription_expires_at: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface EventRegistration {
  id: string
  user_id: string
  event_id: string
  status: "paid" | "pendent" | "reserved" | "approved" | "canceled"
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface Communication {
  id: string
  institution_id: string
  title: string
  content: string
  type: string
  priority: string
  status: string
  language_preference: "en" | "nl"
  schedule_at: string
  published_at: string
  author_id: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface DirectMessage {
  id: string
  institution_id: string
  sender_id: string
  title: string
  content: string
  status: string
  sent_at: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface AnnualReport {
  id: string
  department_id: string
  text: string
  file_path: string
  submission_date: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

// Mock Roles
export const roles: Role[] = [
  { id: "1", name: "Admin", description: "Full system access", key_code: "ADMIN" },
  { id: "2", name: "Church Leader", description: "Church management access", key_code: "CHURCH_LEADER" },
  { id: "3", name: "Financial Officer", description: "Financial management access", key_code: "FINANCIAL_OFFICER" },
  { id: "4", name: "Evangelism Leader", description: "Evangelism activities management", key_code: "EVANGELISM_LEADER" },
  { id: "5", name: "Member", description: "Basic member access", key_code: "MEMBER" },
  { id: "6", name: "Regional Coordinator", description: "Regional oversight access", key_code: "REGIONAL_COORDINATOR" }
]

// Mock Institutions
export const institutions: Institution[] = [
  { 
    id: "1", 
    name: "Igreja Adventista do Sétimo Dia - Brasil", 
    denomination: "Seventh-day Adventist",
    language_preference: "en",
    contact_id: "c1", 
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: "system",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "2", 
    name: "Seventh-day Adventist Church - USA", 
    denomination: "Seventh-day Adventist",
    language_preference: "en",
    contact_id: "c2", 
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: "system",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "3", 
    name: "Iglesia Adventista del Séptimo Día - España", 
    denomination: "Seventh-day Adventist",
    language_preference: "en",
    contact_id: "c3", 
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: "system",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Regions
export const regions: Region[] = [
  { 
    id: "r1", 
    institution_id: "1",
    name: "São Paulo", 
    parent_region_id: null,
    contact_id: "c5",
    created_at: "2020-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "r2", 
    institution_id: "1",
    name: "Rio de Janeiro", 
    parent_region_id: null,
    contact_id: "c6",
    created_at: "2020-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "r3", 
    institution_id: "2",
    name: "Northeast", 
    parent_region_id: null,
    contact_id: "c7",
    created_at: "2020-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Churches
export const churches: Church[] = [
  { 
    id: "ch1", 
    institution_id: "1",
    name: "Igreja Central de São Paulo", 
    region_id: "r1",
    contact_id: "c10",
    created_at: "2020-02-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "ch2", 
    institution_id: "1",
    name: "Igreja do Rio de Janeiro", 
    region_id: "r2",
    contact_id: "c11",
    created_at: "2020-02-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "ch3", 
    institution_id: "2",
    name: "New York Central Church", 
    region_id: "r3",
    contact_id: "c12",
    created_at: "2020-02-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Departments
export const departments: Department[] = [
  { 
    id: "d1", 
    institution_id: "1",
    church_id: "ch1",
    name: "Evangelism", 
    description: "Evangelism and outreach activities", 
    annual_budget: 50000,
    contact_id: "c20",
    created_at: "2020-03-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  { 
    id: "d2", 
    institution_id: "1",
    church_id: "ch1",
    name: "Finance", 
    description: "Financial management", 
    annual_budget: 75000,
    contact_id: "c21",
    created_at: "2020-03-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Users
export const users: User[] = [
  {
    id: "u1",
    institution_id: "1",
    church_id: "ch1",
    region_id: "r1",
    department_id: "d1",
    name: "João Silva",
    email: "joao.silva@igreja.com.br",
    language_preference: "pt",
    contact_id: "c1",
    created_at: "2020-01-15T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    user_roles: [
      { id: "1", name: "Admin", description: "Full system access", key_code: "ADMIN" }
    ],
    institution_name: "Igreja Adventista do Sétimo Dia - Brasil",
    church_name: "Igreja Central de São Paulo",
    region_name: "São Paulo",
    department_name: "Evangelism"
  },
  {
    id: "u2",
    institution_id: "1",
    church_id: "ch1",
    region_id: "r1",
    name: "Maria Santos",
    email: "maria.santos@igreja.com.br",
    language_preference: "pt",
    contact_id: "c2",
    created_at: "2021-03-20T09:15:00Z",
    updated_at: "2024-01-10T16:45:00Z",
    created_by: "u1",
    updated_by: "u1",
    is_deleted: false,
    user_roles: [
      { id: "2", name: "Church Leader", description: "Church management access", key_code: "CHURCH_LEADER" }
    ],
    institution_name: "Igreja Adventista do Sétimo Dia - Brasil",
    church_name: "Igreja Central de São Paulo",
    region_name: "São Paulo"
  },
  {
    id: "u3",
    institution_id: "2",
    church_id: "ch3",
    region_id: "r3",
    department_id: "d4",
    name: "John Smith",
    email: "john.smith@church.org",
    language_preference: "en",
    contact_id: "c3",
    created_at: "2019-06-10T14:30:00Z",
    updated_at: "2024-01-05T11:20:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    user_roles: [
      { id: "2", name: "Church Leader", description: "Church management access", key_code: "CHURCH_LEADER" },
      { id: "4", name: "Evangelism Leader", description: "Evangelism activities management", key_code: "EVANGELISM_LEADER" }
    ],
    institution_name: "Seventh-day Adventist Church - USA",
    church_name: "New York Central Church",
    region_name: "Northeast",
    department_name: "Youth Ministry"
  },
  {
    id: "u4",
    institution_id: "2",
    church_id: "ch4",
    region_id: "r4",
    name: "Sarah Johnson",
    email: "sarah.johnson@church.org",
    language_preference: "en",
    contact_id: "c4",
    created_at: "2022-08-15T13:45:00Z",
    updated_at: "2024-01-12T09:30:00Z",
    created_by: "u3",
    updated_by: "u3",
    is_deleted: false,
    user_roles: [
      { id: "3", name: "Financial Officer", description: "Financial management access", key_code: "FINANCIAL_OFFICER" }
    ],
    institution_name: "Seventh-day Adventist Church - USA",
    church_name: "Los Angeles Church",
    region_name: "West Coast"
  },
  {
    id: "u5",
    institution_id: "3",
    church_id: "ch5",
    region_id: "r5",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@iglesia.es",
    language_preference: "es",
    contact_id: "c5",
    created_at: "2021-11-25T16:20:00Z",
    updated_at: "2023-12-20T14:15:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    user_roles: [
      { id: "6", name: "Regional Coordinator", description: "Regional oversight access", key_code: "REGIONAL_COORDINATOR" }
    ],
    institution_name: "Iglesia Adventista del Séptimo Día - España",
    church_name: "Iglesia Central Madrid",
    region_name: "Madrid"
  },
  {
    id: "u6",
    institution_id: "1",
    church_id: "ch2",
    region_id: "r2",
    name: "Ana Oliveira",
    email: "ana.oliveira@igreja.com.br",
    language_preference: "pt",
    contact_id: "c6",
    created_at: "2023-02-10T11:30:00Z",
    updated_at: "2024-01-08T15:45:00Z",
    created_by: "u1",
    updated_by: "u1",
    is_deleted: false,
    user_roles: [
      { id: "5", name: "Member", description: "Basic member access", key_code: "MEMBER" }
    ],
    institution_name: "Igreja Adventista do Sétimo Dia - Brasil",
    church_name: "Igreja do Rio de Janeiro",
    region_name: "Rio de Janeiro"
  },
  {
    id: "u7",
    institution_id: "2",
    church_id: "ch3",
    region_id: "r3",
    name: "Michael Davis",
    email: "michael.davis@church.org",
    language_preference: "en",
    contact_id: "c7",
    created_at: "2023-05-18T08:15:00Z",
    updated_at: "2023-11-30T12:00:00Z",
    created_by: "u3",
    updated_by: "u3",
    is_deleted: true, // Inactive user
    user_roles: [
      { id: "5", name: "Member", description: "Basic member access", key_code: "MEMBER" }
    ],
    institution_name: "Seventh-day Adventist Church - USA",
    church_name: "New York Central Church",
    region_name: "Northeast"
  },
  {
    id: "u8",
    institution_id: "3",
    church_id: "ch6",
    region_id: "r6",
    name: "Isabella Martinez",
    email: "isabella.martinez@iglesia.es",
    language_preference: "es",
    contact_id: "c8",
    created_at: "2023-09-12T15:30:00Z",
    updated_at: "2024-01-14T10:20:00Z",
    created_by: "u5",
    updated_by: "u5",
    is_deleted: false,
    user_roles: [
      { id: "4", name: "Evangelism Leader", description: "Evangelism activities management", key_code: "EVANGELISM_LEADER" }
    ],
    institution_name: "Iglesia Adventista del Séptimo Día - España",
    church_name: "Iglesia Barcelona",
    region_name: "Cataluña"
  }
]

// Analytics Functions
export const getUsersKPIs = () => {
  const totalUsers = users.length
  const activeUsers = users.filter(u => !u.is_deleted).length
  const inactiveUsers = users.filter(u => u.is_deleted).length
  
  // Users created in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const newUsersThisMonth = users.filter(u => 
    new Date(u.created_at) >= thirtyDaysAgo
  ).length

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    newUsersThisMonth
  }
}

export const getUsersByRole = () => {
  const roleCount: { [key: string]: number } = {}
  
  users.forEach(user => {
    user.user_roles.forEach(role => {
      roleCount[role.name] = (roleCount[role.name] || 0) + 1
    })
  })

  return Object.entries(roleCount).map(([role, users]) => ({
    role,
    users
  }))
}

export const getUsersByInstitution = () => {
  const institutionCount: { [key: string]: number } = {}
  
  users.forEach(user => {
    const institution = user.institution_name || 'Unknown'
    institutionCount[institution] = (institutionCount[institution] || 0) + 1
  })

  return Object.entries(institutionCount).map(([institution, users]) => ({
    institution: institution.length > 30 ? institution.substring(0, 30) + '...' : institution,
    users
  }))
}

export const getUsersByRegion = () => {
  const regionCount: { [key: string]: number } = {}
  
  users.forEach(user => {
    const region = user.region_name || 'Unknown'
    regionCount[region] = (regionCount[region] || 0) + 1
  })

  return Object.entries(regionCount).map(([region, users]) => ({
    region,
    users
  }))
}

export const getUserGrowthOverTime = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  // Simulate growth data
  return months.map((month, index) => {
    const baseUsers = 45 + (index * 8)
    const activeUsers = Math.floor(baseUsers * 0.9)
    
    return {
      month,
      total: baseUsers + Math.floor(Math.random() * 10),
      active: activeUsers + Math.floor(Math.random() * 5)
    }
  })
}

export const getUsersByDepartment = () => {
  const departmentCount: { [key: string]: number } = {}
  
  users.forEach(user => {
    const department = user.department_name || 'No Department'
    departmentCount[department] = (departmentCount[department] || 0) + 1
  })

  return Object.entries(departmentCount).map(([department, users]) => ({
    department,
    users
  }))
}

// Language distribution
export const getUsersByLanguage = () => {
  const languageCount: { [key: string]: number } = {}
  
  users.forEach(user => {
    const lang = user.language_preference.toUpperCase()
    languageCount[lang] = (languageCount[lang] || 0) + 1
  })

  return Object.entries(languageCount).map(([language, users]) => ({
    language,
    users
  }))
}

// User status over time
export const getUserStatusOverTime = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  
  return months.map((month, index) => ({
    month,
    active: 45 + (index * 3) + Math.floor(Math.random() * 5),
    inactive: 5 + Math.floor(Math.random() * 3),
    new: 8 + Math.floor(Math.random() * 4)
  }))
}

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id)
}

export const getUsersByInstitutionId = (institutionId: string): User[] => {
  return users.filter(user => user.institution_id === institutionId)
}

export const getUsersByChurchId = (churchId: string): User[] => {
  return users.filter(user => user.church_id === churchId)
}

export const getUsersByRoleId = (roleId: string): User[] => {
  return users.filter(user => 
    user.user_roles.some(role => role.id === roleId)
  )
}

export const getActiveUsers = (): User[] => {
  return users.filter(user => !user.is_deleted)
}

export const getInactiveUsers = (): User[] => {
  return users.filter(user => user.is_deleted)
}

// Mock Subsidy Requests
export const subsidyRequests: SubsidyRequest[] = [
  {
    id: "sr1",
    institution_id: "1",
    requester_id: "u1",
    department_project_id: "d1",
    church_id: "ch1",
    description: "Evangelism campaign materials",
    total_budget: 5000,
    status: "approved",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    created_by: "u1",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "sr2",
    institution_id: "1",
    requester_id: "u2",
    department_project_id: "d2",
    church_id: "ch1",
    description: "Youth ministry equipment",
    total_budget: 3000,
    status: "pending",
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T09:00:00Z",
    created_by: "u2",
    updated_by: "u2",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Events
export const events: Event[] = [
  {
    id: "e1",
    target_type: "church",
    target_id: "ch1",
    title: "Evangelism Conference 2024",
    description: "Annual evangelism training conference",
    contact_id: "c30",
    type: "evangelism",
    language_preference: "en",
    max_participants: 200,
    ticket_amount: 50,
    subscription_expires_at: "2024-03-01T23:59:59Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    created_by: "u1",
    updated_by: "u1",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "e2",
    target_type: "region",
    target_id: "r1",
    title: "Regional Youth Show",
    description: "Musical and cultural presentations",
    contact_id: "c31",
    type: "show",
    language_preference: "en",
    max_participants: 500,
    ticket_amount: 25,
    subscription_expires_at: "2024-04-01T23:59:59Z",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
    created_by: "u2",
    updated_by: "u2",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Event Registrations
export const eventRegistrations: EventRegistration[] = [
  {
    id: "er1",
    user_id: "u1",
    event_id: "e1",
    status: "approved",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-10T15:00:00Z",
    created_by: "u1",
    updated_by: "admin",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: "er2",
    user_id: "u2",
    event_id: "e2",
    status: "paid",
    created_at: "2024-02-05T14:00:00Z",
    updated_at: "2024-02-08T10:00:00Z",
    created_by: "u2",
    updated_by: "u2",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Communications
export const communications: Communication[] = [
  {
    id: "c1",
    institution_id: "1",
    title: "Weekly Church Announcement",
    content: "Important updates for this week's activities",
    type: "announcement",
    priority: "normal",
    status: "published",
    language_preference: "en",
    schedule_at: "2024-01-15T08:00:00Z",
    published_at: "2024-01-15T08:00:00Z",
    author_id: "u1",
    created_at: "2024-01-14T16:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    created_by: "u1",
    updated_by: "u1",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Mock Annual Reports
export const annualReports: AnnualReport[] = [
  {
    id: "ar1",
    department_id: "d1",
    text: "Annual evangelism department report for 2023",
    file_path: "/reports/evangelism-2023.pdf",
    submission_date: "2024-01-31T23:59:59Z",
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-30T15:00:00Z",
    created_by: "u1",
    updated_by: "u1",
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }
]

// Helper functions for user-specific data
export const getUserSubsidyRequests = (userId: string): SubsidyRequest[] => {
  return subsidyRequests.filter(sr => sr.requester_id === userId && !sr.is_deleted)
}

export const getUserEventRegistrations = (userId: string): (EventRegistration & { event: Event })[] => {
  return eventRegistrations
    .filter(er => er.user_id === userId && !er.is_deleted)
    .map(er => ({
      ...er,
      event: events.find(e => e.id === er.event_id)!
    }))
    .filter(er => er.event)
}

export const getUserCommunications = (userId: string): Communication[] => {
  // Get communications authored by user or targeted to their institution/church
  const user = getUserById(userId)
  if (!user) return []
  
  return communications.filter(c => 
    (c.author_id === userId || c.institution_id === user.institution_id) && !c.is_deleted
  )
}

export const getUserAnnualReports = (userId: string): AnnualReport[] => {
  const user = getUserById(userId)
  if (!user || !user.department_id) return []
  
  return annualReports.filter(ar => 
    ar.department_id === user.department_id && ar.created_by === userId && !ar.is_deleted
  )
}

export const getUserStats = (userId: string) => {
  const subsidies = getUserSubsidyRequests(userId)
  const events = getUserEventRegistrations(userId)
  const communications = getUserCommunications(userId)
  const reports = getUserAnnualReports(userId)
  
  return {
    totalSubsidies: subsidies.length,
    approvedSubsidies: subsidies.filter(s => s.status === 'approved').length,
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.event.subscription_expires_at) > new Date()).length,
    totalCommunications: communications.length,
    totalReports: reports.length
  }
}

// Temporal analytics functions
export const getUserSubsidyTrends = (userId: string, months: number = 12) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const trends = []
  
  for (let i = 0; i < months; i++) {
    const currentDate = new Date(startDate)
    currentDate.setMonth(startDate.getMonth() + i)
    
    const monthKey = monthNames[currentDate.getMonth()]
    
    // Simulate subsidy data based on user activity
    const baseSubsidies = userId === 'u1' ? 2 : 1
    const requested = Math.floor(Math.random() * 3) + baseSubsidies
    const approved = Math.floor(requested * 0.7)
    const totalAmount = requested * (2000 + Math.floor(Math.random() * 3000))
    
    trends.push({
      month: monthKey,
      requested,
      approved,
      rejected: requested - approved,
      totalAmount
    })
  }
  
  return trends
}

export const getUserEventTrends = (userId: string, months: number = 12) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const trends = []
  
  for (let i = 0; i < months; i++) {
    const currentDate = new Date(startDate)
    currentDate.setMonth(startDate.getMonth() + i)
    
    const monthKey = monthNames[currentDate.getMonth()]
    
    // Simulate event data
    const registered = Math.floor(Math.random() * 4) + 1
    const attended = Math.floor(registered * 0.8)
    const created = userId === 'u1' || userId === 'u2' ? Math.floor(Math.random() * 2) : 0
    
    trends.push({
      month: monthKey,
      registered,
      attended,
      created,
      missed: registered - attended
    })
  }
  
  return trends
}

export const getUserReportTrends = (userId: string, months: number = 12) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const trends = []
  
  for (let i = 0; i < months; i++) {
    const currentDate = new Date(startDate)
    currentDate.setMonth(startDate.getMonth() + i)
    
    const monthKey = monthNames[currentDate.getMonth()]
    
    // Reports are typically quarterly or annual
    const isQuarterMonth = (i + 1) % 3 === 0
    const submitted = isQuarterMonth ? Math.floor(Math.random() * 2) + 1 : 0
    const approved = Math.floor(submitted * 0.9)
    
    trends.push({
      month: monthKey,
      submitted,
      approved,
      pending: submitted - approved
    })
  }
  
  return trends
}

export const getUserCommunicationTrends = (userId: string, months: number = 12) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const trends = []
  
  for (let i = 0; i < months; i++) {
    const currentDate = new Date(startDate)
    currentDate.setMonth(startDate.getMonth() + i)
    
    const monthKey = monthNames[currentDate.getMonth()]
    
    // Simulate communication activity
    const sent = Math.floor(Math.random() * 5) + 1
    const received = Math.floor(Math.random() * 8) + 2
    const authored = userId === 'u1' ? Math.floor(Math.random() * 3) : 0
    
    trends.push({
      month: monthKey,
      sent,
      received,
      authored,
      total: sent + received + authored
    })
  }
  
  return trends
}

// Export all data for easy access
export {
  users as allUsers,
  roles as allRoles,
  institutions as allInstitutions,
  churches as allChurches,
  regions as allRegions,
  departments as allDepartments,
  subsidyRequests as allSubsidyRequests,
  events as allEvents,
  eventRegistrations as allEventRegistrations,
  communications as allCommunications,
  annualReports as allAnnualReports
}
