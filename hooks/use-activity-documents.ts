import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  DELETE_ACTIVITY_DOCUMENT,
  VALIDATE_ACTIVITY_DOCUMENT,
} from '@/graphql/mutations/ACTIVITY_DOCUMENTS_MUTATIONS'
import { GET_ACTIVITY_DOCUMENTS } from '@/graphql/queries/ACTIVITY_DOCUMENTS_QUERY'
import { useCookies } from '@/hooks/use-cookies'
import toast from 'react-hot-toast'

// Constantes de validação (devem coincidir com o backend)
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface ActivityDocument {
  id: string
  activity_id: string
  project_activity_id: string
  file_url: string
  drive_file_id?: string
  filename: string
  type: string
  is_validated: boolean
  uploaded_by: string
  created_at: string
  validated_at?: string | null
  updated_at: string
  is_deleted: boolean
}

interface UseActivityDocumentsProps {
  activityId: string
  projectActivityId: string
}

export function useActivityDocuments({ activityId, projectActivityId }: UseActivityDocumentsProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploading, setUploading] = useState(false)
  const { getCookies } = useCookies()

  // Query to fetch existing documents
  const { data, loading, refetch } = useQuery(GET_ACTIVITY_DOCUMENTS, {
    variables: { activityId: projectActivityId },
    skip: !projectActivityId,
  })

  // Mutations
  const [deleteDocumentMutation, { loading: deleting }] = useMutation(DELETE_ACTIVITY_DOCUMENT)
  const [validateDocumentMutation, { loading: validating }] = useMutation(VALIDATE_ACTIVITY_DOCUMENT)

  const documents: ActivityDocument[] = data?.getActivityDocuments || []

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
   * Upload a single file using REST endpoint
   */
  const uploadDocument = async (file: File, type: string = 'image') => {
    try {
      // Validate file before upload
      const validation = validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      setUploading(true)
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

      // Get auth token from cookies
      const cookies = getCookies()
      const token = cookies['auth-token'] || ''

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('activity_id', activityId)
      formData.append('project_activity_id', projectActivityId)
      formData.append('type', type)

      // Get API base URL
      const apiUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:3008'

      // Call REST endpoint
      const response = await fetch(`${apiUrl}/activity-documents/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao fazer upload do arquivo')
      }

      const result = await response.json()

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      toast.success(`${file.name} enviado com sucesso!`)

      // Refetch documents to update the list
      await refetch()

      return result
    } catch (error: any) {
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
  const uploadMultipleDocuments = async (files: File[]) => {
    const results = []

    for (const file of files) {
      try {
        // Determine type based on file mime type
        const type = file.type.startsWith('image/') ? 'image' : 'pdf'
        const result = await uploadDocument(file, type)
        results.push(result)
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
      }
    }

    return results
  }

  /**
   * Delete a document
   */
  const deleteDocument = async (documentId: string) => {
    try {
      await deleteDocumentMutation({
        variables: { id: documentId },
      })

      toast.success('Documento excluído com sucesso')

      // Refetch documents to update the list
      await refetch()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Erro ao excluir documento')
      throw error
    }
  }

  /**
   * Validate a document (admin/manager only)
   */
  const validateDocument = async (documentId: string) => {
    try {
      await validateDocumentMutation({
        variables: { id: documentId },
      })

      toast.success('Documento validado com sucesso')

      // Refetch documents to update the list
      await refetch()
    } catch (error: any) {
      console.error('Validation error:', error)
      toast.error(error.message || 'Erro ao validar documento')
      throw error
    }
  }

  /**
   * Download a document using REST endpoint
   */
  const downloadDocument = async (documentId: string, filename: string) => {
    try {
      // Get auth token from cookies
      const cookies = getCookies()
      const token = cookies['auth-token'] || ''

      // Get API base URL
      const apiUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:3008'

      // Call REST endpoint for download
      const response = await fetch(`${apiUrl}/activity-documents/${documentId}/download`, {
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
    documents: documents.filter(doc => !doc.is_deleted), // Filter out deleted documents
    loading,
    uploading,
    deleting,
    validating,
    uploadProgress,
    uploadDocument,
    uploadMultipleDocuments,
    deleteDocument,
    validateDocument,
    downloadDocument,
    refetch,
  }
}
