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
  Flag
} from "lucide-react"
import { ProjectActivityData } from "../../projects/project-activities-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Editor } from "@/components/blocks/editor-x/editor"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

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
}

export function ActivityDetailsModal({
  isOpen,
  onClose,
  activity,
  onSave,
  project
}: ActivityDetailsModalProps) {
  const { t } = useTranslation()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editorState, setEditorState] = useState<any>(null)
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: activity?.name || "",
    status: activity?.status || "",
    priority: activity?.priority || "",
    activity_tag: activity?.activity_tag || "",
    budget_amount: activity?.budget_amount || 0,
    description: activity?.description || "Esta é uma descrição de teste para demonstrar o funcionamento do editor rico.\n\nVocê pode formatar o texto, adicionar listas, links e outros elementos.\n\nClique no botão de editar para modificar este conteúdo usando o editor avançado.",
    is_subsidized: activity?.is_subsidized || false
  })

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
        is_subsidized: activity.is_subsidized
      })
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

  // Helper functions
  const getActivityTagIcon = (tag: string) => {
    switch (tag) {
      case "reforma": return <Wrench className="w-4 h-4" />
      case "material": return <Package className="w-4 h-4" />
      case "training": return <GraduationCap className="w-4 h-4" />
      default: return <Tag className="w-4 h-4" />
    }
  }

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
      reforma: "Reforma",
      material: "Material",
      training: "Treinamento"
    }
    return labels[tag] || tag
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(amount)
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
    if (onSave) {
      onSave(formData as Partial<ProjectActivityData>)
      toast.success(t('common.success'))
      setHasChanges(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
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
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 text-sm font-medium ${
                        formData.status === 'todo' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                        formData.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        formData.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {getStatusLabel(formData.status)}
                    </Badge>
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
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 text-sm font-medium ${
                        formData.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                        formData.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}
                    >
                      {getPriorityLabel(formData.priority)}
                    </Badge>
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
                      <SelectItem value="reforma">{t('activities.modal.category_options.reforma')}</SelectItem>
                      <SelectItem value="material">{t('activities.modal.category_options.material')}</SelectItem>
                      <SelectItem value="training">{t('activities.modal.category_options.training')}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 text-sm font-medium ${
                        formData.activity_tag === 'reforma' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        formData.activity_tag === 'material' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                        'bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}
                    >
                      <span className="mr-1">{getActivityTagIcon(formData.activity_tag)}</span>
                      {getTagLabel(formData.activity_tag)}
                    </Badge>
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

          {/* Budget Section */}
          <div className={`rounded-lg p-4 ${
            formData.is_subsidized 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-gray-50 border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  formData.is_subsidized 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                }`}>
                  <DollarSign className={`w-4 h-4 ${
                    formData.is_subsidized ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-1 block">{t('activities.modal.total_budget')}</Label>
                  {editingField === 'budget' ? (
                    <Input
                      type="number"
                      value={formData.budget_amount}
                      onChange={(e) => handleInputChange('budget_amount', Number(e.target.value))}
                      onBlur={() => setEditingField(null)}
                      className="text-lg font-bold h-8 border-0 p-0 focus-visible:ring-0 bg-transparent"
                      placeholder="0,00"
                      autoFocus
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(formData.budget_amount)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingField('budget')}
                className={`h-6 w-6 p-0 ${
                  formData.is_subsidized 
                    ? 'text-green-400 hover:text-green-600 hover:bg-green-100' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content with Drawer */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-300 ${
            isSystemInfoOpen ? 'mr-64' : ''
          }`}>
            
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
                    onChange={(state) => {
                      setEditorState(state)
                      const extractedText = extractTextFromEditorState(state)
                      handleInputChange('description', extractedText)
                    }}
                  />
                  {!editorState && (
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