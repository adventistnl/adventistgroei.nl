"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Globe, Target, Clock, Megaphone, Plus, Users, Building, Home, Check, FileText, Send, AlertCircle, MessageSquare, ChevronDown } from "lucide-react"
import { SerializedEditorState } from "lexical"
import { Editor } from "@/components/blocks/editor-x/editor"
import { format } from "date-fns"
import { ptBR, enUS, es, fr, de } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Valor inicial padrão para o editor
const initialEditorValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Escreva o conteúdo da sua comunicação aqui...",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

export interface CommunicationFormData {
  title: string
  content: SerializedEditorState
  communication_type: "announcement" | "invitation" | "newsletter" | "update" | "reminder"
  priority: "low" | "medium" | "high" | "urgent"
  language_preference: "en" | "nl" | "pt" | "es" | "fr" | "de"
  post_now: boolean
  publish_date?: string
  target_type?: "institution" | "region" | "department" | "church" | "user"
  target_id?: string
}

interface CommunicationFormProps {
  data: CommunicationFormData
  onChange: (data: CommunicationFormData) => void
  errors?: Record<string, string>
  institutions?: Array<{ id: string; name: string }>
  departments?: Array<{ id: string; name: string }>
  churches?: Array<{ id: string; name: string }>
  regions?: Array<{ id: string; name: string }>
  users?: Array<{ id: string; name: string }>
}

// Templates simplificados com texto plano que será convertido para SerializedEditorState
const COMMUNICATION_TEMPLATES = [
  {
    id: "announcement-general",
    title: "Anúncio Geral",
    description: "Template para anúncios importantes da comunidade",
    type: "announcement",
    priority: "medium",
    textContent: "📢 **ANÚNCIO IMPORTANTE**\n\nQueremos informar a todos sobre: [DESCREVA O ASSUNTO]"
  },
  {
    id: "invitation-event",
    title: "Convite para Evento",
    description: "Template para convites de eventos e atividades",
    type: "invitation",
    priority: "high",
    textContent: "🎉 **VOCÊ ESTÁ CONVIDADO!** 🎉\n\nTemos o prazer de convidá-lo para: [NOME DO EVENTO]"
  },
  {
    id: "newsletter-update",
    title: "Newsletter/Boletim",
    description: "Template para newsletters periódicas",
    type: "newsletter",
    priority: "low",
    textContent: "📰 **BOLETIM INFORMATIVO**\n\nPrezados membros,\n\n📅 **Período:** [MÊS/PERÍODO DE REFERÊNCIA]"
  },
  {
    id: "volunteer-call",
    title: "Chamada de Voluntários",
    description: "Template para recrutar voluntários",
    type: "announcement",
    priority: "high",
    textContent: "🙋‍♂️ **PRECISAMOS DE VOCÊ!** 🙋‍♀️\n\nEstamos procurando voluntários para nosso projeto:"
  },
  {
    id: "progress-update",
    title: "Atualização de Progresso",
    description: "Template para informar progresso do projeto",
    type: "update",
    priority: "low",
    textContent: "📊 **ATUALIZAÇÃO DO PROJETO**\n\nQueremos compartilhar o progresso do nosso projeto:"
  }
]

