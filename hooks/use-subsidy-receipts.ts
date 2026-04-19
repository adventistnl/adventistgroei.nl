import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { useCookies } from '@/hooks/use-cookies'
import { VALIDATE_SUBSIDY_RECEIPT, REJECT_SUBSIDY_RECEIPT } from '@/graphql/mutations/REFUND_MUTATIONS'
import toast from 'react-hot-toast'

// Constantes de validação (devem coincidir com o backend)
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface SubsidyReceipt {
  id: string
  subsidy_request_id: string
  subsidy_request_item_id?: string
  project_activities_id: string
  file_url: string
  drive_file_id?: string
  filename: string
  type: string
  amount?: number
  approved: boolean
  is_validated: boolean
  validated_at?: string | null
  validated_by?: string | null
  uploaded_by: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  is_refund_receipt?: boolean
}

interface UseSubsidyReceiptsProps {
  subsidyRequestId?: string
  subsidyRequestItemId?: string
  projectActivityId?: string
  onHistoryUpdate?: () => void | Promise<void>
}

export function useSubsidyReceipts({
  subsidyRequestId,
  subsidyRequestItemId,
  projectActivityId,
  onHistoryUpdate,
}: UseSubsidyReceiptsProps) {
  const { t } = useTranslation()
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [receipts, setReceipts] = useState<SubsidyReceipt[]>([])
  const { getCookies } = useCookies()
  const apolloClient = useApolloClient()

  /**
   * Get API base URL
   */
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:3008'
  }

  /**
   * Get auth token from cookies
   */
  const getAuthToken = () => {
    const cookies = getCookies()
    return cookies['auth-token'] || ''
  }

  /**
   * Fetch receipts from API
   * @param overrideSubsidyRequestId - Optional ID to override the hook's subsidyRequestId (useful when state hasn't updated yet)
   */
  const fetchReceipts = async (overrideSubsidyRequestId?: string) => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const apiUrl = getApiUrl()

      let url = `${apiUrl}/subsidy-receipts`
      const params = new URLSearchParams()

      // Use override ID if provided, otherwise use hook's subsidyRequestId
      const effectiveSubsidyRequestId = overrideSubsidyRequestId || subsidyRequestId

      if (effectiveSubsidyRequestId) {
        params.append('subsidy_request_id', effectiveSubsidyRequestId)
      }
      if (subsidyRequestItemId) {
        params.append('subsidy_request_item_id', subsidyRequestItemId)
      }
      if (projectActivityId) {
        params.append('project_activity_id', projectActivityId)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao buscar recibos')
      }

      const data = await response.json()
      setReceipts(data)
      return data
    } catch (error: any) {
      console.error('Fetch receipts error:', error)
      toast.error(error.message || t('subsidyRequest.receipts.fetchError'))
      return []
    } finally {
      setLoading(false)
    }
  }

  /**
   * Validate file before upload
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: t('subsidyRequest.receipts.invalidFileType'),
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: t('subsidyRequest.receipts.fileTooLarge'),
      }
    }

    // Check file extension
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: t('subsidyRequest.receipts.invalidFileExtension'),
      }
    }

    return { valid: true }
  }

  /**
   * Upload a single receipt file using REST endpoint
   */
  const uploadReceipt = async (
    file: File,
    subsidyReqId: string,
    projectActId: string,
    options?: {
      subsidyRequestItemId?: string
      type?: string
      amount?: number
    }
  ) => {
    console.log('📤 [Hook] uploadReceipt called:', {
      fileName: file.name,
      subsidyReqId,
      projectActId,
      options
    })

    try {
      // Validate file before upload
      const validation = validateFile(file)
      if (!validation.valid) {
        console.log('❌ [Hook] File validation failed:', validation.error)
        throw new Error(validation.error)
      }

      setUploading(true)
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

      const token = getAuthToken()
      const apiUrl = getApiUrl()

      console.log('📤 [Hook] API URL:', apiUrl)
      console.log('📤 [Hook] Token present:', !!token)

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('subsidy_request_id', subsidyReqId)
      formData.append('project_activity_id', projectActId)

      if (options?.subsidyRequestItemId) {
        formData.append('subsidy_request_item_id', options.subsidyRequestItemId)
      }

      // Determine type — backend accepts: 'pdf' | 'image' | 'invoice'
      const type = options?.type || (file.type.startsWith('image/') ? 'image' : 'pdf')
      formData.append('type', type)

      if (options?.amount !== undefined) {
        formData.append('amount', options.amount.toString())
      }

      console.log('📤 [Hook] Calling API endpoint...')

      // Call REST endpoint
      const response = await fetch(`${apiUrl}/subsidy-receipts/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      })

      console.log('📤 [Hook] Response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.log('❌ [Hook] API error response:', error)
        throw new Error(error.message || 'Erro ao fazer upload do arquivo')
      }

      const result = await response.json()
      console.log('✅ [Hook] Upload success, result:', result)

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      toast.success(t('subsidyRequest.receipts.uploadSuccess', { filename: file.name }))

      await fetchReceipts()
      
      if (onHistoryUpdate) {
        await onHistoryUpdate()
      }

      return result
    } catch (error: any) {
      console.error('❌ [Hook] Upload error:', error)
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[file.name]
        return newProgress
      })

      console.error('Upload error:', error)
      toast.error(error.message || t('subsidyRequest.receipts.uploadError'))
      throw error
    } finally {
      setUploading(false)
    }
  }

  /**
   * Upload a refund receipt (no project_activity_id, is_refund_receipt = true)
   */
  const uploadRefundReceipt = async (
    file: File,
    subsidyReqId: string,
    options?: { amount?: number; note?: string }
  ) => {
    console.log('📤 [Hook] uploadRefundReceipt called:', { fileName: file.name, subsidyReqId, options })

    try {
      const validation = validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      setUploading(true)
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

      const token = getAuthToken()
      const apiUrl = getApiUrl()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('subsidy_request_id', subsidyReqId)
      formData.append('is_refund_receipt', 'true')

      const type = file.type.startsWith('image/') ? 'image' : 'pdf'
      formData.append('type', type)

      if (options?.amount !== undefined) {
        formData.append('amount', String(options.amount))
      }

      if (options?.note) {
        formData.append('note', options.note)
      }

      const response = await fetch(`${apiUrl}/subsidy-receipts/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao fazer upload do comprovante de reembolso')
      }

      const result = await response.json()
      console.log('✅ [Hook] Refund receipt upload success:', result)

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      toast.success(t('subsidyRequest.receipts.uploadSuccess', { filename: file.name }))

      await fetchReceipts()

      if (onHistoryUpdate) {
        await onHistoryUpdate()
      }

      return result
    } catch (error: any) {
      console.error('❌ [Hook] Refund receipt upload error:', error)
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[file.name]
        return newProgress
      })
      toast.error(error.message || t('subsidyRequest.receipts.refundUploadError'))
      throw error
    } finally {
      setUploading(false)
    }
  }

  /**
   * Upload multiple files
   */
  const uploadMultipleReceipts = async (
    files: File[],
    subsidyReqId: string,
    projectActId: string,
    options?: {
      subsidyRequestItemId?: string
    }
  ) => {
    const results = []

    for (const file of files) {
      try {
        const type = file.type.startsWith('image/') ? 'image' : 'pdf'
        const result = await uploadReceipt(file, subsidyReqId, projectActId, {
          ...options,
          type,
        })
        results.push(result)
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
      }
    }

    return results
  }

  /**
   * Delete a receipt
   */
  const deleteReceipt = async (receiptId: string) => {
    try {
      setDeleting(true)
      const token = getAuthToken()
      const apiUrl = getApiUrl()

      const response = await fetch(`${apiUrl}/subsidy-receipts/${receiptId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao excluir recibo')
      }

      toast.success(t('subsidyRequest.receipts.deleteSuccess'))

      // Refetch receipts to update the list
      await fetchReceipts()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || t('subsidyRequest.receipts.deleteError'))
      throw error
    } finally {
      setDeleting(false)
    }
  }

  /**
   * Validate (approve) a receipt via GraphQL mutation.
   * Uses Apollo Client so the auth token is injected automatically.
   */
  const validateReceipt = async (receiptId: string, note?: string) => {
    try {
      setValidating(true)
      await apolloClient.mutate({
        mutation: VALIDATE_SUBSIDY_RECEIPT,
        variables: { id: receiptId, note: note || undefined },
      })
      toast.success(t('subsidyRequest.receipts.validateSuccess'))
      await fetchReceipts()
      if (onHistoryUpdate) await onHistoryUpdate()
    } catch (error: any) {
      const message = error?.graphQLErrors?.[0]?.message || error?.message || t('subsidyRequest.receipts.validateError')
      console.error('Validation error:', error)
      toast.error(message)
      throw error
    } finally {
      setValidating(false)
    }
  }

  /**
   * Reject a receipt via GraphQL mutation.
   * Uses Apollo Client so the auth token is injected automatically.
   */
  const rejectReceipt = async (receiptId: string, reason: string) => {
    try {
      setValidating(true)
      await apolloClient.mutate({
        mutation: REJECT_SUBSIDY_RECEIPT,
        variables: { id: receiptId, reason: reason || undefined },
      })
      toast.success(t('subsidyRequest.receipts.rejectSuccess'))
      await fetchReceipts()
      if (onHistoryUpdate) await onHistoryUpdate()
    } catch (error: any) {
      const message = error?.graphQLErrors?.[0]?.message || error?.message || t('subsidyRequest.receipts.rejectError')
      console.error('Rejection error:', error)
      toast.error(message)
      throw error
    } finally {
      setValidating(false)
    }
  }

  /**
   * Download a receipt using REST endpoint
   */
  const downloadReceipt = async (receiptId: string, filename: string) => {
    try {
      const token = getAuthToken()
      const apiUrl = getApiUrl()

      // Call REST endpoint for download
      const response = await fetch(`${apiUrl}/subsidy-receipts/${receiptId}/download`, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Erro ao fazer download do arquivo')
      }

      // Get blob from response
      const blob = await response.blob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(t('subsidyRequest.receipts.downloadSuccess'))
    } catch (error: any) {
      console.error('Download error:', error)
      toast.error(error.message || t('subsidyRequest.receipts.downloadError'))
      throw error
    }
  }

  /**
   * Update an existing receipt (amount, type, etc.)
   */
  const updateReceipt = async (
    receiptId: string,
    data: {
      amount?: number
      type?: 'invoice' | 'receipt' | 'contract' | 'proof_of_payment' | 'other'
    }
  ) => {
    try {
      const response = await fetch(`${getApiUrl()}/subsidy-receipts/${receiptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar recibo')
      }

      const result = await response.json()
      console.log('✅ [Hook] Receipt updated:', result)

      // Refetch receipts to update the list
      await fetchReceipts()

      toast.success(t('subsidyRequest.receipts.updateSuccess'))
      return result
    } catch (error: any) {
      toast.error(error.message || t('subsidyRequest.receipts.updateError'))
      throw error
    }
  }

  return {
    receipts: receipts.filter(r => !r.is_deleted),
    loading,
    uploading,
    deleting,
    validating,
    uploadProgress,
    uploadReceipt,
    uploadRefundReceipt,
    uploadMultipleReceipts,
    updateReceipt,
    deleteReceipt,
    validateReceipt,
    rejectReceipt,
    downloadReceipt,
    fetchReceipts,
  }
}
