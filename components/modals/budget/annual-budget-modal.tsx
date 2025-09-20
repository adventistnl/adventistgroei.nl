"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DollarSign, Calendar, FileText, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import toast from "react-hot-toast"
import { budgetTranslations } from "@/lib/translations/budget"

// Schema de validação
const annualBudgetSchema = z.object({
  year: z.number().min(2020).max(2030),
  planned_budget: z.number().min(0),
  total_expenses: z.number().min(0),
  notes: z.string().optional(),
  status: z.enum(["planned", "approved", "in_progress", "closed"])
})

type AnnualBudgetFormData = z.infer<typeof annualBudgetSchema>

export interface AnnualBudgetData {
  id: string
  year: number
  planned_budget: number
  total_expenses: number
  balance: number
  notes?: string
  approved_by?: string
  status: "planned" | "approved" | "in_progress" | "closed"
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string
  deleted_by?: string
}

interface AnnualBudgetModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  budget?: AnnualBudgetData | null
  entityType: "institution" | "region" | "church" | "department"
  entityName: string
  entityId: string
  onSave: (budget: AnnualBudgetData) => void
}

/**
 * Modal reutilizável para gestão de orçamentos anuais
 * Funciona para institutions, regions, churches e departments
 */
export function AnnualBudgetModal({
  isOpen,
  onOpenChange,
  budget,
  entityType,
  entityName,
  entityId,
  onSave
}: AnnualBudgetModalProps) {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const isEdit = !!budget
  const currentYear = new Date().getFullYear()
  const totalSteps = 3
  
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = budgetTranslations[currentLanguage as keyof typeof budgetTranslations] || budgetTranslations.en
  
  // Traduções específicas por tipo de entidade
  const getEntityTranslations = () => {
    const translations = {
      institution: {
        title: t.modals.annual.title_institution,
        description: t.modals.annual.description_institution,
        subtitle: t.modals.annual.subtitle_institution
      },
      region: {
        title: t.modals.annual.title_region,
        description: t.modals.annual.description_region,
        subtitle: t.modals.annual.subtitle_region
      },
      church: {
        title: t.modals.annual.title_church,
        description: t.modals.annual.description_church,
        subtitle: t.modals.annual.subtitle_church
      },
      department: {
        title: t.modals.annual.title_department,
        description: t.modals.annual.description_department,
        subtitle: t.modals.annual.subtitle_department
      }
    }
    return translations[entityType]
  }
  
  const entityTranslations = getEntityTranslations()
  
  const form = useForm<AnnualBudgetFormData>({
    resolver: zodResolver(annualBudgetSchema),
    defaultValues: {
      year: budget?.year || currentYear,
      planned_budget: budget?.planned_budget || 0,
      total_expenses: budget?.total_expenses || 0,
      notes: budget?.notes || "",
      status: budget?.status || "planned"
    }
  })
  
  // Calcular saldo automaticamente
  const watchedValues = form.watch()
  const balance = watchedValues.planned_budget - watchedValues.total_expenses
  
  const onSubmit = async (data: AnnualBudgetFormData) => {
    setIsLoading(true)
    
    try {
      const budgetData: AnnualBudgetData = {
        id: budget?.id || `budget_${Date.now()}`,
        year: data.year,
        planned_budget: data.planned_budget,
        total_expenses: data.total_expenses,
        balance: balance,
        notes: data.notes,
        approved_by: budget?.approved_by,
        status: data.status,
        created_at: budget?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: budget?.created_by || 'current_user',
        updated_by: 'current_user',
        is_deleted: false,
        deleted_at: budget?.deleted_at,
        deleted_by: budget?.deleted_by
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular API
      
      onSave(budgetData)
      toast.success(isEdit ? t.toasts.updated : t.toasts.created)
      onOpenChange(false)
      form.reset()
      setCurrentStep(1)
      
    } catch (error) {
      toast.error(isEdit ? t.toasts.update_failed : t.toasts.create_failed)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleClose = () => {
    form.reset()
    setCurrentStep(1)
    onOpenChange(false)
  }
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { variant: "secondary" as const, icon: Calendar, color: "text-muted-foreground" },
      approved: { variant: "default" as const, icon: CheckCircle, color: "text-muted-foreground" },
      in_progress: { variant: "outline" as const, icon: AlertCircle, color: "text-muted-foreground" },
      closed: { variant: "secondary" as const, icon: FileText, color: "text-muted-foreground" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {t.status[status as keyof typeof t.status]}
      </Badge>
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            {isEdit ? t.modals.annual.edit_title : t.modals.annual.create_title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {entityTranslations.description}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t.modals.annual.step} {currentStep} {t.modals.annual.of} {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>
        
        {/* Informações da Entidade - Sempre visível */}
        <Card className="bg-muted/20 border-0 flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{entityName}</p>
                <p className="text-xs text-muted-foreground">
                  {t.entity_types[entityType]} • ID: {entityId}
                </p>
              </div>
              {budget && (
                <div className="flex-shrink-0 text-right">
                  {getStatusBadge(budget.status)}
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.modals.annual.last_updated}: {new Date(budget.updated_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Conteúdo dos Steps - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              
              {/* Step 1: Informações Básicas */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-foreground">{t.modals.annual.step_1_title}</h3>
                    <p className="text-sm text-muted-foreground">{t.modals.annual.step_1_description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {t.fields.year}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder={currentYear.toString()}
                              className="h-10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">{t.fields.status}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder={t.fields.status_placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="planned">{t.status.planned}</SelectItem>
                              <SelectItem value="approved">{t.status.approved}</SelectItem>
                              <SelectItem value="in_progress">{t.status.in_progress}</SelectItem>
                              <SelectItem value="closed">{t.status.closed}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {/* Step 2: Valores Financeiros */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-foreground">{t.modals.annual.step_2_title}</h3>
                    <p className="text-sm text-muted-foreground">{t.modals.annual.step_2_description}</p>
                  </div>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <FormField
                      control={form.control}
                      name="planned_budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            {t.fields.planned_budget}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="h-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {t.fields.planned_budget_description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="total_expenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            {t.fields.total_expenses}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="h-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {t.fields.total_expenses_description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Saldo Calculado */}
                    <Card className="bg-muted/20 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{t.fields.balance}</span>
                          </div>
                          <span className={`text-lg font-bold ${balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {balance >= 0 ? t.modals.annual.balance_positive : t.modals.annual.balance_negative}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Step 3: Observações */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-foreground">{t.modals.annual.step_3_title}</h3>
                    <p className="text-sm text-muted-foreground">{t.modals.annual.step_3_description}</p>
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {t.fields.notes}
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t.fields.notes_placeholder}
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {t.fields.notes_description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
        
        {/* Botões de Navegação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                {t.buttons.cancel}
              </Button>
              
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t.buttons.previous}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  {t.buttons.next}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[100px] text-xs"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                      {isEdit ? t.buttons.updating : t.buttons.creating}
                    </>
                  ) : (
                    isEdit ? t.buttons.update : t.buttons.create
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
