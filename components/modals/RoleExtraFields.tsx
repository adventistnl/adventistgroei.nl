import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Building, Church, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleExtraFieldsProps {
  selectedRoleKeyCode: string | null;
  churches: any[];
  institutions: any[];
  form: any;
  selectedChurch: string | undefined;
  setSelectedChurch: (id: string | undefined) => void;
  selectedInstitution: string | undefined;
  setSelectedInstitution: (id: string | undefined) => void;
  selectedChurchDepartment: string | undefined;
  setSelectedChurchDepartment: (id: string | undefined) => void;
  selectedInstitutionDepartment: string | undefined;
  setSelectedInstitutionDepartment: (id: string | undefined) => void;
}

const roleFieldConfig = {
  CHURCH_MEMBER: [
    { name: 'church', label: 'Igreja', type: 'select', required: true },
  ],
  CHURCH_LEADER: [  
    { name: 'church', label: 'Igreja', type: 'select', required: true },
    { name: 'church_department', label: 'Departamento da Igreja', type: 'select', required: true },
  ],
  DEPARTMENT_CHURCH_LEADER: [  
    { name: 'church', label: 'Igreja', type: 'select', required: true },
    { name: 'church_department', label: 'Departamento da Igreja', type: 'select', required: true },
  ],
  INSTITUTIONAL_LEADER: [
    { name: 'institution', label: 'Instituição', type: 'select', required: true },
    { name: 'institution_department', label: 'Departamento da Instituição', type: 'select', required: true },
  ],
  INSTITUTIONAL_MEMBER: [
    { name: 'institution', label: 'Instituição', type: 'select', required: true },
  ],
  INSTITUTIONAL_DEPARTMENT_LEADER: [
    { name: 'institution', label: 'Instituição', type: 'select', required: true },
    { name: 'institution_department', label: 'Departamento da Instituição', type: 'select', required: true },
  ],
};

