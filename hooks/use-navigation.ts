import { useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getNavMainWithActiveState } from '@/config/navigation'

export function useNavigation() {
  const pathname = usePathname()
  const previousPathnameRef = useRef<string>()
  
  // Memoizar navegação com estado ativo para evitar recriações desnecessárias
  const navigationWithActiveState = useMemo(() => {
    // Só recalcula se o pathname realmente mudou
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname
      return getNavMainWithActiveState(pathname)
    }
    // Se o pathname não mudou, retorna o resultado anterior
    return getNavMainWithActiveState(pathname)
  }, [pathname])
  
  return useMemo(() => ({
    navigation: navigationWithActiveState,
    pathname
  }), [navigationWithActiveState, pathname])
}
