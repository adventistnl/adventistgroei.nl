/**
 * Privacy System Integration with Auth Context
 * 
 * This file demonstrates how to integrate the Privacy System
 * with your existing authentication context.
 */

'use client'

import React from 'react'
import { PrivacyProvider } from '@/contexts/privacy-context'
import { useAuth } from '@/contexts/auth-context' // Your existing auth context

/**
 * INTEGRATION EXAMPLE 1: Root Layout Integration
 * 
 * Add PrivacyProvider to your root layout, deriving user role from auth context
 */

// File: app/layout.tsx
export function IntegratedRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PrivacyProviderWithAuth>
        {children}
      </PrivacyProviderWithAuth>
    </AuthProvider>
  )
}

/**
 * Privacy Provider that automatically reads from Auth Context
 */
function PrivacyProviderWithAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  // Map your auth user role to privacy system role
  const privacyRole = mapAuthRoleToPrivacyRole(user?.role)

  return (
    <PrivacyProvider userRole={privacyRole}>
      {children}
    </PrivacyProvider>
  )
}

/**
 * ROLE MAPPING FUNCTION
 * 
 * Map your application's user roles to privacy system roles
 */
function mapAuthRoleToPrivacyRole(authRole: string | undefined): string {
  // Your app might have different role names
  // Map them to privacy system roles: 'admin', 'finance_manager', 'department_head', 'user', 'guest'
  
  const roleMap: Record<string, string> = {
    // Your Auth Roles -> Privacy System Roles
    'SUPER_ADMIN': 'admin',
    'ADMIN': 'admin',
    'FINANCE_ADMIN': 'finance_manager',
    'FINANCE_MANAGER': 'finance_manager',
    'DEPARTMENT_MANAGER': 'department_head',
    'DEPARTMENT_HEAD': 'department_head',
    'EMPLOYEE': 'user',
    'USER': 'user',
    'VIEWER': 'guest',
    'GUEST': 'guest',
  }

  return roleMap[authRole?.toUpperCase() || ''] || 'guest'
}

/**
 * INTEGRATION EXAMPLE 2: Custom Privacy Roles Based on Permissions
 * 
 * If your app uses permission-based access instead of roles,
 * you can derive privacy role from permissions
 */

interface User {
  id: string
  name: string
  permissions: string[]
}

function derivePrivacyRoleFromPermissions(user: User | null): string {
  if (!user) return 'guest'

  const permissions = user.permissions || []

  // Admin: Has all permissions
  if (permissions.includes('admin:*') || permissions.includes('*')) {
    return 'admin'
  }

  // Finance Manager: Has finance permissions
  if (
    permissions.includes('finance:read') &&
    permissions.includes('finance:write') &&
    permissions.includes('budget:manage')
  ) {
    return 'finance_manager'
  }

  // Department Head: Can manage department
  if (
    permissions.includes('department:manage') ||
    permissions.includes('department:read')
  ) {
    return 'department_head'
  }

  // Regular User: Has basic permissions
  if (permissions.includes('user:read')) {
    return 'user'
  }

  // Default to guest
  return 'guest'
}

/**
 * INTEGRATION EXAMPLE 3: Dynamic Privacy Provider with Permission Check
 */
function DynamicPrivacyProvider({ children }: { children: React.ReactNode }) {
  const { user, permissions } = useAuth()

  const privacyRole = React.useMemo(() => {
    return derivePrivacyRoleFromPermissions(user)
  }, [user, permissions])

  return (
    <PrivacyProvider userRole={privacyRole}>
      {children}
    </PrivacyProvider>
  )
}

/**
 * INTEGRATION EXAMPLE 4: Extended Privacy Roles
 * 
 * Add custom roles beyond the default ones
 */

// Extend the default role permissions
import { PRIVACY_ROLE_PERMISSIONS } from '@/contexts/privacy-context'

export const EXTENDED_PRIVACY_ROLES = {
  ...PRIVACY_ROLE_PERMISSIONS,
  
  // Add custom roles
  'regional_manager': ['public', 'internal', 'confidential'],
  'church_pastor': ['public', 'internal'],
  'volunteer': ['public'],
  'external_auditor': ['public', 'internal', 'confidential'], // Special case
}

/**
 * INTEGRATION EXAMPLE 5: Privacy Role Hierarchy
 * 
 * If your app has complex role hierarchy
 */

interface RoleHierarchy {
  role: string
  inheritsFrom?: string[]
}

const ROLE_HIERARCHY: RoleHierarchy[] = [
  { role: 'admin', inheritsFrom: [] }, // Top level
  { role: 'finance_manager', inheritsFrom: ['department_head'] },
  { role: 'department_head', inheritsFrom: ['user'] },
  { role: 'user', inheritsFrom: ['guest'] },
  { role: 'guest', inheritsFrom: [] }, // Bottom level
]

