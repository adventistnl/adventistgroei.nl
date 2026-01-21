"use client"

import React from 'react'
import { usePrivacy } from '@/contexts/privacy-context'

/**
 * Privacy Button Debug Panel
 * 
 * Painel visual de debug que mostra informações sobre o estado do botão de privacy
 * Aparece como um overlay no canto inferior esquerdo da tela
 * Apenas em desenvolvimento
 */
export function PrivacyButtonDebugPanel() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [buttonStatus, setButtonStatus] = React.useState<{
    found: boolean
    element: HTMLElement | null
    position: DOMRect | null
    computedStyles: any
  } | null>(null)

  const { 
    privacyState, 
    userRole, 
    getRegisteredComponents 
  } = usePrivacy()

  // Verifica o status do botão periodicamente
  React.useEffect(() => {
    if (!isOpen) return

    const checkButton = () => {
      const button = document.querySelector('.privacy-toggle-button-header') as HTMLElement
      
      if (button) {
        const rect = button.getBoundingClientRect()
        const styles = window.getComputedStyle(button)
        
        setButtonStatus({
          found: true,
          element: button,
          position: rect,
          computedStyles: {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            position: styles.position,
          }
        })
      } else {
        setButtonStatus({
          found: false,
          element: null,
          position: null,
          computedStyles: null
        })
      }
    }

    checkButton()
    const interval = setInterval(checkButton, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Apenas em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 left-4 z-[100] bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg shadow-lg font-mono text-xs"
        title="Toggle Privacy Button Debug Panel"
      >
        🔍 Debug Button
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-32 left-4 z-[100] bg-gray-900 text-white p-4 rounded-lg shadow-2xl max-w-md w-80 font-mono text-xs max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <h3 className="font-bold text-sm">🔍 Privacy Button Debug</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Button Status */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Button Status:</h4>
              <div className="bg-gray-800 p-2 rounded">
                {buttonStatus?.found ? (
                  <div className="text-green-400">
                    ✅ BUTTON FOUND IN DOM
                  </div>
                ) : (
                  <div className="text-red-400">
                    ❌ BUTTON NOT FOUND
                  </div>
                )}
              </div>
            </div>

            {/* Position Info */}
            {buttonStatus?.position && (
              <div>
                <h4 className="font-semibold text-yellow-400 mb-1">Position:</h4>
                <div className="bg-gray-800 p-2 rounded space-y-1">
                  <div>Top: {Math.round(buttonStatus.position.top)}px</div>
                  <div>Left: {Math.round(buttonStatus.position.left)}px</div>
                  <div>Width: {Math.round(buttonStatus.position.width)}px</div>
                  <div>Height: {Math.round(buttonStatus.position.height)}px</div>
                </div>
              </div>
            )}

            {/* Computed Styles */}
            {buttonStatus?.computedStyles && (
              <div>
                <h4 className="font-semibold text-yellow-400 mb-1">Computed Styles:</h4>
                <div className="bg-gray-800 p-2 rounded space-y-1">
                  <div className={buttonStatus.computedStyles.display !== 'none' ? 'text-green-400' : 'text-red-400'}>
                    Display: {buttonStatus.computedStyles.display}
                  </div>
                  <div className={buttonStatus.computedStyles.visibility !== 'hidden' ? 'text-green-400' : 'text-red-400'}>
                    Visibility: {buttonStatus.computedStyles.visibility}
                  </div>
                  <div className={parseFloat(buttonStatus.computedStyles.opacity) > 0 ? 'text-green-400' : 'text-red-400'}>
                    Opacity: {buttonStatus.computedStyles.opacity}
                  </div>
                  <div>Z-Index: {buttonStatus.computedStyles.zIndex}</div>
                  <div>Position: {buttonStatus.computedStyles.position}</div>
                </div>
              </div>
            )}

            {/* User Info */}
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">User Info:</h4>
              <div className="bg-gray-800 p-2 rounded">
                <div>Role: <span className="text-blue-400">{userRole}</span></div>
              </div>
            </div>

            {/* Registered Components */}
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Registered Components:</h4>
              <div className="bg-gray-800 p-2 rounded space-y-1 max-h-32 overflow-y-auto">
                {getRegisteredComponents().map(comp => (
                  <div key={comp.id} className="border-b border-gray-700 pb-1 mb-1 last:border-0">
                    <div className="text-blue-400">{comp.id}</div>
                    <div className="text-xs text-gray-400">
                      Level: {comp.level} | 
                      Hidden: {privacyState[comp.id] ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))}
                {getRegisteredComponents().length === 0 && (
                  <div className="text-red-400">No components registered</div>
                )}
              </div>
            </div>

            {/* Console Commands */}
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Console Commands:</h4>
              <div className="bg-gray-800 p-2 rounded space-y-1 text-[10px]">
                <div className="text-gray-400">Run in browser console:</div>
                <div className="bg-gray-700 p-1 rounded text-green-400 break-all">
                  document.querySelector('.privacy-toggle-button-header')
                </div>
                <div className="bg-gray-700 p-1 rounded text-green-400 break-all">
                  document.querySelectorAll('[data-privacy-toggle]')
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Troubleshooting:</h4>
              <div className="bg-gray-800 p-2 rounded space-y-1 text-[10px]">
                {!buttonStatus?.found && (
                  <>
                    <div className="text-red-400">❌ Button not found. Check:</div>
                    <div className="text-gray-400">1. Is PrivacyProvider installed?</div>
                    <div className="text-gray-400">2. User has correct role?</div>
                    <div className="text-gray-400">3. Component is mounted?</div>
                    <div className="text-gray-400">4. Check console logs above</div>
                  </>
                )}
                {buttonStatus?.found && buttonStatus.computedStyles?.display === 'none' && (
                  <div className="text-red-400">❌ Button is hidden (display: none)</div>
                )}
                {buttonStatus?.found && buttonStatus.computedStyles?.visibility === 'hidden' && (
                  <div className="text-red-400">❌ Button is invisible (visibility: hidden)</div>
                )}
                {buttonStatus?.found && parseFloat(buttonStatus.computedStyles?.opacity || '1') === 0 && (
                  <div className="text-red-400">❌ Button is transparent (opacity: 0)</div>
                )}
                {buttonStatus?.found && 
                 buttonStatus.computedStyles?.display !== 'none' && 
                 buttonStatus.computedStyles?.visibility !== 'hidden' && 
                 parseFloat(buttonStatus.computedStyles?.opacity || '1') > 0 && (
                  <div className="text-green-400">✅ Button should be visible!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
