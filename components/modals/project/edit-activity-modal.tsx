"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Activity,
  DollarSign,
  Edit,
  FileText,
  CheckCircle,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  User
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ActivityData } from "@/components/projects/project-subsidies-table"

export interface EditActivityFormData {
  id: string
  name: string
  description: string
  budget_amount: number
  tags: string[]
  custom_tags: string[]
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "completed" | "on_hold"
  is_subsidized: boolean
  institution_requested_amount?: number
  deadline: string
}

interface EditActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EditActivityFormData) => void
  activity?: ActivityData
}

export function EditActivityModal({ isOpen, onClose, onSubmit, activity }: EditActivityModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<EditActivityFormData>({
    id: "",
    name: "",
    description: "",
    budget_amount: 0,
    tags: [],
    custom_tags: [],
    priority: "medium",
    status: "todo",
    is_subsidized: false,
    deadline: "",
  })

  const [errors, setErrors] = useState<Partial<EditActivityFormData>>({})

  // Load activity data when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        budget_amount: activity.budget_amount,
        tags: activity.tags || [],
        custom_tags: activity.custom_tags || [],
        priority: (activity.priority?.toLowerCase() as EditActivityFormData["priority"]) || "medium",
        status: (activity.status?.toLowerCase() as EditActivityFormData["status"]) || "todo",
        is_subsidized: activity.is_subsidized || false,
        deadline: activity.deadline || "",
        institution_requested_amount: activity.activity_funding?.[0]?.entity_contribution_amount,
      })
    }
  }, [activity])

  const validateForm = (): boolean => {
    const newErrors: Partial<EditActivityFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Activity name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Activity description is required"
    }

    if (formData.budget_amount <= 0) {
      newErrors.budget_amount = "Budget amount must be greater than 0"
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required"
    }

    // Warning if reducing budget below approved receipts
    if (activity && activity.approvedAmount && formData.budget_amount < activity.approvedAmount) {
      newErrors.budget_amount = `Budget cannot be less than approved receipts: R$ ${activity.approvedAmount.toLocaleString()}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      setErrors({})
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  if (!activity) {
    return null
  }

  const hasApprovedReceipts = activity.receiptsCount > 0 && activity.approvedAmount > 0

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit className="w-5 h-5" />
            {t.activity.editActivity}
          </DialogTitle>
          <DialogDescription>
            Editar atividade: {activity.name}
          </DialogDescription>
        </DialogHeader>

        {/* Activity Context */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Informações da Atividade</span>
              <div className="flex gap-2">
                {activity.receiptsCount !== undefined && (
                  <Badge variant="outline">
                    {activity.receiptsCount} recibos
                  </Badge>
                )}
                <Badge variant="outline" className={cn(
                  activity.status === "completed" ? "bg-green-100 text-green-700" :
                  activity.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                  activity.status === "on_hold" ? "bg-orange-100 text-orange-700" :
                  "bg-gray-100 text-gray-700"
                )}>
                  {activity.status === "todo" ? "A Fazer" :
                   activity.status === "in_progress" ? "Em Progresso" :
                   activity.status === "completed" ? "Concluído" :
                   activity.status === "on_hold" ? "Em Espera" : activity.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Orçamento atual:</span>
                <p className="font-medium">R$ {activity.budget_amount.toLocaleString()}</p>
              </div>
              {activity.approvedAmount !== undefined && (
                <div>
                  <span className="text-muted-foreground">Valor aprovado:</span>
                  <p className="font-medium text-green-600">R$ {activity.approvedAmount.toLocaleString()}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Prazo:</span>
                <p className="font-medium">
                  {activity.deadline ? new Date(activity.deadline).toLocaleDateString('pt-BR') : "Não definido"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Prioridade:</span>
                <p className="font-medium">
                  {activity.priority === "low" ? "Baixa" :
                   activity.priority === "medium" ? "Média" :
                   activity.priority === "high" ? "Alta" :
                   activity.priority === "urgent" ? "Urgente" : activity.priority}
                </p>
              </div>
            </div>

            {activity.tags && activity.tags.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activity.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {hasApprovedReceipts && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">
                    Atenção: Esta atividade possui recibos aprovados
                  </span>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Alterações no orçamento podem afetar a aprovação dos recibos existentes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.activity.activityName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t.activity.enterActivityName}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t.activity.activityDescription} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t.activity.describeActivity}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn("min-h-[100px]", errors.description ? "border-red-500" : "")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_amount">
                {t.activity.budgetAmount} (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="budget_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.budget_amount || ""}
                onChange={(e) => setFormData({ ...formData, budget_amount: parseFloat(e.target.value) || 0 })}
                className={errors.budget_amount ? "border-red-500" : ""}
              />
              {errors.budget_amount && (
                <p className="text-sm text-red-500">{errors.budget_amount}</p>
              )}
              
              {/* Budget change impact */}
              {formData.budget_amount !== activity.budget_amount && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Orçamento anterior:</span>
                      <span className="font-medium">R$ {activity.budget_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Novo orçamento:</span>
                      <span className="font-medium text-blue-600">R$ {formData.budget_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diferença:</span>
                      <span className={`font-medium ${formData.budget_amount > activity.budget_amount ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.budget_amount > activity.budget_amount ? '+' : ''}
                        R$ {(formData.budget_amount - activity.budget_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Prazo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ""}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={errors.deadline ? "border-red-500" : ""}
              />
              {errors.deadline && (
                <p className="text-sm text-red-500">{errors.deadline}</p>
              )}
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Prioridade
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as EditActivityFormData["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-700">Baixa</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Média</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-100 text-orange-700">Alta</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-100 text-red-700">Urgente</Badge>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as EditActivityFormData["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">A Fazer</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">Em Progresso</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="completed">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-700">Concluído</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="on_hold">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-100 text-orange-700">Em Espera</Badge>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags/Categorias
              </Label>
              <Input
                id="tags"
                placeholder="Ex: Reforma, Equipamentos, Materiais (separados por vírgula)"
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                })}
              />
              <p className="text-xs text-muted-foreground">
                Separe as tags por vírgula
              </p>
            </div>

            {/* Custom Tags */}
            <div className="space-y-2">
              <Label htmlFor="custom_tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags Personalizadas
              </Label>
              <Input
                id="custom_tags"
                placeholder="Ex: Tag1, Tag2, Tag3 (separados por vírgula)"
                value={formData.custom_tags.join(", ")}
                onChange={(e) => setFormData({
                  ...formData,
                  custom_tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                })}
              />
              <p className="text-xs text-muted-foreground">
                Adicione tags personalizadas separadas por vírgula
              </p>
            </div>

            {/* Owner (Display Only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Responsável
              </Label>
              <div className="p-3 bg-muted rounded-lg border">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {activity.owner?.name || "Não atribuído"}
                  </Badge>
                  {activity.owner?.email && (
                    <span className="text-xs text-muted-foreground">
                      {activity.owner.email}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                O responsável não pode ser alterado aqui
              </p>
            </div>

            {/* Subsidy Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_subsidized"
                  checked={formData.is_subsidized}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_subsidized: checked as boolean })}
                />
                <Label htmlFor="is_subsidized" className="flex items-center gap-2 cursor-pointer">
                  <DollarSign className="w-4 h-4" />
                  Esta atividade requer subsídio
                </Label>
              </div>

              {formData.is_subsidized && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Label htmlFor="institution_requested_amount" className="text-sm">
                    Valor Solicitado (R$)
                  </Label>
                  <Input
                    id="institution_requested_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.institution_requested_amount || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      institution_requested_amount: parseFloat(e.target.value) || undefined
                    })}
                    className="mt-2"
                  />
                  {activity.activity_funding && activity.activity_funding.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>Financiamento atual:</p>
                      <ul className="list-disc list-inside">
                        {activity.activity_funding.map((funding) => (
                          <li key={funding.id}>
                            {funding.entity_type}: R$ {funding.entity_contribution_amount.toLocaleString()}
                            ({funding.entity_contribution_percent}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
