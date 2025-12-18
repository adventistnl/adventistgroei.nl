"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarIcon,
  Globe,
  Building,
  DollarSign,
  Settings,
  CheckCircle,
  Save
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMutation, useQuery } from "@apollo/client"
import toast from "react-hot-toast"

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
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ProjectTableData } from "@/components/projects/projects-table"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { useInstitution } from "@/contexts/institution-context"

export interface EditProjectFormData {
  title: string
  description: string
  department_id: string
  budget: number
  start_at: Date
  end_at: Date
  language_preference: string
  is_private: boolean
  required_volunteers: boolean
  is_event: boolean
  type: "Local" | "Global"
}

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  project?: ProjectTableData
}

export function EditProjectModal({ isOpen, onClose, onSuccess, project }: EditProjectModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const { currentInstitutionData } = useInstitution()

  const institutionId = currentInstitutionData?.id

  // Fetch departments
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  const departments = departmentsData?.departments || []

  // Update project mutation
  const [updateProject, { loading: updateLoading }] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success("Projeto atualizado com sucesso!", { duration: 3000 })
      handleClose()
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar projeto: ${error.message}`)
      console.error("Error updating project:", error)
    }
  })

  const [formData, setFormData] = useState<EditProjectFormData>({
    title: "",
    description: "",
    department_id: "",
    budget: 0,
    start_at: new Date(),
    end_at: new Date(),
    language_preference: "pt",
    is_private: false,
    required_volunteers: false,
    is_event: false,
    type: "Local",
  })

  const [errors, setErrors] = useState<Partial<EditProjectFormData>>({})

  // Load project data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        department_id: project.department_id,
        budget: project.budget,
        start_at: new Date(project.start_at),
        end_at: new Date(project.end_at),
        language_preference: project.language_preference,
        is_private: project.is_private,
        required_volunteers: project.required_volunteers,
        is_event: (project as any).is_event || false,
        type: (project as any).type || "Local",
      })
    }
  }, [project])

  const getDepartmentName = (id: string) => {
    const dept = departments.find((d: any) => d.id === id)
    return dept?.name || "Departamento não encontrado"
  }

  const getDepartmentBudget = (id: string) => {
    const dept = departments.find((d: any) => d.id === id)
    // TODO: Fetch annual budget for department
    return 0
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EditProjectFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.department_id) {
      newErrors.department_id = "Department is required"
    }

    if (formData.budget <= 0) {
      newErrors.budget = "Budget must be greater than 0" as any
    }

    if (formData.start_at >= formData.end_at) {
      newErrors.end_at = "End date must be after start date" as any
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !project) {
      return
    }

    try {
      await updateProject({
        variables: {
          id: project.id,
          title: formData.title,
          description: formData.description,
          department_id: formData.department_id,
          budget: formData.budget,
          type: formData.type,
          start_at: formData.start_at.toISOString(),
          end_at: formData.end_at.toISOString(),
          language_preference: formData.language_preference,
          is_private: formData.is_private,
          required_volunteers: formData.required_volunteers,
        }
      })
      setErrors({})
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  if (!project) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t.modal.editProject}
          </DialogTitle>
          <DialogDescription>
            Editar informações do projeto: {project.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t.modal.projectInformation}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">
                {t.projectTitle} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t.enterProjectTitle}
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
                {t.projectDescription} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t.describeProject}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn("min-h-[100px]", errors.description ? "border-red-500" : "")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                {t.department} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => setFormData({ ...formData, department_id: value })}
              >
                <SelectTrigger className={errors.department_id ? "border-red-500" : ""}>
                  <SelectValue placeholder={t.selectDepartment} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{dept.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department_id && (
                <p className="text-sm text-red-500">{errors.department_id}</p>
              )}
              {formData.department_id && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Orçamento anual do departamento: <strong>R$ {getDepartmentBudget(formData.department_id).toLocaleString()}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Budget Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t.modal.budgetInformation}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="budget">
                Orçamento (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.budget || ""}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                className={errors.budget ? "border-red-500" : ""}
              />
              {errors.budget && (
                <p className="text-sm text-red-500">{errors.budget}</p>
              )}
              {formData.department_id && formData.budget > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Percentual do orçamento departamental: <strong>{((formData.budget / getDepartmentBudget(formData.department_id)) * 100).toFixed(1)}%</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.startDate} <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_at && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_at ? (
                        format(formData.start_at, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_at}
                      onSelect={(date) => date && setFormData({ ...formData, start_at: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t.endDate} <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.end_at && "text-muted-foreground",
                        errors.end_at && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.end_at ? (
                        format(formData.end_at, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.end_at}
                      onSelect={(date) => date && setFormData({ ...formData, end_at: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.end_at && (
                  <p className="text-sm text-red-500">{String(errors.end_at)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t.modal.additionalSettings}
            </h3>
            
            <div className="space-y-2">
              <Label>{t.languagePreference}</Label>
              <Select
                value={formData.language_preference}
                onValueChange={(value) => setFormData({ ...formData, language_preference: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Projeto</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Local" | "Global") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.privateProject}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.privateProjectDesc}
                  </p>
                </div>
                <Switch
                  checked={formData.is_private}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.requestVolunteers}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.requestVolunteersDesc}
                  </p>
                </div>
                <Switch
                  checked={formData.required_volunteers}
                  onCheckedChange={(checked) => setFormData({ ...formData, required_volunteers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Projeto é um Evento</Label>
                  <p className="text-sm text-muted-foreground">
                    Marque se este projeto incluirá eventos públicos
                  </p>
                </div>
                <Switch
                  checked={formData.is_event}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_event: checked })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={updateLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2" disabled={updateLoading}>
              <Save className="w-4 h-4" />
              {updateLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
