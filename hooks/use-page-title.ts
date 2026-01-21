import { useEffect, useMemo, ReactNode } from 'react'
import { usePageContext } from '@/contexts/page-context'

interface UsePageTitleOptions {
  title: ReactNode
  breadcrumbs?: { name: ReactNode; href?: string; onClick?: () => void }[]
  showBreadcrumbsInHeader?: boolean // Nova prop para controlar se breadcrumbs aparecem no header
}

export function usePageTitle({ title, breadcrumbs, showBreadcrumbsInHeader = true }: UsePageTitleOptions) {
  const { setPageTitle, setBreadcrumbs, pageTitle, breadcrumbs: currentBreadcrumbs } = usePageContext()

  // ✅ Memoizar title para evitar re-renders desnecessários
  const memoizedTitle = useMemo(() => title, [title])

  // ✅ Memoizar breadcrumbs para evitar re-renders desnecessários
  const memoizedBreadcrumbs = useMemo(() => {
    // Se showBreadcrumbsInHeader for false, retorna array vazio para não mostrar no header
    if (!showBreadcrumbsInHeader) {
      return []
    }
    return breadcrumbs || [{ name: memoizedTitle }]
  }, [breadcrumbs, memoizedTitle, showBreadcrumbsInHeader])

  // ✅ Remover setters das dependências - React garante que são estáveis
  useEffect(() => {
    setPageTitle(memoizedTitle)
    setBreadcrumbs(memoizedBreadcrumbs)
  }, [memoizedTitle, memoizedBreadcrumbs])

  // ✅ Memoizar o retorno para estabilidade
  return useMemo(() => ({
    title: pageTitle || memoizedTitle,
    breadcrumbs: currentBreadcrumbs || memoizedBreadcrumbs
  }), [pageTitle, memoizedTitle, currentBreadcrumbs, memoizedBreadcrumbs])
}

export default usePageTitle
