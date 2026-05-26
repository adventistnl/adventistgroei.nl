"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-request"
import { useCurrency } from "@/contexts/currency-context"
import { useInstitution } from "@/contexts/institution-context"
import { useAuth } from "@/contexts/auth-context"
import { useHasPermission } from "@/hooks/use-has-permission"
import { useSubsidyReceipts } from "@/hooks/use-subsidy-receipts"
import { PermissionResolverName } from "@/types/graphql-global-types"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"
import type { ValidationBadgeData } from "@/components/shared/validation-badges-carousel"
import type {
  RequestType,
  SubsidyRequestItem,
  SubsidyRequestData,
  UploadedDocument,
} from "@/types/subsidy-request-modal.types"
import {
  getFileType,
  mapDocumentTypeToApi,
  mapActivityDocumentType,
  mapActivityToItem,
  mapSelectedActivityToItem,
} from "@/lib/subsidy-request-utils"

// ─── Hook params ───────────────────────────────────────────────────────────────
export interface UseSubsidyModalParams {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  projectId: string
  institutionId: string
  departmentId: string
  churchId: string
  churchDepartmentId: string
  churchDepartmentName: string
  selectedActivities: ProjectActivityData[]
  allActivities: ProjectActivityData[]
  initialData: Partial<SubsidyRequestData> | null
  initialRequestType: RequestType | undefined
  subsidyRequestId: string | undefined
  availableBudget: number
  subsidizedBudget: number
  subsidizedActivityIds: string[]
  onSubmit: (data: SubsidyRequestData) => Promise<string | void>
}

// ─── Hook return ───────────────────────────────────────────────────────────────
export interface UseSubsidyModalReturn {
  // state
  formData: SubsidyRequestData
  setFormData: React.Dispatch<React.SetStateAction<SubsidyRequestData>>
  requestType: RequestType
  setRequestType: (t: RequestType) => void
  advanceAmount: string
  setAdvanceAmount: (v: string) => void
  advanceConfirmed: boolean
  setAdvanceConfirmed: (v: boolean) => void
  advanceError: string | null
  setAdvanceError: (v: string | null) => void
  withoutDocConfirmed: boolean
  setWithoutDocConfirmed: (v: boolean) => void
  currentActivityIndex: number
  setCurrentActivityIndex: (i: number) => void
  isEditingValues: boolean
  setIsEditingValues: (v: boolean) => void
  tempRequestedAmount: number
  setTempRequestedAmount: (v: number) => void
  expandedDocs: Set<string>
  setExpandedDocs: React.Dispatch<React.SetStateAction<Set<string>>>
  isAddActivityModalOpen: boolean
  setIsAddActivityModalOpen: (v: boolean) => void
  availableActivities: ProjectActivityData[]
  pendingFiles: Map<string, File>
  isSubmitting: boolean
  dragActive: boolean
  setDragActive: (v: boolean) => void
  // computed
  translations: ReturnType<typeof subsidyRequestTranslations[keyof typeof subsidyRequestTranslations]>
  maxAdvance: number
  maxAdvanceAllowed: number
  totalRequestedAmount: number
  currentItem: SubsidyRequestItem | null
  validateAllActivities: {
    results: { item: SubsidyRequestItem; validation: ReturnType<UseSubsidyModalReturn["validateActivity"]> }[]
    allComplete: boolean
    completedCount: number
    totalCount: number
  }
  canSubmit: boolean
  canSave: boolean
  withoutDocChecks: { id: string; label: string; ok: boolean }[]
  withDocConfirmed: boolean
  setWithDocConfirmed: (v: boolean) => void
  handleRemoveActivity: (activityIndex: number) => void
  advanceChecks: { id: string; label: string; ok: boolean }[]
  withDocChecks: { id: string; label: string; ok: boolean }[]
  uploadingReceipt: boolean
  finalChurchDepartmentName: string
  // formatters
  formatCurrency: (amount: number) => string
  selectedCurrency: { symbol: string }
  // handlers
  handleItemChange: (field: keyof SubsidyRequestItem, value: unknown) => void
  handleFileUpload: (files: FileList | null) => void
  handleRemoveDocument: (docId: string) => Promise<void>
  handleDocumentChange: (docId: string, field: keyof UploadedDocument, value: unknown) => void
  handleAddActivities: (activities: ProjectActivityData[]) => void
  handleSubmit: () => Promise<void>
  validateActivity: (item: SubsidyRequestItem) => {
    hasRequestedAmount: boolean
    hasDocuments: boolean
    hasValidDocumentAmounts: boolean
    documentsMatchOrExceedRequest: boolean
    documentsDoNotExceedRequest: boolean
    documentsMatchRequest: boolean
    isComplete: boolean
    docTotal: number
  }
  getValidationBadges: (item: SubsidyRequestItem) => ValidationBadgeData[]
  getDocumentTypeLabel: (type: string) => string
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useSubsidyModal({
  isOpen,
  onClose,
  mode,
  projectId,
  institutionId,
  departmentId,
  churchId,
  churchDepartmentId,
  churchDepartmentName,
  selectedActivities,
  allActivities,
  initialData,
  initialRequestType,
  subsidyRequestId,
  availableBudget,
  subsidizedBudget,
  subsidizedActivityIds,
  onSubmit,
}: UseSubsidyModalParams): UseSubsidyModalReturn {
  const { formatCurrency, selectedCurrency } = useCurrency()
  const { i18n } = useTranslation()
  const { currentInstitutionData } = useInstitution()
  const { user } = useAuth()

  const translations =
    subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations] ||
    subsidyRequestTranslations.en

