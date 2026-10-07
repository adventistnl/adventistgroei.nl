import { GET_ALL_PERMISSIONS_QUERY } from "@/graphql/queries/PERMISSIONS_QUERY";
import { Permissions } from "@/types/Permissions";
import { useQuery } from "@apollo/client/react";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";

export function useGetAllPermissionsQuery(
  options?: useQuery.Options<Permissions>,
): useQuery.Result<Permissions> {
  return useProtectedQuery<Permissions>(
    GET_ALL_PERMISSIONS_QUERY,
    [PermissionResolverName.Permissions],
    { ...options, fetchPolicy: "cache-first" },
  );
}
