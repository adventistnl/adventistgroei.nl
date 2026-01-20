import { useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getNavMainWithActiveState, getNavSectionsWithActiveState } from '@/config/navigation'
import { useAuth } from '@/contexts/auth-context'

export function useNavigation() {
  const pathname = usePathname()
  const { permissions } = useAuth()
  const previousPathnameRef = useRef<string>()
  const previousPermissionsRef = useRef<typeof permissions>()
  
  // Memoizar navegação com estado ativo para evitar recriações desnecessárias
  const navigationWithActiveState = useMemo(() => {
    // Só recalcula se o pathname ou permissões realmente mudaram
    if (previousPathnameRef.current !== pathname || previousPermissionsRef.current !== permissions) {
      previousPathnameRef.current = pathname
      previousPermissionsRef.current = permissions
      return getNavMainWithActiveState(pathname, permissions)
    }
    // Se nada mudou, retorna o resultado anterior
    return getNavMainWithActiveState(pathname, permissions)
  }, [pathname, permissions])
  
  // Memoizar seções com estado ativo
  const sectionsWithActiveState = useMemo(() => {
    return getNavSectionsWithActiveState(pathname, permissions)
  }, [pathname, permissions])
  
  return useMemo(() => ({
    navigation: navigationWithActiveState,
    sections: sectionsWithActiveState,
    pathname
  }), [navigationWithActiveState, sectionsWithActiveState, pathname])
}
