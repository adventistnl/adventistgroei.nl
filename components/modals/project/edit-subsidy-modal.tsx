"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { 
  DollarSign,
  Building,
  User,
  Edit
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { 
  mockChurches, 
  mockUsers, 
  mockSubsidyStatuses
} from "@/data/mockData"
import { SubsidyRequestData } from "@/components/projects/project-subsidies-table"

export interface EditSubsidyFormData {
  description: string
  total_budget: number
  church_id: string
  requester_id: string
  subsidy_statuses_id: string
}

interface EditSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EditSubsidyFormData) => void
  subsidy?: SubsidyRequestData
}

export function EditSubsidyModal({ isOpen, onClose, onSubmit, subsidy }: EditSubsidyModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<EditSubsidyFormData>({
    description: "",
    total_budget: 0,
    church_id: "",
    requester_id: "",
    subsidy_statuses_id: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof EditSubsidyFormData, string>>>({})

  // Load subsidy data when subsidy changes
  useEffect(() => {
    if (subsidy) {
      setFormData({
        description: subsidy.description,
        total_budget: subsidy.total_budget,
        church_id: subsidy.church_id,
        requester_id: subsidy.requester_id,
        subsidy_statuses_id: subsidy.subsidy_statuses_id,
      })
    }
  }, [subsidy])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EditSubsidyFormData, string>> = {}

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.total_budget <= 0) {
      newErrors.total_budget = "Budget must be greater than 0"
    }

    if (!formData.church_id) {
      newErrors.church_id = "Church selection is required"
    }

    if (!formData.requester_id) {
      newErrors.requester_id = "Requester selection is required"
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

  const getStatusName = (statusId: string) => {
    const status = mockSubsidyStatuses.find(s => s.id === statusId)
    return status?.name || "Status não encontrado"
  }

  if (!subsidy) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit className="w-5 h-5" />
            {t.subsidy.editSubsidy}
          </DialogTitle>
          <DialogDescription>
            Editar pedido de subsídio: {subsidy.description.substring(0, 50)}...
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                {t.subsidy.subsidyDescription} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t.subsidy.enterDescription}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn("min-h-[100px]", errors.description ? "border-red-500" : "")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_budget">
                {t.subsidy.totalBudget} (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="total_budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.total_budget || ""}
                onChange={(e) => setFormData({ ...formData, total_budget: parseFloat(e.target.value) || 0 })}
                className={errors.total_budget ? "border-red-500" : ""}
              />
              {errors.total_budget && (
                <p className="text-sm text-red-500">{errors.total_budget}</p>
              )}
            </div>
          </div>

          {/* Requester and Church */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                {t.subsidy.requester} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.requester_id}
                onValueChange={(value) => setFormData({ ...formData, requester_id: value })}
              >
                <SelectTrigger className={errors.requester_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecionar solicitante" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.requester_id && (
                <p className="text-sm text-red-500">{errors.requester_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                {t.subsidy.church} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.church_id}
                onValueChange={(value) => setFormData({ ...formData, church_id: value })}
              >
                <SelectTrigger className={errors.church_id ? "border-red-500" : ""}>
                  <SelectValue placeholder={t.subsidy.selectChurch} />
                </SelectTrigger>
                <SelectContent>
                  {mockChurches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{church.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {church.region}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.church_id && (
                <p className="text-sm text-red-500">{errors.church_id}</p>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label>{t.subsidy.subsidyStatus}</Label>
            <Select
              value={formData.subsidy_statuses_id}
              onValueChange={(value) => setFormData({ ...formData, subsidy_statuses_id: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockSubsidyStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span>{status.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          {subsidy && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Resumo Atual</h4>
              {subsidy.is_for_advance ? (
                 <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="ml-1 font-medium text-purple-600">Adiantamento</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor Solicitado:</span>
                    <span className="ml-1 font-medium">R$ {(subsidy.advance_amount || subsidy.total_budget || 0).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Atividades:</span>
                    <span className="ml-1 font-medium">{subsidy.activities?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxa de conclusão:</span>
                    <span className="ml-1 font-medium">{subsidy.completion_rate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor aprovado:</span>
                    <span className="ml-1 font-medium text-green-600">R$ {subsidy.approved_amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor pendente:</span>
                    <span className="ml-1 font-medium text-yellow-600">R$ {subsidy.pending_amount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
