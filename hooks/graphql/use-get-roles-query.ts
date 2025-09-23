import { useQuery } from "@apollo/client/react";
import { GET_ALL_ROLES_QUERY, GET_ROLE_BY_ID_QUERY } from "@/graphql/queries/GET_ROLES_QUERY";
import { Roles } from "@/types/Roles";
import { Role } from "@/types/Role";

export function useGetAllRolesQuery(options?: useQuery.Options<Roles>): useQuery.Result<Roles> {
  return useQuery<Roles>(GET_ALL_ROLES_QUERY, options);
}

export function useGetRoleByIdQuery(
  variables: { id: string },
  options?: useQuery.Options<Role, { id: string }>
) {
  return useQuery<Role, { id: string }>(GET_ROLE_BY_ID_QUERY, {
    variables,
    ...options,
  });
}
