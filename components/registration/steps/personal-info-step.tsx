"use client"

import * as React from "react"
import { User, Mail } from "lucide-react"
import { Control, UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

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
    genderLabel: string
    genderPlaceholder: string
    gender: Record<string, string>
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
            <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
              <User className="w-1rem h-1rem" />
              {translations.name}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={translations.namePlaceholder} 
                className="h-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
              <Mail className="w-1rem h-1rem" />
              {translations.email}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={translations.emailPlaceholder} 
                type="email" 
                className="h-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={!!inviteEmail}
                {...field} 
              />
            </FormControl>
            {inviteEmail && (
              <FormDescription className="text-0.75rem">
                {translations.emailAutoFilled}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Seletor de gênero */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translations.genderLabel}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={translations.genderPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {Object.entries(translations.gender).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Card de informações adicionais */}
      {(church || churchDepartment || institution || institutionDepartment) && (
        <div className="rounded-lg border bg-muted p-4 flex flex-col gap-2">
          <h2 className="text-2.5rem sm:text-3rem lg:text-3.5rem font-bold text-left leading-tight mb-2">
            {translations.infoSubtitle}
          </h2>
          <div className="flex flex-col gap-x-6 gap-y-2">
            {typeof institution === "string" && institution !== "" && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-1rem sm:text-1.125rem lg:text-1.25rem text-left">
                  {translations.institution}:
                </span>
                <span className="text-muted-foreground text-1rem sm:text-1.125rem lg:text-1.25rem leading-relaxed">
                  {institution}
                </span>
              </div>
            )}
            {typeof institutionDepartment === "string" && institutionDepartment !== "" && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-1rem sm:text-1.125rem lg:text-1.25rem text-left">
                  {translations.institutionDepartment}:
                </span>
                <span className="text-muted-foreground text-1rem sm:text-1.125rem lg:text-1.25rem leading-relaxed">
                  {institutionDepartment}
                </span>
              </div>
            )}
            {typeof church === "string" && church !== "" && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-1rem sm:text-1.125rem lg:text-1.25rem text-left">
                  {translations.church}:
                </span>
                <span className="text-muted-foreground text-1rem sm:text-1.125rem lg:text-1.25rem leading-relaxed">
                  {church}
                </span>
              </div>
            )}
            {typeof churchDepartment === "string" && churchDepartment !== "" && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-1rem sm:text-1.125rem lg:text-1.25rem text-left">
                  {translations.churchDepartment}:
                </span>
                <span className="text-muted-foreground text-1rem sm:text-1.125rem lg:text-1.25rem leading-relaxed">
                  {churchDepartment}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
