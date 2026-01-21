"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'

interface PageContextType {
  pageTitle: ReactNode
  setPageTitle: (title: ReactNode) => void
  breadcrumbs: { name: ReactNode; href?: string; onClick?: () => void }[]
  setBreadcrumbs: (breadcrumbs: { name: ReactNode; href?: string; onClick?: () => void }[]) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const usePageContext = () => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState<ReactNode>('Dashboard')
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: ReactNode; href?: string; onClick?: () => void }[]>([
    { name: 'Dashboard', href: '/dashboard' }
  ])

  // ✅ Apenas memoizar o value object - setters do useState são naturalmente estáveis
  const value: PageContextType = useMemo(() => ({
    pageTitle,
    setPageTitle, // ✅ React garante que setters são estáveis
    breadcrumbs,
    setBreadcrumbs, // ✅ React garante que setters são estáveis
  }), [pageTitle, breadcrumbs])

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}