export function CommunicationForm({
  data,
  onChange,
  errors = {},
  institutions = [],
  departments = [],
  churches = [],
  regions = [],
  users = []
}: CommunicationFormProps) {
  const [openLanguage, setOpenLanguage] = React.useState(false)
  const [openCommunicationType, setOpenCommunicationType] = React.useState(false)
  const [openPriority, setOpenPriority] = React.useState(false)
  const [openTargetType, setOpenTargetType] = React.useState(false)
  const [openTarget, setOpenTarget] = React.useState(false)
  const [openCalendar, setOpenCalendar] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(data.publish_date ? new Date(data.publish_date) : undefined)

  // Effect para sincronizar selectedDate quando publish_date mudar
  React.useEffect(() => {
    if (data.publish_date) {
      setSelectedDate(new Date(data.publish_date))
    } else {
      setSelectedDate(undefined)
    }
  }, [data.publish_date])

  // Effect para re-renderizar quando o idioma mudar
  React.useEffect(() => {
    // Força re-render dos textos quando o idioma muda
    if (selectedDate) {
      setSelectedDate(new Date(selectedDate))
    }
  }, [data.language_preference])

  const handleChange = (field: keyof CommunicationFormData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  // Função para obter locale baseado no idioma selecionado
  const getLocale = () => {
    switch (data.language_preference) {
      case 'pt': return ptBR
      case 'en': return enUS
      case 'es': return es
      case 'fr': return fr
      case 'de': return de
      default: return ptBR
    }
  }

  // Textos i18n
  const t = {
    templates: {
      pt: "Templates de Comunicação",
      en: "Communication Templates",
      nl: "Communicatie Sjablonen",
      es: "Plantillas de Comunicación",
      fr: "Modèles de Communication",
      de: "Kommunikationsvorlagen"
    },
    title: {
      pt: "Título da Comunicação *",
      en: "Communication Title *",
      nl: "Communicatie Titel *",
      es: "Título de la Comunicación *",
      fr: "Titre de la Communication *",
      de: "Kommunikationstitel *"
    },
    targetType: {
      pt: "Tipo de Público *",
      en: "Target Type *",
      nl: "Doelgroep Type *",
      es: "Tipo de Público *",
      fr: "Type de Public *",
      de: "Zielgruppentyp *"
    },
    specificTarget: {
      pt: "Alvo Específico",
      en: "Specific Target",
      nl: "Specifiek Doel",
      es: "Objetivo Específico",
      fr: "Cible Spécifique",
      de: "Spezifisches Ziel"
    },
    language: {
      pt: "Idioma da Comunicação *",
      en: "Communication Language *",
      nl: "Communicatie Taal *",
      es: "Idioma de la Comunicación *",
      fr: "Langue de Communication *",
      de: "Kommunikationssprache *"
    },
    type: {
      pt: "Tipo de Comunicação *",
      en: "Communication Type *",
      nl: "Communicatie Type *",
      es: "Tipo de Comunicación *",
      fr: "Type de Communication *",
      de: "Kommunikationstyp *"
    },
    priority: {
      pt: "Prioridade",
      en: "Priority",
      nl: "Prioriteit",
      es: "Prioridad",
      fr: "Priorité",
      de: "Priorität"
    },
    publishNow: {
      pt: "Publicar Agora?",
      en: "Publish Now?",
      nl: "Nu Publiceren?",
      es: "¿Publicar Ahora?",
      fr: "Publier Maintenant?",
      de: "Jetzt Veröffentlichen?"
    },
    publishDate: {
      pt: "Data e Hora de Publicação *",
      en: "Publication Date and Time *",
      nl: "Publicatie Datum en Tijd *",
      es: "Fecha y Hora de Publicación *",
      fr: "Date et Heure de Publication *",
      de: "Veröffentlichungsdatum und -zeit *"
    },
    content: {
      pt: "Conteúdo da Comunicação *",
      en: "Communication Content *",
      nl: "Communicatie Inhoud *",
      es: "Contenido de la Comunicación *",
      fr: "Contenu de la Communication *",
      de: "Kommunikationsinhalt *"
    },
    publishImmediately: {
      pt: "Publicar imediatamente",
      en: "Publish immediately",
      nl: "Direct publiceren",
      es: "Publicar inmediatamente",
      fr: "Publier immédiatement",
      de: "Sofort veröffentlichen"
    },
    schedulePublication: {
      pt: "Agendar publicação",
      en: "Schedule publication",
      nl: "Publicatie plannen",
      es: "Programar publicación",
      fr: "Programmer la publication",
      de: "Veröffentlichung planen"
    },
    selectDate: {
      pt: "Selecionar data",
      en: "Select date",
      nl: "Selecteer datum",
      es: "Seleccionar fecha",
      fr: "Sélectionner date",
      de: "Datum wählen"
    },
    date: {
      pt: "Data",
      en: "Date",
      nl: "Datum",
      es: "Fecha",
      fr: "Date",
      de: "Datum"
    },
    time: {
      pt: "Horário",
      en: "Time",
      nl: "Tijd",
      es: "Hora",
      fr: "Heure",
      de: "Uhrzeit"
    },
    selectTargetType: {
      pt: "Selecione o tipo de público",
      en: "Select target type",
      nl: "Selecteer doelgroep type",
      es: "Selecciona tipo de público",
      fr: "Sélectionner type de public",
      de: "Zielgruppentyp wählen"
    },
    selectTarget: {
      pt: "Selecione o alvo específico",
      en: "Select specific target",
      nl: "Selecteer specifiek doel",
      es: "Selecciona objetivo específico",
      fr: "Sélectionner cible spécifique",
      de: "Spezifisches Ziel wählen"
    },
    selectLanguage: {
      pt: "Selecione o idioma",
      en: "Select language",
      nl: "Selecteer taal",
      es: "Selecciona idioma",
      fr: "Sélectionner langue",
      de: "Sprache wählen"
    },
    selectType: {
      pt: "Selecione o tipo",
      en: "Select type",
      nl: "Selecteer type",
      es: "Selecciona tipo",
      fr: "Sélectionner type",
      de: "Typ wählen"
    },
    selectPriority: {
      pt: "Selecione a prioridade",
      en: "Select priority",
      nl: "Selecteer prioriteit",
      es: "Selecciona prioridad",
      fr: "Sélectionner priorité",
      de: "Priorität wählen"
    }
  }

  const getCurrentText = (key: keyof typeof t) => {
    return t[key][data.language_preference] || t[key].pt
  }

  // Função para converter texto para SerializedEditorState
  const textToEditorState = (text: string): SerializedEditorState => {
    const paragraphs = text.split('\n\n').filter(p => p.trim())
    const children = paragraphs.map(paragraph => ({
      children: [
        {
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          text: paragraph.replace(/\n/g, ' '),
          type: "text",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    }))

    return {
      root: {
        children,
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    } as unknown as SerializedEditorState
  }

  // Opções de configuração
  const languageOptions = [
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" }
  ]

  const communicationTypeOptions = [
    { value: "announcement", name: "Anúncio", icon: Megaphone },
    { value: "invitation", name: "Convite", icon: Send },
    { value: "newsletter", name: "Newsletter", icon: FileText },
    { value: "update", name: "Atualização", icon: Target },
    { value: "reminder", name: "Lembrete", icon: Clock }
  ]

  const priorityOptions = [
    { value: "low", name: "Baixa", color: "text-green-600" },
    { value: "medium", name: "Média", color: "text-yellow-600" },
    { value: "high", name: "Alta", color: "text-orange-600" },
    { value: "urgent", name: "Urgente", color: "text-red-600" }
  ]

  const targetTypeOptions = [
    { value: "institution", name: "Instituição", icon: Building },
    { value: "region", name: "Região", icon: Globe },
    { value: "department", name: "Departamento", icon: Building },
    { value: "church", name: "Igreja", icon: Home },
    { value: "user", name: "Usuário Específico", icon: Users }
  ]

  const handleTemplateSelect = (template: typeof COMMUNICATION_TEMPLATES[0]) => {
    onChange({
      ...data,
      title: template.title,
      content: textToEditorState(template.textContent),
      communication_type: template.type as "announcement" | "invitation" | "newsletter" | "update" | "reminder",
      priority: template.priority as "low" | "medium" | "high" | "urgent"
    })
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
    <div className="w-full max-w-full space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Communication Templates */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Plus className="w-4 h-4 text-muted-foreground" />
          {getCurrentText('templates')}
        </h4>
        
        <Carousel className="w-full max-w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {COMMUNICATION_TEMPLATES.map((template) => (
              <CarouselItem key={template.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card 
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 border-2 h-full"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm leading-tight">{template.title}</h5>
                        <Badge 
                          variant={template.priority === 'high' ? 'destructive' : 
                                 template.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs shrink-0"
                        >
                          {template.priority === 'high' ? 'Alta' : 
                           template.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          {template.type === 'announcement' ? 'Anúncio' :
                           template.type === 'invitation' ? 'Convite' :
                           template.type === 'newsletter' ? 'Newsletter' :
                           template.type === 'update' ? 'Atualização' : 'Lembrete'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      {/* Title */}
      <div className="space-y-4">
        <Label htmlFor="comm_title" className="flex items-center gap-2 text-base font-medium">
          <Megaphone className="w-4 h-4 text-muted-foreground" />
          {getCurrentText('title')}
        </Label>
        <Input
          id="comm_title"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={getCurrentText('title').replace(' *', '')}
          className={`h-12 border-2 ${errors.title ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Target Audience - Grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Target className="w-4 h-4 text-muted-foreground" />
            {getCurrentText('targetType')}
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
                  : getCurrentText('selectTargetType')}
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
            {getCurrentText('specificTarget')}
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
                  : data.target_type ? getCurrentText('selectTarget') : getCurrentText('selectTargetType')}
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

      {/* Communication Settings - Grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Globe className="w-4 h-4 text-muted-foreground" />
            {getCurrentText('language')}
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
                  : getCurrentText('selectLanguage')}
                <Globe className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar idioma..." />
                <CommandList>
                  <CommandEmpty>Nenhum idioma encontrado.</CommandEmpty>
                  <CommandGroup>
                    {languageOptions.map((language) => (
                      <CommandItem
                        key={language.code}
                        value={language.name}
                        onSelect={() => {
                          handleChange("language_preference", language.code)
                          setOpenLanguage(false)
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-lg">{language.flag}</span>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{language.name}</span>
                          </div>
                          {data.language_preference === language.code && (
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

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            {getCurrentText('type')}
          </Label>
          <Popover open={openCommunicationType} onOpenChange={setOpenCommunicationType}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCommunicationType}
                className={`h-12 w-full justify-between border-2 ${errors.communication_type ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
              >
                {data.communication_type
                  ? communicationTypeOptions.find((type) => type.value === data.communication_type)?.name
                  : getCurrentText('selectType')}
                <MessageSquare className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar tipo..." />
                <CommandList>
                  <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {communicationTypeOptions.map((commType) => {
                      const IconComponent = commType.icon
                      return (
                        <CommandItem
                          key={commType.value}
                          value={commType.name}
                          onSelect={() => {
                            handleChange("communication_type", commType.value)
                            setOpenCommunicationType(false)
                          }}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{commType.name}</span>
                            </div>
                            {data.communication_type === commType.value && (
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
          {errors.communication_type && <p className="text-sm text-red-600">{errors.communication_type}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            {getCurrentText('priority')}
          </Label>
          <Popover open={openPriority} onOpenChange={setOpenPriority}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPriority}
                className="h-12 w-full justify-between border-2 border-border hover:border-primary/50 transition-colors"
              >
                {data.priority
                  ? priorityOptions.find((priority) => priority.value === data.priority)?.name
                  : getCurrentText('selectPriority')}
                <AlertCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Pesquisar prioridade..." />
                <CommandList>
                  <CommandEmpty>Nenhuma prioridade encontrada.</CommandEmpty>
                  <CommandGroup>
                    {priorityOptions.map((priority) => (
                      <CommandItem
                        key={priority.value}
                        value={priority.name}
                        onSelect={() => {
                          handleChange("priority", priority.value)
                          setOpenPriority(false)
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <AlertCircle className={`w-4 h-4 ${priority.color}`} />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{priority.name}</span>
                          </div>
                          {data.priority === priority.value && (
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
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Send className="w-4 h-4 text-muted-foreground" />
            {getCurrentText('publishNow')}
          </Label>
          <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
            <Switch
              id="post-now"
              checked={data.post_now}
              onCheckedChange={(checked) => handleChange("post_now", checked)}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30"
            />
            <Label htmlFor="post-now" className="text-sm font-medium cursor-pointer text-muted-foreground">
              {data.post_now ? getCurrentText('publishImmediately') : getCurrentText('schedulePublication')}
            </Label>
          </div>
        </div>
      </div>

      {/* Conditional Scheduling Field with Calendar */}
      {!data.post_now && (
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base font-medium">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            {getCurrentText('publishDate')}
          </Label>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Picker */}
            <div className="flex flex-col gap-3 flex-1">
              <Label htmlFor="date-picker" className="px-1 text-sm font-medium text-muted-foreground">
                {getCurrentText('date')}
              </Label>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="h-12 justify-between font-normal border-2 hover:border-primary/50 transition-colors"
                  >
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy", { locale: getLocale() })
                    ) : (
                      <span className="text-muted-foreground">
                        {getCurrentText('selectDate')}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    locale={getLocale()}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      if (date) {
                        // Manter a hora existente ou definir como meio-dia se não houver
                        const timeValue = document.getElementById('time-picker') as HTMLInputElement
                        const timeString = timeValue?.value || '12:00'
                        const [hours, minutes] = timeString.split(':').map(Number)
                        
                        const newDateTime = new Date(date)
                        newDateTime.setHours(hours, minutes, 0, 0)
                        handleChange("publish_date", newDateTime.toISOString().slice(0, 16))
                      }
                      setOpenCalendar(false)
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time Picker */}
            <div className="flex flex-col gap-3 flex-1">
              <Label htmlFor="time-picker" className="px-1 text-sm font-medium text-muted-foreground">
                {getCurrentText('time')}
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="60"
                value={data.publish_date ? new Date(data.publish_date).toTimeString().slice(0, 5) : "12:00"}
                onChange={(e) => {
                  const timeValue = e.target.value
                  if (selectedDate && timeValue) {
                    const [hours, minutes] = timeValue.split(':').map(Number)
                    const newDateTime = new Date(selectedDate)
                    newDateTime.setHours(hours, minutes, 0, 0)
                    handleChange("publish_date", newDateTime.toISOString().slice(0, 16))
                  } else if (timeValue) {
                    // Se não houver data selecionada, usar data atual
                    const today = new Date()
                    const [hours, minutes] = timeValue.split(':').map(Number)
                    today.setHours(hours, minutes, 0, 0)
                    setSelectedDate(today)
                    handleChange("publish_date", today.toISOString().slice(0, 16))
                  }
                }}
                className="h-12 bg-background border-2 border-border hover:border-primary/50 transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rich Text Editor for Content */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base font-medium">
          <FileText className="w-4 h-4 text-muted-foreground" />
          {getCurrentText('content')}
        </Label>
        <div className="min-h-[400px] w-full">
          <Editor
            editorSerializedState={data.content || initialEditorValue}
            onSerializedChange={(value) => handleChange("content", value)}
          />
        </div>
        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
      </div>
    </div>
  )
}