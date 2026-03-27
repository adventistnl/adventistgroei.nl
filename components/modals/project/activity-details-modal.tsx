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
  FileText,
  Receipt,
  ExternalLink,
  Save,
  Info,
  Image,
  PanelRight,
  Flag,
  UserPlus,
  History,
  Upload,
  Lock,
} from "lucide-react"
import { useQuery } from "@apollo/client"
import { GET_PROJECT_ACTIVITY_LOGS_QUERY } from "@/graphql/queries/ACTIVITY_LOGS_QUERY"
import { ActivityLogs } from "@/components/projects/activity-logs"
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
import { UserMultiSelector } from "@/components/shared/user-multi-selector"
import { ActivityTags } from "@/types/graphql-global-types"
import { TagBadgeVariant } from "@/components/ui/tag-badge"
import { ActivityDocumentsSection } from "@/components/projects/activity-documents-section"
import { useActivityDocuments } from "@/hooks/use-activity-documents"

// Type alias for User
type User = UserType

export interface ActivityDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  activity: ProjectActivityData | null
  onSave?: (data: Partial<ProjectActivityData>) => void
  project?: any
  /** When true, all editing, uploading and saving are disabled (e.g. project is CONCLUDED) */
  readOnly?: boolean
  /** Reason displayed in a tooltip/banner when readOnly=true */
  readOnlyReason?: string
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
  readOnly = false,
  readOnlyReason,
  institutionUsers = []
}: ActivityDetailsModalProps) {
  const { t } = useTranslation()
  const { formatCurrency: formatCurrencyGlobal } = useCurrency()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false)
  const [systemInfoTab, setSystemInfoTab] = useState<'metadata' | 'logs'>('metadata')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editorState, setEditorState] = useState<any>(null)
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)

  // Hook para gerenciar documentos da atividade
  const {
    documents,
    loading: documentsLoading,
    uploading: documentsUploading,
    uploadMultipleDocuments,
    deleteDocument,
    validateDocument,
    downloadDocument,
  } = useActivityDocuments({ 
    activityId: activity?.id || '', 
    projectActivityId: activity?.id || '' 
  })

  // Estado para arquivos pendentes de upload
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  // Fetch activity logs
  const { data: logsData, loading: logsLoading, refetch: refetchLogs } = useQuery(
    GET_PROJECT_ACTIVITY_LOGS_QUERY,
    {
      variables: { activityId: activity?.id },
      skip: !activity?.id || !isSystemInfoOpen,
    }
  )
  
  // Assigned users state - Support multiple assignees
  const [assignedUsers, setAssignedUsers] = useState<User[]>(() => {
    // Usar assignees (múltiplos responsáveis)
    if (activity?.assignees && activity.assignees.length > 0) {
      return activity.assignees.map(assignee => ({
        id: assignee.user.id,
        name: assignee.user.name,
        email: assignee.user.email,
        role: 'Assignee'
      }))
    }
    return []
  })

  // Available users from institution
  const availableUsers: User[] = institutionUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role || 'Member'
  }))
  
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
    tags: activity?.tags || [],
    budget_amount: activity?.budget_amount || 0,
    description: activity?.description || "",
    is_subsidized: activity?.is_subsidized || false,
    institution_requested_amount: activity?.institution_requested_amount || 0
  })

  // Update form data when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        status: activity.status,
        priority: activity.priority,
        tags: activity.tags || [],
        budget_amount: activity.budget_amount,
        description: activity.description,
        is_subsidized: activity.is_subsidized,
        institution_requested_amount: activity.institution_requested_amount || 0
      })

      // Update assigned users when activity changes - support multiple assignees
      if (activity.assignees && activity.assignees.length > 0) {
        setAssignedUsers(activity.assignees.map(assignee => ({
          id: assignee.user.id,
          name: assignee.user.name,
          email: assignee.user.email,
          role: 'Assignee'
        })))
      } else {
        setAssignedUsers([])
      }
    }
  }, [activity])


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

  // Helper functions - moved here to access t() hook
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planning: t('activities.modal.status_labels.planning'),
      in_progress: t('activities.modal.status_labels.in_progress'),
      completed: t('activities.modal.status_labels.completed'),
      pending_approval: t('activities.modal.status_labels.pending_approval'),
      cancelled: t('activities.modal.status_labels.cancelled')
    }
    return labels[status] || status
  }

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      urgent: t('activities.modal.priority_labels.urgent'),
      high: t('activities.modal.priority_labels.high'), 
      medium: t('activities.modal.priority_labels.medium'),
      low: t('activities.modal.priority_labels.low')
    }
    return labels[priority] || priority
  }

  const getTagLabel = (tag: string) => {
    const labels: Record<string, string> = {
      [ActivityTags.Reform]: t('activities.modal.tag_labels.reform'),
      [ActivityTags.Equipment]: t('activities.modal.tag_labels.equipment'),
      [ActivityTags.Materials]: t('activities.modal.tag_labels.materials'),
      [ActivityTags.Training]: t('activities.modal.tag_labels.training'),
      [ActivityTags.Travel]: t('activities.modal.tag_labels.travel'),
      [ActivityTags.Event]: t('activities.modal.tag_labels.event'),
      [ActivityTags.Transport]: t('activities.modal.tag_labels.transport'),
      [ActivityTags.Marketing]: t('activities.modal.tag_labels.marketing'),
      [ActivityTags.Services]: t('activities.modal.tag_labels.services'),
      [ActivityTags.Feeding]: t('activities.modal.tag_labels.feeding'),
      [ActivityTags.Accommodation]: t('activities.modal.tag_labels.accommodation')
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

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    if (readOnly) return
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  // Guard: open field editing only when not read-only
  const handleOpenEditField = (field: string) => {
    if (!readOnly) setEditingField(field)
  }

  const handleSave = async () => {
    if (onSave && activity) {
      try {
        // Primeiro, fazer upload dos arquivos pendentes se existirem
        if (pendingFiles.length > 0) {
          toast.loading(t('activities.documents.uploading_files'))
          await uploadMultipleDocuments(pendingFiles)
          setPendingFiles([])
          toast.dismiss()
          toast.success(t('activities.documents.files_uploaded_successfully'))
        }

        // Depois salvar as alterações da atividade
        const dataToSave: Partial<ProjectActivityData> = {
          id: activity.id,
          ...formData,
          tags: formData.tags.map(tag => normalizeActivityTag(tag) as ActivityTags),
          assignee_ids: assignedUsers.map(u => u.id),
        }
        onSave(dataToSave)
        toast.success(t('common.success'))
        setHasChanges(false)

        // Refetch logs after saving to show the new changes
        if (refetchLogs) {
          setTimeout(() => {
            refetchLogs()
          }, 500)
        }
      } catch (error) {
        console.error('Error saving activity:', error)
        toast.error(t('common.error'))
      }
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

  const handleUsersChange = (users: User[]) => {
    setAssignedUsers(users)
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
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
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
                  <h1 className="text-lg font-semibold text-gray-900 truncate">{formData.name}</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditField('name')}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">ID: {activity.id}</p>
                {project && (
                  <>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-500 truncate">{project.name}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Budget Amount in Header */}
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <DollarSign className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      {editingField === 'budget' ? (
                        <Input
                          type="number"
                          value={formData.budget_amount}
                          onChange={(e) => handleInputChange('budget_amount', Number(e.target.value))}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingField(null)
                            }
                          }}
                          className="text-base font-semibold h-8 w-40"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="text-base font-semibold text-gray-900">
                            {formatCurrency(formData.budget_amount)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditField('budget')}
                            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{t('activities.modal.tooltips.total_requested_amount')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
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
                      onClick={() => handleOpenEditField('status')}
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
                      onClick={() => handleOpenEditField('priority')}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Category - Multiple Tags */}
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
                  <div className="flex flex-wrap gap-2">
                    {getActivityTagOptions().map(option => {
                      const isSelected = formData.tags.includes(option.value)
                      return (
                        <Button
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newTags = isSelected
                              ? formData.tags.filter(t => t !== option.value)
                              : [...formData.tags, option.value]
                            handleInputChange('tags', newTags)
                          }}
                          className={`h-7 text-xs transition-all duration-200 ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : 'hover:bg-muted hover:border-primary/50'
                          }`}
                        >
                          {option.label}
                        </Button>
                      )
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField(null)}
                      className="h-7 text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {t('activities.modal.done')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.length > 0 ? (
                        formData.tags.map(tag => (
                          <TagBadge
                            key={tag}
                            label={getTagLabel(tag)}
                            variant={getActivityTagVariant(tag)}
                            icon={getActivityTagIcon(tag)}
                            size="sm"
                          />
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">{t('activities.modal.no_category')}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditField('category')}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Assigned Users - Multiple */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('activities.modal.assignees')}:
                </span>
                {assignedUsers.length > 0 && (
                  <div className="flex items-center gap-1">
                    {/* Mostrar até 3 avatars empilhados */}
                    <div className="flex -space-x-2">
                      {assignedUsers.slice(0, 3).map((user, index) => (
                        <Avatar 
                          key={user.id}
                          className="h-8 w-8 border-2 border-white dark:border-gray-800"
                          style={{ zIndex: 3 - index }}
                        >
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs bg-muted text-foreground font-medium">
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {assignedUsers.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                          +{assignedUsers.length - 3}
                        </div>
                      )}
                    </div>
                    {assignedUsers.length === 1 && (
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {assignedUsers[0].name}
                      </span>
                    )}
                    {assignedUsers.length > 1 && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t('activities.modal.assignees_count', { count: assignedUsers.length })}
                      </span>
                    )}
                  </div>
                )}
                {!readOnly && (
                <UserMultiSelector
                  availableUsers={availableUsers}
                  selectedUsers={assignedUsers}
                  onUsersChange={handleUsersChange}
                  buttonLabel={assignedUsers.length > 0 ? t('common.edit') : t('common.add')}
                  dialogTitle={t('activities.modal.select_assignees')}
                  searchPlaceholder={t('activities.modal.search_user')}
                />
                )}
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
                  {!isDescriptionEditing && !readOnly && (
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
                  className={`relative border border-gray-200 rounded-lg p-4 min-h-[120px] group ${
                    readOnly
                      ? 'cursor-default'
                      : 'cursor-pointer hover:bg-gray-50 transition-colors'
                  }`}
                  onClick={() => { if (!readOnly) setIsDescriptionEditing(true) }}
                >
                  {formData.description ? (
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {formData.description}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic flex items-center justify-center h-full">
                      <div className="text-center">
                        <Edit3 className="w-5 h-5 mx-auto mb-2 opacity-50" />
                        {t('activities.modal.click_to_add_description')}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 shadow-sm">
                      {t('activities.modal.click_to_edit')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Upload Section - Minimalist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t('activities.modal.documents')}</h3>
                {pendingFiles.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {t('activities.documents.pending_upload_count', { count: pendingFiles.length })}
                  </div>
                )}
              </div>
              
              {/* Simple Drop Zone — hidden when project is read-only (concluded) */}
              {!readOnly && (
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.multiple = true
                  input.accept = 'image/*,application/pdf'
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files
                    if (files) {
                      const validFiles = Array.from(files).filter(file => {
                        const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
                        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
                        return isValidType && isValidSize
                      })
                      
                      if (validFiles.length > 0) {
                        setPendingFiles(prev => [...prev, ...validFiles])
                        setHasChanges(true)
                        toast.success(t('activities.documents.files_added', { count: validFiles.length }))
                      }
                    }
                  }
                  input.click()
                }}
                onDragEnter={(e) => { e.preventDefault() }}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const droppedFiles = Array.from(e.dataTransfer.files)
                    const validFiles = droppedFiles.filter(file => {
                      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
                      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
                      return isValidType && isValidSize
                    })

                    if (validFiles.length > 0) {
                      setPendingFiles(prev => [...prev, ...validFiles])
                      setHasChanges(true)
                      toast.success(t('activities.documents.files_added', { count: validFiles.length }))
                    }
                  }
                }}
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('activities.documents.drag_or_click')}</p>
                <p className="text-xs text-gray-500 mt-2">{t('activities.documents.supported_formats')}</p>
              </div>
              )}

              {/* Pending Files */}
              {pendingFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {pendingFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded text-sm"
                      >
                        {file.type.startsWith('image/') ? (
                          <Image className="w-3 h-3 text-blue-600" />
                        ) : (
                          <FileText className="w-3 h-3 text-blue-600" />
                        )}
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPendingFiles(prev => prev.filter((_, i) => i !== index))
                            if (pendingFiles.length === 1) {
                              setHasChanges(false)
                            }
                          }}
                          className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Documents */}
              {documentsLoading ? (
                <div className="text-center py-2 text-gray-400 text-sm">
                  {t('activities.documents.loading')}
                </div>
              ) : documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {doc.type.toLowerCase().includes('image') ? (
                          <Image className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        ) : (
                          <FileText className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        )}
                        <span className="truncate text-gray-700">{doc.filename}</span>
                        {doc.is_validated && (
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadDocument(doc.id, doc.filename)}
                          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Minimalist label */}
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  {documents.length + pendingFiles.length === 0 
                    ? t('activities.documents.no_files_attached')
                    : t('activities.documents.files_will_upload_on_save')
                  }
                </p>
              </div>
            </div>


          </div>
          
          {/* Internal Drawer - System Info */}
          {isSystemInfoOpen && (
            <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
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

              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white px-4">
                <button
                  onClick={() => setSystemInfoTab('metadata')}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    systemInfoTab === 'metadata'
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Info className="w-4 h-4 inline-block mr-1.5" />
                  {t('activities.modal.metadata')}
                  {systemInfoTab === 'metadata' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
                <button
                  onClick={() => setSystemInfoTab('logs')}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    systemInfoTab === 'logs'
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <History className="w-4 h-4 inline-block mr-1.5" />
                  {t('activities.modal.history')}
                  {systemInfoTab === 'logs' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {systemInfoTab === 'metadata' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">{t('activities.modal.technical_details')}</p>

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
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">{t('activities.modal.change_history')}</p>
                    <ActivityLogs
                      logs={logsData?.projectActivityLogs || []}
                      isLoading={logsLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex justify-between">
            <div className="flex items-center">
              {readOnly && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-default select-none">
                        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{readOnlyReason ?? t('activities.modal.readOnly') ?? 'Read-only'}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      {readOnlyReason ?? t('activities.modal.readOnlyTooltip') ?? 'This activity cannot be edited because the project is concluded.'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {!readOnly && (hasChanges || pendingFiles.length > 0) && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {pendingFiles.length > 0 
                      ? t('activities.modal.unsaved_changes_and_files', { count: pendingFiles.length })
                      : t('activities.modal.unsaved_changes')
                    }
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} size="sm" className="px-4 h-8 text-gray-600 border-gray-300">
                {t('activities.modal.close')}
              </Button>
              {!readOnly && (hasChanges || pendingFiles.length > 0) && (
                <Button 
                  onClick={handleSave}
                  size="sm"
                  disabled={documentsUploading}
                  className="px-4 h-8 bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {documentsUploading 
                    ? t('activities.modal.saving_and_uploading')
                    : pendingFiles.length > 0
                      ? t('activities.modal.save_and_upload', { count: pendingFiles.length })
                      : t('activities.modal.save_changes')
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}