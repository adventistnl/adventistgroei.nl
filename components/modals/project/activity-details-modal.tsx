"use client"

import React, { useState, useEffect } from "react"
import { 
  X, 
  Activity, 
  DollarSign, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Copy, 
  Check, 
  Tag, 
  Wrench, 
  Package, 
  GraduationCap, 
  ChevronDown, 
  Upload, 
  FileText, 
  Receipt,
  File,
  ExternalLink,
  Save,
  Info,
  Image,
  FileImage,
  PanelRight,
  Flag,
  Building2,
  Church,
  UserPlus
} from "lucide-react"
import { ProjectActivityData } from "../../projects/project-activities-table"
import { Badge } from "@/components/ui/badge"
import { TagBadge } from "@/components/ui/tag-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Editor } from "@/components/blocks/editor-x/editor"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import toast from "react-hot-toast"
import { UserSelector, type User as UserType } from "@/components/shared/user-selector"
import { ActivityTags } from "@/types/graphql-global-types"
import { TagBadgeVariant } from "@/components/ui/tag-badge"

export interface ActivityDocument {
  id: string
  activity_id: string
  file_url: string
  type: "INVOICE" | "RECEIPT" | "CONTRACT" | "OTHER"
  is_validated: boolean
  uploaded_by: string
  created_at: string
  validated_at?: string
  filename: string
}

export interface ActivityDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  activity: ProjectActivityData | null
  onSave?: (data: Partial<ProjectActivityData>) => void
  project?: any
  institutionUsers?: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
  }>
}

