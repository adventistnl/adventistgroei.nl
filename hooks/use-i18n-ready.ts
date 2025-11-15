import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Hook personalizado para verificar se o i18n está pronto
 * Garante que os métodos necessários estão disponíveis
 */
export function useI18nReady() {
  const { i18n } = useTranslation()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true
    let checkIntervalId: NodeJS.Timeout

    // Função para verificar se está pronto
    const checkReady = () => {
      if (!mounted) return

      // Verifica se está totalmente inicializado e tem os métodos necessários
      if (
        i18n.isInitialized && 
        i18n.language && 
        typeof i18n.changeLanguage === 'function'
      ) {
        setIsReady(true)
        if (checkIntervalId) clearInterval(checkIntervalId)
      }
    }

    // Verifica imediatamente
    checkReady()

    // Se não estiver pronto, verifica a cada 50ms
    if (!isReady) {
      checkIntervalId = setInterval(checkReady, 50)

      // Timeout de segurança - marca como pronto depois de 3 segundos mesmo que não inicializado
      const timeoutId = setTimeout(() => {
        if (mounted && !isReady) {
          console.warn('[i18n] Initialization timeout - marking as ready anyway')
          setIsReady(true)
          if (checkIntervalId) clearInterval(checkIntervalId)
        }
      }, 3000)

      return () => {
        mounted = false
        if (checkIntervalId) clearInterval(checkIntervalId)
        clearTimeout(timeoutId)
      }
    }

    return () => {
      mounted = false
      if (checkIntervalId) clearInterval(checkIntervalId)
    }
  }, [i18n, isReady])

  return { 
    isReady, 
    currentLanguage: i18n.language || 'en'
  }
}
