// Mock data for Access Management page
// Based on the provided API structure

export interface Permission {
  id: string
  name: string
  description: string
  key_code: string
  group: string
}

export interface Role {
  id: string
  name: string
  description: string
  key_code: string
  permissions: {
    group: string
    data: Permission[]
  }[]
}

export interface UserRole {
  id: string
  name: string
  description: string
  key_code: string
  permissions: {
    group: string
    data: Permission[]
  }[]
}

export interface User {
  id: string
  institution_id: string
  church_id: string
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
}

export interface Contact {
  id: string
  country: string
  city: string
  address: string
  phone: string
  email: string
  website?: string
}

export interface Institution {
  id: string
  name: string
  contact_id: string
}

export interface Church {
  id: string
  name: string
  institution_id: string
  region_id: string
}

// Mock Permissions Data
export const permissions: Permission[] = [
  // USER permissions
  { id: "b1b78103-6454-499b-ba1d-c8349f09468f", name: "List users", description: "Allows listing all users", key_code: "LIST_USERS", group: "USER" },
  { id: "b1750bbe-d1e0-4f94-83e8-fc604650a4af", name: "Get user", description: "Allows fetching a specific user", key_code: "READ_USER", group: "USER" },
  { id: "bad58f7b-67c4-4b0b-bba5-9e8e4c23e626", name: "Create user", description: "Allows creating a user", key_code: "CREATE_USER", group: "USER" },
  { id: "2eb6bfdb-58ed-4312-a524-44daf74bf688", name: "Update user", description: "Allows updating a user", key_code: "UPDATE_USER", group: "USER" },
  { id: "07a89431-a4de-494b-9f9e-54cab8cc7d22", name: "Delete user", description: "Allows soft deleting a user", key_code: "DELETE_USER", group: "USER" },
  
  // ROLE permissions
  { id: "4f83be1e-80ab-4666-8324-27915b9f662b", name: "List roles", description: "Allows listing all roles", key_code: "LIST_ROLES", group: "ROLE" },
  { id: "40ca8ca4-a64e-4c72-8944-d5f29cc6dfe7", name: "Get role", description: "Allows fetching a specific role", key_code: "READ_ROLE", group: "ROLE" },
  { id: "8b64d9f9-0a8b-43c0-adb4-05ff1cff96e5", name: "Create role", description: "Allows creating a role", key_code: "CREATE_ROLE", group: "ROLE" },
  { id: "2159171c-8817-4f5c-bd0f-2c00f0047a98", name: "Update role", description: "Allows updating a role", key_code: "UPDATE_ROLE", group: "ROLE" },
  { id: "f2f51a77-df93-43a4-9697-556fbc3ecd61", name: "Delete role", description: "Allows soft deleting a role", key_code: "DELETE_ROLE", group: "ROLE" },
  
  // PERMISSION permissions
  { id: "2902dd63-7f9a-42fb-a648-556bc351391f", name: "List permissions", description: "Allows listing all permissions", key_code: "LIST_PERMISSIONS", group: "PERMISSION" },
  { id: "3902dd63-7f9a-42fb-a648-556bc351391f", name: "Get permission", description: "Allows fetching a specific permission", key_code: "READ_PERMISSION", group: "PERMISSION" },
  { id: "4902dd63-7f9a-42fb-a648-556bc351391f", name: "Create permission", description: "Allows creating a permission", key_code: "CREATE_PERMISSION", group: "PERMISSION" },
  { id: "5902dd63-7f9a-42fb-a648-556bc351391f", name: "Update permission", description: "Allows updating a permission", key_code: "UPDATE_PERMISSION", group: "PERMISSION" },
  { id: "6902dd63-7f9a-42fb-a648-556bc351391f", name: "Delete permission", description: "Allows soft deleting a permission", key_code: "DELETE_PERMISSION", group: "PERMISSION" },
  
  // INSTITUTION permissions
  { id: "e6ce1a22-74c5-40ce-a340-d678615c5c27", name: "Create institution", description: "Allows creating an institution", key_code: "CREATE_INSTITUTION", group: "INSTITUTION" },
  { id: "77b8ca93-cddc-4a09-81cc-6a2a84cbd91e", name: "List institutions", description: "Allows listing all institutions", key_code: "LIST_INSTITUTIONS", group: "INSTITUTION" },
  { id: "e2adfadb-6249-459e-a6f9-f051110bb822", name: "Get institution", description: "Allows fetching a specific institution", key_code: "READ_INSTITUTION", group: "INSTITUTION" },
  { id: "6a9ed534-3511-4b61-a1d2-414ff52f4406", name: "Update institution", description: "Allows updating an institution", key_code: "UPDATE_INSTITUTION", group: "INSTITUTION" },
  { id: "cd6655c6-84e0-4c2b-8fc6-54fa253bc945", name: "Delete institution", description: "Allows soft deleting an institution", key_code: "DELETE_INSTITUTION", group: "INSTITUTION" },
  
  // REGION permissions
  { id: "ef92760e-04bc-4be1-bc25-6fcae022d28c", name: "List regions", description: "Allows listing all regions", key_code: "LIST_REGIONS", group: "REGION" },
  { id: "c3260fd7-1339-4805-8bb8-3f5310c0df40", name: "Get region", description: "Allows fetching a specific region", key_code: "READ_REGION", group: "REGION" },
  { id: "27f3c6a0-ea9f-4245-9f68-b86708e95a0f", name: "Create region", description: "Allows creating a region", key_code: "CREATE_REGION", group: "REGION" },
  { id: "32bd597b-1504-4887-b121-b5c122b06512", name: "Update region", description: "Allows updating a region", key_code: "UPDATE_REGION", group: "REGION" },
  { id: "c9b82b88-28ef-4ef9-bd9c-cc132d5d4058", name: "Delete region", description: "Allows soft deleting a region", key_code: "DELETE_REGION", group: "REGION" },
  
  // CHURCH permissions
  { id: "999a9763-d802-4b4e-9aee-c5f069d35ed2", name: "List churches", description: "Allows listing all churches", key_code: "LIST_CHURCHES", group: "CHURCH" },
  { id: "31917d86-e4db-4370-b2cc-aa4a62459d72", name: "Get church", description: "Allows fetching a specific church", key_code: "READ_CHURCH", group: "CHURCH" },
  { id: "591670da-3213-4208-871f-5ac9745d71a2", name: "Create church", description: "Allows creating a church", key_code: "CREATE_CHURCH", group: "CHURCH" },
  { id: "10cd93e6-e0e0-4c1c-8d69-e664d3b1c383", name: "Update church", description: "Allows updating a church", key_code: "UPDATE_CHURCH", group: "CHURCH" },
  { id: "fe84915e-e35a-484a-bf28-55b10f747240", name: "Delete church", description: "Allows soft deleting a church", key_code: "DELETE_CHURCH", group: "CHURCH" },
]

