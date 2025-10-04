import { useMutation, useQuery } from "@apollo/client/react";
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY";
import { Departments } from "@/types/Departments";
import { CreateDepartment, CreateDepartmentVariables } from "@/types/CreateDepartment";
import { CREATE_DEPARTMENT_MUTATION } from "@/graphql/mutations/DEPARTMENT_MUTATIONS";

export function useGetDepartmentsQuery(options?: useQuery.Options<Departments>): useQuery.Result<Departments> {
  return useQuery<Departments>(GET_DEPARTMENTS_QUERY, options);
}

export function useCreateDepartmentMutation(options?: useMutation.Options<CreateDepartment, CreateDepartmentVariables>): useMutation.ResultTuple<CreateDepartment, CreateDepartmentVariables> {
  return useMutation<CreateDepartment, CreateDepartmentVariables>(CREATE_DEPARTMENT_MUTATION, options);
}