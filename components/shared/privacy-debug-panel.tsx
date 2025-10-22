"use client"

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { usePrivacy } from '@/contexts/privacy-context'
import { PRIVACY_ROLE_PERMISSIONS } from '@/contexts/privacy-context'

/**
 * Privacy Debug Panel
 * 
 * Development tool to test privacy system with different roles
 * Remove or hide in production
 */
export function PrivacyDebugPanel() {
  const { 
    userRole, 
    privacyState, 
    getRegisteredComponents,
    toggleGlobalPrivacy 
  } = usePrivacy()

  const [isOpen, setIsOpen] = useState(false)
  const components = getRegisteredComponents()

  if (process.env.NODE_ENV === 'production') {
    return null // Hide in production
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all"
        title="Privacy Debug Panel"
      >
        🔒 {isOpen ? '✕' : 'Debug'}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] overflow-auto">
          <Card className="shadow-2xl">
            <CardHeader className="bg-purple-600 text-white">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>🔒 Privacy Debug Panel</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              {/* Current User Role */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Current User Role</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    userRole === 'admin' ? 'bg-red-100 text-red-800' :
                    userRole === 'finance_manager' ? 'bg-orange-100 text-orange-800' :
                    userRole === 'department_head' ? 'bg-yellow-100 text-yellow-800' :
                    userRole === 'user' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {userRole.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Role Permissions */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Accessible Privacy Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {(PRIVACY_ROLE_PERMISSIONS[userRole] || []).map(level => (
                    <span 
                      key={level}
                      className={`px-2 py-1 rounded text-xs ${
                        level === 'restricted' ? 'bg-red-100 text-red-700' :
                        level === 'confidential' ? 'bg-orange-100 text-orange-700' :
                        level === 'internal' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              {/* Global Toggle */}
              <div className="space-y-2">
                <button
                  onClick={toggleGlobalPrivacy}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  Toggle All Privacy
                </button>
              </div>

              {/* Registered Components */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                  Protected Components ({components.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {components.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">
                      No components registered yet
                    </p>
                  ) : (
                    components.map(comp => (
                      <div 
                        key={comp.id}
                        className="border rounded p-2 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs truncate flex-1">
                            {comp.id}
                          </span>
                          <span className={`ml-2 ${
                            privacyState[comp.id] 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {privacyState[comp.id] ? '🔒' : '👁️'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            comp.level === 'restricted' ? 'bg-red-100 text-red-700' :
                            comp.level === 'confidential' ? 'bg-orange-100 text-orange-700' :
                            comp.level === 'internal' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {comp.level}
                          </span>
                          {comp.persistent && (
                            <span className="text-xs text-gray-500">💾 persistent</span>
                          )}
                          {comp.autoHideDelay && (
                            <span className="text-xs text-gray-500">
                              ⏱️ {comp.autoHideDelay / 1000}s
                            </span>
                          )}
                        </div>
                        {comp.allowedRoles && (
                          <div className="text-xs text-gray-600">
                            Roles: {comp.allowedRoles.join(', ')}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Privacy State Summary */}
              <div className="space-y-2 pt-2 border-t">
                <h3 className="font-semibold text-sm">Privacy State Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-green-700 font-medium">Visible</div>
                    <div className="text-2xl font-bold text-green-700">
                      {Object.values(privacyState).filter(v => !v).length}
                    </div>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-red-700 font-medium">Hidden</div>
                    <div className="text-2xl font-bold text-red-700">
                      {Object.values(privacyState).filter(v => v).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
                <p className="font-semibold">Quick Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Click component toggles to test individually</li>
                  <li>Use "Toggle All Privacy" for bulk testing</li>
                  <li>Check localStorage for persistent state</li>
                  <li>This panel only shows in development</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
