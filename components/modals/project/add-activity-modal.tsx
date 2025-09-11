"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Activity,
  DollarSign,
  Plus
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
import { SubsidyRequestData } from "@/components/projects/project-subsidies-table"

export interface ActivityFormData {
  name: string
  description: string
  budget_amount: number
}

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ActivityFormData) => void
  subsidy?: SubsidyRequestData
}

export function AddActivityModal({ isOpen, onClose, onSubmit, subsidy }: AddActivityModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    description: "",
    budget_amount: 0,
  })

  const [errors, setErrors] = useState<Partial<ActivityFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ActivityFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Activity name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Activity description is required"
    }

    if (formData.budget_amount <= 0) {
      newErrors.budget_amount = "Budget amount must be greater than 0"
    }

    // Validate budget doesn't exceed remaining subsidy budget
    if (subsidy) {
      const allocatedBudget = subsidy.activities.reduce((sum, act) => sum + act.budget_amount, 0)
      const remainingSubsidyBudget = subsidy.total_budget - allocatedBudget
      
      if (formData.budget_amount > remainingSubsidyBudget) {
        newErrors.budget_amount = `Budget cannot exceed remaining subsidy budget: R$ ${remainingSubsidyBudget.toLocaleString()}`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      // Reset form
      setFormData({
        name: "",
        description: "",
        budget_amount: 0,
      })
      setErrors({})
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      budget_amount: 0,
    })
    setErrors({})
    onClose()
  }

  if (!subsidy) {
    return null
  }

  const allocatedBudget = subsidy.activities.reduce((sum, act) => sum + act.budget_amount, 0)
  const remainingSubsidyBudget = subsidy.total_budget - allocatedBudget

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t.activity.addActivity}
          </DialogTitle>
          <DialogDescription>
            Adicionar nova atividade ao pedido de subsídio
          </DialogDescription>
        </DialogHeader>

        {/* Subsidy Context */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pedido de Subsídio</span>
              <Badge variant="outline">
                R$ {subsidy.total_budget.toLocaleString()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {subsidy.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Orçamento alocado:</span>
                <p className="font-medium">R$ {allocatedBudget.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Orçamento restante:</span>
                <p className="font-medium text-blue-600">R$ {remainingSubsidyBudget.toLocaleString()}</p>
              </div>
            </div>
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
              {formData.budget_amount > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Percentual do subsídio: <strong>{((formData.budget_amount / subsidy.total_budget) * 100).toFixed(1)}%</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Orçamento restante após esta atividade: <strong>R$ {(remainingSubsidyBudget - formData.budget_amount).toLocaleString()}</strong>
                  </p>
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
              <Plus className="w-4 h-4" />
              Criar Atividade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
