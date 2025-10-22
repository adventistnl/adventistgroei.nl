import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Hook personalizado para verificar se o i18n está pronto
 * Garante timeout e fallback para EN após 1 segundo
 */
export function useI18nReady() {
  const { i18n } = useTranslation()
  const [isReady, setIsReady] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout
    let checkIntervalId: NodeJS.Timeout

  // Função para verificar se está pronto
  const checkReady = () => {
    if (!mounted) return

    // Verifica se está totalmente inicializado e tem os métodos necessários
    if (i18n.isInitialized && i18n.language && typeof i18n.changeLanguage === 'function') {
      setIsReady(true)
      if (checkIntervalId) clearInterval(checkIntervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }    // Timeout de 1 segundo - força EN como padrão
    timeoutId = setTimeout(() => {
      if (!mounted) return
      
      if (!isReady) {
        console.warn('[i18n] Initialization timeout - forcing EN as default')
        setHasTimedOut(true)
        setIsReady(true)
        
        // Força mudança para EN se o método existir
        if (typeof i18n.changeLanguage === 'function' && i18n.language !== 'en') {
          i18n.changeLanguage('en').catch(err => {
            console.error('[i18n] Failed to set default language:', err)
          })
        }
      }
    }, 1000)

    // Verifica imediatamente
    checkReady()

    // Se não estiver pronto, verifica a cada 50ms
    if (!isReady) {
      checkIntervalId = setInterval(checkReady, 50)
    }

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      if (checkIntervalId) clearInterval(checkIntervalId)
    }
  }, [i18n, isReady])

  return { isReady, hasTimedOut, currentLanguage: i18n.language || 'en' }
}