  // ── Permissions ──────────────────────────────────────────────────────────────
  const canUpdate = useHasPermission([PermissionResolverName.UpdateSubsidyRequest])
  const canCreate = useHasPermission([PermissionResolverName.CreateSubsidyRequest])
  const isRequester = mode === "edit" && initialData?.requester_id === user?.id
  const canSave = mode === "edit" ? canUpdate || isRequester : canCreate

  // ── Upload ───────────────────────────────────────────────────────────────────
  const { uploading: uploadingReceipt, uploadReceipt, deleteReceipt, fetchReceipts, updateReceipt } = useSubsidyReceipts({
    subsidyRequestId: mode === "edit" ? subsidyRequestId : undefined,
  })

  // ── Church department name resolution ────────────────────────────────────────
  const allChurchDepartments = useMemo(() => {
    return (currentInstitutionData?.churches || []).flatMap(
      (church) =>
        church.departments?.map((dept) => ({
          ...dept,
          church_id: church.id,
          church_name: church.name,
        })) || [],
    )
  }, [currentInstitutionData?.churches])

  const finalChurchDepartmentName = useMemo(() => {
    if (!churchDepartmentId) return churchDepartmentName
    return allChurchDepartments.find((d) => d.id === churchDepartmentId)?.name || churchDepartmentName
  }, [churchDepartmentId, allChurchDepartments, churchDepartmentName])

