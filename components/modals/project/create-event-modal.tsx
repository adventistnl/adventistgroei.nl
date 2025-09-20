"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  CalendarIcon, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Building,
  Globe,
  Church,
  User
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { mockDepartments } from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

export interface EventFormData {
  title: string
  description: string
  type: "evangelism" | "show"
  target_type: "institution" | "region" | "department" | "church" | "user"
  target_id: string
  max_participants: number
  ticket_amount: number
  location: string
  subscription_expires_at: Date
  language_preference: string
}

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EventFormData) => void
  project?: ProjectTableData
}

export function CreateEventModal({ isOpen, onClose, onSubmit, project }: CreateEventModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [formData, setFormData] = useState<EventFormData>({
    title: project ? `Evento: ${project.title}` : "",
    description: project ? `Evento relacionado ao projeto: ${project.description}` : "",
    type: "evangelism",
    target_type: "department",
    target_id: project?.department_id || "",
    max_participants: 100,
    ticket_amount: 0,
    location: "",
    subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    language_preference: project?.language_preference || "pt",
  })

  const [errors, setErrors] = useState<Partial<EventFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Event location is required"
    }

    if (formData.max_participants <= 0) {
      newErrors.max_participants = "Max participants must be greater than 0"
    }

    if (formData.ticket_amount < 0) {
      newErrors.ticket_amount = "Ticket amount cannot be negative"
    }

    if (!formData.target_id) {
      newErrors.target_id = "Target selection is required"
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
        description: "",
        type: "evangelism",
        target_type: "department",
        target_id: "",
        max_participants: 100,
        ticket_amount: 0,
        location: "",
        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        language_preference: "pt",
      })
      setErrors({})
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      type: "evangelism",
      target_type: "department",
      target_id: "",
      max_participants: 100,
      ticket_amount: 0,
      location: "",
      subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      language_preference: "pt",
    })
    setErrors({})
    onClose()
  }

  const getTargetOptions = () => {
    switch (formData.target_type) {
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

  const getTargetTypeIcon = (type: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t.event.createEvent}
          </DialogTitle>
          <DialogDescription>
            {project 
              ? `Criar evento para o projeto: ${project.title}`
              : "Preencha as informações abaixo para criar um novo evento."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {t.event.eventTitle} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t.event.enterEventTitle}
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
                {t.event.eventDescription} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t.event.describeEvent}
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
                <Label>{t.event.eventType}</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "evangelism" | "show") => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evangelism">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {t.event.evangelism}
                      </div>
                    </SelectItem>
                    <SelectItem value="show">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {t.event.show}
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

          {/* Target Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Público-Alvo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.event.targetType}</Label>
                <Select
                  value={formData.target_type}
                  onValueChange={(value: any) => setFormData({ ...formData, target_type: value, target_id: "" })}
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
              </div>

              <div className="space-y-2">
                <Label>
                  {t.event.selectTarget} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.target_id}
                  onValueChange={(value) => setFormData({ ...formData, target_id: value })}
                >
                  <SelectTrigger className={errors.target_id ? "border-red-500" : ""}>
                    <SelectValue placeholder={t.event.selectTarget} />
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
                {errors.target_id && (
                  <p className="text-sm text-red-500">{errors.target_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalhes do Evento</h3>
            
            <div className="space-y-2">
              <Label htmlFor="location">
                {t.event.location} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder={t.event.enterLocation}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">
                  {t.event.maxParticipants} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                  className={errors.max_participants ? "border-red-500" : ""}
                />
                {errors.max_participants && (
                  <p className="text-sm text-red-500">{errors.max_participants}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket_amount">
                  {t.event.ticketAmount} (R$)
                </Label>
                <Input
                  id="ticket_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.ticket_amount}
                  onChange={(e) => setFormData({ ...formData, ticket_amount: parseFloat(e.target.value) || 0 })}
                  className={errors.ticket_amount ? "border-red-500" : ""}
                />
                {errors.ticket_amount && (
                  <p className="text-sm text-red-500">{errors.ticket_amount}</p>
                )}
                <div className="flex gap-2">
                  <Badge variant={formData.ticket_amount === 0 ? "default" : "outline"}>
                    {t.event.free}
                  </Badge>
                  <Badge variant={formData.ticket_amount > 0 ? "default" : "outline"}>
                    {t.event.paid}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.event.subscriptionExpires}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.subscription_expires_at && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.subscription_expires_at ? (
                      format(formData.subscription_expires_at, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.subscription_expires_at}
                    onSelect={(date) => date && setFormData({ ...formData, subscription_expires_at: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
