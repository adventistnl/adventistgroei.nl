"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Activity,
  Calendar,
  DollarSign,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Package,
  GraduationCap,
  Edit,
  X,
  Copy,
  Check
} from "lucide-react"
import { ProjectActivityData } from "../../projects/project-activities-table"
import toast from "react-hot-toast"

export interface ViewActivityModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  activity: ProjectActivityData | null
  onEdit?: (activity: ProjectActivityData) => void
}

export function ViewActivityModal({
  isOpen,
  onOpenChange,
  activity,
  onEdit
}: ViewActivityModalProps) {
  const { i18n } = useTranslation()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!activity) return null

  // Helper functions
  const getActivityTagIcon = (tag: string) => {
    switch (tag) {
      case "reforma": return <Wrench className="w-4 h-4" />
      case "material": return <Package className="w-4 h-4" />
      case "training": return <GraduationCap className="w-4 h-4" />
      default: return <Tag className="w-4 h-4" />
    }
  }

  const getActivityTagColor = (tag: string) => {
    switch (tag) {
      case "reforma": return "bg-orange-100 text-orange-800 border-orange-200"
      case "material": return "bg-blue-100 text-blue-800 border-blue-200" 
      case "training": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in_progress": return <Clock className="w-4 h-4 text-blue-600" />
      case "pending_approval": return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "planning": return <Activity className="w-4 h-4 text-gray-600" />
      case "cancelled": return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending_approval": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "planning": return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(activity)
      onOpenChange(false)
    }
  }

  const calculateSubsidyPercentage = () => {
    if (!activity.is_subsidized || !activity.subsidy_amount) return 0
    return Math.round((activity.subsidy_amount / activity.budget_amount) * 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[60vw] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{activity.name}</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  ID: {activity.id}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activity.is_subsidized && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Subsidiada
                </Badge>
              )}
              <Button onClick={handleEdit} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            
            {/* Activity Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {activity.tags && activity.tags.length > 0 ? (
                      activity.tags.map((tag: any) => (
                        <Badge key={tag} variant="outline" className={`${getActivityTagColor(tag)} flex items-center gap-1`}>
                          {getActivityTagIcon(tag)}
                          <span className="text-xs">{getTagLabel(tag)}</span>
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">
                        <Tag className="w-4 h-4" />
                        <span className="text-xs">Sem categoria</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Categorias</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${getStatusColor(activity.status)} flex items-center gap-1`}>
                      {getStatusIcon(activity.status)}
                      <span className="text-xs">{getStatusLabel(activity.status)}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${getPriorityColor(activity.priority)} text-xs`}>
                      {getPriorityLabel(activity.priority)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Prioridade</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(activity.budget_amount)}
                  </div>
                  <p className="text-xs text-muted-foreground">Orçamento Total</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome da Atividade</label>
                    <div className="flex items-center justify-between group mt-1">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(activity.name, 'name')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      >
                        {copiedField === 'name' ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                    <div className="flex items-start justify-between group mt-1">
                      <p className="text-sm text-gray-900 flex-1 pr-2">{activity.description}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(activity.description, 'description')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto flex-shrink-0"
                      >
                        {copiedField === 'description' ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5" />
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Orçamento Total</label>
                    <div className="flex items-center justify-between group mt-1">
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(activity.budget_amount)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(formatCurrency(activity.budget_amount), 'budget')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      >
                        {copiedField === 'budget' ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {activity.is_subsidized && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Valor do Subsídio</label>
                        <div className="flex items-center justify-between group mt-1">
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(activity.subsidy_amount || 0)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(formatCurrency(activity.subsidy_amount || 0), 'subsidy')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                          >
                            {copiedField === 'subsidy' ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {calculateSubsidyPercentage()}% do orçamento total
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Valor Próprio</label>
                        <p className="text-lg font-semibold text-gray-600 mt-1">
                          {formatCurrency(activity.budget_amount - (activity.subsidy_amount || 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {100 - calculateSubsidyPercentage()}% do orçamento total
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Timeline and System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                      <p className="text-sm font-medium mt-1">{formatDate(activity.created_at)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Criado por</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{activity.created_by}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                      <p className="text-sm font-medium mt-1">{formatDate(activity.updated_at)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Atualizado por</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{activity.updated_by}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Atividade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}