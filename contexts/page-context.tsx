"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

interface PageContextType {
  pageTitle: string
  setPageTitle: (title: string) => void
  breadcrumbs: { name: string; href?: string }[]
  setBreadcrumbs: (breadcrumbs: { name: string; href?: string }[]) => void
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
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; href?: string }[]>([
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