export function RoleExtraFields({
  selectedRoleKeyCode,
  churches,
  institutions,
  form,
  selectedChurch,
  setSelectedChurch,
  selectedInstitution,
  setSelectedInstitution,
  selectedChurchDepartment,
  setSelectedChurchDepartment,
  selectedInstitutionDepartment,
  setSelectedInstitutionDepartment,
  showErrors,
}: RoleExtraFieldsProps & { showErrors?: boolean }) {
  const extraFields = roleFieldConfig[selectedRoleKeyCode as keyof typeof roleFieldConfig] || [];

  // Estados para controlar abertura dos popovers
  const [openChurch, setOpenChurch] = useState(false);
  const [openInstitution, setOpenInstitution] = useState(false);
  const [openChurchDepartment, setOpenChurchDepartment] = useState(false);
  const [openInstitutionDepartment, setOpenInstitutionDepartment] = useState(false);

  return (
    <div className="space-y-4 mt-4">
      {extraFields.map(extra => {
        const requiredMark = extra.required ? <span className="text-red-500">*</span> : null;
        
        if (extra.name === 'church') {
          const selectedChurchData = churches.find(c => c.id === selectedChurch);
          
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="churchId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Church className="w-4 h-4 text-muted-foreground" />
                    {extra.label} {requiredMark}
                  </FormLabel>
                  <FormControl>
                    <Popover open={openChurch} onOpenChange={setOpenChurch}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openChurch}
                          className={cn(
                            "w-full h-12 text-base justify-between font-normal",
                            !selectedChurch && "text-muted-foreground"
                          )}
                        >
                          {selectedChurchData?.name || "Selecione a igreja"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar igreja..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma igreja encontrada.</CommandEmpty>
                            <CommandGroup>
                              {churches.map((church) => (
                                <CommandItem
                                  key={church.id}
                                  value={church.id}
                                  onSelect={(currentValue) => {
                                    const newValue = currentValue === selectedChurch ? "" : currentValue;
                                    field.onChange(newValue);
                                    setSelectedChurch(newValue);
                                    setSelectedChurchDepartment(undefined);
                                    setOpenChurch(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedChurch === church.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <Church className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {church.name}
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
          );
        }
        
        if (extra.name === 'institution') {
          const selectedInstitutionData = institutions.find(i => i.id === selectedInstitution);
          
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="institutionId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    {extra.label} {requiredMark}
                  </FormLabel>
                  <FormControl>
                    <Popover open={openInstitution} onOpenChange={setOpenInstitution}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openInstitution}
                          className={cn(
                            "w-full h-12 text-base justify-between font-normal",
                            !selectedInstitution && "text-muted-foreground"
                          )}
                        >
                          {selectedInstitutionData?.name || "Selecione a instituição"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar instituição..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma instituição encontrada.</CommandEmpty>
                            <CommandGroup>
                              {institutions.map((inst) => (
                                <CommandItem
                                  key={inst.id}
                                  value={inst.id}
                                  onSelect={(currentValue) => {
                                    const newValue = currentValue === selectedInstitution ? "" : currentValue;
                                    field.onChange(newValue);
                                    setSelectedInstitution(newValue);
                                    setSelectedInstitutionDepartment(undefined);
                                    setOpenInstitution(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedInstitution === inst.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {inst.name}
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
          );
        }
        
        if (extra.name === 'church_department') {
          let departments: any[] = [];
          if (selectedChurch) {
            const church = churches.find(c => c.id === selectedChurch);
            departments = church?.departments || [];
          }
          const selectedDepartmentData = departments.find(d => d.id === selectedChurchDepartment);
          
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="churchDepartmentId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    {extra.label} {requiredMark}
                  </FormLabel>
                  <FormControl>
                    <Popover open={openChurchDepartment} onOpenChange={setOpenChurchDepartment}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openChurchDepartment}
                          className={cn(
                            "w-full h-12 text-base justify-between font-normal",
                            !selectedChurchDepartment && "text-muted-foreground"
                          )}
                          disabled={!selectedChurch || departments.length === 0}
                        >
                          {selectedDepartmentData?.name || "Selecione o departamento"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar departamento..." />
                          <CommandList>
                            <CommandEmpty>Nenhum departamento encontrado.</CommandEmpty>
                            <CommandGroup>
                              {departments.map((dep) => (
                                <CommandItem
                                  key={dep.id}
                                  value={dep.id}
                                  onSelect={(currentValue) => {
                                    const newValue = currentValue === selectedChurchDepartment ? "" : currentValue;
                                    field.onChange(newValue);
                                    setSelectedChurchDepartment(newValue);
                                    setOpenChurchDepartment(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedChurchDepartment === dep.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {dep.name}
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
          );
        }
        
        if (extra.name === 'institution_department') {
          let departments: any[] = [];
          if (selectedInstitution) {
            const institution = institutions.find(i => i.id === selectedInstitution);
            departments = institution?.departments || [];
          }
          const selectedDepartmentData = departments.find(d => d.id === selectedInstitutionDepartment);
          
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="institutionDepartmentId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    {extra.label} {requiredMark}
                  </FormLabel>
                  <FormControl>
                    <Popover open={openInstitutionDepartment} onOpenChange={setOpenInstitutionDepartment}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openInstitutionDepartment}
                          className={cn(
                            "w-full h-12 text-base justify-between font-normal",
                            !selectedInstitutionDepartment && "text-muted-foreground"
                          )}
                          disabled={!selectedInstitution || departments.length === 0}
                        >
                          {selectedDepartmentData?.name || "Selecione o departamento"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar departamento..." />
                          <CommandList>
                            <CommandEmpty>Nenhum departamento encontrado.</CommandEmpty>
                            <CommandGroup>
                              {departments.map((dep) => (
                                <CommandItem
                                  key={dep.id}
                                  value={dep.id}
                                  onSelect={(currentValue) => {
                                    const newValue = currentValue === selectedInstitutionDepartment ? "" : currentValue;
                                    field.onChange(newValue);
                                    setSelectedInstitutionDepartment(newValue);
                                    setOpenInstitutionDepartment(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedInstitutionDepartment === dep.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {dep.name}
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
          );
        }
        
        return null;
      })}
    </div>
  );
}