// Mock Roles Data
export const roles: Role[] = [
  {
    id: "1d603f65-9cf7-4e31-8610-acc4695310dc",
    name: "Admin",
    description: "Allow admin full access",
    key_code: "ADMIN",
    permissions: [
      {
        group: "USER",
        data: permissions.filter(p => p.group === "USER")
      },
      {
        group: "ROLE",
        data: permissions.filter(p => p.group === "ROLE")
      },
      {
        group: "PERMISSION",
        data: permissions.filter(p => p.group === "PERMISSION")
      },
      {
        group: "INSTITUTION",
        data: permissions.filter(p => p.group === "INSTITUTION")
      },
      {
        group: "REGION",
        data: permissions.filter(p => p.group === "REGION")
      },
      {
        group: "CHURCH",
        data: permissions.filter(p => p.group === "CHURCH")
      }
    ]
  },
  {
    id: "2d603f65-9cf7-4e31-8610-acc4695310dc",
    name: "Manager",
    description: "Institution and church management access",
    key_code: "MANAGER",
    permissions: [
      {
        group: "USER",
        data: permissions.filter(p => p.group === "USER" && !p.key_code.includes("DELETE"))
      },
      {
        group: "INSTITUTION",
        data: permissions.filter(p => p.group === "INSTITUTION" && ["LIST_INSTITUTIONS", "READ_INSTITUTION", "UPDATE_INSTITUTION"].includes(p.key_code))
      },
      {
        group: "REGION",
        data: permissions.filter(p => p.group === "REGION")
      },
      {
        group: "CHURCH",
        data: permissions.filter(p => p.group === "CHURCH")
      }
    ]
  },
  {
    id: "3d603f65-9cf7-4e31-8610-acc4695310dc",
    name: "Editor",
    description: "Content editing and basic management",
    key_code: "EDITOR",
    permissions: [
      {
        group: "USER",
        data: permissions.filter(p => p.group === "USER" && ["LIST_USERS", "READ_USER"].includes(p.key_code))
      },
      {
        group: "CHURCH",
        data: permissions.filter(p => p.group === "CHURCH" && !p.key_code.includes("DELETE"))
      }
    ]
  },
  {
    id: "4d603f65-9cf7-4e31-8610-acc4695310dc",
    name: "Viewer",
    description: "Read-only access to system",
    key_code: "VIEWER",
    permissions: [
      {
        group: "USER",
        data: permissions.filter(p => p.group === "USER" && ["LIST_USERS", "READ_USER"].includes(p.key_code))
      },
      {
        group: "INSTITUTION",
        data: permissions.filter(p => p.group === "INSTITUTION" && ["LIST_INSTITUTIONS", "READ_INSTITUTION"].includes(p.key_code))
      },
      {
        group: "REGION",
        data: permissions.filter(p => p.group === "REGION" && ["LIST_REGIONS", "READ_REGION"].includes(p.key_code))
      },
      {
        group: "CHURCH",
        data: permissions.filter(p => p.group === "CHURCH" && ["LIST_CHURCHES", "READ_CHURCH"].includes(p.key_code))
      }
    ]
  }
]

