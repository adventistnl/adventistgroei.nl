import { useMemo } from "react";
import { useCreateDepartmentMutation, useGetDepartmentsQuery } from "@/hooks/graphql/use-departments";
import { Departments_departments } from "@/types/Departments";
import { ApolloCache, ErrorLike } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CreateDepartment, CreateDepartmentVariables } from "@/types/CreateDepartment";

interface iDepartments {
  departments: Departments_departments[];
  loading: boolean;
  error: ErrorLike | undefined;
  createDepartment: useMutation.MutationFunction<CreateDepartment, CreateDepartmentVariables, ApolloCache>
}

export function useDepartments(): iDepartments {
  const { data, loading, error } = useGetDepartmentsQuery();
  const [ createDepartment ] = useCreateDepartmentMutation();

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
    createDepartment
  };
}
