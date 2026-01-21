"use client"

import React, { useState } from "react"
import { X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ActivityTags } from "@/types/graphql-global-types"

export interface BatchEditData {
  status?: string
  priority?: string
  is_subsidized?: boolean
}

interface BatchEditActivitiesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BatchEditData) => void
  selectedCount: number
}

export function BatchEditActivitiesModal({
  isOpen,
  onClose,
  onSubmit,
  selectedCount
}: BatchEditActivitiesModalProps) {
  const [formData, setFormData] = useState<BatchEditData>({})
  const [fieldsToUpdate, setFieldsToUpdate] = useState<Set<string>>(new Set())

  if (!isOpen) return null

  const handleToggleField = (field: string) => {
    const newFields = new Set(fieldsToUpdate)
    if (newFields.has(field)) {
      newFields.delete(field)
      const newData = { ...formData }
      delete newData[field as keyof BatchEditData]
      setFormData(newData)
    } else {
      newFields.add(field)
    }
    setFieldsToUpdate(newFields)
  }

  const handleSubmit = () => {
    const dataToSubmit: Partial<BatchEditData> = {}
    fieldsToUpdate.forEach(field => {
      const key = field as keyof BatchEditData
      const value = formData[key]
      if (value !== undefined) {
        (dataToSubmit as any)[key] = value
      }
    })
    onSubmit(dataToSubmit as BatchEditData)
    onClose()
    setFormData({})
    setFieldsToUpdate(new Set())
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      todo: "A Fazer",
      in_progress: "Em Andamento",
      completed: "Concluído",
      on_hold: "Em Espera"
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
      [ActivityTags.Reform]: "Reforma",
      [ActivityTags.Equipment]: "Equipamento",
      [ActivityTags.Materials]: "Material",
      [ActivityTags.Training]: "Treinamento",
      [ActivityTags.Travel]: "Viagem",
      [ActivityTags.Event]: "Evento",
      [ActivityTags.Transport]: "Transporte",
      [ActivityTags.Marketing]: "Marketing",
      [ActivityTags.Services]: "Serviços",
      [ActivityTags.Feeding]: "Alimentação",
      [ActivityTags.Accommodation]: "Acomodação"
    }
    return labels[tag] || tag
  }

  const getActivityTagOptions = () => {
    return Object.values(ActivityTags).map(tag => ({
      value: tag,
      label: getTagLabel(tag)
    }))
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      [ActivityTags.Reform]: 'border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/20',
      [ActivityTags.Equipment]: 'border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20',
      [ActivityTags.Materials]: 'border-cyan-300 text-cyan-700 dark:border-cyan-600 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/20',
      [ActivityTags.Training]: 'border-indigo-300 text-indigo-700 dark:border-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/20',
      [ActivityTags.Travel]: 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/20',
      [ActivityTags.Event]: 'border-pink-300 text-pink-700 dark:border-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/20',
      [ActivityTags.Transport]: 'border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20',
      [ActivityTags.Marketing]: 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/20',
      [ActivityTags.Services]: 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20',
      [ActivityTags.Feeding]: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/20',
      [ActivityTags.Accommodation]: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/20',
    }
    return colors[tag] || 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/20'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-200"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-lg shadow-xl animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edição em Lote
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCount} {selectedCount === 1 ? 'atividade selecionada' : 'atividades selecionadas'}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body - Inline Fields */}
        <div className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Status */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</Label>
              <Select 
                value={formData.status || ""}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, status: value }))
                  const newFields = new Set(fieldsToUpdate)
                  newFields.add('status')
                  setFieldsToUpdate(newFields)
                }}
              >
                <SelectTrigger className="w-[160px] h-8">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="on_hold">Em Espera</SelectItem>
                </SelectContent>
              </Select>
              {fieldsToUpdate.has('status') && formData.status && (
                <Badge
                  variant="outline"
                  className={
                    formData.status === 'todo' ? 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300' :
                    formData.status === 'in_progress' ? 'border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20' :
                    formData.status === 'completed' ? 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/20' :
                    'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20'
                  }
                >
                  {getStatusLabel(formData.status)}
                </Badge>
              )}
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade:</Label>
              <Select 
                value={formData.priority || ""}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, priority: value }))
                  const newFields = new Set(fieldsToUpdate)
                  newFields.add('priority')
                  setFieldsToUpdate(newFields)
                }}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
              {fieldsToUpdate.has('priority') && formData.priority && (
                <Badge
                  variant="outline"
                  className={
                    formData.priority === 'urgent' ? 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/20' :
                    formData.priority === 'high' ? 'border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20' :
                    formData.priority === 'medium' ? 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20' :
                    'border-green-300 text-green-700 dark:border-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/20'
                  }
                >
                  {getPriorityLabel(formData.priority)}
                </Badge>
              )}
            </div>

            {/* Category field removed - use multiple tags editing in individual activity edit */ }

            {/* Subsidized */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subsidiado:</Label>
              <Switch
                checked={formData.is_subsidized || false}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ ...prev, is_subsidized: checked }))
                  const newFields = new Set(fieldsToUpdate)
                  newFields.add('is_subsidized')
                  setFieldsToUpdate(newFields)
                }}
                className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-100"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formData.is_subsidized ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>

          {/* Selected Fields Summary */}
          {fieldsToUpdate.size > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Campos selecionados:</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from(fieldsToUpdate).map(field => (
                    <Badge key={field} variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs">
                      {field === 'status' && 'Status'}
                      {field === 'priority' && 'Prioridade'}
                      {field === 'activity_tag' && 'Categoria'}
                      {field === 'is_subsidized' && 'Subsidiado'}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-8 text-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={fieldsToUpdate.size === 0}
            className="h-8 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm"
          >
            Aplicar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}
