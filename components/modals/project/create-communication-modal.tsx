"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  CalendarIcon, 
  Megaphone,
  Building,
  Globe,
  Church,
  User,
  Plus,
  X,
  Target,
  AlertTriangle,
  Info,
  Mail
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
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { mockDepartments } from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

interface CommunicationRecipient {
  target_type: "institution" | "region" | "department" | "church" | "user"
  target_id: string
  target_name: string
}

export interface CommunicationFormData {
  title: string
  content: string
  type: "announcement" | "notification" | "newsletter"
  priority: "high" | "medium" | "low"
  language_preference: string
  schedule_at: Date | null
  schedule_now: boolean
  recipients: CommunicationRecipient[]
}

interface CreateCommunicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CommunicationFormData) => void
  project?: ProjectTableData
}

export function CreateCommunicationModal({ isOpen, onClose, onSubmit, project }: CreateCommunicationModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<CommunicationFormData>({
    title: project ? `Comunicado: ${project.title}` : "",
    content: project ? `Comunicado relacionado ao projeto: ${project.title}\n\n${project.description}` : "",
    type: "announcement",
    priority: "medium",
    language_preference: project?.language_preference || "pt",
    schedule_at: null,
    schedule_now: true,
    recipients: project ? [{
      target_type: "department",
      target_id: project.department_id,
      target_name: mockDepartments.find(d => d.id === project.department_id)?.name || "Departamento"
    }] : [],
  })

  const [errors, setErrors] = useState<Partial<CommunicationFormData>>({})
  const [newRecipient, setNewRecipient] = useState({
    target_type: "department" as const,
    target_id: "",
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<CommunicationFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Communication title is required"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Communication content is required"
    }

    if (formData.recipients.length === 0) {
      newErrors.recipients = "At least one recipient is required"
    }

    if (!formData.schedule_now && !formData.schedule_at) {
      newErrors.schedule_at = "Schedule date is required when not sending now"
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
        title: "",
        content: "",
        type: "announcement",
        priority: "medium",
        language_preference: "pt",
        schedule_at: null,
        schedule_now: true,
        recipients: [],
      })
      setErrors({})
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      type: "announcement",
      priority: "medium",
      language_preference: "pt",
      schedule_at: null,
      schedule_now: true,
      recipients: [],
    })
    setErrors({})
    onClose()
  }

  const getTargetOptions = () => {
    switch (newRecipient.target_type) {
      case "department":
        return mockDepartments.map(dept => ({
          value: dept.id,
          label: dept.name,
          icon: Building
        }))
      case "institution":
        return [
          { value: "usp", label: "União Sul-Paulista", icon: Building },
          { value: "ucb", label: "União Central Brasileira", icon: Building }
        ]
      case "region":
        return [
          { value: "sp", label: "São Paulo", icon: Globe },
          { value: "rj", label: "Rio de Janeiro", icon: Globe }
        ]
      case "church":
        return [
          { value: "church1", label: "Igreja Central São Paulo", icon: Church },
          { value: "church2", label: "Igreja Vila Mariana", icon: Church }
        ]
      case "user":
        return [
          { value: "user1", label: "João Silva", icon: User },
          { value: "user2", label: "Maria Santos", icon: User }
        ]
      default:
        return []
    }
  }

  const addRecipient = () => {
    if (newRecipient.target_id) {
      const targetOptions = getTargetOptions()
      const selectedTarget = targetOptions.find(opt => opt.value === newRecipient.target_id)
      
      if (selectedTarget && !formData.recipients.some(r => r.target_id === newRecipient.target_id && r.target_type === newRecipient.target_type)) {
        setFormData({
          ...formData,
          recipients: [...formData.recipients, {
            target_type: newRecipient.target_type,
            target_id: newRecipient.target_id,
            target_name: selectedTarget.label
          }]
        })
        setNewRecipient({ target_type: "department", target_id: "" })
      }
    }
  }

  const removeRecipient = (index: number) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter((_, i) => i !== index)
    })
  }

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case "institution":
        return Building
      case "region":
        return Globe
      case "department":
        return Building
      case "church":
        return Church
      case "user":
        return User
      default:
        return Building
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 border-red-200 bg-red-50"
      case "medium":
        return "text-yellow-600 border-yellow-200 bg-yellow-50"
      case "low":
        return "text-green-600 border-green-200 bg-green-50"
      default:
        return "text-gray-600 border-gray-200 bg-gray-50"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return AlertTriangle
      case "medium":
        return Info
      case "low":
        return Info
      default:
        return Info
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            {t.communication.createCommunication}
          </DialogTitle>
          <DialogDescription>
            {project 
              ? `Criar comunicação para o projeto: ${project.title}`
              : "Preencha as informações abaixo para criar uma nova comunicação."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {t.communication.communicationTitle} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t.communication.enterTitle}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                {t.communication.communicationContent} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder={t.communication.enterContent}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className={cn("min-h-[120px]", errors.content ? "border-red-500" : "")}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t.communication.communicationType}</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "announcement" | "notification" | "newsletter") => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4" />
                        {t.communication.announcement}
                      </div>
                    </SelectItem>
                    <SelectItem value="notification">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {t.communication.notification}
                      </div>
                    </SelectItem>
                    <SelectItem value="newsletter">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t.communication.newsletter}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.communication.priority}</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        {t.communication.high}
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-yellow-500" />
                        {t.communication.medium}
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-green-500" />
                        {t.communication.low}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="w-5 h-5" />
                {t.communication.recipients}
              </h3>
              <Badge variant="outline" className={getPriorityColor(formData.priority)}>
                {formData.priority.toUpperCase()}
              </Badge>
            </div>
            
            {/* Add Recipient */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t.communication.addRecipient}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select
                    value={newRecipient.target_type}
                    onValueChange={(value: any) => setNewRecipient({ ...newRecipient, target_type: value, target_id: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="institution">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {t.event.institution}
                        </div>
                      </SelectItem>
                      <SelectItem value="region">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {t.event.region}
                        </div>
                      </SelectItem>
                      <SelectItem value="department">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {t.event.department}
                        </div>
                      </SelectItem>
                      <SelectItem value="church">
                        <div className="flex items-center gap-2">
                          <Church className="w-4 h-4" />
                          {t.event.church}
                        </div>
                      </SelectItem>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t.event.user}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={newRecipient.target_id}
                    onValueChange={(value) => setNewRecipient({ ...newRecipient, target_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar destinatário" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTargetOptions().map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  <Button 
                    type="button" 
                    onClick={addRecipient}
                    disabled={!newRecipient.target_id}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recipients List */}
            {formData.recipients.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Destinatários Selecionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.recipients.map((recipient, index) => {
                      const Icon = getRecipientIcon(recipient.target_type)
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">{recipient.target_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {recipient.target_type}
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipient(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {errors.recipients && (
              <p className="text-sm text-red-500">{errors.recipients}</p>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Agendamento</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t.communication.scheduleNow}</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar comunicação imediatamente
                </p>
              </div>
              <Switch
                checked={formData.schedule_now}
                onCheckedChange={(checked) => setFormData({ ...formData, schedule_now: checked })}
              />
            </div>

            {!formData.schedule_now && (
              <div className="space-y-2">
                <Label>{t.communication.scheduleAt}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.schedule_at && "text-muted-foreground",
                        errors.schedule_at && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.schedule_at ? (
                        format(formData.schedule_at, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.schedule_at || undefined}
                      onSelect={(date) => setFormData({ ...formData, schedule_at: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.schedule_at && (
                  <p className="text-sm text-red-500">{errors.schedule_at}</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {formData.schedule_now ? "Enviar Agora" : "Agendar Comunicação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
