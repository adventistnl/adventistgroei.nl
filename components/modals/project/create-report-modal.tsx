"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { 
  FileText,
  CalendarIcon,
  DollarSign,
  TrendingUp,
  Building,
  Upload,
  X,
  File,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
  FileSpreadsheet,
  AlertCircle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { 
  mockDepartments,
  mockSubsidyRequests,
  mockSubsidyActivities,
  mockSubsidyReceipts
} from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"
import toast from "react-hot-toast"

export interface ReportFormData {
  title: string
  description: string
  report_type: "financial" | "progress" | "annual"
  report_status: "approved" | "in_review" | "on_hold" | "needs_adjustment" | "rejected"
  submission_date: Date
  start_date: Date
  end_date: Date
  report_note: string
  reviewer_notes: string
  attached_file_path: string | null
  // Financial data
  project_budget_total: number
  project_budget_spent: number
  project_budget_remaining: number
  total_subsidies_requested: number
  total_subsidies_approved: number
  // Progress data
  completion_percentage: number
}

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReportFormData) => void
  project: ProjectTableData
}

export function CreateReportModal({ isOpen, onClose, onSubmit, project }: CreateReportModalProps) {
  const { i18n } = useTranslation()
  const router = useRouter()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<Partial<ReportFormData>>({})

  // Calculate project metrics for the report
  const projectMetrics = useMemo(() => {
    const subsidyRequests = mockSubsidyRequests.filter(req => req.project_id === project.id)
    const activities = subsidyRequests.flatMap(req => 
      mockSubsidyActivities.filter(act => act.subsidy_request_id === req.id)
    )
    const receipts = activities.flatMap(act =>
      mockSubsidyReceipts.filter(rec => rec.subsidy_activities_id === act.id)
    )
    
    const totalSubsidiesRequested = subsidyRequests.reduce((sum, req) => sum + req.total_budget, 0)
    const totalSubsidiesApproved = receipts.filter(rec => rec.approved).reduce((sum, rec) => sum + rec.amount, 0)
    const projectBudgetSpent = totalSubsidiesApproved
    const projectBudgetRemaining = project.budget - projectBudgetSpent
    
    // Calculate project progress
    const startDate = new Date(project.start_at)
    const endDate = new Date(project.end_at)
    const now = new Date()
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const completionPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100))
    
    return {
      totalSubsidiesRequested,
      totalSubsidiesApproved,
      projectBudgetSpent,
      projectBudgetRemaining,
      completionPercentage,
      activitiesCount: activities.length,
      receiptsCount: receipts.length
    }
  }, [project])

  const [formData, setFormData] = useState<ReportFormData>({
    title: `Relatório ${project.title} - ${format(new Date(), "MMM yyyy", { locale: ptBR })}`,
    description: `Relatório detalhado do projeto ${project.title} incluindo dados financeiros e de progresso.`,
    report_type: "progress",
    report_status: "in_review",
    submission_date: new Date(),
    start_date: new Date(project.start_at),
    end_date: new Date(project.end_at),
    report_note: "",
    reviewer_notes: "",
    attached_file_path: null,
    // Auto-calculated financial data
    project_budget_total: project.budget,
    project_budget_spent: projectMetrics.projectBudgetSpent,
    project_budget_remaining: projectMetrics.projectBudgetRemaining,
    total_subsidies_requested: projectMetrics.totalSubsidiesRequested,
    total_subsidies_approved: projectMetrics.totalSubsidiesApproved,
    // Auto-calculated progress data
    completion_percentage: projectMetrics.completionPercentage,
  })

  const steps = [
    {
      id: 0,
      title: t.report.stepBasicInfo,
      description: "Informações básicas do relatório",
      icon: FileText
    },
    {
      id: 1,
      title: t.report.stepFinancialData,
      description: "Dados financeiros e orçamentários",
      icon: DollarSign
    },
    {
      id: 2,
      title: t.report.stepProgressData,
      description: "Progresso e dados de conclusão",
      icon: TrendingUp
    },
    {
      id: 3,
      title: t.report.stepReviewSubmit,
      description: "Revisão final e opções de exportação",
      icon: CheckCircle
    }
  ]

  const getDepartmentName = (departmentId: string) => {
    const department = mockDepartments.find(d => d.id === departmentId)
    return department?.name || "Departamento não encontrado"
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<ReportFormData> = {}

    switch (currentStep) {
      case 0: // Basic Info
        if (!formData.title.trim()) {
          newErrors.title = "Título é obrigatório"
        }
        if (!formData.description.trim()) {
          newErrors.description = "Descrição é obrigatória"
        }
        break
      
      case 1: // Financial Data
        if (formData.project_budget_total <= 0) {
          newErrors.project_budget_total = "Orçamento deve ser maior que zero" as any
        }
        break
      
      case 2: // Progress Data
        if (formData.completion_percentage < 0 || formData.completion_percentage > 100) {
          newErrors.completion_percentage = "Percentual deve estar entre 0 e 100" as any
        }
        if (formData.start_date >= formData.end_date) {
          newErrors.end_date = "Data final deve ser posterior à data inicial" as any
        }
        break
      
      case 3: // Review - no additional validation needed
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === steps.length - 1 && validateCurrentStep()) {
      const submissionData = {
        ...formData,
        attached_file_path: selectedFile ? `/reports/${selectedFile.name}` : null
      }
      
      onSubmit(submissionData)
      
      // Show success message and redirect
      toast.success(t.report.reportCreated, { duration: 3000 })
      
      // Show redirecting message
      setTimeout(() => {
        toast.loading(t.report.redirectingToReports, { duration: 2000 })
        setTimeout(() => {
          router.push("/reports")
        }, 2000)
      }, 1000)
      
      handleClose()
    } else {
      handleNext()
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    setSelectedFile(null)
    setErrors({})
    onClose()
  }

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    // TODO: Implement actual export functionality
    const formatNames = {
      pdf: "PDF",
      csv: "CSV", 
      excel: "Excel"
    }
    
    toast.success(`📄 Exportando relatório em ${formatNames[format]}...`, { duration: 3000 })
    console.log(`Exporting report in ${format} format:`, formData)
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
        setFormData({ ...formData, attached_file_path: file.name })
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        setFormData({ ...formData, attached_file_path: file.name })
      }
    }
  }

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato não suportado. Use PDF ou DOC/DOCX.")
      return false
    }
    
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Máximo 10MB.")
      return false
    }
    
    return true
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFormData({ ...formData, attached_file_path: null })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfoStep()
      case 1:
        return renderFinancialDataStep()
      case 2:
        return renderProgressDataStep()
      case 3:
        return renderReviewSubmitStep()
      default:
        return null
    }
  }

  const renderBasicInfoStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          {t.report.reportTitle} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t.report.enterTitle}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t.report.reportDescription} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder={t.report.describeReport}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={cn("min-h-[100px]", errors.description ? "border-red-500" : "")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.report.reportType}</Label>
          <Select
            value={formData.report_type}
            onValueChange={(value: "financial" | "progress" | "annual") => setFormData({ ...formData, report_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {t.report.financial}
                </div>
              </SelectItem>
              <SelectItem value="progress">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {t.report.progress}
                </div>
              </SelectItem>
              <SelectItem value="annual">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t.report.annual}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t.report.reportStatus}</Label>
          <Select
            value={formData.report_status}
            onValueChange={(value: any) => setFormData({ ...formData, report_status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_review">{t.report.inReview}</SelectItem>
              <SelectItem value="approved">{t.report.approved}</SelectItem>
              <SelectItem value="on_hold">{t.report.onHold}</SelectItem>
              <SelectItem value="needs_adjustment">{t.report.needsAdjustment}</SelectItem>
              <SelectItem value="rejected">{t.report.rejected}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderFinancialDataStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {t.report.financialSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Orçamento Total do Projeto</Label>
              <Input
                type="number"
                value={formData.project_budget_total}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setFormData({ ...formData, project_budget_total: value, project_budget_remaining: value - formData.project_budget_spent })
                }}
                className="font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Orçamento Gasto</Label>
              <Input
                type="number"
                value={formData.project_budget_spent}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setFormData({ ...formData, project_budget_spent: value, project_budget_remaining: formData.project_budget_total - value })
                }}
                className="font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Total de Subsídios Solicitados</Label>
              <Input
                type="number"
                value={formData.total_subsidies_requested}
                onChange={(e) => setFormData({ ...formData, total_subsidies_requested: parseFloat(e.target.value) || 0 })}
                className="font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Total de Subsídios Aprovados</Label>
              <Input
                type="number"
                value={formData.total_subsidies_approved}
                onChange={(e) => setFormData({ ...formData, total_subsidies_approved: parseFloat(e.target.value) || 0 })}
                className="font-medium"
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Orçamento Restante:</span>
              <span className="text-lg font-bold text-green-600">
                R$ {(formData.project_budget_total - formData.project_budget_spent).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProgressDataStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t.report.progressSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Percentual de Conclusão (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.completion_percentage}
                onChange={(e) => setFormData({ ...formData, completion_percentage: parseFloat(e.target.value) || 0 })}
                className="font-medium"
              />
              <Progress value={formData.completion_percentage} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início do Relatório</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? (
                        format(formData.start_date, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => date && setFormData({ ...formData, start_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Término do Relatório</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.end_date && "text-muted-foreground",
                        errors.end_date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.end_date ? (
                        format(formData.end_date, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.end_date}
                      onSelect={(date) => date && setFormData({ ...formData, end_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.end_date && (
                  <p className="text-sm text-red-500">{String(errors.end_date)}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações sobre o Progresso</Label>
              <Textarea
                placeholder="Descreva o progresso atual, conquistas e desafios..."
                value={formData.report_note}
                onChange={(e) => setFormData({ ...formData, report_note: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderReviewSubmitStep = () => (
    <div className="space-y-6">
      {/* Report Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t.report.reportPreview}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Título:</span>
              <p className="font-medium">{formData.title}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tipo:</span>
              <p className="font-medium">{formData.report_type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium">{formData.report_status}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Conclusão:</span>
              <p className="font-medium">{formData.completion_percentage.toFixed(1)}%</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-lg text-blue-600">R$ {formData.project_budget_total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Orçamento Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-lg text-green-600">R$ {formData.project_budget_spent.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Orçamento Gasto</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-lg text-purple-600">R$ {formData.total_subsidies_approved.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Subsídios Aprovados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t.report.exportOptions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t.report.exportDescription}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport("pdf")}
              className="gap-2 h-16 flex-col"
            >
              <File className="w-6 h-6 text-red-500" />
              <span className="text-xs">{t.report.downloadPDF}</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport("csv")}
              className="gap-2 h-16 flex-col"
            >
              <FileText className="w-6 h-6 text-blue-500" />
              <span className="text-xs">{t.report.downloadCSV}</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport("excel")}
              className="gap-2 h-16 flex-col"
            >
              <FileSpreadsheet className="w-6 h-6 text-green-500" />
              <span className="text-xs">{t.report.downloadExcel}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Validation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            {t.report.dataValidation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{t.report.allFieldsValid}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t.report.readyToSubmit}
          </p>
        </CardContent>
      </Card>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>{t.report.attachedFile}</Label>
        
        {!selectedFile ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
              dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('report-file-upload')?.click()}
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              {t.report.uploadFile}
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos suportados: PDF, DOC, DOCX (máx 10MB)
            </p>
            <input
              id="report-file-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-blue-500" />
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
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t.report.createReport}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isActive ? "border-primary bg-primary text-primary-foreground" :
                  isCompleted ? "border-green-500 bg-green-500 text-white" :
                  "border-muted-foreground text-muted-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-20 h-0.5 mx-2 transition-colors",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
            )
          })}
        </div>

        {/* Project Context */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-muted-foreground">{getDepartmentName(project.department_id)}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">R$ {project.budget.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Orçamento</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 0 ? handleClose : handlePrevious}
              className="gap-2"
            >
              {currentStep === 0 ? (
                "Cancelar"
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} de {steps.length}
              </span>
              <Button type="submit" className="gap-2">
                {currentStep === steps.length - 1 ? (
                  <>
                    <FileText className="w-4 h-4" />
                    Criar Relatório
                  </>
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}