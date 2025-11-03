import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
    { name: 'church_department', label: 'Departamento da Igreja', type: 'select', required: true },
  ],
  INSTITUTIONAL_LEADER: [
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

  return (
    <div className="space-y-4 mt-4">
      {extraFields.map(extra => {
        const requiredMark = extra.required ? <span className="text-red-500">*</span> : null;
        if (extra.name === 'church') {
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="churchId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{extra.label} {requiredMark}</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={typeof field.value === 'string' && field.value !== '' ? field.value : selectedChurch || ''}
                      onValueChange={value => {
                        field.onChange(value);
                        setSelectedChurch(value);
                        setSelectedChurchDepartment(undefined);
                      }}
                      className="w-full border rounded px-2 py-2"
                      required={extra.required}
                    >
                      <SelectTrigger>
                        <SelectValue  placeholder="Selecione a igreja"/>
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map(church => (
                          <SelectItem key={church.id} value={church.id}>{church.name}</SelectItem>
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
        if (extra.name === 'institution') {
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="institutionId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{extra.label} {requiredMark}</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={typeof field.value === 'string' && field.value !== '' ? field.value : selectedInstitution || ''}
                      onValueChange={value => {
                        field.onChange(value);
                        setSelectedInstitution(value);
                        setSelectedInstitutionDepartment(undefined);
                      }}
                      className="w-full border rounded px-2 py-2"
                      required={extra.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a instituição" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map(inst => (
                          <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
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
        if (extra.name === 'church_department') {
          let departments: any[] = [];
          if (selectedChurch) {
            const church = churches.find(c => c.id === selectedChurch);
            departments = church?.departments || [];
          }
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="churchDepartmentId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{extra.label} {requiredMark}</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={typeof field.value === 'string' && field.value !== '' ? field.value : selectedChurchDepartment || ''}
                      onValueChange={value => {
                        field.onChange(value);
                        setSelectedChurchDepartment(value);
                      }}
                      className="w-full border rounded px-2 py-2"
                      required={extra.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dep => (
                          <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
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
        if (extra.name === 'institution_department') {
          let departments: any[] = [];
          if (selectedInstitution) {
            const institution = institutions.find(i => i.id === selectedInstitution);
            departments = institution?.departments || [];
          }
          return (
            <FormField
              key={extra.name}
              control={form.control}
              name="institutionDepartmentId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{extra.label} {requiredMark}</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={typeof field.value === 'string' && field.value !== '' ? field.value : selectedInstitutionDepartment || ''}
                      onValueChange={value => {
                        field.onChange(value);
                        setSelectedInstitutionDepartment(value);
                      }}
                      className="w-full border rounded px-2 py-2"
                      required={extra.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dep => (
                          <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
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
        return null;
      })}
    </div>
  );
}
