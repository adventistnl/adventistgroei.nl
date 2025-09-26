import { useMemo } from "react";
import { useInstitution } from "@/contexts/institution-context";

export interface IInstitutionKPIs {
  totalRegions: number;
  totalChurches: number;
  totalDepartments: number;
  totalUsers: number;
}

export function useInstitutionKPI() {
  const { activeInstitution } = useInstitution();

  return useMemo<IInstitutionKPIs>(() => {
    if (!activeInstitution) {
      return {
        totalRegions: 0,
        totalChurches: 0,
        totalDepartments: 0,
        totalUsers: 0,
      };
    }
    return {
      totalRegions: activeInstitution.regions_count || 0,
      totalChurches: activeInstitution.churches_count || 0,
      totalDepartments: activeInstitution.departments_count || 0,
      totalUsers: activeInstitution.users_count || 0,
    };
  }, [activeInstitution]);
}
