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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Editor } from "@/components/blocks/editor-x/editor"
import toast from "react-hot-toast"

// Tipos para os documentos da atividade
export interface ActivityDocument {
  id: string
  activity_id: string
  file_url: string
  type: "INVOICE" | "RECEIPT" | "CONTRACT" | "OTHER"
  is_validated: boolean
  uploaded_by: string
  created_at: string
  validated_at?: string
  filename?: string
}

export interface ActivityDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  activity: ProjectActivityData | null
  onSave?: (activity: Partial<ProjectActivityData>) => void
  project?: { title: string } | null
}

export function ActivityDetailsModal({
  isOpen,
  onClose,
  activity,
  onSave,
  project
}: ActivityDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editorState, setEditorState] = useState<any>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: activity?.name || "",
    status: activity?.status || "",
    priority: activity?.priority || "",
    activity_tag: activity?.activity_tag || "",
    budget_amount: activity?.budget_amount || 0,
    description: activity?.description || "",
    is_subsidized: activity?.is_subsidized || false
  })

  // Documentos mockados baseados na estrutura definida
  const [documents, setDocuments] = useState<ActivityDocument[]>([
    {
      id: "1",
      activity_id: activity?.id || "",
      file_url: "/documents/invoice-001.pdf",
      type: "INVOICE",
      is_validated: true,
      uploaded_by: "user1",
      created_at: "2024-01-15T10:30:00Z",
      validated_at: "2024-01-16T14:20:00Z",
      filename: "Fatura_Material_Construção.pdf"
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
    },
    {
      id: "3",
      activity_id: activity?.id || "",
      file_url: "/documents/contract-001.pdf", 
      type: "CONTRACT",
      is_validated: true,
      uploaded_by: "user2",
      created_at: "2024-01-10T16:45:00Z",
      validated_at: "2024-01-12T11:30:00Z",
      filename: "Contrato_Reforma_Igreja.pdf"
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

  // Bloquear scroll da página quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.pointerEvents = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
    }
    
    // Cleanup quando componente é desmontado
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
    }
  }, [isOpen])

  if (!isOpen || !activity) return null

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

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INVOICE: "Fatura",
      RECEIPT: "Recibo",
      CONTRACT: "Contrato", 
      OTHER: "Outro"
    }
    return labels[type] || type
  }

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      INVOICE: "bg-blue-100 text-blue-800 border-blue-200",
      RECEIPT: "bg-green-100 text-green-800 border-green-200",
      CONTRACT: "bg-purple-100 text-purple-800 border-purple-200",
      OTHER: "bg-gray-100 text-gray-800 border-gray-200"
    }
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200"
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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success("Copiado para área de transferência!", { duration: 2000 })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error("Falha ao copiar")
    }
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
      toast.success("Atividade salva com sucesso!")
      setHasChanges(false)
    }
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter(file => {
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

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const handleDocumentClick = (document: ActivityDocument) => {
    window.open(document.file_url, '_blank')
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
        
        {/* Header com Título do Projeto */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Project's {project?.title || 'Projeto'} Activity
              </h1>
              <div className="flex items-center gap-2">
                {editingField === 'name' ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => setEditingField(null)}
                    className="text-sm font-medium h-6 border-0 p-0 focus-visible:ring-0 bg-transparent"
                    placeholder="Digite o nome da atividade"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">{formData.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField('name')}
                      className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
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
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Info className="w-4 h-4" />
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

        {/* Informações Principais */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Status, Prioridade e Subsídio */}
          <div className="flex items-center gap-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700">Status:</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Estado atual da atividade</p>
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
                  <SelectTrigger className="w-[200px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planejamento</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="pending_approval">Pendente Aprovação</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`px-3 py-1 text-sm font-medium ${
                      formData.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      formData.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      formData.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      formData.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
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

            {/* Prioridade */}
              {/* Prioridade */}
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Prioridade:</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Nível de urgência da atividade</p>
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
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
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

              {/* Categoria */}
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Categoria:</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Tipo de atividade</p>
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
                      <SelectItem value="reforma">Reforma</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="training">Treinamento</SelectItem>
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
            </div>            {/* Ícone de Subsídio */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700">Subsídio:</Label>
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

          {/* Orçamento e Categoria */}
          <div className="grid grid-cols-2 gap-6">
            {/* Orçamento */}
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
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">Orçamento Total</Label>
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
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-gray-600" />
              <Label className="text-sm font-medium text-gray-700">Categoria:</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Tipo de atividade</p>
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
                    <SelectItem value="reforma">Reforma</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="training">Treinamento</SelectItem>
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
        </div>

        {/* Conteúdo Principal com Drawer */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conteúdo Principal */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-300 ${
            isSystemInfoOpen ? 'mr-80' : ''
          }`}>
            
            {/* Descrição com Editor Condicional */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-semibold text-gray-900">Descrição</Label>
                <div className="flex items-center gap-2">
                  {editingField !== 'description' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField('description')}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                  {editingField === 'description' && (
                    <span className="text-xs text-gray-500">Editor Rico</span>
                  )}
                </div>
              </div>
              
              {editingField === 'description' ? (
                <div className="min-h-[200px]">
                  <Editor 
                    onChange={(state) => {
                      setEditorState(state)
                      // Try to extract text content from editor state
                      try {
                        const textContent = typeof state === 'string' ? state : JSON.stringify(state)
                        handleInputChange('description', textContent)
                      } catch (error) {
                        handleInputChange('description', '')
                      }
                    }}
                    onSerializedChange={(serializedState) => {
                      // Aqui você pode salvar o estado serializado se necessário
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingField(null)}
                      className="px-3 h-8"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setEditingField(null)}
                      className="px-3 h-8"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="min-h-[100px] p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setEditingField('description')}
                >
                  {formData.description ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Clique para adicionar uma descrição...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Arquivos Carregados */}
            {uploadedFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Arquivos Carregados</h4>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 group hover:bg-gray-200 transition-colors"
                    >
                      {getFileIcon(file)}
                      <span className="text-sm text-gray-700 max-w-[120px] truncate">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dropzone para Upload */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Anexar Documentos</h3>
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                  ${dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500">
                    Suporta PDF e imagens (até 10MB cada)
                  </p>
                </div>
              </div>
            </div>

            {/* Documentos Existentes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Documentos Existentes ({documents.length})
              </h4>
              
              {documents.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer group hover:bg-gray-50 transition-colors"
                      onClick={() => handleDocumentClick(document)}
                    >
                      <File className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 max-w-[120px] truncate">
                        {document.filename}
                      </span>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0 ${getDocumentTypeColor(document.type)}`}
                      >
                        {getDocumentTypeLabel(document.type)}
                      </Badge>
                      
                      {document.is_validated ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                      )}
                      
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <File className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">Nenhum documento anexado</p>
                  <p className="text-xs mt-1">Use o dropzone acima para adicionar documentos</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Drawer Interno - Informações do Sistema */}
          {isSystemInfoOpen && (
            <div className="w-64 border-l border-gray-200 bg-gray-50 p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Informações do Sistema</h3>
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
                  <p className="text-xs font-medium text-gray-500 mb-1">ID da Atividade</p>
                  <p className="text-sm text-gray-700 font-mono break-all">{activity.id}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Criado em</p>
                  <p className="text-sm text-gray-700">{formatDate(activity.created_at)}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Atualizado em</p>
                  <p className="text-sm text-gray-700">{formatDate(activity.updated_at)}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Criado por</p>
                  <p className="text-sm text-gray-700">{activity.created_by}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Atualizado por</p>
                  <p className="text-sm text-gray-700">{activity.updated_by}</p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Status de Validação</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Verificado</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Últimas Atualizações</p>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Orçamento:</span>
                      <span>Há 2 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>Há 1 dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Descrição:</span>
                      <span>Há 3 dias</span>
                    </div>
                  </div>
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
                  <span>Existem alterações não salvas</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} size="sm" className="px-4 h-8 text-gray-600 border-gray-300">
                Fechar
              </Button>
              {hasChanges && (
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="px-4 h-8 bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Salvar Alterações
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}