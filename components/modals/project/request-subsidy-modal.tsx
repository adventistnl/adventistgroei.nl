"use client"

import React, { useState, useMemo, useCallback } from "react"
import { X, Upload, FileText, DollarSign, Building2, Church, Trash2, Info, AlertCircle, Edit2, Check, Zap, ChevronRight, Plus, ChevronsUpDown, Loader2, Layers } from "lucide-react"
import { useSubsidyReceipts } from "@/hooks/use-subsidy-receipts"
import { ValidationBadgesCarousel, type ValidationBadgeData } from "@/components/shared/validation-badges-carousel"
import { SubsidyValidationInfo } from "./subsidy-validation-info"
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
import { useInstitution } from "@/contexts/institution-context"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"
import { SelectActivitiesModal } from "./select-activities-modal"
import { WithPermission } from "@/hocs/with-permission"
import { useHasPermission } from "@/hooks/use-has-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

// Funding policies
const FUNDING_POLICIES = {
  max_institution_percent: 65,
  max_institution_amount: 5000,
  min_church_percent: 35,
  default_church_percent: 35,
  default_institution_percent: 65
}

// ─── Unified request type ─────────────────────────────────────────────────────
export type RequestType = "advance" | "without_document" | "with_document"

interface SubsidyRequestItem {
  activity_id: string
  activity_name: string
  requested_amount: number
  budget_amount: number
  /** Original institution-approved amount from the funding plan (used for MAX button) */
  institution_requested_amount?: number
  activity_documents: UploadedDocument[]
  notes: string
  existing_receipt_updates?: {
    receipt_id: string
    amount: number
    type: string
  }[]
}

interface UploadedDocument {
  id: string
  file_name: string
  file_type: "PDF" | "JPG" | "PNG" | "DOC" | "OTHER"
  document_type: "INVOICE" | "RECEIPT" | "CONTRACT" | "PROOF_OF_PAYMENT" | "OTHER"
  amount: number
  file_url: string
  isExpanded?: boolean
  origin?: 'NEW' | 'ACTIVITY' | 'EXISTING_RECEIPT'
}

interface RequestSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  selectedActivities: ProjectActivityData[]
  projectId: string
  institutionId?: string
  departmentId?: string
  churchId?: string
  churchDepartmentId?: string
  // Display names
  institutionName?: string
  departmentName?: string
  churchName?: string
  churchDepartmentName?: string
  /** Annual budget allocated to the institutional department (from annual_budgets for current year) */
  departmentAllocatedBudget?: number
  /** Total expenses already recorded in the institutional department budget for the current year */
  departmentBudgetUsed?: number
  /** Year of the department annual budget being shown */
  departmentBudgetYear?: number
  /** Subsidy request ID (required for edit mode to upload files) */
  subsidyRequestId?: string
  onSubmit: (data: SubsidyRequestData) => Promise<string | void> // Returns subsidy ID in create mode
  allActivities?: ProjectActivityData[]
  /** Optional initial data to populate the form when editing */
  initialData?: Partial<SubsidyRequestData> | null
  /** Mode: create (default) or edit */
  mode?: "create" | "edit"
  /** IDs of activities that already have subsidies */
  subsidizedActivityIds?: string[]
  availableBudget?: number
  /** Subsidized budget of the project (used for advance max calculation) */
  subsidizedBudget?: number
  /** Project name for advance form display */
  projectName?: string
  /** Pre-select request type when modal opens (default: "with_document") */
  initialRequestType?: RequestType
  /** Called when advance type is submitted; receives the approved advance amount */
  onAdvanceSubmit?: (advanceAmount: number) => Promise<void>
  /** Total amount already committed in other subsidy requests for this project (excluding rejected) */
  totalAlreadyRequested?: number
}

