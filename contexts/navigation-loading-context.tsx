"use client"

import React, { createContext, useContext, useState } from "react"
import { LoadingState } from "@/components/registration/registration-states"

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

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationMessage, setNavigationMessage] = useState("Redirecting...")

  const showNavigationLoading = (message: string = "Redirecting...") => {
    setNavigationMessage(message)
    setIsNavigating(true)
  }

  const hideNavigationLoading = () => {
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
      {children}
      {isNavigating && (
        <LoadingState message={navigationMessage} />
      )}
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