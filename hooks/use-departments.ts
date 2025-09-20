import { useMemo } from "react";
import { useGetDepartmentsQuery } from "@/hooks/graphql/use-get-departments-query";
import { Departments_departments } from "@/types/Departments";
import { ErrorLike } from "@apollo/client";

interface iDepartments {
  departments: Departments_departments[];
  loading: boolean;
  error: ErrorLike | undefined;
}

export function useDepartments(): iDepartments {
  const { data, loading, error } = useGetDepartmentsQuery();
  const departments = useMemo(() => {
    if (!data || !data.departments) {
      return [];
    }
    return (data.departments as (Departments_departments | undefined)[]).filter(
      (department): department is Departments_departments => !!department
    );
  }, [data]);

  return {
    departments,
    loading,
    error,
  };
}
