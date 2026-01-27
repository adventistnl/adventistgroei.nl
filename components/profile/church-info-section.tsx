"use client"

import { useEffect, useState } from "react"
import { Building, Check, ChevronsUpDown, Church as ChurchIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ProfileSection } from "./profile-section"
import { ProfileField } from "./profile-field"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

interface ChurchInfoSectionProps {
  role: string
  institution: string
  church: string // church_id
  churchName: string // church display name
  availableChurches: { id: string; name: string }[]
  isEditing: boolean
  isSaving?: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onChurchChange: (value: string) => void
}

export function ChurchInfoSection({
  role,
  institution,
  church,
  churchName,
  availableChurches,
  isEditing,
  isSaving = false,
  onEdit,
  onSave,
  onCancel,
  onChurchChange,
}: ChurchInfoSectionProps) {
  const { t } = useTranslation()
  const [openChurch, setOpenChurch] = useState(false)
  
  // Debug: Log when props change
  useEffect(() => {
    console.log("⛪ ChurchInfoSection received props:", { 
      role, 
      institution, 
      church, 
      churchName,
      availableChurches: availableChurches.length,
      availableChurchesData: availableChurches,
      isEditing 
    })
    
    // Debug específico para role
    console.log("🎭 ROLE DEBUG:", {
      role_value: role,
      role_type: typeof role,
      role_length: role?.length,
      is_empty: !role || role === '',
      translation_key: 'profile.church.no_role',
      translation_value: t('profile.church.no_role')
    })
  }, [role, institution, church, churchName, availableChurches, isEditing, t])

  return (
    <ProfileSection
      icon={Building}
      title={t('profile.sections.church_information')}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      showEditButton={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role - Read-only (bloqueado) */}
        <ProfileField
          label={t('profile.church.role')}
          value={role || t('profile.church.no_role')}
          isEditing={false}
          onChange={() => {}}
          disabled={true}
        />
        
        {/* Institution - Read-only (bloqueado) */}
        <ProfileField
          label={t('profile.church.institution')}
          value={institution}
          isEditing={false}
          onChange={() => {}}
          disabled={true}
        />
        
        {/* Church - Editável com dropdown padrão do sistema */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            {t('profile.church.church')}
          </Label>
          {isEditing ? (
            <Popover open={openChurch} onOpenChange={setOpenChurch}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openChurch}
                  className={cn(
                    "w-full justify-between font-normal",
                    !church && "text-muted-foreground"
                  )}
                  disabled={isSaving}
                >
                  {church
                    ? availableChurches.find(c => c.id === church)?.name || churchName
                    : t('profile.church.select_church')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={t('profile.church.search_church') || 'Search church...'} />
                  <CommandList>
                    <CommandEmpty>{t('profile.church.no_church_found') || 'No church found.'}</CommandEmpty>
                    <CommandGroup>
                      {availableChurches.map((churchOption) => (
                        <CommandItem
                          key={churchOption.id}
                          value={churchOption.id}
                          onSelect={(currentValue) => {
                            onChurchChange(currentValue === church ? "" : currentValue)
                            setOpenChurch(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              church === churchOption.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <ChurchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {churchOption.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <ChurchIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">
                {churchName || '-'}
              </p>
            </div>
          )}
        </div>
      </div>
    </ProfileSection>
  )
}
