import { useState } from 'react'
import { useCookies } from '@/hooks/use-cookies'
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
}

interface UseSubsidyReceiptsProps {
  subsidyRequestId?: string
  subsidyRequestItemId?: string
  projectActivityId?: string
}

export function useSubsidyReceipts({
  subsidyRequestId,
  subsidyRequestItemId,
  projectActivityId,
}: UseSubsidyReceiptsProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [receipts, setReceipts] = useState<SubsidyReceipt[]>([])
  const { getCookies } = useCookies()

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
      toast.error(error.message || 'Erro ao buscar recibos')
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
        error: 'Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.',
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Tamanho máximo: 10MB.',
      }
    }

    // Check file extension
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: 'Extensão de arquivo inválida. Apenas .jpg, .jpeg, .png e .pdf são permitidos.',
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

      // Determine type based on file mime type
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
      toast.success(`${file.name} enviado com sucesso!`)

      // Refetch receipts to update the list
      await fetchReceipts()

      return result
    } catch (error: any) {
      console.error('❌ [Hook] Upload error:', error)
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[file.name]
        return newProgress
      })

      console.error('Upload error:', error)
      toast.error(error.message || 'Erro ao fazer upload do arquivo')
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

      toast.success('Recibo excluído com sucesso')

      // Refetch receipts to update the list
      await fetchReceipts()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Erro ao excluir recibo')
      throw error
    } finally {
      setDeleting(false)
    }
  }

  /**
   * Validate a receipt (admin/manager only)
   */
  const validateReceipt = async (receiptId: string) => {
    try {
      setValidating(true)
      const token = getAuthToken()
      const apiUrl = getApiUrl()

      const response = await fetch(`${apiUrl}/subsidy-receipts/${receiptId}/validate`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao validar recibo')
      }

      toast.success('Recibo validado com sucesso')

      // Refetch receipts to update the list
      await fetchReceipts()
    } catch (error: any) {
      console.error('Validation error:', error)
      toast.error(error.message || 'Erro ao validar recibo')
      throw error
    } finally {
      setValidating(false)
    }
  }

  /**
   * Reject a receipt (admin/manager only)
   */
  const rejectReceipt = async (receiptId: string, reason: string) => {
    try {
      setValidating(true)
      const token = getAuthToken()
      const apiUrl = getApiUrl()

      const response = await fetch(`${apiUrl}/subsidy-receipts/${receiptId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao rejeitar recibo')
      }

      toast.success('Recibo rejeitado')

      // Refetch receipts to update the list
      await fetchReceipts()
    } catch (error: any) {
      console.error('Rejection error:', error)
      toast.error(error.message || 'Erro ao rejeitar recibo')
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

      toast.success('Download iniciado')
    } catch (error: any) {
      console.error('Download error:', error)
      toast.error(error.message || 'Erro ao fazer download do arquivo')
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
    uploadMultipleReceipts,
    deleteReceipt,
    validateReceipt,
    rejectReceipt,
    downloadReceipt,
    fetchReceipts,
  }
}
