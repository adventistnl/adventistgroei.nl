/**
 * Privacy Role Configuration
 * 
 * Central configuration file for privacy roles and permissions
 * Easy to customize and extend
 */

import { PrivacyLevel } from '@/contexts/privacy-context'

/**
 * Privacy Role Definitions
 * Add your custom roles here
 */
export const PRIVACY_ROLES = {
  // Developer - Full access (testing and development)
  DEV: {
    key: 'admin' as const,
    label: 'Developer',
    description: 'Full access to all privacy controls',
    authRoles: ['DEV', 'DEVELOPER', 'DEV_ADMIN'],
    accessLevels: ['public', 'internal', 'confidential', 'restricted'] as PrivacyLevel[]
  },
  
  // Administrator - Full access
  ADMIN: {
    key: 'admin' as const,
    label: 'Administrator',
    description: 'Full access to all privacy controls',
    authRoles: ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'ADMINISTRATOR'],
    accessLevels: ['public', 'internal', 'confidential', 'restricted'] as PrivacyLevel[]
  },
  
  // Finance Manager - Financial data access
  FINANCE_MANAGER: {
    key: 'finance_manager' as const,
    label: 'Finance Manager',
    description: 'Access to financial and confidential data',
    authRoles: ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'FINANCIAL_MANAGER', 'CFO'],
    accessLevels: ['public', 'internal', 'confidential'] as PrivacyLevel[]
  },
  
  // Department Head - Department data access
  DEPARTMENT_HEAD: {
    key: 'department_head' as const,
    label: 'Department Head',
    description: 'Access to department and internal data',
    authRoles: ['DEPARTMENT_MANAGER', 'DEPARTMENT_HEAD', 'DEPT_MANAGER', 'MANAGER'],
    accessLevels: ['public', 'internal'] as PrivacyLevel[]
  },
  
  // User - Basic access
  USER: {
    key: 'user' as const,
    label: 'User',
    description: 'Access to public data only',
    authRoles: ['EMPLOYEE', 'USER', 'MEMBER', 'STAFF'],
    accessLevels: ['public'] as PrivacyLevel[]
  },
  
  // Guest - No privacy access
  GUEST: {
    key: 'guest' as const,
    label: 'Guest',
    description: 'No privacy control access',
    authRoles: ['VIEWER', 'GUEST', 'READ_ONLY'],
    accessLevels: [] as PrivacyLevel[]
  }
} as const

/**
 * Quick Access Role Arrays
 * Use these for common configurations
 */
export const PRIVACY_ROLE_GROUPS = {
  // All roles that can access admin features
  ADMIN_ROLES: [
    ...PRIVACY_ROLES.DEV.authRoles,
    ...PRIVACY_ROLES.ADMIN.authRoles
  ] as string[],
  
  // All roles that can access financial data
  FINANCIAL_ROLES: [
    ...PRIVACY_ROLES.DEV.authRoles,
    ...PRIVACY_ROLES.ADMIN.authRoles,
    ...PRIVACY_ROLES.FINANCE_MANAGER.authRoles
  ] as string[],
  
  // All roles that can access department data
  DEPARTMENT_ROLES: [
    ...PRIVACY_ROLES.DEV.authRoles,
    ...PRIVACY_ROLES.ADMIN.authRoles,
    ...PRIVACY_ROLES.FINANCE_MANAGER.authRoles,
    ...PRIVACY_ROLES.DEPARTMENT_HEAD.authRoles
  ] as string[],
  
  // All authenticated users
  AUTHENTICATED_ROLES: [
    ...PRIVACY_ROLES.DEV.authRoles,
    ...PRIVACY_ROLES.ADMIN.authRoles,
    ...PRIVACY_ROLES.FINANCE_MANAGER.authRoles,
    ...PRIVACY_ROLES.DEPARTMENT_HEAD.authRoles,
    ...PRIVACY_ROLES.USER.authRoles
  ] as string[]
} as const

/**
 * Privacy Configuration Presets
 * Ready-to-use configurations for common scenarios
 */
export const PRIVACY_PRESETS = {
  // Only DEV and ADMIN can access
  ADMIN_ONLY: {
    level: 'restricted' as PrivacyLevel,
    allowedRoles: [...PRIVACY_ROLE_GROUPS.ADMIN_ROLES] as string[]
  },
  
  // Financial data (DEV, ADMIN, FINANCE_MANAGER)
  FINANCIAL_DATA: {
    level: 'confidential' as PrivacyLevel,
    allowedRoles: [...PRIVACY_ROLE_GROUPS.FINANCIAL_ROLES] as string[]
  },
  
  // Department data (DEV, ADMIN, FINANCE_MANAGER, DEPARTMENT_HEAD)
  DEPARTMENT_DATA: {
    level: 'internal' as PrivacyLevel,
    allowedRoles: [...PRIVACY_ROLE_GROUPS.DEPARTMENT_ROLES] as string[]
  },
  
  // Public data (all authenticated users)
  PUBLIC_DATA: {
    level: 'public' as PrivacyLevel,
    allowedRoles: [...PRIVACY_ROLE_GROUPS.AUTHENTICATED_ROLES] as string[]
  }
} as const

/**
 * Helper function to create privacy config
 * 
 * @example
 * // Using preset
 * const config = createPrivacyConfig('my-chart', 'FINANCIAL_DATA')
 * 
 * // Using custom roles
 * const config = createPrivacyConfig('my-chart', 'confidential', ['DEV', 'ADMIN'])
 */
export function createPrivacyConfig(
  id: string,
  preset: keyof typeof PRIVACY_PRESETS | PrivacyLevel,
  customRoles?: string[]
) {
  // If preset name provided, use preset
  if (preset in PRIVACY_PRESETS) {
    const presetConfig = PRIVACY_PRESETS[preset as keyof typeof PRIVACY_PRESETS]
    return {
      id,
      level: presetConfig.level,
      allowedRoles: customRoles || presetConfig.allowedRoles,
      defaultHidden: false, // 🎯 Componente VISÍVEL por padrão
      persistent: true,
      blurIntensity: 'medium' as const
    }
  }
  
  // Otherwise, use level and custom roles
  return {
    id,
    level: preset as PrivacyLevel,
    allowedRoles: customRoles || [],
    defaultHidden: false, // 🎯 Componente VISÍVEL por padrão
    persistent: true,
    blurIntensity: 'medium' as const
  }
}

/**
 * Check if a role is in a specific group
 */
export function isRoleInGroup(role: string, group: keyof typeof PRIVACY_ROLE_GROUPS): boolean {
  const normalizedRole = role.toUpperCase().trim()
  return PRIVACY_ROLE_GROUPS[group].some(r => normalizedRole.includes(r))
}
