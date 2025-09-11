"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  DollarSign,
  Building,
  User,
  FileText
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
  mockSubsidyStatuses,
  mockDepartments
} from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"
import { SubsidyRequestData } from "@/components/projects/project-subsidies-table"

export interface SubsidyFormData {
  description: string
  total_budget: number
  church_id: string
  requester_id: string
  subsidy_statuses_id: string
}

interface AddSubsidyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SubsidyFormData) => void
  project: ProjectTableData
}

export function AddSubsidyModal({ isOpen, onClose, onSubmit, project }: AddSubsidyModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<SubsidyFormData>({
    description: "",
    total_budget: 0,
    church_id: "",
    requester_id: "",
    subsidy_statuses_id: "1", // Default to "Pending Review"
  })

  const [errors, setErrors] = useState<Partial<SubsidyFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<SubsidyFormData> = {}

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
      // Reset form
      setFormData({
        description: "",
        total_budget: 0,
        church_id: "",
        requester_id: "",
        subsidy_statuses_id: "1",
      })
      setErrors({})
    }
  }

  const handleClose = () => {
    setFormData({
      description: "",
      total_budget: 0,
      church_id: "",
      requester_id: "",
      subsidy_statuses_id: "1",
    })
    setErrors({})
    onClose()
  }

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department?.name || "Departamento não encontrado"
  }

  const getStatusName = (statusId: string) => {
    const status = mockSubsidyStatuses.find(s => s.id === statusId)
    return status?.name || "Status não encontrado"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t.subsidy.addSubsidy}
          </DialogTitle>
          <DialogDescription>
            Criar um novo pedido de subsídio para o projeto: {project.title}
          </DialogDescription>
        </DialogHeader>

        {/* Project Context */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Projeto:</span>
            <span className="text-sm">{project.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Departamento:</span>
            <span className="text-sm">{getDepartmentName(project.department_id)}</span>
          </div>
        </div>

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
              {formData.total_budget > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Percentual do orçamento do projeto: <strong>{((formData.total_budget / project.budget) * 100).toFixed(1)}%</strong>
                  </p>
                </div>
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
            <p className="text-xs text-muted-foreground">
              Status inicial: {getStatusName(formData.subsidy_statuses_id)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Pedido de Subsídio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
