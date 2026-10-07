import { useQuery } from "@apollo/client/react";
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY";
import { Users } from "@/types/Users";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";

export function useGetAllUsersQuery(
  options?: useQuery.Options<Users>,
): useQuery.Result<Users> {
  return useProtectedQuery<Users>(
    GET_ALL_USERS_QUERY,
    [PermissionResolverName.Users],
    options,
  );
}