function getEffectivePrivacyLevels(userRole: string): string[] {
  const hierarchy = ROLE_HIERARCHY.find(h => h.role === userRole)
  if (!hierarchy) return EXTENDED_PRIVACY_ROLES['guest'] || []

  let levels = new Set(EXTENDED_PRIVACY_ROLES[userRole] || [])

  // Add inherited levels
  hierarchy.inheritsFrom?.forEach(inheritedRole => {
    const inheritedLevels = getEffectivePrivacyLevels(inheritedRole)
    inheritedLevels.forEach(level => levels.add(level))
  })

  return Array.from(levels)
}

/**
 * INTEGRATION EXAMPLE 6: Privacy with Multiple Institutions
 * 
 * Handle privacy across multiple institutions/organizations
 */

interface InstitutionContext {
  institutionId: string
  userRoleInInstitution: string
}

function PrivacyProviderWithInstitution({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { user } = useAuth()
  const { currentInstitution } = useInstitution() // Your institution context

  // User role might differ per institution
  const institutionRole = user?.institutionRoles?.[currentInstitution?.id] || 'guest'
  
  const privacyRole = mapAuthRoleToPrivacyRole(institutionRole)

  return (
    <PrivacyProvider userRole={privacyRole}>
      {children}
    </PrivacyProvider>
  )
}

/**
 * INTEGRATION EXAMPLE 7: Privacy Event Logging
 * 
 * Log privacy toggle events for audit purposes
 */

import { useComponentPrivacy } from '@/contexts/privacy-context'

export function PrivacyWithLogging({ config }: any) {
  const { user } = useAuth()
  const privacy = useComponentPrivacy(config)

  React.useEffect(() => {
    if (privacy.isHidden) {
      logPrivacyEvent({
        event: 'privacy_hidden',
        componentId: config.id,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      })
    }
  }, [privacy.isHidden])

  return privacy
}

function logPrivacyEvent(event: any) {
  // Send to your logging service
  console.log('Privacy Event:', event)
  // fetch('/api/audit/privacy', { method: 'POST', body: JSON.stringify(event) })
}

/**
 * INTEGRATION EXAMPLE 8: Privacy Settings Page
 * 
 * Allow users to set their default privacy preferences
 */

export function PrivacySettingsPage() {
  const { user } = useAuth()
  const [defaultPrivacyMode, setDefaultPrivacyMode] = React.useState<'visible' | 'hidden'>('visible')

  const savePrivacyPreference = async () => {
    await fetch('/api/user/privacy-preference', {
      method: 'POST',
      body: JSON.stringify({
        userId: user?.id,
        defaultPrivacyMode,
      }),
    })
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
      
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="privacy"
            value="visible"
            checked={defaultPrivacyMode === 'visible'}
            onChange={(e) => setDefaultPrivacyMode('visible')}
          />
          <span>Show sensitive information by default</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="privacy"
            value="hidden"
            checked={defaultPrivacyMode === 'hidden'}
            onChange={(e) => setDefaultPrivacyMode('hidden')}
          />
          <span>Hide sensitive information by default</span>
        </label>

        <button
          onClick={savePrivacyPreference}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}

/**
 * INTEGRATION EXAMPLE 9: Privacy Badge Component
 * 
 * Show user's current privacy role
 */

export function PrivacyRoleBadge() {
  const { userRole } = usePrivacy()

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    finance_manager: 'bg-orange-100 text-orange-800',
    department_head: 'bg-yellow-100 text-yellow-800',
    user: 'bg-blue-100 text-blue-800',
    guest: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[userRole]}`}>
      {userRole.replace('_', ' ').toUpperCase()}
    </span>
  )
}

/**
 * INTEGRATION EXAMPLE 10: Complete Layout Example
 */

export function CompleteLayoutExample({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <PrivacyProviderWithAuthIntegration>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </PrivacyProviderWithAuthIntegration>
        </AuthProvider>
      </body>
    </html>
  )
}

function PrivacyProviderWithAuthIntegration({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  // Wait for auth to load before rendering
  if (isLoading) {
    return <div>Loading...</div>
  }

  const privacyRole = mapAuthRoleToPrivacyRole(user?.role)

  return (
    <PrivacyProvider userRole={privacyRole}>
      {children}
    </PrivacyProvider>
  )
}

function Header() {
  const { user } = useAuth()
  
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <h1>My App</h1>
      <div className="flex items-center gap-2">
        <span>{user?.name}</span>
        <PrivacyRoleBadge />
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t p-4 text-center text-sm text-gray-600">
      © 2025 My App
    </footer>
  )
}

/**
 * CHECKLIST FOR INTEGRATION
 * 
 * [ ] Import PrivacyProvider in root layout
 * [ ] Connect user role from auth context
 * [ ] Map auth roles to privacy roles
 * [ ] Test with different user roles
 * [ ] Implement role hierarchy if needed
 * [ ] Add privacy event logging
 * [ ] Create privacy settings page
 * [ ] Add privacy role badge to UI
 * [ ] Test across all protected components
 * [ ] Document role permissions for team
 */

/**
 * EXPORT UTILITIES
 */

export {
  mapAuthRoleToPrivacyRole,
  derivePrivacyRoleFromPermissions,
  getEffectivePrivacyLevels,
  EXTENDED_PRIVACY_ROLES,
}
