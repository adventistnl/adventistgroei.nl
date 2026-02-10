"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SUBSIDIES_WAITING_REFUND } from '@/graphql/mutations/REFUND_MUTATIONS'
import { useAuth } from './auth-context'
import { RefundAlertModal } from '@/components/modals/refund-alert-modal'

interface RefundSubsidy {
  id: string
  description: string
  refund_amount: number
  have_refund: boolean
  refund_done: boolean
  created_at: string
  requester: {
    id: string
    name: string
    email: string
  }
  institution: {
    id: string
    name: string
  }
  department: {
    id: string
    name: string
  }
  subsidy_status: {
    id: string
    name: string
  }
}

interface RefundAlertContextType {
  pendingRefunds: RefundSubsidy[]
  refundCount: number
  loading: boolean
  refetch: () => void
}

const RefundAlertContext = createContext<RefundAlertContextType | undefined>(undefined)

export const useRefundAlert = () => {
  const context = useContext(RefundAlertContext)
  if (!context) {
    throw new Error('useRefundAlert must be used within RefundAlertProvider')
  }
  return context
}

interface RefundAlertProviderProps {
  children: React.ReactNode
}

export const RefundAlertProvider: React.FC<RefundAlertProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [hasCheckedToday, setHasCheckedToday] = useState(false)

  // Get the last alert date from localStorage
  const getLastAlertDate = () => {
    if (typeof window === 'undefined') return null
    const lastAlert = localStorage.getItem('lastRefundAlert')
    return lastAlert ? new Date(lastAlert) : null
  }

  // Set the last alert date in localStorage
  const setLastAlertDate = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem('lastRefundAlert', new Date().toISOString())
  }

  // Check if we should show alert (once per day)
  const shouldShowAlert = () => {
    const lastAlert = getLastAlertDate()
    if (!lastAlert) return true

    const now = new Date()
    const lastAlertDate = new Date(lastAlert)

    // Check if it's a different day
    const isDifferentDay =
      now.getDate() !== lastAlertDate.getDate() ||
      now.getMonth() !== lastAlertDate.getMonth() ||
      now.getFullYear() !== lastAlertDate.getFullYear()

    return isDifferentDay
  }

  const { data, loading, refetch } = useQuery(GET_SUBSIDIES_WAITING_REFUND, {
    skip: !user,
    variables: {
      institutionId: user?.institution_id || undefined
    },
    fetchPolicy: 'cache-and-network'
  })

  const pendingRefunds: RefundSubsidy[] = data?.getSubsidiesWaitingRefund || []
  const refundCount = pendingRefunds.length

  // Show modal when there are pending refunds (once per day)
  useEffect(() => {
    if (!loading && refundCount > 0 && !hasCheckedToday && shouldShowAlert()) {
      setShowModal(true)
      setHasCheckedToday(true)
    }
  }, [loading, refundCount, hasCheckedToday])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleDontRemindToday = (shouldSave: boolean) => {
    if (shouldSave) {
      setLastAlertDate()
    }
  }

  const value: RefundAlertContextType = {
    pendingRefunds,
    refundCount,
    loading,
    refetch
  }

  return (
    <RefundAlertContext.Provider value={value}>
      {children}
      <RefundAlertModal
        isOpen={showModal}
        onClose={handleCloseModal}
        refunds={pendingRefunds}
        onDontRemindToday={handleDontRemindToday}
      />
    </RefundAlertContext.Provider>
  )
}
