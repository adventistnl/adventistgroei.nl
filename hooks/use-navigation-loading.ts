"use client"

import { useRouter } from "next/navigation"
import { useNavigationLoading } from "@/contexts/navigation-loading-context"
import toast from "react-hot-toast"

interface NavigateWithLoadingOptions {
  message?: string
  showToast?: boolean
}

export function useNavigateWithLoading() {
  const router = useRouter()
  const { showNavigationLoading, hideNavigationLoading } = useNavigationLoading()

  const navigateWithLoading = async (
    path: string, 
    options: NavigateWithLoadingOptions = {}
  ) => {
    const { 
      message = "Redirecting...", 
      showToast = false // Default to false for cleaner UX
    } = options

    try {
      // 1. Instant feedback via Context (Direct DOM)
      showNavigationLoading(message)
      
      // 2. Optional Toast
      if (showToast) {
        toast.loading(message, { duration: 1000 })
      }
      
      // 3. Navigate immediately
      router.push(path)
      
    } catch (error) {
      hideNavigationLoading()

    }
  }

  return {
    navigateWithLoading
  }
}