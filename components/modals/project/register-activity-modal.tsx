"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Plus,
  X,
  Home,
  Settings,
  Target,
  Calendar as CalendarIcon,
  Users,
  Activity as ActivityIcon,
  DollarSign,
  Calculator,
  AlertTriangle,
  Tag,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { activityModalTranslations } from "@/lib/translations/activity-modal"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface RegisterActivityFormData {
  name: string
  description: string
  budget_amount: number
  request_subsidy: boolean
  priority: "low" | "medium" | "high"
  tags: string[]
  institution_requested_amount?: number
}

interface RegisterActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RegisterActivityFormData) => void
  projectId: string
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const getPredefinedActivities = (lang: 'en' | 'nl' | 'pt') => {
  const t = activityModalTranslations[lang]
  return [
    {
      name: t.activities.templeRenovation.name,
      description: t.activities.templeRenovation.description,
      budget_amount: 15000,
      request_subsidy: true,
      priority: "high" as const,
      tags: [t.tags.renovation, t.tags.equipment]
    },
    {
      name: t.activities.soundEquipment.name,
      description: t.activities.soundEquipment.description,
      budget_amount: 8000,
      request_subsidy: true,
      priority: "medium" as const,
      tags: [t.tags.equipment]
    },
    {
      name: t.activities.missionaryTrip.name,
      description: t.activities.missionaryTrip.description,
      budget_amount: 5000,
      request_subsidy: true,
      priority: "high" as const,
      tags: [t.tags.trips, t.tags.events]
    },
    {
      name: t.activities.leadershipTraining.name,
      description: t.activities.leadershipTraining.description,
      budget_amount: 3000,
      request_subsidy: false,
      priority: "medium" as const,
      tags: [t.tags.training]
    },
    {
      name: t.activities.evangelismEvent.name,
      description: t.activities.evangelismEvent.description,
      budget_amount: 12000,
      request_subsidy: true,
      priority: "high" as const,
      tags: [t.tags.events, t.tags.marketing, t.tags.food]
    }
  ]
}

const getActivityTags = (lang: 'en' | 'nl' | 'pt') => {
  const t = activityModalTranslations[lang]
  return [
    t.tags.renovation,
    t.tags.equipment,
    t.tags.trips,
    t.tags.events,
    t.tags.materials,
    t.tags.training,
    t.tags.marketing,
    t.tags.food,
    t.tags.transportation,
    t.tags.accommodation
  ]
}

const TAG_ICONS: Record<string, typeof Home> = {
  // English
  "Renovation": Home,
  "Equipment": Settings,
  "Trips": Target,
  "Events": CalendarIcon,
  "Training": Users,
  "Marketing": ActivityIcon,
  "Food": DollarSign,
  "Transportation": Calculator,
  "Accommodation": AlertTriangle,
  "Materials": Plus,
  // Dutch
  "Renovatie": Home,
  "Apparatuur": Settings,
  "Reizen": Target,
  "Evenementen": CalendarIcon,
  "Voedsel": DollarSign,
  "Transport": Calculator,
  "Accommodatie": AlertTriangle,
  "Materialen": Plus,
  // Portuguese
  "Reforma": Home,
  "Equipamentos": Settings,
  "Viagens": Target,
  "Eventos": CalendarIcon,
  "Treinamento": Users,
  "Alimentação": DollarSign,
  "Transporte": Calculator,
  "Hospedagem": AlertTriangle,
  "Materiais": Plus,
}

const getPriorityConfig = (lang: 'en' | 'nl' | 'pt') => {
  const t = activityModalTranslations[lang]
  return {
    low: { label: t.lowPriority, color: "bg-blue-500", dotColor: "bg-blue-500" },
    medium: { label: t.mediumPriority, color: "bg-yellow-500", dotColor: "bg-yellow-500" },
    high: { label: t.highPriority, color: "bg-red-500", dotColor: "bg-red-500" }
  }
}

// ============================================================================
// MICRO COMPONENTS
// ============================================================================

/**
 * Quick Activity Card Component
 * Displays a selectable predefined activity card
 */
interface QuickActivityCardProps {
  activity: ReturnType<typeof getPredefinedActivities>[0]
  onSelect: (activity: ReturnType<typeof getPredefinedActivities>[0]) => void
  translations: typeof activityModalTranslations.en
}

