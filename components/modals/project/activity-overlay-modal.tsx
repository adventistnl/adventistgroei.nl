"use client"

import React, { useState, useEffect } from "react"
import { X, Activity, DollarSign, Calendar, User, Clock, CheckCircle, AlertCircle, Edit3, Copy, Check, Tag, Wrench, Package, GraduationCap, ChevronDown, Upload, FileText, Receipt } from "lucide-react"
import { ProjectActivityData } from "../../projects/project-activities-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast"

export interface ActivityOverlayModalProps {
  isOpen: boolean
  onClose: () => void
  activity: ProjectActivityData | null
  onEdit?: (activity: ProjectActivityData) => void
}

export function ActivityOverlayModal({
  isOpen,
  onClose,
  activity,
  onEdit
}: ActivityOverlayModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(activity?.status || "")
  const [activeTab, setActiveTab] = useState<"description" | "checklist">("description")

  // Update currentStatus when activity changes
  useEffect(() => {
    if (activity) {
      setCurrentStatus(activity.status)
    }
  }, [activity])
  const [checklistItems, setChecklistItems] = useState([
    { id: "1", label: "Documentação preparada", completed: false },
    { id: "2", label: "Upload de recibos", completed: false },
    { id: "3", label: "Aprovação de orçamento", completed: false },
    { id: "4", label: "Validação técnica", completed: false },
    { id: "5", label: "Criação de subsídio", completed: false },
    { id: "6", label: "Aprovação final", completed: false }
  ])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case "in_progress": return <Clock className="w-5 h-5 text-blue-500" />
      case "pending_approval": return <AlertCircle className="w-5 h-5 text-amber-500" />
      case "planning": return <Activity className="w-5 h-5 text-slate-500" />
      case "cancelled": return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Activity className="w-5 h-5 text-slate-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "in_progress": return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending_approval": return "bg-amber-50 text-amber-700 border-amber-200"
      case "planning": return "bg-slate-50 text-slate-700 border-slate-200"
      case "cancelled": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-slate-500"
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

  const calculateSubsidyPercentage = () => {
    if (!activity.is_subsidized || !activity.subsidy_amount) return 0
    return Math.round((activity.subsidy_amount / activity.budget_amount) * 100)
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    toast.success(`Status alterado para: ${getStatusLabel(newStatus)}`)
    // Aqui você pode adicionar a lógica para salvar o status no backend
  }

  const handleChecklistToggle = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const completedItems = checklistItems.filter(item => item.completed).length
  const totalItems = checklistItems.length
  const progress = Math.round((completedItems / totalItems) * 100)

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="relative w-[60vw] h-[85vh] bg-white rounded-lg shadow-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-gray-200">
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{activity.name}</h1>
              <p className="text-sm text-gray-500">ID: {activity.id}</p>
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

        {/* Status Section */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">STATUS</label>
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full h-8 text-sm bg-white">
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
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">PRIORIDADE</label>
              <div className="h-8 flex items-center">
                <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 text-xs">
                  {getPriorityLabel(activity.priority)}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">CATEGORIA</label>
              <div className="h-8 flex items-center">
                <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 text-xs flex items-center gap-1">
                  {getActivityTagIcon(activity.activity_tag)}
                  {getTagLabel(activity.activity_tag)}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ORÇAMENTO</label>
              <div className="h-8 flex items-center">
                <span className="text-sm font-medium text-gray-900">{formatCurrency(activity.budget_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "description" | "checklist")} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 bg-gray-100">
              <TabsTrigger value="description" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                Descrição
              </TabsTrigger>
              <TabsTrigger value="checklist" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                Checklist ({completedItems}/{totalItems})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="description" className="p-4 space-y-4 h-full">
                {/* Description */}
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Descrição da Atividade</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(activity.description, 'description')}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        {copiedField === 'description' ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>
                  </CardContent>
                </Card>

                {/* Financial Info */}
                {activity.is_subsidized && (
                  <Card className="border-gray-200">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Informações Financeiras</h3>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500 mb-1">Orçamento Total</p>
                          <p className="font-medium text-gray-900">{formatCurrency(activity.budget_amount)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500 mb-1">Valor Subsidiado</p>
                          <p className="font-medium text-gray-900">{formatCurrency(activity.subsidy_amount || 0)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500 mb-1">Valor Próprio</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(activity.budget_amount - (activity.subsidy_amount || 0))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* System Info */}
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Informações do Sistema</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Criado em:</p>
                        <p className="text-gray-700">{formatDate(activity.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Atualizado em:</p>
                        <p className="text-gray-700">{formatDate(activity.updated_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Criado por:</p>
                        <p className="text-gray-700">{activity.created_by}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Atualizado por:</p>
                        <p className="text-gray-700">{activity.updated_by}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="checklist" className="p-4 h-full">
                <Card className="border-gray-200 h-full">
                  <CardContent className="p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Validação da Atividade</h3>
                      <div className="text-xs text-gray-500">
                        Progresso: {progress}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gray-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3">
                      {checklistItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded border border-gray-100">
                          <Checkbox
                            id={item.id}
                            checked={item.completed}
                            onCheckedChange={() => handleChecklistToggle(item.id)}
                            className="border-gray-300"
                          />
                          <label
                            htmlFor={item.id}
                            className={`text-sm cursor-pointer flex-1 ${
                              item.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                            }`}
                          >
                            {item.label}
                          </label>
                          {item.id === "2" && (
                            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                              <Upload className="w-3 h-3 mr-1" />
                              Upload
                            </Button>
                          )}
                          {item.id === "5" && (
                            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                              <Receipt className="w-3 h-3 mr-1" />
                              Criar
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Recibos
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <Receipt className="w-3 h-3 mr-1" />
                          Criar Subsídio
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} size="sm" className="px-4 h-8 text-gray-600 border-gray-300">
              Fechar
            </Button>
            {onEdit && (
              <Button 
                onClick={() => {
                  onEdit(activity)
                  onClose()
                }}
                size="sm"
                className="px-4 h-8 bg-gray-800 hover:bg-gray-900 text-white"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}