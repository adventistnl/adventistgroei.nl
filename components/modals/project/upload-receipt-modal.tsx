"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Upload,
  FileText,
  CalendarIcon,
  DollarSign,
  CheckCircle,
  X,
  Image,
  File
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ActivityData } from "@/components/projects/project-subsidies-table"

export interface ReceiptFormData {
  amount: number
  description: string
  receipt_date: Date
  file_path: string
  approved: boolean
}

interface UploadReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReceiptFormData) => void
  activity?: ActivityData
}

export function UploadReceiptModal({ isOpen, onClose, onSubmit, activity }: UploadReceiptModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<ReceiptFormData>({
    amount: 0,
    description: "",
    receipt_date: new Date(),
    file_path: "",
    approved: false,
  })

  const [errors, setErrors] = useState<Partial<ReceiptFormData>>({})
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const validateForm = (): boolean => {
    const newErrors: Partial<ReceiptFormData> = {}

    if (formData.amount <= 0) {
      newErrors.amount = "Receipt amount must be greater than 0"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Receipt description is required"
    }

    if (!selectedFile && !formData.file_path) {
      newErrors.file_path = "Receipt file is required"
    }

    // Validate amount doesn't exceed remaining activity budget
    if (activity && formData.amount > (activity.budget_amount - activity.approvedAmount)) {
      newErrors.amount = `Amount cannot exceed remaining budget: R$ ${(activity.budget_amount - activity.approvedAmount).toLocaleString()}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        file_path: selectedFile ? `/receipts/${selectedFile.name}` : formData.file_path
      }
      
      onSubmit(submissionData)
      
      // Reset form
      setFormData({
        amount: 0,
        description: "",
        receipt_date: new Date(),
        file_path: "",
        approved: false,
      })
      setSelectedFile(null)
      setErrors({})
    }
  }

  const handleClose = () => {
    setFormData({
      amount: 0,
      description: "",
      receipt_date: new Date(),
      file_path: "",
      approved: false,
    })
    setSelectedFile(null)
    setErrors({})
    onClose()
  }

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
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        setFormData({ ...formData, file_path: file.name })
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        setFormData({ ...formData, file_path: file.name })
      }
    }
  }

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, file_path: "Formato não suportado. Use JPG, PNG ou PDF." })
      return false
    }
    
    if (file.size > maxSize) {
      setErrors({ ...errors, file_path: "Arquivo muito grande. Máximo 5MB." })
      return false
    }
    
    return true
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFormData({ ...formData, file_path: "" })
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension === 'pdf') {
      return <File className="w-8 h-8 text-red-500" />
    }
    return <Image className="w-8 h-8 text-blue-500" />
  }

  if (!activity) {
    return null
  }

  const remainingBudget = activity.budget_amount - activity.approvedAmount

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t.activity.uploadReceipt}
          </DialogTitle>
          <DialogDescription>
            Enviar recibo para a atividade: {activity.name}
          </DialogDescription>
        </DialogHeader>

        {/* Activity Context */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Orçamento da atividade:</span>
                <p className="font-medium">R$ {activity.budget_amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor aprovado:</span>
                <p className="font-medium text-green-600">R$ {activity.approvedAmount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor restante:</span>
                <p className="font-medium text-blue-600">R$ {remainingBudget.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Recibos enviados:</span>
                <p className="font-medium">{activity.receiptsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>{t.activity.receiptFile} <span className="text-red-500">*</span></Label>
            
            {!selectedFile ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                  errors.file_path && "border-red-500"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t.activity.dragDropText}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.activity.supportedFormats}
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(selectedFile.name)}
                      <div>
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {errors.file_path && (
              <p className="text-sm text-red-500">{errors.file_path}</p>
            )}
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                {t.activity.receiptAmount} (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
              {formData.amount > remainingBudget && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Valor excede o orçamento restante da atividade
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.activity.receiptDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.receipt_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.receipt_date ? (
                      format(formData.receipt_date, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.receipt_date}
                    onSelect={(date) => date && setFormData({ ...formData, receipt_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t.activity.receiptDescription} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva o que foi comprado ou pago com este recibo"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn("min-h-[80px]", errors.description ? "border-red-500" : "")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Approval Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Pré-aprovar Recibo</Label>
              <p className="text-sm text-muted-foreground">
                Marcar este recibo como aprovado automaticamente
              </p>
            </div>
            <Switch
              checked={formData.approved}
              onCheckedChange={(checked) => setFormData({ ...formData, approved: checked })}
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Resumo do Recibo</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Valor:</span>
                <span className="ml-1 font-medium">R$ {formData.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge 
                  variant="outline" 
                  className={formData.approved ? 
                    "ml-1 text-green-600 border-green-200" : 
                    "ml-1 text-yellow-600 border-yellow-200"
                  }
                >
                  {formData.approved ? "Aprovado" : "Pendente"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Upload className="w-4 h-4" />
              Enviar Recibo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
