"use client"

import React, { useState, useMemo, useCallback } from "react"
import { X, Upload, FileText, DollarSign, Building2, Church, Trash2, Info, AlertCircle, Edit2, Check, Zap, ChevronRight, Plus, ChevronsUpDown, Loader2 } from "lucide-react"
import { useSubsidyReceipts } from "@/hooks/use-subsidy-receipts"
import { ValidationBadgesCarousel, type ValidationBadgeData } from "@/components/shared/validation-badges-carousel"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { TagBadge } from "@/components/ui/tag-badge"
import { useCurrency } from "@/contexts/currency-context"
import { useTranslation } from "react-i18next"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import toast from "react-hot-toast"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"

// Funding policies
const FUNDING_POLICIES = {
  max_institution_percent: 65,
  max_institution_amount: 5000,
  min_church_percent: 35,
  default_church_percent: 35,
  default_institution_percent: 65
}

interface SubsidyRequestItem {
  activity_id: string
  activity_name: string
  requested_amount: number
  budget_amount: number
  activity_documents: UploadedDocument[]
  notes: string
}

interface UploadedDocument {
  id: string
  file_name: string
  file_type: "PDF" | "JPG" | "PNG" | "DOC" | "OTHER"
  document_type: "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"
  amount: number
  file_url: string
  isExpanded?: boolean
}

interface RequestSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  selectedActivities: ProjectActivityData[]
  projectId: string
  institutionId?: string
  departmentId?: string
  churchId?: string
  // Display names
  institutionName?: string
  departmentName?: string
  churchName?: string
  /** Subsidy request ID (required for edit mode to upload files) */
  subsidyRequestId?: string
  onSubmit: (data: SubsidyRequestData) => Promise<string | void> // Returns subsidy ID in create mode
  allActivities?: ProjectActivityData[]
  /** Optional initial data to populate the form when editing */
  initialData?: Partial<SubsidyRequestData> | null
  /** Mode: create (default) or edit */
  mode?: "create" | "edit"
}

export interface SubsidyRequestData {
  institution_id: string
  department_id?: string
  church_id?: string
  project_id: string
  requested_amount: number
  notes: string
  items: SubsidyRequestItem[]
}

