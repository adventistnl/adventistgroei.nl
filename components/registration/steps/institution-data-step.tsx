"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DepartmentSelect, ChurchSelect } from "../carousel-select"
import { Church, Department } from "@/types/graphql-global-types"
import { Churches_churches } from "@/types/Churches"
import { Departments_departments } from "@/types/Departments"


interface InstitutionDataStepProps {
  control: Control<any>
  translations: {
    department: string
    church: string
  }
  departments: Departments_departments[]
  churches: Churches_churches[]
  selectedDepartment: string
}

/**
 * Step 3: Dados Institucionais
 * Seleção de departamento e igreja através de cards interativos
 * Igreja depende do departamento selecionado
 */
export function InstitutionDataStep({ 
  control, 
  translations, 
  departments, 
  churches, 
  selectedDepartment 
}: InstitutionDataStepProps) {
  return (
    <div className="grid gap-6 w-full max-w-2xl overflow-hidden">
      {/* Seleção de Departamento */}
      <FormField
        control={control}
        name="department_id"
        render={({ field }) => (
          <FormItem className="w-full max-w-2xl">
            <FormControl>
              <DepartmentSelect
                departments={departments}
                selectedDepartment={field.value}
                onSelect={field.onChange}
                className="w-full max-w-2xl"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Seleção de Igreja */}
      <FormField
        control={control}
        name="church_id"
        render={({ field }) => (
          <FormItem className="w-full max-w-2xl">
            <FormControl>
              {selectedDepartment ? (
                <ChurchSelect
                  churches={churches}
                  selectedChurch={field.value}
                  onSelect={field.onChange}
                  className="w-full max-w-2xl"
                />
              ) : (
                <div className="flex items-center justify-center py-2rem w-full max-w-2xl">
                  <FormDescription className="text-0.75rem text-center text-muted-foreground max-w-2xl">
                    Selecione um departamento primeiro para ver as igrejas disponíveis
                  </FormDescription>
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
