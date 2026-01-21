"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CalendarIcon, Users, Globe, Target, Clock, Plus, Check, Building, Languages, Euro, CreditCard, FileText, Home } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "@/components/shared/language-selector"

export interface EventFormData {
  title: string
  description: string
  contact_id: string
  type: string // Changed to allow custom types
  language_preference: "en" | "nl" | "pt" | "es" | "fr" | "de"
  max_participants?: number
  is_paid_event: boolean
  ticket_amount?: number
  payment_description?: string
  required_volunteers: boolean
  start_at?: Date
  end_at?: Date
  subscription_expires_at?: Date
  target_type: "institution" | "region" | "department" | "church" | "user"
  target_id?: string
}

interface EventRegistrationFormProps {
  data: EventFormData
  onChange: (data: EventFormData) => void
  errors?: Record<string, string>
  contacts?: Array<{ id: string; name: string; email: string }>
  institutions?: Array<{ id: string; name: string }>
  departments?: Array<{ id: string; name: string }>
  churches?: Array<{ id: string; name: string }>
  regions?: Array<{ id: string; name: string }>
  users?: Array<{ id: string; name: string }>
}

export function EventRegistrationForm({
  data,
  onChange,
  errors = {},
  contacts = [],
  institutions = [],
  departments = [],
  churches = [],
  regions = [],
  users = []
}: EventRegistrationFormProps) {
  const [customEventType, setCustomEventType] = React.useState("")
  const [showCustomInput, setShowCustomInput] = React.useState(false)
  const [openContact, setOpenContact] = React.useState(false)
  const [openLanguage, setOpenLanguage] = React.useState(false)
  const [openEventType, setOpenEventType] = React.useState(false)
  const [openTargetType, setOpenTargetType] = React.useState(false)
  const [openTarget, setOpenTarget] = React.useState(false)

  const eventTypeOptions = [
    "Show/Apresentação",
    "Evangelismo", 
    "Workshop",
    "Conferência",
    "Seminário",
    "Culto Especial",
    "Retiro",
    "Outro"
  ]

  const languageOptions = [
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" }
  ]

  const targetTypeOptions = [
    { value: "institution", name: "Instituição", icon: Building },
    { value: "region", name: "Região", icon: Globe },
    { value: "department", name: "Departamento", icon: Building },
    { value: "church", name: "Igreja", icon: Home },
    { value: "user", name: "Usuário Específico", icon: Users }
  ]

  const handleChange = (field: keyof EventFormData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const handleEventTypeChange = (value: string) => {
    if (value === "Outro") {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      setCustomEventType("")
      handleChange("type", value)
    }
  }

  const handleCustomTypeSubmit = () => {
    if (customEventType.trim()) {
      handleChange("type", customEventType.trim())
      setShowCustomInput(false)
    }
  }

  const getTargetOptions = () => {
    switch (data.target_type) {
      case "institution":
        return institutions
      case "department":
        return departments
      case "church":
        return churches
      case "region":
        return regions
      case "user":
        return users
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Event Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <Label htmlFor="event_title" className="flex items-center gap-2 text-base font-medium">
            <Target className="w-4 h-4 text-muted-foreground" />
            Título do Evento *
          </Label>
          <Input
            id="event_title"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Digite o título do evento"
            className={`h-12 border-2 ${errors.title ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Tipo de Evento *
          </Label>
          <Popover open={openEventType} onOpenChange={setOpenEventType}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openEventType}
                className={`h-12 w-full justify-between border-2 ${errors.type ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
              >
                {data.type || "Selecione o tipo de evento"}
                <Globe className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar tipo de evento..." />
                <CommandList>
                  <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {eventTypeOptions.map((eventType) => (
                      <CommandItem
                        key={eventType}
                        value={eventType}
                        onSelect={() => {
                          if (eventType === "Outro") {
                            setShowCustomInput(true)
                            setOpenEventType(false)
                          } else {
                            handleChange("type", eventType)
                            setShowCustomInput(false)
                            setOpenEventType(false)
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{eventType}</span>
                          </div>
                          {data.type === eventType && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {showCustomInput && (
            <div className="flex gap-2">
              <Input
                placeholder="Digite o tipo de evento personalizado"
                value={customEventType}
                onChange={(e) => setCustomEventType(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomTypeSubmit()
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleCustomTypeSubmit}
                className="px-3"
                disabled={!customEventType.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {!eventTypeOptions.includes(data.type) && data.type && !showCustomInput && (
            <div className="text-sm text-muted-foreground">
              Tipo personalizado: <span className="font-medium">{data.type}</span>
            </div>
          )}
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>
      </div>

      {/* Target Audience - Grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Target className="w-4 h-4 text-muted-foreground" />
            Tipo de Público *
          </Label>
          <Popover open={openTargetType} onOpenChange={setOpenTargetType}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTargetType}
                className={`h-12 w-full justify-between border-2 ${errors.target_type ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
              >
                {data.target_type
                  ? targetTypeOptions.find((target) => target.value === data.target_type)?.name
                  : "Selecione o tipo de público"}
                <Target className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar tipo de público..." />
                <CommandList>
                  <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {targetTypeOptions.map((targetType) => {
                      const IconComponent = targetType.icon
                      return (
                        <CommandItem
                          key={targetType.value}
                          value={targetType.name}
                          onSelect={() => {
                            handleChange("target_type", targetType.value)
                            handleChange("target_id", "") // Reset target when type changes
                            setOpenTargetType(false)
                          }}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{targetType.name}</span>
                            </div>
                            {data.target_type === targetType.value && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.target_type && <p className="text-sm text-red-600">{errors.target_type}</p>}
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Users className="w-4 h-4 text-muted-foreground" />
            Alvo Específico
          </Label>
          <Popover open={openTarget} onOpenChange={setOpenTarget}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTarget}
                className={`h-12 w-full justify-between border-2 ${errors.target_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
                disabled={!data.target_type}
              >
                {data.target_id
                  ? getTargetOptions().find((target) => target.id === data.target_id)?.name
                  : data.target_type ? "Selecione o alvo específico" : "Selecione primeiro o tipo de público"}
                <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar alvo..." />
                <CommandList>
                  <CommandEmpty>Nenhum alvo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {getTargetOptions().map((target) => (
                      <CommandItem
                        key={target.id}
                        value={target.name}
                        onSelect={() => {
                          handleChange("target_id", target.id)
                          setOpenTarget(false)
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{target.name}</span>
                          </div>
                          {data.target_id === target.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.target_id && <p className="text-sm text-red-600">{errors.target_id}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="event_description" className="flex items-center gap-2 text-base font-medium">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Descrição do Evento *
        </Label>
        <Textarea
          id="event_description"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descreva o evento detalhadamente"
          className={`min-h-[120px] border-2 ${errors.description ? 'border-red-500' : 'border-border'}`}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Contact and Language - Grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Users className="w-4 h-4 text-muted-foreground" />
            Contato Responsável *
          </Label>
          <Popover open={openContact} onOpenChange={setOpenContact}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openContact}
                className={`h-12 w-full justify-between border-2 ${errors.contact_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
              >
                {data.contact_id
                  ? contacts.find((contact) => contact.id === data.contact_id)?.name
                  : "Selecione o contato responsável"}
                <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar contato..." />
                <CommandList>
                  <CommandEmpty>Nenhum contato encontrado.</CommandEmpty>
                  <CommandGroup>
                    {contacts.map((contact) => (
                      <CommandItem
                        key={contact.id}
                        value={contact.name}
                        onSelect={() => {
                          handleChange("contact_id", contact.id)
                          setOpenContact(false)
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{contact.name}</span>
                            <div className="text-xs text-muted-foreground">{contact.email}</div>
                          </div>
                          {data.contact_id === contact.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.contact_id && <p className="text-sm text-red-600">{errors.contact_id}</p>}
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Languages className="w-4 h-4 text-muted-foreground" />
            Idioma do Evento *
          </Label>
          <Popover open={openLanguage} onOpenChange={setOpenLanguage}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openLanguage}
                className={`h-12 w-full justify-between border-2 ${errors.language_preference ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
              >
                {data.language_preference
                  ? languageOptions.find((lang) => lang.code === data.language_preference)?.name
                  : "Selecione o idioma"}
                <Languages className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar idioma..." />
                <CommandList>
                  <CommandEmpty>Nenhum idioma encontrado.</CommandEmpty>
                  <CommandGroup>
                    {languageOptions.map((lang) => (
                      <CommandItem
                        key={lang.code}
                        value={lang.name}
                        onSelect={() => {
                          handleChange("language_preference", lang.code)
                          setOpenLanguage(false)
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                            {lang.flag}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{lang.name}</span>
                            <div className="text-xs text-muted-foreground uppercase">{lang.code}</div>
                          </div>
                          {data.language_preference === lang.code && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.language_preference && <p className="text-sm text-red-600">{errors.language_preference}</p>}
        </div>
      </div>

      {/* Paid Event Toggle */}
      <div className="flex items-center justify-between p-4 border-2 rounded-lg">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Euro className="w-4 h-4 text-muted-foreground" />
            Evento Pago
          </Label>
          <p className="text-sm text-muted-foreground">
            Este evento requer pagamento de inscrição
          </p>
        </div>
        <Switch
          checked={data.is_paid_event || false}
          onCheckedChange={(checked) => handleChange("is_paid_event", checked)}
        />
      </div>

      {/* Conditional Paid Event Fields */}
      {data.is_paid_event && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-4">
            <Label htmlFor="ticket_amount" className="flex items-center gap-2 text-base font-medium">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Valor do Ingresso (€) *
            </Label>
            <Input
              id="ticket_amount"
              type="number"
              min="0"
              step="0.01"
              value={data.ticket_amount || ""}
              onChange={(e) => handleChange("ticket_amount", parseFloat(e.target.value) || undefined)}
              placeholder="0.00"
              className={`h-12 border-2 ${errors.ticket_amount ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
            />
            {errors.ticket_amount && <p className="text-sm text-red-600">{errors.ticket_amount}</p>}
          </div>

          <div className="space-y-4">
            <Label htmlFor="payment_description" className="flex items-center gap-2 text-base font-medium">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Descrição do Pagamento
            </Label>
            <Input
              id="payment_description"
              value={data.payment_description || ""}
              onChange={(e) => handleChange("payment_description", e.target.value)}
              placeholder="Ex: Inclui material, lanche e certificado"
              className="h-12 border-2 hover:border-primary/50 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Participants */}
      <div className="space-y-4">
        <Label htmlFor="max_participants" className="flex items-center gap-2 text-base font-medium">
          <Users className="w-4 h-4 text-muted-foreground" />
          Máximo de Participantes
        </Label>
        <Input
          id="max_participants"
          type="number"
          min="1"
          value={data.max_participants || ""}
          onChange={(e) => handleChange("max_participants", parseInt(e.target.value) || undefined)}
          placeholder="Limite de participantes (deixe vazio para ilimitado)"
          className="h-12 border-2 hover:border-primary/50 transition-colors"
        />
      </div>

      {/* Volunteers Switch */}
      <div className="flex items-center justify-between p-4 border-2 rounded-lg">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Users className="w-4 h-4 text-muted-foreground" />
            Requer Voluntários
          </Label>
          <p className="text-sm text-muted-foreground">
            Este evento precisa de voluntários para organização
          </p>
        </div>
        <Switch
          checked={data.required_volunteers}
          onCheckedChange={(checked) => handleChange("required_volunteers", checked)}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Data de Início
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-2",
                  !data.start_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.start_at ? (
                  format(data.start_at as Date, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecionar data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.start_at}
                onSelect={(date) => handleChange("start_at", date)}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Data de Término
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-2",
                  !data.end_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.end_at ? (
                  format(data.end_at as Date, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecionar data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.end_at}
                onSelect={(date) => handleChange("end_at", date)}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Inscrições Até
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-2",
                  !data.subscription_expires_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.subscription_expires_at ? (
                  format(data.subscription_expires_at as Date, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecionar data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.subscription_expires_at}
                onSelect={(date) => handleChange("subscription_expires_at", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>


    </div>
  )
}