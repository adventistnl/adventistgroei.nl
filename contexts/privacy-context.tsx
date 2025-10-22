"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

/**
 * Privacy Configuration Types
 */
export type PrivacyLevel = 'public' | 'internal' | 'confidential' | 'restricted'

export interface PrivacyConfig {
  /** Unique identifier for the privacy-enabled component */
  id: string
  /** Privacy level required to view this content */
  level: PrivacyLevel
  /** Roles allowed to toggle privacy */
  allowedRoles?: string[]
  /** Default privacy state (hidden or visible) */
  defaultHidden?: boolean // 🎯 FALSE by default = componente visível por padrão
  /** Whether to persist privacy state in localStorage */
  persistent?: boolean
  /** Custom blur intensity */
  blurIntensity?: 'low' | 'medium' | 'high'
  /** Auto-hide after inactivity (milliseconds) */
  autoHideDelay?: number
}

export interface PrivacyState {
  [componentId: string]: boolean // true = hidden, false = visible
}

interface PrivacyContextType {
  /** Current privacy state for all components */
  privacyState: PrivacyState
  /** Toggle privacy for a specific component */
  togglePrivacy: (componentId: string) => void
  /** Set privacy state for a specific component */
  setPrivacy: (componentId: string, isHidden: boolean) => void
  /** Check if component is hidden */
  isHidden: (componentId: string) => boolean
  /** Toggle privacy for all components */
  toggleGlobalPrivacy: () => void
  /** Current user role */
  userRole: string
  /** Check if user can toggle privacy for a component */
  canTogglePrivacy: (config: PrivacyConfig) => boolean
  /** Register a new privacy-enabled component */
  registerComponent: (config: PrivacyConfig) => void
  /** Unregister a privacy-enabled component */
  unregisterComponent: (componentId: string) => void
  /** Get all registered components */
  getRegisteredComponents: () => PrivacyConfig[]
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

/**
 * Privacy Level Hierarchy
 * Higher index = more restrictive
 */
const PRIVACY_LEVELS: Record<PrivacyLevel, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  restricted: 3,
}

/**
 * Role-based Privacy Permissions
 * Define which roles can access which privacy levels
 */
export const PRIVACY_ROLE_PERMISSIONS: Record<string, PrivacyLevel[]> = {
  // Admin can access everything
  admin: ['public', 'internal', 'confidential', 'restricted'],
  // Finance manager can access up to confidential
  finance_manager: ['public', 'internal', 'confidential'],
  // Department head can access up to internal
  department_head: ['public', 'internal'],
  // Regular user can only access public
  user: ['public'],
  // Guest has no access to privacy toggle
  guest: [],
}

interface PrivacyProviderProps {
  children: React.ReactNode
  /** Current user role - should come from auth context */
  userRole?: string
  /** Initial privacy state */
  initialState?: PrivacyState
}