// Mock Institutions Data
export const institutions: Institution[] = [
  { id: "69b314b7-7538-4b83-b4e5-526f5431869f", name: "CGI Netherlands", contact_id: "11d8aa11-d138-495b-ac92-2530c25bd620" },
  { id: "79b314b7-7538-4b83-b4e5-526f5431869f", name: "União Sul-Paulista", contact_id: "21d8aa11-d138-495b-ac92-2530c25bd620" },
  { id: "89b314b7-7538-4b83-b4e5-526f5431869f", name: "União Central Brasileira", contact_id: "31d8aa11-d138-495b-ac92-2530c25bd620" },
  { id: "99b314b7-7538-4b83-b4e5-526f5431869f", name: "North American Division", contact_id: "41d8aa11-d138-495b-ac92-2530c25bd620" }
]

// Mock Churches Data
export const churches: Church[] = [
  { id: "00416da6-c318-4a22-b1a1-bb484a4abebf", name: "Amsterdam Central Church", institution_id: "69b314b7-7538-4b83-b4e5-526f5431869f", region_id: "r1" },
  { id: "10416da6-c318-4a22-b1a1-bb484a4abebf", name: "Igreja Central de São Paulo", institution_id: "79b314b7-7538-4b83-b4e5-526f5431869f", region_id: "r2" },
  { id: "20416da6-c318-4a22-b1a1-bb484a4abebf", name: "Igreja de Brasília", institution_id: "89b314b7-7538-4b83-b4e5-526f5431869f", region_id: "r3" },
  { id: "30416da6-c318-4a22-b1a1-bb484a4abebf", name: "New York Central Church", institution_id: "99b314b7-7538-4b83-b4e5-526f5431869f", region_id: "r4" }
]

