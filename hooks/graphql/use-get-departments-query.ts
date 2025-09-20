import { useQuery } from "@apollo/client/react";
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY";
import { Departments } from "@/types/Departments";

export function useGetDepartmentsQuery(options?: useQuery.Options<Departments>): useQuery.Result<Departments> {
  return useQuery<Departments>(GET_DEPARTMENTS_QUERY, options);
}
