'use client'

import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isI18nReady, setIsI18nReady] = useState(false)

  useEffect(() => {
    let mounted = true

    // Initialize and load saved language preference
    const initializeI18n = async () => {
      try {
        // Wait for i18n to be ready
        if (!i18n.isInitialized) {
          await new Promise(resolve => {
            const checkInterval = setInterval(() => {
              if (i18n.isInitialized) {
                clearInterval(checkInterval)
                resolve(true)
              }
            }, 50)

            // Timeout after 3 seconds
            setTimeout(() => {
              clearInterval(checkInterval)
              resolve(false)
            }, 3000)
          })
        }

        if (mounted) {
          // Load saved language preference from localStorage
          if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('preferred-language')
            if (savedLanguage && savedLanguage !== i18n.language) {
              await i18n.changeLanguage(savedLanguage)
            }
          }
          setIsI18nReady(true)
        }
      } catch (error) {
        console.error('[I18nProvider] Error initializing i18n:', error)
        if (mounted) {
          setIsI18nReady(true) // Still mark as ready even if there's an error
        }
      }
    }

    initializeI18n()

    return () => {
      mounted = false
    }
  }, [])

  // Don't render children until i18n is ready
  if (!isI18nReady) {
    return <>{children}</> // Still render children but i18n might not be loaded
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