export function ActivityDetailsModal({
  isOpen,
  onClose,
  activity,
  onSave,
  project,
  institutionUsers = []
}: ActivityDetailsModalProps) {
  const { t } = useTranslation()
  const { formatCurrency: formatCurrencyGlobal } = useCurrency()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editorState, setEditorState] = useState<any>(null)
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
  
  // Assigned users state - Only show the owner as a single user
  const [assignedUsers, setAssignedUsers] = useState<User[]>(() => {
    if (activity?.owner) {
      return [{
        id: activity.owner.id,
        name: activity.owner.name,
        email: activity.owner.email,
        role: 'Responsável'
      }]
    }
    return []
  })

  // Available users from institution
  const availableUsers: User[] = institutionUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role || 'Membro'
  }))

  // Debug: Log available users
  useEffect(() => {
    console.log('📊 Institution Users:', institutionUsers)
    console.log('👥 Available Users:', availableUsers)
  }, [institutionUsers, availableUsers])
  
  // Converte valores antigos (português/minúsculo) para os valores corretos do enum
  const normalizeActivityTag = (tag?: string): string => {
    if (!tag) return ''

    // Se já está no formato correto do enum, retorna
    if (Object.values(ActivityTags).includes(tag as ActivityTags)) {
      return tag
    }

    // Mapeamento de valores antigos para novos
    const legacyMap: Record<string, ActivityTags> = {
      'reforma': ActivityTags.Reform,
      'material': ActivityTags.Materials,
      'training': ActivityTags.Training,
      'viagem': ActivityTags.Travel,
      'evento': ActivityTags.Event,
      'transporte': ActivityTags.Transport,
      'marketing': ActivityTags.Marketing,
      'servicos': ActivityTags.Services,
      'alimentacao': ActivityTags.Feeding,
      'acomodacao': ActivityTags.Accommodation,
      'equipamento': ActivityTags.Equipment,
    }

    return legacyMap[tag.toLowerCase()] || tag
  }

  // Form states
  const [formData, setFormData] = useState({
    name: activity?.name || "",
    status: activity?.status || "",
    priority: activity?.priority || "",
    activity_tag: normalizeActivityTag(activity?.activity_tag),
    budget_amount: activity?.budget_amount || 0,
    description: activity?.description || "",
    is_subsidized: activity?.is_subsidized || false,
    institution_requested_amount: activity?.institution_requested_amount || 0
  })

  // Funding rules configuration
  const FUNDING_POLICIES = {
    max_institution_percent: 65,
    max_institution_amount: 5000,
    min_church_percent: 35,
    default_church_percent: 35,
    default_institution_percent: 65
  }

  // Mock documents data
  const [documents, setDocuments] = useState<ActivityDocument[]>([
    {
      id: "1",
      activity_id: activity?.id || "",
      file_url: "/documents/invoice-001.pdf",
      type: "INVOICE",
      is_validated: true,
      uploaded_by: "user1",
      created_at: "2024-01-15T14:30:00Z",
      validated_at: "2024-01-16T09:00:00Z",
      filename: "Fatura_Janeiro_2024.pdf"
    },
    {
      id: "2",
      activity_id: activity?.id || "",
      file_url: "/documents/receipt-001.pdf", 
      type: "RECEIPT",
      is_validated: false,
      uploaded_by: "user1",
      created_at: "2024-01-20T09:15:00Z",
      filename: "Recibo_Pagamento_Janeiro.pdf"
    }
  ])

  // Update form data when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        status: activity.status,
        priority: activity.priority,
        activity_tag: activity.activity_tag,
        budget_amount: activity.budget_amount,
        description: activity.description,
        is_subsidized: activity.is_subsidized,
        institution_requested_amount: activity.institution_requested_amount || 0
      })

      // Update assigned users when activity changes
      if (activity.owner) {
        setAssignedUsers([{
          id: activity.owner.id,
          name: activity.owner.name,
          email: activity.owner.email,
          role: 'Responsável'
        }])
      } else {
        setAssignedUsers([])
      }
    }
  }, [activity])

  // Recalculate institution amount when budget changes to prevent negative values
  useEffect(() => {
    if (formData.is_subsidized && formData.budget_amount > 0) {
      const maxAllowed = (formData.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100
      
      // If current institution amount exceeds new maximum, adjust it
      if (formData.institution_requested_amount > maxAllowed) {
        setFormData(prev => ({
          ...prev,
          institution_requested_amount: maxAllowed
        }))
        toast(`Valor da instituição ajustado para ${formatCurrencyGlobal(maxAllowed)} (máximo permitido)`, {
          icon: 'ℹ️',
          duration: 3000,
        })
      }
    }
  }, [formData.budget_amount, formData.is_subsidized])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.pointerEvents = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
    }
  }, [isOpen])

  if (!isOpen || !activity) return null

  // Extract text from Lexical editor state
  const extractTextFromEditorState = (editorState: any): string => {
    if (!editorState) return ''
    
    try {
      // If it's already a string, return it
      if (typeof editorState === 'string') return editorState
      
      // If it's the Lexical JSON structure, extract text from nodes
      if (editorState.root && editorState.root.children) {
        const extractFromNodes = (nodes: any[]): string => {
          return nodes.map(node => {
            if (node.type === 'text') {
              return node.text || ''
            } else if (node.children && Array.isArray(node.children)) {
              return extractFromNodes(node.children)
            } else if (node.type === 'paragraph' && node.children) {
              return extractFromNodes(node.children) + '\n'
            }
            return ''
          }).join('')
        }
        
        return extractFromNodes(editorState.root.children).trim()
      }
      
      // Fallback: try to stringify and extract any text content
      const jsonStr = JSON.stringify(editorState)
      const textMatches = jsonStr.match(/"text":"([^"]+)"/g)
      if (textMatches) {
        return textMatches.map(match => {
          const textPart = match.match(/"text":"([^"]+)"/)
          return textPart ? textPart[1] : ''
        }).join(' ')
      }
      
      return ''
    } catch (error) {
      console.error('Error extracting text from editor state:', error)
      return ''
    }
  }

  // Helper functions
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planning: "Planejamento",
      in_progress: "Em Andamento",
      completed: "Concluída",
      pending_approval: "Pendente Aprovação",
      cancelled: "Cancelada"
    }
    return labels[status] || status
  }

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      urgent: "Urgente",
      high: "Alta", 
      medium: "Média",
      low: "Baixa"
    }
    return labels[priority] || priority
  }

  const getTagLabel = (tag: string) => {
    const labels: Record<string, string> = {
      [ActivityTags.Reform]: "Reforma",
      [ActivityTags.Equipment]: "Equipamento",
      [ActivityTags.Materials]: "Material",
      [ActivityTags.Training]: "Treinamento",
      [ActivityTags.Travel]: "Viagem",
      [ActivityTags.Event]: "Evento",
      [ActivityTags.Transport]: "Transporte",
      [ActivityTags.Marketing]: "Marketing",
      [ActivityTags.Services]: "Serviços",
      [ActivityTags.Feeding]: "Alimentação",
      [ActivityTags.Accommodation]: "Acomodação"
    }
    return labels[tag] || tag
  }

  const getActivityTagOptions = () => {
    return Object.values(ActivityTags).map(tag => ({
      value: tag,
      label: getTagLabel(tag)
    }))
  }

  const getActivityTagIcon = (tag: string) => {
    const icons: Record<string, any> = {
      [ActivityTags.Reform]: Wrench,
      [ActivityTags.Equipment]: Wrench,
      [ActivityTags.Materials]: Package,
      [ActivityTags.Training]: GraduationCap,
      [ActivityTags.Travel]: Tag,
      [ActivityTags.Event]: Tag,
      [ActivityTags.Transport]: Tag,
      [ActivityTags.Marketing]: Tag,
      [ActivityTags.Services]: Tag,
      [ActivityTags.Feeding]: Tag,
      [ActivityTags.Accommodation]: Tag
    }
    return icons[tag] || Tag
  }

  const getActivityTagVariant = (tag: string): TagBadgeVariant => {
    const variants: Record<string, TagBadgeVariant> = {
      [ActivityTags.Reform]: 'purple',
      [ActivityTags.Equipment]: 'blue',
      [ActivityTags.Materials]: 'cyan',
      [ActivityTags.Training]: 'indigo',
      [ActivityTags.Travel]: 'green',
      [ActivityTags.Event]: 'pink',
      [ActivityTags.Transport]: 'orange',
      [ActivityTags.Marketing]: 'red',
      [ActivityTags.Services]: 'yellow',
      [ActivityTags.Feeding]: 'gray',
      [ActivityTags.Accommodation]: 'gray'
    }
    return variants[tag] || 'gray'
  }

  const formatCurrency = (amount: number) => {
    // Use global currency formatter
    return formatCurrencyGlobal(amount)
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (onSave && activity) {
      // Include activity id and owner_id from assignedUsers
      const dataToSave: Partial<ProjectActivityData> = {
        id: activity.id,
        ...formData,
        activity_tag: normalizeActivityTag(formData.activity_tag) as any,
        owner_id: assignedUsers.length > 0 ? assignedUsers[0].id : activity.owner_id,
      }
      console.log('💾 Saving activity with data:', dataToSave)
      console.log('🏷️ Activity tag being sent:', dataToSave.activity_tag)
      onSave(dataToSave)
      toast.success(t('common.success'))
      setHasChanges(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleUserSelect = (user: UserType) => {
    setAssignedUsers([user])
    setHasChanges(true)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Modal Container */}
      <div className="relative w-[60vw] h-[85vh] bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              {editingField === 'name' ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="text-lg font-semibold h-8 border-0 p-0 focus-visible:ring-0"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-gray-900">{formData.name}</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingField('name')}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">ID: {activity.id}</p>
                {project && (
                  <>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-500">{project.name}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSystemInfoOpen(!isSystemInfoOpen)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <PanelRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status, Priority and Category Section */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium text-gray-700">{t('activities.modal.status')}:</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t('activities.modal.tooltips.status')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {editingField === 'status' ? (
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => {
                      handleInputChange('status', value)
                      setEditingField(null)
                    }}
                  >
                    <SelectTrigger className="w-[150px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">{t('activities.modal.status_options.todo')}</SelectItem>
                      <SelectItem value="in_progress">{t('activities.modal.status_options.in_progress')}</SelectItem>
                      <SelectItem value="completed">{t('activities.modal.status_options.completed')}</SelectItem>
                      <SelectItem value="on_hold">{t('activities.modal.status_options.on_hold')}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <TagBadge
                      label={getStatusLabel(formData.status)}
                      variant={
                        formData.status === 'todo' ? 'gray' :
                        formData.status === 'in_progress' ? 'blue' :
                        formData.status === 'completed' ? 'green' :
                        'yellow'
                      }
                      size="md"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField('status')}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">{t('activities.modal.priority')}:</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t('activities.modal.tooltips.priority')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {editingField === 'priority' ? (
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => {
                      handleInputChange('priority', value)
                      setEditingField(null)
                    }}
                  >
                    <SelectTrigger className="w-[150px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">{t('activities.modal.priority_options.urgent')}</SelectItem>
                      <SelectItem value="high">{t('activities.modal.priority_options.high')}</SelectItem>
                      <SelectItem value="medium">{t('activities.modal.priority_options.medium')}</SelectItem>
                      <SelectItem value="low">{t('activities.modal.priority_options.low')}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <TagBadge
                      label={getPriorityLabel(formData.priority)}
                      variant={
                        formData.priority === 'urgent' ? 'red' :
                        formData.priority === 'high' ? 'orange' :
                        formData.priority === 'medium' ? 'yellow' :
                        'green'
                      }
                      size="md"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField('priority')}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">{t('activities.modal.category')}:</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t('activities.modal.tooltips.category')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {editingField === 'category' ? (
                  <Select
                    value={formData.activity_tag}
                    onValueChange={(value) => {
                      handleInputChange('activity_tag', value)
                      setEditingField(null)
                    }}
                  >
                    <SelectTrigger className="w-[150px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getActivityTagOptions().map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <TagBadge
                      label={getTagLabel(formData.activity_tag)}
                      variant={getActivityTagVariant(formData.activity_tag)}
                      icon={getActivityTagIcon(formData.activity_tag)}
                      size="md"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField('category')}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Assigned Users */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Responsável:
                </span>
                {assignedUsers.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage src={assignedUsers[0].avatar} alt={assignedUsers[0].name} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {assignedUsers[0].name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {assignedUsers[0].name}
                    </span>
                  </div>
                )}
                <UserSelector
                  availableUsers={availableUsers}
                  selectedUser={assignedUsers.length > 0 ? assignedUsers[0] : null}
                  onUserSelect={handleUserSelect}
                  buttonLabel={assignedUsers.length > 0 ? "Alterar" : "Selecionar"}
                  dialogTitle="Selecionar Responsável"
                  searchPlaceholder="Buscar usuário..."
                />
              </div>
            </div>

            {/* Subsidy Icon - Right Side */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{t('activities.modal.subsidy')}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {formData.is_subsidized 
                        ? t('activities.modal.subsidy_info.subsidized')
                        : t('activities.modal.subsidy_info.not_subsidized')
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInputChange('is_subsidized', !formData.is_subsidized)}
                className="p-0 h-auto hover:bg-transparent"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  formData.is_subsidized 
                    ? 'bg-green-100 border-2 border-green-300' 
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}>
                  <DollarSign className={`w-4 h-4 ${
                    formData.is_subsidized ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
              </Button>
            </div>
          </div>

          {/* Budget Section - KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Budget Card */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">Orçamento Total</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Valor total do orçamento desta atividade</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField('budget')}
                  className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              {editingField === 'budget' ? (
                <Input
                  type="number"
                  value={formData.budget_amount}
                  onChange={(e) => handleInputChange('budget_amount', Number(e.target.value))}
                  onBlur={() => setEditingField(null)}
                  className="text-lg font-bold h-8 border-0 p-0 focus-visible:ring-0 bg-transparent dark:text-white"
                  autoFocus
                />
              ) : (
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(formData.budget_amount)}
                </div>
              )}
            </div>

            {/* Institution Requested Amount Card - Only if subsidized */}
            {formData.is_subsidized && (
              <div className="rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-200">Instituição</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Valor solicitado à instituição (máximo {FUNDING_POLICIES.max_institution_percent}% do orçamento)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1">
                    {editingField === 'institution_amount' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingField(null)
                          toast.success('Valor atualizado com sucesso')
                        }}
                        className="h-5 w-5 p-0 text-grey-400 hover:text-grey-600 hover:bg-grey-60 dark:text-grey-600 dark:hover:text-grey-600"
                        title="Confirmar alteração"
                      >
                      <Check className="w-3.5 h-3.5" />
                      {/* <span>save</span> */}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingField('institution_amount')}
                        className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {editingField === 'institution_amount' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(0).replace(/[\d.,\s]/g, '')}
                        </span>
                        <Input
                          type="number"
                          value={formData.institution_requested_amount || ''}
                          placeholder="0"
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : Number(e.target.value)
                            // Calculate max allowed based on funding rules
                            const maxAllowed = (formData.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100
                            if (value <= maxAllowed) {
                              handleInputChange('institution_requested_amount', value)
                            } else {
                              toast.error(`Valor máximo permitido: ${formatCurrency(maxAllowed)} (${FUNDING_POLICIES.max_institution_percent}% do orçamento)`)
                            }
                          }}
                          className="text-lg font-bold h-8 border-0 pl-6 pr-2 py-0 focus-visible:ring-0 bg-transparent dark:text-white"
                          autoFocus
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Calculate max allowed based on funding rules
                          const maxAllowed = (formData.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100
                          handleInputChange('institution_requested_amount', maxAllowed)
                        }}
                        className="h-8 px-3 text-xs font-mono shrink-0"
                        title="Aplicar máximo permitido (65% do orçamento)"
                      >
                        MAX
                      </Button>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Máximo: {formatCurrency((formData.budget_amount * FUNDING_POLICIES.max_institution_percent) / 100)} ({FUNDING_POLICIES.max_institution_percent}% do orçamento)
                    </p>
                  </div>
                ) : (
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {formatCurrency(formData.institution_requested_amount || 0)}
                  </div>
                )}
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formData.budget_amount > 0 
                    ? `${Math.round(((formData.institution_requested_amount || 0) / formData.budget_amount) * 100)}% do total`
                    : '0% do total'
                  }
                </p>
              </div>
            )}

            {/* Church Contribution Card */}
            <div className="rounded-lg border border-gray-400 dark:border-gray-500 p-3 bg-gray-100 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Church className="w-3.5 h-3.5 text-gray-700 dark:text-gray-200" />
                <Label className="text-xs font-medium text-gray-800 dark:text-gray-100">Igreja</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Contribuição da igreja (mínimo {FUNDING_POLICIES.min_church_percent}% do orçamento)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(
                  formData.is_subsidized 
                    ? formData.budget_amount - (formData.institution_requested_amount || 0)
                    : formData.budget_amount
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {formData.is_subsidized && formData.budget_amount > 0
                  ? `${Math.round(((formData.budget_amount - (formData.institution_requested_amount || 0)) / formData.budget_amount) * 100)}% do total`
                  : '100% do total'
                }
              </p>
            </div>
          </div>

          {/* Funding Rules Badges */}
          {formData.is_subsidized && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Regras de Financiamento:</span>
                <TagBadge
                  label={`Máx. Instituição: ${FUNDING_POLICIES.max_institution_percent}%`}
                  variant="blue"
                  size="xs"
                />
                <TagBadge
                  label={`Mín. Igreja: ${FUNDING_POLICIES.min_church_percent}%`}
                  variant="green"
                  size="xs"
                />
                <TagBadge
                  label={`Limite: ${formatCurrency(FUNDING_POLICIES.max_institution_amount)}`}
                  variant="purple"
                  size="xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content with Drawer */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-300`}>
            
            {/* Description with Conditional Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t('activities.modal.description')}</h3>
                <div className="flex items-center gap-2">
                  {!isDescriptionEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDescriptionEditing(true)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              {isDescriptionEditing ? (
                <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] relative">
                  <Editor
                    editorSerializedState={
                      formData.description ? {
                        root: {
                          children: [
                            {
                              children: [
                                {
                                  detail: 0,
                                  format: 0,
                                  mode: "normal",
                                  style: "",
                                  text: formData.description,
                                  type: "text",
                                  version: 1,
                                },
                              ],
                              direction: "ltr",
                              format: "",
                              indent: 0,
                              type: "paragraph",
                              version: 1,
                            },
                          ],
                          direction: "ltr",
                          format: "",
                          indent: 0,
                          type: "root",
                          version: 1,
                        },
                      } : undefined
                    }
                    onChange={(state) => {
                      setEditorState(state)
                      const extractedText = extractTextFromEditorState(state)
                      handleInputChange('description', extractedText)
                    }}
                  />
                  {!editorState && !formData.description && (
                    <div className="absolute inset-4 pointer-events-none text-gray-400 text-sm">
                      {t('activities.modal.click_to_edit')}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDescriptionEditing(false)}
                      className="h-8 px-3 text-sm"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsDescriptionEditing(false)
                        toast.success(t('common.success'))
                      }}
                      className="h-8 px-3 text-sm bg-gray-800 hover:bg-gray-900"
                    >
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="relative border border-gray-200 rounded-lg p-4 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors group"
                  onClick={() => setIsDescriptionEditing(true)}
                >
                  {formData.description ? (
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {formData.description}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic flex items-center justify-center h-full">
                      <div className="text-center">
                        <Edit3 className="w-5 h-5 mx-auto mb-2 opacity-50" />
                        Clique aqui para adicionar uma descrição...
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 shadow-sm">
                      Clique para editar
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Arquivos Anexados</h3>
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
                onDrop={(e) => {
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
                }}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">{t('activities.modal.drop_files')}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
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
                  }}
                  className="text-xs h-7"
                >
                  {t('common.upload')}
                </Button>
                <p className="text-xs text-gray-500 mt-2">{t('activities.modal.supported_formats')}</p>
              </div>

              {/* Uploaded Files as Tags */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">{t('activities.modal.documents')}:</p>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                        onClick={() => {
                          // Create temporary download link
                          const url = URL.createObjectURL(file)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = file.name
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                      >
                        {file.type.startsWith('image/') ? (
                          <FileImage className="w-3 h-3" />
                        ) : (
                          <File className="w-3 h-3" />
                        )}
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index))
                          }}
                          className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>


          </div>
          
          {/* Internal Drawer - System Info */}
          {isSystemInfoOpen && (
            <div className="w-64 border-l border-gray-200 bg-gray-50 p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('activities.modal.system_info')}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSystemInfoOpen(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">Detalhes técnicos e metadados da atividade</p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('activities.modal.activity_id')}</p>
                  <p className="text-sm text-gray-700 font-mono break-all">{activity.id}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('activities.modal.created_at')}</p>
                  <p className="text-sm text-gray-700">{formatDate(activity.created_at)}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('activities.modal.updated_at')}</p>
                  <p className="text-sm text-gray-700">{formatDate(activity.updated_at)}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('activities.modal.created_by')}</p>
                  <p className="text-sm text-gray-700">{activity.created_by}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('activities.modal.updated_by')}</p>
                  <p className="text-sm text-gray-700">{activity.updated_by}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex justify-between">
            <div className="flex items-center">
              {hasChanges && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t('activities.modal.unsaved_changes')}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} size="sm" className="px-4 h-8 text-gray-600 border-gray-300">
                {t('activities.modal.close')}
              </Button>
              {hasChanges && (
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="px-4 h-8 bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {t('activities.modal.save_changes')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}