export function PrivacyProvider({ 
  children, 
  userRole = 'user',
  initialState = {} 
}: PrivacyProviderProps) {
  const [privacyState, setPrivacyState] = useState<PrivacyState>(() => {
    // Try to load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('privacy-state')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.warn('Failed to parse saved privacy state:', e)
        }
      }
    }
    return initialState
  })

  const [registeredComponents, setRegisteredComponents] = useState<Map<string, PrivacyConfig>>(
    new Map()
  )

  /**
   * Check if user can toggle privacy based on role and component config
   */
  const canTogglePrivacy = useCallback((config: PrivacyConfig): boolean => {
    // Check if specific roles are defined for this component
    if (config.allowedRoles && config.allowedRoles.length > 0) {
      // Map privacy role to key codes for comparison
      const privacyRoleToKeyCodesMap: Record<string, string[]> = {
        admin: ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'ADMINISTRATOR', 'DEV', 'DEVELOPER', 'DEV_ADMIN'],
        finance_manager: ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'FINANCIAL_MANAGER', 'CFO'],
        department_head: ['DEPARTMENT_MANAGER', 'DEPARTMENT_HEAD', 'DEPT_MANAGER', 'MANAGER'],
        user: ['EMPLOYEE', 'USER', 'MEMBER', 'STAFF'],
        guest: ['VIEWER', 'GUEST', 'READ_ONLY']
      }

      const userKeyCodes = privacyRoleToKeyCodesMap[userRole] || []
      
      // Check if any user key code matches allowed roles
      const hasPermission = config.allowedRoles.some(allowedRole => 
        userKeyCodes.some(keyCode => 
          allowedRole.toUpperCase().includes(keyCode) || 
          keyCode.includes(allowedRole.toUpperCase())
        )
      )

      return hasPermission
    }

    // Check against privacy level permissions
    const userPermissions = PRIVACY_ROLE_PERMISSIONS[userRole] || []
    return userPermissions.includes(config.level)
  }, [userRole])

  /**
   * Register a new privacy-enabled component
   */
  const registerComponent = useCallback((config: PrivacyConfig) => {
    setRegisteredComponents(prev => {
      const newMap = new Map(prev)
      newMap.set(config.id, config)
      return newMap
    })

    // 🎯 NOVO: Componente VISÍVEL por padrão (defaultHidden = false)
    // Só esconde se defaultHidden for explicitamente true
    // Ou se já existe estado salvo no localStorage
    if (privacyState[config.id] === undefined) {
      const shouldHide = config.defaultHidden === true // Apenas esconde se explicitamente true
      setPrivacyState(prev => ({
        ...prev,
        [config.id]: shouldHide // false by default = visível
      }))
    }
  }, [privacyState])

  /**
   * Unregister a privacy-enabled component
   */
  const unregisterComponent = useCallback((componentId: string) => {
    setRegisteredComponents(prev => {
      const newMap = new Map(prev)
      newMap.delete(componentId)
      return newMap
    })
  }, [])

  /**
   * Toggle privacy for a specific component
   */
  const togglePrivacy = useCallback((componentId: string) => {
    setPrivacyState(prev => {
      const newState = {
        ...prev,
        [componentId]: !prev[componentId]
      }

      // Persist to localStorage if configured
      const config = registeredComponents.get(componentId)
      if (config?.persistent && typeof window !== 'undefined') {
        localStorage.setItem('privacy-state', JSON.stringify(newState))
      }

      return newState
    })
  }, [registeredComponents])

  /**
   * Set privacy state for a specific component
   */
  const setPrivacy = useCallback((componentId: string, isHidden: boolean) => {
    setPrivacyState(prev => {
      const newState = {
        ...prev,
        [componentId]: isHidden
      }

      // Persist to localStorage if configured
      const config = registeredComponents.get(componentId)
      if (config?.persistent && typeof window !== 'undefined') {
        localStorage.setItem('privacy-state', JSON.stringify(newState))
      }

      return newState
    })
  }, [registeredComponents])

  /**
   * Check if component is currently hidden
   */
  const isHidden = useCallback((componentId: string): boolean => {
    return privacyState[componentId] || false
  }, [privacyState])

  /**
   * Toggle privacy for all registered components
   */
  const toggleGlobalPrivacy = useCallback(() => {
    setPrivacyState(prev => {
      const allHidden = Object.values(prev).every(v => v === true)
      const newState: PrivacyState = {}
      
      registeredComponents.forEach((_, id) => {
        newState[id] = !allHidden
      })

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('privacy-state', JSON.stringify(newState))
      }

      return newState
    })
  }, [registeredComponents])

  /**
   * Get all registered components
   */
  const getRegisteredComponents = useCallback(() => {
    return Array.from(registeredComponents.values())
  }, [registeredComponents])

  const value = useMemo(() => ({
    privacyState,
    togglePrivacy,
    setPrivacy,
    isHidden,
    toggleGlobalPrivacy,
    userRole,
    canTogglePrivacy,
    registerComponent,
    unregisterComponent,
    getRegisteredComponents,
  }), [
    privacyState,
    togglePrivacy,
    setPrivacy,
    isHidden,
    toggleGlobalPrivacy,
    userRole,
    canTogglePrivacy,
    registerComponent,
    unregisterComponent,
    getRegisteredComponents,
  ])

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  )
}

/**
 * Hook to access privacy context
 * @throws Error if used outside PrivacyProvider
 */
export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider')
  }
  return context
}

/**
 * Hook to manage privacy for a specific component
 */
export function useComponentPrivacy(config: PrivacyConfig) {
  const { 
    isHidden, 
    togglePrivacy, 
    setPrivacy, 
    canTogglePrivacy,
    registerComponent,
    unregisterComponent,
  } = usePrivacy()

  // Register component on mount, unregister on unmount
  React.useEffect(() => {
    registerComponent(config)
    return () => {
      unregisterComponent(config.id)
    }
  }, [config.id]) // Only re-register if ID changes

  // Auto-hide functionality
  React.useEffect(() => {
    if (!config.autoHideDelay) return

    let timeout: NodeJS.Timeout

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        setPrivacy(config.id, true)
      }, config.autoHideDelay)
    }

    const handleActivity = () => {
      if (!isHidden(config.id)) {
        resetTimer()
      }
    }

    // Listen to user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)

    resetTimer()

    return () => {
      if (timeout) clearTimeout(timeout)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
    }
  }, [config.autoHideDelay, config.id, isHidden, setPrivacy])

  const hidden = isHidden(config.id)
  const canToggle = canTogglePrivacy(config)

  return {
    isHidden: hidden,
    togglePrivacy: () => togglePrivacy(config.id),
    setPrivacy: (hidden: boolean) => setPrivacy(config.id, hidden),
    canToggle,
    config,
  }
}
