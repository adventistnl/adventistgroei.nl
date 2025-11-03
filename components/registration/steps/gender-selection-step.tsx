"use client";

import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GenderType } from "@/types/graphql-global-types";
import { Control } from "react-hook-form";
import { registerTranslations } from "@/lib/translations/register";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenderSelectionStepProps {
  form: Control<any>;
}

export function GenderSelectionStep({ form }: GenderSelectionStepProps) {
  const currentLanguage = "pt"; // Substitua por lógica para obter o idioma atual

  return (
    <FormField
      control={form}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{registerTranslations[currentLanguage].genderLabel}</FormLabel>
          <FormControl>
            <Select {...field}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder={registerTranslations[currentLanguage].genderPlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {Object.values(GenderType).map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {registerTranslations[currentLanguage].gender[gender] || gender}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}