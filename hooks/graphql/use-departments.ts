import { useMutation, useQuery } from "@apollo/client/react";
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY";
import { Departments } from "@/types/Departments";
import {
  CreateDepartment,
  CreateDepartmentVariables,
} from "@/types/CreateDepartment";
import {
  CREATE_DEPARTMENT_MUTATION,
  UPDATE_DEPARTMENT_MUTATION,
  DELETE_DEPARTMENT_MUTATION,
} from "@/graphql/mutations/DEPARTMENT_MUTATIONS";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";

export function useGetDepartmentsQuery(
  options?: useQuery.Options<Departments>,
): useQuery.Result<Departments> {
  return useProtectedQuery<Departments>(
    GET_DEPARTMENTS_QUERY,
    [PermissionResolverName.Departments],
    options,
  );
}

export function useCreateDepartmentMutation(
  options?: useMutation.Options<CreateDepartment, CreateDepartmentVariables>,
): useMutation.ResultTuple<CreateDepartment, CreateDepartmentVariables> {
  return useMutation<CreateDepartment, CreateDepartmentVariables>(
    CREATE_DEPARTMENT_MUTATION,
    options,
  );
}

export function useUpdateDepartmentMutation(
  options?: useMutation.Options<any, any>,
) {
  return useMutation(UPDATE_DEPARTMENT_MUTATION, options);
}

export function useDeleteDepartmentMutation(
  options?: useMutation.Options<any, any>,
) {
  return useMutation(DELETE_DEPARTMENT_MUTATION, options);
}