export function RequestSubsidyModal({
  isOpen,
  onClose,
  selectedActivities,
  projectId,
  institutionId = "",
  departmentId = "",
  churchId = "",
  institutionName = "",
  departmentName = "",
  churchName = "",
  subsidyRequestId,
  onSubmit,
  allActivities = [],
  initialData = null,
  mode = "create",
}: RequestSubsidyModalProps) {
  const { formatCurrency } = useCurrency()
  const { t, i18n } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [isEditingValues, setIsEditingValues] = useState(false)
  const [tempRequestedAmount, setTempRequestedAmount] = useState(0)
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false)
  const [availableActivities, setAvailableActivities] = useState<ProjectActivityData[]>([])
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map()) // Files pending upload (create mode)
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state for submission

  // Subsidy receipts hook for file uploads (only active in edit mode)
  const {
    uploading: uploadingReceipt,
    uploadReceipt,
    deleteReceipt,
  } = useSubsidyReceipts({
    subsidyRequestId: mode === "edit" ? subsidyRequestId : undefined,
  })
  
  // Get current translations
  const translations = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations] || subsidyRequestTranslations.en
  
  // Form data - initialize with selected activities
  const [formData, setFormData] = useState<SubsidyRequestData>({
    institution_id: institutionId,
    department_id: departmentId,
    church_id: churchId,
    project_id: projectId,
    requested_amount: 0,
    notes: "",
    items: []
  })

  // Update formData when modal opens in CREATE mode with selectedActivities
  React.useEffect(() => {
    if (isOpen && mode === "create" && selectedActivities.length > 0) {
      console.log('🆕 Create mode - Loading selectedActivities:', selectedActivities.length)
      setFormData({
        institution_id: institutionId,
        department_id: departmentId,
        church_id: churchId,
        project_id: projectId,
        requested_amount: 0,
        notes: "",
        items: selectedActivities.map(activity => ({
          activity_id: activity.id,
          activity_name: activity.name,
          requested_amount: activity.institution_requested_amount || 0,
          budget_amount: activity.budget_amount,
          activity_documents: [],
          notes: ""
        }))
      })
      setCurrentActivityIndex(0)
    }
  }, [isOpen, mode, selectedActivities, institutionId, departmentId, churchId, projectId])

  // If initialData is provided (edit mode), populate the form with it when opening
  React.useEffect(() => {
    console.log('🔍 Modal useEffect triggered:', { isOpen, mode, hasInitialData: !!initialData, initialDataItems: initialData?.items?.length || 0 })

    if (isOpen && initialData && mode === "edit") {
      console.log('📝 Edit mode - Loading initialData:', initialData)
      console.log('📝 initialData.items:', initialData.items)

      // In edit mode, always use initialData items (even if empty array)
      // Only fall back to selectedActivities if initialData.items is undefined
      const itemsToUse = initialData.items !== undefined
        ? initialData.items.map(item => ({
            activity_id: item.activity_id,
            activity_name: item.activity_name,
            requested_amount: item.requested_amount,
            budget_amount: item.budget_amount,
            activity_documents: item.activity_documents || [],
            notes: item.notes || ""
          }))
        : selectedActivities.map(activity => ({
            activity_id: activity.id,
            activity_name: activity.name,
            requested_amount: activity.institution_requested_amount || 0,
            budget_amount: activity.budget_amount,
            activity_documents: [],
            notes: ""
          }))

      setFormData({
        institution_id: initialData.institution_id || institutionId,
        department_id: initialData.department_id || departmentId,
        church_id: initialData.church_id || churchId,
        project_id: initialData.project_id || projectId,
        requested_amount: initialData.requested_amount || 0,
        notes: initialData.notes || "",
        items: itemsToUse
      })
      setCurrentActivityIndex(0)
    }
  }, [isOpen, initialData, mode, institutionId, departmentId, churchId, projectId, selectedActivities])

  // Calculate total requested amount
  const totalRequestedAmount = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + item.requested_amount, 0)
  }, [formData.items])

  // Update total when items change
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requested_amount: totalRequestedAmount
    }))
  }, [totalRequestedAmount])

  // Log when modal opens
  React.useEffect(() => {
    if (isOpen) {
      console.log('🟢 Modal de Subsídio aberto!')
      console.log('📋 Atividades recebidas:', selectedActivities.length)
      console.log('💰 Total solicitado:', totalRequestedAmount)
    }
  }, [isOpen, selectedActivities.length, totalRequestedAmount])

  // Load available subsidized activities
  React.useEffect(() => {
    if (isOpen && allActivities.length > 0) {
      const selectedIds = formData.items.map(item => item.activity_id)
      const available = allActivities.filter(
        act => act.is_subsidized && !selectedIds.includes(act.id)
      )
      setAvailableActivities(available)
      console.log('📊 Atividades disponíveis para adicionar:', {
        total: allActivities.length,
        subsidiadas: allActivities.filter(a => a.is_subsidized).length,
        jaSelecionadas: selectedIds.length,
        disponiveis: available.length,
        lista: available.map(a => ({ id: a.id, nome: a.name, subsidiada: a.is_subsidized }))
      })
    } else if (isOpen) {
      console.log('⚠️ Modal aberto mas sem atividades disponíveis:', {
        allActivitiesLength: allActivities.length,
        isOpen
      })
    }
  }, [isOpen, allActivities, formData.items])

  // Validação de atividade individual - função auxiliar
  const validateActivity = useCallback((item: SubsidyRequestItem) => {
    const hasRequestedAmount = item.requested_amount > 0
    const hasDocuments = item.activity_documents.length > 0
    const docTotal = item.activity_documents.reduce((sum, doc) => sum + (doc.amount || 0), 0)
    const hasValidDocumentAmounts = item.activity_documents.length > 0 
      ? item.activity_documents.every(doc => doc.amount && doc.amount > 0)
      : false
    const documentsMatchOrExceedRequest = hasDocuments && docTotal >= item.requested_amount
    
    return {
      hasRequestedAmount,
      hasDocuments,
      hasValidDocumentAmounts,
      documentsMatchOrExceedRequest,
      isComplete: hasRequestedAmount && hasDocuments && hasValidDocumentAmounts && documentsMatchOrExceedRequest,
      docTotal
    }
  }, [])

  // Gerar badges de validação para uma atividade
  const getValidationBadges = useCallback((item: SubsidyRequestItem): ValidationBadgeData[] => {
    const validation = validateActivity(item)
    
    return [
      {
        id: "requested-amount",
        label: "Valor Definido",
        value: validation.hasRequestedAmount ? formatCurrency(item.requested_amount) : "€0",
        isValid: validation.hasRequestedAmount,
        variant: validation.hasRequestedAmount ? "success" : "neutral"
      },
      {
        id: "documents",
        label: "Documentos",
        value: `${item.activity_documents.length} arquivo(s)`,
        isValid: validation.hasDocuments,
        variant: validation.hasDocuments ? "success" : "neutral"
      },
      {
        id: "document-amounts",
        label: "Valores OK",
        value: `${item.activity_documents.filter(d => d.amount > 0).length}/${item.activity_documents.length}`,
        isValid: validation.hasValidDocumentAmounts,
        variant: validation.hasValidDocumentAmounts ? "success" : "neutral"
      },
      {
        id: "total-valid",
        label: "Total Docs",
        value: formatCurrency(validation.docTotal),
        isValid: validation.documentsMatchOrExceedRequest,
        variant: validation.documentsMatchOrExceedRequest ? "success" : (validation.hasDocuments ? "warning" : "neutral")
      }
    ]
  }, [validateActivity, formatCurrency])

  // Validação geral de todas atividades - DEVE estar antes dos early returns
  const validateAllActivities = useMemo(() => {
    const results = formData.items.map(item => ({
      item,
      validation: validateActivity(item)
    }))
    
    const allComplete = results.every(r => r.validation.isComplete)
    const completedCount = results.filter(r => r.validation.isComplete).length
    
    return {
      results,
      allComplete,
      completedCount,
      totalCount: results.length
    }
  }, [formData.items, validateActivity])

  if (!isOpen) return null

  // Safety check
  if (!formData.items || formData.items.length === 0) {
    console.warn('⚠️ Modal aberto sem atividades!')
    return null
  }

  const currentItem = formData.items[currentActivityIndex]

  // Safety check for currentItem
  if (!currentItem) {
    console.error('❌ Item atual não encontrado no índice', currentActivityIndex)
    return null
  }

  const handleItemChange = (field: keyof SubsidyRequestItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, idx) => 
        idx === currentActivityIndex 
          ? { ...item, [field]: value }
          : item
      )
    }))
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    console.log('📤 handleFileUpload called:', {
      mode,
      subsidyRequestId,
      activityId: currentItem.activity_id,
      filesCount: files.length,
    })

    // Always store files locally first - upload happens on save with metadata
    const newDocuments: UploadedDocument[] = Array.from(files).map((file, idx) => {
      const tempId = `temp-${Date.now()}-${idx}`
      // Store file reference for later upload
      setPendingFiles(prev => new Map(prev).set(tempId, file))

      return {
        id: tempId,
        file_name: file.name,
        file_type: getFileType(file.name),
        document_type: "INVOICE" as const,
        amount: 0,
        file_url: URL.createObjectURL(file),
        isExpanded: true
      }
    })

    handleItemChange('activity_documents', [
      ...currentItem.activity_documents,
      ...newDocuments
    ])

    toast.success(`${newDocuments.length} arquivo(s) adicionado(s)`)
  }

  const getFileType = (filename: string): "PDF" | "JPG" | "PNG" | "DOC" | "OTHER" => {
    const ext = filename.split('.').pop()?.toUpperCase()
    if (ext === "PDF" || ext === "JPG" || ext === "PNG" || ext === "DOC") {
      return ext as "PDF" | "JPG" | "PNG" | "DOC"
    }
    return "OTHER"
  }

  const handleRemoveDocument = async (docId: string) => {
    // In edit mode with a real document ID (not temp-*), delete from backend
    if (mode === "edit" && !docId.startsWith('temp-')) {
      try {
        await deleteReceipt(docId)
      } catch (error) {
        console.error('Error deleting receipt:', error)
        return // Don't remove from local state if backend delete failed
      }
    } else if (docId.startsWith('temp-')) {
      // Remove from pending files map
      setPendingFiles(prev => {
        const newMap = new Map(prev)
        newMap.delete(docId)
        return newMap
      })
    }

    handleItemChange(
      'activity_documents',
      currentItem.activity_documents.filter(doc => doc.id !== docId)
    )
    toast.success("Documento removido")
  }

  const handleDocumentChange = (docId: string, field: keyof UploadedDocument, value: any) => {
    handleItemChange(
      'activity_documents',
      currentItem.activity_documents.map(doc => 
        doc.id === docId ? { ...doc, [field]: value } : doc
      )
    )
  }

  const handleAddActivities = (activities: ProjectActivityData[]) => {
    const newItems = activities.map(activity => ({
      activity_id: activity.id,
      activity_name: activity.name,
      requested_amount: 0,
      budget_amount: activity.budget_amount,
      activity_documents: [],
      notes: ""
    }))
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }))
    
    setIsAddActivityModalOpen(false)
    toast.success(`${activities.length} atividade(s) adicionada(s)`)
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.institution_id) {
      toast.error(translations.validation.institutionRequired)
      return
    }

    if (formData.items.length === 0) {
      toast.error(translations.validation.activityRequired)
      return
    }

    if (totalRequestedAmount <= 0) {
      toast.error(translations.validation.amountPositive)
      return
    }

    // Check if all activities have documents
    const activitiesWithoutDocs = formData.items.filter(item => item.activity_documents.length === 0)
    if (activitiesWithoutDocs.length > 0) {
      toast.error(translations.validation.documentsRequired)
      return
    }

    // Validate that total requested amount equals sum of document amounts for each activity
    for (const item of formData.items) {
      const docTotal = item.activity_documents.reduce((sum, doc) => sum + (doc.amount || 0), 0)
      if (Math.abs(item.requested_amount - docTotal) > 0.01) {
        toast.error(`${item.activity_name}: Valor solicitado (${formatCurrency(item.requested_amount)}) deve ser igual ao total dos documentos (${formatCurrency(docTotal)})`)
        return
      }
      // Check if all documents have amount > 0
      const docsWithoutAmount = item.activity_documents.filter(doc => !doc.amount || doc.amount <= 0)
      if (docsWithoutAmount.length > 0) {
        toast.error(`${item.activity_name}: Todos os documentos devem ter um valor preenchido`)
        return
      }
    }

    // In edit mode, upload pending files before submitting
    if (mode === "edit" && subsidyRequestId) {
      setIsSubmitting(true)
      try {
        // Upload all pending files with their metadata
        for (const item of formData.items) {
          for (const doc of item.activity_documents) {
            // Only upload documents with temp IDs
            if (doc.id.startsWith('temp-')) {
              const file = pendingFiles.get(doc.id)
              if (file) {
                console.log('📤 [Submit] Uploading pending file:', {
                  fileName: file.name,
                  activityId: item.activity_id,
                  amount: doc.amount,
                  type: doc.document_type
                })

                await uploadReceipt(file, subsidyRequestId, item.activity_id, {
                  type: doc.document_type === 'INVOICE' ? 'invoice' :
                        doc.document_type === 'RECEIPT' ? 'receipt' :
                        doc.document_type === 'CONTRACT' ? 'contract' :
                        doc.document_type === 'PROOF_OF_PAYMENT' ? 'proof_of_payment' : 'other',
                  amount: doc.amount
                })
              }
            }
          }
        }

        // Clear pending files after successful upload
        setPendingFiles(new Map())

        toast.success("Solicitação atualizada com sucesso")
        onSubmit(formData)
        onClose()
      } catch (error) {
        console.error('❌ [Submit] Upload error:', error)
        toast.error('Erro ao enviar arquivos. Tente novamente.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Create mode - submit and then upload files if subsidy ID is returned
      setIsSubmitting(true)
      try {
        const createdSubsidyId = await onSubmit(formData)
        
        if (createdSubsidyId && pendingFiles.size > 0) {
          console.log('📤 [Create] Uploading files for new subsidy:', createdSubsidyId)
          
          // Upload all pending files
          for (const item of formData.items) {
            for (const doc of item.activity_documents) {
              const file = pendingFiles.get(doc.id)
              if (file) {
                console.log('📤 [Create] Uploading file:', {
                  fileName: file.name,
                  activityId: item.activity_id,
                  amount: doc.amount,
                  type: doc.document_type
                })

                await uploadReceipt(file, createdSubsidyId, item.activity_id, {
                  type: doc.document_type === 'INVOICE' ? 'invoice' :
                        doc.document_type === 'RECEIPT' ? 'receipt' :
                        doc.document_type === 'CONTRACT' ? 'contract' :
                        doc.document_type === 'PROOF_OF_PAYMENT' ? 'proof_of_payment' : 'other',
                  amount: doc.amount
                })
              }
            }
          }
          
          console.log('✅ [Create] All files uploaded successfully')
        }
        
        toast.success(translations.success?.created || "Solicitação criada")
        setPendingFiles(new Map())
        onClose()
      } catch (error) {
        console.error('❌ [Create] Error:', error)
        toast.error('Erro ao criar solicitação ou enviar arquivos')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INVOICE: "Fatura",
      RECEIPT: "Recibo",
      CONTRACT: "Contrato",
      PROOF_OF_PAYMENT: "Comprovante",
      OTHER: "Outro"
    }
    return labels[type] || type
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Modal Container */}
      <div className="relative w-[65vw] h-[85vh] bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{translations.title}</h1>
                <p className="text-sm text-gray-500">
                  {formData.items.length === 1 
                    ? translations.selectedActivities.replace('{{count}}', formData.items.length.toString())
                    : translations.selectedActivities_plural.replace('{{count}}', formData.items.length.toString())
                  }
                </p>
              </div>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Summary Bar */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4">
              {/* Total Requested */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">{translations.summary.totalRequested}</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(totalRequestedAmount)}</p>
                </div>
              </div>

              {/* Institution */}
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">{translations.summary.institution}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {institutionName || "Não informado"}
                  </p>
                </div>
              </div>

              {/* Department (if applicable) */}
              {departmentId && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Departamento</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {departmentName || "Não informado"}
                    </p>
                  </div>
                </div>
              )}

              {/* Church */}
              <div className="flex items-center gap-2">
                <Church className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">{translations.summary.church}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {churchName || (churchId ? "Carregando..." : "Sem igreja registrada")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Descriptive Text - Click to Expand */}
          <div className="space-y-2">
            <button
              onClick={() => {
                const content = document.getElementById('subsidy-info-content')
                if (content) {
                  content.classList.toggle('hidden')
                }
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-700">{translations.about.title}</span>
            </button>
            
            <div id="subsidy-info-content" className="hidden px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">{translations.about.howItWorks}</p>
                <p>{translations.about.description}</p>
                <p dangerouslySetInnerHTML={{ __html: translations.about.distribution }} />
              </div>
            </div>
          </div>
          
          {/* Activity Navigation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{translations.activities.title}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-medium mb-1">{translations.activities.tooltip.title}</p>
                      <p className="text-xs">{translations.activities.tooltip.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentActivityIndex(Math.max(0, currentActivityIndex - 1))}
                  disabled={currentActivityIndex === 0}
                  className="h-7 px-2 text-xs"
                >
                  {translations.activities.previous}
                </Button>
                <span className="text-xs text-gray-600">
                  {translations.activities.ofTotal
                    .replace('{{current}}', (currentActivityIndex + 1).toString())
                    .replace('{{total}}', formData.items.length.toString())
                  }
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentActivityIndex(Math.min(formData.items.length - 1, currentActivityIndex + 1))}
                  disabled={currentActivityIndex === formData.items.length - 1}
                  className="h-7 px-2 text-xs"
                >
                  {translations.activities.next}
                </Button>
              </div>
            </div>

            {/* Validation Badges - Componente Reutilizável com Carrossel */}
            <ValidationBadgesCarousel
              badges={getValidationBadges(currentItem)}
              showCarousel={true}
              minBadgesForCarousel={4}
              className="mb-3"
            />

            {/* Activity Cards */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {formData.items.map((item, idx) => {
                const itemValidation = validateActivity(item)
                return (
                  <button
                    key={item.activity_id}
                    onClick={() => setCurrentActivityIndex(idx)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 transition-all relative ${
                      idx === currentActivityIndex
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Status Indicator */}
                    {itemValidation.isComplete && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        itemValidation.isComplete
                          ? 'bg-green-500 text-white'
                          : item.activity_documents.length > 0
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-medium ${
                          idx === currentActivityIndex ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {item.activity_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.activity_documents.length} doc{item.activity_documents.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
              
              {/* Add Activity Card - Minimalist */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsAddActivityModalOpen(true)}
                      disabled={availableActivities.length === 0}
                      className="flex-shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {availableActivities.length > 0 
                        ? `${availableActivities.length} atividade(s) subsidiada(s) disponível(is)`
                        : 'Nenhuma atividade subsidiada disponível'
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Current Activity Details */}
          <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">{currentItem.activity_name}</h4>
              <TagBadge
                label={formatCurrency(currentItem.budget_amount)}
                variant="gray"
                size="sm"
              />
            </div>

            {/* Budget Distribution - Focus on Institution Contribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">Contribuição da Instituição</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs font-medium mb-1">Valor da Solicitação</p>
                        <p className="text-xs">Este é o valor que a instituição contribuirá. O restante do orçamento será coberto pela igreja.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {isEditingValues ? (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingValues(false)
                        setTempRequestedAmount(0)
                      }}
                      className="h-7 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      {translations.budget.cancelButton}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        handleItemChange('requested_amount', tempRequestedAmount)
                        setIsEditingValues(false)
                        toast.success(translations.budget.saveButton)
                      }}
                      className="h-7 text-xs bg-gray-900 hover:bg-gray-800"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {translations.budget.saveButton}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempRequestedAmount(currentItem.requested_amount)
                      setIsEditingValues(true)
                    }}
                    className="h-7 text-xs"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    {translations.budget.editButton}
                  </Button>
                )}
              </div>

              {isEditingValues ? (
                // Edit Mode - Focus on Institution Amount
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {/* Funding Policy Badges */}
                  <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs bg-white border-gray-300 cursor-help">
                            <Info className="w-3 h-3 mr-1" />
                            {translations.budget.policies.maxPercent.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString())}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{translations.budget.policies.maxPercentTooltip.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString())}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs bg-white border-gray-300 cursor-help">
                            <Info className="w-3 h-3 mr-1" />
                            {translations.budget.policies.maxAmount.replace('{{amount}}', formatCurrency(FUNDING_POLICIES.max_institution_amount))}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{translations.budget.policies.maxAmountTooltip.replace('{{amount}}', formatCurrency(FUNDING_POLICIES.max_institution_amount))}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs bg-white border-gray-300 cursor-help">
                            <Info className="w-3 h-3 mr-1" />
                            {translations.budget.policies.minChurch.replace('{{percent}}', FUNDING_POLICIES.min_church_percent.toString())}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{translations.budget.policies.minChurchTooltip.replace('{{percent}}', FUNDING_POLICIES.min_church_percent.toString())}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Institution Value Input with Max Button */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">{translations.budget.requestedLabel}</span>
                      <span className="font-semibold text-gray-900">
                        {currentItem.budget_amount > 0 
                          ? translations.budget.percentageLabel.replace('{{percent}}', Math.round((tempRequestedAmount / currentItem.budget_amount) * 100).toString())
                          : translations.budget.percentageLabel.replace('{{percent}}', '0')
                        }
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={tempRequestedAmount}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0
                          const maxAllowed = Math.min(
                            (currentItem.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100,
                            FUNDING_POLICIES.max_institution_amount
                          )
                          if (value <= maxAllowed && value >= 0) {
                            setTempRequestedAmount(value)
                          } else if (value > maxAllowed) {
                            toast.error(translations.validation.maxAllowed.replace('{{amount}}', formatCurrency(maxAllowed)))
                          }
                        }}
                        className="h-9 text-sm font-medium flex-1"
                        min={0}
                        max={Math.min(
                          (currentItem.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100,
                          FUNDING_POLICIES.max_institution_amount
                        )}
                        placeholder={translations.budget.placeholder}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const maxAllowed = Math.min(
                                  (currentItem.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100,
                                  FUNDING_POLICIES.max_institution_amount
                                )
                                setTempRequestedAmount(maxAllowed)
                                toast.success(`${translations.budget.maxButton}: ${formatCurrency(maxAllowed)}`)
                              }}
                              className="h-9 px-3"
                            >
                              <Zap className="w-4 h-4 mr-1" />
                              {translations.budget.maxButton}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{translations.budget.maxButtonTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Calculated Values Display */}
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{translations.budget.totalBudget}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(currentItem.budget_amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{translations.budget.institutionContribution}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(tempRequestedAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Church className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{translations.budget.churchRemainder}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(Math.max(0, currentItem.budget_amount - tempRequestedAmount))}
                      </span>
                    </div>
                  </div>

                  {/* Info box with limit */}
                  {(() => {
                    const maxAllowed = Math.min(
                      (currentItem.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100,
                      FUNDING_POLICIES.max_institution_amount
                    )
                    return (
                      <div className="flex items-start gap-2 text-xs text-gray-500 bg-white p-2 rounded border border-gray-200">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-700 mb-0.5">{translations.budget.limitTitle}</p>
                          <p>{translations.budget.limitMaxAllowed} <span className="font-semibold text-gray-900">{formatCurrency(maxAllowed)}</span></p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                // View Mode - Show Institution Request with Auto-calculated Church Value
                <div className="space-y-3">
                  {/* Main Institution Request Card */}
                  <div className="p-4 rounded-lg border-2 border-gray-300 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">{translations.budget.requestedValue}</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{translations.budget.requestedValueTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentItem.requested_amount)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentItem.budget_amount > 0 
                        ? translations.budget.percentOfTotal.replace('{{percent}}', Math.round((currentItem.requested_amount / currentItem.budget_amount) * 100).toString())
                        : translations.budget.percentOfTotal.replace('{{percent}}', '0')
                      }
                    </p>
                  </div>

                  {/* Budget Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Total Budget */}
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{translations.budget.totalBudgetLabel}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(currentItem.budget_amount)}</p>
                    </div>

                    {/* Church Contribution */}
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-1 mb-1">
                        <Church className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{translations.budget.churchRemainderLabel}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(Math.max(0, currentItem.budget_amount - currentItem.requested_amount))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">{translations.activityNotes.label}</Label>
              <Textarea
                value={currentItem.notes}
                onChange={(e) => handleItemChange('notes', e.target.value)}
                placeholder={translations.activityNotes.placeholder}
                className="min-h-[80px] text-sm resize-none border-2 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{translations.documents.title}</h3>
                <Badge variant={currentItem.activity_documents.length > 0 ? "default" : "secondary"}>
                  {currentItem.activity_documents.length}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-medium mb-1">{translations.documents.tooltip.title}</p>
                      <p className="text-xs">{translations.documents.tooltip.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                uploadingReceipt
                  ? 'border-gray-300 bg-gray-50 opacity-70 cursor-not-allowed'
                  : dragActive
                    ? 'border-gray-400 bg-gray-100'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={(e) => { e.preventDefault(); if (!uploadingReceipt) setDragActive(true) }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                if (!uploadingReceipt) handleFileUpload(e.dataTransfer.files)
              }}
            >
              {uploadingReceipt ? (
                <Loader2 className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm text-gray-600 mb-1">
                {uploadingReceipt ? "Enviando arquivo..." : translations.documents.dropZone.dragText}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={uploadingReceipt}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.multiple = true
                  input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx'
                  input.onchange = (e: any) => handleFileUpload(e.target.files)
                  input.click()
                }}
                className="text-xs h-7 mt-2"
              >
                {uploadingReceipt ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3 mr-1" />
                )}
                {uploadingReceipt ? "Enviando..." : translations.documents.dropZone.selectButton}
              </Button>
              <p className="text-xs text-gray-500 mt-2">{translations.documents.dropZone.acceptedFormats}</p>
            </div>

            {/* Document List */}
            {currentItem.activity_documents.length > 0 && (
              <div className="space-y-2">
                {currentItem.activity_documents.map((doc) => {
                  const isExpanded = expandedDocs.has(doc.id)
                  const docTotal = currentItem.activity_documents.reduce((sum, d) => sum + (d.amount || 0), 0)
                  const isValidAmount = doc.amount && doc.amount > 0
                  
                  return (
                    <div key={doc.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                      {/* Document Header - Always Visible */}
                      <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => {
                              setExpandedDocs(prev => {
                                const newSet = new Set(prev)
                                if (newSet.has(doc.id)) {
                                  newSet.delete(doc.id)
                                } else {
                                  newSet.add(doc.id)
                                }
                                return newSet
                              })
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronRight className="w-4 h-4 text-gray-500 transform rotate-90 transition-transform" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500 transition-transform" />
                            )}
                          </button>
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</span>
                          <Badge variant="outline" className="text-xs">{doc.file_type}</Badge>
                          {isValidAmount && (
                            <Badge variant="outline" className="text-xs font-semibold">
                              {formatCurrency(doc.amount)}
                            </Badge>
                          )}
                          {!isValidAmount && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                              Valor pendente
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Document Details - Collapsible */}
                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3 animate-in fade-in-0 duration-200">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Document Type */}
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-600">
                                {translations.documents.typeLabel} *
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full h-9 text-xs justify-between font-normal"
                                  >
                                    {doc.document_type
                                      ? getDocumentTypeLabel(doc.document_type)
                                      : "Selecionar tipo"}
                                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder="Buscar tipo..." className="h-9" />
                                    <CommandList>
                                      <CommandEmpty>Nenhum tipo encontrado</CommandEmpty>
                                      <CommandGroup>
                                        <CommandItem
                                          value="INVOICE"
                                          onSelect={() => handleDocumentChange(doc.id, 'document_type', 'INVOICE')}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              doc.document_type === 'INVOICE' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                          />
                                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                          {translations.documents.types.invoice}
                                        </CommandItem>
                                        <CommandItem
                                          value="RECEIPT"
                                          onSelect={() => handleDocumentChange(doc.id, 'document_type', 'RECEIPT')}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              doc.document_type === 'RECEIPT' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                          />
                                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                          {translations.documents.types.receipt}
                                        </CommandItem>
                                        <CommandItem
                                          value="CONTRACT"
                                          onSelect={() => handleDocumentChange(doc.id, 'document_type', 'CONTRACT')}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              doc.document_type === 'CONTRACT' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                          />
                                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                          {translations.documents.types.contract}
                                        </CommandItem>
                                        <CommandItem
                                          value="PROOF_OF_PAYMENT"
                                          onSelect={() => handleDocumentChange(doc.id, 'document_type', 'PROOF_OF_PAYMENT')}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              doc.document_type === 'PROOF_OF_PAYMENT' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                          />
                                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                          {translations.documents.types.proofOfPayment}
                                        </CommandItem>
                                        <CommandItem
                                          value="OTHER"
                                          onSelect={() => handleDocumentChange(doc.id, 'document_type', 'OTHER')}
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              doc.document_type === 'OTHER' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                          />
                                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                          {translations.documents.types.other}
                                        </CommandItem>
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Amount */}
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-600">
                                {translations.documents.amountLabel} *
                              </Label>
                              <Input
                                type="number"
                                value={doc.amount || ""}
                                onChange={(e) => {
                                  const value = e.target.value ? Number(e.target.value) : 0
                                  handleDocumentChange(doc.id, 'amount', value)
                                }}
                                className={`h-9 text-xs ${!isValidAmount ? 'border-red-300' : ''}`}
                                placeholder="0.00"
                                min={0}
                                step="0.01"
                              />
                            </div>
                          </div>

                          {/* Validation Info */}
                          <div className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                            <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium">Total documentos:</span> {formatCurrency(docTotal)}
                              </p>
                              <p>
                                <span className="font-medium">Valor solicitado:</span> {formatCurrency(currentItem.requested_amount)}
                              </p>
                              {Math.abs(currentItem.requested_amount - docTotal) > 0.01 && (
                                <p className="text-amber-600 font-medium">
                                  Diferença: {formatCurrency(Math.abs(currentItem.requested_amount - docTotal))}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Warning if no documents */}
            {currentItem.activity_documents.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  {translations.documents.warningNoDocuments}
                </p>
              </div>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">{translations.generalNotes.label}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs font-medium mb-1">{translations.generalNotes.tooltip.title}</p>
                    <p className="text-xs">{translations.generalNotes.tooltip.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={translations.generalNotes.placeholder}
              className="min-h-[100px] text-sm resize-none border-2 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            {/* Progress Badge */}
            <div className={`px-3 py-2 rounded-lg border-2 transition-all ${
              validateAllActivities.allComplete
                ? 'border-green-500 bg-green-50'
                : 'border-amber-500 bg-amber-50'
            }`}>
              <div className="flex items-center gap-2">
                {validateAllActivities.allComplete ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <div>
                  <p className={`text-xs font-semibold ${
                    validateAllActivities.allComplete ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {validateAllActivities.completedCount}/{validateAllActivities.totalCount} Completas
                  </p>
                  <p className="text-xs text-gray-600">
                    {validateAllActivities.allComplete ? 'Pronto para enviar' : 'Pendente validação'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">{translations.footer.totalRequested}</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalRequestedAmount)}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <p className="text-xs text-gray-500">{translations.footer.activities}</p>
                <p className="text-sm font-semibold text-gray-900">{formData.items.length}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <p className="text-xs text-gray-500">{translations.footer.documents}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.items.reduce((sum, item) => sum + item.activity_documents.length, 0)}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                size="sm"
                className="h-9 px-4"
              >
                {translations.buttons.cancel}
              </Button>
              <Button
                onClick={handleSubmit}
                size="sm"
                disabled={!validateAllActivities.allComplete || isSubmitting}
                className="h-9 px-4 bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <DollarSign className="w-4 h-4 mr-1" />
                )}
                {isSubmitting
                  ? "Enviando arquivos..."
                  : mode === "edit"
                    ? "Salvar alterações"
                    : translations.buttons.submit}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Atividades */}
      <Dialog open={isAddActivityModalOpen} onOpenChange={setIsAddActivityModalOpen}>
        <DialogContent className="w-[90vw] max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-gray-700" />
              Adicionar Atividades Subsidiadas
            </DialogTitle>
            <DialogDescription>
              Selecione atividades subsidiadas do projeto para adicionar à solicitação de subsídio.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {availableActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Nenhuma atividade disponível
                </p>
                <p className="text-xs text-gray-500">
                  Todas as atividades subsidiadas já foram adicionadas.
                </p>
              </div>
            ) : (
              <AddActivitiesTable
                activities={availableActivities}
                onAdd={handleAddActivities}
                onCancel={() => setIsAddActivityModalOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente interno para tabela de seleção de atividades
function AddActivitiesTable({ 
  activities, 
  onAdd, 
  onCancel 
}: { 
  activities: ProjectActivityData[]
  onAdd: (activities: ProjectActivityData[]) => void
  onCancel: () => void
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { formatCurrency } = useCurrency()

  const toggleActivity = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === activities.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(activities.map(a => a.id)))
    }
  }

  const handleAdd = () => {
    const selected = activities.filter(a => selectedIds.has(a.id))
    onAdd(selected)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2 border-b">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.size === activities.length && activities.length > 0}
            onCheckedChange={toggleAll}
          />
          <span className="text-sm font-medium text-gray-700">
            Selecionar todas ({selectedIds.size}/{activities.length})
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {activities.map(activity => (
          <div
            key={activity.id}
            onClick={() => toggleActivity(activity.id)}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
              selectedIds.has(activity.id)
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Checkbox
              checked={selectedIds.has(activity.id)}
              onCheckedChange={() => toggleActivity(activity.id)}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.name}</p>
              <p className="text-xs text-gray-500">{activity.description || 'Sem descrição'}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="font-semibold">
                {formatCurrency(activity.budget_amount)}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleAdd} 
          disabled={selectedIds.size === 0}
          className="bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
        </Button>
      </div>
    </div>
  )
}