// Mock Users Data
export const users: User[] = [
  {
    id: "7f6af8e2-ce9b-4152-8a79-4b61d4a0b502",
    institution_id: "69b314b7-7538-4b83-b4e5-526f5431869f",
    church_id: "00416da6-c318-4a22-b1a1-bb484a4abebf",
    name: "Admin User",
    email: "admin@mail.com",
    language_preference: "en",
    contact_id: "11d8aa11-d138-495b-ac92-2530c25bd620",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-08-27T10:30:00Z",
    created_by: "self",
    updated_by: "self",
    is_deleted: false,
    institution_name: "CGI Netherlands",
    church_name: "Amsterdam Central Church",
    user_roles: [roles[0] as UserRole]
  },
  {
    id: "8f6af8e2-ce9b-4152-8a79-4b61d4a0b502",
    institution_id: "79b314b7-7538-4b83-b4e5-526f5431869f",
    church_id: "10416da6-c318-4a22-b1a1-bb484a4abebf",
    name: "João Silva",
    email: "joao@usp.org.br",
    language_preference: "pt",
    contact_id: "21d8aa11-d138-495b-ac92-2530c25bd620",
    created_at: "2024-02-20T14:15:00Z",
    updated_at: "2024-08-26T15:20:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    institution_name: "União Sul-Paulista",
    church_name: "Igreja Central de São Paulo",
    user_roles: [roles[1] as UserRole]
  },
  {
    id: "9f6af8e2-ce9b-4152-8a79-4b61d4a0b502",
    institution_id: "89b314b7-7538-4b83-b4e5-526f5431869f",
    church_id: "20416da6-c318-4a22-b1a1-bb484a4abebf",
    name: "Pedro Costa",
    email: "pedro@ucb.org.br",
    language_preference: "pt",
    contact_id: "31d8aa11-d138-495b-ac92-2530c25bd620",
    created_at: "2024-03-10T09:45:00Z",
    updated_at: "2024-08-25T09:45:00Z",
    created_by: "admin",
    updated_by: "joao",
    is_deleted: false,
    institution_name: "União Central Brasileira",
    church_name: "Igreja de Brasília",
    user_roles: [roles[2] as UserRole]
  },
  {
    id: "af6af8e2-ce9b-4152-8a79-4b61d4a0b502",
    institution_id: "99b314b7-7538-4b83-b4e5-526f5431869f",
    church_id: "30416da6-c318-4a22-b1a1-bb484a4abebf",
    name: "John Smith",
    email: "john@nad.org",
    language_preference: "en",
    contact_id: "41d8aa11-d138-495b-ac92-2530c25bd620",
    created_at: "2024-04-05T16:30:00Z",
    updated_at: "2024-08-21T08:30:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    institution_name: "North American Division",
    church_name: "New York Central Church",
    user_roles: [roles[3] as UserRole]
  },
  {
    id: "bf6af8e2-ce9b-4152-8a79-4b61d4a0b502",
    institution_id: "69b314b7-7538-4b83-b4e5-526f5431869f",
    church_id: "00416da6-c318-4a22-b1a1-bb484a4abebf",
    name: "Maria van der Berg",
    email: "maria@cgi.nl",
    language_preference: "nl",
    contact_id: "11d8aa11-d138-495b-ac92-2530c25bd620",
    created_at: "2024-05-12T11:20:00Z",
    updated_at: "2024-08-27T10:30:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false,
    institution_name: "CGI Netherlands",
    church_name: "Amsterdam Central Church",
    user_roles: [roles[2] as UserRole]
  },
  {
    id: "cf6af8e2-ce9b-4152-8a79-4b61d4a0b502",
    institution_id: "79b314b7-7538-4b83-b4e5-526f5431869f",
    church_id: "10416da6-c318-4a22-b1a1-bb484a4abebf",
    name: "Ana Santos",
    email: "ana@usp.org.br",
    language_preference: "pt",
    contact_id: "21d8aa11-d138-495b-ac92-2530c25bd620",
    created_at: "2024-06-18T13:45:00Z",
    updated_at: "2024-08-26T15:20:00Z",
    created_by: "joao",
    updated_by: "joao",
    is_deleted: false,
    institution_name: "União Sul-Paulista",
    church_name: "Igreja Central de São Paulo",
    user_roles: [roles[3] as UserRole]
  }
]

