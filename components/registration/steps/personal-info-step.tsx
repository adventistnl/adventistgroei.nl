"use client"

import * as React from "react"
import { User, Mail, Building, Church, Layers, UserCircle, Check, ChevronsUpDown, ChevronDown } from "lucide-react"
import { Control, UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface PersonalInfoStepProps {
  form: UseFormReturn<any>
  translations: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    emailAutoFilled: string
    church: string
    churchDepartment: string
    institution: string
    institutionDepartment: string
    infoSubtitle: string
    affiliationInfoDesc: string
    genderLabel: string
    genderPlaceholder: string
    gender: Record<string, string>
    showAffiliationInfo: string
    hideAffiliationInfo: string
    noGenderSelected: string
  }
  inviteEmail?: string
  church: string | undefined
  churchDepartment: string | undefined
  institution: string
  institutionDepartment: string | undefined
}

/**
 * Step 1: Informações Pessoais
 * Coleta nome completo e email do usuário
 * Email pode ser pré-preenchido pelo convite
 */
export function PersonalInfoStep({ form, translations, inviteEmail, church, churchDepartment, institution, institutionDepartment }: PersonalInfoStepProps) {
  const [openGender, setOpenGender] = React.useState(false)
  const [isAffiliationOpen, setIsAffiliationOpen] = React.useState(false)
  
  // Lista de opções de gênero para o combobox
  const genderOptions = Object.entries(translations.gender).map(([key, value]) => ({
    value: key,
    label: value
  }))
  
  // Verificar se há informações de afiliação para exibir
  const hasAffiliationInfo = church || churchDepartment || institution || institutionDepartment
  
  React.useEffect(() => {
    if (inviteEmail) {
      form.setValue("email", inviteEmail);
    }
  }, [inviteEmail, form]);
  
  return (
    <div className="grid gap-4">
      {/* Campo Nome */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              {translations.name}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={translations.namePlaceholder} 
                className="h-12 text-base"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campo Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {translations.email}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={translations.emailPlaceholder} 
                type="email" 
                className="h-12 text-base"
                disabled={!!inviteEmail}
                {...field} 
              />
            </FormControl>
            {inviteEmail && (
              <FormDescription className="text-xs">
                {translations.emailAutoFilled}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Seletor de gênero - Combobox */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-sm">
              <UserCircle className="w-4 h-4 text-muted-foreground" />
              {translations.genderLabel}
            </FormLabel>
            <FormControl>
              <Popover open={openGender} onOpenChange={setOpenGender}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openGender}
                    className={cn(
                      "w-full h-12 text-base justify-between font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? genderOptions.find(option => option.value === field.value)?.label
                      : translations.genderPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={translations.genderPlaceholder} />
                    <CommandList>
                      <CommandEmpty>{translations.noGenderSelected}</CommandEmpty>
                      <CommandGroup>
                        {genderOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              field.onChange(currentValue === field.value ? "" : currentValue)
                              setOpenGender(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Informações de Afiliação - Collapsible */}
      {hasAffiliationInfo && (
        <Collapsible
          open={isAffiliationOpen}
          onOpenChange={setIsAffiliationOpen}
          className="space-y-2 pt-4 border-t"
        >
          <div className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full p-0 px-0 hover:bg-transparent"
              >
                <div className="text-left">
                  <h1 className="text-2.5rem sm:text-3rem lg:text-3.5rem font-bold text-left leading-tight">
                    {translations.infoSubtitle}
                  </h1>
                  <p className="text-muted-foreground text-1rem sm:text-1.125rem lg:text-1.25rem leading-relaxed">
                    {translations.affiliationInfoDesc}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-2",
                    isAffiliationOpen && "transform rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4 pt-2">
            {typeof institution === "string" && institution !== "" && (
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {translations.institution}
                </FormLabel>
                <Input
                  value={institution}
                  disabled
                  className="h-12 text-base bg-muted cursor-not-allowed"
                />
              </div>
            )}
            
            {typeof institutionDepartment === "string" && institutionDepartment !== "" && (
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  {translations.institutionDepartment}
                </FormLabel>
                <Input
                  value={institutionDepartment}
                  disabled
                  className="h-12 text-base bg-muted cursor-not-allowed"
                />
              </div>
            )}
            
            {typeof church === "string" && church !== "" && (
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm">
                  <Church className="w-4 h-4 text-muted-foreground" />
                  {translations.church}
                </FormLabel>
                <Input
                  value={church}
                  disabled
                  className="h-12 text-base bg-muted cursor-not-allowed"
                />
              </div>
            )}
            
            {typeof churchDepartment === "string" && churchDepartment !== "" && (
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  {translations.churchDepartment}
                </FormLabel>
                <Input
                  value={churchDepartment}
                  disabled
                  className="h-12 text-base bg-muted cursor-not-allowed"
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
