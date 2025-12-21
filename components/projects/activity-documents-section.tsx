"use client"

import React, { useState } from "react"
import {
  Upload,
  File,
  FileImage,
  X,
  Download,
  CheckCircle,
  Clock,
  Trash2,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagBadge } from "@/components/ui/tag-badge"
import { useActivityDocuments } from "@/hooks/use-activity-documents"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

interface ActivityDocumentsSectionProps {
  activityId: string
  projectActivityId: string
  userRoles?: string[]
}

export function ActivityDocumentsSection({
  activityId,
  projectActivityId,
  userRoles = []
}: ActivityDocumentsSectionProps) {
  const { t } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const {
    documents,
    loading,
    uploading,
    uploadMultipleDocuments,
    deleteDocument,
    validateDocument,
    downloadDocument,
  } = useActivityDocuments({ activityId, projectActivityId })

  const isAdmin = userRoles.some(role =>
    ['admin', 'manager', 'dev'].includes(role.toLowerCase())
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      const validFiles = droppedFiles.filter(file => {
        const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
        return isValidType && isValidSize
      })

      if (validFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...validFiles])
        toast.success(`${validFiles.length} arquivo(s) adicionado(s)`)
      }

      if (validFiles.length !== droppedFiles.length) {
        toast.error("Alguns arquivos foram rejeitados (apenas PDF e imagens até 10MB)")
      }
    }
  }

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*,application/pdf'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const fileArray = Array.from(files)
        const validFiles = fileArray.filter(file => {
          const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
          const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
          return isValidType && isValidSize
        })

        if (validFiles.length > 0) {
          setUploadedFiles(prev => [...prev, ...validFiles])
          toast.success(`${validFiles.length} arquivo(s) adicionado(s)`)
        }
      }
    }
    input.click()
  }

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) return

    try {
      await uploadMultipleDocuments(uploadedFiles)
      setUploadedFiles([])
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Arquivos Anexados</h3>
        {uploadedFiles.length > 0 && (
          <Button
            onClick={handleUploadFiles}
            disabled={uploading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-3 h-3 mr-2" />
            {uploading ? 'Enviando...' : `Enviar ${uploadedFiles.length} arquivo(s)`}
          </Button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFileSelect}
          className="text-xs h-7"
        >
          {t('common.upload')}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Formatos suportados: JPG, PNG, PDF (máx. 10MB)
        </p>
      </div>

      {/* Pending Files to Upload */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Arquivos pendentes de envio:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm"
              >
                {file.type.startsWith('image/') ? (
                  <FileImage className="w-3 h-3 text-blue-600" />
                ) : (
                  <File className="w-3 h-3 text-blue-600" />
                )}
                <span className="truncate max-w-[150px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
                  }}
                  className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Documents */}
      {loading ? (
        <div className="text-center py-4 text-gray-500">
          <p>Carregando documentos...</p>
        </div>
      ) : documents.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Documentos enviados ({documents.length}):</p>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {doc.type.toLowerCase().includes('image') || doc.type.toLowerCase().includes('jpg') || doc.type.toLowerCase().includes('png') ? (
                    <FileImage className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      Enviado em {formatDate(doc.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.is_validated ? (
                      <TagBadge
                        label="Validado"
                        variant="green"
                        icon={CheckCircle}
                        size="xs"
                      />
                    ) : (
                      <TagBadge
                        label="Pendente"
                        variant="yellow"
                        icon={Clock}
                        size="xs"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadDocument(doc.id, doc.filename)}
                    className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    title="Baixar documento"
                  >
                    <Download className="w-3 h-3" />
                  </Button>

                  {isAdmin && !doc.is_validated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => validateDocument(doc.id)}
                      className="h-7 w-7 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                      title="Validar documento"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este documento?')) {
                        deleteDocument(doc.id)
                      }
                    }}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                    title="Excluir documento"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <File className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Nenhum documento anexado ainda</p>
          <p className="text-xs mt-1">Arraste arquivos ou clique em "Upload" para adicionar</p>
        </div>
      )}
    </div>
  )
}