// Helper functions for data aggregation
export const getAccessKPIs = () => {
  const totalUsers = users.filter(u => !u.is_deleted).length
  const totalRoles = roles.length
  const totalPermissions = permissions.length
  const activeUsers = users.filter(u => !u.is_deleted && new Date(u.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  
  return {
    totalUsers,
    totalRoles,
    totalPermissions,
    activeUsers,
    userGrowthRate: Math.round((activeUsers / totalUsers) * 100),
    adminUsers: users.filter(u => u.user_roles.some(r => r.key_code === 'ADMIN')).length
  }
}

// Role distribution for pie chart
export const getRoleDistribution = () => {
  const roleCount = roles.map(role => {
    const userCount = users.filter(user => 
      user.user_roles.some(userRole => userRole.id === role.id)
    ).length
    
    return {
      name: role.name,
      value: userCount,
      color: getRoleColor(role.key_code)
    }
  }).filter(item => item.value > 0)
  
  return roleCount
}

// Permissions by group for bar chart
export const getPermissionsByGroup = () => {
  const groups = ['USER', 'ROLE', 'PERMISSION', 'INSTITUTION', 'REGION', 'CHURCH']
  
  return groups.map(group => ({
    group,
    permissions: permissions.filter(p => p.group === group).length,
    color: getGroupColor(group)
  }))
}

// User activity over time for line chart
export const getUserActivityOverTime = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  return months.map((month, index) => {
    const monthUsers = users.filter(user => {
      const date = new Date(user.created_at)
      return date.getMonth() === index && date.getFullYear() === 2024
    })
    
    const roleAssignments = users.filter(user => {
      const date = new Date(user.updated_at)
      return date.getMonth() === index && date.getFullYear() === 2024
    })
    
    return {
      month,
      newUsers: monthUsers.length,
      roleAssignments: roleAssignments.length,
      totalActivity: monthUsers.length + roleAssignments.length
    }
  })
}

// Helper function for role colors
const getRoleColor = (roleCode: string): string => {
  const colors: { [key: string]: string } = {
    'ADMIN': '#ef4444',
    'MANAGER': '#f59e0b',
    'EDITOR': '#3b82f6',
    'VIEWER': '#10b981'
  }
  return colors[roleCode] || '#6b7280'
}

// Helper function for group colors
const getGroupColor = (group: string): string => {
  const colors: { [key: string]: string } = {
    'USER': '#3b82f6',
    'ROLE': '#10b981',
    'PERMISSION': '#f59e0b',
    'INSTITUTION': '#8b5cf6',
    'REGION': '#ef4444',
    'CHURCH': '#06b6d4'
  }
  return colors[group] || '#6b7280'
}

// Permission groups for organization
export const permissionGroups = [
  {
    name: 'USER',
    label: 'User Management',
    description: 'Manage users and their access',
    permissions: permissions.filter(p => p.group === 'USER')
  },
  {
    name: 'ROLE',
    label: 'Role Management',
    description: 'Manage roles and assignments',
    permissions: permissions.filter(p => p.group === 'ROLE')
  },
  {
    name: 'PERMISSION',
    label: 'Permission Management',
    description: 'Manage system permissions',
    permissions: permissions.filter(p => p.group === 'PERMISSION')
  },
  {
    name: 'INSTITUTION',
    label: 'Institution Management',
    description: 'Manage institutions and settings',
    permissions: permissions.filter(p => p.group === 'INSTITUTION')
  },
  {
    name: 'REGION',
    label: 'Region Management',
    description: 'Manage regions and territories',
    permissions: permissions.filter(p => p.group === 'REGION')
  },
  {
    name: 'CHURCH',
    label: 'Church Management',
    description: 'Manage churches and congregations',
    permissions: permissions.filter(p => p.group === 'CHURCH')
  }
]

// Permission checker helper
export const hasPermission = (userPermissions: Permission[], requiredPermission: string): boolean => {
  return userPermissions.some(permission => permission.key_code === requiredPermission)
}

// Get user permissions flattened
export const getUserPermissions = (user: User): Permission[] => {
  const allPermissions: Permission[] = []
  
  user.user_roles.forEach(role => {
    role.permissions.forEach(permissionGroup => {
      allPermissions.push(...permissionGroup.data)
    })
  })
  
  return allPermissions
}

// Current user (simulated admin user for demo)
export const currentUser = users[0]
