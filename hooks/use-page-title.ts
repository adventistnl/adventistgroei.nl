import { useEffect, useMemo } from 'react'
import { usePageContext } from '@/contexts/page-context'

interface UsePageTitleOptions {
  title: string
  breadcrumbs?: { name: string; href?: string; onClick?: () => void }[]
}

export function usePageTitle({ title, breadcrumbs }: UsePageTitleOptions) {
  const { setPageTitle, setBreadcrumbs, pageTitle, breadcrumbs: currentBreadcrumbs } = usePageContext()

  // ✅ Memoizar breadcrumbs para evitar re-renders desnecessários
  const memoizedBreadcrumbs = useMemo(() => {
    return breadcrumbs || [{ name: title }]
  }, [breadcrumbs, title])

  // ✅ Remover setters das dependências - React garante que são estáveis
  useEffect(() => {
    setPageTitle(title)
    setBreadcrumbs(memoizedBreadcrumbs)
  }, [title, memoizedBreadcrumbs])

  // ✅ Memoizar o retorno para estabilidade
  return useMemo(() => ({
    title: pageTitle || title,
    breadcrumbs: currentBreadcrumbs || memoizedBreadcrumbs
  }), [pageTitle, title, currentBreadcrumbs, memoizedBreadcrumbs])
}

export default usePageTitle
