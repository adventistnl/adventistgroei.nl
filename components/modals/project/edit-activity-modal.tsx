"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { 
  Activity,
  DollarSign,
  Edit,
  FileText,
  CheckCircle
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
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ActivityData } from "@/components/projects/project-subsidies-table"

export interface EditActivityFormData {
  name: string
  description: string
  budget_amount: number
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
    name: "",
    description: "",
    budget_amount: 0,
  })

  const [errors, setErrors] = useState<Partial<EditActivityFormData>>({})

  // Load activity data when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        description: activity.description,
        budget_amount: activity.budget_amount,
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

    // Warning if reducing budget below approved receipts
    if (activity && formData.budget_amount < activity.approvedAmount) {
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
              <span className="text-sm font-medium">Atividade Atual</span>
              <Badge variant="outline">
                {activity.receiptsCount} recibos
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Orçamento atual:</span>
                <p className="font-medium">R$ {activity.budget_amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor aprovado:</span>
                <p className="font-medium text-green-600">R$ {activity.approvedAmount.toLocaleString()}</p>
              </div>
            </div>

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
