"use client"

import * as React from "react"
import { User, Mail } from "lucide-react"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface PersonalInfoStepProps {
  control: Control<any>
  translations: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    emailAutoFilled: string
  }
  inviteEmail?: string
}

/**
 * Step 1: Informações Pessoais
 * Coleta nome completo e email do usuário
 * Email pode ser pré-preenchido pelo convite
 */
export function PersonalInfoStep({ control, translations, inviteEmail }: PersonalInfoStepProps) {
  return (
    <div className="grid gap-4">
      {/* Campo Nome */}
      <FormField
        control={control}
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
        control={control}
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
    </div>
  )
}
