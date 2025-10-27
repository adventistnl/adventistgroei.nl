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
  // Validar se o ID está definido antes de executar a consulta
  if (!variables.id) {
    console.warn("useGetRoleByIdQuery chamado sem um ID válido.");
    return { data: null, loading: false, error: null };
  }

  console.log("🔍 Executing useGetRoleByIdQuery with variables:", variables);

  return useQuery<Role, Variables>(GET_ROLE_BY_ID_QUERY, {
    variables,
    ...options,
  });
}
