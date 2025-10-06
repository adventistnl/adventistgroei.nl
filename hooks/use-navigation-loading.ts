"use client"

import { useRouter } from "next/navigation"
import { useNavigationLoading } from "@/contexts/navigation-loading-context"
import toast from "react-hot-toast"

interface NavigateWithLoadingOptions {
  message?: string
  showToast?: boolean
  delay?: number
}

export function useNavigateWithLoading() {
  const router = useRouter()
  const { showNavigationLoading, hideNavigationLoading } = useNavigationLoading()

  const navigateWithLoading = async (
    path: string, 
    options: NavigateWithLoadingOptions = {}
  ) => {
    const { 
      message = "🚀 Redirecting...", 
      showToast = true,
      delay = 800 
    } = options

    try {
      // Show loading state
      showNavigationLoading(message)
      
      if (showToast) {
        toast.loading(message, { duration: 1000 })
      }
      
      // Add delay to show loading state
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Navigate
      router.push(path)
      
      // Hide loading after navigation starts
      setTimeout(() => {
        hideNavigationLoading()
      }, 1000)
      
    } catch (error) {
      hideNavigationLoading()
      toast.error("❌ Navigation failed")
      console.error("Navigation error:", error)
    }
  }

  return {
    navigateWithLoading
  }
}