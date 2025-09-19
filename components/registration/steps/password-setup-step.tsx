"use client"

import * as React from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PasswordSetupStepProps {
  control: Control<any>
  translations: {
    password: string
    passwordPlaceholder: string
    confirmPassword: string
    confirmPasswordPlaceholder: string
  }
  showPassword: boolean
  showConfirmPassword: boolean
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
}

/**
 * Step 2: Configuração de Senha
 * Coleta senha e confirmação com opção de visualização
 * Inclui validação de força e correspondência
 */
export function PasswordSetupStep({ 
  control, 
  translations, 
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword
}: PasswordSetupStepProps) {
  return (
    <div className="grid gap-4">
      {/* Campo Senha */}
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
              <Lock className="w-1rem h-1rem" />
              {translations.password}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder={translations.passwordPlaceholder} 
                  className="h-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...field} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={onTogglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campo Confirmar Senha */}
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
              <Lock className="w-1rem h-1rem" />
              {translations.confirmPassword}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={translations.confirmPasswordPlaceholder} 
                  className="h-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...field} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={onToggleConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