  // ── Core state ───────────────────────────────────────────────────────────────
  const [requestType, setRequestType] = useState<RequestType>(initialRequestType ?? "with_document")
  const [advanceAmount, setAdvanceAmount] = useState<string>("")
  const [advanceConfirmed, setAdvanceConfirmed] = useState(false)
  const [advanceError, setAdvanceError] = useState<string | null>(null)
  const [withoutDocConfirmed, setWithoutDocConfirmed] = useState(false)
  const [withDocConfirmed, setWithDocConfirmed] = useState(false)
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [isEditingValues, setIsEditingValues] = useState(false)
  const [tempRequestedAmount, setTempRequestedAmount] = useState(0)
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false)
  const [availableActivities, setAvailableActivities] = useState<ProjectActivityData[]>([])
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState<SubsidyRequestData>({
    institution_id: institutionId,
    department_id: departmentId,
    church_id: churchId,
    project_id: projectId,
    requested_amount: 0,
    notes: "",
    items: [],
  })

  // ── Advance limits ────────────────────────────────────────────────────────────
  const maxAdvanceAllowed = subsidizedBudget * 0.5
  const maxAdvance = Math.min(maxAdvanceAllowed, availableBudget)

  // ── Effect: reset state when modal opens ─────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    if (mode === "edit" && initialData) {
      const type = ((initialData.request_type?.toLowerCase() || "with_document") as RequestType)
      setRequestType(type)
      setAdvanceAmount(initialData.advance_amount?.toString() || "")
      setAdvanceConfirmed(type === "advance")
      setWithoutDocConfirmed(type === "without_document")
      setWithDocConfirmed(type === "with_document")
      setAdvanceError(null)
    } else {
      setRequestType(initialRequestType ?? "with_document")
      setAdvanceAmount("")
      setAdvanceConfirmed(false)
      setAdvanceError(null)
      setWithoutDocConfirmed(false)
      setWithDocConfirmed(false)
    }
  }, [isOpen, initialRequestType, mode, initialData])

  // ── Effect: populate form in CREATE mode ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen || mode !== "create" || selectedActivities.length === 0) return
    setFormData({
      institution_id: institutionId,
      department_id: departmentId,
      church_id: churchId,
      project_id: projectId,
      requested_amount: 0,
      notes: "",
      items: selectedActivities.map(mapSelectedActivityToItem),
    })
    setCurrentActivityIndex(0)
  }, [isOpen, mode, selectedActivities, institutionId, departmentId, churchId, projectId])

  // ── Effect: populate form in EDIT mode ───────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !initialData || mode !== "edit") return
    const itemsToUse =
      initialData.items !== undefined
        ? initialData.items.map((item) => ({
            activity_id: item.activity_id,
            activity_name: item.activity_name,
            requested_amount: item.requested_amount,
            budget_amount: item.budget_amount,
            activity_documents: (item.activity_documents || []).map((doc) => ({
              ...doc,
              origin: doc.origin || ("EXISTING_RECEIPT" as const),
            })),
            notes: item.notes || "",
          }))
        : selectedActivities.map((a) => ({
            activity_id: a.id,
            activity_name: a.name,
            requested_amount: a.institution_requested_amount || 0,
            budget_amount: a.budget_amount,
            activity_documents: [],
            notes: "",
          }))

    setFormData({
      institution_id: initialData.institution_id || institutionId,
      department_id: initialData.department_id || departmentId,
      church_id: initialData.church_id || churchId,
      project_id: initialData.project_id || projectId,
      requested_amount: initialData.requested_amount || 0,
      is_for_advance: initialData.is_for_advance,
      notes: initialData.notes || "",
      items: itemsToUse,
    })
    setCurrentActivityIndex(0)
  }, [isOpen, initialData, mode, institutionId, departmentId, churchId, projectId, selectedActivities])

  // ── Effect: fetch & merge existing receipts in edit+with_document mode ────────
  useEffect(() => {
    if (!isOpen || mode !== "edit" || !subsidyRequestId) return

    fetchReceipts(subsidyRequestId).then((receipts: import("@/hooks/use-subsidy-receipts").SubsidyReceipt[]) => {
      if (!receipts || receipts.length === 0) return
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) => {
          const itemReceipts = receipts.filter(
            (r) => r.project_activities_id === item.activity_id && !r.is_deleted,
          )
          if (itemReceipts.length === 0) return item
          const existingIds = new Set(item.activity_documents.map((d) => d.id))
          const newDocs: UploadedDocument[] = itemReceipts
            .filter((r) => !existingIds.has(r.id))
            .map((r) => ({
              id: r.id,
              file_name: r.filename,
              file_type: getFileType(r.filename),
              document_type: mapActivityDocumentType(r.type),
              amount: Number(r.amount || 0),
              file_url: r.file_url,
              isExpanded: false,
              origin: "EXISTING_RECEIPT" as const,
            }))
          return newDocs.length > 0
            ? { ...item, activity_documents: [...item.activity_documents, ...newDocs] }
            : item
        }),
      }))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, subsidyRequestId])

  // ── Effect: sync available activities (exclude already-added) ─────────────────
  useEffect(() => {
    if (!isOpen) return
    const addedIds = new Set(formData.items.map((i) => i.activity_id))
    setAvailableActivities(allActivities.filter((a) => !addedIds.has(a.id)))
  }, [isOpen, allActivities, formData.items])

  // ── Computed: total requested amount ─────────────────────────────────────────
  const totalRequestedAmount = useMemo(() => {
    if (requestType === "advance") return parseFloat(advanceAmount) || 0
    return formData.items.reduce((sum, item) => sum + item.requested_amount, 0)
  }, [formData.items, requestType, advanceAmount])

  // Keep formData.requested_amount in sync
  useEffect(() => {
    setFormData((prev) => ({ ...prev, requested_amount: totalRequestedAmount }))
  }, [totalRequestedAmount])

  // ── Current item ──────────────────────────────────────────────────────────────
  const currentItem: SubsidyRequestItem | null =
    requestType === "advance" || formData.items.length === 0
      ? null
      : (formData.items[currentActivityIndex] ?? null)

  // ── Validation ────────────────────────────────────────────────────────────────
  const validateActivity = useCallback(
    (item: SubsidyRequestItem) => {
      const hasRequestedAmount = item.requested_amount > 0
      const hasDocuments = item.activity_documents.length > 0
      const docTotal = item.activity_documents.reduce((sum, doc) => sum + (doc.amount || 0), 0)
      const hasValidDocumentAmounts = hasDocuments
        ? item.activity_documents.every((doc) => doc.amount && doc.amount > 0)
        : false
      const documentsMatchOrExceedRequest = hasDocuments && docTotal >= item.requested_amount
      const documentsDoNotExceedRequest = hasDocuments && docTotal <= item.requested_amount + 0.01
      const documentsMatchRequest = documentsMatchOrExceedRequest && documentsDoNotExceedRequest
      const requiresDocs = requestType === "with_document"
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
        docTotal,
      }
    },
    [requestType],
  )

  const getValidationBadges = useCallback(
    (item: SubsidyRequestItem): ValidationBadgeData[] => {
      const v = validateActivity(item)
      return [
        {
          id: "requested-amount",
          label: translations.validationBadges.valueDefined,
          value: v.hasRequestedAmount ? formatCurrency(item.requested_amount) : `${selectedCurrency.symbol}0`,
          isValid: v.hasRequestedAmount,
          variant: v.hasRequestedAmount ? "success" : "neutral",
        },
        {
          id: "documents",
          label: translations.validationBadges.documents,
          value: `${item.activity_documents.length} ${translations.validationBadges.files}`,
          isValid: v.hasDocuments,
          variant: v.hasDocuments ? "success" : "neutral",
        },
        {
          id: "document-amounts",
          label: translations.validationBadges.valuesOk,
          value: `${item.activity_documents.filter((d) => d.amount > 0).length}/${item.activity_documents.length}`,
          isValid: v.hasValidDocumentAmounts,
          variant: v.hasValidDocumentAmounts ? "success" : "neutral",
        },
        {
          id: "total-valid",
          label: translations.validationBadges.totalDocs,
          value: formatCurrency(v.docTotal),
          isValid: v.documentsMatchRequest,
          variant: v.documentsMatchRequest
            ? "success"
            : v.documentsMatchOrExceedRequest && !v.documentsDoNotExceedRequest
              ? "error"
              : v.hasDocuments
                ? "warning"
                : "neutral",
        },
      ]
    },
    [validateActivity, formatCurrency, translations, selectedCurrency.symbol],
  )

  const validateAllActivities = useMemo(() => {
    const results = formData.items.map((item) => ({ item, validation: validateActivity(item) }))
    return {
      results,
      allComplete: results.every((r) => r.validation.isComplete),
      completedCount: results.filter((r) => r.validation.isComplete).length,
      totalCount: results.length,
    }
  }, [formData.items, validateActivity])

  // ── canSubmit ─────────────────────────────────────────────────────────────────
  const canSubmit =
    requestType === "advance"
      ? !!advanceAmount &&
        parseFloat(advanceAmount) > 0 &&
        parseFloat(advanceAmount) <= maxAdvance &&
        advanceConfirmed &&
        availableBudget > 0
      : requestType === "without_document"
        ? formData.items.length > 0 &&
          formData.items.every((item) => item.requested_amount > 0) &&
          formData.notes.trim().length > 0 &&
          withoutDocConfirmed &&
          availableBudget > 0 &&
          totalRequestedAmount <= availableBudget
        : validateAllActivities.allComplete && availableBudget > 0 && totalRequestedAmount <= availableBudget && withDocConfirmed

  // ── Checklist for without_document footer ─────────────────────────────────────
  const withoutDocChecks = [
    {
      id: "activities",
      label: translations.checks.activitiesWithValue,
      ok: formData.items.length > 0 && formData.items.every((item) => item.requested_amount > 0),
    },
    {
      id: "notes",
      label: translations.checks.notesFilled,
      ok: formData.notes.trim().length > 0,
    },
    {
      id: "confirm",
      label: translations.checks.withoutDocConfirmed,
      ok: withoutDocConfirmed,
    },
  ]

  // ── Checklist for advance footer ──────────────────────────────────────────────
  const advanceAmount_num = parseFloat(advanceAmount) || 0
  const advanceChecks = [
    {
      id: "amount",
      label: translations.checks.advanceAmountFilled,
      ok: advanceAmount_num > 0,
    },
    {
      id: "limit",
      label: translations.checks.advanceWithinLimit,
      ok: advanceAmount_num > 0 && advanceAmount_num <= maxAdvance,
    },
    {
      id: "confirmed",
      label: translations.checks.advanceConfirmed,
      ok: advanceConfirmed,
    },
  ]

  // ── Checklist for with_document footer ───────────────────────────────────────
  const withDocChecks = [
    {
      id: "activities",
      label: translations.checks.activitiesWithValue,
      ok: formData.items.length > 0 && formData.items.every((item) => item.requested_amount > 0),
    },
    {
      id: "documents",
      label: translations.checks.withDocDocuments,
      ok: formData.items.length > 0 && formData.items.every((item) => item.activity_documents.length > 0),
    },
    {
      id: "amounts",
      label: translations.checks.withDocAmountsValid,
      ok: validateAllActivities.allComplete,
    },
    {
      id: "confirmed",
      label: translations.checks.advanceConfirmed,
      ok: withDocConfirmed,
    },
  ]

  // ── Document type label ───────────────────────────────────────────────────────
  const getDocumentTypeLabel = useCallback(
    (type: string) => {
      const map: Record<string, string> = {
        INVOICE: translations.documents.types.invoice,
        RECEIPT: translations.documents.types.receipt,
        CONTRACT: translations.documents.types.contract,
        PROOF_OF_PAYMENT: translations.documents.types.proofOfPayment,
        OTHER: translations.documents.types.other,
      }
      return map[type] || type
    },
    [translations],
  )

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleItemChange = useCallback(
    (field: keyof SubsidyRequestItem, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, idx) =>
          idx === currentActivityIndex ? { ...item, [field]: value } : item,
        ),
      }))
    },
    [currentActivityIndex],
  )

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0 || !currentItem) return
      const newDocuments: UploadedDocument[] = Array.from(files).map((file, idx) => {
        const tempId = `temp-${Date.now()}-${idx}`
        setPendingFiles((prev) => new Map(prev).set(tempId, file))
        return {
          id: tempId,
          file_name: file.name,
          file_type: getFileType(file.name),
          document_type: "INVOICE" as const,
          amount: 0,
          file_url: URL.createObjectURL(file),
          isExpanded: true,
        }
      })
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, idx) =>
          idx === currentActivityIndex
            ? { ...item, activity_documents: [...item.activity_documents, ...newDocuments] }
            : item,
        ),
      }))
      toast.success(translations.toasts.filesAdded.replace("{{count}}", newDocuments.length.toString()))
    },
    [currentItem, currentActivityIndex, translations],
  )

  const handleRemoveDocument = useCallback(
    async (docId: string) => {
      // Receipts already persisted on the server need an API delete call first
      const isApiReceipt = mode === "edit" && !docId.startsWith("temp-")
      if (isApiReceipt) {
        try {
          await deleteReceipt(docId)
          // deleteReceipt already shows its own success/error toast — no duplicate
        } catch {
          // deleteReceipt already showed the error toast — abort UI update too
          return
        }
      } else if (docId.startsWith("temp-")) {
        // Remove from pending-upload queue
        setPendingFiles((prev) => {
          const next = new Map(prev)
          next.delete(docId)
          return next
        })
      }

      // Remove from local form state
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, idx) =>
          idx === currentActivityIndex
            ? { ...item, activity_documents: item.activity_documents.filter((d) => d.id !== docId) }
            : item,
        ),
      }))

      // Only show toast for local/temp files — API receipts already show their own
      if (!isApiReceipt) {
        toast.success(translations.toasts.documentRemoved)
      }
    },
    [mode, deleteReceipt, currentActivityIndex, translations],
  )

  const handleDocumentChange = useCallback(
    (docId: string, field: keyof UploadedDocument, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, idx) =>
          idx === currentActivityIndex
            ? {
                ...item,
                activity_documents: item.activity_documents.map((doc) =>
                  doc.id === docId ? { ...doc, [field]: value } : doc,
                ),
              }
            : item,
        ),
      }))
    },
    [currentActivityIndex],
  )

  const handleAddActivities = useCallback(
    (activities: ProjectActivityData[]) => {
      const newItems = activities.map((a) => mapActivityToItem(a, availableBudget))
      setFormData((prev) => ({ ...prev, items: [...prev.items, ...newItems] }))
      setIsAddActivityModalOpen(false)
      toast.success(translations.toasts.activitiesAdded.replace("{{count}}", activities.length.toString()))
    },
    [availableBudget, translations],
  )

  const handleRemoveActivity = useCallback(
    (activityIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, idx) => idx !== activityIndex),
      }))
      setCurrentActivityIndex((prev) => {
        if (activityIndex < prev) return prev - 1
        if (activityIndex === prev) return Math.max(0, prev - 1)
        return prev
      })
      toast.success(translations.toasts.activityRemoved)
    },
    [translations],
  )

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const resolvedInstitutionId = formData.institution_id || currentInstitutionData?.id || ""

    // ── Advance ──────────────────────────────────────────────────────────────
    if (requestType === "advance") {
      const numValue = parseFloat(advanceAmount)
      if (isNaN(numValue) || numValue <= 0) {
        setAdvanceError(translations.validation?.amountPositive ?? "Amount must be positive")
        return
      }
      if (numValue > maxAdvance) {
        const isLimitedByBalance = maxAdvance === availableBudget && maxAdvance < maxAdvanceAllowed
        setAdvanceError(
          i18n.language === "pt"
            ? isLimitedByBalance
              ? `O valor excede o saldo disponível do projeto (máx: ${formatCurrency(maxAdvance)})`
              : `O valor excede 50% do orçamento subsidiado (máx: ${formatCurrency(maxAdvance)})`
            : i18n.language === "nl"
              ? isLimitedByBalance
                ? `Bedrag overschrijdt het beschikbare saldo (max: ${formatCurrency(maxAdvance)})`
                : `Bedrag overschrijdt 50% van het gesubsidieerde budget (max: ${formatCurrency(maxAdvance)})`
              : isLimitedByBalance
                ? `Amount exceeds the available balance (max: ${formatCurrency(maxAdvance)})`
                : `Amount exceeds 50% of the subsidized budget (max: ${formatCurrency(maxAdvance)})`,
        )
        return
      }
      if (!advanceConfirmed) {
        setAdvanceError(
          i18n.language === "pt"
            ? "Confirme que você entende os termos do adiantamento"
            : i18n.language === "nl"
              ? "Bevestig dat u de voorwaarden begrijpt"
              : "Please confirm that you understand the advance terms",
        )
        return
      }
      setIsSubmitting(true)
      try {
        const createdId = await onSubmit({
          ...formData,
          institution_id: resolvedInstitutionId,
          requested_amount: numValue,
          request_type: "ADVANCE",
          is_for_advance: true,
          advance_amount: numValue,
          notes: formData.notes || "Pedido de Adiantamento",
          items: [],
        })
        if (!createdId) {
          toast.error(
            i18n.language === "pt"
              ? "Nenhum ID retornado pelo servidor. Verifique o console."
              : i18n.language === "nl"
                ? "Geen ID ontvangen van de server. Controleer de console."
                : "No ID returned from server. Check console for details.",
          )
          return
        }
        setAdvanceAmount("")
        setAdvanceConfirmed(false)
        setAdvanceError(null)
        onClose()
      } catch (err) {
        setAdvanceError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // ── Without document – extra guards ──────────────────────────────────────
    if (requestType === "without_document") {
      if (!formData.notes.trim()) {
        toast.error(
          i18n.language === "pt"
            ? "A justificativa geral é obrigatória."
            : i18n.language === "nl"
              ? "De toelichting is verplicht."
              : "General notes are required.",
        )
        return
      }
      if (!withoutDocConfirmed) {
        toast.error(
          i18n.language === "pt"
            ? "Confirme que está ciente sobre a possibilidade de devolução."
            : i18n.language === "nl"
              ? "Bevestig dat u op de hoogte bent van mogelijke terugbetaling."
              : "Please confirm awareness of the potential refund obligation.",
        )
        return
      }
    }

    // ── Common guards ─────────────────────────────────────────────────────────
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
      toast.error(
        translations.toasts.budgetExceeded
          .replace("{{requested}}", formatCurrency(totalRequestedAmount))
          .replace("{{available}}", formatCurrency(availableBudget)),
      )
      return
    }

    // ── With document – document guards ───────────────────────────────────────
    if (requestType === "with_document") {
      const withoutDocs = formData.items.filter((item) => item.activity_documents.length === 0)
      if (withoutDocs.length > 0) {
        toast.error(translations.validation.documentsRequired)
        return
      }
      for (const item of formData.items) {
        const docTotal = item.activity_documents.reduce((sum, doc) => sum + (doc.amount || 0), 0)
        if (Math.abs(item.requested_amount - docTotal) > 0.01) {
          toast.error(
            translations.toasts.documentAmountMismatch
              .replace("{{activity}}", item.activity_name)
              .replace("{{requested}}", formatCurrency(item.requested_amount))
              .replace("{{total}}", formatCurrency(docTotal)),
          )
          return
        }
        if (item.activity_documents.some((d) => !d.amount || d.amount <= 0)) {
          toast.error(translations.toasts.documentsNeedAmount.replace("{{activity}}", item.activity_name))
          return
        }
      }
    }

    // ── Upload pending files ──────────────────────────────────────────────────
    // Errors are caught per-file so one failure doesn't abort the rest.
    // uploadReceipt already shows its own error toast — no duplicate here.
    const uploadPendingFiles = async (subsidyId: string) => {
      for (const item of formData.items) {
        for (const doc of item.activity_documents) {
          const file = pendingFiles.get(doc.id)
          if (file) {
            try {
              await uploadReceipt(file, subsidyId, item.activity_id, {
                type: mapDocumentTypeToApi(doc.document_type),
                amount: doc.amount,
              })
            } catch {
              // uploadReceipt already showed an error toast — continue with next file
            }
          }
        }
      }
    }

    // ── Update existing receipts (edit mode only) ─────────────────────────────
    const updateExistingReceipts = async () => {
      for (const item of formData.items) {
        for (const doc of item.activity_documents) {
          if (!doc.id.startsWith("temp-") && doc.origin === "EXISTING_RECEIPT") {
            try {
              await updateReceipt(doc.id, {
                amount: doc.amount,
                type: mapDocumentTypeToApi(doc.document_type) as
                  | "invoice"
                  | "receipt"
                  | "contract"
                  | "proof_of_payment"
                  | "other",
              })
            } catch {
              // non-fatal: continue with remaining receipts
            }
          }
        }
      }
    }

    // ── Edit mode ─────────────────────────────────────────────────────────────
    if (mode === "edit" && subsidyRequestId) {
      setIsSubmitting(true)
      try {
        await updateExistingReceipts()
        await uploadPendingFiles(subsidyRequestId)
        const finalData = {
          ...formData,
          institution_id: resolvedInstitutionId,
          id: subsidyRequestId,
          items: formData.items.map((item) => ({ ...item, existing_receipt_updates: undefined })),
        }
        setPendingFiles(new Map())
        await onSubmit(finalData)
        toast.success(translations.toasts.requestUpdated)
        onClose()
      } catch (error) {
        console.error("❌ [Submit] Save error:", error)
        toast.error(translations.toasts.uploadError)
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // ── Create mode ───────────────────────────────────────────────────────────
    setIsSubmitting(true)
    try {
      const submitPayload: SubsidyRequestData = {
        ...formData,
        institution_id: resolvedInstitutionId,
        request_type:
          requestType === "with_document"
            ? "WITH_DOCUMENT"
            : requestType === "without_document"
              ? "WITHOUT_DOCUMENT"
              : "ADVANCE",
      }
      const createdId = await onSubmit(submitPayload)
      if (!createdId) {
        console.error("❌ [RequestSubsidyModal] onSubmit returned no ID")
        toast.error(
          i18n.language === "pt"
            ? "Nenhum ID retornado pelo servidor. Verifique o console."
            : i18n.language === "nl"
              ? "Geen ID ontvangen van de server. Controleer de console."
              : "No ID returned from server. Check console for details.",
        )
        return
      }
      if (pendingFiles.size > 0) {
        await uploadPendingFiles(createdId)
      }
      toast.success(translations.success.created)
      setPendingFiles(new Map())
      onClose()
    } catch (error) {
      console.error("❌ [Create] Error in handleSubmit:", error)
      toast.error(translations.toasts.createError)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    requestType,
    advanceAmount,
    advanceConfirmed,
    maxAdvance,
    maxAdvanceAllowed,
    availableBudget,
    formData,
    totalRequestedAmount,
    withoutDocConfirmed,
    mode,
    subsidyRequestId,
    pendingFiles,
    currentInstitutionData,
    i18n.language,
    translations,
    formatCurrency,
    uploadReceipt,
    onSubmit,
    onClose,
  ])

  return {
    formData,
    setFormData,
    requestType,
    setRequestType,
    advanceAmount,
    setAdvanceAmount,
    advanceConfirmed,
    setAdvanceConfirmed,
    advanceError,
    setAdvanceError,
    withoutDocConfirmed,
    setWithoutDocConfirmed,
    currentActivityIndex,
    setCurrentActivityIndex,
    isEditingValues,
    setIsEditingValues,
    tempRequestedAmount,
    setTempRequestedAmount,
    expandedDocs,
    setExpandedDocs,
    isAddActivityModalOpen,
    setIsAddActivityModalOpen,
    availableActivities,
    pendingFiles,
    isSubmitting,
    dragActive,
    setDragActive,
    translations,
    maxAdvance,
    maxAdvanceAllowed,
    totalRequestedAmount,
    currentItem,
    validateAllActivities,
    canSubmit,
    canSave,
    withoutDocChecks,
    advanceChecks,
    withDocChecks,
    withDocConfirmed,
    setWithDocConfirmed,
    handleRemoveActivity,
    uploadingReceipt,
    finalChurchDepartmentName,
    formatCurrency,
    selectedCurrency,
    handleItemChange,
    handleFileUpload,
    handleRemoveDocument,
    handleDocumentChange,
    handleAddActivities,
    handleSubmit,
    validateActivity,
    getValidationBadges,
    getDocumentTypeLabel,
  }
}
