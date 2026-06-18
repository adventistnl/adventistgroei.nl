"use client"

import { usePathname, useSearchParams } from "next/navigation"
import React, { createContext, useContext, useState, useEffect, Suspense } from "react"
import { AppLoader } from "@/components/shared/app-loader"

interface NavigationLoadingContextType {
  isNavigating: boolean
  navigationMessage: string
  showNavigationLoading: (message?: string) => void
  hideNavigationLoading: () => void
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined)

interface NavigationLoadingProviderProps {
  children: React.ReactNode
}

// Internal component that uses useSearchParams - needs to be wrapped in Suspense
function NavigationLoadingProviderInner({ 
  children, 
  isNavigating,
  navigationMessage, 
  setIsNavigating 
}: { 
  children: React.ReactNode
  isNavigating: boolean
  navigationMessage: string
  setIsNavigating: (value: boolean) => void
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hideNavigationLoading = () => {
    // 1. Direct DOM manipulation
    const overlay = document.getElementById('navigation-loading-container')
    if (overlay) {
      overlay.style.display = 'none'
    }

    // 2. React state update
    setIsNavigating(false)
  }

  // Auto-hide when route changes
  useEffect(() => {
    hideNavigationLoading()
  }, [pathname, searchParams])

  // Safety timeout: Auto-dismiss after 8 seconds max to prevent infinite loading
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isNavigating) {
      timer = setTimeout(() => {
        hideNavigationLoading()
      }, 8000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isNavigating])

  return (
    <>
      {children}
      {/* 
        Render always but hidden by default using display: none.
        We use direct DOM manipulation to toggle display for zero-latency feedback.
        
        T17/T18: z-[100] keeps the overlay BELOW Dialog modals (z-[200]).
        Using bg-background/95 (more opaque) prevents bleed-through transparency artifacts
        when the overlay and a modal are simultaneously visible during navigation.
      */}
      <div 
        id="navigation-loading-container" 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        style={{ display: 'none' }}
      >
        <AppLoader message={navigationMessage} />
      </div>
    </>
  )
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationMessage, setNavigationMessage] = useState("Redirecting...")

  const showNavigationLoading = (message: string = "Redirecting...") => {
    // 1. Direct DOM manipulation for instant feedback (bypassing React render cycle)
    const overlay = document.getElementById('navigation-loading-container')
    if (overlay) {
      overlay.style.display = 'flex'
      // Force repaint
      void overlay.offsetHeight
    }

    // 2. React state update for data consistency
    setNavigationMessage(message)
    setIsNavigating(true)
  }

  const hideNavigationLoading = () => {
    // 1. Direct DOM manipulation
    const overlay = document.getElementById('navigation-loading-container')
    if (overlay) {
      overlay.style.display = 'none'
    }

    // 2. React state update
    setIsNavigating(false)
  }

  const value = {
    isNavigating,
    navigationMessage,
    showNavigationLoading,
    hideNavigationLoading
  }

  return (
    <NavigationLoadingContext.Provider value={value}>
      <Suspense fallback={children}>
        <NavigationLoadingProviderInner 
          isNavigating={isNavigating}
          navigationMessage={navigationMessage}
          setIsNavigating={setIsNavigating}
        >
          {children}
        </NavigationLoadingProviderInner>
      </Suspense>
    </NavigationLoadingContext.Provider>
  )
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)
  if (context === undefined) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider')
  }
  return context
}