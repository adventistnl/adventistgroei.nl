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
  PanelRight
} from "lucide-react"
import { ProjectActivityData } from "../../projects/project-activities-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
  
  // Form states
  const [formData, setFormData] = useState({
    name: activity?.name || "",
    status: activity?.status || "",
    priority: activity?.priority || "",
    activity_tag: activity?.activity_tag || "",
    budget_amount: activity?.budget_amount || 0,
    description: activity?.description || ""
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
        description: activity.description
      })
    }
  }, [activity])

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

  const handleInputChange = (field: string, value: string | number) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="relative w-[60vw] h-[85vh] bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header com Título do Projeto */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Project's {project?.title || 'Projeto'} Activity
              </h1>
              <p className="text-sm text-gray-500">{activity.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sheet open={isSystemInfoOpen} onOpenChange={setIsSystemInfoOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Informações do Sistema</SheetTitle>
                  <SheetDescription>
                    Detalhes técnicos e metadados da atividade
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">ID da Atividade</p>
                      <p className="text-gray-700 font-mono">{activity.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Criado em</p>
                      <p className="text-gray-700">{formatDate(activity.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Atualizado em</p>
                      <p className="text-gray-700">{formatDate(activity.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Criado por</p>
                      <p className="text-gray-700">{activity.created_by}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Atualizado por</p>
                      <p className="text-gray-700">{activity.updated_by}</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
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

        {/* Status em Destaque */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700">Status:</Label>
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
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Campos Editáveis */}
          <div className="grid grid-cols-3 gap-4">
            {/* Prioridade */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-900">Prioridade</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingField('priority')}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                {editingField === 'priority' ? (
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => {
                      handleInputChange('priority', value)
                      setEditingField(null)
                    }}
                  >
                    <SelectTrigger className="w-full text-sm">
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
                  <Badge 
                    variant="outline" 
                    className={`px-3 py-1 text-sm ${
                      formData.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                      formData.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {getPriorityLabel(formData.priority)}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Categoria */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-900">Categoria</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingField('category')}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                {editingField === 'category' ? (
                  <Select 
                    value={formData.activity_tag} 
                    onValueChange={(value) => {
                      handleInputChange('activity_tag', value)
                      setEditingField(null)
                    }}
                  >
                    <SelectTrigger className="w-full text-sm">
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
                    {getActivityTagIcon(formData.activity_tag)}
                    <span className="text-sm text-gray-700">{getTagLabel(formData.activity_tag)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orçamento */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-900">Orçamento</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingField('budget')}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
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
                    className="w-full text-sm"
                    placeholder="0,00"
                    autoFocus
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(formData.budget_amount)}
                  </span>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Nome da Atividade */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900">Nome da Atividade</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField('name')}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              {editingField === 'name' ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="w-full text-sm"
                  placeholder="Digite o nome da atividade"
                  autoFocus
                />
              ) : (
                <p className="text-sm text-gray-700">{formData.name}</p>
              )}
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900">Descrição da Atividade</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField('description')}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              {editingField === 'description' ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="w-full min-h-[120px] text-sm resize-none"
                  placeholder="Descreva os detalhes da atividade..."
                  autoFocus
                />
              ) : (
                <p className="text-sm text-gray-700">{formData.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Arquivos Carregados */}
          {uploadedFiles.length > 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Arquivos Carregados</h4>
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
              </CardContent>
            </Card>
          )}

          {/* Dropzone para Upload */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Anexar Documentos</h3>
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
            </CardContent>
          </Card>

          {/* Documentos Existentes */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
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
            </CardContent>
          </Card>
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