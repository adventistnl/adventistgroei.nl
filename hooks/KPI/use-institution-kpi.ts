import { useMemo } from "react";
import { InstitutionById_institution } from "@/types/InstitutionById";

export interface IInstitutionKPIs {
  totalChurches: number;
  totalDepartments: number;
  totalUsers: number;
}

export function useInstitutionKPI(currentInstitutionData: InstitutionById_institution | null) : IInstitutionKPIs {
  return useMemo<IInstitutionKPIs>(() => {
    if (!currentInstitutionData) {
      return {
        totalChurches: 0,
        totalDepartments: 0,
        totalUsers: 0,
      };
    }
    return {
      totalChurches: currentInstitutionData.churches_count || 0,
      totalDepartments: currentInstitutionData.departments_count || 0,
      totalUsers: currentInstitutionData.users_count || 0,
    };
  }, [currentInstitutionData]);
}
