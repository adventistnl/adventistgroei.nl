"use client"

import React from 'react'
import { PrivacyProvider } from '@/contexts/privacy-context'
import { useAuth } from '@/contexts/auth-context'

/**
 * PrivacyProviderWithAuth
 * 
 * Wrapper component that automatically connects PrivacyProvider 
 * with AuthContext to use the actual user role from key_code
 * 
 * Features:
 * - Automatic role detection from AuthContext
 * - Uses key_code from user_roles (ADMIN, DEV, FINANCE_MANAGER, etc.)
 * - Supports multiple roles (uses highest priority)
 * - Fallback to 'admin' in development
 */
export function PrivacyProviderWithAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  
  // Get user role from AuthContext (uses key_code array)
  const userKeyCodeRoles = auth?.roles || []
  
  // Map auth key_code roles to privacy role
  // Only call the mapping when auth is not loading to avoid false warnings
  const userRole = React.useMemo(() => {
    if (auth?.isLoading) {
      return 'guest' // Return guest role while loading
    }
    return mapAuthRoleToPrivacyRole(userKeyCodeRoles, auth?.user?.name, auth?.isLoading)
  }, [userKeyCodeRoles, auth?.user?.name, auth?.isLoading])
  

  return (
    <PrivacyProvider userRole={userRole}>
      {children}
    </PrivacyProvider>
  )
}

/**
 * Map auth key_code roles to privacy system roles
 * 
 * Priority order (highest to lowest):
 * 1. DEV (developer - full access)
 * 2. ADMIN / SUPER_ADMIN (admin - full access)
 * 3. FINANCE_MANAGER / FINANCE_ADMIN (finance_manager - financial data)
 * 4. DEPARTMENT_MANAGER / DEPARTMENT_HEAD (department_head - department data)
 * 5. EMPLOYEE / USER (user - basic access)
 * 6. VIEWER / GUEST (guest - no privacy access)
 * 
 * @param authRoles - Array of key_code roles from AuthContext
 * @param userName - User name for development fallback
 * @returns Privacy system role (admin | finance_manager | department_head | user | guest)
 */
function mapAuthRoleToPrivacyRole(
  authRoles: string[] | undefined, 
  userName: string | undefined,
  isAuthLoading?: boolean
): string {
  // Development fallback: if no roles or in dev environment, use admin
  if (!authRoles || authRoles.length === 0) {
    // Only fallback to admin in non-production (development) to avoid leaking elevated access
    if (process.env.NODE_ENV !== 'production') {
      // Only show warning if auth is not currently loading (avoid false positives)
      return 'admin'
    }

    // In production, default to the least-privileged role (guest)
    return 'guest'
  }

  // Priority mapping - first match wins (order matters!)
  const rolePriorityMap: Array<{
    patterns: string[]
    privacyRole: string
    priority: number
  }> = [
    // 🔴 Priority 1: Developer (highest access)
    {
      patterns: ['DEV', 'DEVELOPER', 'DEV_ADMIN'],
      privacyRole: 'admin',
      priority: 1
    },
    
    // 🔴 Priority 2: Administrator
    {
      patterns: ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'ADMINISTRATOR'],
      privacyRole: 'admin',
      priority: 2
    },
    
    // 🟡 Priority 3: Finance roles
    {
      patterns: ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'FINANCIAL_MANAGER', 'CFO'],
      privacyRole: 'finance_manager',
      priority: 3
    },
    
    // 🟡 Priority 4: Department roles
    {
      patterns: ['DEPARTMENT_MANAGER', 'DEPARTMENT_HEAD', 'DEPT_MANAGER', 'MANAGER'],
      privacyRole: 'department_head',
      priority: 4
    },
    
    // 🟢 Priority 5: Regular users
    {
      patterns: ['EMPLOYEE', 'USER', 'MEMBER', 'STAFF'],
      privacyRole: 'user',
      priority: 5
    },
    
    // ⚪ Priority 6: Guests (lowest access)
    {
      patterns: ['VIEWER', 'GUEST', 'READ_ONLY'],
      privacyRole: 'guest',
      priority: 6
    }
  ]

  // Find the highest priority role that matches
  let matchedRole: string | null = null
  let highestPriority = 999

  for (const role of authRoles) {
    const normalizedRole = role.toUpperCase().trim()
    
    for (const mapping of rolePriorityMap) {
      if (mapping.patterns.some(pattern => normalizedRole.includes(pattern))) {
        if (mapping.priority < highestPriority) {
          matchedRole = mapping.privacyRole
          highestPriority = mapping.priority
        }
      }
    }
  }

  // If no match found, default to 'user'
  if (!matchedRole) {
    return 'user'
  }

  return matchedRole
}

/**
 * Hook to check if current user has a specific privacy role or higher
 * 
 * @example
 * const canAccessFinancial = useHasPrivacyRole('finance_manager')
 * const isAdmin = useHasPrivacyRole('admin')
 */
export function useHasPrivacyRole(requiredRole: 'admin' | 'finance_manager' | 'department_head' | 'user' | 'guest'): boolean {
  const auth = useAuth()
  const userKeyCodeRoles = auth?.roles || []
  const userPrivacyRole = mapAuthRoleToPrivacyRole(userKeyCodeRoles, auth?.user?.name, auth?.isLoading)
  
  // Role hierarchy (lower index = higher access)
  const roleHierarchy = ['admin', 'finance_manager', 'department_head', 'user', 'guest']
  
  const userLevel = roleHierarchy.indexOf(userPrivacyRole)
  const requiredLevel = roleHierarchy.indexOf(requiredRole)
  
  // User level must be <= required level (lower index = higher access)
  return userLevel <= requiredLevel
}