export interface SubsidyRequestData {
  institution_id: string
  department_id?: string
  church_id?: string
  project_id: string
  requested_amount: number
  is_for_advance?: boolean
  /** Type that routes to the correct backend mutation */
  request_type?: 'WITH_DOCUMENT' | 'WITHOUT_DOCUMENT' | 'ADVANCE'
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
  churchDepartmentId = "",
  institutionName = "",
  departmentName = "",
  churchName = "",
  churchDepartmentName = "",
  departmentAllocatedBudget = 0,
  departmentBudgetUsed = 0,
  departmentBudgetYear,
  subsidyRequestId,
  onSubmit,
  allActivities = [],
  initialData = null,
  mode = "create",
  subsidizedActivityIds = [],
  availableBudget = 0,
  subsidizedBudget = 0,
  projectName,
  initialRequestType,
  onAdvanceSubmit,
  totalAlreadyRequested = 0,
}: RequestSubsidyModalProps) {
  const { formatCurrency, selectedCurrency } = useCurrency()
  const { t, i18n } = useTranslation()
  const [dragActive, setDragActive] = useState(false)

  // ── Unified request type ────────────────────────────────────────────────────
  const [requestType, setRequestType] = useState<RequestType>(initialRequestType ?? "with_document")
  const [advanceAmount, setAdvanceAmount] = useState<string>("")
  const [advanceConfirmed, setAdvanceConfirmed] = useState(false)
  const [advanceError, setAdvanceError] = useState<string | null>(null)
  const maxAdvance = subsidizedBudget * 0.5

  // without_document: awareness checkbox
  const [withoutDocConfirmed, setWithoutDocConfirmed] = useState(false)

  // Reset advance state when modal opens / type changes
  React.useEffect(() => {
    if (isOpen) {
      setRequestType(initialRequestType ?? "with_document")
      setAdvanceAmount("")
      setAdvanceConfirmed(false)
      setAdvanceError(null)
      setWithoutDocConfirmed(false)
    }
  }, [isOpen, initialRequestType])
  
  // Permission checks
  const canUpdate = useHasPermission([PermissionResolverName.UpdateSubsidyRequest])
  const canDelete = useHasPermission([PermissionResolverName.DeleteSubsidyRequest])
  const canCreate = useHasPermission([PermissionResolverName.CreateSubsidyRequest])
  
  // Determine if user can save based on mode
  const canSave = mode === "edit" ? canUpdate : canCreate
  
  // Usar useInstitution para obter dados da instituição (mesmo processo do project-data-step)
  const { currentInstitutionData } = useInstitution()
  
  // Extrair church departments usando o mesmo processo do project-data-step
  const allChurchDepartments = useMemo(() => {
    const institutionChurches = currentInstitutionData?.churches || []
    return institutionChurches.flatMap(church => 
      church.departments?.map(department => ({ 
        ...department, 
        church_id: church.id,
        church_name: church.name 
      })) || []
    )
  }, [currentInstitutionData?.churches])
  
  // Buscar church_department pelo churchDepartmentId passado via props
  const resolvedChurchDepartment = useMemo(() => {
    if (!churchDepartmentId) return null
    return allChurchDepartments.find(dept => dept.id === churchDepartmentId)
  }, [churchDepartmentId, allChurchDepartments])
  
  // Usar o nome do church_department encontrado, ou o passado via props como fallback
  const finalChurchDepartmentName = resolvedChurchDepartment?.name || churchDepartmentName
  
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
  
  // Helper function to get file type from filename
  const getFileType = (filename: string): "PDF" | "JPG" | "PNG" | "DOC" | "OTHER" => {
    const ext = filename.split('.').pop()?.toUpperCase()
    if (ext === "PDF" || ext === "JPG" || ext === "PNG" || ext === "DOC") {
      return ext as "PDF" | "JPG" | "PNG" | "DOC"
    }
    return "OTHER"
  }
  
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
      setFormData({
        institution_id: institutionId,
        department_id: departmentId,
        church_id: churchId,
        project_id: projectId,
        requested_amount: 0,
        notes: "",
        items: selectedActivities.map(activity => {
          // Map existing activity documents
          const existingDocs: UploadedDocument[] = (activity.activity_documents || []).map(doc => ({
            id: doc.id,
            file_name: doc.filename,
            file_type: getFileType(doc.filename),
            document_type: (doc.type === 'invoice' ? 'INVOICE' : 
                           doc.type === 'receipt' ? 'RECEIPT' : 
                           doc.type === 'contract' ? 'CONTRACT' : 
                           doc.type === 'proof_of_payment' ? 'PROOF_OF_PAYMENT' : 'OTHER'),
            amount: 0, // Activity docs usually don't have amount for subsidy yet
            file_url: doc.file_url,
            isExpanded: false,
            origin: 'ACTIVITY'
          }))

          return {
            activity_id: activity.id,
            activity_name: activity.name,
            requested_amount: activity.institution_requested_amount || 0,
            budget_amount: activity.budget_amount,
            institution_requested_amount: activity.institution_requested_amount,
            activity_documents: existingDocs,
            notes: ""
          }
        })
      })
      setCurrentActivityIndex(0)
    }
  }, [isOpen, mode, selectedActivities, institutionId, departmentId, churchId, projectId])

  // If initialData is provided (edit mode), populate the form with it when opening
  React.useEffect(() => {
    if (isOpen && initialData && mode === "edit") {

      // In edit mode, always use initialData items (even if empty array)
      // Only fall back to selectedActivities if initialData.items is undefined
      const itemsToUse = initialData.items !== undefined
        ? initialData.items.map(item => ({
            activity_id: item.activity_id,
            activity_name: item.activity_name,
            requested_amount: item.requested_amount,
            budget_amount: item.budget_amount,
            activity_documents: (item.activity_documents || []).map(doc => ({
              ...doc,
              origin: doc.origin || 'EXISTING_RECEIPT'
            })),
            notes: item.notes || ""
          }))
        : selectedActivities.map(activity => ({
            activity_id: activity.id,
            activity_name: activity.name,
            // If we are in a context where we know it's for advance (passed via props? no), we can't easily know here.
            // But usually Create Mode uses standard logic.
            // For the specific issue of "Link Activity" -> "Edit", the data comes from `initialData.items` which we fixed in page.tsx.
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
        is_for_advance: initialData.is_for_advance,
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
      // Logs preserved for debugging
    }
  }, [isOpen, selectedActivities.length, totalRequestedAmount, availableBudget, mode, initialData])

  // Load available activities for the add-activity picker
  // NOTE: does NOT filter by is_subsidized here — let the modal itself handle that via filterSubsidized prop.
  // Also update whenever formData.items changes so already-added activities are excluded.
  React.useEffect(() => {
    if (isOpen) {
      const alreadyAddedIds = new Set(formData.items.map(item => item.activity_id))
      const available = allActivities.filter(act => !alreadyAddedIds.has(act.id))
      setAvailableActivities(available)
    }
  }, [isOpen, allActivities, formData.items])

  // Validação de atividade individual — ciente do tipo de solicitação selecionado
  // WITHOUT_DOCUMENT e ADVANCE não exigem documentos; apenas requestedAmount > 0 é suficiente
  const validateActivity = useCallback((item: SubsidyRequestItem) => {
    const hasRequestedAmount = item.requested_amount > 0
    const hasDocuments = item.activity_documents.length > 0
    const docTotal = item.activity_documents.reduce((sum, doc) => sum + (doc.amount || 0), 0)
    const hasValidDocumentAmounts = item.activity_documents.length > 0
      ? item.activity_documents.every(doc => doc.amount && doc.amount > 0)
      : false

    // Documents must match or exceed request, but NOT exceed (with 0.01 tolerance)
    const documentsMatchOrExceedRequest = hasDocuments && docTotal >= item.requested_amount
    const documentsDoNotExceedRequest = hasDocuments && docTotal <= item.requested_amount + 0.01
    const documentsMatchRequest = documentsMatchOrExceedRequest && documentsDoNotExceedRequest

    // For types that don't require documents, isComplete only needs a positive amount
    const requiresDocs = requestType === 'with_document'
    const isComplete = requiresDocs
      ? hasRequestedAmount && hasDocuments && hasValidDocumentAmounts && documentsMatchRequest
      : hasRequestedAmount

    return {
      hasRequestedAmount,
      hasDocuments,
      hasValidDocumentAmounts,
      documentsMatchOrExceedRequest,
      documentsDoNotExceedRequest,
      documentsMatchRequest,
      isComplete,
      docTotal
    }
  }, [requestType]) // requestType is a dependency — validation logic changes by type

  // Gerar badges de validação para uma atividade
  const getValidationBadges = useCallback((item: SubsidyRequestItem): ValidationBadgeData[] => {
    const validation = validateActivity(item)
    
    return [
      {
        id: "requested-amount",
        label: translations.validationBadges.valueDefined,
        value: validation.hasRequestedAmount ? formatCurrency(item.requested_amount) : `${selectedCurrency.symbol}0`,
        isValid: validation.hasRequestedAmount,
        variant: validation.hasRequestedAmount ? "success" : "neutral"
      },
      {
        id: "documents",
        label: translations.validationBadges.documents,
        value: `${item.activity_documents.length} ${translations.validationBadges.files}`,
        isValid: validation.hasDocuments,
        variant: validation.hasDocuments ? "success" : "neutral"
      },
      {
        id: "document-amounts",
        label: translations.validationBadges.valuesOk,
        value: `${item.activity_documents.filter(d => d.amount > 0).length}/${item.activity_documents.length}`,
        isValid: validation.hasValidDocumentAmounts,
        variant: validation.hasValidDocumentAmounts ? "success" : "neutral"
      },
      {
        id: "total-valid",
        label: translations.validationBadges.totalDocs,
        value: formatCurrency(validation.docTotal),
        isValid: validation.documentsMatchRequest,
        variant: validation.documentsMatchRequest 
          ? "success" 
          : (validation.documentsMatchOrExceedRequest && !validation.documentsDoNotExceedRequest) 
            ? "error" 
            : (validation.hasDocuments ? "warning" : "neutral")
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
  }, [formData.items, validateActivity, requestType])

  /** Unified canSubmit per request type */
  const canSubmit = requestType === 'advance'
    ? !!advanceAmount && parseFloat(advanceAmount) > 0 && parseFloat(advanceAmount) <= maxAdvance && advanceConfirmed && availableBudget > 0
    : requestType === 'without_document'
    ? formData.items.length > 0 &&
      formData.items.every(item => item.requested_amount > 0) &&
      formData.notes.trim().length > 0 &&
      withoutDocConfirmed &&
      availableBudget > 0 &&
      totalRequestedAmount <= availableBudget
    : validateAllActivities.allComplete && availableBudget > 0 && totalRequestedAmount <= availableBudget

  // Per-type validation checklist items (for footer)
  const withoutDocChecks = [
    {
      id: 'activities',
      label: i18n.language === 'pt' ? 'Atividades com valor definido' : i18n.language === 'nl' ? 'Activiteiten met waarde' : 'Activities with value',
      ok: formData.items.length > 0 && formData.items.every(item => item.requested_amount > 0),
    },
    {
      id: 'notes',
      label: i18n.language === 'pt' ? 'Justificativa geral preenchida' : i18n.language === 'nl' ? 'Toelichting ingevuld' : 'General notes filled',
      ok: formData.notes.trim().length > 0,
    },
    {
      id: 'confirm',
      label: i18n.language === 'pt' ? 'Ciente sobre possível devolução' : i18n.language === 'nl' ? 'Bewust van mogelijke terugbetaling' : 'Aware of potential refund',
      ok: withoutDocConfirmed,
    },
  ]

  if (!isOpen) return null

  // All request types can open with 0 activities — user adds them via SelectActivitiesModal
  const _currentItem = (requestType === 'advance' || formData.items.length === 0)
    ? null
    : formData.items[currentActivityIndex] ?? null

  const currentItem = _currentItem as SubsidyRequestItem

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

    toast.success(translations.toasts.filesAdded.replace('{{count}}', newDocuments.length.toString()))
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
    toast.success(translations.toasts.documentRemoved)
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
    const newItems = activities.map(activity => {
      // Pre-fill with institution_requested_amount if the activity already has a known subsidized value,
      // otherwise default to 0 so the user fills it in (or uses the MAX button).
      // Cap at availableBudget to never exceed the project's remaining budget.
      const preFilledAmount = activity.institution_requested_amount && activity.institution_requested_amount > 0
        ? Math.min(activity.institution_requested_amount, availableBudget)
        : 0
      return {
        activity_id: activity.id,
        activity_name: activity.name,
        requested_amount: preFilledAmount,
        budget_amount: activity.budget_amount,
        institution_requested_amount: activity.institution_requested_amount,
        activity_documents: [],
        notes: ""
      }
    })
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }))
    
    setIsAddActivityModalOpen(false)
    toast.success(translations.toasts.activitiesAdded.replace('{{count}}', activities.length.toString()))
  }

  const handleSubmit = async () => {
    // ── Advance type: simple amount + confirmation ──────────────────────────
    if (requestType === 'advance') {
      const numValue = parseFloat(advanceAmount)
      if (isNaN(numValue) || numValue <= 0) {
        setAdvanceError(translations.validation?.amountPositive ?? 'Amount must be positive')
        return
      }
      if (numValue > maxAdvance) {
        setAdvanceError(
          i18n.language === 'pt'
            ? `O valor excede 50% do orçamento subsidiado (máx: ${formatCurrency(maxAdvance)})`
            : i18n.language === 'nl'
            ? `Bedrag overschrijdt 50% van het gesubsidieerde budget (max: ${formatCurrency(maxAdvance)})`
            : `Amount exceeds 50% of the subsidized budget (max: ${formatCurrency(maxAdvance)})`
        )
        return
      }
      if (!advanceConfirmed) {
        setAdvanceError(
          i18n.language === 'pt'
            ? 'Confirme que você entende os termos do adiantamento'
            : i18n.language === 'nl'
            ? 'Bevestig dat u de voorwaarden begrijpt'
            : 'Please confirm that you understand the advance terms'
        )
        return
      }
      setIsSubmitting(true)
      try {
        await onAdvanceSubmit?.(numValue)
        setAdvanceAmount('')
        setAdvanceConfirmed(false)
        setAdvanceError(null)
        onClose()
      } catch (err) {
        setAdvanceError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // ── Without document: extra validations ─────────────────────────────────
    if (requestType === 'without_document') {
      if (!formData.notes.trim()) {
        toast.error(
          i18n.language === 'pt' ? 'A justificativa geral é obrigatória.' :
          i18n.language === 'nl' ? 'De toelichting is verplicht.' :
          'General notes are required.'
        )
        return
      }
      if (!withoutDocConfirmed) {
        toast.error(
          i18n.language === 'pt' ? 'Confirme que está ciente sobre a possibilidade de devolução.' :
          i18n.language === 'nl' ? 'Bevestig dat u op de hoogte bent van mogelijke terugbetaling.' :
          'Please confirm awareness of the potential refund obligation.'
        )
        return
      }
    }

    const requireDocuments = requestType === 'with_document'

    // Validation — resolve institution_id with context fallback
    const resolvedInstitutionId = formData.institution_id || currentInstitutionData?.id || ""
    if (!resolvedInstitutionId) {
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

    if (totalRequestedAmount > availableBudget + 0.01) {
      toast.error(translations.toasts.budgetExceeded
        .replace('{{requested}}', formatCurrency(totalRequestedAmount))
        .replace('{{available}}', formatCurrency(availableBudget)))
      return
    }

    if (requireDocuments) {
      // Check if all activities have documents
      const activitiesWithoutDocs = formData.items.filter(item => item.activity_documents.length === 0)
      if (activitiesWithoutDocs.length > 0) {
        toast.error(translations.validation.documentsRequired)
        return
      }

      // Validate that total requested amount equals sum of document amounts
      for (const item of formData.items) {
        const docTotal = item.activity_documents.reduce((sum, doc) => sum + (doc.amount || 0), 0)
        if (Math.abs(item.requested_amount - docTotal) > 0.01) {
          toast.error(translations.toasts.documentAmountMismatch
            .replace('{{activity}}', item.activity_name)
            .replace('{{requested}}', formatCurrency(item.requested_amount))
            .replace('{{total}}', formatCurrency(docTotal)))
          return
        }
        const docsWithoutAmount = item.activity_documents.filter(doc => !doc.amount || doc.amount <= 0)
        if (docsWithoutAmount.length > 0) {
          toast.error(translations.toasts.documentsNeedAmount.replace('{{activity}}', item.activity_name))
          return
        }
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

        const finalData = {
          ...formData,
          institution_id: resolvedInstitutionId,
          id: subsidyRequestId,
          items: formData.items.map(item => ({
             ...item,
             // Ensure we don't send existing_receipt_updates as requested
             existing_receipt_updates: undefined,
             // Also ensure we don't inadvertently send full documents as DTO might not expect them in some fields
             // The backend DTO for UpdateSubsidyRequestItemInput only expects specific fields.
          }))
        }

        // Clear pending files after successful upload
        setPendingFiles(new Map())

        toast.success(translations.toasts.requestUpdated)
        onSubmit(finalData)
        onClose()
      } catch (error) {
        console.error('❌ [Submit] Upload error:', error)
        toast.error(translations.toasts.uploadError)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Create mode - submit and then upload files if subsidy ID is returned
      setIsSubmitting(true)
      try {
        const submitPayload: SubsidyRequestData = {
          ...formData,
          institution_id: resolvedInstitutionId,
          request_type: requestType === 'with_document' ? 'WITH_DOCUMENT'
            : requestType === 'without_document' ? 'WITHOUT_DOCUMENT'
            : 'ADVANCE'
        }


        const createdSubsidyId = await onSubmit(submitPayload)


        if (!createdSubsidyId) {
          // Backend did not return an ID — treat as failure, do NOT show success
          console.error('❌ [RequestSubsidyModal] onSubmit returned no ID — backend may have failed silently. Check Network tab for GraphQL errors.')
          // Note: onSubmit (handleSubsidyRequestSubmit in page.tsx) will already have thrown if there
          // was an explicit error. If we reach here with undefined it means Apollo returned data: null
          // without errors — which is unexpected. Show a generic error.
          toast.error(
            i18n.language === 'pt' ? 'Nenhum ID retornado pelo servidor. Verifique o console.' :
            i18n.language === 'nl' ? 'Geen ID ontvangen van de server. Controleer de console.' :
            'No ID returned from server. Check console for details.'
          )
          return
        }
        
        if (pendingFiles.size > 0) {
          
          // Upload all pending files
          for (const item of formData.items) {
            for (const doc of item.activity_documents) {
              const file = pendingFiles.get(doc.id)
              if (file) {

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
        }
        
        // Only show success when we have confirmed the record was created
        toast.success(translations.success.created)
        setPendingFiles(new Map())
        onClose()
      } catch (error) {
        console.error('❌ [Create] Error in handleSubmit:', error)
        toast.error(translations.toasts.createError)
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
    const typeMap: Record<string, string> = {
      INVOICE: translations.documents.types.invoice,
      RECEIPT: translations.documents.types.receipt,
      CONTRACT: translations.documents.types.contract,
      PROOF_OF_PAYMENT: translations.documents.types.proofOfPayment,
      OTHER: translations.documents.types.other
    }
    return typeMap[type] || type
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Modal Container */}
      <div className="relative w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] h-[90vh] sm:h-[85vh] bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{translations.title}</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
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
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Summary Bar */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
            {/* Budget KPIs — always visible so user sees project limits */}
            <div className="grid grid-cols-3 gap-2 mb-2 pb-2 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {i18n.language === 'pt' ? 'Orç. subsidiado' : i18n.language === 'nl' ? 'Gesubsidieerd' : 'Subsidized budget'}
                </span>
                <span className="text-xs font-bold text-gray-800">{formatCurrency(subsidizedBudget)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {i18n.language === 'pt' ? 'Já solicitado' : i18n.language === 'nl' ? 'Al aangevraagd' : 'Already requested'}
                </span>
                <span className="text-xs font-bold text-orange-600">{formatCurrency(totalAlreadyRequested)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {i18n.language === 'pt' ? 'Disponível' : i18n.language === 'nl' ? 'Beschikbaar' : 'Available'}
                </span>
                <span className={`text-xs font-bold ${
                  availableBudget <= 0 ? 'text-red-600' : availableBudget < subsidizedBudget * 0.2 ? 'text-amber-600' : 'text-green-700'
                }`}>{formatCurrency(availableBudget)}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              {/* Total Requested */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{translations.summary.totalRequested}</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{formatCurrency(totalRequestedAmount)}</p>
                </div>
              </div>

              {/* Institution */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{translations.summary.institution}</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {institutionName || translations.status.notInformed}
                  </p>
                </div>
              </div>

              {/* Department (if applicable - for institutional projects) */}
              {departmentName && !churchId && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 truncate">
                      {translations.labels.department}
                      {departmentBudgetYear ? (
                        <span className="ml-1 text-gray-400">({departmentBudgetYear})</span>
                      ) : null}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {departmentName || translations.status.notInformed}
                    </p>
                    {/* {departmentAllocatedBudget > 0 && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <span className="text-[10px] text-gray-400">
                          {i18n.language === 'pt' ? 'Orç. alocado' : i18n.language === 'nl' ? 'Toegewezen bud.' : 'Alloc. budget'}:
                          {' '}<span className="font-semibold text-gray-700">{formatCurrency(departmentAllocatedBudget)}</span>
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {i18n.language === 'pt' ? 'Utilizado' : i18n.language === 'nl' ? 'Gebruikt' : 'Used'}:
                          {' '}<span className={`font-semibold ${
                            departmentBudgetUsed >= departmentAllocatedBudget
                              ? 'text-red-600'
                              : departmentBudgetUsed >= departmentAllocatedBudget * 0.8
                              ? 'text-amber-600'
                              : 'text-green-700'
                          }`}>{formatCurrency(departmentBudgetUsed)}</span>
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {i18n.language === 'pt' ? 'Saldo dept.' : i18n.language === 'nl' ? 'Saldo afd.' : 'Dept. balance'}:
                          {' '}<span className={`font-semibold ${
                            departmentAllocatedBudget - departmentBudgetUsed <= 0
                              ? 'text-red-600'
                              : 'text-green-700'
                          }`}>{formatCurrency(Math.max(0, departmentAllocatedBudget - departmentBudgetUsed))}</span>
                        </span>
                      </div>
                    )} */}
                  </div>
                </div>
              )}

              {/* Church */}
              {churchId && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Church className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 truncate">{translations.summary.church}</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {churchName || translations.status.loading}
                    </p>
                  </div>
                </div>
              )}

              {/* Church Department (if applicable - for church projects) */}
              {(() => {
                const shouldShow = churchId && churchDepartmentId
                return shouldShow ? (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 truncate">{translations.labels.churchDepartment || 'Church Department'}</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {finalChurchDepartmentName || translations.status.notInformed}
                      </p>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          
          {/* ── Request Type Selector ──────────────────────────────────────────── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {i18n.language === 'pt' ? 'Tipo de solicitação' : i18n.language === 'nl' ? 'Type aanvraag' : 'Request type'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([
                {
                  value: 'advance' as RequestType,
                  icon: '💳',
                  label: i18n.language === 'pt' ? 'Adiantamento' : i18n.language === 'nl' ? 'Voorschot' : 'Advance Request',
                  description: i18n.language === 'pt' ? '50% do orçamento subsidiado antes dos documentos' : i18n.language === 'nl' ? '50% van gesubsidieerd budget vooraf' : '50% of subsidized budget upfront',
                },
                {
                  value: 'without_document' as RequestType,
                  icon: '📋',
                  label: i18n.language === 'pt' ? 'Sem Comprovante' : i18n.language === 'nl' ? 'Zonder document' : 'Without Document',
                  description: i18n.language === 'pt' ? 'Vincula atividade sem anexar comprovante' : i18n.language === 'nl' ? 'Koppel activiteit zonder document' : 'Link activity without receipt attachment',
                },
                {
                  value: 'with_document' as RequestType,
                  icon: '📎',
                  label: i18n.language === 'pt' ? 'Com Comprovante' : i18n.language === 'nl' ? 'Met document' : 'With Document',
                  description: i18n.language === 'pt' ? 'Vincula atividade e anexa comprovante' : i18n.language === 'nl' ? 'Koppel activiteit en voeg document toe' : 'Link activity and attach receipt',
                },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRequestType(opt.value)}
                  className={`flex flex-col items-start gap-1 rounded-lg border-2 p-2.5 text-left transition-all ${
                    requestType === opt.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span className={`text-xs font-semibold leading-tight ${
                    requestType === opt.value ? 'text-gray-900' : 'text-gray-700'
                  }`}>{opt.label}</span>
                  <span className="text-[10px] leading-tight text-gray-500">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Advance Request Form ─────────────────────────────────────────────── */}
          {requestType === 'advance' && (
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {i18n.language === 'pt' ? 'Adiantamento de subsídio' : i18n.language === 'nl' ? 'Subsidievoorschot' : 'Subsidy Advance'}
                  </p>
                  {projectName && <p className="text-xs text-gray-500">{projectName}</p>}
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">
                  {i18n.language === 'pt' ? 'Valor do adiantamento' : i18n.language === 'nl' ? 'Voorschotbedrag' : 'Advance Amount'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={maxAdvance}
                    value={advanceAmount}
                    onChange={(e) => { setAdvanceAmount(e.target.value); setAdvanceError(null) }}
                    placeholder="0.00"
                    disabled={isSubmitting}
                    className="flex-1 h-9 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => { setAdvanceAmount(maxAdvance.toFixed(2)); setAdvanceError(null) }}
                    disabled={isSubmitting}
                    className="h-9 px-3 text-xs"
                  >
                    <Zap className="w-3 h-3 mr-1" />MAX
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {i18n.language === 'pt'
                    ? `Máximo permitido (50%): ${formatCurrency(maxAdvance)}`
                    : i18n.language === 'nl'
                    ? `Maximum toegestaan (50%): ${formatCurrency(maxAdvance)}`
                    : `Maximum allowed (50%): ${formatCurrency(maxAdvance)}`}
                </p>
              </div>

              {/* Important notice */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-amber-800">
                    {i18n.language === 'pt' ? 'Aviso importante' : i18n.language === 'nl' ? 'Belangrijk bericht' : 'Important Notice'}
                  </p>
                </div>
                <p className="text-xs text-amber-700">
                  {i18n.language === 'pt'
                    ? 'Você está solicitando 50% do valor subsidiado antes da prestação de contas. Se o valor não for justificado, a devolução poderá ser solicitada.'
                    : i18n.language === 'nl'
                    ? 'U vraagt 50% van het gesubsidieerde bedrag op voorhand aan. Als het bedrag niet kan worden verantwoord, kan terugbetaling worden gevraagd.'
                    : 'You are requesting 50% of the subsidized budget before providing receipts. If the amount is not justified, a refund may be requested.'}
                </p>
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                <Checkbox
                  id="advanceConfirm"
                  checked={advanceConfirmed}
                  onCheckedChange={(v) => { setAdvanceConfirmed(v === true); setAdvanceError(null) }}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                <Label htmlFor="advanceConfirm" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
                  {i18n.language === 'pt'
                    ? 'Entendo que estou solicitando um adiantamento e me comprometo a enviar os comprovantes de gastos no prazo estipulado.'
                    : i18n.language === 'nl'
                    ? 'Ik begrijp dat ik een voorschot aanvraag en verplicht me de bewijsstukken tijdig in te dienen.'
                    : 'I understand I am requesting an advance and commit to submitting expense receipts within the stipulated deadline.'}
                </Label>
              </div>

              {advanceError && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <p className="text-xs text-red-700">{advanceError}</p>
                </div>
              )}
            </div>
          )}

          {/* ─── without_document awareness notice + checkbox ────────────────── */}
          {requestType === 'without_document' && (
            <div className="space-y-2.5 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-gray-800">
                    {i18n.language === 'pt' ? 'Solicitação sem comprovante' : i18n.language === 'nl' ? 'Aanvraag zonder document' : 'Request without document'}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {i18n.language === 'pt'
                      ? 'Você está vinculando uma atividade sem anexar comprovante. Se um comprovante não for enviado posteriormente dentro do prazo, pode ser solicitada a devolução do valor à igreja ou departamento que realizou a solicitação.'
                      : i18n.language === 'nl'
                      ? 'U koppelt een activiteit zonder bewijsstuk. Als er later geen bewijsstuk wordt ingediend binnen de deadline, kan terugbetaling worden gevraagd aan de kerk of het departement.'
                      : 'You are linking an activity without attaching a receipt. If a receipt is not submitted later within the deadline, a refund of the amount may be requested from the church or department that submitted this request.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-1 border-t border-gray-200">
                <Checkbox
                  id="withoutDocConfirm"
                  checked={withoutDocConfirmed}
                  onCheckedChange={(v) => setWithoutDocConfirmed(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="withoutDocConfirm" className="text-[11px] text-gray-700 cursor-pointer leading-relaxed">
                  {i18n.language === 'pt'
                    ? 'Estou ciente e aceito que, se o comprovante não for enviado no prazo, poderei ser responsabilizado pela devolução do valor solicitado.'
                    : i18n.language === 'nl'
                    ? 'Ik begrijp dit en accepteer dat ik verantwoordelijk kan worden gehouden voor terugbetaling als het bewijsstuk niet tijdig wordt ingediend.'
                    : 'I understand and accept that if the receipt is not submitted on time, I may be held responsible for returning the requested amount.'}
                </Label>
              </div>
            </div>
          )}

          {/* ─── Normal subsidy sections (not advance) ─────────────────────────── */}
          {requestType !== 'advance' && <>
          {/* Subsidy Validation Info — only for with_document type */}
          {requestType === 'with_document' && currentItem && <SubsidyValidationInfo
            badges={getValidationBadges(currentItem)}
            isValid={validateActivity(currentItem).isComplete}
            translations={{
              title: translations.about.title,
              howItWorks: translations.about.howItWorks,
              description: translations.about.description,
              distribution: translations.about.distribution,
              status: {
                complete: translations.status.completed,
                pending: translations.status.pendingValidation,
                issues: translations.validation.documentsRequired
              }
            }}
            initiallyExpanded={false}
          />}
          
          {/* Activity Navigation */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{translations.activities.title}</h3>
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
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentActivityIndex(Math.max(0, currentActivityIndex - 1))}
                  disabled={currentActivityIndex === 0}
                  className="h-6 sm:h-7 px-1.5 sm:px-2 text-xs"
                >
                  <span className="hidden sm:inline">{translations.activities.previous}</span>
                  <span className="sm:hidden">‹</span>
                </Button>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {formData.items.length > 0 ? `${currentActivityIndex + 1}/${formData.items.length}` : '0/0'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentActivityIndex(Math.min(formData.items.length - 1, currentActivityIndex + 1))}
                  disabled={currentActivityIndex === formData.items.length - 1}
                  className="h-6 sm:h-7 px-1.5 sm:px-2 text-xs"
                >
                  <span className="hidden sm:inline">{translations.activities.next}</span>
                  <span className="sm:hidden">›</span>
                </Button>
              </div>
            </div>

            {/* Activity Cards */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
              {formData.items.map((item, idx) => {
                const itemValidation = validateActivity(item)
                return (
                  <button
                    key={item.activity_id}
                    onClick={() => setCurrentActivityIndex(idx)}
                    className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-2 transition-all relative ${
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
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        itemValidation.isComplete
                          ? 'bg-green-500 text-white'
                          : item.activity_documents.length > 0
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="text-left min-w-0">
                        <p className={`text-xs font-medium truncate ${
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
              <WithPermission requiredPermissions={[mode === "edit" ? PermissionResolverName.UpdateSubsidyRequest : PermissionResolverName.CreateSubsidyRequest]}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsAddActivityModalOpen(true)}
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {availableActivities.length > 0 
                          ? translations.status.activitiesAvailable.replace('{{count}}', availableActivities.length.toString())
                          : translations.status.noActivitiesAvailable
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </WithPermission>
            </div>

            {/* Empty state — no activities linked yet */}
            {formData.items.length === 0 && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  {i18n.language === 'pt'
                    ? 'Nenhuma atividade vinculada. Clique no + para adicionar uma atividade a esta solicitação.'
                    : i18n.language === 'nl'
                    ? 'Geen activiteit gekoppeld. Klik op + om een activiteit aan deze aanvraag toe te voegen.'
                    : 'No activity linked yet. Click + to add an activity to this request.'}
                </p>
              </div>
            )}
          </div>

          {/* Current Activity Details — only when an activity is selected */}
          {currentItem && <div className="space-y-3 sm:space-y-4 border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">{currentItem.activity_name}</h4>
              <TagBadge
                label={formatCurrency(currentItem.budget_amount)}
                variant="gray"
                size="sm"
              />
            </div>

            {/* Budget Distribution - Focus on Request Contribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">{translations.labels.requestContribution}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs font-medium mb-1">{translations.budget.tooltip.title}</p>
                        <p className="text-xs">{translations.budget.tooltip.description}</p>
                        <p className="text-xs font-medium mb-1">{translations.budget.tooltip.title}</p>
                        <p className="text-xs">{translations.budget.tooltip.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {isEditingValues ? (
                  <WithPermission requiredPermissions={[mode === "edit" ? PermissionResolverName.UpdateSubsidyRequest : PermissionResolverName.CreateSubsidyRequest]}>
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
                  </WithPermission>
                ) : (
                  <WithPermission requiredPermissions={[mode === "edit" ? PermissionResolverName.UpdateSubsidyRequest : PermissionResolverName.CreateSubsidyRequest]}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempRequestedAmount(currentItem.requested_amount)
                        setIsEditingValues(true)
                      }}
                      disabled={formData.is_for_advance}
                      className="h-7 text-xs"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      {translations.budget.editButton}
                    </Button>
                  </WithPermission>
                )}
              </div>

              {isEditingValues ? (
                // Edit Mode — minimalist: just the input + MAX button + one limit line
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={tempRequestedAmount}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0
                        // Cap at: institution_requested_amount (from KPI) → activity budget → availableBudget
                        const maxAllowed = Math.min(
                          availableBudget,
                          currentItem.institution_requested_amount || currentItem.budget_amount
                        )
                        if (value <= maxAllowed + 0.01 && value >= 0) {
                          setTempRequestedAmount(value)
                        } else if (value > maxAllowed) {
                          toast.error(translations.validation.maxAllowed.replace('{{amount}}', formatCurrency(maxAllowed)))
                        }
                      }}
                      className="h-9 text-sm font-medium flex-1"
                      min={0}
                      max={Math.min(availableBudget, currentItem.institution_requested_amount || currentItem.budget_amount)}
                      placeholder={translations.budget.placeholder}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // MAX = institution-approved amount (from KPI) capped by available project budget
                              const maxAllowed = Math.min(
                                availableBudget,
                                currentItem.institution_requested_amount || currentItem.budget_amount
                              )
                              setTempRequestedAmount(maxAllowed)
                              toast.success(translations.toasts.maxValueSet
                                .replace('{{label}}', translations.budget.maxButton)
                                .replace('{{amount}}', formatCurrency(maxAllowed)))
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
                  <p className="text-xs text-muted-foreground">
                    {i18n.language === 'pt'
                      ? <>Máx. disponível: <strong className="text-foreground">{formatCurrency(Math.min(availableBudget, currentItem.institution_requested_amount || currentItem.budget_amount))}</strong></>
                      : i18n.language === 'nl'
                      ? <>Max. beschikbaar: <strong className="text-foreground">{formatCurrency(Math.min(availableBudget, currentItem.institution_requested_amount || currentItem.budget_amount))}</strong></>
                      : <>Max. available: <strong className="text-foreground">{formatCurrency(Math.min(availableBudget, currentItem.institution_requested_amount || currentItem.budget_amount))}</strong></>
                    }
                  </p>
                </div>
              ) : (
                // View Mode — just the requested value + percentage hint
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
                  <span className="text-xs text-muted-foreground">{translations.budget.requestedValue}</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(currentItem.requested_amount)}</p>
                    {currentItem.budget_amount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {Math.round((currentItem.requested_amount / currentItem.budget_amount) * 100)}%
                        {i18n.language === 'pt' ? ' do orçamento' : i18n.language === 'nl' ? ' van budget' : ' of budget'}
                      </p>
                    )}
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
          </div>}{/* end currentItem details */}

          {/* Documents Section — only shown for "with_document" type AND when an activity is selected */}
          {requestType === 'with_document' && currentItem && <div className="space-y-4">
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
                {uploadingReceipt ? translations.status.uploadingFile : translations.documents.dropZone.dragText}
              </p>
              <WithPermission requiredPermissions={[mode === "edit" ? PermissionResolverName.UpdateSubsidyRequest : PermissionResolverName.CreateSubsidyRequest]}>
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
                  {uploadingReceipt ? translations.status.uploading : translations.documents.dropZone.selectButton}
                </Button>
              </WithPermission>
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
                              {translations.status.pendingValue}
                            </Badge>
                          )}
                        </div>
                        <WithPermission requiredPermissions={[mode === "edit" ? PermissionResolverName.UpdateSubsidyRequest : PermissionResolverName.CreateSubsidyRequest]}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </WithPermission>
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
                                      : translations.labels.selectType}
                                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder={translations.labels.searchType} className="h-9" />
                                    <CommandList>
                                      <CommandEmpty>{translations.labels.noTypeFound}</CommandEmpty>
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
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={doc.amount || ""}
                                  onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : 0
                                    handleDocumentChange(doc.id, 'amount', value)
                                  }}
                                  className={`h-9 text-xs flex-1 ${!isValidAmount ? 'border-red-300' : ''}`}
                                  placeholder="0.00"
                                  disabled={mode === "edit" && !doc.id.startsWith('temp-')}
                                  title={mode === "edit" && !doc.id.startsWith('temp-') ? translations.documents.amountCannotBeEdited : ""}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Calcular o total já usado pelos outros documentos (excluindo o documento atual)
                                    const otherDocsTotal = currentItem.activity_documents
                                      .filter(d => d.id !== doc.id)
                                      .reduce((sum, d) => sum + (d.amount || 0), 0)
                                    
                                    // Calcular o valor máximo disponível para este documento
                                    const maxAvailable = Math.max(0, currentItem.requested_amount - otherDocsTotal)
                                    
                                    handleDocumentChange(doc.id, 'amount', maxAvailable)
                                    
                                    if (maxAvailable > 0) {
                                      toast.success(translations.toasts.maxDocumentValueSet.replace('{{amount}}', formatCurrency(maxAvailable)))
                                    } else {
                                      toast.error(translations.toasts.documentLimitReached)
                                    }
                                  }}
                                  disabled={mode === "edit" && !doc.id.startsWith('temp-')}
                                  className="h-9 px-3 text-xs"
                                >
                                  Max
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Validation Info */}
                          <div className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                            <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium">{translations.labels.totalDocuments}</span> {formatCurrency(docTotal)}
                              </p>
                              <p>
                                <span className="font-medium">{translations.labels.requestedValue}</span> {formatCurrency(currentItem.requested_amount)}
                              </p>
                              {Math.abs(currentItem.requested_amount - docTotal) > 0.01 && (
                                <p className="text-amber-600 font-medium">
                                  {translations.labels.difference} {formatCurrency(Math.abs(currentItem.requested_amount - docTotal))}
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
            
            {/* Error if documents exceed requested amount */}
            {(() => {
              const validation = validateActivity(currentItem)
              const docTotal = validation.docTotal
              const exceeds = docTotal > currentItem.requested_amount + 0.01
              
              if (exceeds) {
                const exceedMessage = i18n.language === 'en' 
                  ? 'Document values exceed requested amount'
                  : i18n.language === 'nl'
                    ? 'Documentwaarden overschrijden aangevraagd bedrag'
                    : 'Valor dos documentos excede o solicitado'
                
                const totalLabel = i18n.language === 'en' 
                  ? 'Total documents'
                  : i18n.language === 'nl'
                    ? 'Totaal documenten'
                    : 'Total dos documentos'
                
                const requestedLabel = i18n.language === 'en' 
                  ? 'Requested'
                  : i18n.language === 'nl'
                    ? 'Aangevraagd'
                    : 'Solicitado'
                
                return (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <div className="text-xs text-red-800">
                      <p className="font-semibold mb-1">{exceedMessage}</p>
                      <p>
                        {totalLabel}: <span className="font-semibold">{formatCurrency(docTotal)}</span> | 
                        {requestedLabel}: <span className="font-semibold">{formatCurrency(currentItem.requested_amount)}</span>
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </div>}
          {/* end documents section */}

          </>}
          {/* end non-advance sections wrap */}

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
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Per-type validation checklist */}
            {requestType === 'without_document' && (
              <div className="flex flex-wrap gap-2">
                {withoutDocChecks.map(check => (
                  <div
                    key={check.id}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] transition-colors ${
                      check.ok
                        ? 'border-gray-300 bg-gray-100 text-gray-700'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    {check.ok
                      ? <Check className="w-3 h-3 text-gray-600 flex-shrink-0" />
                      : <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />}
                    <span className={check.ok ? 'font-medium' : ''}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
            {requestType === 'with_document' && (
              <div className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all self-start ${
                canSubmit ? 'border-gray-300 bg-gray-100' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {canSubmit ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {validateAllActivities.completedCount}/{validateAllActivities.totalCount}{' '}
                      {i18n.language === 'pt' ? 'atividades completas' : i18n.language === 'nl' ? 'activiteiten compleet' : 'activities complete'}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {canSubmit
                        ? (i18n.language === 'pt' ? 'Pronto para enviar' : i18n.language === 'nl' ? 'Klaar om in te dienen' : 'Ready to submit')
                        : (i18n.language === 'pt' ? 'Documentos e valores pendentes' : i18n.language === 'nl' ? 'Documenten en bedragen vereist' : 'Documents and amounts required')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Budget constraint warning */}
            {requestType !== 'advance' && availableBudget <= 0 && (
              <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  {i18n.language === 'pt'
                    ? 'Não há saldo disponível. Todo o orçamento subsidiado já foi comprometido.'
                    : i18n.language === 'nl'
                    ? 'Geen beschikbaar saldo. Alle gesubsidieerde budget is al toegewezen.'
                    : 'No available balance. All subsidized budget has already been committed.'}
                </p>
              </div>
            )}
            {requestType !== 'advance' && availableBudget > 0 && totalRequestedAmount > availableBudget && (
              <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  {i18n.language === 'pt'
                    ? `Valor solicitado (${formatCurrency(totalRequestedAmount)}) excede o saldo disponível (${formatCurrency(availableBudget)}).`
                    : i18n.language === 'nl'
                    ? `Aangevraagd bedrag (${formatCurrency(totalRequestedAmount)}) overschrijdt beschikbaar saldo (${formatCurrency(availableBudget)}).`
                    : `Requested amount (${formatCurrency(totalRequestedAmount)}) exceeds available balance (${formatCurrency(availableBudget)}).`}
                </p>
              </div>
            )}

            {/* Statistics and Actions Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              
              {/* Statistics - Horizontal on mobile, vertical on larger screens */}
              <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="text-center sm:text-left min-w-0">
                  <p className="text-xs text-gray-500 truncate">{translations.footer.totalRequested}</p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{formatCurrency(totalRequestedAmount)}</p>
                </div>
                
                <div className="h-8 sm:h-10 w-px bg-gray-200 flex-shrink-0" />
                
                <div className="text-center sm:text-left min-w-0">
                  <p className="text-xs text-gray-500 truncate">{translations.footer.activities}</p>
                  <p className="text-sm font-semibold text-gray-900">{formData.items.length}</p>
                </div>
                
                <div className="h-8 sm:h-10 w-px bg-gray-200 flex-shrink-0" />
                
                <div className="text-center sm:text-left min-w-0">
                  <p className="text-xs text-gray-500 truncate">{translations.footer.documents}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.items.reduce((sum, item) => sum + item.activity_documents.length, 0)}
                  </p>
                </div>
              </div>
            
              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={onClose}
                  size="sm"
                  className="h-8 sm:h-9 px-3 sm:px-4 flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  {translations.buttons.cancel}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1 sm:flex-none">
                        <Button
                          onClick={handleSubmit}
                          size="sm"
                          disabled={!canSubmit || isSubmitting || (requestType !== 'advance' && !canSave)}
                          className="h-8 sm:h-9 px-3 sm:px-4 w-full text-xs sm:text-sm bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                          ) : (
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          )}
                          <span className="truncate">
                            {isSubmitting
                              ? translations.status.uploadingFiles
                              : mode === "edit"
                                ? translations.status.savingChanges
                                : translations.buttons.submit}
                          </span>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {(!canSave || (requestType !== 'advance' && (availableBudget <= 0 || totalRequestedAmount > availableBudget))) && (
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          {!canSave
                            ? (i18n.language === 'pt'
                                ? `Você não tem permissão para ${mode === 'edit' ? 'atualizar' : 'criar'} solicitações de subsídio.`
                                : i18n.language === 'nl'
                                ? `U heeft geen toestemming om subsidieaanvragen ${mode === 'edit' ? 'bij te werken' : 'aan te maken'}.`
                                : `You do not have permission to ${mode === 'edit' ? 'update' : 'create'} subsidy requests.`)
                            : availableBudget <= 0
                            ? (i18n.language === 'pt' ? 'Sem saldo disponível para nova solicitação.' : i18n.language === 'nl' ? 'Geen beschikbaar saldo.' : 'No available balance for a new request.')
                            : (i18n.language === 'pt' ? `Valor excede o saldo disponível (${formatCurrency(availableBudget)}).` : i18n.language === 'nl' ? `Bedrag overschrijdt beschikbaar saldo (${formatCurrency(availableBudget)}).` : `Amount exceeds available balance (${formatCurrency(availableBudget)}).`)}
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Atividades */}
      <SelectActivitiesModal
        isOpen={isAddActivityModalOpen}
        onClose={() => setIsAddActivityModalOpen(false)}
        activities={availableActivities}
        onConfirm={handleAddActivities}
        title={translations.modals.addActivitiesTitle}
        description={translations.modals.addActivitiesDescription}
        filterSubsidized={false}
        subsidizedActivityIds={subsidizedActivityIds}
      />
    </div>
  )
}


