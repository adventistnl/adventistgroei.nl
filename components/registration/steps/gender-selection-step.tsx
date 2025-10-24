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
            <select
              {...field}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                {registerTranslations[currentLanguage].genderPlaceholder}
              </option>
              {Object.values(GenderType).map((gender) => (
                <option key={gender} value={gender}>
                  {registerTranslations[currentLanguage].gender[gender] || gender}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}