import { useMemo } from "react";
import { useInstitution } from "@/contexts/institution-context";

export interface IInstitutionKPIs {
  totalRegions: number;
  totalChurches: number;
  totalDepartments: number;
  totalUsers: number;
}

export function useInstitutionKPI() {
  const { currentInstitutionData } = useInstitution();

  return useMemo<IInstitutionKPIs>(() => {
    if (!currentInstitutionData) {
      return {
        totalRegions: 0,
        totalChurches: 0,
        totalDepartments: 0,
        totalUsers: 0,
      };
    }
    return {
      totalRegions: currentInstitutionData.regions_count || 0,
      totalChurches: currentInstitutionData.churches_count || 0,
      totalDepartments: currentInstitutionData.departments_count || 0,
      totalUsers: currentInstitutionData.users_count || 0,
    };
  }, [currentInstitutionData]);
}
