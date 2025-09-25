import { useQuery } from "@apollo/client/react";
import { GET_ALL_ROLES_QUERY, GET_ROLE_BY_ID_QUERY } from "@/graphql/queries/GET_ROLES_QUERY";
import { Roles } from "@/types/Roles";
import { Role } from "@/types/Role";

export function useGetAllRolesQuery(options?: useQuery.Options<Roles>): useQuery.Result<Roles> {
  return useQuery<Roles>(GET_ALL_ROLES_QUERY, options);
}

export interface Variables {
  id?: string;
}
export function useGetRoleByIdQuery(
  variables: Variables,
  options?: useQuery.Options<Role, Variables>
) {
  return useQuery<Role, Variables>(GET_ROLE_BY_ID_QUERY, {
    variables,
    skip: !variables.id,
    ...options,
  });
}
