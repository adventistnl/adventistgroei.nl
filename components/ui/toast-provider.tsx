"use client"

import React from 'react'
import { Toaster, toast as hotToast, ToastBar, Toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { Button } from './button'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff', // Background branco
          color: '#1a202c', // Texto escuro
          border: '1px solid #e2e8f0', // Borda sutil
          borderRadius: 'calc(var(--radius) - 2px)',
          fontSize: '14px',
          padding: '0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxWidth: '420px',
        },
        success: {
          style: {
            background: '#ffffff', // Background branco
            color: '#1a202c', // Texto escuro
            border: '1px solid #e2e8f0', // Borda sutil
          },
          iconTheme: {
            primary: '#10b981', // Ícone verde vibrante
            secondary: '#ffffff', // Background do ícone branco
          },
        },
        error: {
          style: {
            background: '#ffffff', // Background branco
            color: '#1a202c', // Texto escuro
            border: '1px solid #e2e8f0', // Borda sutil
          },
          iconTheme: {
            primary: '#ef4444', // Ícone vermelho vibrante
            secondary: '#ffffff', // Background do ícone branco
          },
        },
        loading: {
          style: {
            background: '#ffffff', // Background branco
            color: '#1a202c', // Texto escuro
            border: '1px solid #e2e8f0', // Borda sutil
          },
          iconTheme: {
            primary: '#3b82f6', // Ícone azul vibrante
            secondary: '#ffffff', // Background do ícone branco
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center gap-3 p-3 w-full">
              {icon && (
                <div className="flex-shrink-0">
                  {icon}
                </div>
              )}
              <div className="flex-1 text-sm font-medium">
                {message}
              </div>
              {t.type !== 'loading' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted/80 flex-shrink-0"
                  onClick={() => hotToast.dismiss(t.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

// Enhanced toast functions with better styling
export const toast = {
  success: (message: string, options?: any) => {
    return hotToast.success(message, {
      ...options,
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--primary) / 0.2)',
        ...options?.style,
      },
    })
  },
  
  error: (message: string, options?: any) => {
    return hotToast.error(message, {
      ...options,
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--destructive) / 0.2)',
        ...options?.style,
      },
    })
  },
  
  loading: (message: string, options?: any) => {
    return hotToast.loading(message, {
      ...options,
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        ...options?.style,
      },
    })
  },
  
  custom: (message: string, options?: any) => {
    return hotToast(message, {
      ...options,
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        ...options?.style,
      },
    })
  },
  
  dismiss: hotToast.dismiss,
  remove: hotToast.remove,
  promise: hotToast.promise,
}

export default toast