function QuickActivityCard({ activity, onSelect, translations }: QuickActivityCardProps) {
  const renderTagWithIcon = (tag: string) => {
    const IconComponent = TAG_ICONS[tag] || Tag
    return (
      <Badge 
        key={tag} 
        variant="outline" 
        className="text-[10px] h-5 px-1.5 bg-muted/50 flex items-center gap-1"
      >
        <IconComponent className="w-3 h-3" />
        <span className="truncate">{tag}</span>
      </Badge>
    )
  }

  return (
    <button
      onClick={() => onSelect(activity)}
      className="w-full h-full p-3 sm:p-4 rounded-lg border-2 border-border hover:border-primary/50 bg-background transition-all text-left group"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1 flex-1 min-w-0">
            {activity.name}
          </h4>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {activity.description}
        </p>
        
        <div className="flex items-center gap-1.5 flex-wrap">
          {activity.tags.slice(0, 2).map(renderTagWithIcon)}
          {activity.tags.length > 2 && (
            <Badge variant="outline" className="text-[10px] h-5 px-1.5">
              +{activity.tags.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-1 border-t gap-2">
          <div className="text-sm font-semibold text-primary truncate">
            € {activity.budget_amount.toLocaleString()}
          </div>
          {activity.request_subsidy && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 flex-shrink-0">
              {translations.subsidy}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}

/**
 * Quick Activities Carousel Component
 * Uses the same Carousel component as KPICards for consistent behavior
 */
interface QuickActivitiesCarouselProps {
  activities: ReturnType<typeof getPredefinedActivities>
  onSelectActivity: (activity: ReturnType<typeof getPredefinedActivities>[0]) => void
  translations: typeof activityModalTranslations.en
}

function QuickActivitiesCarousel({ activities, onSelectActivity, translations }: QuickActivitiesCarouselProps) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <Label className="text-sm font-semibold">{translations.quickActivities}</Label>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs px-2 py-0.5">
          <Info className="w-3 h-3 flex-shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">{translations.clickToUseTemplate}</span>
          <span className="sm:hidden">{translations.click}</span>
          <ArrowRight className="w-3 h-3 flex-shrink-0" />
        </Badge>
      </div>
      
      <div className="w-full max-w-full overflow-hidden">
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-3 lg:-ml-4">
            {activities.map((activity, index) => (
              <CarouselItem 
                key={index}
                className="pl-2 md:pl-3 lg:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 min-w-0"
              >
                <QuickActivityCard
                  activity={activity}
                  onSelect={onSelectActivity}
                  translations={translations}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {activities.length > 2 && (
            <>
              <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
              <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  )
}

/**
 * Form Field Component with Label and Error
 */
interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  htmlFor?: string
}

function FormField({ label, required, error, children, htmlFor }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/**
 * Priority Selector Component
 */
interface PrioritySelectorProps {
  value: "low" | "medium" | "high"
  onChange: (value: "low" | "medium" | "high") => void
  translations: typeof activityModalTranslations.en
  language: 'en' | 'nl' | 'pt'
}

function PrioritySelector({ value, onChange, translations, language }: PrioritySelectorProps) {
  const priorityConfig = getPriorityConfig(language)
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={translations.selectPriority} />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((priority) => {
          const config = priorityConfig[priority]
          return (
            <SelectItem key={priority} value={priority}>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

/**
 * Tag Manager Component
 */
interface TagManagerProps {
  selectedTags: string[]
  availableTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  translations: typeof activityModalTranslations.en
}

function TagManager({ selectedTags, availableTags, onAddTag, onRemoveTag, translations }: TagManagerProps) {
  const [newTag, setNewTag] = useState("")

  const renderTagWithIcon = (tag: string) => {
    const IconComponent = TAG_ICONS[tag] || Tag
    return (
      <div className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        <span className="truncate">{tag}</span>
      </div>
    )
  }

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim())
      setNewTag("")
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm">{translations.tagsCategories}</Label>
      
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg border bg-muted/30">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 pl-2 pr-1 text-xs"
            >
              {renderTagWithIcon(tag)}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Predefined Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onAddTag(tag)}
            disabled={selectedTags.includes(tag)}
            className={cn(
              "text-[10px] sm:text-xs px-2 py-1 rounded-md border transition-colors whitespace-nowrap",
              selectedTags.includes(tag)
                ? "bg-primary text-primary-foreground border-primary cursor-not-allowed opacity-50"
                : "bg-background hover:bg-muted border-border hover:border-primary/50"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <Input
          placeholder={translations.customTagPlaceholder}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddCustomTag()
            }
          }}
          className="text-sm"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCustomTag}
          disabled={!newTag.trim()}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * Activity Form Component
 */
interface ActivityFormProps {
  formData: RegisterActivityFormData
  errors: Record<string, string>
  onChange: (updates: Partial<RegisterActivityFormData>) => void
  translations: typeof activityModalTranslations.en
  language: 'en' | 'nl' | 'pt'
}

function ActivityForm({ formData, errors, onChange, translations, language }: ActivityFormProps) {
  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      onChange({ tags: [...formData.tags, tag] })
    }
  }

  const handleRemoveTag = (tag: string) => {
    onChange({ tags: formData.tags.filter(t => t !== tag) })
  }

  const activityTags = getActivityTags(language)
  
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Activity Name */}
      <FormField label={translations.activityName} required error={errors.name} htmlFor="name">
        <Input
          id="name"
          placeholder={translations.activityNamePlaceholder}
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={cn(errors.name && "border-red-500")}
        />
      </FormField>

      {/* Description */}
      <FormField label={translations.description} required error={errors.description} htmlFor="description">
        <Textarea
          id="description"
          placeholder={translations.descriptionPlaceholder}
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className={cn(errors.description && "border-red-500")}
        />
      </FormField>

      {/* Budget Amount and Priority (2-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={translations.budgetAmount} required error={errors.budget_amount} htmlFor="budget_amount">
          <Input
            id="budget_amount"
            type="number"
            placeholder={translations.budgetPlaceholder}
            value={formData.budget_amount || ""}
            onChange={(e) => onChange({ budget_amount: parseFloat(e.target.value) || 0 })}
            className={cn(errors.budget_amount && "border-red-500")}
          />
        </FormField>

        <FormField label={translations.priority} required htmlFor="priority">
          <PrioritySelector
            value={formData.priority}
            onChange={(value) => onChange({ priority: value })}
            translations={translations}
            language={language}
          />
        </FormField>
      </div>


      {/* Tags */}
      <TagManager
        selectedTags={formData.tags}
        availableTags={activityTags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        translations={translations}
      />
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RegisterActivityModal({
  isOpen,
  onClose,
  onSubmit,
  projectId
}: RegisterActivityModalProps) {
  const { i18n } = useTranslation()
  const currentLanguage = (i18n.language || 'en') as 'en' | 'nl' | 'pt'
  const t = activityModalTranslations[currentLanguage]
  const predefinedActivities = getPredefinedActivities(currentLanguage)
  
  const [formData, setFormData] = useState<RegisterActivityFormData>({
    name: "",
    description: "",
    budget_amount: 0,
    request_subsidy: false,
    priority: "medium",
    tags: [],
    institution_requested_amount: 0
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        description: "",
        budget_amount: 0,
        request_subsidy: false,
        priority: "medium",
        tags: [],
        institution_requested_amount: 0
      })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t.activityNameRequired
    }
    if (!formData.description.trim()) {
      newErrors.description = t.descriptionRequired
    }
    if (!formData.budget_amount || formData.budget_amount <= 0) {
      newErrors.budget_amount = t.budgetMustBeGreaterThanZero
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error(t.fillAllRequiredFields)
      return
    }

    onSubmit(formData)
    onClose()
  }

  const handleSelectPredefinedActivity = (activity: ReturnType<typeof getPredefinedActivities>[0]) => {
    setFormData({
      name: activity.name,
      description: activity.description,
      budget_amount: activity.budget_amount,
      request_subsidy: activity.request_subsidy,
      priority: activity.priority,
      tags: activity.tags
    })
    
    toast.success(t.quickActivitySelected.replace('{{name}}', activity.name), {
      duration: 3000
    })
  }

  const handleFormChange = (updates: Partial<RegisterActivityFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 flex-shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">{t.newActivity}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm line-clamp-2">
            {t.modalDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="max-w-full w-full px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
            {/* Quick Activities */}
            <QuickActivitiesCarousel
              activities={predefinedActivities}
              onSelectActivity={handleSelectPredefinedActivity}
              translations={t}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground whitespace-nowrap">
                  {t.orCreateCustom}
                </span>
              </div>
            </div>

            {/* Activity Form */}
            <ActivityForm
              formData={formData}
              errors={errors}
              onChange={handleFormChange}
              translations={t}
              language={currentLanguage}
            />
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="flex-shrink-0 flex-row justify-between sm:justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t">
          <Button variant="outline" onClick={onClose} className="text-sm">
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} className="gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.addActivity}</span>
            <span className="sm:hidden">{t.add}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
