import { toast as hotToast } from 'react-hot-toast'

export interface ToastOptions {
  duration?: number
  icon?: string
  style?: React.CSSProperties
  className?: string
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    return hotToast.success(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || '✅',
      style: {
        background: '#f0f4f8',
        color: '#333',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
      className: options?.className,
      position: options?.position,
    })
  }

  const error = (message: string, options?: ToastOptions) => {
    return hotToast.error(message, {
      duration: options?.duration || 4000,
      icon: options?.icon || '❌',
      style: {
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
      className: options?.className,
      position: options?.position,
    })
  }

  const loading = (message: string, options?: ToastOptions) => {
    return hotToast.loading(message, {
      duration: options?.duration || Infinity,
      icon: options?.icon || '⏳',
      style: {
        background: '#e0e0e0',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
      className: options?.className,
      position: options?.position,
    })
  }

  const info = (message: string, options?: ToastOptions) => {
    return hotToast(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || 'ℹ️',
      style: {
        background: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
      className: options?.className,
      position: options?.position,
    })
  }

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: ToastOptions
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'calc(var(--radius) - 2px)',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(8px)',
          ...options?.style,
        },
        success: {
          duration: 3000,
          icon: '✅',
        },
        error: {
          duration: 4000,
          icon: '❌',
        },
        loading: {
          icon: '⏳',
        },
      }
    )
  }

  const dismiss = (toastId?: string) => {
    return hotToast.dismiss(toastId)
  }

  const remove = (toastId: string) => {
    return hotToast.remove(toastId)
  }

  return {
    success,
    error,
    loading,
    info,
    promise,
    dismiss,
    remove,
  }
}

// Export individual functions for backward compatibility
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return hotToast.success(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || '✅',
      style: {
        background: '#f0f4f8',
        color: '#333',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
    })
  },
  error: (message: string, options?: ToastOptions) => {
    return hotToast.error(message, {
      duration: options?.duration || 4000,
      icon: options?.icon || '❌',
      style: {
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
    })
  },
  loading: (message: string, options?: ToastOptions) => {
    return hotToast.loading(message, {
      icon: options?.icon || '⏳',
      style: {
        background: '#e0e0e0',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...options?.style,
      },
    })
  },
  dismiss: hotToast.dismiss,
  remove: hotToast.remove,
  promise: hotToast.promise,
}

export default toast
