import { useQuery } from "@apollo/client/react";
import { GET_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY";
import { Roles } from "@/types/Roles";

export function useGetRolesQuery(options?: useQuery.Options<Roles>): useQuery.Result<Roles> {
  return useQuery<Roles>(GET_ROLES_QUERY, options);
}
